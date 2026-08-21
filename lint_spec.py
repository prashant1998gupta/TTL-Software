"""
Mechanical consistency checks on the assembled specification.

These are the defects that can be found by counting rather than by judgement,
so they are checked here rather than spent on a reviewer's attention:

  * a requirement id defined more than once, with different text
  * a requirement id referenced but never defined
  * an open question referenced but never defined
  * a markdown table whose rows disagree on column count
  * a numbering-format example that does not match its own format string
  * a question already marked ANSWERED that is still described as open, and a
    stated count of open questions that disagrees with the document itself
  * a figure quoted in README.md that has drifted from the document it describes

Usage: python lint_spec.py <spec.md>
Exit status is 0 always; this reports, it does not gate.
"""
import collections
import re
import sys

# Requirement id shapes used across the document.
# The trailing [a-z]? catches the letter-suffixed ids used when a requirement
# had to be split after its neighbours' numbers were already cross-referenced
# (M21-31a, M17-13c). Without it those requirements are invisible to the lint.
ID_RE = re.compile(r"\b((?:M\d{1,2}|WF|NFR|ARC|DB|PLN|AC|P|S|N)-\d{1,3}[a-z]?)\b")
# Letter suffix for a question split off a numbered one (OPEN-Q-B12a).
QID_RE = re.compile(r"\b(OPEN-Q-[A-Z]\d+[a-z]?)\b")
# A definition is the id at line start, optionally carrying a status phrase
# such as "— ANSWERED", then a colon.
QDEF_RE = re.compile(r"^[>\s]*\*{0,2}(OPEN-Q-[A-Z]\d+[a-z]?)\*{0,2}(?:\s*[—–-]+\s*[A-Za-z ]{0,20})?\*{0,2}\s*[:.]")


def load(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read().split("\n")


def is_divider(line):
    return bool(re.match(r"^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$", line)) and "-" in line


def check_ids(lines):
    """A definition is an id in the first cell of a table row, or bolded at line start."""
    defined = collections.defaultdict(list)
    referenced = collections.defaultdict(list)

    for num, line in enumerate(lines, 1):
        stripped = line.strip()
        first_cell, other_cells = "", ""
        if stripped.startswith("|"):
            cells = [c.strip() for c in stripped.strip("|").split("|")]
            if cells:
                first_cell = cells[0]
                other_cells = " | ".join(cells[1:])

        # A definition has the id at the very start of the first cell, allowing
        # for bold or code emphasis ("| M13-10 |", "| **AC-01** |"). A
        # permission-matrix row that merely labels a rule
        # ("| Segregation-of-duties override (M13-10) | ...") mentions the id
        # mid-cell and is a reference, not a definition.
        cell_head = re.sub(r"^[*`_\s]+", "", first_cell) if first_cell else ""
        m_def = ID_RE.match(cell_head) if cell_head else None
        if not m_def:
            # A prose definition: the id in bold at the start of the line, with
            # or without a priority tag inside the bold span —
            # "**M8-69**" or "**M8-69 [MUST]**".
            if re.match(r"^\*\*[A-Z]{1,3}\d{0,2}-\d{1,3}[a-z]?(\s*\[(MUST|SHOULD|LATER|MAY)\])?\*\*", stripped):
                m_def = ID_RE.search(stripped)

        if m_def:
            defined[m_def.group(1)].append((num, stripped[:150]))
            # Scan the rest of the row for references. Slice the cell list, not
            # the raw line: m_def's offsets belong to the emphasis-stripped
            # cell, so applying them to the raw line would cut a token in half.
            rest = other_cells if other_cells else cell_head[m_def.end():]
        else:
            rest = stripped
        for m in ID_RE.finditer(rest):
            referenced[m.group(1)].append(num)

    dupes = {k: v for k, v in defined.items() if len(v) > 1}
    undefined = {k: v for k, v in referenced.items() if k not in defined}
    return defined, dupes, undefined


def check_questions(lines):
    defined, referenced = {}, collections.defaultdict(list)
    dupes = collections.defaultdict(list)
    for num, line in enumerate(lines, 1):
        stripped = line.strip()
        m = QDEF_RE.match(stripped)
        if m:
            if m.group(1) in defined:
                dupes[m.group(1)].append(num)
            defined.setdefault(m.group(1), num)
        elif stripped.startswith("|"):
            cells = [c.strip() for c in stripped.strip("|").split("|")]
            m2 = QID_RE.search(cells[0]) if cells else None
            if m2 and len(cells) > 1 and len(cells[1]) > 20:
                defined.setdefault(m2.group(1), num)
        for m3 in QID_RE.finditer(stripped):
            referenced[m3.group(1)].append(num)
    undefined = {k: v for k, v in referenced.items() if k not in defined}
    return defined, undefined, dupes


def check_tables(lines):
    """Report tables whose body rows disagree with the header's column count."""
    problems = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if "|" in line and i + 1 < len(lines) and is_divider(lines[i + 1]):
            header = [c for c in line.strip().strip("|").split("|")]
            width = len(header)
            start = i + 1
            i += 2
            rows = 0
            for j in range(i, len(lines)):
                if not lines[j].strip() or "|" not in lines[j]:
                    break
                if is_divider(lines[j]):
                    continue
                rows += 1
                got = len(lines[j].strip().strip("|").split("|"))
                if got != width:
                    problems.append((j + 1, width, got, lines[j].strip()[:110]))
                i = j + 1
            if rows == 0:
                problems.append((start, width, 0, "table has a header but no data rows"))
        else:
            i += 1
    return problems


def check_number_formats(lines):
    """
    Where a row gives both a format string and an example, check they agree in
    shape: same number of '/'-separated groups and same literal prefix.
    """
    problems = []
    token = re.compile(r"^[A-Z0-9nYyXx/\-]{6,}$")
    for num, line in enumerate(lines, 1):
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip().strip("*` ") for c in line.strip().strip("|").split("|")]
        cands = [c for c in cells if token.match(c) and "/" in c]
        if len(cands) < 2:
            continue
        fmt, example = cands[0], cands[1]
        if fmt.count("/") != example.count("/"):
            problems.append((num, fmt, example, "group count differs"))
            continue
        f_head, e_head = fmt.split("/")[0], example.split("/")[0]
        if f_head.isalpha() and e_head.isalpha() and f_head != e_head:
            problems.append((num, fmt, example, "literal prefix differs"))
    return problems


# Phrases that assert a question is still open. Used only on lines that
# reference a question already marked ANSWERED elsewhere.
STILL_OPEN_RE = re.compile(
    r"remains? open|still open|not yet (?:been )?answered|awaiting an answer"
    r"|must be (?:answered|confirmed|settled)|to be (?:answered|confirmed|settled)"
    r"|one question remains|should settle it in writing"
    r"|working assumption is|rather than assumed",
    re.IGNORECASE)

# "**110 questions marked OPEN-Q**", and the optional breakdown that follows it.
STATED_TOTAL_RE = re.compile(r"\*{0,2}(\d{1,4})\s+questions marked OPEN-Q")
STATED_OPEN_RE = re.compile(r"leaving\s+\*{0,2}(\d{1,4})\s+open")


def check_answered(lines, qdefined):
    """
    Two ways a settled question silently reverts to an open one.

    (a) A question is marked ANSWERED at its definition, but some other passage
        still tells the reader it is unresolved. This is what happens when an
        answer lands in the body and the executive summary is not revisited.
    (b) A passage states how many questions are open. That number is written by
        hand and goes stale the moment a question is answered, so it is checked
        against the document rather than trusted.
    """
    answered = set()
    for num, line in enumerate(lines, 1):
        stripped = line.strip()
        m = QID_RE.search(stripped)
        if m and re.search(r"\bANSWERED\b", stripped[:m.end() + 40]):
            answered.add(m.group(1))

    stale = []
    for num, line in enumerate(lines, 1):
        stripped = line.strip()
        for m in QID_RE.finditer(stripped):
            qid = m.group(1)
            if qid in answered and num != qdefined.get(qid) and qid not in stripped[:m.start()]:
                if STILL_OPEN_RE.search(stripped) and "ANSWERED" not in stripped:
                    stale.append((num, qid, stripped[:110]))
                    break

    counts = []
    n_answered = len(answered)
    for num, line in enumerate(lines, 1):
        m = STATED_TOTAL_RE.search(line)
        if m and int(m.group(1)) != len(qdefined):
            counts.append((num, "total", int(m.group(1)), len(qdefined)))
        m2 = STATED_OPEN_RE.search(line)
        if m2 and int(m2.group(1)) != len(qdefined) - n_answered:
            counts.append((num, "open", int(m2.group(1)), len(qdefined) - n_answered))
    return answered, stale, counts



def check_readme(spec_text, defined_ids, qdefined, answered):
    """
    The README is the repository's front door and quotes figures from the
    specification. Those figures drift silently every time the document grows,
    and a wrong number there is the first thing a reader sees. Check the claims
    against the document rather than trusting them.
    """
    problems = []
    try:
        with open("README.md", encoding="utf-8") as fh:
            readme = fh.read()
    except OSError:
        return problems

    words = len(spec_text.split())

    m = re.search(r"([\d,]+) words, ([\d,]+) requirements", readme)
    if m:
        claimed_w = int(m.group(1).replace(",", ""))
        claimed_r = int(m.group(2).replace(",", ""))
        # Word counts move with every edit; allow 1%, but ids must be exact.
        if abs(claimed_w - words) > words * 0.01:
            problems.append("word count: README says %s, document has %s"
                            % (f"{claimed_w:,}", f"{words:,}"))
        if claimed_r != len(defined_ids):
            problems.append("requirement count: README says %s, document defines %d"
                            % (f"{claimed_r:,}", len(defined_ids)))

    m = re.search(r"There are (\d+) such questions; (\w+) (?:are|is) answered", readme)
    if m:
        words_to_num = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6,
                        "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12}
        if int(m.group(1)) != len(qdefined):
            problems.append("question count: README says %s, document defines %d"
                            % (m.group(1), len(qdefined)))
        claimed_a = words_to_num.get(m.group(2).lower())
        if claimed_a is not None and claimed_a != answered:
            problems.append("answered count: README says %s, document marks %d answered"
                            % (m.group(2), answered))

    for m in re.finditer(r"All (\w+) (?:lint )?checks (?:must|should) report zero", readme):
        words_to_num = {"five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9}
        n = words_to_num.get(m.group(1).lower())
        if n is not None and n != 9:
            problems.append('lint-check count: README says "%s", this script runs 9'
                            % m.group(1))
    return problems


def main():
    path = sys.argv[1]
    lines = load(path)

    defined, dupes, undefined = check_ids(lines)
    qdefined, qundefined, qdupes = check_questions(lines)
    tables = check_tables(lines)
    formats = check_number_formats(lines)
    answered, stale_q, bad_counts = check_answered(lines, qdefined)
    readme = check_readme("\n".join(lines), defined, qdefined, len(answered))

    print("SPEC LINT — %s" % path)
    print("  lines %d | requirement ids defined %d | open questions defined %d (%d answered, %d open)"
          % (len(lines), len(defined), len(qdefined), len(answered),
             len(qdefined) - len(answered)))
    print()

    print("1. Requirement ids defined more than once: %d" % len(dupes))
    for k in sorted(dupes)[:15]:
        print("   %s" % k)
        for num, text in dupes[k][:3]:
            print("      L%-6d %s" % (num, text))
    print()

    print("2. Requirement ids referenced but never defined: %d" % len(undefined))
    for k in sorted(undefined)[:25]:
        print("   %-10s first referenced at L%d" % (k, undefined[k][0]))
    print()

    print("3a. Open questions DEFINED MORE THAN ONCE: %d" % len(qdupes))
    for k in sorted(qdupes):
        print("   %-14s first at L%d, again at L%s" % (k, qdefined[k], qdupes[k]))
    print()

    print("3b. Open questions referenced but never defined: %d" % len(qundefined))
    for k in sorted(qundefined)[:15]:
        print("   %-14s referenced at L%s" % (k, qundefined[k][:4]))
    print()

    print("4. Table rows with a wrong column count: %d" % len(tables))
    for num, want, got, text in tables[:15]:
        print("   L%-6d expected %d cols, got %d | %s" % (num, want, got, text))
    print()

    print("5. Numbering examples inconsistent with their format: %d" % len(formats))
    for num, fmt, example, why in formats[:15]:
        print("   L%-6d %s vs %s (%s)" % (num, fmt, example, why))
    print()

    print("6a. Answered questions still described as open: %d" % len(stale_q))
    for num, qid, text in stale_q[:15]:
        print("   L%-6d %-14s %s" % (num, qid, text))
    print()

    print("6b. Stated question counts that disagree with the document: %d" % len(bad_counts))
    for num, kind, said, actual in bad_counts[:15]:
        print("   L%-6d says %d %s, document has %d" % (num, said, kind, actual))


    print()
    print("7. README claims that disagree with the document: %d" % len(readme))
    for r in readme:
        print("   %s" % r)


if __name__ == "__main__":
    main()
