"""
Generate the appendices from the assembled specification and the research pack.

Everything here is derived, not written by hand, so an appendix can never drift
out of step with the body of the document.

  Appendix A — the original ten-point discussion note, verbatim.
  Appendix B — the consolidated open-question register, pulled from the body.
  Appendix C — the sources consulted during research.

Usage: python make_appendix.py <spec.md> <parts_dir> <original_note.txt> <out.md>
"""
import os
import re
import sys

PART_NAMES = {
    "A": "Part A — Purpose, People and Scope",
    "B": "Part B — How the Laboratory Will Work",
    "C": "Part C — The Testing Modules (M1–M10)",
    "D": "Part D — The Supporting Modules (M11–M22)",
    "T": "Part E — Build, Test and Roll Out (technical)",
}


def cell(text, limit=520):
    """Flatten arbitrary text so it is safe inside a markdown table cell."""
    t = re.sub(r"\s+", " ", text or "").strip()
    t = t.replace("|", "/")               # a stray pipe would split the row
    t = re.sub(r"^[-*+]\s+", "", t)
    # Drop an emphasis marker left dangling by the split, and balance the rest:
    # an odd number of '**' would leak bold across the remainder of the table.
    t = re.sub(r"^\*+\s*", "", t).strip()
    if t.count("**") % 2:
        t = t.replace("**", "")
    if len(t) > limit:
        t = t[:limit].rsplit(" ", 1)[0] + " …"
    return t


def extract_questions(spec_text):
    """
    Find every open question and split it into the question and its default.

    Authors used two shapes: a bolded inline form ('**OPEN-Q-B3:** question —
    *Recommended default:* ...') and a table-row form where the id sits in the
    first cell and the default in a later one.
    """
    found = {}
    statuses = {}

    # Inline form. Anchored to the start of a line and required to be followed
    # by a colon, so a mid-sentence cross-reference ("see OPEN-Q-A1 to A4
    # below") is not mistaken for the definition itself. The optional phrase
    # before the colon carries a status such as "— ANSWERED"; an answered
    # question stays in the register, with its answer in place of a default.
    for m in re.finditer(
        r"^[>\s]*\*{0,2}(OPEN-Q-[A-Z]\d+[a-z]?)\*{0,2}"
        r"(?:\s*[—–-]+\s*([A-Za-z ]{0,20}?))?\*{0,2}\s*[:.]\s*(.*?)(?=\n\s*\n|\n#{2,}|\Z)",
        spec_text, re.S | re.M,
    ):
        qid, status, blob = m.group(1), (m.group(2) or "").strip(), m.group(3)
        if status:
            statuses[qid] = status
        if qid in found:
            continue
        parts = re.split(r"\*{0,2}Recommended default\*{0,2}\s*[:—-]*", blob, maxsplit=1, flags=re.I)
        question = parts[0]
        default = parts[1] if len(parts) > 1 else ""
        if "|" in question and not default:
            continue          # table row; handled below
        found[qid] = (cell(question), cell(default))

    # Table-row form: | **OPEN-Q-T7** | question | why | who | default | blocking |
    for line in spec_text.split("\n"):
        if "OPEN-Q-" not in line or not line.strip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if not cells:
            continue
        m = re.search(r"(OPEN-Q-[A-Z]\d+[a-z]?)", cells[0])
        if not m:
            continue
        qid = m.group(1)
        question = cells[1] if len(cells) > 1 else ""
        default = cells[4] if len(cells) > 4 else (cells[-2] if len(cells) > 2 else "")
        # A table row is more structured than an inline guess, so it wins.
        if question:
            found[qid] = (cell(question), cell(default))

    def sort_key(qid):
        m = re.match(r"OPEN-Q-([A-Z])(\d+)([a-z]?)", qid)
        letter, num, suffix = m.group(1), int(m.group(2)), m.group(3)
        return (list(PART_NAMES).index(letter) if letter in PART_NAMES else 99,
                num, suffix)

    return sorted(found.items(), key=lambda kv: sort_key(kv[0])), statuses


def extract_sources(parts_dir):
    """Collect every URL cited by the research briefs, de-duplicated."""
    urls = {}
    for name in sorted(os.listdir(parts_dir)):
        if not name.startswith("research_"):
            continue
        with open(os.path.join(parts_dir, name), encoding="utf-8") as fh:
            text = fh.read()
        for raw in re.findall(r"https?://[^\s)\]|<>`\"']+", text):
            url = raw.rstrip(".,;:")
            urls.setdefault(url, set()).add(
                name.replace("research_", "").replace(".md", "").replace("_", " ")
            )
    return sorted(urls.items())


def main():
    spec_path, parts_dir, note_path, out_path = sys.argv[1:5]

    with open(spec_path, encoding="utf-8") as fh:
        spec = fh.read()

    out = []

    # ---- Appendix A
    out.append("## Appendix A — The original discussion note, as written")
    out.append("")
    out.append("This is the ten-point note that started the project, reproduced without "
               "change so that this document is self-contained and the two can be compared "
               "side by side. Every point in it is carried forward; see "
               "*Your ten points, and where each one now lives* in the Executive Summary.")
    out.append("")
    if os.path.exists(note_path):
        with open(note_path, encoding="utf-8") as fh:
            for line in fh.read().split("\n"):
                line = re.sub(r"^\[[^\]]*\]\s*", "", line).rstrip()
                if line:
                    out.append("> " + line)
                    out.append(">")
    out.append("")

    # ---- Appendix B
    questions, statuses = extract_questions(spec)
    out.append("<<<PAGEBREAK>>>")
    out.append("")
    out.append("## Appendix B — Open question register")
    out.append("")
    out.append("Every question in the document that only the laboratory can answer, in one "
               "place. Each has a recommended default, so work is never blocked waiting for "
               "an answer — but a default that goes unchallenged becomes a decision by "
               "accident, so please read them. The identifier letter shows which part raises "
               "the question.")
    out.append("")
    current = None
    for qid, (question, default) in questions:
        letter = re.match(r"OPEN-Q-([A-Z])", qid).group(1)
        if letter != current:
            current = letter
            out.append("")
            out.append("### %s" % PART_NAMES.get(letter, letter))
            out.append("")
            out.append("| ID | Question | Recommended default, or the answer where one is now known |")
            out.append("|---|---|---|")
        label = "**%s**" % qid
        if statuses.get(qid):
            label += " — **%s**" % statuses[qid]
        out.append("| %s | %s | %s |" % (label, question, default or "*see body text*"))
    out.append("")

    # ---- Appendix C
    sources = extract_sources(parts_dir)
    out.append("<<<PAGEBREAK>>>")
    out.append("")
    out.append("## Appendix C — Sources consulted")
    out.append("")
    out.append("The domain facts in this document were researched rather than assumed. "
               "These are the sources used. Where a source could not settle a question, the "
               "document says so and raises an OPEN-Q instead of asserting a fact.")
    out.append("")
    out.append("| # | Source | Used for |")
    out.append("|---|---|---|")
    for i, (url, briefs) in enumerate(sources, 1):
        out.append("| %d | %s | %s |" % (i, cell(url, 200), cell(", ".join(sorted(briefs)))))
    out.append("")

    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(out) + "\n")

    print("wrote %s" % out_path)
    print("  open questions tabulated : %d" % len(questions))
    print("  sources listed           : %d" % len(sources))
    thin = [q for q, (ques, _) in questions if len(ques) < 25]
    if thin:
        print("  WARNING thin question text for: %s" % ", ".join(thin[:12]))


if __name__ == "__main__":
    main()
