# Document component — proof of the certificate path

**Build this before anything else.** It is the only part of the system whose feasibility was
in doubt, and the part that is hardest to change once certificates have been issued.

Everything else in the LIMS — the register, the workflow, the calibration and competency gates —
exists to make one signed PDF defensible years later. This directory proves that PDF can be
produced correctly in Node.

## What was verified here, by running it

Measured on this machine: Node 24.16, pdfkit 0.19.1, fontkit 2.0.4, harfbuzzjs 1.6.0,
against the **vendored Noto fonts** in `vendor/fonts/`.

**The font decides the answer.** Every finding below came out differently against the macOS
system Telugu fonts than against the Noto fonts the laboratory will actually ship. Anyone
re-checking this work must use the vendored fonts, or they will reach the wrong conclusion.

### 1. fontkit crashes outright on Telugu — CONFIRMED, and it is a hard blocker

```
TypeError: Cannot read properties of null (reading 'xCoordinate')
    at getAnchor (fontkit/dist/main.cjs:9989)
```

Thrown on `ప్రయోగశాల` ("laboratory"), on `శ్రీ` (an honorific in a large share of Indian
names), on `ప్రు`, and on `శ్రీ ధర్మవరం` — the unit's own town.

This is not mis-shaping. It is an **uncaught exception on the report path**: pdfkit cannot
produce the PDF at all. The same strings shape without complaint against macOS system fonts,
which is exactly how this stays hidden until the production font is used.

HarfBuzz shapes all of them cleanly. **`shaping.mjs` is therefore mandatory, not optional.**

### 2. The text layer is wrong by default — CONFIRMED

Written with plain `doc.text()`, then extracted back:

| Written | Extracted | What happened |
|---|---|---|
| `बोर्ड` | `बोरड` | **virama silently dropped** |
| `पट्टु` | `पटु्ट` | reordered |
| `मूर्ति` | `मूरि्त` | reordered |

pdfkit builds its `ToUnicode` map from glyphs *after* shaping, so the text layer records visual
order. The certificate cannot then be searched or copied, and a screen reader reads the wrong
characters — the substance of NFR-70, not a cosmetic detail. **veraPDF passes this happily**,
which is why it needs an assertion of its own.

### 3. The fix — two mechanisms, and both are needed

`shaping.mjs` routes pdfkit through HarfBuzz and attributes each cluster's original codepoints
to its first glyph, so `ToUnicode` is built from logical order. Verified in the emitted CMap:

```
<0c1f 0c4d 0c1f 0c41>   = ట ్ ట ు   — the full ట్టు cluster, logical order
<0930 094d 0921>        = र ् ड     — बोर्ड keeps its virama
```

`indic-text.js` additionally wraps each Indic run in a `Span` carrying `/ActualText`, which a
conforming reader prefers over `ToUnicode`.

**Both are required, because `ToUnicode` alone cannot be complete.** It maps *glyph → string*,
so a glyph that begins two different clusters can carry only one mapping. In `శ్రీ ధర్మవరం` the
glyph `ర` starts both `ర్మ` and `రం`, and one of them is unavoidably lost. That is a structural
limit of the format, not a defect in the bridge — and it is why `ActualText` is authoritative.

The acceptance test asserts the combined guarantee (no character recoverable from neither) and,
separately, that `ToUnicode` carries the viramas **on its own** — because testing only the
combined set would let `ActualText` mask a shaping regression.

### On writing tests that cannot fail

Two of the assertions here passed for the wrong reason before they were fixed, and both are
worth knowing about:

- The cluster regex matched `<hex>` strings in the **page content stream** — the glyph sequence —
  rather than the CMap, so it passed no matter what the map contained. Assertions are now scoped
  to the `bfchar`/`bfrange` sections.
- Checking only the combined `ActualText ∪ ToUnicode` set meant removing cluster attribution
  entirely still passed, because `ActualText` covers every character by itself.

Every assertion in this suite has been verified to **fail** when the code it guards is removed.
Do that again for anything added here — an assertion that cannot fail is worse than none,
because it reads as coverage.

## Fonts are not yet chosen — and this matters

The tests here use macOS system fonts, which are **not licensed for redistribution** and will not
exist on the laboratory's Linux server. Production needs an openly licensed family, almost
certainly **Noto Sans Telugu** and **Noto Sans Devanagari**, vendored into `vendor/fonts/` so the
build works with the line down (ARC-16).

Re-run every check in this directory against those fonts once chosen. Two of the three findings
above are font-dependent.

## PLN-28 — complete

| PLN-28 requirement | Status |
|---|---|
| Rendering throws no exception | **done** — HarfBuzz bridge |
| Every string found in the extracted text layer | **done** — `ActualText` + cluster-level `ToUnicode` |
| Glyph identifiers and advances held as a golden file | **done** — `test/fixtures/shaping-golden.json` |
| `veraPDF -f ua1` passes | **done** — 106/106 rules, `isCompliant="true"` |
| Signature applied; structure tree and byte range survive | **done** — and the **signed** file still passes 106/106 |

Nine tests. Run conformance with:

```bash
JAVA_HOME=/opt/homebrew/opt/openjdk VERAPDF=/path/to/verapdf npm test
```

Without `VERAPDF` the two conformance tests **skip loudly**. That is deliberate: a silent skip
would let a non-conforming certificate ship.

### What validation actually found, and why assuming would have failed

The first document this suite produced had a complete structure tree, correct `ActualText`, and
byte-perfect shaping — and **failed PDF/UA-1 on 4 rules and 25 checks.** None of it was visible
without a validator, and none of the other eight tests noticed:

| Rule | What was missing |
|---|---|
| 7.1 t8 | XMP metadata declaring `pdfuaid:part` |
| 7.1 t10 | `ViewerPreferences /DisplayDocTitle true` |
| 7.2 t34 | determinable natural language for page content |
| 7.2 t30 | determinable natural language for each `ActualText` span |

Fixing those left two more that only appeared once the first four were gone:

| Rule | What was wrong |
|---|---|
| 7.21.4.1 t1 | **Helvetica cannot be embedded.** A standard-14 font fails PDF/UA outright — Latin text needs a vendored face like everything else |
| 7.21.4.2 t2 | the `/CIDSet` defect, exactly as ARC-49 predicts |

**The claim that "pdfkit passes PDF/UA" was true of somebody else's document, not of ours.**
Six separate defects sat between a correct-looking file and a conforming one.

### Language is not one setting

A certificate carries English, Telugu and Devanagari on one page, so a document-level `/Lang`
cannot answer for all of it. Every run declares its own, and `writeText()` **throws** if Indic
text arrives without one — a missing `lang` is a validation failure two rules deep, and far
cheaper to catch at the call site.

### The /CIDSet workaround

`cidset-workaround.js` blanks the entry with equal-length spaces so **no byte offset moves** —
rewriting the file would invalidate the xref, and padding in place is safe to apply before
signing. `/CIDSet` is not required by PDF/UA at all, so removing it is correct rather than a
fudge. When `pdfua.test.js` passes with that step removed, the upstream defect is fixed.

### The development signing key

`test/fixtures/dev-signing.p12` is a self-signed throwaway, passphrase `test`, CN
*"LIMS Development Signing Key (NOT FOR ISSUE)"*. It must never sign anything issued. The real
credential is whatever the Central Silk Board provides — still an open question.
