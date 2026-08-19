"""
Build the companion overview document for the laboratory.

The full specification is deliberately exhaustive and is aimed at the developer.
This shorter document contains only what the Unit Incharge needs in order to
understand, correct and approve the design: the executive summary, the purpose
and people and scope, the corrected workflow and lifecycle, the benefits, and
the questions he is being asked to answer. It is a strict SUBSET of the full
specification — no statement appears here that is not in the full document — so
the two can never disagree.

Usage: python make_brief.py <parts_dir> <out.md>
"""
import os
import re
import sys

from assemble import clean, PAGEBREAK


def section_slice(text, start_pattern, end_pattern=None):
    """Return the span from the heading matching start_pattern to the next part."""
    start = re.search(start_pattern, text, re.M)
    if not start:
        return ""
    tail = text[start.start():]
    if end_pattern:
        end = re.search(end_pattern, tail[1:], re.M)
        if end:
            return tail[: end.start() + 1]
    return tail


def main():
    parts_dir, out_path = sys.argv[1], sys.argv[2]

    def read(name):
        with open(os.path.join(parts_dir, name), encoding="utf-8") as fh:
            return fh.read()

    chunks = []

    def add(part_title, body):
        if not body.strip():
            return
        if chunks:
            chunks.append(PAGEBREAK)
        chunks.append("## %s" % part_title)
        chunks.append(body.strip("\n"))

    add("Executive Summary — Read This First", clean(read("front_matter.md")))
    add("Part A — Purpose, People and Scope", clean(read("section_1_foundation.md"), "A"))
    add("Part B — How the Laboratory Will Work", clean(read("section_2_workflow.md"), "B"))

    # "What this buys the lab" lives at the end of the technical section; it is
    # written in the scientist's language, so it belongs in this document too.
    benefits = section_slice(read("section_5_nfr_plan.md"), r"^##\s+29\.\s")
    add("What This Buys the Laboratory", clean(benefits))

    # Appendix A (the original note) and Appendix B (the question register).
    appendix = read("appendix.md")
    a_and_b = section_slice(appendix, r"^##\s+Appendix A\b", r"^##\s+Appendix C\b")
    add("Appendices", clean(a_and_b))

    doc = "\n\n".join(chunks) + "\n"
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(doc)

    print("wrote %s" % out_path)
    print("  words        %d" % len(doc.split()))
    print("  headings     %d" % len(re.findall(r"^#{2,6}\s+", doc, flags=re.M)))
    print("  open qs      %d" % len(set(re.findall(r"OPEN-Q-[A-Z]\d+", doc))))


if __name__ == "__main__":
    main()
