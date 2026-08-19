"""
Stitch the authored sections into one specification markdown file.

Normalises heading depth (each authored section is meant to start at '##'),
strips any cover page / table of contents an author added on their own, drops
stray horizontal rules at part boundaries, and inserts page breaks between
major parts so the Word output starts each part on a fresh page.

Usage: python assemble.py <parts_dir> <out.md>
"""
import os
import re
import sys

# Order matters — this is the document's reading order.
#
# The third field is the open-question prefix. The five sections were authored
# independently and each numbered its own questions from 1, so OPEN-Q6 meant
# four different things. Prefixing per part makes every identifier unique
# without renumbering anything an author wrote. Section 5 already anticipated
# the merge and used OPEN-Q-T<n>, so it needs no prefix.
PARTS = [
    ("front_matter.md",                 "Executive Summary — Read This First",       None),
    ("section_1_foundation.md",         "Part A — Purpose, People and Scope",        "A"),
    ("section_2_workflow.md",           "Part B — How the Laboratory Will Work",     "B"),
    ("section_3_functional_core.md",    "Part C — The Testing Modules (M1–M10)",     "C"),
    ("section_4_functional_support.md", "Part D — The Supporting Modules (M11–M22)", "D"),
    ("section_5_nfr_plan.md",           "Part E — Build, Test and Roll Out",         None),
    ("appendix.md",                     "Appendices",                                None),
]

PAGEBREAK = "<<<PAGEBREAK>>>"


def clean(text, q_prefix=None):
    """Tidy an authored markdown section."""
    if not text:
        return ""
    t = text.replace("\r\n", "\n")

    # Make open-question ids unique across parts. 'OPEN-Q6' -> 'OPEN-Q-C6'.
    # The digit anchor means an already-prefixed id such as OPEN-Q-T7 is left
    # alone, and every in-section cross-reference is rewritten with it.
    if q_prefix:
        t = re.sub(r"OPEN-Q(\d+)", r"OPEN-Q-%s\1" % q_prefix, t)

    # Strip a leading fenced block if the author wrapped the whole answer.
    t = re.sub(r"\A\s*```(?:markdown|md)?\s*\n", "", t)
    t = re.sub(r"\n```\s*\Z", "\n", t)

    lines = t.split("\n")
    out = []
    skipping_toc = False
    for line in lines:
        s = line.strip()

        # Drop an author-added table of contents block.
        if re.match(r"^#{1,3}\s*(table of contents|contents)\s*$", s, re.I):
            skipping_toc = True
            continue
        if skipping_toc:
            if re.match(r"^#{1,6}\s+", s):
                skipping_toc = False
            else:
                continue

        # Drop author-added document titles / cover lines.
        if re.match(r"^#\s+", s) and re.search(
            r"software requirements|specification|srs|document|silk testing laboratory",
            s, re.I,
        ):
            continue

        out.append(line)

    t = "\n".join(out)

    # Demote a stray single '#' heading to '##' so depth stays consistent.
    t = re.sub(r"^#\s+(?!#)", "## ", t, flags=re.M)

    # Push every authored heading down one level. Authors write their top
    # heading as '##'; the part title injected below occupies that level, so
    # this keeps Part > Section > Sub-section nesting in the Word contents page.
    t = re.sub(r"^(#{2,5})(\s+)", lambda m: "#" + m.group(1) + m.group(2), t, flags=re.M)

    # Collapse runs of blank lines and trailing whitespace.
    t = re.sub(r"[ \t]+$", "", t, flags=re.M)
    t = re.sub(r"\n{4,}", "\n\n\n", t)

    # Remove leading/trailing horizontal rules that would double up at seams.
    t = re.sub(r"\A(\s*(-{3,}|\*{3,})\s*\n)+", "", t)
    t = re.sub(r"(\n\s*(-{3,}|\*{3,})\s*)+\Z", "\n", t)

    return t.strip("\n")


def main():
    parts_dir, out_path = sys.argv[1], sys.argv[2]
    chunks = []
    report = []

    for filename, part_title, q_prefix in PARTS:
        path = os.path.join(parts_dir, filename)
        if not os.path.exists(path):
            report.append("  MISSING  %s" % filename)
            continue
        with open(path, encoding="utf-8") as fh:
            text = clean(fh.read(), q_prefix)
        if not text:
            report.append("  EMPTY    %s" % filename)
            continue

        if chunks:
            chunks.append(PAGEBREAK)
        if part_title:
            chunks.append("## %s" % part_title)
        chunks.append(text)
        report.append("  ok       %-34s %7d words" % (filename, len(text.split())))

    doc = "\n\n".join(chunks) + "\n"
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(doc)

    headings = len(re.findall(r"^#{2,6}\s+", doc, flags=re.M))
    tables = len(re.findall(r"^\s*\|.*\|\s*$", doc, flags=re.M))
    reqs = len(set(re.findall(r"\b((?:M\d{1,2}|WF|NFR|ARC|DB|PLN|AC|OPEN-Q)-?\d{1,3})\b", doc)))
    print("\n".join(report))
    print("\nwrote %s" % out_path)
    print("  words        %d" % len(doc.split()))
    print("  headings     %d" % headings)
    print("  table lines  %d" % tables)
    print("  distinct requirement/question ids  %d" % reqs)


if __name__ == "__main__":
    main()
