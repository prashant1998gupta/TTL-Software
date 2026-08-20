# The application — Phase 1 core

This directory now holds a WORKING system, not only the document component: the Limited Test
path end to end, from the counter to a scanned QR code.

## What runs

| Piece | What it is |
|---|---|
| `src/server/` | The internal application — counter, worklist, bench, verification, issue |
| `verify-server.js` | The public QR verification service — its own process, reads only the published table |
| `src/documents/` | The certificate path — tagged PDF/UA, Telugu via HarfBuzz, digital signature |
| `src/calc/` | The calculation and grading engine — every constant in configuration |

## Running it

Needs PostgreSQL 16 on the local socket and Node 20+:

```bash
npm install
node src/server/migrate.js --demo     # creates schema + development users
node src/server/index.js              # internal app  -> http://localhost:8787
node verify-server.js                 # public verify -> http://localhost:8788
```

Sign in as **lakshmi** (counter), **ravi** (tester), **suma** (verifier) or **incharge**
(signatory) — password `dvm`. These are development accounts seeded by `--demo`; they are
deactivated at go-live.

The working day: lakshmi registers at the counter (the number is allotted gap-free inside the
transaction), ravi picks the sample up at the bench — the out-of-calibration balance cannot be
chosen — and types 20 skein weights with Enter advancing the cursor, suma verifies (the system
refuses to let ravi verify his own work), incharge signs and issues. The certificate is rendered
as tagged PDF/UA, digitally signed, frozen with its SHA-256, and the QR on it answers
GENUINE — CURRENT on the public page. Withdraw it and the same QR answers GENUINE — WITHDRAWN.

Every state change lands in an append-only audit trail that refuses UPDATE and DELETE even from
the table owner — enforced by trigger, and tested by attempting the attack.

## Tests

```bash
npm test                              # 49 tests: calc, documents, server workflow
```

The server tests recreate a throwaway `ttl_lims_test` database each run. The two PDF/UA
conformance tests need `VERAPDF` and Java 11+ (see below); they skip loudly without.

---

# Document component — proof of the certificate path

**Build this before anything else.** It is the only part of the system whose feasibility was
in doubt, and the part that is hardest to change once certificates have been issued.

Everything else in the LIMS — the register, the workflow, the calibration and competency gates —
exists to make one signed PDF defensible years later. This directory proves that PDF can be
produced correctly in Node.

## Running it

```bash
npm install && npm test
```

Nine tests. Fonts are vendored, so nothing is fetched.

The two PDF/UA conformance tests need veraPDF and Java 11+, both on the build machine only —
never on the laboratory server. Without `VERAPDF` set they **skip loudly** rather than pass:

```bash
JAVA_HOME=/opt/homebrew/opt/openjdk VERAPDF=/path/to/verapdf npm test
```

To see a certificate rather than a test result:

```bash
node demo.mjs
```

That writes `demo-certificate.pdf`. Open it, search for `పట్టు`, and copy the Telugu out — if
both work, the text layer is right. Judging whether the Telugu *looks* right still needs a
Telugu reader; no assertion here can do it.

If the golden shaping file needs regenerating after a deliberate change:

```bash
UPDATE_GOLDEN=1 npm test
```

Review the diff before committing. A golden file updated to silence a failure is worse than no
golden file at all.

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

### The four critical npm advisories — assessed, not reachable

`npm audit` reports **4 critical** advisories against `crypto-js <= 4.1.1`, reached through
`@signpdf/placeholder-plain` → `@signpdf/placeholder-pdfkit010` → `pdfkit 0.9.0–0.12.1`. There is
no upstream fix. Recording the assessment here so it is not rediscovered and re-litigated every
few months, and so there is an answer ready when an assessor asks.

**The vulnerable code never executes on our path.** Verified by running the real placeholder call
and inspecting the module cache afterwards:

```
placeholder produced bytes: 18570
crypto-js modules loaded   : NONE
nested old pdfkit loaded   : NONE
```

`plainAddPlaceholder` inserts the signature placeholder by byte manipulation. It never enters the
pdfkit-based branch, so neither the old nested `pdfkit` nor `crypto-js` is ever loaded. Our own
direct `pdfkit` is 0.19.1 and is not affected. The advisories describe weak PBKDF2 and insufficient
entropy in cryptographic secret generation — neither is on any path we call, and the signature
itself is produced by `@signpdf/signer-p12` from the P12 credential, not by `crypto-js`.

**What would make it reachable:** switching from `plainAddPlaceholder` to the pdfkit-based
placeholder (`@signpdf/placeholder-pdfkit010` directly, or `pdfkitAddPlaceholder`). If anyone ever
does that, this assessment is void and the dependency must be replaced first.

**Re-check it like this** — do not take this paragraph on trust once the dependency tree changes:

```bash
node -e "
const { plainAddPlaceholder } = require('@signpdf/placeholder-plain');
const PDFDocument = require('pdfkit');
const doc = new PDFDocument(); doc.text('x'); doc.end();
const chunks = []; doc.on('data', c => chunks.push(c));
doc.on('end', () => {
  plainAddPlaceholder({ pdfBuffer: Buffer.concat(chunks), reason: 't', signatureLength: 8192 });
  const bad = Object.keys(require.cache).filter(k => k.includes('crypto-js'));
  console.log('crypto-js loaded:', bad.length ? bad : 'NONE');
});
"
```

`NONE` means this assessment still holds. Anything else means it does not.

---

# Calculation and grading engine

The specification names three items as carrying most of the schedule risk, to be attacked first
rather than left to the end. The tagged and signed PDF was the first. This is the second: the
calculation and grading engine a non-programmer must be able to author (NFR-109, AC-38).

```
src/calc/
  stats.js       n, mean, standard deviation, CV%, min, max, range — and the
                 frequency-distribution form IS 15090 prints its worked example in
  rounding.js    IS 2:1960 half-up, at the precision configured per characteristic AND unit
  formulas.js    sizeDeviation, maximumDeviation, averageNeatness, lowNeatness, conditionedSize
  grade.js       two-stage grading: majors set a provisional grade, auxiliaries cap one class
  config/is15090-bis.json   every constant of the standard
```

`npm test` runs 28 tests for this component.

## The engine knows no constant of its own

M1-51 requires that none of the standard's reference data appears in program code. It does not.
Size categories, the major and auxiliary sets per category, the one-class cap list, precision per
unit, the 11 per cent regain, the 140 °C oven temperature, the 7 per cent repeat gate and the grade
order all live in `config/is15090-bis.json`. Two tests assert this by reading the source and
failing if a constant has crept in.

The BIS and ISA tables are separate records, not translations of each other — IS 15090 states that
its maximum-deviation values deliberately differ from the International Silk Association's.

## It refuses rather than guesses

A grade that looks plausible and is wrong is the worst outcome this system can produce: a buyer
settles money against it and nobody can tell by looking. So the engine refuses, by name, when:

| Refusal | Why |
|---|---|
| `no-grade-table` | The per-grade limits were **not available to this project and were deliberately not invented**. `gradeTable.records` ships empty and the engine will not grade until the laboratory's own tables are loaded. |
| `unconfirmed-config` | In live mode, while any configuration row still reads `confirmed: false`. This is the recommended default of OPEN-Q-C13: do not compute a grade in a live system while any row is unconfirmed. Draft mode proceeds and returns the same list as warnings. |
| `missing-marked-size` | The size category is resolved from the size **marked on the bales**, never the measured size. A lot marked 33 denier may measure 34.5 and still be Category II. |
| `missing-major-result` | A major test cannot be skipped. Auxiliary results are optional. |
| `bad-mode` | There is no default mode, because the difference is whether an unconfirmed grade table may be used. |

`stats.standardDeviation` likewise refuses without an explicit `n` or `n-1`, because a silent
default would bake an unverified choice into every grade the laboratory ever issues.

## The three things that produce a plausible wrong grade

Each has a test whose name says what it is guarding:

1. **Category from the marked size, not the measured size.** Getting this backwards silently moves
   a lot into the wrong grade table.
2. **`maximumDeviation` is MAJOR in Category III and AUXILIARY in Categories I and II.** So it sets
   the grade outright for coarse silk but can only cap it by one class for finer silk. The
   classification is read per category from `characteristics.byCategory`. The
   `is_major_characteristic` booleans on the parameter master cannot express this, which is why
   M1-51 calls them non-authoritative — a test greps `grade.js` and fails if they are ever read.
3. **Cohesion applies only at 33 denier or finer.** Gated twice: Category III does not list it, and
   the applicability rule blocks it independently. The two gates coincide exactly, so either one
   alone still holds the line if the other is edited.

## What is NOT verified here

Recorded so it is not mistaken for settled:

- **The grade tables themselves.** Empty, deliberately. This is the single largest gap.
- **The standard-deviation divisor.** No source read for this project settled whether it is `n` or
  `n-1`. Seeded as `n`, marked unconfirmed. A real worksheet settles it in one reading: recompute
  its printed size deviation both ways and see which matches.
- **The maximum-deviation arithmetic.** The sources establish *which* specimens enter it — the four
  coarsest and four finest, or eight and eight for coarse silk — but not the arithmetic applied to
  them. Implemented as (mean of coarsest) − (mean of finest) and declared as an assumption in
  `formulas.UNCONFIRMED_DEFINITIONS`.
- **The reading counts conflict.** The specification says 4 sizing skeins from each of 10 bobbins
  (40 readings), or 8 from each of 10 (80). The domain research instead records 200 skeins × 450 m
  or 400 × 112.5 m, weighed in 10 lots. These do not reconcile by arithmetic and may reflect BIS
  versus ISA, or a full grading versus the local Limited Test. Both are recorded in the config and
  a test fails if the conflict is quietly resolved. The engine itself is indifferent — it computes
  over whatever readings it is given — but the method master must state the required count.

Every one of these is a question for the Unit In-Charge with a real grading worksheet in hand, and
each is cheap to settle that way and impossible to settle without it.
