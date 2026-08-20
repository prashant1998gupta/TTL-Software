# Silk Testing Laboratory Management System — Specification

Documentation for a Laboratory Information Management System (LIMS) for the
**Regional Silk Technological Research Station / Silk Conditioning & Testing House, Dharmavaram**,
Andhra Pradesh — a unit of the Central Silk Technological Research Institute (CSTRI) under the
Central Silk Board, Ministry of Textiles.

The laboratory is accredited to **ISO/IEC 17025:2017** (NABL certificate `NABLT0726AD18713`,
valid 17/07/2026 to 16/07/2030), so the compliance requirements in this specification are
obligations rather than good practice.

The repository holds two things: the **specification** in `parts/`, and the **working Phase 1
core** in `app/` — the Limited Test path end to end. A sample registered at the counter gets a
gap-free number; the tester enters twenty skein weights on a keyboard-first bench screen against
a calibration-checked balance; a second person verifies (the system refuses the tester's own
verification); the Unit In-Charge signs; the issued certificate is a digitally signed, PDF/UA-
conformant file frozen with its SHA-256; and the QR code on it answers GENUINE — CURRENT or
GENUINE — WITHDRAWN on a physically separate public page. `app/README.md` has the ten-minute
tour. The remaining modules (billing, stock, quality system, portal) are not built.

## Read it online

**https://prashant1998gupta.github.io/TTL-Software/**

No download, no install — it opens in any browser, on a phone or a desktop. The Word documents can be
downloaded from the foot of that page.

## The three documents

| Document | For | Size |
|---|---|---|
| `index.html` — the visual guide, published at the link above | The Unit In-Charge. Start here. | ~20 min read |
| `Silk Testing Laboratory System - Overview for the Lab.docx` | The laboratory, as a circulable Word file | 44,000 words |
| `Silk Testing Laboratory System - Full Specification.docx` | The developer | 191,000 words, 1,280 requirements |

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

All eight lint checks must report zero. Everything is generated from `parts/`.

**The document component** — needs Node 20 or later:

```bash
cd app && npm install && npm test
```

Nine tests. The fonts are vendored in `app/vendor/fonts/`, so nothing is fetched.

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
open questions referenced but never defined, malformed table rows, and numbering examples that
contradict their own format string. All five checks should report zero.

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

app/                    the application — currently the document component only
  README.md             what PDF/UA conformance actually required, and how it was proven
  src/documents/
    document.js         creates a document that can pass PDF/UA (title, language, XMP)
    shaping.mjs         HarfBuzz shaping; stock fontkit THROWS on Telugu with these fonts
    indic-text.js       /ActualText so Indic text survives into the text layer
    sign.js             PAdES B-B, invisible signature
    cidset-workaround.js  ARC-49
    golden.mjs          PLN-28's golden shaping capture
  test/                 nine tests, including veraPDF conformance signed and unsigned
  vendor/fonts/         Noto Sans, Noto Sans Telugu, Noto Sans Devanagari (SIL OFL 1.1)
```

## How this was produced

An initial ten-point discussion note (reproduced verbatim in Appendix A) was expanded into a full
specification. Domain facts were researched against 259 sources rather than assumed, and the
research briefs in `parts/research_*.md` mark their own confidence — verified, inferred, or
unverified. Where a fact could not be established, the document raises an **OPEN-Q** with a
recommended default instead of asserting it. There are 110 such questions; seven are answered.

The draft was then reviewed adversarially. 129 findings were raised, each serious one independently
re-checked — 42 were rejected as misreadings and 73 confirmed and applied, followed by a second pass
closing 71 cross-file inconsistencies.

## Status and next step

**Phase 0** — two days at the counter and the bench, watching the real process and collecting one
filled copy of every form and register in use. Then the questions in the visual guide's
*Over to you* section. The specification's own working assumptions about how the laboratory
operates today are marked as assumptions and exist to be corrected.
