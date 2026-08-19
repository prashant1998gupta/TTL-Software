"""
Build compact digests of the assembled specification for the review agents.

The full document is far too large to hand a single reviewer, so this pulls out
the two things cross-section review actually needs:

  digest_definitions.txt — headings, settled entity names, state names,
      numbering formats and role names, so a reviewer can spot two sections
      defining the same concept differently.

  digest_claims.txt — every line carrying a checkable factual claim (a standard
      reference, a statute, a percentage, a rupee amount, a temperature, a
      duration, a legal clause), so a reviewer can check each against the
      research briefs and catch anything asserted as fact that was only ever
      inferred or unverified.

Usage: python make_digest.py <spec.md> <out_dir>
"""
import os
import re
import sys

CLAIM_PATTERNS = [
    r"\bIS\s?\d{3,5}\b",                      # Indian Standard references
    r"\bISO(?:/IEC)?\s?\d+",                  # ISO / ISO-IEC references
    r"\bASTM\s?[A-Z]?\d+",
    r"\bNABL\s?\d{3}\b",
    r"\bTC-\d{4,5}\b",
    r"\bclause\s+\d+(?:\.\d+)*",              # standard clauses
    r"\bAct,?\s*\d{4}\b",                     # statutes
    r"\bSection\s+\d+[A-Z]?\b",
    r"\bSAC\s?\d+",
    r"\bHSN\b",
    r"\d+(?:\.\d+)?\s*(?:per\s?cent|%)",      # percentages
    r"₹\s?[\d,]+",                            # money
    r"\bRs\.?\s?[\d,]+",
    r"\d+\s*±\s*\d+",                         # tolerances, e.g. 27 ± 2
    r"\d+\s*°\s?C",                           # temperatures
    r"\b\d{1,3}\s*(?:working\s+)?days?\b",    # turnaround claims
    r"\b(?:GST|CGST|SGST|IGST)\b",
    r"\bDPDP\b",
    r"\bIT\s+Act\b",
    r"\bBharatkosh\b|\bNTRP\b",
    r"\bDigiLocker\b",
]
CLAIM_RE = re.compile("|".join(CLAIM_PATTERNS), re.I)

DEF_PATTERNS = [
    r"^#{2,6}\s+",                            # every heading
    r"\bwe will use\b|\bwill be called\b|\bstop using\b|\bretired\b",
    r"\bmeans\b.{0,120}$",
    r"^\|\s*\*{0,2}(?:State|Status)\b",
    r"[A-Z]{2,4}/\d",                         # numbering format samples
    r"\bformat\b.*\|",
    r"\bOPEN-Q\d+",
]
DEF_RE = re.compile("|".join(DEF_PATTERNS), re.I | re.M)


def main():
    spec_path, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    with open(spec_path, encoding="utf-8") as fh:
        lines = fh.read().split("\n")

    part = "(front)"
    defs, claims = [], []
    for num, line in enumerate(lines, 1):
        stripped = line.strip()
        if not stripped:
            continue
        if re.match(r"^##\s+(Part\s|Appendic)", stripped):
            part = stripped.lstrip("#").strip()
        tag = "%s | L%d" % (part, num)

        if DEF_RE.search(line):
            defs.append("%s :: %s" % (tag, stripped[:400]))
        if CLAIM_RE.search(line):
            claims.append("%s :: %s" % (tag, stripped[:600]))

    for name, rows in (("digest_definitions.txt", defs), ("digest_claims.txt", claims)):
        path = os.path.join(out_dir, name)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write("\n".join(rows))
        print("%-26s %6d lines  %8d chars  (~%d words)"
              % (name, len(rows), sum(len(r) for r in rows) + len(rows),
                 sum(len(r.split()) for r in rows)))


if __name__ == "__main__":
    main()
