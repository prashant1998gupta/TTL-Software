# Reference Feature & Data-Model Brief — Testing-Laboratory LIMS
### For: RSTRS / Silk Conditioning & Testing House, Dharmavaram (CSTRI / Central Silk Board), built on CloudZoo ERP
Version 1.0 · Research date 2026-08-19 · All URLs cited in §10

---

## 0. What the draft note actually contains (baseline for gap analysis)

I located the draft discussion note at `D:\Prashant_WorkSpace\TTL Software\brother_doc_dump.txt` (extracted from a .docx in `D:\Prashant_WorkSpace\TTL Software\_unpack`). Its 10 points are:

| # | Draft point | Draft's proposed sequence |
|---|---|---|
| 1 | Customer creation in CloudZoo ERP | Customer Creation |
| 2 | Invoice with multiple tests | → Invoice Creation with Multiple Tests |
| 3 | One auto-created Job per sample received | → Sample Received Entry → Auto Job Creation |
| 4 | Job assignment to testers; **tester must not see customer identity** | → Job Assignment |
| 5 | Tester enters test log (observations, results, remarks, sample image) | → Tester Log Entry |
| 6 | Approval of test log by authorised person | → Test Log Approval |
| 7 | Final test report generation | → Test Report Generation |
| 8 | QR code on report for online public view | → QR-Based Online Report View |
| 9 | Lab equipment as asset + calibration management | (additional module) |
| 10 | Internal stock of testing consumables | (additional module) |

**Three structural problems visible immediately**, before any research:

1. **Invoice-first.** The draft starts commercially (invoice) and treats the sample as a downstream artefact. Every real LIMS starts with a *request* (TRF) and treats invoicing as a *consequence*. Invoice-first breaks the moment a customer sends a sample without knowing the price, adds a test mid-job, or the lab has to reject the sample after invoicing.
2. **"One job per sample"** — correctly flagged in the task brief. A sample with 4 tests needs 4 assignable work units. The draft's Job = Sample, so 4 testers cannot work the same sample, and no per-test status, per-test TAT, or per-test revenue is possible.
3. **No state machine.** The draft is a happy-path pipeline. There is no rejection, hold, retest, amendment, cancellation, retention or disposal path — which are the paths that actually consume a lab's day and an auditor's attention.

---

## 1. Canonical LIMS module list, and what the draft is missing

Derived from SENAITE/Bika (open source, ISO 17025-oriented), LabWare, LabVantage, Thermo SampleManager, Baobab LIMS, Open-LIMS, and general LIMS module guides.

Legend for **In draft?**: **Yes** = present and reasonably scoped · **Partial** = mentioned but under-modelled · **No** = absent entirely.

| # | Canonical module | What it must do | In draft? | Priority for this lab |
|---|---|---|---|---|
| 1 | **Customer / Client management** | Customer master, contacts, addresses, category (reeler/twister/weaver/trader/exporter/internal/govt), GSTIN, credit terms | Yes (via ERP) | V1 |
| 2 | **Enquiry / Quotation / Tender** | Price quote before work; validity; conversion to order. ISO 17025 cl. 7.1 calls this the request→tender→contract chain | **No** | V1 (light) |
| 3 | **Contract review (request review)** | Documented check that lab has method, equipment, competent person and capacity for every requested test; record of the review and of any customer discussion | **No** | V1 — this is a *mandatory* ISO 17025 cl. 7.1 record |
| 4 | **Test Request Form (TRF) / Order registration** | The customer's signed request: what samples, what tests, priority, sample return preference, reporting preference | **Partial** (invoice used as proxy) | V1 |
| 5 | **Sample registration / accessioning** | Unique sample ID, sample type, quantity, condition-on-receipt, sender vs owner, chain-of-custody start | Partial | V1 |
| 6 | **Sample acceptance / rejection** | Documented acceptance criteria; deficiency recording; customer consultation before proceeding (cl. 7.4) | **No** | V1 |
| 7 | **Sub-sampling / partitioning / aliquoting** | Split a sample into specimens per test, preserving parent-child link (SENAITE "Partitions") | **No** | V1 (silk: same lot → skeins for size, tensile, seriplane) |
| 8 | **Test catalogue & analysis profiles** | Billable services, bundles/packages ("Full raw silk test"), sample-type applicability | Partial | V1 |
| 9 | **Method master** | Method ID, standard reference (IS 15090, ISO 2060, ASTM, AATCC), revision, conditioning requirement (20 °C / 65 % RH), equipment required | **No** | V1 — auditors ask for this first |
| 10 | **Parameter / characteristic master** | The individual measured characteristics under a test, with UoM, decimals, data type, calculation formula | **No** | V1 |
| 11 | **Specification / limit sets & grading** | Pass/fail limits and grade bands (2A/3A/4A/5A/6A); out-of-spec flagging | **No** | V1 for silk grading; V1.1 otherwise |
| 12 | **Allocation / work assignment (per test, not per sample)** | Assign each test to a competent tester and/or equipment; workload balancing | Partial (per sample) | V1 — the key redesign |
| 13 | **Worksheet / batch / run sheet** | Group many tests across many samples into one run, with QC positions (blank, duplicate, control) | **No** | V1.1 |
| 14 | **Observation / raw reading capture** | Multiple raw readings per parameter (10 skeins, 20 breaks), auto mean/CV/SD, retention of raw data (cl. 7.5 technical records) | **Partial** ("test log") | V1 — silk tests are inherently multi-reading |
| 15 | **Result calculation engine** | Formulae across parameters, rounding rules, significant figures, unit conversion | **No** | V1 (simple formula support) |
| 16 | **Verification / multi-level approval** | Verifier ≠ tester; send-back-for-retest; optional 2-level (section head then Unit Incharge) | Partial (single approval) | V1 |
| 17 | **Report / certificate generation** | Templated PDF, mandatory cl. 7.8 content, partial/supplementary reports, ULR number, NABL symbol rules | Partial | V1 |
| 18 | **Report amendment / invalidation** | Amendments must be identified as such and reference the original (cl. 7.8.8); original never edited in place | **No** | V1 |
| 19 | **E-signature & signatory authority** | Who may sign which report type; signature record with user, time, IP, reason | **No** | V1 (internal e-sign), V2 (DSC/eSign) |
| 20 | **Public report verification** | QR → online verified copy; tamper-evident token; NABL dual-QR mandate | Yes | V1 |
| 21 | **Retained sample / storage & disposal** | Retention period per sample type, storage location, withdrawal, return-to-customer, authorised disposal record | **No** | V1 (register), V1.1 (locations) |
| 22 | **Chain of custody / sample movement log** | Every physical handover, receipt, transfer, disposal timestamped and attributed | **No** | V1 |
| 23 | **Equipment / asset register + calibration** | Equipment master, calibration due dates, calibration certificates, maintenance, out-of-service block on use | Yes (point 9) | V1 |
| 24 | **Consumables / reagent inventory with lots** | Item, lot, expiry, receipt, issue-against-test, reorder level, expired-lot block | Yes (point 10) | V1 (simple), V1.1 (lot traceability) |
| 25 | **Personnel competency / authorisation matrix** | Person × method × equipment, valid from/to, training record; system prevents unauthorised person entering a result | **No** | V1 — highest-value cheap win |
| 26 | **TAT / due-date & scheduling** | Per-test standard TAT, working-day calendar, priority, due date, escalation | **No** | V1 |
| 27 | **QC / control samples & trending** | Duplicates, reference samples, control charts, inter-lab comparison / PT participation | **No** | V2 |
| 28 | **Non-conforming work, complaints, CAPA** | cl. 7.9 / 7.10 / 8.7 — complaint register, NCR, root cause, corrective action, recall of reports | **No** | V1 (registers), V1.1 (workflow) |
| 29 | **Subcontracting / external provider** | Flag tests sent out, customer written notification & consent record, identify in report | **No** | V1.1 |
| 30 | **Billing / invoicing / receipts / credit notes** | Rate cards per customer category, urgent surcharge, GST, part payment, government receipt/challan | Partial (invoice only) | V1 |
| 31 | **Document control (SOPs, standards, formats)** | Controlled copies of SOPs/methods/standards with revision and read-acknowledgement | **No** | V2 |
| 32 | **Dashboards, KPIs & statutory returns** | Pending queues, TAT performance, workload, revenue, monthly return to CSTRI/CSB HQ | **No** | V1 (returns), V1.1 (dashboards) |
| 33 | **Customer / client portal** | Track status, download reports, submit new requests | **No** | V2 |
| 34 | **Barcode/QR label printing on samples** | Label print, reprint, scan at each station | **No** (QR only on report) | V1 |
| 35 | **Instrument interfacing** | File/CSV watch folder, serial capture | **No** | V1.5 / V2 |
| 36 | **Audit trail (immutable) & RBAC** | Every change snapshotted with user/time/IP; role-based, status-aware permissions | **No** (only a confidentiality rule) | V1 — non-negotiable |
| 37 | **Notifications** | Sample overdue, calibration due, approval pending, report issued | **No** | V1.1 |
| 38 | **Numbering series** | Configurable, gap-free, per-financial-year series for sample/TRF/report/invoice/ULR | **No** | V1 |
| 39 | **R&D / internal project samples (non-billable)** | Internal samples with no customer and no invoice, but full traceability | **No** | V1 — the note ignores CSTRI's internal R&D work entirely |
| 40 | **Method validation / uncertainty of measurement** | Where required by scope, record MU and method validation data | **No** | V2 |

**Modules missing from the draft entirely (the headline gap list):** enquiry/quotation, contract review, sample acceptance/rejection, sub-sampling, method master, parameter master, spec/grade limits, worksheets, calculation engine, report amendment, e-signature, sample retention & disposal, chain of custody, competency matrix, TAT/due dates, QC, complaints/NCR/CAPA, subcontracting, document control, dashboards & statutory returns, sample barcodes, instrument interfacing, audit trail, notifications, numbering series, internal/R&D samples.

---

## 2. Canonical sample lifecycle — three interacting state machines

**Design decision (important):** do not try to model this as one status column on one table. Real LIMS run *separate but coupled* workflows. SENAITE runs a sample workflow, an analysis workflow and a worksheet workflow, where "analyses control the states of their parent samples". Adopt the same shape:

- **`txn_order` (TRF)** — commercial/contractual state
- **`txn_sample`** — physical custody state
- **`txn_sample_test`** — analytical work state (**this is the assignable unit**)
- **`txn_report`** — document state
- **`txn_invoice`** — money state

`txn_sample.state` is largely **derived** from its `txn_sample_test` rows. Write it as a stored column updated by a single service function (never by scattered UI code), so you can index and report on it.

### 2.1 Order / TRF states

| From | Event | To | Who | Guards | Side effects |
|---|---|---|---|---|---|
| — | `create` | `DRAFT` | Front Desk | — | Allocate TRF no. from series |
| `DRAFT` | `submit` | `PENDING_REVIEW` | Front Desk | ≥1 order line | Snapshot rate card prices |
| `PENDING_REVIEW` | `review_accept` | `ACCEPTED` | Unit Incharge / Section Head | Every test has method + equipment in calibration + ≥1 competent tester | Write **contract-review record** (cl. 7.1); create `txn_sample` rows in `EXPECTED`; compute due dates |
| `PENDING_REVIEW` | `review_decline` | `DECLINED` | Unit Incharge | Reason mandatory | Notify customer; no samples created |
| `PENDING_REVIEW` | `request_clarification` | `PENDING_CUSTOMER` | Front Desk | — | Log discussion (cl. 7.1 requires records of pertinent customer discussions) |
| `PENDING_CUSTOMER` | `clarified` | `PENDING_REVIEW` | Front Desk | — | Append to review record |
| `ACCEPTED` | `amend` | `ACCEPTED` (rev+1) | Unit Incharge | Reason mandatory | New order revision row; re-review; re-price; recompute TAT |
| `ACCEPTED` | `hold_payment` | `ON_HOLD_PAYMENT` | Accounts | Advance/credit rule fails | Freeze all child sample_tests (`ON_HOLD`); TAT clock **pauses** |
| `ON_HOLD_PAYMENT` | `payment_received` | `ACCEPTED` | Accounts | Receipt exists | Unfreeze; TAT clock resumes; due dates shifted by hold duration |
| `ACCEPTED` | `cancel` | `CANCELLED` | Unit Incharge | No test past `RESULT_ENTERED` | Cancel open sample_tests; part-bill completed ones |
| `ACCEPTED` | `close` | `CLOSED` | System | All samples reported + invoiced + samples dispositioned | Lock; read-only |

### 2.2 Sample states (physical custody)

| From | Event | To | Who | Guards | Side effects |
|---|---|---|---|---|---|
| — | `register` | `EXPECTED` | Front Desk | Parent order `ACCEPTED` | Allocate sample no.; **no** label printed yet |
| `EXPECTED` | `receive` | `RECEIVED` | Sample Receipt Clerk | — | Record received date/time, receiver, quantity, packaging condition; **print label**; custody event; TAT clock **starts** |
| `RECEIVED` | `accept` | `ACCEPTED` | Sample Receipt Clerk | Condition checklist passed; quantity ≥ minimum for all tests | Create `txn_sample_test` rows (one per test); create sub-samples per method; compute per-test due dates |
| `RECEIVED` | `accept_with_deviation` | `ACCEPTED` | Unit Incharge | Customer consulted & recorded (cl. 7.4.3) | Set `deviation_disclaimer` → **must** print on report |
| `RECEIVED` | `reject` | `REJECTED` | Unit Incharge | Reason from coded list | Notify customer; create NCR if lab-caused; no tests created; invoice void or handling fee only |
| `ACCEPTED` | *(auto)* `first_test_started` | `IN_TESTING` | System | Any test → `IN_TEST` | — |
| `IN_TESTING` | *(auto)* `all_tests_closed` | `TESTING_COMPLETE` | System | All tests `VERIFIED`/`CANCELLED`/`ABORTED` | Notify report writer |
| `IN_TESTING` / `TESTING_COMPLETE` | `issue_partial_report` | `PART_REPORTED` | Authorised Signatory | ≥1 test `VERIFIED`, ≥1 test still open | Report marked "Partial"; remaining tests continue |
| `TESTING_COMPLETE` / `PART_REPORTED` | `issue_report` | `REPORTED` | Authorised Signatory | All tests `VERIFIED`/`CANCELLED` | Report `ISSUED`; tests → `REPORTED`; public token minted; invoice trigger |
| `ACCEPTED`…`TESTING_COMPLETE` | `hold` | `ON_HOLD` | Section Head | Reason: payment / clarification / equipment down / conditioning | TAT clock pauses; child tests → `ON_HOLD` |
| `ON_HOLD` | `release` | *(previous state)* | Section Head | — | Clock resumes; due dates shifted |
| `REPORTED` | `move_to_retention` | `IN_RETENTION` | Store Keeper | — | Assign storage location; set `retain_until` |
| `IN_RETENTION` / `REJECTED` / `REPORTED` | `return_to_customer` | `RETURNED` | Store Keeper | Customer opted for return | Custody event with receiver name + signature/attachment |
| `IN_RETENTION` | `dispose` | `DISPOSED` | Store Keeper | `today ≥ retain_until` **and** disposal authorised by Unit Incharge | Disposal record: date, method, authoriser (terminal) |
| any pre-`RESULT_ENTERED` | `withdraw` | `WITHDRAWN` | Front Desk (customer request) | Written request attached | Cancel open tests; part-bill |
| any pre-`RESULT_ENTERED` | `cancel` | `CANCELLED` | Unit Incharge | — | Cancel open tests |
| `CANCELLED` | `reinstate` | `ACCEPTED` | Unit Incharge | Sample physically still available | Recreate tests; new due dates |
| `REPORTED` | `invalidate` | `IN_TESTING` | Unit Incharge | Report withdrawn/superseded first | Selected tests → `INVALIDATED`, retests created |

### 2.3 Sample-test states (the assignable unit of work) — **the fix for "one job per sample"**

| From | Event | To | Who | Guards | Side effects |
|---|---|---|---|---|---|
| — | `create` | `PENDING` | System (on sample accept) | — | Snapshot method_id, method_rev, price, standard TAT, due date |
| `PENDING` | `allocate` | `ALLOCATED` | Section Head | Assignee **competency-authorised** for this method; equipment calibration valid | Set assignee, equipment, planned start; notify tester |
| `ALLOCATED` | `reallocate` | `ALLOCATED` | Section Head | Not yet `IN_TEST`, or reason recorded | Audit + reason |
| `ALLOCATED` | `start` | `IN_TEST` | Assigned Tester | Sub-sample ready; conditioning complete if method requires it | Record actual start; consume consumable lots |
| `IN_TEST` | `save_observations` | `IN_TEST` | Assigned Tester | — | Insert `txn_observation` rows (raw readings retained forever) |
| `IN_TEST` | `submit_result` | `RESULT_ENTERED` | Assigned Tester | All mandatory parameters have values; all calcs run | Compute derived results; spec/grade evaluation; **tester can no longer edit** |
| `RESULT_ENTERED` | `pick_for_verification` | `UNDER_VERIFICATION` | Verifier | Verifier ≠ tester (self-verify blocked, configurable) | Lock row to verifier |
| `UNDER_VERIFICATION` | `verify` | `VERIFIED` | Verifier (authorised) | — | E-sign record; ready-to-report |
| `UNDER_VERIFICATION` | `send_back` | `IN_TEST` | Verifier | Reason mandatory | `retest_count += 1`; result revision archived; notify tester; **TAT clock keeps running** |
| `UNDER_VERIFICATION` | `verify_level2` | `UNDER_VERIFICATION` | Section Head | 2-level config on | Second e-sign, then `verify` by Unit Incharge |
| `VERIFIED` | `retract` | `IN_TEST` | Unit Incharge | Not yet reported | Archive result revision; reason mandatory |
| `VERIFIED` | `report` | `REPORTED` | System (on report issue) | Report `ISSUED` | Link to `txn_report_test` |
| `REPORTED` | `invalidate` | `INVALIDATED` | Unit Incharge | Report superseded/withdrawn | Auto-create replacement test row in `PENDING` (retest lineage: `retest_of_id`) |
| `PENDING`…`IN_TEST` | `hold` | `ON_HOLD` | Section Head | Reason coded | TAT pauses |
| `ON_HOLD` | `release` | *(previous)* | Section Head | — | TAT resumes |
| `PENDING`…`IN_TEST` | `subcontract` | `SUBCONTRACTED` | Unit Incharge | **Written customer notification recorded** | External lab, their report attached; must be identified on our report |
| `SUBCONTRACTED` | `receive_external_result` | `RESULT_ENTERED` | Front Desk | External report attached | Normal verification path |
| `PENDING`…`IN_TEST` | `abort` | `ABORTED` | Section Head | e.g. sample insufficient / destroyed in test | Reason; NCR if lab-caused; no charge |
| `PENDING`…`ALLOCATED` | `cancel` | `CANCELLED` | Unit Incharge | Customer withdrawal / order amendment | Remove from invoice |

### 2.4 Report states

| From | Event | To | Who | Guards | Side effects |
|---|---|---|---|---|---|
| — | `compile` | `DRAFT` | Report Writer | ≥1 `VERIFIED` test | Snapshot **all** printed values into report tables (never re-query live data later) |
| `DRAFT` | `submit` | `PENDING_APPROVAL` | Report Writer | Mandatory cl. 7.8 fields complete | Notify signatory |
| `PENDING_APPROVAL` | `send_back` | `DRAFT` | Signatory | Reason | — |
| `PENDING_APPROVAL` | `approve` | `APPROVED` | Authorised Signatory | Signatory authorised for this report type | E-sign record |
| `APPROVED` | `issue` | `ISSUED` | Authorised Signatory | Payment rule satisfied (or waived with reason) | Allocate report no. + **ULR**; render & hash PDF; mint public token; email/print; sample→`REPORTED` |
| `ISSUED` | `amend` | `SUPERSEDED` | Unit Incharge | Reason mandatory | New report, `rev = prev+1`, `amends_report_id` set, printed as **"Amendment to Report No. X"**; old public token serves a "SUPERSEDED — see Rev n" banner, **never a 404** |
| `ISSUED` | `withdraw` | `WITHDRAWN` | Unit Incharge | NCR raised | Public token serves "WITHDRAWN"; customer notified; recall recorded (cl. 7.10) |
| `ISSUED` | `reprint` | `ISSUED` | Front Desk | — | Reprint log (count, who, when) — do not silently re-render |

### 2.5 Invoice states (thin — CloudZoo ERP likely owns most of this)

`DRAFT → ISSUED → PART_PAID → PAID`; `ISSUED → CANCELLED` (before payment); `PAID/PART_PAID → CREDITED` (credit note). Keep `txn_invoice_line.sample_test_id` so **revenue per test** is answerable.

### 2.6 The special paths, explicitly

| Path | How it is modelled |
|---|---|
| **Cancellation** | Separate `CANCELLED` state at order / sample / test level, each with mandatory coded reason. Never delete rows. |
| **On-hold-for-payment** | `ON_HOLD_PAYMENT` on order, cascading `ON_HOLD` on tests. Store `hold_started_at`/`hold_ended_at` in `sys_state_transition` and **subtract hold duration from TAT** — otherwise every slow-paying customer looks like a lab failure. |
| **Retest** | Two different things, keep them apart: (a) **verifier send-back** = same `sample_test` row, `retest_count++`, old result archived to `txn_result_revision`; (b) **customer-requested retest after report** = new `sample_test` row with `retest_of_id`, separately billable. |
| **Partial report** | `txn_report_test` join table decides which tests appear on which report. Report carries `is_partial`. Sample can be `PART_REPORTED` and still `IN_TESTING`. |
| **Amendment** | Never mutate an issued report. New row, `rev+1`, `amends_report_id`, amendment reason printed on the face of the document (ISO 17025 cl. 7.8.8 requires amendments to be identified as such and to reference the original). |

---

## 3. Entities the draft conflates — clean naming scheme

| Conflated pair | Entity A | Entity B | Recommended table names | Why the distinction matters (one sentence) |
|---|---|---|---|---|
| **Customer vs Sender/Agent** | `Customer` = the party who owns the result, is billed, and whose name goes on the report | `Sender` = the person/agent/courier who physically handed the sample over (often a broker, a reeler's boy, or a co-operative society) | `mst_customer`, `mst_customer_contact`, plus `txn_sample.sender_name`, `sender_contact_id`, `received_from_type` | If you store only one "customer", the report ends up in a broker's name and the real reeler cannot prove ownership of the certificate. |
| **Enquiry vs Quotation vs Order (TRF)** | `Enquiry` = "what do you charge to test raw silk?" (no commitment) · `Quotation` = the lab's priced offer with validity | `Order/TRF` = the accepted, signed request that authorises work and creates liability | `txn_enquiry`, `txn_quotation` + `txn_quotation_line`, `txn_order` + `txn_order_line` | ISO 17025 cl. 7.1 treats request → tender → contract as three distinct records, and only the third one may start work or bill. |
| **Sample vs Sub-sample/Specimen** | `Sample` = the lot the customer submitted (one bale, one lot of skeins) | `Sub-sample/Specimen/Partition` = the physical piece actually consumed by one test (a sizing skein, a 20 cm strip, a conditioned swatch) | `txn_sample`, `txn_subsample` (self-FK to parent sample) | The lab weighs 400 sizing skeins for size testing and destroys strips for tensile — without sub-samples you can neither track consumption nor explain what was retained. |
| **Test vs Test Method** | `Test` = the billable service in the catalogue ("Raw Silk Size Test") | `Method` = the documented procedure/standard used ("IS 15090:2002, Rev 3, at 20 °C/65 % RH") | `mst_test`, `mst_test_method` (a test may have several methods; one is default) | The price and the customer's language belong to the test, but the audit, competency and equipment requirements belong to the method. |
| **Parameter/Characteristic vs Observation/Reading vs Result** | `Parameter` = the definition of what is measured (Average Denier, Size Deviation, Tenacity g/den, Elongation %) · `Observation` = one raw reading (skein #7 weighed 0.318 g) | `Result` = the single reportable value per parameter after calculation and rounding | `mst_parameter`, `mst_test_parameter`, `txn_observation`, `txn_result` | Silk tests take tens of raw readings per parameter; ISO 17025 cl. 7.5 requires you to keep the raw readings, but only the computed result goes on the certificate. |
| **Job vs Worksheet vs Analysis** | `Analysis` (= `sample_test`) = one test on one sample = the atomic unit of assignable work | `Worksheet` = one tester's run sheet grouping many analyses (possibly from many samples/customers) plus QC positions | `txn_sample_test` (**replace "Job"**), `txn_worksheet` + `txn_worksheet_line` | A sample with 4 tests must produce 4 rows so 4 testers can each own one; the worksheet is how one tester batches 30 denier weighings across 8 samples into a single morning's run. |
| **Report vs Certificate** | `Report` = the document instance issued to the customer (has number, revision, signatory, ULR, hash, public token) | `Certificate` is just a *report type* (test report / test certificate / grading certificate / conditioning certificate), differing in template and signatory authority | `txn_report` with `report_type`, `mst_report_template` (V1.1) | One table with a type column avoids three near-identical modules while still letting grading certificates require a higher signatory. |

### Recommended naming scheme (use this literally)

- Prefixes: `mst_` (master), `txn_` (transaction), `sys_` (system/platform).
- PK always `id BIGINT IDENTITY`; **never** use a human-readable number as a PK. Human numbers (`sample_no`, `trf_no`, `report_no`, `ulr_no`) are separate `UNIQUE` columns.
- Every table: `created_at`, `created_by`, `updated_at`, `updated_by`. Transaction tables also: `state`, `state_changed_at`, `state_changed_by`.
- Money: `DECIMAL(14,2)`. Measurements: `DECIMAL(18,6)` **plus** a `value_text` column for non-numeric results ("Absent", "4A", "Pass") — silk grading and seriplane inspection produce non-numeric results and a numeric-only column will force ugly workarounds.
- **Kill the word "Job."** It means order, sample, test and worksheet to different people in the draft note. Use `sample_test` and say "test" in the UI.

---

## 4. Proposed relational data model

**58 tables.** `Ph` column: **1** = build in V1, **1.1** = second release, **2** = later. `[ERP]` = probably already exists in CloudZoo ERP — reference it, do not duplicate; if you cannot reference it cleanly, keep a thin local mirror plus `erp_ref_id`.

### 4.1 Masters

| # | Table | Purpose | Key columns | PK / FK | Constraints & indexes | Ph |
|---|---|---|---|---|---|---|
| M1 | `mst_customer` `[ERP]` | Party who owns results & is billed | `code`, `name`, `category` (reeler/twister/weaver/trader/exporter/govt/internal), `gstin`, `pan`, `address_*`, `state_code`, `credit_terms`, `advance_required`, `default_rate_card_id`, `is_active`, `erp_customer_id` | PK `id`; FK `default_rate_card_id`→M22 | `UNIQUE(code)`; `INDEX(name)`; `CHECK(category IN …)`; internal/R&D pseudo-customer must exist | 1 |
| M2 | `mst_customer_contact` | Named people at customer | `customer_id`, `name`, `designation`, `mobile`, `email`, `is_primary`, `is_report_recipient` | PK `id`; FK `customer_id`→M1 | `INDEX(customer_id)`; at most one `is_primary` per customer | 1 |
| M3 | `mst_lab_section` | Lab section/department | `code`, `name`, `incharge_personnel_id` | PK `id`; FK →M19 | `UNIQUE(code)` | 1 |
| M4 | `mst_sample_type` | Silk/textile material category | `code` (label prefix), `name` (Raw Silk, Twisted Silk/Thrown Yarn, Silk Fabric, Dyed Yarn, Cocoon, Blended Fabric), `default_retention_days`, `min_quantity`, `uom_id`, `requires_conditioning`, `default_disposal_mode` | PK `id`; FK `uom_id`→M9 | `UNIQUE(code)`; `code` short — it prefixes the sample number | 1 |
| M5 | `mst_test` | **Billable catalogue service** | `code`, `name`, `lab_section_id`, `default_method_id`, `standard_tat_days`, `is_accredited` (in NABL scope), `is_active`, `hsn_sac_code`, `tax_id` | PK `id`; FK →M3, M6, M24 | `UNIQUE(code)`; `INDEX(lab_section_id)` | 1 |
| M5a | `mst_test_sample_type` | Which tests apply to which materials | `test_id`, `sample_type_id`, `min_quantity_required` | PK composite; FK →M5, M4 | Prevents ordering a fabric GSM test on a raw-silk sample | 1 |
| M6 | `mst_test_method` | Documented procedure | `test_id`, `code`, `name`, `standard_ref` (IS 15090 / ISO 2060 / ASTM D…), `revision_no`, `effective_from`, `effective_to`, `conditioning_spec` ("20±2 °C, 65±4 % RH, 4 h"), `reading_count_default`, `sop_attachment_id`, `is_default` | PK `id`; FK `test_id`→M5 | `UNIQUE(test_id, code, revision_no)`; **never edit a method in place — supersede it**; results snapshot `method_id` | 1 |
| M6a | `mst_method_equipment` | Equipment a method needs | `method_id`, `equipment_type_code`, `is_mandatory` | PK composite | Drives the "no calibrated instrument → cannot allocate" guard | 1 |
| M7 | `mst_parameter` | A measured characteristic | `code`, `name`, `uom_id`, `data_type` (numeric/text/enum/boolean/grade), `decimals`, `rounding_rule`, `enum_values_json` | PK `id`; FK `uom_id`→M9 | `UNIQUE(code)` | 1 |
| M8 | `mst_test_parameter` | Parameters under a test/method, ordered | `method_id`, `parameter_id`, `seq_no`, `is_mandatory`, `is_reportable`, `is_calculated`, `formula_text`, `reading_count`, `default_uom_id` | PK `id`; FK →M6, M7 | `UNIQUE(method_id, parameter_id)`; `INDEX(method_id, seq_no)`; `CHECK(is_calculated=0 OR formula_text IS NOT NULL)` | 1 |
| M9 | `mst_uom` | Units | `code` (den, g/den, %, gsm, mm, cycles), `name`, `base_uom_id`, `conv_factor` | PK `id` | `UNIQUE(code)` | 1 |
| M10 | `mst_spec_set` | A named limit/grade scheme | `code`, `name`, `sample_type_id`, `standard_ref`, `effective_from`, `effective_to` | PK `id`; FK →M4 | `UNIQUE(code)` | 1 |
| M11 | `mst_spec_limit` | Limit lines / grade bands | `spec_set_id`, `parameter_id`, `grade_code` (2A…6A, nullable), `min_value`, `max_value`, `text_expected`, `seq_no` | PK `id`; FK →M10, M7 | `INDEX(spec_set_id, parameter_id)`; `CHECK(min_value IS NULL OR max_value IS NULL OR min_value<=max_value)` | 1 |
| M12 | `mst_test_profile` | Bundle ("Full Raw Silk Test") | `code`, `name`, `sample_type_id`, `package_price`, `is_active` | PK `id`; FK →M4 | `UNIQUE(code)` | 1.1 |
| M13 | `mst_test_profile_line` | Tests in a bundle | `profile_id`, `test_id`, `seq_no` | PK `id`; FK →M12, M5 | `UNIQUE(profile_id, test_id)` | 1.1 |
| M14 | `mst_equipment` `[ERP asset]` | Instrument / asset register | `code`, `name`, `equipment_type_code`, `make`, `model`, `serial_no`, `lab_section_id`, `location`, `install_date`, `status` (in_service / under_calibration / breakdown / condemned), `calibration_frequency_months`, `last_calibration_date`, `next_calibration_due`, `erp_asset_id` | PK `id`; FK →M3 | `UNIQUE(code)`, `UNIQUE(serial_no)`; `INDEX(next_calibration_due)`; `INDEX(status)` | 1 |
| M15 | `mst_equipment_event` | Calibration, verification, service, breakdown (one typed table) | `equipment_id`, `event_type` (calibration/intermediate_check/preventive_maintenance/breakdown/repair/condemn), `event_date`, `performed_by_agency`, `certificate_no`, `traceable_to`, `result` (pass/fail/limited), `valid_until`, `next_due_date`, `cost`, `attachment_id`, `remarks` | PK `id`; FK →M14, S7 | `INDEX(equipment_id, event_date DESC)`; `INDEX(next_due_date)`; on insert of latest calibration, update M14 cached dates | 1 |
| M16 | `mst_consumable` `[ERP item]` | Reagents & consumables | `code`, `name`, `category`, `uom_id`, `reorder_level`, `is_lot_tracked`, `is_expiry_tracked`, `erp_item_id` | PK `id`; FK →M9 | `UNIQUE(code)`; `INDEX(reorder_level)` | 1 |
| M17 | `mst_consumable_lot` | Lot/batch with expiry & stock | `consumable_id`, `lot_no`, `received_date`, `expiry_date`, `supplier`, `qty_received`, `qty_on_hand`, `storage_location_id`, `coa_attachment_id`, `is_quarantined` | PK `id`; FK →M16, M18 | `UNIQUE(consumable_id, lot_no)`; `CHECK(qty_on_hand>=0)`; `INDEX(expiry_date)` | 1.1 |
| M18 | `mst_storage_location` | Retention shelves, cupboards, conditioning chamber | `code`, `name`, `parent_id` (self-FK, hierarchy), `location_type`, `capacity`, `temp_rh_controlled` | PK `id`; FK `parent_id`→M18 | `UNIQUE(code)`; hierarchical (building → room → rack → shelf) | 1.1 |
| M19 | `mst_personnel` | Staff record (distinct from login) | `emp_code`, `name`, `designation` (Scientist-D, Technical Assistant, …), `lab_section_id`, `date_of_joining`, `date_of_leaving`, `user_id`, `signature_image_id`, `is_active` | PK `id`; FK →M3, S1, S7 | `UNIQUE(emp_code)`; `UNIQUE(user_id)` where not null; a person may exist without a login | 1 |
| M20 | `mst_competency` | **Authorisation matrix** | `personnel_id`, `method_id` (nullable), `equipment_id` (nullable), `authorisation_level` (perform / verify / sign), `valid_from`, `valid_to`, `training_ref`, `authorised_by`, `attachment_id` | PK `id`; FK →M19, M6, M14 | `INDEX(personnel_id, method_id, authorisation_level)`; guard queries hit this on every allocate/submit/verify/sign | 1 |
| M21 | `mst_calendar_exception` | Working-day calendar | `calendar_code`, `exception_date`, `day_type` (holiday / half_day / working_saturday), `description` | PK `id` | `UNIQUE(calendar_code, exception_date)`; plus a `sys_setting` row for the normal weekly pattern | 1 |
| M22 | `mst_rate_card` | Fee schedule (Govt-notified charges) | `code`, `name`, `customer_category`, `effective_from`, `effective_to`, `approval_ref` (CSB/CSTRI office order no.), `is_active` | PK `id` | `UNIQUE(code)`; overlapping effective ranges per category must be blocked | 1 |
| M23 | `mst_rate_card_line` | Price per test | `rate_card_id`, `test_id`, `unit_price`, `urgent_multiplier`, `urgent_flat_add`, `min_charge`, `tax_id` | PK `id`; FK →M22, M5, M24 | `UNIQUE(rate_card_id, test_id)` | 1 |
| M24 | `mst_tax` `[ERP]` | GST codes | `code`, `description`, `cgst_pct`, `sgst_pct`, `igst_pct`, `effective_from`, `hsn_sac_code` | PK `id` | `UNIQUE(code, effective_from)` | 1 |
| M25 | `mst_numbering_series` | Configurable number formats | `series_code` (SAMPLE/TRF/QUOT/REPORT/INVOICE/WORKSHEET/ULR/NCR), `format_pattern` (`RS/{yy}-{yy+1}/{sampletype}/{seq:05d}`), `reset_cycle` (never/yearly/fin_yearly/monthly), `prefix`, `suffix`, `pad_length` | PK `id` | `UNIQUE(series_code)` | 1 |
| M26 | `mst_numbering_counter` | Live counters (separate for concurrency) | `series_code`, `period_key` (e.g. `2026-27`), `scope_key` (e.g. sample type code), `last_number` | PK composite | Allocate under `UPDATE … SET last_number = last_number + 1` in its **own short transaction**; see §4.4 | 1 |

### 4.2 Transactions

| # | Table | Purpose | Key columns | PK / FK | Constraints & indexes | Ph |
|---|---|---|---|---|---|---|
| T1 | `txn_enquiry` | Pre-sales question | `enquiry_no`, `enquiry_date`, `customer_id` (nullable — walk-ins), `contact_name`, `mobile`, `source` (walk_in/phone/email/letter), `requirement_text`, `state` (open/quoted/converted/lost), `lost_reason` | PK `id`; FK →M1 | `UNIQUE(enquiry_no)` | 1.1 |
| T2 | `txn_quotation` | Priced offer | `quotation_no`, `rev_no`, `quotation_date`, `enquiry_id`, `customer_id`, `valid_until`, `rate_card_id`, `subtotal`, `tax_amount`, `total`, `terms_text`, `state` (draft/sent/accepted/expired/rejected), `converted_order_id` | PK `id`; FK →T1, M1, M22, T4 | `UNIQUE(quotation_no, rev_no)`; `INDEX(customer_id, state)` | 1.1 |
| T3 | `txn_quotation_line` | Quoted tests | `quotation_id`, `test_id`, `sample_type_id`, `qty_samples`, `unit_price`, `discount_pct`, `tax_id`, `line_total` | PK `id`; FK →T2, M5, M4, M24 | `INDEX(quotation_id)` | 1.1 |
| T4 | `txn_order` | **TRF — the contract** | `trf_no`, `rev_no`, `trf_date`, `customer_id`, `customer_contact_id`, `quotation_id`, `order_type` (commercial/internal_rnd/statutory/inter_unit), `priority` (normal/urgent/emergency), `rate_card_id`, `sample_return_required`, `report_delivery_mode`, `customer_ref_no`, `state`, `review_by`, `review_at`, `review_remarks`, `capability_confirmed`, `promised_date`, `hold_reason_code`, `total_amount` | PK `id`; FK →M1, M2, T2, M22 | `UNIQUE(trf_no, rev_no)`; `INDEX(customer_id, trf_date)`; `INDEX(state)`; `CHECK(order_type='internal_rnd' OR customer_id IS NOT NULL)` | 1 |
| T5 | `txn_order_line` | Requested test × sample count | `order_id`, `line_no`, `sample_type_id`, `test_id`, `method_id`, `spec_set_id`, `no_of_samples`, `unit_price`, `discount_pct`, `tax_id`, `line_total` | PK `id`; FK →T4, M4, M5, M6, M10 | `UNIQUE(order_id, line_no)`; `CHECK(no_of_samples>=1)` | 1 |
| T6 | `txn_sample` | The submitted lot | `sample_no`, `order_id`, `sample_type_id`, `customer_sample_ref` (customer's own lot/mark no.), `description`, `quantity`, `uom_id`, `no_of_units` (skeins/cones/pieces), `sender_name`, `sender_mobile`, `received_datetime`, `received_by`, `receipt_mode` (hand/courier/post), `condition_on_receipt_json`, `condition_ok`, `deviation_disclaimer`, `state`, `state_changed_at`, `reject_reason_code`, `hold_reason_code`, `total_hold_minutes`, `due_datetime`, `retain_until`, `storage_location_id`, `disposal_mode`, `disposed_at`, `disposed_by`, `label_print_count`, `barcode_payload`, `is_confidential` | PK `id`; FK →T4, M4, M9, M18, S1 | `UNIQUE(sample_no)`; `INDEX(state, due_datetime)`; `INDEX(order_id)`; `INDEX(received_datetime)`; `INDEX(retain_until)` where state=`IN_RETENTION` | 1 |
| T7 | `txn_subsample` | Specimen actually tested | `sample_no_suffix` (`-P01`), `parent_sample_id`, `prep_type` (skein/strip/swatch/aliquot), `quantity`, `uom_id`, `prepared_by`, `prepared_at`, `conditioning_start`, `conditioning_end`, `state` (prepared/in_use/consumed/discarded), `storage_location_id` | PK `id`; FK →T6, M9, M18 | `UNIQUE(parent_sample_id, sample_no_suffix)`; `INDEX(parent_sample_id)` | 1 |
| T8 | `txn_sample_test` | **THE assignable unit of work** | `sample_id`, `subsample_id`, `order_line_id`, `test_id`, `method_id` (snapshot), `method_revision` (snapshot), `spec_set_id`, `seq_no`, `state`, `state_changed_at`, `assigned_to_personnel_id`, `assigned_by`, `assigned_at`, `equipment_id`, `worksheet_id`, `standard_tat_days` (snapshot), `due_datetime`, `started_at`, `submitted_at`, `submitted_by`, `verified_at`, `verified_by`, `reported_at`, `retest_count`, `retest_of_id` (self-FK), `is_subcontracted`, `subcontract_lab_name`, `abort_reason_code`, `hold_minutes`, `unit_price` (snapshot), `overall_verdict` (pass/fail/na), `assigned_grade` | PK `id`; FK →T6, T7, T5, M5, M6, M10, M19, M14, T9, self | `UNIQUE(sample_id, test_id, retest_count)`; `INDEX(state, due_datetime)`; `INDEX(assigned_to_personnel_id, state)`; `INDEX(worksheet_id)`; `INDEX(sample_id)`; **the single most queried table in the system — index it properly** | 1 |
| T9 | `txn_worksheet` | A tester's run sheet | `worksheet_no`, `worksheet_date`, `lab_section_id`, `analyst_personnel_id`, `equipment_id`, `method_id`, `state` (open/in_progress/submitted/verified/closed), `template_code`, `ambient_temp`, `ambient_rh`, `remarks` | PK `id`; FK →M3, M19, M14, M6 | `UNIQUE(worksheet_no)`; `INDEX(analyst_personnel_id, state)` | 1.1 |
| T10 | `txn_worksheet_line` | Positions on the run sheet, incl. QC | `worksheet_id`, `position_no`, `line_type` (sample/blank/duplicate/reference/spike), `sample_test_id`, `reference_lot_id`, `duplicate_of_line_id` | PK `id`; FK →T9, T8, M17 | `UNIQUE(worksheet_id, position_no)`; `line_type='sample'` ⇒ `sample_test_id NOT NULL` | 1.1 |
| T11 | `txn_observation` | **Raw readings — immutable** | `sample_test_id`, `parameter_id`, `reading_no`, `raw_value`, `raw_value_text`, `uom_id`, `equipment_id`, `observed_at`, `observed_by`, `entry_mode` (manual/file_import/serial/calculated), `source_file_attachment_id`, `is_excluded`, `exclusion_reason` | PK `id`; FK →T8, M7, M9, M14, S7 | `UNIQUE(sample_test_id, parameter_id, reading_no)`; `INDEX(sample_test_id)`; **append-only: corrections are new rows + `is_excluded` on the old, never UPDATE** | 1 |
| T12 | `txn_result` | Reportable value per parameter | `sample_test_id`, `parameter_id`, `value_num`, `value_text`, `uom_id`, `decimals_used`, `n_readings`, `mean_value`, `sd_value`, `cv_pct`, `min_value`, `max_value`, `spec_min`, `spec_max`, `spec_verdict` (pass/fail/na/warn), `grade_code`, `rev_no`, `is_current`, `entered_by`, `entered_at`, `verified_by`, `verified_at`, `remarks` | PK `id`; FK →T8, M7, M9 | `UNIQUE(sample_test_id, parameter_id) WHERE is_current=1`; `INDEX(sample_test_id)` | 1 |
| T13 | `txn_result_revision` | Every superseded value | `result_id`, `sample_test_id`, `parameter_id`, `rev_no`, `old_value_num`, `old_value_text`, `new_value_num`, `new_value_text`, `changed_by`, `changed_at`, `change_reason_code`, `change_reason_text` | PK `id`; FK →T12, T8 | `INDEX(result_id, rev_no)`; **reason mandatory** — this is your ISO 17025 / data-integrity defence | 1 |
| T14 | `txn_verification` | Verification/approval events | `sample_test_id`, `level` (1/2), `action` (verify/send_back), `actor_personnel_id`, `acted_at`, `remarks`, `esign_id` | PK `id`; FK →T8, M19, S8 | `INDEX(sample_test_id, level)`; `CHECK(actor_personnel_id <> submitted_by)` enforced in service layer with an explicit override flag | 1 |
| T15 | `txn_report` | Issued document | `report_no`, `rev_no`, `ulr_no`, `report_type` (test_report/test_certificate/grading_certificate/conditioning_certificate), `order_id`, `customer_id`, `report_date`, `issue_date`, `state`, `is_partial`, `amends_report_id` (self-FK), `amendment_reason`, `withdraw_reason`, `template_code`, `pdf_attachment_id`, `pdf_sha256`, `public_token`, `printed_customer_name`, `printed_customer_address`, `signatory_personnel_id`, `signed_at`, `esign_id`, `reprint_count`, `nabl_symbol_used`, `disclaimer_text`, `sent_at`, `sent_to_email` | PK `id`; FK →T4, M1, S7, M19, S8, self | `UNIQUE(report_no, rev_no)`; `UNIQUE(ulr_no)`; `UNIQUE(public_token)`; `INDEX(customer_id, issue_date)`; `INDEX(state)` | 1 |
| T16 | `txn_report_test` | Which tests appear on which report (**enables partial reports**) | `report_id`, `sample_test_id`, `seq_no`, `snapshot_json` (all printed values, frozen) | PK `id`; FK →T15, T8 | `UNIQUE(report_id, sample_test_id)`; `INDEX(sample_test_id)` — a test may appear on an original **and** its amendment | 1 |
| T17 | `txn_invoice` `[ERP]` | Invoice **and** credit note (`doc_type`) | `invoice_no`, `doc_type` (invoice/credit_note), `invoice_date`, `customer_id`, `order_id`, `against_invoice_id` (for credit notes), `taxable_amount`, `cgst`, `sgst`, `igst`, `total_amount`, `paid_amount`, `state`, `place_of_supply`, `erp_invoice_id` | PK `id`; FK →M1, T4, self | `UNIQUE(invoice_no)`; `INDEX(customer_id, invoice_date)`; `CHECK(paid_amount<=total_amount)` | 1 |
| T18 | `txn_invoice_line` `[ERP]` | Billed test lines | `invoice_id`, `line_no`, `sample_test_id`, `test_id`, `description`, `qty`, `unit_price`, `discount`, `urgent_surcharge`, `tax_id`, `line_total` | PK `id`; FK →T17, T8, M5, M24 | `UNIQUE(invoice_id, line_no)`; `INDEX(sample_test_id)` — **this FK is what makes "revenue per test" answerable** | 1 |
| T19 | `txn_receipt` `[ERP]` | Money received | `receipt_no`, `receipt_date`, `customer_id`, `invoice_id`, `amount`, `mode` (cash/dd/neft/upi/challan), `instrument_no`, `bank_ref`, `govt_challan_no`, `head_of_account`, `state`, `erp_receipt_id` | PK `id`; FK →M1, T17 | `UNIQUE(receipt_no)`; `INDEX(invoice_id)`; govt receipts need head-of-account for CSB accounting | 1 |
| T20 | `txn_complaint` | ISO 17025 cl. 7.9 register | `complaint_no`, `received_date`, `customer_id`, `report_id`, `sample_id`, `channel`, `complaint_text`, `category`, `acknowledged_at`, `investigated_by`, `investigation_text`, `decision_text`, `decided_by` (**must not be a person involved in the original work**), `closed_at`, `outcome`, `ncr_id`, `state` | PK `id`; FK →M1, T15, T6, T21 | `UNIQUE(complaint_no)`; `INDEX(state)`; `INDEX(customer_id)` | 1 |
| T21 | `txn_ncr` | Non-conforming work + CAPA (cl. 7.10 / 8.7) | `ncr_no`, `raised_date`, `raised_by`, `source` (internal_audit/complaint/qc_failure/equipment/verification_send_back/other), `sample_id`, `sample_test_id`, `equipment_id`, `description`, `significance` (minor/major/critical), `immediate_action`, `customer_notified`, `customer_notified_at`, `work_recalled`, `reports_recalled_json`, `root_cause`, `corrective_action`, `action_owner_personnel_id`, `target_date`, `completed_date`, `effectiveness_check`, `verified_by`, `state` (open/in_progress/verification/closed) | PK `id`; FK →T6, T8, M14, M19 | `UNIQUE(ncr_no)`; `INDEX(state, target_date)` | 1 |
| T22 | `txn_custody_event` | Chain of custody + disposal ledger | `entity_type` (sample/subsample), `entity_id`, `event_type` (received/moved/issued_to_tester/returned_to_store/handed_to_customer/couriered/disposed), `event_datetime`, `from_party`, `to_party`, `from_location_id`, `to_location_id`, `actor_user_id`, `quantity`, `remarks`, `signature_attachment_id`, `scan_device_id` | PK `id`; FK →M18, S1, S7 | `INDEX(entity_type, entity_id, event_datetime)`; **append-only** | 1 |
| T23 | `txn_consumable_issue` | Consumable used per test | `consumable_id`, `lot_id`, `sample_test_id`, `worksheet_id`, `qty_issued`, `uom_id`, `issued_at`, `issued_by` | PK `id`; FK →M16, M17, T8, T9, M9 | `INDEX(lot_id)`; `INDEX(sample_test_id)`; decrements `mst_consumable_lot.qty_on_hand` | 1.1 |

### 4.3 System tables

| # | Table | Purpose | Key columns | PK / FK | Constraints & indexes | Ph |
|---|---|---|---|---|---|---|
| S1 | `sys_user` | Login | `username`, `password_hash`, `personnel_id`, `email`, `mobile`, `role_id`, `is_active`, `must_change_password`, `last_login_at`, `failed_login_count`, `locked_until`, `mfa_secret` | PK `id`; FK →M19, S2 | `UNIQUE(username)`; `UNIQUE(personnel_id)`; single role per user in V1, many-to-many later | 1 |
| S2 | `sys_role` | Role | `code` (front_desk, sample_clerk, tester, verifier, section_head, unit_incharge, accounts, store_keeper, quality_manager, admin, customer_portal), `name`, `is_system` | PK `id` | `UNIQUE(code)` | 1 |
| S3 | `sys_permission` | Atomic permission | `code` (`sample.receive`, `sample_test.allocate`, `result.enter`, `result.verify`, `report.sign`, `report.amend`, `customer.view_identity`, …), `module`, `description` | PK `id` | `UNIQUE(code)`; **`customer.view_identity` is the permission that implements the draft's confidentiality requirement — as a permission, not as a hard-coded rule** | 1 |
| S4 | `sys_role_permission` | Role → permissions | `role_id`, `permission_id`, `state_scope` (optional: permission only valid while entity is in given state) | PK composite; FK →S2, S3 | Status-aware permissions, as SENAITE does | 1 |
| S5 | `sys_audit_log` | Immutable field-level change log | `entity_type`, `entity_id`, `action` (insert/update/delete/login/print/export/state_change), `field_name`, `old_value`, `new_value`, `changed_by`, `changed_at`, `ip_address`, `user_agent`, `reason_text`, `request_id` | PK `id` | `INDEX(entity_type, entity_id, changed_at)`; `INDEX(changed_by, changed_at)`; **no UPDATE/DELETE grants on this table for the app user**; partition/archive monthly | 1 |
| S6 | `sys_state_transition` | State machine ledger (feeds TAT) | `entity_type`, `entity_id`, `from_state`, `to_state`, `event_code`, `actor_user_id`, `occurred_at`, `duration_in_previous_state_sec`, `reason_code`, `remarks` | PK `id` | `INDEX(entity_type, entity_id, occurred_at)`; `INDEX(to_state, occurred_at)`; **every TAT/bottleneck report reads this table, not timestamps scattered across business tables** | 1 |
| S7 | `sys_attachment` | Documents, sample photos, certificates | `entity_type`, `entity_id`, `doc_category` (sample_photo/instrument_printout/calibration_cert/customer_letter/sop/external_report/signature), `file_name`, `stored_path`, `mime_type`, `size_bytes`, `sha256`, `uploaded_by`, `uploaded_at`, `is_public` | PK `id` | `INDEX(entity_type, entity_id)`; `INDEX(sha256)`; store files on disk/object store, path in DB — **never BLOB the sample photos** | 1 |
| S8 | `sys_esign` | Signature record | `entity_type`, `entity_id`, `signer_user_id`, `signer_personnel_id`, `role_at_signing`, `meaning` (entered_by/verified_by/approved_by/authorised_signatory), `signed_at`, `ip_address`, `auth_method` (password/otp/dsc/aadhaar_esign), `payload_sha256`, `certificate_serial` | PK `id`; FK →S1, M19 | `INDEX(entity_type, entity_id)`; hash binds the signature to exactly what was signed | 1 |
| S9 | `sys_notification` | Alerts & their delivery | `recipient_user_id`, `channel` (in_app/email/sms/whatsapp), `event_code`, `entity_type`, `entity_id`, `title`, `body`, `created_at`, `sent_at`, `read_at`, `delivery_state`, `retry_count` | PK `id`; FK →S1 | `INDEX(recipient_user_id, read_at)`; `INDEX(delivery_state)` | 1.1 |
| S10 | `sys_public_token` | Public report verification link | `token` (≥128-bit random, URL-safe), `entity_type` (report), `entity_id`, `issued_at`, `expires_at` (nullable = never), `access_count`, `last_accessed_at`, `is_revoked`, `revoke_reason`, `visible_fields_json` | PK `id`; FK →T15 | `UNIQUE(token)`; `INDEX(entity_id)`; **token must be random, not the report number** | 1 |
| S11 | `sys_setting` | Config key-values | `scope` (global/section/user), `scope_id`, `key`, `value`, `data_type`, `description` | PK `id` | `UNIQUE(scope, scope_id, key)` | 1 |
| S12 | `sys_scan_event` | Barcode scan log per station | `barcode_payload`, `resolved_entity_type`, `resolved_entity_id`, `station_code`, `scanned_by`, `scanned_at`, `action_taken`, `was_resolved` | PK `id` | `INDEX(resolved_entity_id, scanned_at)`; unresolved scans are your data-quality alarm | 1.1 |

### 4.4 Cross-cutting constraints & implementation notes

| Topic | Decision |
|---|---|
| **Numbering series concurrency** | Allocate the number in its own tiny transaction with a row lock (`UPDATE mst_numbering_counter SET last_number = last_number + 1 … ; SELECT`), then write the business row. Do **not** derive numbers with `MAX(no)+1` — two receipt clerks scanning at once will collide. Government labs need gap-free series; if a business row later fails, keep the allocated number and mark it `VOID` in a `void_numbers` note rather than reusing it. SENAITE's own ID server has documented ID-gap bugs; do not repeat that. |
| **Snapshotting** | `txn_sample_test` snapshots `method_id`, `method_revision`, `standard_tat_days`, `unit_price`. `txn_report_test.snapshot_json` freezes everything printed. A report reprinted in 2031 must render identically even if the method, price and customer address have all changed. |
| **Soft delete** | No hard deletes anywhere in `txn_*`. Use states. Add `is_deleted` only on masters, and block deletion of any master that is referenced. |
| **Timestamps** | Store UTC with offset (`DATETIMEOFFSET` / `timestamptz`); display IST. TAT arithmetic in one server-side function only. |
| **Confidentiality (draft point 4)** | Implement as **column-level masking driven by `customer.view_identity`**, applied in the query/DTO layer — never by hiding a UI field while the API still returns the name. Testers see `sample_no`, sample type, description, tests, parameters, method, due date. They do not see customer name, contact, price, or `customer_sample_ref` if it contains a firm's mark. |
| **Where CloudZoo ERP ends** | ERP owns: customer, item/consumable, asset, invoice, receipt, tax, GL. LIMS owns: everything else. Integrate by FK to ERP IDs (`erp_customer_id`, `erp_invoice_id`) with a thin sync, and pick **one** system of record per field. The commonest integration failure is two editable copies of the customer address. |

---

## 5. TAT / due-date management

### 5.1 How due dates are computed

```
due_datetime = add_working_time(
        start   = tat_clock_start,
        amount  = effective_tat,
        calendar = lab_calendar )
```

| Component | Definition | Where it lives |
|---|---|---|
| `tat_clock_start` | **Sample acceptance timestamp**, not order date and not receipt. If the sample was received at 17:45 after cut-off, start from next working day 09:30. Store `cutoff_time` in `sys_setting`. | `txn_sample.received_datetime` + acceptance transition in `sys_state_transition` |
| `standard_tat_days` | Per **test** (not per sample). Silk size testing on 400 skeins is days; a GSM check is hours. Store as decimal days or as `tat_minutes` so sub-day tests work. | `mst_test.standard_tat_days`, snapshotted to `txn_sample_test` |
| Conditioning time | Methods requiring 20 °C/65 % RH conditioning have a mandatory pre-test wait. Model as `mst_test_method.conditioning_hours` and **add it to the TAT**, not hide it. | `mst_test_method` |
| Priority | `normal` = standard TAT; `urgent` = standard × `urgent_factor` (e.g. 0.5) and price × `urgent_multiplier` or `+ urgent_flat_add`; `emergency` = fixed hours. | `txn_order.priority`, `mst_rate_card_line` |
| Working calendar | Mon–Sat 09:30–18:00 minus lunch, minus government holidays, minus declared local holidays. Weekly pattern in `sys_setting`; exceptions in `mst_calendar_exception`. **Do not use calendar days** — a lab that promises "3 days" and counts Sunday and Independence Day will breach its own SLA on paper. | `mst_calendar_exception` |
| Hold exclusion | Sum of `ON_HOLD` / `ON_HOLD_PAYMENT` durations from `sys_state_transition` is **subtracted** from elapsed TAT and pushes `due_datetime` forward. Two clocks reported separately: **Gross TAT** (receipt→report) and **Net Lab TAT** (gross − holds). | `txn_sample.total_hold_minutes`, `txn_sample_test.hold_minutes` |
| Sample-level due date | `MAX(due_datetime)` across its tests, because the report goes out when the last test finishes. Order-level promised date = `MAX` across samples. | derived, stored |

**Retest handling:** a verifier send-back does **not** reset the clock (otherwise poor first-time-right quality is rewarded). Track `retest_count` and report **First-Time-Right %** separately.

### 5.2 SLA breach alerting (escalation ladder)

| Trigger | When | Notify | Channel |
|---|---|---|---|
| Not allocated | 25 % of TAT elapsed, state still `PENDING` | Section Head | in-app + daily digest |
| Not started | 50 % elapsed, state `ALLOCATED` | Tester + Section Head | in-app |
| At risk | 80 % elapsed, not `RESULT_ENTERED` | Tester + Section Head | in-app + email |
| Verification queue | `RESULT_ENTERED` > 24 working hours | Verifier + Section Head | email |
| Report queue | `TESTING_COMPLETE` > 24 working hours, no report | Report writer + Unit Incharge | email |
| Breached | `now > due_datetime` | Unit Incharge | email + dashboard red |
| Chronic breach | Same test type breached > 3× in a month | Unit Incharge + Quality Manager | monthly report |
| Aged sample | `IN_RETENTION` past `retain_until` + 30 days | Store Keeper | monthly |
| Calibration | `next_calibration_due` in 30 / 15 / 7 / 0 days | Equipment custodian + Section Head | email |
| Stock | `qty_on_hand <= reorder_level`, or lot expiring in 30 days | Store Keeper | weekly |

Implement as one scheduled job (every 15 min) writing to `sys_notification` with an idempotency key `(event_code, entity_id, threshold)` so the same alert is not sent 96 times a day.

### 5.3 Dashboards / KPIs a lab head actually wants

Keep the main screen to **8 tiles**. Industry guidance is explicit that 5–8 rigorously measured KPIs beat 30 superficial ones.

| KPI | Formula | Source |
|---|---|---|
| Samples in-house today | count `txn_sample` in `RECEIVED`…`TESTING_COMPLETE` | T6 |
| Tests pending, bucketed | count `txn_sample_test` by state: pending-allocation / in-test / awaiting verification / awaiting report | T8 |
| Overdue tests | count where `now > due_datetime` and state < `VERIFIED`, split 0–1 / 1–3 / >3 days late | T8 |
| On-time report % (month) | reports issued on/before promised date ÷ reports issued | T15 + T4 |
| Median & 90th-percentile Net TAT | per test and per section | S6 |
| First-time-right % | tests verified with `retest_count = 0` ÷ tests verified | T8 |
| Sample rejection rate | samples `REJECTED` ÷ samples received | T6 |
| Revenue booked vs realised (month) | `SUM(invoice.total)` vs `SUM(receipt.amount)`; plus outstanding ageing | T17/T19 |
| Tester workload | open tests per tester, weighted by standard TAT (a capacity number, not a count) | T8 + M5 |
| Equipment out-of-service / calibration overdue | count | M14/M15 |
| Bottleneck view | avg time in each state from `sys_state_transition` | S6 |
| Open NCRs / complaints past target | count | T20/T21 |

---

## 6. Barcode / QR on the sample

The draft only puts a QR on the *report*. That is the last 1 % of the traceability problem. The label on the sample is what removes transcription errors.

### 6.1 Symbology recommendation

| Option | Verdict for this lab |
|---|---|
| **QR Code (ISO/IEC 18004)** | **Recommended primary.** Reason: any staff phone or a ₹2,000 2D scanner reads it, no special training, and the lab is already committing to QR on reports so there is one mental model. |
| Data Matrix (ISO/IEC 16022) | Technically the lab-industry default — denser at small sizes, strong error correction, FDA UDI precedent. Choose this **instead of QR** only if you must label individual small cones/vials under ~15 mm, or if an analyser demands it. |
| Code 128 (1D) | **Add as a secondary** on the same label. Cheap laser/wedge scanners and older hardware read it instantly; it is also the fallback when a 2D scanner dies. |
| RFID | Not justified at this scale. Revisit only for rack-level retention stores. |

**Decision: QR Code (primary) + Code 128 (secondary) + human-readable text, on a 50 × 25 mm direct-thermal or thermal-transfer label.** Thermal transfer if labels must survive the conditioning chamber at 65 % RH for days.

### 6.2 What the code encodes

**Encode an opaque identifier only.** Do not encode customer name, test list or price — labels get photographed, left on benches and seen by other customers' agents, and the draft's own confidentiality requirement would be defeated by a label that says "M/s XYZ Silks".

```
Payload:  https://lims.<domain>/s/9F3K2QX7
          (short path + 8–10 char random, case-insensitive, Crockford-base32,
           no I/L/O/U to avoid mis-transcription)
Offline mode: SMP:RS2627RS00412        (plain sample number, if no public URL wanted)
```
Store the payload in `txn_sample.barcode_payload`. Resolve via `sys_public_token` (scope = sample, **internal auth required** — unlike report tokens, sample tokens must not be publicly viewable).

### 6.3 Human-readable label content

```
┌──────────────────────────────────────────────┐
│ RSTRS DHARMAVARAM        ┌──────────┐        │
│ RS/26-27/RS/00412        │   QR     │        │
│ Raw Silk · 5 skeins      │  code    │        │
│ Recd 19-08-2026 11:40    └──────────┘        │
│ Tests: SIZ, TEN, EVN, COH      DUE 22-08     │
│ ‖‖‖ ‖‖ ‖‖‖‖ ‖ ‖‖‖ (Code128: RS2627RS00412)   │
└──────────────────────────────────────────────┘
```
Mandatory fields: lab name/unit, **sample number**, sample type + unit count, received date/time, due date, test short-codes, both codes. Optional: sub-sample suffix (`-P01`), priority flag (red "URGENT" band), retention flag. **Never** the customer's name.

### 6.4 Labels, sub-samples, re-labelling

| Rule | Detail |
|---|---|
| Print on **acceptance**, not registration | An `EXPECTED` sample has no physical existence; printing early creates orphan labels. |
| One label per physical unit | 5 skeins → 5 labels carrying the same sample number, or per-unit suffixes if units are tested separately. |
| Sub-sample labels | Parent number + `-P01`, smaller 25 × 12 mm label. |
| **Re-labelling** | Never reuse or re-issue a number. A damaged label is *reprinted* with the same payload; increment `txn_sample.label_print_count` and log to `sys_audit_log` with a reason. A reprint count of 6 on one sample is a physical-handling problem worth seeing. |
| ID immutability | A sample number, once allocated, is never changed, even if the customer or test list changes. |

### 6.5 Scan stations (each scan = one `sys_scan_event` row)

| Station | Scan does |
|---|---|
| Receipt counter | Confirms label ↔ record match after printing |
| Store-in | Records `txn_custody_event` moved-to-location |
| Issue to tester | Opens the "my tests for this sample" screen; records issue custody event; **blocks** if the scanning user is not the assigned/competent tester |
| Bench / result entry | Opens the result-entry form directly — this is where the error reduction actually happens |
| Verification desk | Pulls up submitted results |
| Report desk | Pulls the reportable set |
| Retention store | Records shelf location |
| Disposal / return | Records disposal or handover, with receiver's name |

### 6.6 Report QR (draft point 8) — do it properly

The draft says "anyone scanning can view the report online." Two things to add:

1. **NABL requires a dual QR code** on test reports and calibration certificates (guideline ref. NABL/Labs/2022/001, 17 May 2022, aligned with DPIIT direction): one QR to the lab's NABL accreditation certificate and approved scope, a second giving secure access to the report for verification/download. **ASSUMPTION — VERIFY:** I could not confirm whether the Dharmavaram unit is currently NABL-accredited. If it is (or intends to be), build for dual QR and for the **18-digit ULR number** now. NABL's ULR format historically = 6-char certificate no. (e.g. `TC12345`) + 2-digit year + 1-digit lab no. + running serial, **but NABL published a new accreditation-certificate-number format and a revised ULR clarification in June/July 2026 — the developer must read the current NABL circular before hard-coding the format.** Model ULR as a configurable `mst_numbering_series` pattern, never as string concatenation in code.
2. **A URL-in-a-QR is not proof of authenticity** — a forger can print a lookalike QR pointing to a lookalike site. Mitigations, cheap to expensive: (a) print the **document SHA-256 short hash** on the report face and show it on the verification page; (b) show a verification page that renders the *authoritative* values server-side rather than serving the uploaded PDF; (c) V2 — digitally sign the PDF with a CCA-licensed DSC / Aadhaar eSign so it verifies offline in any PDF reader. Also: the verification page must serve **"SUPERSEDED — see Rev 2"** or **"WITHDRAWN"** rather than 404, and must never expose one customer's report to another (token-only access, no enumerable IDs, rate-limited, `access_count` logged).

---

## 7. Instrument / equipment data capture

### 7.1 What's realistic, by phase

| Phase | Approach | Effort | What it buys |
|---|---|---|---|
| **V1** | **Manual entry, hardened.** Reading-level grid (`txn_observation`), per-parameter min/max plausibility limits, decimal enforcement, mandatory `n` readings per method, auto mean/SD/CV, **mandatory attachment of the instrument printout / photo** (`sys_attachment`, category `instrument_printout`), equipment selected from `mst_equipment` with a calibration-validity guard. | Low | 90 % of the audit and error benefit. Most silk tests (seriplane evenness/cleanness/neatness, cohesion cycle counting, visual inspection) are **operator-judgement tests with no digital output at all**, so this is the correct answer, not a compromise. |
| **V1.5** | **CSV / TXT watch folder.** A small Windows service watches a folder per instrument, parses files with a per-instrument mapping (delimiter, header rows, column→parameter map, sample-ID column), writes `txn_observation` rows with `entry_mode='file_import'`, archives the raw file as an attachment, and quarantines unmatched rows for human resolution. Configuration in DB, not in code. | Medium | Removes transcription for the balance and tensile tester. This is the standard lowest-effort integration path and needs no instrument drivers. |
| **V2** | **Serial (RS-232/USB-serial) capture.** A local agent opens the COM port, reads the balance's print-key output line, and pushes a single weight into the focused reading cell. Note RS-232 is increasingly obsolete (no ports on modern PCs, cable length limits); use a USB-serial adapter, or a third-party capture appliance for balances that only emit to a serial printer. | Medium-high | Genuine keystroke elimination on high-volume weighing (400 sizing skeins). |
| **V3** | Bidirectional / worklist download, TCP-IP or vendor API. | High | Only worth it if the lab buys a modern networked tensile tester. |

### 7.2 Per-equipment reality check for a silk/textile lab

| Equipment | Typical output | Practical capture |
|---|---|---|
| Electronic balance (denier / GSM weighing) | Serial print line or nothing | V1 manual; V2 serial — **best ROI of any integration here** |
| Quadrant / skein scale | Analogue dial | Manual only |
| Serimeter / tensile tester (tenacity, elongation) | On-board printout, sometimes CSV/PDF export | V1 manual + printout scan; V1.5 CSV if the model exports |
| Seriplane inspection board (evenness, cleanness, neatness) | Human comparison against standard panels under standard illumination | Manual, structured grading entry; capture panel photo |
| Duplan cohesion tester | Cycle count read by operator | Manual |
| Twist tester | Digital counter display | Manual |
| Conditioning chamber / oven (20 °C, 65 % RH) | Chart or datalogger CSV | V1.5 CSV import into an environment-log table; V1: manual twice-daily log |
| Moisture / boil-off (oven + balance) | Weights | Manual, formula-computed |
| Colour matching cabinet / grey scale | Visual grade | Manual enum entry |

### 7.3 Non-negotiable rules whatever the method

1. Every observation records `equipment_id` and `entry_mode`. An auditor's first question is "which balance, and was it in calibration on that date?" — answer it with a join, not a paper file.
2. **Block** result submission if the selected equipment's calibration was expired on the observation date. Warn, require Unit Incharge override with reason, and auto-raise an NCR if overridden.
3. Imported raw files are kept forever as attachments with SHA-256. The parsed values are derived data; the file is the technical record (ISO 17025 cl. 7.5).
4. Never let an import silently overwrite a manually entered value — flag the conflict for a human.
5. Environment conditions (temp/RH) at test time are stored on the worksheet or the test, because silk tenacity and elongation are humidity-sensitive and the report may need to state the conditions.

---

## 8. Reporting & analytics

| # | Report | Purpose / audience | Key dimensions & filters | Source tables |
|---|---|---|---|---|
| 1 | **Sample Register (statutory)** | The bound-register equivalent; printed and filed monthly | Date range, sample type, customer category, section | T6, T4, M1 |
| 2 | **Test Register** | Every test with dates, tester, verifier, result summary | Date, test, section, tester | T8, T12 |
| 3 | **Pending / WIP register** | Daily standup document | Bucketed by state, age, priority, overdue flag | T8, T6 |
| 4 | **Workload per tester** | Allocation fairness & capacity | Tester × period; count and TAT-weighted hours; completed vs open | T8, M19 |
| 5 | **TAT performance** | On-time %, median/P90 net TAT, by test and by section; breach reason analysis | Test, section, priority, customer | S6, T8, T15 |
| 6 | **Bottleneck / state dwell time** | Where the days actually go | Avg & P90 time in each state | S6 |
| 7 | **Revenue per test** | Which tests earn; pricing review | Test × period; qty, gross, discount, net, tax | T18, T8, M5 |
| 8 | **Tests / revenue per customer** | Top customers, concentration risk, dormant customers | Customer × period; also customer category (reeler vs exporter) | T18, M1 |
| 9 | **Rejection & abort analysis** | Sample rejection rate by reason code and by sender — feeds customer education | Reason code, sample type, customer, month | T6, T8 |
| 10 | **First-time-right / retest analysis** | Quality of testing, training needs | Tester, test, send-back reason | T8, T14, T13 |
| 11 | **Result trend / grade distribution** | Domain gold for a silk lab: denier deviation and grade distribution by region/reeler over seasons | Parameter, sample type, customer district, month | T12, T6, M1 |
| 12 | **Out-of-spec / fail rate** | Quality of the *material* being tested | Parameter, spec set, period | T12, M11 |
| 13 | **Equipment utilisation** | Justify new equipment purchases to HQ | Equipment × period; tests run, hours in test, downtime | T8, M15 |
| 14 | **Calibration due & status** | Compliance; print for audit | Next 30/60/90 days; overdue in red | M14, M15 |
| 15 | **Equipment breakdown / downtime log** | Maintenance budget | Equipment, month | M15 |
| 16 | **Consumable stock & reorder** | Purchase indent trigger | Below reorder level; expiring in 30/60 days; consumption per test | M16, M17, T23 |
| 17 | **Pending approvals** | Personal queue per verifier/signatory, with ageing | Actor, ageing bucket | T8, T15 |
| 18 | **Report issue register + reprints + amendments** | Document control; amendment rate is a quality metric | Period, report type, signatory | T15, T16 |
| 19 | **Retention & disposal register** | What is on the shelf, what is due for disposal, what was disposed and by whose authority | Location, retain_until, disposal date | T6, T22 |
| 20 | **Chain-of-custody trail (per sample)** | One-click audit answer for a single sample | Sample | T22, S6, S5 |
| 21 | **Complaint & NCR/CAPA register** | ISO 17025 cl. 7.9/7.10 management review input | Period, category, status, overdue actions | T20, T21 |
| 22 | **Competency / authorisation matrix + expiry** | Audit exhibit; training plan | Person × method | M20, M19 |
| 23 | **Outstanding / receivables ageing** | Money follow-up | Customer, 0-30/30-60/60-90/90+ | T17, T19 |
| 24 | **Cash/receipt & head-of-account summary** | Government accounting reconciliation | Date, mode, head of account | T19 |
| 25 | **Audit trail extract** | Who changed what, exportable, filterable | Entity, user, date | S5 |
| 26 | **QR verification access log** | Who is checking reports; detects abuse | Report, period | S10 |
| 27 | **Monthly return to CSTRI / CSB HQ** | **Build this as a first-class, one-click, versioned, locked-on-submission report** | Month; samples received / tested / reported by material type; revenue by head; pending; equipment status; staff strength | T6, T8, T15, T17 |
| 28 | **Annual/quarterly consolidated performance** | Annual report inputs; RFD/targets | Year, comparatives vs previous year | all |

**Design decision for #27:** ask the scientist for the *exact current HQ return format* on day one and model the data model to produce it without manual Excel work. In a CSB/CSTRI unit, the monthly return is the single report whose absence guarantees the software gets bypassed — the staff will keep a parallel Excel sheet, and once a parallel sheet exists the LIMS data goes stale. Store each submitted return as an immutable snapshot row so a later data correction never silently changes a return already sent to HQ.

---

## 9. Top 12 LIMS implementation failure modes → the design decision that prevents each

| # | Failure mode (from published post-mortems and vendor/consultant accounts) | The design decision that prevents it |
|---|---|---|
| 1 | **Requirements gathered only for today's happy path** — cited as the single biggest cause of LIMS failure; the sample-approval flow that works at go-live has to be rebuilt when a second unit or a new test type arrives | Build the **state machine and the test/method/parameter hierarchy as data, not code**. Adding a test, method, parameter, spec set, rate or holiday must be a data-entry job for the scientist, never a developer task. Write the transition table (§2) into a config table and have exactly one service that executes transitions. |
| 2 | **Underestimating master/static data** — configuring products, tests and sample plans is repeatedly named the most underestimated task | Treat the **test catalogue as a project deliverable with its own deadline**: sit with the scientist, enumerate every test × method × parameter × UoM × standard TAT × price, and load it before any UI is polished. Budget more time for this than for the result-entry screens. |
| 3 | **Data migration deferred to the end** | Import the **last 12 months of sample and report history** in week 2, not week 20. It exposes every field you missed, and it lets the lab search old reports on day 1, which is the fastest route to user buy-in. |
| 4 | **Users excluded, then resistant** — inadequate training and change management is a leading post-go-live failure cause | Prototype fortnightly with the actual tester and the receipt clerk on the actual bench. Ship the **result-entry screen first** and make it faster than the paper register — testers adopt what saves them keystrokes and reject what adds them. |
| 5 | **Over-customisation / hard-coding** | No lab-specific rule in source code. Number formats, TAT, holidays, prices, report templates, spec limits, permission-to-state mappings all live in `mst_*` / `sys_setting`. Compliance is a property of configuration and operation, not of the software itself. |
| 6 | **One entity doing four jobs** (the draft's "Job") | Separate `txn_order` / `txn_sample` / `txn_subsample` / `txn_sample_test` / `txn_worksheet` / `txn_report` from day 1. Merging them is a two-week saving now and a full rewrite later, because per-test assignment, per-test TAT and per-test revenue are all impossible once the grain is wrong. |
| 7 | **No audit trail, or a mutable one** | `sys_audit_log` + `sys_state_transition` written by DB triggers or a single repository layer, with **no UPDATE/DELETE grant** for the application login. Every result change requires a reason (`txn_result_revision.change_reason_code`). Retrofitting an audit trail after go-live is the most expensive change in this whole list. |
| 8 | **Reports edited in place after issue** | Issued reports are immutable. Amendment = new row, `rev+1`, `amends_report_id`, printed as an amendment referencing the original (ISO 17025 cl. 7.8.8), old public token serves a "superseded" banner. Store the PDF and its SHA-256. |
| 9 | **Numbering collisions and gaps** | Dedicated `mst_numbering_counter` with row-level locking in its own transaction; never `MAX()+1`; document that a voided number is never reused. SENAITE's own ID server has published ID-gap defects — this is a real, recurring bug class. |
| 10 | **Testers or verifiers who are not authorised for the method** | `mst_competency` checked as a **guard on allocate / submit / verify / sign**. Thermo SampleManager does exactly this — only instruments, methods and equipment the analyst is trained on are made available. Cheap to build, and it is the first thing an ISO 17025 assessor probes. |
| 11 | **Instrument integration attempted first** | Deliberately sequence it last (§7): harden manual entry + printout attachment in V1, CSV watch folder in V1.5. Labs that start with instrument interfacing spend the whole budget on 3 instruments and never ship the workflow. There is still no universal instrument data standard, so every interface is bespoke. |
| 12 | **The parallel Excel sheet** — a system that cannot produce the report the lab is *judged on* gets bypassed, and once bypassed its data rots | Ship the **monthly CSTRI/CSB return and the sample register** in V1 (§8 #27, #1). Also ship a full data export (CSV/Excel) of every register, so nobody ever needs to re-key. |
| 13 *(bonus)* | **Payment gate implemented as a hard block, so urgent government work stalls** | `ON_HOLD_PAYMENT` is a state with an explicit, logged **override with reason** by the Unit Incharge — and hold time is excluded from TAT so Accounts' delay is not counted as the lab's. |
| 14 *(bonus)* | **Confidentiality implemented in the UI only** | `customer.view_identity` enforced in the **data/DTO layer**; the tester's API response physically does not contain the customer name. UI-only hiding is a one-URL data leak. |

---

## 10. Immediate recommendations to fold into the spec (priority order)

1. Replace "invoice → sample → job" with **TRF (order) → sample → sample_test → result → verification → report → invoice**.
2. Rename "Job" to **Test** (`txn_sample_test`) and make it the assignable unit — one row per sample × test.
3. Add the four state machines (§2) as an explicit table in the spec; the scientist can read and correct it, and the developer can code directly from it.
4. Add method + parameter + observation layers, because silk tests are multi-reading and computed.
5. Add sample acceptance/rejection with a coded reason list, and a condition-on-receipt checklist.
6. Add sample barcode/QR labels and 8 scan stations (§6).
7. Add competency authorisation, calibration guard, and audit trail — the three cheapest audit-proofing features.
8. Add TAT with a working-day calendar and the escalation ladder (§5).
9. Add sample retention/return/disposal and chain of custody.
10. Add report amendment/withdrawal, the ULR/dual-QR question, and the report hash.
11. Add the monthly CSTRI/CSB return as a V1 deliverable.
12. Add internal/R&D (non-billable) order type — CSTRI does its own research and the draft has no place to put it.

---

## 11. Open questions for the scientist (blocking items)

| # | Question | Why it changes the design |
|---|---|---|
| 1 | Is the unit **NABL-accredited** (or applying)? Certificate number? | Decides ULR numbering, dual QR, NABL symbol rules, and how strict the amendment/NCR workflow must be. **Unverified — I could not determine this.** |
| 2 | Exact **current CSTRI/CSB testing charge schedule** and its office-order reference | Rate card master. **Unverified — CSTRI's fee schedule was not retrievable from public sources; must be obtained internally.** |
| 3 | Exact **monthly return format** sent to CSTRI/CSB HQ | Drives §8 #27 and several columns in `txn_sample`. |
| 4 | Complete **test × method × parameter list** with standard reference (IS 15090:2002? ISO 2060? GB/T 1798?), reading counts, standard TAT and price | The single biggest data-loading task. |
| 5 | **Grade schemes** actually issued (2A/3A/4A/5A/6A bands and the parameters that decide them) | `mst_spec_set` / `mst_spec_limit` structure. |
| 6 | **Retention period** and default disposal/return mode per sample type | `mst_sample_type.default_retention_days`. |
| 7 | Who may **sign** which report type, and is a second-level verification required? | Signatory authority + 1-level vs 2-level verification. |
| 8 | Is **advance payment** mandatory, and for which customer categories? | Payment-hold rules. |
| 9 | Does the unit **subcontract** any test to CSTRI Bangalore or another unit? | Subcontracting workflow + inter-unit order type. |
| 10 | Working hours, weekly off, and the **2026-27 holiday list** | Working-day calendar. |
| 11 | What exactly does **CloudZoo ERP** already own (customer, item, asset, invoice, receipt, GL) and what is its integration surface (DB, REST, files)? | Determines which of the 58 tables are references vs local. **Unverified — no CloudZoo documentation available to me.** |
| 12 | Number of concurrent users, samples/month, and whether the deployment is on-premises (govt LAN, possibly intermittent internet) or cloud | Public QR verification needs internet; if the LAN is isolated, the verification service must be a separately hosted component with a one-way publish. |

---

## Sources

- [SENAITE — Features](https://www.senaite.com/features/)
- [SENAITE — Quickstart Guide](https://www.senaite.com/docs/quickstart/)
- [SENAITE — Sample Basics](https://www.senaite.com/docs/sample-basics.html)
- [SENAITE — Sample Partitions](https://www.senaite.com/docs/sample-partitions)
- [senaite.core — sample workflow definition (2.x)](https://raw.githubusercontent.com/senaite/senaite.core/2.x/src/senaite/core/profiles/default/workflows/senaite_sample_workflow/definition.xml)
- [senaite.core — analysis workflow definition (2.x)](https://raw.githubusercontent.com/senaite/senaite.core/2.x/src/senaite/core/profiles/default/workflows/senaite_analysis_workflow/definition.xml)
- [senaite.core — repository](https://github.com/senaite/senaite.core)
- [Bika LIMS manual — Workflow chapter](https://www.bikalims.org/manual/workflow)
- [Bika LIMS manual — ID Server settings](https://www.bikalims.org/manual/setup-and-configuration/images-id-server/id-server-settings-for-bika-senaite-open-source-lims/view)
- [SENAITE Community — ID Formatting and Setup](https://community.senaite.org/t/id-formatting-and-setup/82)
- [SENAITE Community — Generating custom IDs for samples](https://community.senaite.org/t/generating-custom-ids-for-samples/246)
- [senaite.core issue #1327 — sample ID sequence gaps](https://github.com/senaite/senaite.core/issues/1327)
- [Baobab LIMS](https://baobablims.org/) · [Baobab LIMS repo](https://github.com/BaobabLims/baobab.lims)
- [Open-LIMS repo](https://github.com/open-lims/open-lims)
- [IntuitionLabs — A Guide to Open-Source LIMS](https://intuitionlabs.ai/articles/open-source-lims-guide)
- [IntuitionLabs — Guide to LIMS: Core Functions & 2025 System Comparison](https://intuitionlabs.ai/articles/lims-system-guide-2025)
- [SCC Soft Computer — What are LIMS Modules?](https://www.softcomputer.com/2024/03/18/what-are-lims-modules/)
- [Lab Manager — LIMS Software: A Complete Guide](https://www.labmanager.com/lims-software-a-complete-guide-to-laboratory-information-management-systems-35427)
- [LabWare — LIMS](https://www.labware.com/lims) · [LabWare QA/QC SaaS](https://www.labware.com/lims/saas/qaqc) · [LabWare — Instrument & systems integration](https://www.labware.com/lims/integration) · [LabWare — Top LIMS KPIs and dashboards](https://www.labware.com/blog/top-lims-kpis-and-dashboards)
- [LabVantage — Informatics platform (LIMS/ELN/LES/SDMS)](https://www.labvantage.com/informatics/) · [LabVantage docs — Modules](https://vantagecare.labvantage.com/labvantagedoc/Content/concepts/concepts_modules.htm) · [LabVantage — LIMS implementation best practices](https://www.labvantage.com/blog/turning-challenges-into-success-best-practices-for-lims-implementation/)
- [Thermo Fisher — SampleManager LIMS](https://www.thermofisher.com/us/en/home/digital-solutions/lab-informatics/lab-information-management-systems-lims/solutions/samplemanager.html) · [SampleManager LIMS/SDMS/LES brochure (PDF)](https://www.paperlesslabacademy.com/wp-content/uploads/2020/11/SampleManager-LIMS-SDMS-LES-brochure.pdf)
- [Astrix — Common causes of LIMS implementation failures](https://astrixinc.com/blog/commmon-causes-of-lims-implementation-failures/) · [Astrix — Key laboratory KPIs](https://www.astrixinc.com/blog/key-laboratory-kpis-and-lab-metrics-tracking-made-easy-with-a-lims/)
- [CSols — Top 4 reasons LIMS implementations fail](https://www.csolsinc.com/resources/top-4-reasons-lims-implementations-fail)
- [Agaram — Top 5 reasons LIMS implementations fail](https://www.agaramtech.com/blog/top-5-reasons-why-many-lims-implementation-fails-and-how-to-get-yours-right)
- [InterFocus — Why LIMS projects fail](https://www.mynewlab.com/resources/what-is-lims/why-lims-projects-fail/)
- [FP-LIMS — KPIs in a LIMS](https://fp-lims.com/en/resources/blog/kpis-in-lims/) · [Wavefront — LIMS dashboards and KPIs](https://www.wavefrontsoftware.com/lims-dashboards-and-kpis/)
- [Computype — Laboratory barcode labels: a complete guide](https://computype.com/blog/laboratory-barcodes-guide/) · [Computype — Engineering lab barcode labels for reliable scanning](https://computype.com/blog/engineer-laboratory-barcode-labels-for-reliable-scanning/)
- [LabTag — Tips for choosing the right barcode in the lab](https://blog.labtag.com/tips-for-choosing-the-right-barcode-in-the-lab/)
- [KFBIO — QR Code vs Data Matrix](https://kfbiopathology.com/application/qr-code-vs-data-matrix-code-principles-differences-and-why-dm-code-is-ideal-for-pathology-slide-digitization/)
- [QIA — Sample labeling and traceability standards](https://www.qi-a.com/learning-center/sample-labeling-and-traceability-standards-in-the-u-s/) · [QIA — Sample retention and disposal policies](https://www.qi-a.com/learning-center/sample-retention-and-disposal-policies-in-the-united-states/) · [QIA — How lab software helps sample retention](https://www.qi-a.com/learning-center/how-can-a-lab-software-helps-in-sample-retention-process/)
- [Lab Manager — Field-to-lab chain of custody](https://www.labmanager.com/ensuring-sample-validity-a-comprehensive-guide-to-field-to-lab-chain-of-custody-34513) · [Lab Manager — Environmental LIMS chain-of-custody automation](https://www.labmanager.com/environmental-lab-lims-chain-of-custody-automation-for-field-sample-compliance-35513)
- [QBench — How to integrate lab instruments with a LIMS](https://qbench.com/blog/how-to-integrate-lab-instruments-with-a-lims) · [Zendo LIMS — Connecting analysers with LIMS](https://www.zendolims.com/blog/integration-measuring-devices-analysis-with-lims.html) · [Martel Instruments — LIMS instrument integrations](https://martelinstruments.com/lims-instrument-integrations/)
- [PJLA — ISO/IEC 17025:2017 §7.1 Review of requests, tenders and contracts (PDF)](https://www.pjlabs.com/downloads/webinar_slides/2.22.2022_17025-Section-7-1.pdf) · [PJLA — §7.10 Nonconforming work (PDF)](https://www.pjlabs.com/downloads/webinar_slides/11.22.2021_17025-2017-Section-7-10.pdf)
- [ANAB — The importance of contract review under ISO/IEC 17025](https://blog.ansi.org/anab/importance-contract-review-iso-iec-17025/)
- [17025 Store — Clause 7 Process Requirements](https://17025store.com/iso-iec-17025-2017-requirements/clause-7-process-requirements/) · [RJ Quality Consulting — ISO 17025 Clause 7 explained](https://rjqualityconsulting.com/iso-17025-clause-7/)
- [QSE Academy — Changes in reporting requirements in ISO/IEC 17025:2017](https://www.qse-academy.com/reporting-requirements-iso-iec-170252017/) · [IAS — The new ISO/IEC 17025:2017 (PDF)](https://www.iasonline.org/wp-content/uploads/2018/01/The-New-ISO-IEC-17025-2017.pdf) · [EUROLAB Handbook ISO/IEC 17025:2017 (PDF)](https://aphl.org/docs/default-source/food-safety/human-and-animal-food-testing/eurolab-handbook-iso-iec-17025-2017.pdf)
- [NABL India](https://nabl-india.org/) · [NABL — Clarification on ULR Number (PDF)](https://nabl-india.org/wp-content/uploads/2023/11/Clarification-on-Unique-Laboratory-Report-ULR-Number.pdf) · [NABL — ULR for certificate TC-XXXXX (PDF)](https://nabl-india.org/wp-content/uploads/2021/12/Clarification-on-Unique-Laboratory-Report-ULR-Number-for-Accreditation-Certificate-TC-XXXXX.pdf) · [NABL — News & Announcements](https://nabl-india.org/news-announcements/)
- [The Health Master — NABL mandates QR code on test reports](https://thehealthmaster.com/2021/05/25/nabl-mandates-qr-code-on-test-reports-of-laboratories/) · [Qryptal — Why NABL mandated QR codes](https://www.qryptal.com/blog/why-nabl-mandated-qr-codes-for-document-security/) · [Qryptal — Implementing the NABL QR mandate](https://www.qryptal.com/blog/how-can-labs-and-testing-organisations-implement-and-integrate-nabl-mandate-on-qr-codes/) · [Envirocare Labs — QR code in NABL reports](https://envirocarelabs.com/qr-code-in-report-nabl-laboratory-transparency/) · [SmallCapCRM — NABL ULR guideline and impact on labs/LIMS](https://smallcapcrm.com/nabl-ulr-guideline-and-impact-on-labortories-and-lims/)
- [BIS LIMS](https://lims.bis.gov.in/)
- [FAO — Silk reeling and testing manual, Ch. 2](https://www.fao.org/4/x2099e/x2099e03.htm) · [Raw Silk Testing (PDF)](https://hbmahesh.weebly.com/uploads/3/4/2/2/3422804/5.raw_silk_testing-word.pdf) · [Agriculture.Institute — How to test and grade raw silk](https://agriculture.institute/introduction-to-sericulture/test-grade-raw-silk-quality-assurance/) · [Agriculture.Institute — Quality standards in sericulture](https://agriculture.institute/introduction-to-sericulture/quality-standards-sericulture-cocoons-silk-production/) · [ResearchGate — Influence of CSTRI denier control mechanism on quality of raw silk](https://www.researchgate.net/publication/298263733_Influence_of_CSTRI_Denier_control_mechanism_on_quality_of_raw_silk)

**Unverified items flagged above:** NABL accreditation status and certificate number of the Dharmavaram unit; current NABL ULR format after the June/July 2026 certificate-number change; CSTRI/CSB official testing charge schedule; the HQ monthly return format; CloudZoo ERP's schema and integration surface. All five must be confirmed from internal/official sources before the spec is frozen.

*Environment note: the `plugin:figma:figma` MCP server is unauthorised in this non-interactive session; it was not needed for this task, but Figma-based diagramming would require authorisation via claude.ai connector settings or `claude mcp` in an interactive session.*