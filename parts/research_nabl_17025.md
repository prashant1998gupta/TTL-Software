# ISO/IEC 17025:2017 + NABL — Records & Reports as Software Requirements
### Research brief for the RSTRS Dharmavaram (CSB/CSTRI) silk testing LIMS on CloudZoo ERP

---

## 0. READ THIS FIRST — the ULR format changed in June 2026

Almost every LIMS article, vendor blog and consultant deck on the internet describes the **2018/2021** ULR format (18 digits, with a "location" digit and a trailing `F` flag). **That format is superseded.**

NABL issued, in the last three months:

| Date | Document | What it did |
|---|---|---|
| 03.06.2026 (rev. 06.07.2026) | Announcement regarding new format of NABL accreditation certificate number | Replaced `TC-XXXX` / `TC-XXXXX` with `NABLFMMYYSCXXXXX` |
| 12.06.2026 | Announcement regarding NABL symbol w.r.t. new certificate number format | New symbol artwork carrying the new number |
| 11.06.2026 (rev. 15.06.2026) | Clarification regarding Unique Laboratory Report (ULR) Number | **Rewrote all three ULR formats. Dropped the location digit. Dropped the trailing `F`.** |

**Software implication (non-negotiable):** the ULR builder must be a **configuration-driven template engine**, not hardcoded string concatenation. The lab is currently mid-transition (6-month window from issue of its new certificate), so the software must be able to emit an old-format ULR and a new-format ULR, and switch on a date, without a code change.

---

## 1. ULR (Unique Laboratory Report) Number → Numbering module

### 1.1 What it is and why it exists

The ULR exists because the **Government e-Marketplace (GeM)** accepts test reports from NABL-accredited labs, and NABL agreed to help GeM map report data against sellers' claims. The ULR is **in addition to** the laboratory's own report/certificate number — not a replacement for it.

> "This number will be in addition to the report/certificate/RM document number of the CAB and will have to be mentioned in all reports/certificates/RM documents issued within accredited scope only."
> — NABL, Clarification regarding ULR Number, 11.06.2026 (rev. 15.06.2026)

### 1.2 Exact formats (current, per the 15.06.2026 clarification)

**Format (a) — new certificate number `NABLFMMYYSCXXXXX` → ULR is 26 characters**

| Positions | Content | Meaning |
|---|---|---|
| 1–4 | `NABL` | Literal |
| 5 | `F` | Field: `T`=Testing, `C`=Calibration, `M`=Medical, `P`=PTP, `R`=RMP, `B`=Biobank |
| 6–7 | `MM` | Month accreditation was **granted/renewed** (e.g. `06`) |
| 8–9 | `YY` | Year accreditation was **granted/renewed** (e.g. `26`) |
| 10–11 | `SC` | Two-letter State/UT code (`AP` for Andhra Pradesh). `GL` for international CABs |
| 12–16 | `XXXXX` | 5-digit certificate serial |
| 17–18 | `YY` | Year of issue of **this report** (e.g. `26` for 2026) |
| 19–26 | `NNNNNNNN` | Running report number, `00000001`→`99999999`, **restarted afresh each calendar year**. Hexadecimal permitted |

Worked example using NABL's own sample certificate `NABLT0626MP20001`, first report of 2026:
```
NABLT0626MP20001 + 26 + 00000001  =  NABLT0626MP200012600000001
```

**Format (b) — legacy 5-digit certificate `TC-XXXXX` → ULR is 17 characters**

| Positions | Content |
|---|---|
| 1–2 | `TC` |
| 3–7 | `XXXXX` (certificate serial, hyphen dropped) |
| 8–9 | `YY` (report year) |
| 10–17 | `NNNNNNNN` (running number, reset annually, hex permitted) |

Example: certificate `TC-11516`, report #42 of 2026 → `TC115162600000042`

**Format (c) — legacy 4-digit certificate `TC-XXXX`/`CC-XXXX`/`RC-XXXX` → ULR is 16 characters**

| Positions | Content |
|---|---|
| 1 | `T` / `C` / `R` |
| 2 | `C` |
| 3–6 | `XXXX` |
| 7–8 | `YY` (report year) |
| 9–16 | `NNNNNNNN` |

Example: certificate `TC-4779`, report #42 of 2026 → `TC47792600000042`

### 1.3 What was removed (and will break a copied implementation)

- **Location digit** (old position 9 — `0` for single-location, `1..9` for multi-location/sections) — **gone**.
- **Trailing `F`** (old position 18, which asserted "all the parameters in the report are in the accredited scope") — **gone**.
- Consequence: old TC-XXXX ULR was 18 chars; the current one is 16.

### 1.4 When it is mandatory / when it must NOT be used

**Mandatory:** on all reports issued **within accredited scope**.

**Must NOT be used:** "This system is not to be used in reports containing parameters outside the scope of NABL accreditation."

**Not mandatory for** (exclusion list, expanded in 2026): in-house labs such as bulk petroleum product manufacturers' labs; test reports of non-commodities like air, waste water and similar environmental parameters; **Soil & rock**; **Cell Culture**; veterinary testing; dope testing; forensic testing. → Silk / textile testing is a commodity, so **the ULR applies to this lab**.

### 1.5 Non-accredited parameters — the hard rule (this is a NABL 133 rule, not a ULR rule)

This is the single most commonly failed requirement, and it is stricter than most developers expect:

> "Separate report/certificate be issued for non-accredited parameters. **Asterisk mark or any other symbol is not allowed / not permitted** to use in the report / certificate containing accredited parameters."
> — NABL 133, cl. 5.1 (Issue 09, Amd. 03, 03-Sep-2024)

> "The non-accredited parameters shall not be a part of the report / certificate intended to be issued under NABL symbol, if it is not clearly identified and / or segregated and kept away. Asterisk mark or any other symbol or another accreditation body symbol/logo is not allowed..."
> — NABL 133, cl. 6.2

Also: "There shall be nothing in report and/or certificate or in any attachment or other material, which implies or may lead any user of the results... to believe that the work is accredited when in fact it is not." (NABL 133 cl. 6.13)

**→ Software implication (Numbering + Report module):**

| # | Requirement |
|---|---|
| N1 | `ulr_format_template` is a per-lab configuration record with fields: `certificate_number`, `certificate_format` (enum: `NEW_NABL`, `LEGACY_5`, `LEGACY_4`), `running_number_length`, `running_number_base` (10 or 16), `reset_policy` (`CALENDAR_YEAR`), `effective_from`, `effective_to`. Never hardcode. |
| N2 | ULR sequence is **per calendar year**, gap-free, allocated atomically (DB sequence / row lock — not `MAX()+1`), and **only allocated at the moment of report authorisation**, never at sample registration. A draft report has no ULR. |
| N3 | Two independent identifiers per report: the lab's own **Report No.** (free format, e.g. `RSTRS/DVM/2026/0412`) and the **ULR**. Both print on the report. Both are unique. |
| N4 | Every test in a job carries a boolean `is_in_accredited_scope`, derived from a **Scope Master** (product × parameter × method × discipline × group, with validity dates synced from the NABL certificate scope). |
| N5 | **Hard block:** the system must refuse to place a ULR or the NABL symbol on any report that contains at least one out-of-scope parameter. |
| N6 | **Auto-split:** when a customer orders a mix of accredited and non-accredited parameters against one sample, the system must generate **two reports** from one job: (i) an accredited report — NABL symbol + ULR; (ii) a non-accredited report — no symbol, no ULR, no narrative accreditation claim. Both cross-reference the same Sample ID internally, but neither may hint at the other's accreditation status. |
| N7 | **Forbid asterisks/footnote markers** on accreditation status in the accredited template. Lint the template at build time; block any `*`-based "not in NABL scope" annotation pattern. |
| N8 | Store the NABL symbol as a controlled asset with a `valid_from`/`valid_to`, and swap it automatically when the new-format certificate is issued (the new symbol artwork carries the new number). Symbol must be suppressed automatically the moment accreditation validity lapses (NABL 133 cl. 6.6). |
| N9 | Amendments: "In case amendment is made to any report with proper identification, **the same ULR number may be given. However, it is the prerogative of the laboratory.**" → make this a lab-level policy switch: `amendment_ulr_policy = REUSE | NEW`. Default `REUSE`, document the choice in the quality manual. |
| N10 | **QR code** on every report (see §2.6). |

**UNVERIFIED / to confirm with NABL directly:**
- The new certificate format has an optional `(I)` suffix for **testing laboratories accredited under Integrated Assessment** (e.g. `NABLT0426DL20001(I)`). The 15.06.2026 ULR position table has **no position for `(I)`**. If RSTRS is ever accredited under Integrated Assessment (NABL 127/154), ask NABL in writing how `(I)` maps into the ULR. Design the template engine so a suffix can be inserted without a schema change.
- In NABL's examples, testing-lab certificate serials start with `2` (`NABLT0426DL2000**1**`, `NABLT0626MP20001`) while calibration/medical/PTP/RMP/biobank start with `1`. This pattern is **not documented** in the announcement. Do not derive logic from it.
- The 2021 clarifications required "discipline (e.g. Chemical/Mechanical) and group (e.g. Textile) to be mentioned before the product and parameters in the reports (refer NABL 120)". **This sentence is not repeated in the 15.06.2026 revision.** Treat it as still-expected by assessors (it is harmless and cheap to print) but confirm. NABL 120 (Amd. 06, 22-Dec-2025) classifies textile work under both `1.2.43 Textile` (Chemical discipline) and `1.8.19 Textile Materials` (Mechanical discipline) — a silk lab will typically hold both.

---

## 2. Clause 7.8 Reporting of results → Report module

### 2.1 Clause 7.8.1 General

| Clause | Requirement | Software implication |
|---|---|---|
| 7.8.1.1 | Results shall be **reviewed and authorized prior to release** | Mandatory state machine: `DRAFT → TECHNICAL_REVIEW → AUTHORISED → ISSUED`. No path from `DRAFT` to `ISSUED`. Reviewer and authoriser recorded separately with user, role, UTC timestamp. |
| 7.8.1.2 | Results provided "accurately, clearly, unambiguously and objectively". **"All issued reports shall be retained as technical records."** | The issued report is a **first-class record**, not a re-render. See NABL 131 cl. 26 below. |
| 7.8.1.3 | Simplified reporting is allowed **when agreed with the customer**, but any information from 7.8.2–7.8.7 not reported **shall be readily available** | Support a "short report" template flagged against a customer agreement record; all suppressed fields remain queryable and printable on demand. |
| 7.8.1.2 Note | "Reports can be issued as hard copies or by **electronic means**, provided that the requirements of this document are met" | Electronic issue (PDF/email/portal) is explicitly permitted. |

**Overriding NABL requirement on the stored copy:**

> "Accredited CAB shall ensure that the copy of the test report/certificate... **stored/retained shall be an exact replica of the report issued to the customer including the format** of the test report/certificate... **header & footer, and NABL symbol**."
> — NABL 131, cl. 26 (Issue 08, Amd. 04, 23-Jan-2026)

**→ Software implication (critical, often missed):** at authorisation the system must **freeze and store the rendered PDF byte-for-byte** (with a SHA-256 hash), not merely the underlying data rows. A future template change, logo change or font substitution must not alter what an assessor sees when they pull a 2026 report in 2029. Store `report_pdf_blob`, `sha256`, `template_id`, `template_version`, `rendered_at`.

### 2.2 Clause 7.8.2.1 — EVERY mandatory element of a report

Each report shall include at least the following, *"unless the laboratory has valid reasons for not doing so, thereby minimizing any possibility of misunderstanding or misuse"*. **Note: NABL 160A (Issue 01, 02-Jan-2026) reproduces this list without the "valid reasons" hedge — "Each report includes the following information" — so treat all sixteen as mandatory fields in this build.**

| ID | ISO element | Field / behaviour in software |
|---|---|---|
| (a) | A title (e.g. "Test Report") | Template constant; per-template configurable |
| (b) | Name and address of the laboratory | Lab master (from CloudZoo org master) |
| (c) | **Location of performance** of the laboratory activities — including when performed at a customer facility, at sites away from permanent facilities, or in temporary/mobile facilities | `test_location_id` per test line, defaulting to the permanent facility. Must be capable of differing from (b). NABL accreditation is **location specific** (NABL 133 cl. 5.1), so this is not cosmetic |
| (d) | **Unique identification** such that all components are recognised as part of a complete report, **and a clear identification of the end** | Report No. + ULR printed on **every page**; `Page m of n` on every page; an explicit `--- End of Report ---` marker on the last page |
| (e) | Name and **contact information of the customer** | From CloudZoo customer master. Snapshot the values at issue time (customer may later change address) |
| (f) | **Identification of the method used** | Method code + title + **version/year of issue** (e.g. `IS 15409:2003`, or `CSTRI/SOP/RW/04 Rev. 3`). Link to Method Master (§8) |
| (g) | A **description, unambiguous identification, and when necessary the condition** of the item | Sample description, Sample ID, `condition_on_receipt` (free text + coded) |
| (h) | **Date of receipt** of the item, and **date of sampling** where critical to validity/application of results | `received_at` (mandatory), `sampled_at` (conditional-mandatory) |
| (i) | **Date(s) of performance** of the laboratory activity | Derived from technical records — start and end date of testing per parameter. Must be a real captured value, not `= issue date` |
| (j) | **Date of issue** of the report | Set on transition to `ISSUED` |
| (k) | Reference to the **sampling plan and sampling method** used by the laboratory or other bodies, where relevant | Conditional field; usually N/A for customer-submitted silk samples |
| (l) | **A statement that the results relate only to the items tested, calibrated or sampled** | Mandatory boilerplate (see §2.4) |
| (m) | **The results with, where appropriate, the units of measurement** | Result value + UoM + rounding/significant figures rule from the method. Store raw value and presented value separately |
| (n) | **Additions to, deviations, or exclusions from the method** | Deviation register linked to the job; prints if any exist (see §8/§9) |
| (o) | **Identification of the person(s) authorizing the report** | Name + designation of the NABL-approved Authorised Signatory. Not just a signature image — a printed identity |
| (p) | **Clear identification when results are from external providers** | Subcontracted/externally-provided results must be flagged per parameter and annotated on the report (see §9) |

### 2.3 Clause 7.8.3.1 — additional elements specific to TEST reports

Where necessary for interpretation of the test results:

| ID | Element | Software implication |
|---|---|---|
| (a) | Information on **specific test conditions, such as environmental conditions** | Textile testing is highly conditioning-dependent. Capture and print temperature and **relative humidity** during test (e.g. 27 ± 2 °C, 65 ± 4 % RH per the standard atmosphere for testing textiles) as a per-test record, pulled from the environment log |
| (b) | Where relevant, a **statement of conformity** with requirements or specifications (→ 7.8.6) | See §2.5 |
| (c) | Where applicable, the **measurement uncertainty**, in the same unit as the measurand or relative to it (e.g. %), when: (1) it is relevant to the validity or application of the results; (2) a customer's instruction so requires; (3) **the measurement uncertainty affects conformity to a specification limit** | MU per parameter/method, with a `mu_report_policy` per method: `NEVER / ALWAYS / ON_CUSTOMER_REQUEST / WHEN_NEAR_LIMIT`. The third trigger is automatic and must be computed, not remembered by a human |
| (d) | Where appropriate, **opinions and interpretations** (→ 7.8.7) | See §2.5 |
| (e) | **Additional information** required by specific methods, authorities, customers or groups of customers | Per-method and per-customer "extra fields" mechanism on the template |

### 2.4 Mandatory / expected disclaimers — with suggested exact strings

| Source clause | Status | Suggested printed text |
|---|---|---|
| 7.8.2.1(l) | **shall** | "The results relate only to the item(s) tested." |
| **Note to 7.8.2.1** | ISO says **should** ("The laboratory should include a statement specifying that the report shall not be reproduced except in full, without approval of the laboratory."). NABL assessors expect it — treat as mandatory | "This report shall not be reproduced, wholly or in part, without the written approval of the laboratory." |
| 7.8.2.2 (lab not responsible for customer-supplied info; where the lab was not responsible for sampling) | **shall** | "The laboratory was not responsible for the sampling stage. The results apply to the sample as received." |
| 7.8.2.2 (customer-supplied information that can affect validity) | **shall** — clearly identify the data **and** add a disclaimer | "The following information was supplied by the customer and has not been verified by the laboratory: «…». The validity of the results may be affected by this information." — printed only when such fields are flagged `customer_supplied = true` |
| 7.4.3 (customer insists on testing an item that deviates from specified conditions) | **shall** | "The item was accepted for testing with the following deviation(s) from specified condition(s): «…». The following result(s) may be affected: «…»." |
| 7.8.7.2 | **shall** — opinions and interpretations clearly identified as such | A visually distinct, separately headed block: "**Opinions and Interpretations** (outside the scope of NABL accreditation unless specifically accredited): …" |
| NABL 131 cl. 25 | **shall** — lab must make clear to the customer that accredited-scope activity does not imply NABL approval of the product | "Accreditation of the laboratory does not imply that the product tested is approved by NABL." |

**→ Software implication:** hold these as a **Statements Master** (`statement_code`, `text`, `language`, `trigger_condition`, `version`, `effective_from`). Templates reference statements by code, never by literal text, so a wording change is one data edit with a version history — and every historical PDF still shows the wording that was in force.

### 2.5 Clause 7.8.6 Statements of conformity + decision rule

| Clause | Requirement | Software implication |
|---|---|---|
| 7.1.3 | When the customer requests a statement of conformity, the **decision rule shall be clearly defined** and — unless inherent in the requested specification/standard — **communicated to and agreed with the customer** | Decision rule must be selected and customer-agreed **at sample registration**, captured on the test request, and locked. Not chosen by the analyst at result-entry time |
| 7.8.6.1 | The lab shall **document the decision rule employed**, taking into account the **level of risk** (false accept / false reject, statistical assumptions) and apply it. Where the rule is prescribed by the customer, regulation or a normative document, further risk consideration is not necessary | A **Decision Rule Master**: `code`, `description`, `guard_band_w` (e.g. `0`, `U`, `2U`, `w = kσ`), `risk_basis`, `is_prescribed_externally`. Engine computes PASS/FAIL from result, spec limit, MU and guard band — deterministic and auditable |
| 7.8.6.2 | The statement of conformity shall clearly identify: **(a)** to which results it applies; **(b)** which specifications, standards or parts thereof are met or not met; **(c)** the decision rule applied (unless inherent in the requested specification/standard) | Conformity is a **per-parameter** attribute, never a single report-level rubber stamp. Print the spec identity and clause, and the decision rule name + definition |
| 6.2.6(b) | Only personnel **authorised for analysis of results including statements of conformity** may issue them | Enforce via the authorisation matrix (§7) |

Reference for guidance: ISO/IEC Guide 98-4; ILAC-G8; Eurachem/CITAC "Use of Uncertainty Information in Compliance Assessment".

**Note on scope of accreditation:** decision rules and statements of conformity under 7.8.6 are **not** product certification as intended in ISO/IEC 17020 / ISO/IEC 17065 — the report must not read like a certification of the product.

### 2.6 QR code (NABL circular, 18.05.2021)

> "Labs should provide QR code on all test reports/calibration certificates issued which can be scanned using any QR scanning application available on mobile / any devices to authenticate and reproduce the test report/calibration certificate online. This will prevent the manipulation of test results/calibration data & the circulation of forged test report/calibration certificate in the market."

**→ Software implication:**
- Print a QR code on every issued report resolving to a **public, no-login verification URL** keyed on the ULR (or an opaque token mapping to it), which returns the frozen PDF or a read-only rendering of it.
- Do **not** put customer-identifying data in the QR URL query string. Use an opaque token.
- Verification endpoint must be tamper-evident: recompute the stored SHA-256 and refuse to serve a mismatch.
- Because RSTRS is a government facility possibly on an intranet, an internet-reachable verification host is a genuine infrastructure prerequisite — flag it early to the developer.

**UNVERIFIED:** third-party vendors describe a **"dual QR code"** obligation (one QR to the lab's NABL certificate/scope, one to the report) attributed to *NABL/Labs/2022/001 dated 17-May-2022 under DPIIT direction*. I could not locate that circular on nabl-india.org. Design the template to accommodate **two** QR slots (report-verification + accreditation-scope), and confirm the second with NABL before treating it as mandatory. Note also that the 2021 circular says "**should**", not "shall".

---

## 3. Clause 7.8.8 Amendments to issued reports → Versioning requirement

| Clause | Exact requirement |
|---|---|
| 7.8.8.1 | "When an issued report needs to be changed, amended or re-issued, **any change of information shall be clearly identified** and, where appropriate, **the reason for the change** included in the report." |
| 7.8.8.2 | "Amendments to a report after issue shall be made only in the form of a **further document, or data transfer**, which includes the statement: **'Amendment to Report, serial number... [or as otherwise identified]'**, or an equivalent form of wording. Such amendments shall meet all the requirements of this document." |
| 7.8.8.3 | "When it is necessary to issue a **complete new report**, this shall be **uniquely identified** and shall **contain a reference to the original that it replaces**." |

Interpretive note (worth telling the scientist, because assessors differ): ISO/CASCO's maintenance group has advised that a complete new report replacing a previous one is **not** required to itemise the changes, only to reference the original. **European Accreditation takes the stricter view** that 7.8.8.1 applies to complete new reports too — i.e. changes must still be identified. EA also notes the standard does not define which reasons for re-issue are acceptable, but customer-requested changes must not impact laboratory integrity, and amendments must relate to the item tested.

**→ Software implication (Report Versioning module):**

| # | Requirement |
|---|---|
| V1 | **Immutability.** An `ISSUED` report record and its frozen PDF are append-only. No UPDATE, no DELETE, ever — enforced at the database level (revoke UPDATE/DELETE on the issued-report tables from the application role; use a trigger that raises on modification). |
| V2 | Two distinct correction mechanisms, both first-class objects: **(A) Amendment** — a supplementary document carrying its own unique number and the literal statement `Amendment to Report, serial number <original report no. / ULR>`; **(B) Replacement report** — a complete new report with its own unique number carrying `This report supersedes and replaces Report No. <x> dated <y>`. |
| V3 The amendment/replacement itself must satisfy **all** of clause 7.8 in its own right (title, lab, customer, method, dates, signatory, statements, symbol, ULR policy) — so it is generated through the same pipeline, not a hand-typed letter. |
| V4 | A mandatory, non-blank **`reason_for_change`** field, selected from a controlled list plus free text (e.g. transcription error, recalculation, equipment found out of calibration, customer-requested detail correction, method deviation discovered). Reason prints on the document. |
| V5 | A machine-generated **change manifest**: field-level before/after diff between the superseded and the new content, stored and available to print. This satisfies both the ISO/CASCO and the stricter EA reading, so the build is safe either way. |
| V6 | Full lineage graph: `report.supersedes_id`, `report.superseded_by_id`, `report.amends_id`. Any view or print of a superseded report is **watermarked "SUPERSEDED — see Report No. X"**. |
| V7 | Re-issuing must **not** silently reuse the original report number. Numbering config: `replacement_numbering = SUFFIX (R1, R2…) | NEW_SEQUENCE`. |
| V8 | ULR on the amendment follows the `amendment_ulr_policy` switch (§1.5, N9) — NABL permits reuse of the same ULR, at the lab's discretion. |
| V9 | Issuing an amendment must **auto-open a Nonconforming Work record** (clause 7.10) unless the reason code is explicitly classified as non-NC (e.g. a purely cosmetic customer-address correction). This link is what assessors probe. |
| V10 | Customer notification event logged: who was told, when, by what channel, and (where the original was distributed) a recall record — clause 7.10.1(e). |

---

## 4. Clause 7.5 Technical records + 8.4 Control of records → Audit trail requirement

### 4.1 Clause 7.5.1 — what must be captured per test

> Technical records for **each laboratory activity** shall contain the results, report and **sufficient information to facilitate, if possible, identification of factors affecting the measurement result and its associated measurement uncertainty, and enable the repetition of the laboratory activity under conditions as close as possible to the original.**
> The technical records shall include **the date and the identity of personnel responsible for each laboratory activity and for checking data and results.**
> **Original observations, data and calculations shall be recorded at the time they are made** and shall be identifiable with the specific task.

That "enable repetition" clause is the acceptance test for the whole design. Concretely, per test:

| What must be captured | Software implication |
|---|---|
| **Raw observations** — the numbers as first read off the instrument or the operator's eye, before any calculation | Separate `raw_observation` rows (replicate index, raw value, UoM) from `derived_result`. Never overwrite a raw reading with a computed value. Support multi-replicate structures natural to silk testing (e.g. n breaks for tenacity, n skeins for denier/size, winding lengths, twist counts) |
| **Who** performed each activity | `performed_by_user_id` on each activity, plus the analyst's authorisation status **at that moment** (see §7) |
| **When** — recorded **at the time made** | `observed_at` captured server-side. Detect and flag back-dating: if `observed_at` differs from `created_at` beyond a tolerance, require a reason. Do not allow a free-text date to be typed over the system clock without an audit reason |
| **Which equipment** | Mandatory `equipment_id` FK per test activity — resolvable to the exact instrument, including its calibration certificate valid at `observed_at`. This is what makes §5's retrospective impact analysis possible |
| **Environmental conditions** | `temperature`, `relative_humidity` (+ any method-specified condition) at time of test, with the source (which sensor / which log entry). For textiles also the **conditioning history** of the specimen (pre-conditioning duration, atmosphere) |
| **Consumables / reference materials used** | Mandatory lot/batch FK per test where the method consumes reagents or uses an RM (§6) |
| **Calculations** | Store the **formula version** applied plus all intermediate values, not only the final number. A stored calculation must be re-executable and reproducible years later. Version the calculation engine alongside the method version |
| **Checks** | Separate `checked_by_user_id` + `checked_at` for the data/calculation check — 7.5.1 explicitly requires the identity of personnel "for checking data and results", and 7.11.6/7.11 requires calculations and data transfers to be checked. This is a **different person-role than the authoriser** |
| **The report itself** | 7.8.1.2: all issued reports are retained as technical records |
| **Sampling data** (7.3.3), if the lab ever samples | Method reference, date **and time**, sample identity/amount/name, personnel, equipment used, environmental/transport conditions, location diagram, deviations |

### 4.2 Clause 7.5.2 — the amendment/audit-trail rule (verbatim substance)

> The laboratory shall ensure that **amendments to technical records can be tracked to previous versions or to original observations.**
> **Both the original and amended data and files shall be retained**, including **the date of alteration**, an **indication of the altered aspects** and the **personnel responsible for the alterations**.

**→ Software implication (Audit Trail module) — this is the clause that decides whether the LIMS passes or fails:**

| # | Requirement |
|---|---|
| A1 | **No destructive update anywhere in the technical-record chain.** Implement as an append-only history table per audited entity (`*_history`) written by a database trigger, or event sourcing. Application-layer-only auditing is not acceptable — a direct SQL edit must still be caught. |
| A2 | Each audit row records: `entity`, `entity_id`, `field`, `old_value`, `new_value`, `changed_by_user_id`, `changed_at` (server UTC, with local timezone offset stored), `reason_for_change`, `client_ip`, `session_id`. |
| A3 | **`reason_for_change` is mandatory and non-blank** for any edit to a raw observation, result, method, equipment status, or authorisation. This is the single most common gap in home-grown LIMS. |
| A4 | **The original entry must remain visible in the UI**, not merely recoverable from a backup. The result-entry screen shows the current value with a "changed — view history" affordance; the history view shows the full chain, original first. Print-outs of technical records must be able to show the original alongside the amendment (mirroring the paper practice of striking through, initialling and dating). |
| A5 | Audit rows themselves are immutable and non-deletable. Retention purges must never remove audit rows for records still in retention. |
| A6 | **Soft-delete only.** `voided_at`, `voided_by`, `void_reason`. A voided record remains queryable and printable, watermarked VOID. |
| A7 | Clock integrity: server-side NTP-synced timestamps only; never trust the client. Note the timestamp source in the validation record (7.11.2). |
| A8 | Bulk import / instrument interface loads must produce the same audit trail as manual entry, and record the source file name + hash. |

### 4.3 Clause 8.4 Control of records + retention

| Clause | Requirement | Software implication |
|---|---|---|
| 8.4.1 | Establish and retain **legible** records demonstrating fulfilment of the standard | Every record printable/exportable in a human-readable form, independent of the application (PDF or CSV export) — an assessor may ask to read records without your UI |
| 8.4.2 | Implement controls for **identification, storage, protection, back-up, archive, retrieval, retention time, and disposal**. Retain records "for a period consistent with its contractual obligations." Access shall be consistent with confidentiality commitments and records shall be readily available | Eight named controls → eight implementable features: unique record IDs; defined storage; access control; **scheduled, verified, restorable backups** (test restores logged); archive tier; indexed search; per-record-type retention clock; controlled disposal with a disposal log |

**Retention period — the honest answer:**

- **ISO/IEC 17025:2017 does not state a number.** The lab defines it.
- **NABL 160A (Issue 01, 02-Jan-2026), cl. 8.4.2** confirms this: "The laboratory retains the record for a period (**period may be defined as per laboratory policy**) keeping in view legal, regulatory and contractual obligations."
- **Where a number does appear:** **NABL 127** (Procedure for Integrated Assessment & Additional Requirements of Regulatory Bodies for Testing Laboratories, Issue 02, Amd. 05, 10-Aug-2026), in the regulatory-scheme annexes (EIC/EIA, APEDA, IOPEPC, Spices Board), requires the lab to maintain **the record of observations, a copy of the test report and purchase documents for a minimum period of three years**; purchase documents for chemicals/media until the validity of the chemical/media. Sample retention periods are specified scheme-wise / discipline-wise.
- For a Government of India / CSB unit, departmental record-retention rules and audit (CAG) requirements will usually exceed three years.

**→ Software implication:** `retention_policy` is a **configurable table keyed by record type** (technical records, issued reports, equipment calibration certificates, personnel competence records, consumable lot records, complaints, NCs, PT records, audit trail), each with `retention_years`, `trigger_event` (date of issue / date of disposal / date of superseding), `disposal_method`, `approval_required_by_role`. Recommended default for this lab: **5 years**, minimum 3, with **no automatic hard deletion** — the system flags records as due for review and a named person authorises disposal, which itself creates a permanent disposal record.

---

## 5. Clause 6.4 Equipment (+ 6.5 traceability) → Equipment module spec

### 5.1 Clause-by-clause

| Clause | Requirement | Software implication |
|---|---|---|
| 6.4.1 | Access to equipment "including... measuring instruments, **software**, measurement standards, **reference materials, reference data, reagents, consumables** or auxiliary apparatus" required for correct performance and which can influence the result | The Equipment master's scope is wider than instruments. Either one `resource` table with a `type` discriminator, or Equipment + Consumables/RM modules sharing a common controlled-item interface (§6) |
| 6.4.2 | Where equipment outside the lab's permanent control is used, 6.4 still applies | `ownership` = `OWNED / LEASED / CUSTOMER / EXTERNAL`; same calibration/status rules apply |
| 6.4.3 | Procedure for handling, transport, storage, use and **planned maintenance** | Maintenance plan + maintenance log per equipment, with due dates and overdue alerts |
| 6.4.4 | **Verify equipment conforms to specified requirements before being placed or returned into service** | An explicit `commissioning_verification` record gating the transition to `IN_SERVICE` — including after every repair. No instrument may be used before this record exists |
| 6.4.5 | Equipment shall be **capable of achieving the accuracy / MU required** to provide a valid result | Store required vs actual capability per parameter; block assignment of an instrument whose capability is insufficient for the method |
| 6.4.6 | Measuring equipment shall be calibrated when **(a)** accuracy/MU affects validity of reported results, or **(b)** calibration is needed to establish metrological traceability | Per-equipment flag `requires_calibration` with the reason recorded — an assessor will ask why an item is *not* in the calibration programme |
| 6.4.7 | Establish a **calibration programme, reviewed and adjusted** as necessary to maintain confidence in calibration status | Calibration schedule object with interval, next-due date, and a documented **interval review** event (interval changes require reason + approver) |
| 6.4.8 | All equipment requiring calibration or having a defined validity period shall be **labelled, coded or otherwise identified** so the user can **readily identify calibration status or period of validity** | Unique **Equipment ID** printed on a physical label; software prints the label (ID, date of calibration, due date). NABL 160A cl. 6.4.8 confirms the label contents. Where a label cannot be affixed, it goes on the box/container |
| 6.4.9 | Equipment subjected to **overloading or mishandling, giving questionable results, shown defective or outside specified requirements** shall be **taken out of service**; **isolated to prevent its use or clearly labelled/marked as out of service** until verified to perform correctly. The lab shall **examine the effect of the defect/deviation and initiate the management of nonconforming work procedure (7.10)** | See §5.2 — this is the "out-of-calibration" engine |
| 6.4.10 | Where **intermediate checks** are necessary to maintain confidence, they shall be carried out **according to a procedure** | Intermediate-check schedule + acceptance criteria + pass/fail record per check, separate from calibration. Overdue check ⇒ same treatment as overdue calibration |
| 6.4.11 | Where calibration/RM data include **reference values or correction factors**, ensure they are **updated and implemented** as appropriate | Correction factors are versioned data attached to the calibration certificate, **automatically applied by the calculation engine** and available at the point of use. Applying a stale correction factor is a classic silent error |
| 6.4.12 | Take practicable measures to **prevent unintended adjustments** of equipment from invalidating results | Software-side: restrict who may change instrument configuration/correction factors; log every change; where the LIMS drives an instrument, lock configuration |
| 6.4.13 | **Retain records** for equipment which can influence laboratory activities, including where applicable: **(a)** identity of equipment **including software and firmware version**; **(b)** manufacturer's name, type identification, serial number or other unique identification; **(c)** evidence of verification that equipment conforms with specified requirements; **(d)** the **current location**; **(e)** calibration dates, results of calibrations, **adjustments, acceptance criteria**, and the **due date of next calibration or the calibration interval**; **(f)** documentation of **reference materials, results, acceptance criteria, relevant dates and the period of validity**; **(g)** the **maintenance plan and maintenance carried out to date**; **(h)** details of any **damage, malfunction, modification to, or repair** of the equipment | Eight sub-fields → the Equipment master's mandatory schema. Note (a) explicitly includes **software and firmware version** — this is where instrument firmware upgrades get tracked |

### 5.2 "What happens to results produced by equipment later found out of calibration" — the retrospective impact engine

This is the highest-value single feature in the whole equipment module, and it only works if §4.1's mandatory `equipment_id` per test was enforced.

Chain of clauses: **6.4.9** (take out of service, isolate/label, **examine the effect of the defect or deviation**, initiate 7.10) → **7.10.1(c)** ("an evaluation is made of the significance of the nonconforming work, including an **impact analysis on previous results**") → **7.10.1(e)** ("where necessary, **the customer is notified and work is recalled**") → **7.8.8** (amend or re-issue the affected reports).

**→ Software implication (`Equipment Impact Assessment` workflow):**

1. Trigger: an equipment event is recorded — calibration **fail**, calibration result outside acceptance criteria, intermediate check fail, damage/malfunction/overload report, or a late calibration discovered.
2. Operator enters the **`suspect_from` date** — the date from which results are potentially affected (typically the last known-good calibration or intermediate check).
3. System **automatically lists every test, sample, job and issued report** that used that `equipment_id` between `suspect_from` and the out-of-service date. One query, because of the mandatory FK.
4. A named authorised person dispositions each affected report: `NOT AFFECTED` (with technical justification) / `RETEST` / `AMEND REPORT` / `WITHDRAW & REPLACE`.
5. The disposition record is mandatory, reasoned, signed, dated — and drives customer notification and recall records.
6. `IN_SERVICE` cannot be restored until a 6.4.4 re-verification record exists.
7. Equipment state machine: `IN_SERVICE → OUT_OF_SERVICE(reason) → UNDER_REPAIR/CALIBRATION → VERIFIED → IN_SERVICE`, plus `QUARANTINED` and `RETIRED`. **Hard block:** results cannot be entered against equipment not `IN_SERVICE`, or whose calibration/intermediate check is expired at `observed_at`. Provide a break-glass override that is role-restricted, reason-mandatory, and auto-raises a Nonconforming Work record.

### 5.3 Clause 6.5 Metrological traceability + NABL 142

| Clause | Requirement | Software implication |
|---|---|---|
| 6.5.1 | Establish and maintain metrological traceability by a **documented unbroken chain of calibrations, each contributing to the measurement uncertainty**, linking to an appropriate reference | Store the traceability chain as data: instrument → calibration certificate → calibrating lab (+ its accreditation number and scope) → its reference standard → NMI. Each link with its stated MU. Make the chain printable |
| 6.5.2 | Ensure results traceable to the **SI** through: **(a)** calibration provided by a **competent laboratory**; **(b)** **certified values of CRMs** from a competent producer with stated traceability to SI; **(c)** direct realization of SI units | `traceability_route` enum per calibration record with mandatory supporting evidence |
| 6.5.3 | Where SI traceability is not technically possible, demonstrate traceability to an appropriate reference — CRM certified values from a competent producer, or **results of reference measurement procedures, specified methods or consensus standards** clearly described and accepted as fit for purpose, ensured by suitable comparison | Support a non-SI route with a mandatory justification field. Relevant for several textile/silk parameters that are method-defined rather than SI-derived |

**NABL 142** (Policy on Metrological Traceability of Measurement Results, Issue 07, 11-Jan-2021), aligned to **ILAC P10:07/2020**, sets the acceptable route hierarchy: (1) **NPL India** or an NMI covered by the **CIPM MRA**; (2) a **NABL-accredited or ILAC-Arrangement-accredited** calibration laboratory **whose accredited scope covers the specific calibration**; (3) where neither is possible, a calibration laboratory meeting ISO/IEC 17025 criteria. For CRMs: producers whose service appears in the BIPM KCDB, or values covered by the JCTLM database; otherwise the CAB must demonstrate the RM came from a competent producer.

**→ Software implication:** the calibration record must capture the **calibrating lab's accreditation certificate number and the specific scope line** relied on, plus a `traceability_tier` (1/2/3) and, for tier 3, a justification. Validate expiry of the calibrating lab's accreditation. This turns a routine assessor question ("show me that your balance calibrator's scope actually covers this range") into a click.

---

## 6. Clauses 6.4 / 6.6 Consumables & reference materials → Stock module spec

ISO 17025 handles this in an unobvious place: **reagents, consumables and reference materials are swept into clause 6.4 "Equipment"** by 6.4.1, and their sourcing is governed by **6.6 Externally provided products and services**.

| Clause | Requirement | Software implication |
|---|---|---|
| 6.4.1 | "Equipment" **includes** measurement standards, **reference materials**, reference data, **reagents, consumables** or auxiliary apparatus which can influence the result | Consumables and RMs inherit the 6.4 control regime: unique ID, verification before use, records, status |
| 6.4.13(f) | Records shall include "**documentation of reference materials, results, acceptance criteria, relevant dates and the period of validity**" | Per-lot record: Certificate of Analysis / RM certificate (as an attached file), certified value(s) + stated MU, acceptance criteria, dates (manufacture, receipt, opening, expiry, re-test), **period of validity** |
| 6.4.1 Note | RMs from producers meeting **ISO 17034** come with a product information sheet/certificate specifying homogeneity and stability and, for CRMs, certified values with associated MU and metrological traceability. "Reference materials **should** be used from producers that meet ISO 17034." ISO Guide 33 (selection and use), ISO Guide 80 (in-house QC materials) | Flag per RM: `producer_iso17034_accredited` (boolean + accreditation number). Support in-house QC materials with their own characterisation record |
| 6.4.4 | Verify conformance to specified requirements **before being placed into service** | Incoming inspection / acceptance record per lot, against defined acceptance criteria, before the lot can be consumed |
| 6.6.1 | Ensure only **suitable** externally provided products and services are used — those (a) incorporated into the lab's own activities, (b) provided directly to the customer as received, (c) used to support lab operation | Purchase requirements defined per item type |
| 6.6.2 | Communicate requirements to external providers for: **(a)** products/services to be provided; **(b)** the **acceptance criteria**; **(c)** competence, including required qualification of personnel; **(d)** activities the lab or its customer intends to perform at the provider's premises | Purchase order template must carry technical acceptance criteria, not just item + price. Bridge to CloudZoo's purchasing |
| 6.6.3 | **Procedure and retained records** for: **(a)** defining, reviewing and approving the lab's requirements; **(b)** defining criteria for **evaluation, selection, monitoring of performance and re-evaluation** of external providers; **(c)** ensuring conformity **before use or direct provision to the customer**; **(d)** taking actions arising from evaluations, monitoring and re-evaluations | **Approved Supplier List** with evaluation scores, evaluation dates, next re-evaluation due date, and an action log. Block purchase requisitions to unapproved/lapsed suppliers |

**→ Software implication (Stock / Controlled Consumables module):**

| # | Requirement |
|---|---|
| S1 | **Lot/batch is the unit of control, not the SKU.** `consumable_lot`: item, supplier, lot/batch no., PO ref, manufacture date, received date, quantity received, **expiry date**, `opened_at`, `open_shelf_life_days` (many reagents have a shorter in-use life than the sealed expiry), storage conditions required, storage location, current quantity, status. |
| S2 | Attach the **Certificate of Analysis / RM certificate** as an immutable file per lot, with certified value, MU, traceability statement, homogeneity/stability data. |
| S3 | **Consumption linkage:** every test activity that uses a controlled reagent, standard or RM records the **lot ID actually used**. This is the enabler for retrospective impact analysis when a lot turns out to be bad — the same engine as §5.2, driven by lot instead of equipment. |
| S4 | **Hard block on expired lots** at result-entry time — evaluated against `observed_at`, not against today. Break-glass override is role-restricted, reason-mandatory, raises a Nonconforming Work record. |
| S5 | Lot state machine: `QUARANTINED (received, not yet accepted) → APPROVED → IN_USE → EXHAUSTED / EXPIRED / REJECTED / DISPOSED`. Only `APPROVED`/`IN_USE` lots are selectable. Disposal record retained. |
| S6 | Expiry and re-test alerts; a due-report for items expiring within N days. |
| S7 | RM-specific fields: certified value(s), uncertainty, `valid_until`, `traceability_route`, `producer_iso17034_accredited`. Where the RM defines an acceptance limit for a QC check, the value flows into the control-chart engine (§8). |
| S8 | NABL 127 note for regulatory schemes: **purchase documents for chemicals/media must be kept until the validity of the chemical/media** (and observation records, report copies and purchase documents for a minimum of three years). Wire this into the retention policy table. |
| S9 | Reuse CloudZoo's inventory primitives for quantity/valuation, but **do not let the ERP's stock logic own lot status** — QC acceptance and expiry blocking are LIMS-side decisions. Consider CloudZoo as system-of-record for value, LIMS as system-of-record for fitness-for-use. |

---

## 7. Clause 6.2 Personnel → Role / authorisation matrix requirement

### 7.1 The clauses

| Clause | Requirement |
|---|---|
| 6.2.1 | All personnel, internal or external, who could influence laboratory activities shall act **impartially**, be **competent**, and **work in accordance with the laboratory's management system** |
| 6.2.2 | **Document the competence requirements for each function** influencing results — including education, qualification, training, technical knowledge, skills and experience |
| 6.2.3 | Ensure personnel have the competence to perform the activities for which they are responsible **and to evaluate the significance of deviations** |
| 6.2.4 | Communicate to personnel their **duties, responsibilities and authorities** |
| 6.2.5 | Have **procedure(s) and retain records** for: **(a)** determining competence requirements; **(b)** selection of personnel; **(c)** training; **(d)** supervision; **(e)** **authorization**; **(f)** **monitoring of competence** |
| 6.2.6 | **Authorize personnel to perform specific laboratory activities**, including but not limited to: **(a)** development, modification, verification and validation of methods; **(b)** **analysis of results, including statements of conformity or opinions and interpretations**; **(c)** **report, review and authorization of results** |

NABL 160A cl. 6.2.6 renders this as an explicit **table** of Activity × Authorised person — i.e. NABL expects a matrix, not a prose paragraph.

### 7.2 NABL overlay — the "Authorised Signatory"

- Personnel authorised to **report, review and authorise results** are, in NABL's terminology, **Authorised Signatories**. Their technical competence is **verified by the NABL assessment team**, and they must meet NABL's minimum qualification and experience requirements. *(This wording is from **NABL 165**, which has since been **WITHDRAWN**; NABL's own note directs users to the application forms — **NABL 151** for testing laboratories — for the qualification and experience requirements. Treat the requirement as live, the citation as superseded.)*
- **NABL 131 cl. 31(b)** (Issue 08, Amd. 04, 23-Jan-2026): the CAB shall inform NABL **within 15 days** of significant changes to "its resources not limited to personnel, facilities, equipment... **authorized personnel responsible to report, review and authorization of the results**."
- **NABL 131 cl. 17(i)/(j)**: NABL assessors must be given access to assess the competence of the persons responsible to report/review/authorise results, and of those responsible for opinions and interpretations.
- **NABL 133 cl. 6.3**: reports issued under the accredited scope shall meet the requirements of ISO/IEC 17025 **and of NABL** — "e.g. authorization by person declared to NABL as responsible for review, report and authorization of results."

**→ Software implication (Competence & Authorisation module):**

| # | Requirement |
|---|---|
| P1 | **Two separate concepts, both needed.** (i) **RBAC role** — what screens/actions a user may reach. (ii) **Technical authorisation matrix** — `personnel × method (or method-version) × activity`, where activity ∈ {PERFORM, CHECK/CALCULATE, ANALYSE_RESULTS, ISSUE_STATEMENT_OF_CONFORMITY, GIVE_OPINION_INTERPRETATION, TECHNICAL_REVIEW, AUTHORISE_REPORT, DEVELOP_MODIFY_VERIFY_VALIDATE_METHOD, SAMPLE, OPERATE_EQUIPMENT_X}. A "Senior Analyst" role is **not** a substitute for per-method authorisation. |
| P2 | Each authorisation row is **time-bounded**: `valid_from`, `valid_to`, `authorised_by`, `basis` (training record / competence assessment / NABL approval ref), `suspended_at` + reason. |
| P3 | **Enforcement must be at the moment of action and evaluated against the date of the action.** Refuse result entry, review, conformity statement, opinion or authorisation if the actor lacks a valid authorisation for that method+activity at `observed_at` / `reviewed_at`. Log every refusal. |
| P4 | **Segregation of duties**, configurable and defaulted on: performer ≠ checker; checker ≠ authoriser (or at minimum performer ≠ authoriser). Enforced, with a role-restricted, reason-mandatory override that raises an NC. |
| P5 | **Authorised Signatory register** as a distinct, NABL-facing object: person, scope lines (discipline/group/product/parameter/method) they may sign for, NABL approval reference and date, location (accreditation is location-specific), designated **alternate**, and `declared_to_nabl_on`. The report engine must verify the authoriser is an Authorised Signatory **for the specific parameters on that report** — not just any signatory. |
| P6 | **15-day notification workflow:** adding, removing, suspending or changing an Authorised Signatory generates a task with a 15-day due date to notify NABL, and records the notification (date, mode, reference). |
| P7 | **Competence lifecycle records:** competence requirements per function (the JD/spec itself, versioned); training plan and completion; supervision records for personnel not yet independently authorised; **periodic competence monitoring** with a due date and outcome. Expiry of a competence monitoring cycle automatically flags the authorisation for review (configurable: warn vs auto-suspend). |
| P8 | Retrospective query: "as at date D, who was authorised for method M?" — needed for assessment and for defending old reports. Requires authorisations to be temporally versioned, not just current-state. |
| P9 | Opinions & interpretations are a **separately authorised** activity (7.8.7.1 + 6.2.6(b)) and typically a much shorter list of people. Print gating on the report accordingly. |

---

## 8. Clause 7.2 Methods + 7.7 Ensuring validity of results → Method master, QC, PT

### 8.1 Clause 7.2 Selection, verification and validation of methods

| Clause | Requirement | Software implication |
|---|---|---|
| 7.2.1.1 | Use appropriate methods and procedures for all activities, and where appropriate for **evaluation of MU** and **statistical techniques for data analysis** | Method Master holds the MU model and the statistical treatment, not just a title |
| 7.2.1.2 | All methods, procedures and supporting documentation (instructions, standards, manuals, reference data) shall be **kept up to date and readily available to personnel** | Documents attached to the method version, viewable from the result-entry screen. No hunting in a shared drive |
| 7.2.1.3 | **Use the latest valid version** of a method unless not appropriate or possible; supplement with additional detail where necessary for consistent application | Version/revision is a first-class field. A superseded version cannot be selected for new work unless explicitly permitted with a reason (e.g. customer/regulator requires the older edition) |
| 7.2.1.5 | When the customer does not specify the method, **select an appropriate method and inform the customer** of the choice | Record `method_selected_by_lab = true` and evidence of customer intimation |
| 7.2.1.5–7.2.1.6 | **Verify** the lab can properly perform a method before introducing it; **retain verification records**; **if the method is revised by the issuing body, repeat verification** to the extent necessary | Per method-version: `verification_record` (procedure, results, conclusion, by whom, when). **A method version cannot be activated for live testing without a verification record.** Publication of a new edition (e.g. IS/ISO revision) auto-creates a re-verification task |
| 7.2.1.7 | **Deviations from methods shall occur only if the deviation has been documented, technically justified, authorized, and accepted by the customer** (acceptance may be agreed in advance in the contract) | **Deviation object** with four mandatory gates: description, technical justification, internal authoriser, customer acceptance (with evidence + date, or reference to the contract clause pre-agreeing it). A test cannot be released with an unapproved deviation. Approved deviations **auto-print** under report element 7.8.2.1(n) |
| 7.2.2.1–7.2.2.4 | **Validate** non-standard methods, laboratory-developed methods, and standard methods used outside their intended scope or otherwise modified. Where changes are made to a validated method, determine the influence and revalidate if the original validation is affected. Performance characteristics shall be relevant to customers' needs. **Retain validation records: (a) the validation procedure used; (b) specification of the requirements; (c) determination of the performance characteristics; (d) results obtained; (e) a statement on the validity of the method, detailing its fitness for the intended use** | Validation record with those five mandatory sections; performance characteristics as structured data (range, accuracy, MU, LOD, LOQ, selectivity, linearity, repeatability/reproducibility, robustness, bias). A method-version change triggers an impact assessment task |

**→ Method Master schema (minimum):** `method_id`, `code`, `title`, `issuing_body` (BIS / ISO / ISA / CSTRI in-house), `designation` (e.g. `IS 15409`), **`edition_year` / `revision`**, `status` (`DRAFT / VERIFIED / ACTIVE / SUPERSEDED / WITHDRAWN`), `effective_from`, `effective_to`, `superseded_by`, `is_standard_method` (bool), `validation_required` (bool), `verification_record_id`, `validation_record_id`, `parameters[]`, `units`, `rounding_rule`, `significant_figures`, `calculation_formula_version`, `mu_model`, `mu_value`, `mu_report_policy`, `environmental_requirements` (T, RH, conditioning), `equipment_types_required[]`, `consumables_required[]`, `qc_plan_id`, `accredited_scope_link`, `attached_documents[]`.

Every result row must store **`method_version_id`**, not `method_id`. Otherwise a 2029 assessor cannot tell which edition produced a 2026 number.

### 8.2 Clause 7.7 Ensuring the validity of results

**7.7.1** — Procedure for monitoring the validity of results. "The resulting data shall be recorded in such a way that **trends are detectable** and, where practicable, **statistical techniques shall be applied to review the results**." Monitoring shall be planned and reviewed and include, where appropriate:

| ID | Technique | Software implication |
|---|---|---|
| (a) | use of reference materials or **quality control materials** | QC sample type; links to RM/QC lot (§6) |
| (b) | use of **alternative instrumentation** calibrated to provide traceable results | Cross-instrument comparison record |
| (c) | **functional checks** of measuring and testing equipment | Scheduled check + result |
| (d) | use of **check or working standards with control charts**, where applicable | **Control-chart engine** — see below |
| (e) | **intermediate checks** on measuring equipment | Links to §5 (6.4.10) |
| (f) | **replicate tests** using the same or different methods | Replicate structure; automatic repeatability evaluation against the method's stated limit |
| (g) | **retesting of retained items** | Requires sample retention tracking (§10) |
| (h) | **correlation of results for different characteristics** of an item | Cross-parameter plausibility rules (e.g. denier vs tenacity vs elongation consistency for a silk yarn) |
| (i) | **review of reported results** | Periodic review record, distinct from per-report review |
| (j) | **intralaboratory comparisons** | Analyst-vs-analyst / instrument-vs-instrument comparison object |
| (k) | **testing of blind sample(s)** | Blind/spiked QC sample injected into the routine workflow — see §13 for the distinction from customer blinding |

**7.7.2** — Monitor performance by **comparison with results of other laboratories**, where available and appropriate; planned and reviewed; including either or both: **(a) participation in proficiency testing**; **(b) participation in interlaboratory comparisons other than proficiency testing**. (Note: PT providers meeting **ISO/IEC 17043** are considered competent.)

**7.7.3** — Data from monitoring activities shall be **analysed, used to control and, if applicable, improve** the laboratory's activities. **"If the results of the analysis of data from monitoring activities are found to be outside pre-defined criteria, appropriate action shall be taken to prevent incorrect results from being reported."**

**→ Software implication (QC & Validity module):**

| # | Requirement |
|---|---|
| Q1 | **QC Plan per method**: which techniques from (a)–(k) apply, frequency (per batch / per n samples / daily / weekly), acceptance criteria, responsible role. |
| Q2 | **Control charts** (Shewhart X / X-bar / R / moving range, as appropriate) with configurable centre line and control limits, and **automated Westgard-style rule evaluation** (e.g. 1-3s, 2-2s, R-4s, 4-1s, 10-x — configurable). Charts must be viewable, printable and time-stamped. |
| Q3 | **7.7.3 is the enforcement clause and must be implemented as a gate, not a dashboard.** When a QC result breaches pre-defined criteria, the system must **automatically withhold release of the associated batch of customer results** until a named authorised person dispositions the breach. This single behaviour is the difference between a LIMS that supports 7.7.3 and one that merely charts data. |
| Q4 | Every QC event links to: the analyst, the equipment, the reagent/RM lot, the environmental record, and the **customer samples in the same run** — so the withhold-and-release logic and the retrospective impact query both work. |
| Q5 | **PT / ILC register**: scheme name, provider (+ ISO/IEC 17043 accreditation status), round/year, discipline, group, sub-group, parameter, matrix, date, assigned value, reported value, **z-score / En number**, outcome (`SATISFACTORY / QUESTIONABLE / UNSATISFACTORY`), root cause analysis, corrective action, effectiveness verification, evidence attachments. |
| Q6 | **NABL 163** (Policy for Participation in Proficiency Testing Activities): the accredited laboratory shall have a **2-year PT participation plan** covering all accredited groups as practicable under each discipline, submitted to NABL as **Form 18 (Annexure A)**, with frequency sufficient to ensure that **major sub-groups, analytes and materials/matrices in the scope are covered over the two-year period**. Pre-accreditation: successful participation in at least one PT programme per discipline applied for. Where no accredited PT provider exists for a scope, participate in **inter-laboratory comparisons**. Satisfactory performance defined by z-score / En number; **unsatisfactory performance requires root cause analysis and corrective action, and repeated failure can lead to scope reduction.** → Software must produce the **2-year plan as a coverage matrix against the accredited scope**, show gaps, track planned-vs-actual, and flag scope lines with no PT/ILC coverage in the rolling two-year window. |
| Q7 | Link an unsatisfactory PT outcome to the Nonconforming Work register (§11) and, where previous results are implicated, to the retrospective impact engine (§5.2). |

---

## 9. Clause 7.1 Review of requests, tenders and contracts → Sample registration screen

The single most useful design insight: **clause 7.1 dictates the content of the sample-registration form.** Everything below must be captured *before* testing starts, because several items (decision rule, method choice, deviations, subcontracting) cannot be retro-fitted onto a report.

| Clause | Requirement | Field / behaviour at registration |
|---|---|---|
| 7.1.1(a) | Requirements are **adequately defined, documented and understood** | Structured request: product, sample description, parameters requested, specification/standard against which conformity is wanted, turnaround, report delivery mode |
| 7.1.1(b) | The laboratory **has the capability and resources** to meet the requirements | **Capability check** against the Scope/Method Master: is each requested parameter × product supported? Is there an authorised analyst and an in-calibration instrument? Is capacity available? Record the reviewer, timestamp and outcome. This is a *recorded decision*, not a silent lookup |
| 7.1.1(c) | Where **external providers** are used, apply 6.6, **advise the customer of the specific laboratory activities to be performed by the external provider, and gain the customer's approval** | Per-parameter `subcontracted_to` + **customer approval record** (who, when, evidence). Blocks release until approval exists. Flows to report element 7.8.2.1(p) "clear identification when results are from external providers". NABL 133 also requires accredited scopes obtained from external subcontractors to be identified |
| 7.1.1(d) | **Appropriate methods or procedures are selected** and capable of meeting the customer's requirements | Method + version chosen per parameter and recorded on the request; if the lab chose it (7.2.1.5), record customer intimation |
| 7.1.2 | **Inform the customer when the method requested is inappropriate or out of date** | Automatic check of requested method version against Method Master status; if `SUPERSEDED/WITHDRAWN`, force an intimation record before proceeding |
| 7.1.3 | Where a statement of conformity is requested, the **decision rule shall be clearly defined**; unless inherent in the specification, it shall be **communicated to and agreed with the customer** | Mandatory `decision_rule_id` + `customer_agreed_on` + evidence, captured at registration. Locked thereafter |
| 7.1.4 | Differences between request/tender and contract **resolved before activities commence**; each contract acceptable to both parties; **deviations requested by the customer shall not impact laboratory integrity or the validity of results** | Registration cannot be confirmed with unresolved discrepancies. Customer-requested deviations require an impact assessment + authoriser |
| 7.1.5 | **Inform the customer of any deviation from the contract** | Notification record with date and channel |
| 7.1.6 | If a contract is **amended after work has commenced**, the **contract review shall be repeated** and amendments **communicated to all affected personnel** | Registration is versioned; an amendment creates a new review record and notifies assigned analysts in-app |
| 7.1.7 | Cooperate with customers — including reasonable access to witness customer-specific activities | Witness-visit record |
| 7.1.8 | **Retain records of reviews, including any significant changes**, and **records of pertinent discussions with a customer** relating to requirements or results | A **customer communication log** attached to the job: date, channel (phone/email/in person), participants, substance, outcome. Assessors ask for this and it is almost always missing in home-grown systems |

**→ Additional CloudZoo bridge note:** the registration record is the natural join to the ERP. `job` → CloudZoo customer master (for identity, GSTIN, billing) and → CloudZoo invoicing (fee per parameter from a Test Fee Master). Keep the LIMS as system-of-record for the *technical* review; keep CloudZoo as system-of-record for the *commercial* contract. Do not let an unpaid-invoice hold silently suppress a technical release decision — that would be a 4.1 impartiality risk. If commercial holds exist, make them explicit, logged, and separated from technical release.

---

## 10. Clause 7.4 Handling of test items → Sample lifecycle & chain of custody

| Clause | Requirement | Software implication |
|---|---|---|
| 7.4.1 | Procedure for **transportation, receipt, handling, protection, storage, retention, and disposal or return** of items, including provisions to protect the **integrity** of the item and the interests of the laboratory and the customer. Precautions against **deterioration, contamination, loss or damage** during handling, transporting, storing/waiting and preparation. **Handling instructions provided with the item shall be followed** | Sample lifecycle state machine + a `handling_instructions` field carried from receipt to bench |
| 7.4.2 | System for the **unambiguous identification** of items. Identification **retained while the item is under the responsibility of the laboratory**. The system shall ensure items **will not be confused physically or when referred to in records or other documents**. The system shall, if appropriate, accommodate **sub-division of an item or groups of items and the transfer of items** | See below — this is the sample ID + barcode + sub-sample requirement |
| 7.4.3 | **Upon receipt, deviations from specified conditions shall be recorded.** Where there is **doubt about the suitability** of an item, or it **does not conform to the description provided**, **consult the customer for further instructions before proceeding and record the results of this consultation.** Where the customer requires testing acknowledging a deviation, **include a disclaimer in the report indicating which results may be affected** | Mandatory `condition_on_receipt` + `deviation_on_receipt[]`; a **customer consultation record** that gates progression; auto-inserted report disclaimer naming the affected results |
| 7.4.4 | Where items need to be **stored or conditioned under specified environmental conditions**, those conditions shall be **maintained, monitored and recorded** | Storage location with monitored T/RH; conditioning record per sample (textile conditioning is a method requirement, not optional housekeeping) |

**→ Software implication (Sample module):**

| # | Requirement |
|---|---|
| I1 | **Sample ID** — lab-unique, human-readable, barcode/QR encoded, printed on the label. Retained for the whole time the item is in the lab's custody. Never reused. |
| I2 | **Sub-sampling / sub-division tree**: parent sample → sub-samples / specimens / test portions, each with its own ID, each traceable to the parent, each with quantity accounting. Also support **grouping** (a lot of many skeins registered as one item) and **transfer** (bench-to-bench, section-to-section, lab-to-subcontractor). |
| I3 | **Chain of custody log** — an append-only event stream: `RECEIVED / ACKNOWLEDGED / MOVED / ISSUED_TO_ANALYST / RETURNED_TO_STORE / SUB-DIVIDED / CONSUMED / RETAINED / RETURNED_TO_CUSTOMER / DISPOSED`, each with from-actor, to-actor, timestamp, location, and (where physical handover matters) an acknowledgement by the receiver. Barcode scan at each hop. |
| I4 | **Condition-on-receipt** captured with structured deviation codes + free text + **photographs**. Photos are technical records and inherit the audit/retention rules. |
| I5 | **Suitability hold:** a `DOUBT_RAISED` state that blocks testing until a customer consultation record exists with the customer's instruction. The consultation record's outcome drives whether a report disclaimer is auto-added. |
| I6 | **Retention & disposal:** `retain_until` per sample (from a policy keyed by product/parameter/scheme), physical retention location, `disposal_authorised_by`, `disposal_method`, `disposal_date`, `disposal_witness` where required, or `returned_to_customer_on` + acknowledgement. Retained samples must be findable — 7.7.1(g) "retesting of retained items" depends on it. |
| I7 | Retention periods: ISO 17025 does not fix them. **NABL 127** fixes sample retention scheme-wise and discipline-wise for regulatory schemes (with three years for records). For silk/textile, set them by lab policy and make them configurable per product group. |
| I8 | Consumed/destroyed samples: many textile tests are destructive. Record `destroyed_in_testing = true` with the quantity consumed, so a retest request gets an honest "insufficient sample" answer instead of a promise the lab cannot keep. |

---

## 11. Clauses 7.9 Complaints and 7.10 Nonconforming work → Two registers

### 11.1 Clause 7.9 Complaints

| Clause | Requirement | Software implication |
|---|---|---|
| 7.9.1 | **Documented process** to receive, evaluate and make decisions on complaints | Complaint register |
| 7.9.2 | A **description of the handling process shall be available to any interested party on request** | Publishable process description (also satisfies a common assessor request) |
| 7.9.3 | On receipt, **confirm whether the complaint relates to laboratory activities the lab is responsible for**, and if so, deal with it | `in_scope` decision with a recorded rationale; out-of-scope complaints are closed with a reason, not deleted |
| 7.9.4 | The laboratory is **responsible for all decisions at all levels** of the complaint-handling process | Decisions attributable to named people |
| 7.9.5 | The process shall include at least: **(a)** description of the process for receiving, validating, investigating and deciding actions; **(b)** **tracking and recording complaints, including actions undertaken to resolve them**; **(c)** ensuring appropriate action is taken | Workflow with action items, owners and due dates |
| 7.9.6 | Take responsibility for **gathering and verifying all necessary information to validate** the complaint | Evidence attachments; validation outcome |
| 7.9.7 | Whenever possible, **acknowledge receipt**, provide **progress reports** and the **outcome** to the complainant | Acknowledgement + progress-update + outcome communications, each logged with date and channel; SLA timers |
| 7.9.7 | **Outcomes communicated to the complainant shall be made by, or reviewed and approved by, individual(s) not involved in the original laboratory activities in question** (may be external personnel) | **Hard enforcement:** the system must block the closure/communication approval if the approver appears anywhere in the audit trail of the complained-about job. This is a genuinely useful automated control — humans get it wrong constantly in small labs |
| 7.9.7 | Whenever possible, give **formal notice of the end** of complaint handling | Closure notice record |

Also relevant: **NABL 132** (Procedure for Dealing with Complaints) and **NABL 132A** (complaints related to NABL itself) — a complaint can escalate to NABL, so the register should hold an `escalated_to_nabl` reference.

### 11.2 Clause 7.10 Nonconforming work

Applies when **any aspect** of the lab's activities or results does not conform to its own procedures or the agreed customer requirements — the standard's own examples: *"equipment or environmental conditions are out of specified limits, results of monitoring fail to meet specified criteria."*

| Clause | Requirement | Software implication |
|---|---|---|
| 7.10.1(a) | **Responsibilities and authorities** for management of nonconforming work are defined | Role-based routing |
| 7.10.1(b) | **Actions (including halting or repeating of work and withholding of reports, as necessary) are based upon the risk levels** established by the laboratory | `risk_level` field driving mandatory actions; **`WITHHOLD_REPORT` must be an actual system state that blocks issue**, not a note |
| 7.10.1(c) | **An evaluation is made of the significance of the nonconforming work, including an impact analysis on previous results** | The retrospective impact engine (§5.2), generalised: given a cause (equipment, reagent lot, analyst, method version, environmental excursion, QC failure, PT failure), list every affected test/report in the window |
| 7.10.1(d) | A **decision is taken on the acceptability** of the nonconforming work | Named disposition with justification |
| 7.10.1(e) | **Where necessary, the customer is notified and work is recalled** | Notification + **recall register**: which reports, which customers, notified when, acknowledged when |
| 7.10.1(f) | **Responsibility for authorizing the resumption of work** is defined | `resumption_authorised_by` gate; work stays halted until it exists |
| 7.10.2 | **Retain records of nonconforming work and actions** as specified in 7.10.1 (b) to (f) | Those five fields are mandatory-not-null on closure |
| 7.10.3 | Where the evaluation indicates the nonconformity **could recur**, or there is **doubt about conformity of the laboratory's operations with its own management system**, **implement corrective action** (8.7) | `corrective_action_required` flag; link to a CAPA record with root cause analysis, action, effectiveness verification, closure |

**→ Cross-links the software must create automatically** (this is what makes the registers real rather than decorative):

```
Equipment out-of-cal / fail        ─┐
Reagent or RM lot rejected /expired ├─→  NONCONFORMING WORK  ─→ impact analysis ─→ report amendment (7.8.8)
QC / control-chart breach          │                          ─→ customer notification + recall
PT / ILC unsatisfactory result     │                          ─→ CAPA (8.7)
Environmental excursion            │
Unauthorised-analyst override      │
Method deviation without approval  │
Report amendment raised            ─┘
Complaint found valid              ─→ NONCONFORMING WORK (where it concerns lab activities)
```

---

## 12. Clause 7.11 Control of data and information management → What 17025 says about the LIMS itself

This is the clause the developer will be assessed against directly. Quoted substance:

| Clause | Requirement | Software implication |
|---|---|---|
| 7.11.1 | The laboratory shall **have access to the data and information needed** to perform laboratory activities | Availability/uptime and offline-degradation plan; methods and reference data reachable at the bench |
| 7.11.2 | The **laboratory information management system(s) used for the collection, processing, recording, reporting, storage or retrieval of data shall be validated for functionality, including the proper functioning of interfaces within the LIMS, by the laboratory before introduction.** Whenever there are **any changes, including laboratory software configuration or modifications to commercial off-the-shelf software, they shall be authorized, documented and validated before implementation** | See the validation package below. Note this applies to **configuration changes**, not just code — so a change to a calculation formula, a decision rule, or a report template is a validated change |
| 7.11.2 Note 1 | "LIMS" **includes both computerized and non-computerized systems** | Paper worksheets still in use are in scope; plan the paper→digital transition explicitly |
| 7.11.2 Note 2 | **"Commercial off-the-shelf software in general use within its designed application range can be considered to be sufficiently validated."** | This is the key licence-to-be-pragmatic. The OS, the database engine, the PDF library, and arguably CloudZoo's stock ERP primitives are COTS. **But** anything the developer writes or configures for this lab — the calculation engine, the report templates, the ULR builder, the decision-rule engine, the QC rules — is **not** COTS and **must be validated by the laboratory**. Say this plainly in the spec so the developer budgets for it |
| 7.11.3(a) | LIMS shall be **protected from unauthorized access** | Named individual accounts (**no shared logins** — shared logins destroy the 7.5.1 "identity of personnel" requirement); password policy; MFA for authorisers if feasible; role-based access; session timeout; account lockout; joiner-mover-leaver process with prompt deactivation |
| 7.11.3(b) | **Safeguarded against tampering and loss** | Append-only audit trail (§4.2); DB-level revocation of UPDATE/DELETE on issued reports and audit tables; report PDF hashing; **backups** (defined schedule, off-site/second-location copy, encryption, **documented and logged restore tests**), RPO/RTO stated |
| 7.11.3(c) | **Operated in an environment that complies with supplier or laboratory specifications** (or, for non-computerized systems, conditions safeguarding accuracy of manual recording and transcription) | Documented infrastructure spec: OS, DB, runtime versions, server location, power/UPS, patching policy. Deviating from it is a change requiring 7.11.2 treatment |
| 7.11.3(d) | **Maintained in a manner that ensures the integrity of the data and information** | Referential integrity and constraints enforced in the DB (not only in application code); transactional writes; checksums on stored files; periodic integrity verification job |
| 7.11.3(e) | **Include recording system failures and the appropriate immediate and corrective actions** | A **System Incident Log inside the application**: failure, detected when, by whom, impact on data, immediate action, corrective action, closure. Assessors ask for this and it is nearly always absent |
| 7.11.4 | Where the LIMS is **managed and maintained off-site or through an external provider**, the laboratory shall ensure that the provider or operator **complies with all applicable requirements of this document** | If hosted (cloud/vendor-managed): a written agreement covering **confidentiality (4.2), impartiality, data ownership, data location, breach notification, sub-processors, exit/data-return** — plus an entry in the Approved Supplier List with periodic re-evaluation (6.6.3(b)). For a Government of India lab, also check data-localisation and departmental IT policy |
| 7.11.5 | Ensure **instructions, manuals and reference data relevant to the LIMS are made readily available to personnel** | In-app help, user manual under document control (8.3), version-matched to the release |
| 7.11.6 | **Calculations and data transfers shall be checked in an appropriate and systematic manner** | Two things: (i) a **verified calculation library** with unit tests per method formula, re-run on every release, evidence retained; (ii) a **human check step** for calculations and transfers before release (the `checked_by` of §4.1). Instrument-interface transfers must be checked/reconciled and logged |

### 12.1 The validation package the developer must produce (deliverable, not optional)

Because the LIMS is bespoke, 7.11.2 obliges the *laboratory* to validate it. Build the evidence as you go, not at the end:

1. **User Requirements Specification** — this spec, signed by the lab.
2. **Risk assessment** of the software (which failures could produce a wrong reported result).
3. **Design/configuration documentation** — including the calculation formulae per method and the ULR/report templates.
4. **Test protocol and executed test records (IQ/OQ/PQ-style):** positive and negative cases for every enforced gate — expired calibration blocked, expired reagent blocked, unauthorised analyst blocked, out-of-scope parameter cannot get a ULR/symbol, issued report cannot be edited, audit trail captures old and new values with reason, QC breach withholds release, retrospective impact query returns the right set, correct ULR string for each of the three formats, correct rounding/significant figures, correct decision-rule PASS/FAIL at and near the limit.
5. **Traceability matrix** requirement → test case → result.
6. **Validation summary report** with a fitness-for-intended-use statement, authorised by the lab.
7. **Change control procedure** — every subsequent release or configuration change is authorized, documented and validated **before** implementation, with a regression suite. This is a permanent operating obligation, not a one-off.
8. **Backup/restore test records** and the **System Incident Log** kept live.
9. **User access review** record (periodic).

---

## 13. Confidentiality (4.2) and "testers must not see customer identity" (blind testing)

### 13.1 What clause 4.2 actually says

| Clause | Requirement |
|---|---|
| 4.2.1 | The laboratory shall be responsible, **through legally enforceable commitments**, for the **management of all information obtained or created** during the performance of laboratory activities. The laboratory shall **inform the customer in advance of the information it intends to place in the public domain**. Except for information the customer makes publicly available, or as agreed between laboratory and customer, **all other information is considered proprietary and shall be regarded as confidential** |
| 4.2.2 | When the laboratory is **required by law or authorized by contractual arrangements to release confidential information**, the customer or individual concerned **shall be notified of the information provided, unless prohibited by law** |
| 4.2.3 | Information about the customer **obtained from sources other than the customer** (e.g. complainant, regulators) **shall be confidential between the customer and the laboratory**. The **provider (source) of this information shall be confidential to the laboratory and shall not be shared with the customer**, unless agreed by the source |
| 4.2.4 | **Personnel, including committee members, contractors, personnel of external bodies, or individuals acting on the laboratory's behalf, shall keep confidential all information obtained or created** during the performance of laboratory activities |

### 13.2 Direct answer on blinding

**Blinding the customer's identity from the analyst is PERMITTED and is a recognised good practice — but it is NOT REQUIRED by ISO/IEC 17025 or by NABL, and it does not by itself satisfy anything.** Its home in the standard is **clause 4.1 Impartiality**, not 4.2:

- **4.1.4:** "The laboratory shall identify risks to its impartiality on an on-going basis," including risks arising from its activities, its relationships, or the relationships of its personnel.
- **4.1.5:** "If a risk to impartiality is identified, the laboratory shall be able to demonstrate how it eliminates or minimizes such risk."

Blind sample coding is the textbook mitigation for the documented risk "the technician performing the test could modify the standard approach to benefit (or disadvantage) a known customer." Assessors evaluate **the process** — did you identify the risk, did you apply a control, did you verify the control works, do you review it — not your choice of control. European Accreditation's guidance is explicit that the assessor should not judge *which* risk-assessment method the laboratory applies, but shall evaluate compliance with 4.1.4.

**For this lab specifically, blinding is a well-founded control.** RSTRS Dharmavaram is a government unit testing for local reelers, twisters, weavers and traders in a concentrated silk cluster. Analysts will personally recognise many customer names. That is a real, documentable impartiality risk. Recommend it — but recommend it as a **risk-register entry with a verified control**, not as a feature that exists for its own sake.

### 13.3 Does blinding conflict with anything? Four real constraints

| Constraint | Clause | Consequence for the design |
|---|---|---|
| **The report must name the customer** | 7.8.2.1(e) — name and contact information of the customer | Blinding applies to the **bench/analyst view only**. It cannot extend to the issued report. The reviewer/authoriser sees the full report including the customer |
| **Identification must remain unambiguous and traceable** | 7.4.2; 7.5.1 | The blind code must be a **surjective, permanent mapping** to the sample record, never a re-used or reconstructed code. Someone authorised must always be able to resolve code → customer, and that resolution must be logged |
| **Customer consultation is sometimes mandatory** | 7.4.3 (unsuitable item), 7.1.6 (contract amendment) | Blinding must not block the workflow. Route consultations through the sample-reception / customer-service role, which is *not* blinded |
| **Blinding leaks in practice** | 4.1.5 requires the control to actually work | Common leaks: recognisable sample types or packaging, the customer's own markings on the skein/hank/carton, sampling staff who also test, the LIMS itself showing the customer name in a sidebar or on a queue list, printed worksheets carrying the job header, invoice screens visible to bench staff. Internal audit must verify effectiveness |

**→ Software implication (Blinding / Confidentiality module):**

| # | Requirement |
|---|---|
| C1 | **Field-level access control, not just screen-level.** `customer_name`, `customer_address`, `contact`, `GSTIN`, `invoice` are attributes visible only to roles with `may_view_customer_identity`. The analyst's work queue shows Sample ID / blind code, product, method, parameters, due date — nothing else. |
| C2 | Analyst-facing **printed worksheets and labels** carry only the blind code. Verify this on the actual template, since it is the usual leak. |
| C3 | An **explicit unblinding event**: who resolved a code to a customer, when, why — logged and reviewable. Unblinding is normal for the reviewer/authoriser; the point is that it is recorded. |
| C4 | Blinding is **role-configurable and can be switched off per section** — do not hardwire it, because for some regulatory schemes the sample arrives already coded by an external body, and for some internal R&D work it is pointless. |
| C5 | **Confidentiality obligations as data:** store signed confidentiality undertakings for employees, contractors, external assessors' escorts and any external LIMS provider (4.2.4 + 7.11.4). Flag missing/expired undertakings. |
| C6 | **Legally-compelled disclosure workflow** (4.2.2): where information is released under law or contract, record what was released, to whom, under what authority, and the **notification to the customer** (unless prohibited by law). For a government lab responding to RTI, court orders or departmental requisitions, this will be used. |
| C7 | **Public-domain intent (4.2.1):** if CSB/CSTRI intends to publish aggregate testing statistics or use commercial test data in R&D or annual reports, the customer must be **informed in advance**. Provide a consent/notification flag on the customer or job record and gate the analytics/publishing exports on it. This is a genuine and commonly overlooked conflict for a government lab that does both commercial testing and internal R&D. |
| C8 | **NABL 131 cl. 50 (Amd. 04, 23-Jan-2026)** requires compliance with India's **Digital Personal Data Protection Act, 2023** — lawful processing, consent, purpose limitation, data security, **data retention**, and data principal rights. → Practical build items: a data inventory of personal data (customer contact persons, employee records), purpose limitation on exports, a retention clock on personal data, and a mechanism to service access/correction/erasure requests **without breaking the immutability of technical records**. Resolve the tension explicitly: technical records and issued reports are retained under a legal/regulatory obligation (an available DPDP basis); marketing/contact data is not. Say so in the spec. |

---

## 14. Electronic signatures / digital approval

### 14.1 What NABL accepts

The clearest NABL wording on this is from **NABL 165** — and **NABL 165 has been WITHDRAWN**. NABL's own note states: *"NABL 165: NABL's Policies for Accreditation (as per ISO/IEC 17025:2017) has been withdrawn. Please refer application form (NABL 151 and NABL 152) for qualification and experience requirements for personnel responsible for report, review and releasing test/calibration results."* The withdrawn text read:

> "NABL approved authorized signatories shall sign on test/calibration reports or certificates. However, **if the laboratory wishes to have an option of using electronic, photographic and mechanical means of reproducing signatures, the laboratory shall demonstrate that such system is safeguarded and the identity of the responsible person for such report shall be clearly identified.**"

**Status: the two-part acceptance test above is still the operative expectation in practice, but the citation is superseded.** It is also fully consistent with what remains in force:

- **ISO/IEC 17025 7.8.1.2 Note:** "Reports can be issued as hard copies **or by electronic means**, provided that the requirements of this document are met."
- **ISO/IEC 17025 7.8.2.1(o):** identification of the person(s) authorizing the report.
- **ISO/IEC 17025 7.11.3(a),(b),(d):** protected from unauthorized access; safeguarded against tampering and loss; data integrity maintained.
- **NABL 133 cl. 6.3:** reports must meet NABL requirements including "authorization by person **declared to NABL** as responsible for review, report and authorization of results."
- **NABL 133** definition: "Endorsed reports or certificates means reports and certificates bearing NABL symbol and/or... **irrespective of the mechanism used for applying the 'endorsement' (e.g. digital, stamp, etc)**." — digital endorsement is explicitly contemplated.
- **NABL 131 cl. 26:** the retained copy must be an **exact replica** of the issued report including header, footer and NABL symbol. A digitally signed PDF satisfies this cleanly; a "re-render on demand" architecture does not.

**Action for the developer:** ask the lab to obtain NABL's current written position, and cite NABL 151 (application form, testing laboratories) rather than NABL 165 in the spec. Mark this **UNVERIFIED as to citation, high-confidence as to substance.**

### 14.2 India-specific legal layer

| Instrument | Provision | Relevance |
|---|---|---|
| **IT Act, 2000, s. 3** | **Digital signature** — asymmetric crypto: private key to sign, public key to verify; establishes signer authenticity and that the record has not been altered | A **DSC** issued by a CCA-licensed Certifying Authority is the strongest option and is the norm for government signing |
| **IT Act, 2000, s. 3A** (inserted by the IT (Amendment) Act, 2008; in force 27-Oct-2009) | **Electronic signature** — technology-neutral; any reliable technique specified in the **Second Schedule**. Must be **unique to and linked to the signatory** so as to uniquely identify them | Broadens what is legally acceptable beyond DSC |
| **IT Act, 2000, s. 2(ta)** | "Electronic signature" = authentication of an electronic record by a technique specified in the Second Schedule; **includes** digital signature | — |
| **IT Act, 2000, s. 4 and s. 5** | Where law requires writing/printed form, that is satisfied by an accessible electronic form; where law requires a signature, an electronic signature recognised under the Act is **legally equivalent to a handwritten signature**. The Act also permits use of electronic records and electronic signatures **by Government and its agencies** | Direct authority for a CSB unit to issue digitally signed reports |
| **Second Schedule + Gazette Notification GSR 61(E), 28-Jan-2015** ("Electronic Signature or Electronic Authentication Technique and Procedure Rules, 2015") | Added **Aadhaar e-KYC eSign** as a valid electronic signature; framework delegated to the **Controller of Certifying Authorities (CCA)**, codified in the CCA **e-Authentication Guidelines dated 03-May-2019** | **eSign** is a legally valid, hardware-free alternative to a USB-token DSC |
| **Indian Evidence Act s. 65B** — now **s. 63, Bharatiya Sakshya Adhiniyam** | A printed/stored electronic record is admissible with a **certificate** as to the record's integrity and manner of production, from the custodian or a person in a responsible official position | If a silk test report is ever contested in a commercial dispute or court, the lab will need to produce this certificate — so the LIMS must be able to state, for any report, how it was produced, from what data, on what system, and prove non-alteration |
| **Indian Evidence Act s. 85B(1) / 85B(2), s. 85C** | Presumption that a **secure electronic record** has **not been altered** since it was signed with a secure digital signature; presumption that the signer intended to sign/approve; presumption that the information in the Electronic Signature Certificate (name, email, signing time) is accurate | This is the payoff for using a proper DSC/eSign rather than a pasted signature image: a **legal presumption of integrity** |
| **Digital Personal Data Protection Act, 2023** | Required by **NABL 131 cl. 50** | See §13, C8 |

### 14.3 Software implications (Signature & Approval module)

| # | Requirement |
|---|---|
| E1 | **Distinguish three tiers and pick deliberately.** (i) *Pasted signature image* — weakest; satisfies "identity clearly identified" only if the system is demonstrably safeguarded; no legal presumption. (ii) *System e-signature* — authenticated user + password re-entry/MFA at the moment of signing, cryptographically bound to the frozen PDF hash, plus a tamper-evident audit record. (iii) *PKI digital signature* — **DSC** (CCA-licensed CA, USB token, ideally in the individual signatory's name) or **Aadhaar eSign** applied to the PDF. **Recommend (iii) as the target, with (ii) as the minimum,** and be explicit that (i) alone is not the design. |
| E2 | **Re-authenticate at the point of signing.** Being logged in is not signing. Capture: signer identity, role, **the specific authorisation basis** (which Authorised Signatory scope line covers these parameters), UTC timestamp, `sha256` of the exact PDF signed, IP/device, and the signature artefact itself. |
| E3 | **Bind the signature to the frozen artefact, not to a database row.** Sign the PDF (or its hash). Any later change to the template, fonts or logo must be unable to alter what was signed — which is the same requirement as NABL 131 cl. 26's "exact replica". |
| E4 | **Signature images are controlled assets:** stored encrypted, access-restricted to the owning user, never bulk-exportable, never applied by another user, with a full usage log. This is the "system is safeguarded" demonstration NABL asks for. Never store them in an open shared folder — the single most common finding on this topic. |
| E5 | **No shared or generic signing accounts. Ever.** This breaks 7.5.1, 7.8.2.1(o), 6.2.6(c) and 7.11.3(a) simultaneously. |
| E6 | **Signature ≠ authorisation.** The system must verify at signing time that the signer holds a valid Authorised Signatory authorisation **for every parameter on the report**, at the date of signing (§7, P5). Log and refuse otherwise. |
| E7 | **Verification path for the recipient:** a digitally signed PDF should validate in any PDF reader trusting the **India CCA root**. Include a short "how to verify this report" note (signature validation + QR verification URL) — genuinely useful to exporters and traders who must satisfy overseas buyers. |
| E8 | **Long-term validity:** DSCs expire (typically 1–3 years). Use signature timestamping (RFC 3161 / trusted timestamp) so a report signed in 2026 still validates in 2031 after the certificate has expired. Without a timestamp, a 5-year retention obligation and a 2-year certificate life collide silently. |
| E9 | **s. 63 BSA / s. 65B certificate generator:** a report-on-demand for any given report stating the system that produced it, the period of regular use, the source data, and the integrity controls — signed by the responsible official. Cheap to build now, expensive to reconstruct later. |
| E10 | Multi-signature support: separate `reviewed_by` and `authorised_by` signature slots (7.8.1.1 + segregation of duties), and where the lab uses countersignature by the Unit Incharge, a third slot — each with its own authorisation check. |

---

## 15. Consolidated module map

| Module | Primary clauses / NABL documents |
|---|---|
| **Numbering (ULR, report no., QR)** | NABL ULR clarification 15.06.2026; NABL certificate-format announcement 06.07.2026; NABL 133 §5.1, 6.2, 6.13; NABL QR circular 18.05.2021 |
| **Customer & Job / Sample Registration** | 7.1.1–7.1.8, 7.2.1.5, 7.8.6/7.1.3 (decision rule), 6.6 (subcontracting) |
| **Sample lifecycle & chain of custody** | 7.4.1–7.4.4, 7.3.3, NABL 127 (scheme retention) |
| **Method Master** | 7.2.1.1–7.2.1.7, 7.2.2.1–7.2.2.4, 7.6 (MU), NABL 120 (discipline/group) |
| **Equipment** | 6.4.1–6.4.13, 6.5.1–6.5.3, NABL 142, 7.10 (impact) |
| **Consumables / Reference Materials (Stock)** | 6.4.1, 6.4.13(f), 6.6.1–6.6.3, NABL 127 (purchase docs) |
| **Personnel, competence & authorisation matrix** | 6.2.1–6.2.6, NABL 131 cl. 17, 31(b), NABL 133 cl. 6.3, NABL 151 |
| **Result entry & technical records** | 7.5.1, 7.5.2, 7.11.6, 6.3.3 (environment) |
| **QC, control charts, PT/ILC** | 7.7.1–7.7.3, NABL 163 (2-year plan, Form 18), NABL 164 (ILC) |
| **Report generation, review, authorisation, signature** | 7.8.1–7.8.7, NABL 131 cl. 26, NABL 133, IT Act 2000 |
| **Report versioning / amendments** | 7.8.8.1–7.8.8.3 |
| **Complaints register** | 7.9.1–7.9.7, NABL 132 / 132A |
| **Nonconforming work + CAPA** | 7.10.1–7.10.3, 8.7 |
| **Audit trail & record control** | 7.5.2, 8.4.1, 8.4.2 |
| **System / LIMS governance** | 7.11.1–7.11.6, 4.2, NABL 131 cl. 50 (DPDP Act 2023) |
| **Management system support** | 8.2 (documentation), 8.3 (document control), 8.5 (risk), 8.6, 8.7, 8.8 (internal audit), 8.9 (management review); NABL 160A as the model manual |

---

## 16. Top ten things most likely to be found non-compliant in a first build

1. ULR built with the **superseded 2021 format** (location digit + trailing `F`), or hardcoded.
2. Accredited and non-accredited parameters on one report, distinguished by an **asterisk** — explicitly forbidden by NABL 133 §5.1/6.2.
3. Issued reports **regenerated from data** rather than stored as a frozen replica (NABL 131 cl. 26).
4. Audit trail that records the new value but **not the old value, or not the reason** (7.5.2).
5. **Shared logins** on bench PCs (destroys 7.5.1, 7.8.2.1(o), 7.11.3(a)).
6. `equipment_id` and reagent/RM `lot_id` **optional** on the result row — making 7.10.1(c) impact analysis impossible.
7. QC breach shown on a dashboard but **not blocking release** (7.7.3).
8. Role-based access only, with **no per-method analyst authorisation** (6.2.6).
9. **No LIMS validation package** and no change control on configuration changes (7.11.2).
10. **No System Incident Log** and no logged backup-restore tests (7.11.3(b),(e)).

---

## Sources

Primary — NABL (nabl-india.org):
- [Clarification regarding Unique Laboratory Report (ULR) Number, 11.06.2026 rev. 15.06.2026](https://nabl-india.org/wp-content/uploads/2026/06/Clarification-on-ULR-Number-15.06.2026.pdf) — **current ULR formats**
- [Announcement regarding new format of NABL accreditation certificate number, 03.06.2026 rev. 06.07.2026](https://nabl-india.org/wp-content/uploads/2026/07/Announcement-regarding-NABL-symbol-w.r.t-new-format-of-certificate-No.-Rev.06.07.2026.pdf)
- [Announcement regarding NABL symbol w.r.t. new format of certificate number, 12.06.2026](https://nabl-india.org/wp-content/uploads/2026/06/Announcement-regarding-NABL-symbol-w.r.t-new-format-of-certificate-No.pdf)
- [Clarification on ULR Number, 09.11.2021 (superseded)](https://nabl-india.org/wp-content/uploads/2023/11/Clarification-on-Unique-Laboratory-Report-ULR-Number.pdf)
- [Clarification on ULR Number for Accreditation Certificate TC-XXXXX, 13.12.2021 (superseded)](https://nabl-india.org/wp-content/uploads/2023/11/Clarification-on-Unique-Laboratory-Report-ULR-Number-for-Accreditation-Certificate-TC-XXXXX.pdf)
- [QR Code on the Test Reports / Calibration Certificates, 18.05.2021](https://nabl-india.org/wp-content/uploads/2023/11/QR-Code-on-test-report-calibration-certificate.pdf)
- [NABL 133 Policy for Use of NABL Symbol and/or Claim of Accreditation, Issue 09 Amd. 03, 03-Sep-2024](https://nabl-india.org/nabl/file_download1.php?filename=202409080300-NABL-133-doc.pdf)
- [NABL 131 Terms & Conditions for Obtaining and Maintaining NABL Accreditation, Issue 08 Amd. 04, 23-Jan-2026](https://nabl-india.org/nabl/file_download1.php?filename=202601231130-NABL-131-doc.pdf)
- [NABL 160A Guide for Preparing Management System Document/Quality Manual for Testing/Calibration Laboratories, Issue 01, 02-Jan-2026](https://nabl-india.org/wp-content/uploads/2026/01/NABL-160A_Issue-No.-01.pdf) — **best single NABL-endorsed restatement of clauses 4–8**
- [NABL 100B Accreditation Process & Procedure, Issue 01 Amd. 03, 27-Aug-2025](https://nabl-india.org/nabl/file_download1.php?filename=202508280508-NABL-100B-doc.pdf)
- [NABL 120 Guidance for Classification of Product Groups in Testing & Calibration Field, Amd. 06, 22-Dec-2025](https://nabl-india.org/nabl/file_download1.php?filename=202512230649-NABL-120-doc.pdf)
- [NABL 127 Procedure for Integrated Assessment & Additional Requirements of Regulatory Body(ies) for Testing Laboratories, Issue 02 Amd. 05, 10-Aug-2026](https://nabl-india.org/nabl/file_download1.php?filename=202608101119-NABL-127-doc.pdf) — 3-year record retention in regulatory schemes
- [NABL 142 Policy on Metrological Traceability of Measurement Results, Issue 07, 11-Jan-2021](https://nabl-india.org/nabl/file_download1.php?filename=202101120721-NABL-142-doc.pdf)
- [NABL 163 Policy for Participation in Proficiency Testing Activities](https://nabl-india.org/nabl/file_download1.php?filename=202011030929-NABL-163-doc.pdf) — 2-year PT plan, Form 18
- [NABL revised list of documents — note withdrawing NABL 165](https://nabl-india.org/wp-content/uploads/2020/07/revised-list-of-documents.pdf)
- [NABL current document list](https://nabl-india.org/nabl/index.php?c=publicaccredationdoc&m=index&docType=both&Itemid=199) · [News & Announcements](https://nabl-india.org/news-announcements/)
- NABL 165 (WITHDRAWN) archived copy, electronic-signature wording: [nablmelt.qci.org.in](https://nablmelt.qci.org.in/Laboratory/new-scheme/uploads/1645874085PTILC1352.pdf)

ISO/IEC 17025:2017 clause structure and requirement text (secondary; the standard itself is copyrighted and must be purchased):
- [PJLA LF-56 ISO/IEC 17025:2017 Working Document (clause-by-clause checklist)](https://www.pjlabs.com/downloads/LF-56-17025-2017.pdf)
- [PJLA — Section 7.8 Reporting of Results (2024 webinar)](https://www.pjlabs.com/downloads/webinar_slides/10.9.2024_Reporting-Results.pdf) · [(2022)](https://www.pjlabs.com/downloads/webinar_slides/3.31.2022_Reporting-Results.pdf) · [7.8.6 Statements of Conformity](https://www.pjlabs.com/downloads/webinar_slides/5.22.18_Statements-Conformity.pdf) · [4.1 Impartiality & 4.2 Confidentiality](https://www.pjlabs.com/downloads/webinar_slides/4.18.2024_Impartiality-Confidentiality.pdf)
- [European Accreditation FAQ 45.2 — Amendments to test reports, cl. 7.8.8.1](https://european-accreditation.org/sp_accordion_faqs/45-2-question-on-amendments-to-test-reports-iso-iec-17025-clause-7-8-8-1/) · [FAQ 50.1 — Amendments to reports, cl. 7.8.8](https://european-accreditation.org/sp_accordion_faqs/50-1-question-on-amendments-to-reports-iso-iec-17025-clause-7-8-8/) · [FAQ 43.2 — Impartiality](https://european-accreditation.org/sp_accordion_faqs/43-2-question-on-impartiality/)
- [ISO 17025 Store — Clause 7 Process Requirements](https://17025store.com/iso-iec-17025-2017-requirements/clause-7-process-requirements/) · [Clause 4 General Requirements](https://17025store.com/iso-iec-17025-2017-requirements/clause-4-general-requirements/)
- [ISOBudgets — Statements of Conformity and Decision Rules](https://www.isobudgets.com/statements-of-conformity-and-decision-rules/)
- [Advisera — Ensuring impartiality in an ISO 17025 laboratory (blind coding as a control)](https://advisera.com/17025academy/blog/2020/10/12/ensuring-impartiality-in-an-iso-17025-laboratory/)

India e-signature / e-record law:
- [Leegality — Law around Aadhaar eSign (IT Act 2000, GSR 61(E), CCA e-Authentication Guidelines)](https://www.leegality.com/blog/law-around-aadhaar-esign)
- [Digital Signature & Electronic Signature under IT Act 2000 (s.3, s.3A, s.5)](https://www.certificate.digital/articles/25112016/digital-signature-electronic-signature-under-it-act-2000/)
- [Khurana & Khurana — Validity of Digital Signatures in India (s.65B, s.85B, s.85C)](https://www.khuranaandkhurana.com/2021/03/31/validity-of-digital-signatures-in-india)
- [Adobe — Electronic Signature Laws & Regulations: India](https://helpx.adobe.com/legal/esignatures/regulations/india.html)

Secondary/vendor (used only for context, flagged UNVERIFIED where cited): [Qryptal on the NABL QR mandate](https://www.qryptal.com/blog/why-nabl-mandated-qr-codes-for-document-security/) (source of the "dual QR / NABL/Labs/2022/001" claim I could not verify on nabl-india.org); [The Health Master, May 2021](https://thehealthmaster.com/2021/05/25/nabl-mandates-qr-code-on-test-reports-of-laboratories/); [Digital Health News on NABL's QR/ULR generator tool](https://www.digitalhealthnews.com/nabl-rolls-out-qr-code-authentication-for-accredited-labs).

---

### Items explicitly marked UNVERIFIED

1. **`(I)` suffix in the ULR** for testing labs under Integrated Assessment — the new certificate format allows `NABLT0426DL20001(I)` but the ULR position table has no slot for it. Confirm with NABL in writing.
2. **Leading digit of the 5-digit certificate serial** (`2xxxx` for testing vs `1xxxx` for others) — an undocumented pattern in NABL's examples. Do not encode logic on it.
3. **Discipline + group before product/parameters on the report** — required by the 2021 ULR clarifications (referencing NABL 120); **not repeated** in the 15.06.2026 revision. Recommend continuing to print it; confirm.
4. **"Dual QR code"** obligation attributed to NABL/Labs/2022/001 (17-May-2022) under DPIIT direction — vendor-sourced only; circular not found on nabl-india.org. Note also the 2021 circular says "should", not "shall".
5. **Electronic/mechanical signature reproduction wording** — substantively current NABL expectation, but the only clear citation (**NABL 165**) is **withdrawn**. Obtain NABL's current written position; cite NABL 151 for signatory qualification/experience.
6. **Record retention numbers** — no universal NABL figure exists for a textile testing lab. The 3-year minimum is specific to the regulatory-body annexes of NABL 127. CSB/CAG departmental retention rules were not researched and should be checked with the parent organisation.
7. **NABL 151** (application form for testing laboratories, `.doc`) could not be text-extracted in this environment; its authorised-signatory qualification table (Table 1 equivalent) should be read directly by the lab.