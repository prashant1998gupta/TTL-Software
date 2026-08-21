# Silk Testing Laboratory Management System — Specification

Documentation for a Laboratory Information Management System (LIMS) for the
**Regional Silk Technological Research Station / Silk Conditioning & Testing House, Dharmavaram**,
Andhra Pradesh — a unit of the Central Silk Technological Research Institute (CSTRI) under the
Central Silk Board, Ministry of Textiles.

The laboratory is accredited to **ISO/IEC 17025:2017** (NABL certificate `NABLT0726AD18713`,
valid 17/07/2026 to 16/07/2030), so the compliance requirements in this specification are
obligations rather than good practice.

The repository holds two things: the **specification** in `parts/`, and the **working
application** in `app/` — the Limited Test path complete, from a walk-in at the counter to a
scanned QR code. A sample gets a gap-free number continuing the paper register's series; the
tester enters twenty skein weights on a keyboard-first bench screen against a
calibration-checked balance; a second person verifies (the system refuses the tester's own
verification); the Unit In-Charge signs; and the issued certificate is a digitally signed,
PDF/UA-conformant file frozen with its SHA-256, whose QR answers GENUINE — CURRENT,
SUPERSEDED or WITHDRAWN on a physically separate public page. A wrong certificate is
**amended, never edited**: the correction is a new report naming what it supersedes and why,
and the old QR points at the replacement. Administration screens, the monthly sample register
with CSV export, the day sheet, a first-run setup wizard that continues the paper numbering,
and a deploy kit (systemd, backups, a daily integrity check) round it out — installing it is
`app/SETUP.md`, seven steps. The remaining modules (billing, stock, the quality system, the
customer portal) are not built.

## Read it online

**https://prashant1998gupta.github.io/TTL-Software/**

No download, no install — it opens in any browser, on a phone or a desktop. The Word documents can be
downloaded from the foot of that page.

## The three documents

| Document | For | Size |
|---|---|---|
| `index.html` — the visual guide, published at the link above | The Unit In-Charge. Start here. | ~20 min read |
| `Silk Testing Laboratory System - Overview for the Lab.docx` | The laboratory, as a circulable Word file | 45,532 words |
| `Silk Testing Laboratory System - Full Specification.docx` | The developer | 200,649 words, 1,291 requirements |

The overview is a strict subset of the full specification, so the two cannot disagree.
The visual guide is one self-contained file: no external fonts, scripts or images, so it works offline,
survives being emailed, and prints to PDF straight from the browser.

`.nojekyll` is present because GitHub Pages otherwise runs Jekyll, which skips files beginning with an
underscore. It makes Pages serve the repository verbatim.

## Working on this from a fresh machine

Two independent tracks. Neither needs the other.

**The specification** — needs Python 3 and Node:

```bash
npm install && bash build.sh && python3 lint_spec.py SPEC.md
```

All nine lint checks must report zero. Everything is generated from `parts/`.

**The document component** — needs Node 20 or later:

```bash
cd app && npm install && npm test
```

Fifty-two tests. The fonts are vendored in `app/vendor/fonts/`, so nothing is fetched.

**To run the PDF/UA conformance tests** you also need veraPDF and a Java 11+ runtime. Both live
on the build machine only and are never installed on the laboratory server, so they do not
enlarge the dependency tree ARC-16 governs:

```bash
brew install openjdk
```

Download the veraPDF installer from `software.verapdf.org`, install it, then:

```bash
cd app && JAVA_HOME=/opt/homebrew/opt/openjdk VERAPDF=/path/to/verapdf npm test
```

Without `VERAPDF` those two tests **skip loudly** rather than passing — a silent skip would let
a non-conforming certificate ship. `app/README.md` carries the detail of what conformance
required and why each piece is there.

## Building the documents

```bash
npm install
bash build.sh
```

Everything is generated from `parts/`. **Never edit the outputs** — `SPEC.md`, `BRIEF.md`,
`parts/appendix.md`, the `.docx` files and `index.html` are all overwritten on every build.

| Edit this | To change |
|---|---|
| `parts/front_matter.md` | The executive summary |
| `parts/section_1_foundation.md` … `section_5_nfr_plan.md` | The specification body |
| `guide_content.json` | The visual guide's wording |
| `doc_meta.json`, `brief_meta.json`, `guide_meta.json` | Cover pages and document metadata |

Build order matters: the appendices are derived *from* the assembled body, so the body is built
first without an appendix present. `build.sh` handles this.

## Checking your work

```bash
python3 lint_spec.py SPEC.md
```

Reports duplicate requirement identifiers, references to identifiers that were never defined,
open questions defined twice or referenced but never defined, malformed table rows, numbering
examples that contradict their own format string, answered questions still described as open,
stated counts that disagree with the document, and README claims that have drifted from it. All nine checks should report zero.

`python3 _inspect.py <file.docx>` round-trips a generated Word file and reports heading levels,
table width agreement and whether the table-of-contents field is present.

## Repository layout

```
parts/                  the editable sources
  front_matter.md       executive summary
  section_1..5_*.md     the five specification sections
  appendix.md           GENERATED — do not edit
  research_*.md         the five research briefs behind every domain fact, with sources
build.sh                the whole pipeline
assemble.py             stitches the sections, prefixes open-question ids per part
make_appendix.py        derives the appendices from the assembled body
make_brief.py           extracts the laboratory overview as a subset
make_digest.py          builds review digests
build_doc.js            markdown → Word
build_guide.js          content → index.html, the published visual guide
lint_spec.py            consistency checks
fixes/, fixes2/         what the review found and what was changed
review_*.json/.txt      the review audit trail

app/                    the working application (see app/README.md and app/SETUP.md)
  SETUP.md              installing the laboratory server, seven steps
  src/server/           the internal application: counter, bench, verification, issue,
                        amendment, administration, registers, first-run setup
  verify-server.js      the public QR verification service — its own process
  src/documents/        the certificate path: tagged PDF/UA, HarfBuzz Telugu, /ActualText,
                        digital signature, the ARC-49 /CIDSet workaround
  src/calc/             the calculation and grading engine; every constant in configuration
  deploy/               systemd units, backup and restore, the one cron entry point
  test/                 52 tests, including veraPDF conformance signed and unsigned
  vendor/fonts/         Noto Sans, Noto Sans Telugu, Noto Sans Devanagari (SIL OFL 1.1)
```

## How this was produced

An initial ten-point discussion note (reproduced verbatim in Appendix A) was expanded into a full
specification. Domain facts were researched against 259 sources rather than assumed, and the
research briefs in `parts/research_*.md` mark their own confidence — verified, inferred, or
unverified. Where a fact could not be established, the document raises an **OPEN-Q** with a
recommended default instead of asserting it. There are 111 such questions; seven are answered.

The draft was then reviewed adversarially. 129 findings were raised, each serious one independently
re-checked — 42 were rejected as misreadings and 73 confirmed and applied, followed by a second pass
closing 71 cross-file inconsistencies.

## Status and next step

The Limited Test path — about 98 per cent of the unit's samples — runs end to end in `app/`,
twice adversarially reviewed, with 52 tests green. Two things stand between this and issuing a
real certificate, and both need a person, not a program:

**Phase 0** — two days at the counter and the bench, watching the real process and collecting
one filled copy of every form and register in use, plus twenty completed historical worksheets
for the calculation regression suite. The specification's working assumptions about how the
laboratory operates today are marked as assumptions and exist to be corrected — and the data
model's biggest open question, *what counts as one sample*, can only be answered from the paper.

**The signing credential** — certificates are signed with a development key marked NOT FOR
ISSUE until the Central Silk Board provides the laboratory's Document Signer credential
(`LIMS_P12` in `app/SETUP.md`). The open questions register also still awaits written
confirmation that a valid signature, not long-term validation, is what the quality system
requires (OPEN-Q-T31).
