# Adversarial Gap Analysis — RSTRS/SCTH Dharmavaram Lab Testing System (LIMS on CloudZoo ERP)

**Verdict up front:** the draft note is a good *conversation summary* and a bad *specification*. It describes a happy path for a generic job-shop, not a regulated textile testing laboratory. Three structural defects run through the whole document:

1. **The money leads the science.** Invoice before sample receipt is backwards and will break on the first real conditioning lot.
2. **"One sample = one job = one test log = one report" is the wrong data model** for silk work, where a single lot has many bales, a single sample has many tests, a single test has many specimens, and a single specimen has many readings.
3. **Nothing in the draft would survive a NABL (ISO/IEC 17025:2017) assessment**, because the record-keeping backbone — audit trail, method master, equipment calibration control, environmental conditions, uncertainty, conformity decision rule, amendment control, retention/disposal — is either absent or reduced to a passing phrase.

Everything below is specific. Where I state a domain fact (regain, standard atmosphere, denier arithmetic), treat it as something to confirm with the Unit Incharge in one sitting, not as something to design around blindly.

---

## PART 1 — Point-by-point analysis of the draft

### 1.1 Summary table

| # | Draft point | Gets right | Core ambiguity (worst one) | Biggest missing/wrong thing |
|---|---|---|---|---|
| 1 | Customer creation | Master data first; one source for invoice + report | What *is* a customer — the reeler, the broker who carried the sample, or the mill that owns it? | No immutable customer snapshot on issued reports; no customer *category* (reeler/twister/weaver/exporter/govt/internal) which CSB HQ returns require |
| 2 | Invoice with multiple tests | Multiple tests per request; charges are per test | Charges depend on sample count/bale count/weight/specimens — all unknown before receipt | **Wrong order.** No Test Request Form, no contract review (17025 cl. 7.1), no advance payment/challan model, no rate card |
| 3 | Sample-based job creation | Sample-wise traceability; unique job number | Definition of "sample" is undefined; is a job per sample, or per sample×test? | No sample acceptance/rejection, no receipt condition, no sub-sample/specimen layer, no acknowledgement to customer |
| 4 | Job assignment + blinding | Assignment is real; confidentiality intent is right | What exactly is hidden? The tester needs the *declared* denier/composition to test against | No competence gate (only authorised persons may run a method); blinding is unimplementable against physical bale marks without an SOP |
| 5 | Test log entry | Tester records results; images matter | "observations, results, remarks" = free text. Real silk tests need typed worksheets with 20–60 readings and formulae | No method master, no equipment/reagent/environment capture, no replicate→mean→CV% computation, no edit history |
| 6 | Test log approval | Approval before report; verification exists | One level or two? Can the approver *edit* values? What happens when the Incharge is the tester? | No named authorised signatory control, no rejection reason taxonomy, no delegation while on tour, no e-sign |
| 7 | Report generation | Report only after approval | Report content is completely unspecified | Missing all 17025 cl. 7.8.2 mandatory elements, conformity statement + decision rule, amendment/cancellation, dispatch record, NABL symbol rules |
| 8 | Public QR report access | Digital verification is genuinely valuable | "Anyone" — anyone in the world, forever, seeing full commercial results? | No token entropy, no tiered disclosure, no revocation, no offline verification, no forged-QR defence (see Part 3) |
| 9 | Equipment as "asset system" | Recognises equipment must be tracked | "Asset system" ≠ calibration management; these are two different modules | No calibration due control, no intermediate checks, no **out-of-calibration impact analysis**, no reference-standard class |
| 10 | Internal stock | Consumables matter | Which stock — chemicals? reference materials? stationery? spares? | No lot/expiry, no consumption-per-test traceability, no prepared-reagent register, no GFR-compliant stock register |

### 1.2 Detail

---

#### Point 1 — Customer Creation

**RIGHT**
- Correctly identifies that customer master must exist before billing and reporting.
- Correctly notes it feeds both invoice and report — the report legally must carry client name and address.

**AMBIGUOUS — questions the developer must ask**
1. Who is the "customer" of record when a **broker or agent** brings silk belonging to a mill? Is the client the person who pays, the person who signs the receipt, or the owner of the goods? 17025 requires the report to identify the client — get this in writing.
2. Is **GSTIN mandatory**? Most small reelers and charka units are unregistered. What is the fallback — PAN, Aadhaar (avoid), or nothing?
3. Are there **separate bill-to and report-to** parties? Consignee vs client?
4. Are there **customer categories** and do they drive different rates (reeler / twister / weaver / trader / exporter / handloom co-op / CSB internal unit / student / R&D / Silk Mark member / other government department)?
5. **Duplicate control**: the same firm will be entered as "Sri Lakshmi Silks", "Sree Laxmi Silks", "S L Silks". What is the dedupe key? Mobile number? Is a merge function needed, and what happens to reports already issued under the duplicate?
6. **Walk-in / one-time customers**: do we force full master creation, or allow a "cash customer" with name + mobile only? (You will need this — the counter cannot stop for data entry.)
7. Can a customer name/address be **edited after a report has been issued**? (Answer must be: the report keeps a frozen snapshot. Confirm.)
8. **Who** can create and who must approve a customer record? Any blacklist / defaulter flag?
9. Is the customer name ever needed in **Telugu or Hindi** on the report?
10. Is a **confidentiality undertaking** or NDA recorded per customer? Any customer who has requested extra confidentiality (no QR, no portal)?
11. Multiple contact persons, multiple addresses, multiple mobile numbers for OTP?

**MISSING or WRONG**
- **Immutable snapshot on issue.** Report and invoice must store name/address as-at-issue. Otherwise a later address edit silently rewrites history and you fail a records-integrity check.
- **Customer category → statistics.** CSB HQ/CSTRI monthly and annual returns are almost certainly broken up by stakeholder type and by silk type. If category isn't captured at source you will be re-deriving it from names forever.
- **Consent and personal data.** Individual reelers are natural persons; their name, mobile, address and test results are personal data under the DPDP Act 2023. There is no purpose/consent/retention thinking anywhere in the draft — and point 8 proposes publishing it.
- **Internal "customer".** R&D samples, samples from other CSB units, and departmental/complaint samples are zero-charge but still need jobs and reports. The draft's customer→invoice→job chain has no path for them.
- **Impartiality flag.** 17025 cl. 4.1: if a customer is related to staff, or the lab has any interest in the outcome, that must be identifiable and managed.

---

#### Point 2 — Invoice Creation with Multiple Tests

**RIGHT**
- One commercial document can carry many tests. Correct.
- Charges are per test, not per visit. Correct.

**AMBIGUOUS / WRONG — this is the most broken point in the draft**

The draft makes the invoice the *entry point*. For a testing laboratory the entry point is a **Test Request** which must be *reviewed and accepted* before any commitment. 17025 cl. 7.1 requires a record that the lab confirmed it has the capability, resources, method, and that customer requirements (including the decision rule for pass/fail) were defined and agreed. If you invoice first you have already contracted for work you may not be able to do.

It is also arithmetically impossible in this lab. Concretely:
- **Conditioning:** charges usually track number of bales and/or weight. The customer says "about 20 bales"; 18 arrive, one is torn open, one is wet. The bill cannot be raised first.
- **Raw silk grading:** the required test lot is a defined number of skeins. If the customer sends insufficient material you can do size but not seriplane. The bill changes.
- **Fabric testing:** number of specimens, warp and weft directions, number of colour-fastness variants. Not knowable from a phone call.

Questions the developer must ask:
1. **Is payment before or after testing?** Government labs commonly demand advance. Which is it, and is the rule "no testing without payment" or "no report release without payment"?
2. **How does money actually arrive?** Cash at counter with a printed receipt from a bound register? DD? NEFT with UTR? **Bharatkosh / NTRP challan**? PFMS? All of the above? Each needs a different field set and a different reconciliation report.
3. **Who fixes the rates?** A CSB HQ circular / office memorandum with an effective date? Then the system needs a **versioned rate card**, and reprints of old invoices must use the old rate.
4. **Is GST charged on testing?** Technical testing and analysis services are normally taxable (SAC 9983xx, commonly 18%) — but a statutory body's fee treatment must be confirmed with the finance wing in writing. Which of: taxable, exempt, nil, reverse charge? What is the place-of-supply rule for a Karnataka mill sending samples to an Andhra Pradesh lab? Is a GST invoice number series with a fixed prefix and no gaps required?
5. **Concessions and waivers.** Who can waive, by how much, and is an approval note required? (An audit objection generator if uncontrolled.)
6. **What happens when a test cannot be done?** Sample rejected, equipment down, method not in scope. Credit note? Refund? Refunds in government need a sanction — who sanctions, and does the system need to hold a sanction reference?
7. **Cancellation before/after testing starts** — full refund, partial, none?
8. **Urgency surcharge** for same-day conditioning? Is there a formal "urgent" rate?
9. **One invoice per request, or per sample, or per report?** Customers with 40 bales want one bill and one certificate. Testers want per-sample jobs. Both must be possible.
10. **Invoice numbering**: financial-year reset, unit prefix, gapless, never reused, no deletion (only cancellation). Confirm.
11. **Rounding**, minimum charge, per-parameter vs per-test vs per-sample pricing, package rates (e.g. "full grading" bundles 6 parameters).
12. **Retest charges** — free if the lab erred, chargeable if the customer wants a fresh sample tested. Who decides, and is it visible on the bill?
13. **Reprints of invoices** — controlled? "Duplicate copy" marking?

**MISSING**
- **Test Request Form (TRF)** with the customer's declarations: declared denier/count, declared composition, claimed grade, standard to be applied, spec limits to judge against, decision rule, end use, whether opinions/interpretations are wanted, whether subcontracting is permitted, sample return preference. Without these captured at request time, half the report content is impossible to produce.
- **Contract review record**: reviewed by, date, capability confirmed, deviations agreed, customer informed of deviations.
- **Quotation** for large/tender work, with validity and conversion-to-request.
- **Amendment of the request** after receipt (customer adds a test) with re-review and re-pricing.
- **Daily collection register and remittance/reconciliation** — cash received vs receipts issued vs deposited vs challan number. This is what an internal auditor or CAG audit will ask for first.
- **Unpaid-report hold** with an explicit override + reason.

---

#### Point 3 — Sample-Based Job Creation

**RIGHT**
- Sample-wise identity and tracking is exactly right.
- Auto-generation of job numbers avoids clerical error.
- Unique job number as the working handle is correct.

**AMBIGUOUS**
1. **Define "sample".** For fabric: one piece of cloth. For twisted yarn: one cone or one lot of cones. For conditioning: is a *bale* a sample, or is the *lot of 20 bales* the sample with 20 weighing records? "5 samples → 5 jobs" is fine for fabric and catastrophic for conditioning.
2. **Job granularity.** If sample S1 gets denier + tenacity + boil-off + fibre composition, is that 1 job with 4 tests, or 4 jobs? Who owns status at the *parameter* level? (Recommendation: 1 job per sample; a **Sample-Test allocation** row per test, assignable independently. State it.)
3. **How many identifiers exist?** Realistically four: customer's own bale/lot mark, lab sample code (on the label), job number, report number. Plus specimen numbers. What is the relationship and which one is printed where?
4. **Job number format**: unit code + FY + serial? Does the serial reset on 1 April? Must it be gapless (audit) — meaning cancelled jobs keep their number and are marked cancelled, never deleted?
5. **Specimens/sub-samples.** Five tensile strips cut from one fabric sample; twenty 450 m skeins reeled from one silk sample; a sub-sample drawn from each bale for oven drying. Does the system track these individually? (For grading, yes — the readings are per skein.)
6. **Quantity received** and its unit — kg, grams, metres, number of skeins, number of bales, number of pieces. Multiple units per sample.
7. **What if the count doesn't match the request?** 5 declared, 4 received. Auto-create 4 jobs and flag a shortfall?
8. **Walk-in with no prior request** — can a receipt/job be created first and the request/invoice back-filled?
9. **Can jobs be split or merged** after creation? (Usually no. Confirm.)
10. **Who** registers the sample, and can that person also be the tester? (Small lab — probably yes; that has impartiality consequences to document.)
11. **Where is the sample stored** — location/rack/bin ID? Silk is valuable; you need to be able to find it.

**MISSING**
- **Sample acceptance / rejection criteria and a rejection path.** Insufficient quantity, damaged packaging, broken seal, wet sample, unidentifiable marks, sample not matching declaration, contaminated. A rejected sample needs: recorded reason, photograph, customer intimation, and a decision (return / re-submit / proceed with recorded reservation and a caveat on the report).
- **Condition on receipt**: packing intact, seal number, visibly wet/stained/mildewed, mode of receipt (hand / courier / post — courier docket number), received from whom, date **and time**.
- **Acknowledgement slip to the customer** with sample codes, tests, expected date, and charges — printed, serially numbered. Staff will not use the system if it doesn't give them this piece of paper.
- **Chain of custody / movement log**: counter → conditioning room → oven → testing room → storage → return/disposal, with who handed over and who received.
- **Specimen conditioning gate.** Textile testing needs specimens conditioned in the standard atmosphere (in India commonly **27 ± 2 °C, 65 ± 2 % RH**) for a defined period before testing. That is a mandatory *wait state* in the workflow which the draft's linear arrow diagram does not contain — and it directly sets the minimum turnaround time.
- **Sampling by the lab.** If lab staff ever draw the sample themselves (from a bale, a godown, a customer's premises), 17025 cl. 7.3 requires a sampling plan and record, and the report must say so.
- **Label printing** with the sample code as barcode/QR, sized for a skein tag or a bale sub-sample bag.
- **Hold states**: awaiting payment, awaiting additional sample, awaiting equipment repair, awaiting customer clarification, awaiting subcontractor. Each with a reason and a clock-stop decision for TAT.

---

#### Point 4 — Job Assignment to Testing Team

**RIGHT**
- Assignment with an accountable individual is necessary and auditable.
- The confidentiality instinct is correct and unusually thoughtful for a draft note.

**AMBIGUOUS**
1. **Who assigns** — Unit Incharge only? Can a senior technical assistant assign? Can a tester pull from an unassigned queue?
2. **Assignment unit** — whole job, or individual tests within a job? (Must be per test: one person does the seriplane panel, another the strength test.)
3. **Reassignment** when someone is on leave, transferred, or on tour. Does history keep the original assignee?
4. **Competence gate** — may anyone be assigned any test? 17025 cl. 6.2 requires authorised, competent personnel per activity. The system should refuse to assign a method to an unauthorised person, or require a documented override.
5. **Two-assessor parameters** — visual grey-scale ratings and seriplane comparisons are often done by two people. Does the model support two independent readings and a resolution rule?
6. **Where do "required test parameters" come from?** They must come from a method master, not from free text on the job.
7. **Exactly which fields are hidden** from the tester — name, address, phone, GSTIN, invoice amount, PO reference, brand/mark, all of it? And which are shown — declared denier, declared composition, claimed grade, end use?
8. **Priority and due date** — must the tester see them? (Yes.)
9. Is there ever an **external/contract tester** or trainee whose entries need counter-signature?

**MISSING**
- **Personnel master with an authorisation matrix**: person × method × authorised-from-date × authorised-by × training/competence evidence × re-authorisation due. This is a NABL staple and it is absent.
- **Segregation of duties**: tester ≠ approver; ideally receiver ≠ tester. In a 3-person unit that is impossible for every job — so the system must at minimum *record* when the same person did two roles, so the lab can justify it and cap it.
- **Delegation of approval authority** with validity dates, for when the Incharge is on tour. Without this, work stops for a week and staff start signing on paper.
- **Impartiality / conflict-of-interest declaration** per person, and a flag if an assignee is connected to the client.
- **Workload view** — pending per person, ageing, overdue. The Incharge needs one screen.
- **Physical masking SOP** (see Part 4). Software blinding with an unmasked bale mark sitting on the bench is decoration.

---

#### Point 5 — Test Log Entry by Tester

**RIGHT**
- The tester who performed the test is the person who records it. Correct attribution.
- Remarks and sample images are genuinely needed.

**AMBIGUOUS / WRONG**

"Test observations, results, remarks, sample image and other required testing details" is a free-text mental model, and it is the single biggest under-specification in the draft. Real work looks like this:

- **Raw silk size (denier):** reel a defined number of 450 m skeins, weigh each on a 0.1 mg balance, convert (weight in g × 20 = denier, since 9000/450 = 20), then compute mean size, **size deviation**, **size variation (CV%)**, maximum deviation. That is 20+ numeric readings, 4 computed statistics, and a comparison against the declared nominal (e.g. 20/22 D).
- **Seriplane (evenness / cleanness / neatness):** panel-by-panel defect counts and comparison to standard photographs, converted to demerit points, per panel, then aggregated.
- **Grade assignment:** a lookup into a published grading table across several parameters, taking the worst-performing parameter. That is a *rules engine*, not a text box.
- **Conditioning:** per-bale gross weight, tare, sample weight before drying, weight after oven drying to constant mass, moisture %, then commercial net weight applying the official regain for silk (commonly **11 %**). Twenty bales = twenty rows of five numbers plus a lot-level computation. Money changes hands on this number.
- **Fabric tensile:** 5 warp + 5 weft specimens, mean, CV%, per ISO/IS method.
- **Colour fastness:** change in shade and staining on multiple adjacent fabrics, rated 1–5 on grey scales, possibly by two assessors.
- **Fibre composition / adulteration:** microscopy plus a solubility/quantitative method, reported as % with a stated tolerance — the commercially explosive test, because "100 % silk" vs "silk/polyester" decides a dispute.

Questions:
1. **Give me every test you do**, with: standard number *and year of revision*, parameters, number of replicates, the exact formula, rounding rule, unit, reporting format, minimum sample quantity, and TAT.
2. **Who may edit a saved reading, and does the old value survive?** (It must — 17025 cl. 7.5.2: alterations traceable, original not obliterated. No overwrite, no delete.)
3. **Discarded/outlier readings** — can a reading be excluded? Then it must remain visible with a reason and the exclusion must be authorised.
4. **Equipment used must be recorded per test** — and should the system *block* entry if that equipment is out of calibration or has a failed daily check?
5. **Environmental conditions at time of test** — manual entry from a wall hygrometer, or import from a data logger? Do results get rejected if RH was out of band?
6. **Reagents/reference materials used**, with lot and expiry.
7. **Timestamps** — specimen conditioning start, test start, test end. Dates of test must appear on the report.
8. **Auto-calculation vs manual.** If the system calculates, cl. 7.11.2 requires the calculations to be **verified before use** and the verification recorded. Are you prepared to produce that evidence?
9. **Measurement uncertainty** — is it reported? For which parameters? Is it a fixed value per method from an uncertainty budget, or computed per test?
10. **Images** — how many, minimum resolution, must the job code appear in the frame, taken on a phone with no signal in the lab (offline capture + later sync)?
11. **Partial save**, and what state a half-entered worksheet is in.
12. **"Test could not be performed"** — a legitimate outcome that needs its own path.
13. **Printed worksheet** for the wet bench. Nobody carries a laptop to a Soxhlet.
14. **Transcription control** — if readings are copied from an instrument display, is double entry or a verification tick required?

**MISSING**
- **Method master with version control** — the spine of the whole system. Method code, title, standard + revision, scope, parameters, replicate count, formulae, rounding, equipment required, reagents required, environmental requirement, sample quantity, TAT, whether NABL-accredited, uncertainty, effective from/to date. Reports must cite the method version *as used on that date*.
- **Structured worksheet templates** generated from the method master, with typed fields, ranges, and plausibility limits.
- **Deviation / permitted departure** recording, with authorisation, and a mandatory statement on the report.
- **Sample material consumed** (destroyed in drying/degumming) vs remaining, so return/disposal is honest.
- **Instrument data import** (CSV from balance/UTM) where available.
- **Offline entry** with local queue and sync.

---

#### Point 6 — Test Log Approval

**RIGHT**
- An independent verification step before issue. Correct and mandatory.

**AMBIGUOUS**
1. **How many levels?** Typical: (a) calculation/transcription check, (b) technical review of results and conformity, (c) authorisation of the report by a named signatory. The draft has one. Which do you want, and are they different people?
2. **Can the approver change a value?** If yes, the reading is no longer attributable to the person who observed it. Correct design: approver can only **approve** or **return with reason**; only the tester can change readings, and every change is versioned.
3. **Approval scope** — per test, per job, or per report? If a report covers 4 tests and 3 are approved, is a partial report allowed?
4. **Who is "the authorized person"?** Named individuals, per discipline, matching the lab's NABL authorised-signatory list. Does the system enforce the list?
5. **What if the Scientist-D both tested and must approve?** State the rule and its justification now, because the assessor will ask.
6. **Delegation during tour/leave**, with start/end date.
7. **Return-to-tester loop** — is the returned version retained? Is a "rejection reason" from a fixed list required (calculation error, transcription error, method deviation, insufficient replicates, out-of-band environment, equipment issue, needs retest)?
8. **Is approval a legal signature?** Password re-entry? OTP? Digital Signature Certificate? An image of a signature pasted on a PDF is not a signature.
9. **Ageing/SLA** on pending approvals, and escalation.

**MISSING**
- **Nonconforming-work trigger.** When a review finds an error in work already reported, cl. 7.10 requires a documented nonconformity, an evaluation of significance, a decision on acceptability, and where needed **recall/amendment of reports already issued**. Nothing in the draft handles "we already sent it and it was wrong".
- **Immutable approval record** — who, when, from which IP/device, on which content hash.
- **Second-signatory / countersignature** where the lab's scope requires it.
- **Pending-approval dashboard** with overdue flags.

---

#### Point 7 — Test Report Generation

**RIGHT**
- Report strictly after approval. Correct.

**AMBIGUOUS — the entire content of the report is unspecified**

A conforming test report needs, at minimum (17025 cl. 7.8.2 / 7.8.3):
title; lab name and address; location where the test was performed if not the lab; **unique identification on every page**; page "x of y"; client name and address; identification of the method used; unambiguous description, condition and identification of the item tested; date of receipt of the item; **date(s) of performance of the test**; date of issue; sampling plan and details if the lab sampled; results with units; where applicable, statement of measurement uncertainty; additions to / deviations from / exclusions from the method; statement of conformity with the decision rule if a pass/fail is given; a statement that results relate only to the items tested; a statement that the report shall not be reproduced except in full without written approval; name, function and signature of the person authorising the report; and clear identification of any results from a subcontractor.

Plus, if accredited: NABL symbol usage rules (see NABL 133), the accreditation certificate number, and **clear marking of any non-accredited test appearing on the same report**.

Questions:
1. **One report per job, per sample, or per request?** The 20-bale conditioning customer wants one certificate. Design must allow a report to cover many samples.
2. **Report number series** — separate from job number? Format? FY reset? Gapless?
3. **How many templates?** Conditioning certificate, raw silk test report, raw silk grading certificate, twisted yarn report, fabric test report, fibre composition report, dyed-fabric fastness report, Silk Mark / authenticity report, zari report (if you do it), internal R&D report. Each with different tables.
4. **Bilingual?** A certificate issued by a central government office may need Hindi and English (Official Languages Act, s. 3(3)). Confirm with the administrative wing — this changes every template and the PDF font stack.
5. **Letterhead, national emblem, CSB logo, unit address, NABL logo placement.**
6. **PDF only?** (Yes. Never issue an editable file.)
7. **Signature** — scanned image, eSign, or Class 3 DSC? Is the lab willing to buy DSC tokens?
8. **Draft vs final** — is a draft ever shown to the customer? Watermark?
9. **Conformity statement** — do reports say pass/fail? Against whose specification? With what decision rule (simple acceptance, guard band)? This must be agreed at request time and printed.
10. **Opinions and interpretations** — does the Scientist ever write "sample appears to be adulterated with viscose"? That is an opinion under cl. 7.8.7 and must be marked as such, with the basis recorded.
11. **Reprints** — allowed? Marked "duplicate"? Logged?
12. **Sample photograph placement** and whether the photograph is part of the signed content (it must be inside the hashed PDF).

**MISSING**
- **Amendment / revision control.** A revised report must carry a new identifier, reference the report it replaces, state the reason for amendment, and the superseded report must be marked superseded everywhere including the QR page.
- **Cancellation / withdrawal** with reason, plus a recall notice to the customer.
- **Report register** — the statutory list of every certificate issued, in serial order, with status.
- **Delivery record**: emailed to (address, timestamp, bounce status), downloaded by (who, when), hard copy dispatched (date, mode, speed-post/courier tracking number, number of copies, received-back acknowledgement), or handed over at counter with signature.
- **Retention and archival** of the exact issued PDF bytes plus its hash.
- **Sample retention/return/disposal** decision printed or recorded at the same time — customers ask "where is my silk" on the same phone call as "where is my report".

---

#### Point 8 — QR-Code-Based Online Report Access

See **Part 3** for the full critique. Summary of the defect: "anyone scanning can view the test report online" makes a commercially sensitive trade document publicly readable, permanently, with no revocation, no anti-enumeration, and no defence against a forged QR. As written it is both a confidentiality breach (cl. 4.2) and a data-protection problem, and it will not clear a government IT security review.

---

#### Point 9 — Internal Lab Equipment Calibration Management

**RIGHT**
- Correctly identifies that equipment must be under control.
- Correctly separates it from the testing workflow as its own module.

**AMBIGUOUS / WRONG**

"Maintain internal lab equipment details as an asset system" conflates **two different registers with two different owners**:
- a **government fixed-asset register** (GFR 2017): cost, date of purchase, supplier, invoice, warranty, location, custodian, annual physical verification, condemnation and disposal by committee;
- a **metrological control register** (17025 cl. 6.4/6.5): range, resolution, calibration interval, last/next calibration, calibrating agency and its accreditation, certificate number, traceability, uncertainty from the certificate, correction factors, intermediate checks, out-of-service status.

Build both; do not pretend one is the other.

Questions:
1. List every instrument, with: make, model, serial, lab ID, range, least count, calibration interval, calibrated externally or internally, and by whom.
2. **What are the reference standards?** Standard weights, grey scales for colour change and staining, standard photographs for seriplane, standard/reference fabric, standard thermometers. These have their own recertification cycles and are a separate class.
3. **Intermediate checks** — daily balance check with a standard weight, oven temperature check, tensile tester verification. Frequency, acceptance criteria, and what happens on failure.
4. **Overdue behaviour** — hard block on use, or warn with override + reason? (Recommend hard block with a documented single-level override.)
5. **The big one: out-of-calibration impact analysis.** An instrument fails its calibration or a daily check. Which tests were performed on it since the last good check? Which jobs, which reports, which customers? The system must answer this in one click, because cl. 6.4.5 / 7.10 require you to evaluate and potentially recall those reports. This is the most valuable single feature in the entire equipment module and the draft does not mention it.
6. **Are correction factors from calibration certificates applied to results?** If yes, they are part of the calculation and must be version-controlled.
7. **Environmental monitoring devices** — thermohygrograph / data logger — are they in the same register?
8. **AMC, warranty, breakdown history, downtime, spares, service engineer visits.**
9. Are any tests **subcontracted** because equipment is unavailable? Then you need supplier control (cl. 6.6) and subcontractor identification on reports.

**MISSING**
- Calibration due alerts (e.g. 60/30/15/7 days) to a named person, plus a monthly calibration plan and a calendar view.
- Storage of the calibration certificate PDF against the equipment record.
- Equipment ↔ method mapping (which instruments are valid for which method).
- Out-of-service labelling status visible in the UI and matching a physical sticker.
- Annual physical verification run and shortage/condemnation handling.
- Equipment usage log per test (also useful for load and costing).

---

#### Point 10 — Internal Stock Maintenance for Testing

**RIGHT**
- Consumables affect results and cost; tracking them is correct.

**AMBIGUOUS**
1. **What is in scope?** Chemicals and reagents (NaOH, soap/ECE detergent, acids, solvents), certified reference materials, grey scales and standard fabrics, glassware, spares, printed forms and stationery, sample storage bags and seals, tags/labels.
2. **Lot / batch / expiry** — mandatory for chemicals and reference materials. Is expiry blocking or warning?
3. **Prepared solutions** — a lab makes up working solutions. Who prepared, when, concentration, standardisation factor, validity period, container label. This is a separate register from purchased stock and it is always missed.
4. **Consumption per test** — is issue recorded at job level (traceable) or only as bulk issue to the lab? Traceability to the job is what lets you investigate a bad result.
5. **Procurement flow** — indent → sanction → GeM/quotation → purchase order → receipt/GRN → inspection → stock entry. How much of this is in CloudZoo ERP already, and how much must be new?
6. **Registers government audit expects** — consumable stock register, dead stock register, annual physical verification certificate, stock-taking shortages. Formats?
7. **Units and conversions** (litre vs ml, kg vs g), minimum/reorder levels, FEFO issue.
8. **Chemical safety** — MSDS, storage class, waste disposal record.

**MISSING**
- Expiry and reorder alerts.
- Reference-material certificates and traceability (cl. 6.5).
- Supplier evaluation and approved-supplier list (cl. 6.6), plus goods inspection on receipt.
- Linkage of a specific reagent lot to a specific test result.
- Waste/effluent disposal record.

---

## PART 2 — Missing capabilities (prioritised)

Severity: **C** = Critical (system is not fit for purpose / will fail audit without it), **I** = Important (needed within 6–12 months, painful to retrofit), **N** = Nice-to-have.

### Tier 1 — Critical (build these or don't start)

| # | Capability | One line | Why it matters for THIS lab | Sev |
|---|---|---|---|---|
| 1 | **Test Request Form + contract review** | Capture the customer's request and record that the lab reviewed and accepted it | 17025 cl. 7.1. Also the only place declared denier, spec limits and decision rule can be captured — without them the report cannot be written | C |
| 2 | **Method master with revisions** | Versioned catalogue of every test: standard + year, parameters, replicates, formulae, rounding, equipment, TAT, accredited flag | Everything else derives from it. Reports must cite the method version as used on the test date | C |
| 3 | **Sample registration with acknowledgement** | Serially numbered receipt slip listing sample codes, tests, charges, expected date | The counter cannot function without paper; staff will bypass the system otherwise | C |
| 4 | **Sample acceptance/rejection + receipt condition** | Record packing, seal, quantity, damage, wet/stained; reject or accept-with-reservation | Silk arrives by bus and courier in Andhra summer. Wet or short samples invalidate moisture and grading work | C |
| 5 | **Structured worksheets with replicates and statistics** | Typed readings → mean, SD, CV%, max deviation, with formulae in the method master | Denier, size variation, seriplane demerits and tensile results are all replicate-based. Free text is unusable | C |
| 6 | **Derived-result / grading engine + its validation record** | Rule tables that convert parameter results into grades and computed weights | Raw silk grade and commercial net weight are computed, and money depends on them. cl. 7.11.2 requires the calculation be verified before use | C |
| 7 | **Bale/multi-item job structure (conditioning model)** | One lot → N bales, each with gross/tare/sample/dry weights → one lot-level certificate | This is a *Silk Conditioning* house. "One sample = one job" cannot express it. Get this wrong and the core business is unsupported | C |
| 8 | **Environmental condition monitoring + conditioning gate** | Record lab temperature and RH (standard atmosphere, commonly 27 ± 2 °C / 65 ± 2 % RH) and enforce specimen pre-conditioning time | Textile results are meaningless out of band; moisture regain work is entirely humidity-dependent. cl. 6.3 | C |
| 9 | **Equipment calibration control + intermediate checks** | Due dates, alerts, hard block on overdue, daily check records | cl. 6.4. First thing an assessor opens | C |
| 10 | **Out-of-calibration impact analysis** | "This instrument failed — list every job and issued report that used it since the last good check" | Enables the mandatory evaluation and recall under cl. 6.4.5 / 7.10. Manually impossible | C |
| 11 | **Immutable audit trail** | Who changed what, when, old value, new value, reason; no hard delete anywhere | cl. 7.5.2 and 7.11.3. Also your only defence in a trade dispute over a conditioning weight | C |
| 12 | **RBAC with an explicit written permission matrix** | Roles × screens × actions × data fields, signed off by the lab | Underpins the blinding requirement, approval integrity, and financial controls | C |
| 13 | **Authorised signatory control** | Only named, currently-authorised persons can sign a report, per discipline | cl. 7.8.2(o) and NABL's authorised-signatory list. Enforce, don't trust | C |
| 14 | **Conformity statement with decision rule** | Pass/fail against a stated specification, using a decision rule agreed with the customer | cl. 7.8.6. If you write "PASS" without a recorded decision rule, it's a nonconformity — and in silk trade the pass/fail *is* the deliverable | C |
| 15 | **Measurement uncertainty** | Store/report uncertainty where required, per method | cl. 7.6 and needed for any guard-banded decision rule | C |
| 16 | **17025-conforming report templates** | All mandatory elements, page x of y, unique ID on every page, standard disclaimers, NABL symbol rules | Report is the product. Template errors invalidate every report issued | C |
| 17 | **Amendment / revision control** | New report ID, reference to superseded report, reason for amendment, old version retained and marked | cl. 7.8.8. Mistakes happen; uncontrolled corrections are worse than mistakes | C |
| 18 | **Cancellation / withdrawal + recall** | Mark a report void, notify the customer, and make verification show VOID | Needed the day a report is issued against the wrong sample | C |
| 19 | **Draft vs final control** | Drafts watermarked and non-issuable; finals immutable; reprints marked and logged | Prevents an unapproved draft circulating as a certificate | C |
| 20 | **Report register + delivery/dispatch record** | Serial register of all reports plus proof of delivery (email log, download log, speed-post tracking, counter signature) | "We never got the report" and "you issued it late" are the two commonest disputes | C |
| 21 | **Sample retention, return and disposal** | Retention period per test, storage location, return to customer with signature, disposal with witness and date | Silk has real value; customers demand remnants back. cl. 7.4 | C |
| 22 | **Chain of custody / movement log** | Every custody change of a sample recorded | Sample mix-up is the highest-consequence error a lab can make | C |
| 23 | **Retest / repeat / re-examination workflow** | Distinguish repeat of the same specimen, retest on retained sample, and test of a fresh sample; link them | Happens constantly on disputed adulteration and grading results. Must be linked, not hidden | C |
| 24 | **Nonconforming work + CAPA + complaints register** | Log the problem, its significance, the correction, the root cause, the action, the verification | cl. 7.9, 7.10, 8.7. Three separate registers the lab will otherwise keep in three notebooks | C |
| 25 | **Government receipt handling** | Cash receipt series, DD/NEFT/UTR, Bharatkosh/NTRP challan number, daily collection and remittance reconciliation | This is public money. An unreconciled counter is an audit paragraph | C |
| 26 | **GST treatment (or documented exemption)** | Correct tax on testing charges, correct place of supply, compliant invoice series | Get it wrong for two years and it becomes a recovery notice | C |
| 27 | **Reagent / reference-material lot, expiry and usage** | Lot-level stock with expiry blocking and per-test consumption | Traceability of a suspect result to a suspect reagent lot | C |
| 28 | **Personnel competence and authorisation matrix** | Person × method authorisation with evidence and review dates | cl. 6.2. Also gates job assignment | C |
| 29 | **Backup, restore and disaster recovery — tested** | Automated backups, off-site copy, documented restore drill with evidence | cl. 7.11.3. A lab that loses its records loses its accreditation and its legal position | C |
| 30 | **Software validation records** | Evidence that the system and its calculations were validated before use, and re-validated after change | cl. 7.11.2. Assessors now ask for this specifically for LIMS | C |
| 31 | **TAT / due dates with a working-day calendar** | Due date computed from method TAT, holidays, and conditioning wait; clock-stop for holds | Customers pay for speed; the Incharge needs to see what's late | C |
| 32 | **Digital signature / e-sign on the report PDF** | Cryptographically signed PDF (and printed digest) | Makes the QR verification meaningful and the report forgery-resistant | C |
| 33 | **Confidentiality controls beyond blinding** | Field-level masking, role-scoped search, export controls, access logging | cl. 4.2. Competitor results leaking out of a government lab is a career-ending event | C |

### Tier 2 — Important

| # | Capability | One line | Why it matters here | Sev |
|---|---|---|---|---|
| 34 | Internal QC and control charts | Repeat a retained/control sample periodically, plot results, flag drift | cl. 7.7. Needed for accreditation and it genuinely catches drifting ovens and balances | I |
| 35 | Proficiency testing / inter-lab comparison records | Store PT rounds, z-scores, and resulting actions | cl. 7.7.2; CSTRI likely runs ILC across CSB units | I |
| 36 | Document control for SOPs and forms | Master list, issue/revision number, effective date, obsolete stamping, acknowledgement of read | cl. 8.3. Otherwise three versions of a worksheet circulate | I |
| 37 | Internal audit module | Audit plan, checklist, findings, closure | cl. 8.8 | I |
| 38 | Management review data pack | Auto-compiled KPIs: workload, TAT performance, NCs, complaints, PT results, calibration compliance, feedback | cl. 8.9. Saves the Incharge two days a year and produces better decisions | I |
| 39 | Risk and opportunity register | Identified risks to impartiality and operations, with actions | cl. 4.1, 8.5 | I |
| 40 | Rate card / quotation with effective dates | Versioned tariff per customer category, with quotations that convert into requests | Rates are revised by HQ circular; old invoices must reprint at old rates | I |
| 41 | Credit note, refund and waiver workflow | Controlled reversal with sanction reference | Rejected samples and cancelled tests are routine | I |
| 42 | Priority / urgent handling | Flag, surcharge, queue jumping, and visibility | Conditioning holds up trade payments; urgency is the norm, not the exception | I |
| 43 | Notifications (SMS / email / WhatsApp) | Templated messages at receipt, hold, report ready, dispatch — with a delivery log | Cuts the phone traffic that consumes the counter staff's day; low literacy in English argues for SMS in Telugu | I |
| 44 | Customer self-service portal | Status tracking, past reports, invoices, download log | Reduces calls; auditors and exporters love it; must be behind proper auth | I |
| 45 | Label / barcode printing | Sample tags, bale sub-sample bag labels, storage bin labels | Handwritten tags are how samples get swapped | I |
| 46 | Bulk / batch operations | Register 40 bales, assign 20 jobs, approve a batch, print 20 labels in one action | Without it, a 40-bale conditioning lot takes an hour of clicking and staff revert to paper | I |
| 47 | Subcontracted test control | Mark a test as sent out, to whom, their accreditation, and flag it on the report | Fastness or specialised tests may go to CSTRI Bangalore. cl. 6.6 + 7.8.2 | I |
| 48 | Multi-unit / multi-lab support | Unit-scoped data, unit code in numbering, cross-unit consolidated reporting for HQ | CSB has many testing houses. If this works, CSTRI will want to roll it out — retrofitting tenancy later is a rewrite | I |
| 49 | Statutory / HQ reporting | Monthly progress report, revenue statement, samples-tested-by-category, annual return | Currently hand-typed from registers; the system should emit it | I |
| 50 | Offline / poor-connectivity operation | Local entry queue, sync on reconnect, print fallback, documented manual procedure | Small-town connectivity and power. If the system stops when the link drops, the lab stops trusting it | I |
| 51 | Session, password and access policy | Password rules, lockout, session timeout, MFA for approvers and admins, no shared logins | Shared logins destroy attributability, which destroys the audit trail's value | I |
| 52 | Archival and retention schedule | Retention period per record type, legal hold, archived-but-retrievable storage | RTI requests, trade disputes, and government record retention rules | I |
| 53 | Universal search and retrieval | Find any record by job, report, invoice, sample code, customer, bale mark, date | Audit and RTI response time. Must be role-scoped so it doesn't defeat blinding | I |
| 54 | Bilingual output (Hindi/English) and Telugu customer comms | Report and key documents bilingual; SMS in Telugu | Official Languages Act obligations; local customers read Telugu | I |
| 55 | Physical file / register cross-reference | Link each job to its paper file number and shelf | Paper will coexist for years; the system must point to it | I |
| 56 | Customer feedback capture | Simple satisfaction capture feeding management review | cl. 8.9 input, and cheap goodwill | I |
| 57 | Data migration + cutover plan | Import existing customer list and open jobs; decide the go-live boundary | Half-migrated data is worse than none | I |
| 58 | Training records | Training given, competence assessed, re-assessment due | cl. 6.2; feeds the authorisation matrix | I |
| 59 | Sample photography standard | Defined shots (as-received, marks, specimen), job code in frame, hash stored with the image | Photographs are evidence in adulteration disputes | I |
| 60 | Instrument interfacing / file import | Read balance and UTM output where possible | Removes transcription error on the highest-volume readings | I |

### Tier 3 — Nice-to-have

| # | Capability | One line | Why | Sev |
|---|---|---|---|---|
| 61 | Analytics dashboards | Throughput, revenue, TAT, grade distribution, rejection rates | Management and rate-revision justification | N |
| 62 | Aggregate quality trends by region/silk type | De-identified research view for CSTRI | Genuine research value; must never expose individual clients | N |
| 63 | Mobile app / tablet worksheet | Bench-side entry | Comfort, not necessity | N |
| 64 | Cost-of-test model | Consumables + time + equipment depreciation per test | Evidence for revising the CSB tariff | N |
| 65 | e-Office / PFMS integration | Push receipts and file references | Reduces double entry, but depends on external approvals | N |
| 66 | Silk Mark / external verification API | Machine verification of authenticity reports | Only if SMOI wants it | N |
| 67 | Counter kiosk / token display | Queue management at the receipt counter | Only if walk-in volume is high | N |
| 68 | Capacity and scheduling planner | Equipment-constrained job scheduling | Useful once volume grows | N |

---

## PART 3 — Critique of the QR requirement, and three designs

### 3.1 What the requirement actually says, and why it is dangerous

> "Each generated test report should have a QR Code. Anyone scanning the QR code should be able to view the test report online."

Two separate goals are fused here, and they conflict:
- **Verification**: "is this piece of paper genuine and unaltered?" — a public, low-disclosure question.
- **Distribution**: "let me read the results" — a private, high-disclosure question.

The draft grants the second to everyone in order to achieve the first. Consequences:

1. **The report is a commercially sensitive trade document.** A raw silk grade, a size deviation, a moisture percentage that sets commercial net weight, or a fibre composition showing polyester in "pure silk" — these decide payments, contracts and reputations in the Dharmavaram and Hindupur clusters. Publishing them is a breach of the lab's confidentiality obligation (17025 cl. 4.2) and, for individual reelers, a personal-data disclosure under the DPDP Act 2023.
2. **Enumerable or guessable URLs = mass scraping.** If the URL is `/report/1042` or `/report/RSTRS-2026-0417`, a competitor writes a ten-line script and harvests every result the lab has ever issued, including yours. Even a hash of the report number is guessable if the report number format is public.
3. **Permanence.** A report published today is on the internet in 2035, indexed by search engines, cached by archives. A customer who tested one bad lot in 2026 is findable forever. No revocation was specified.
4. **No revocation or supersession.** When a report is amended or cancelled, the old QR keeps serving the old content — the lab is actively publishing a document it has withdrawn. That is worse than having no QR.
5. **Forged QR.** The obvious attack is trivial: the forger prints a *fake report* with a QR pointing at *their own* lookalike page. Every scan says "verified". A QR-based scheme where the verifier's trust anchor is the QR itself provides zero forgery protection.
6. **Report substitution.** A less obvious attack: take a genuine QR from a good report, paste it onto a doctored PDF. The scan shows the *real* report — which the verifier may not read carefully against the paper in hand.
7. **No offline verification.** A buyer in a godown with no signal, or a customs officer, cannot verify anything.
8. **Government hosting reality.** A public-facing page carrying government-issued certificates will attract requirements you have not planned for: hosting approval, a `gov.in`/`nic.in` domain or an approved cloud, a security audit by a CERT-In empanelled auditor, GIGW/accessibility conformance, and an SSL/uptime commitment. Discover this after building, and the feature ships a year late.
9. **Scan logs are themselves sensitive.** Who is checking whose report, and from where, is competitive intelligence. Log carefully and don't leak it.
10. **PII in URLs.** Any design that puts the customer name, mobile or GSTIN in the query string leaks it to referrers, proxies and logs.

### 3.2 Three design options

**Option A — Opaque high-entropy token with tiered disclosure (public verification, gated results)**

- QR encodes `https://verify.<lab-domain>/r/<token>`, where `token` is **128 bits of cryptographically secure randomness**, rendered as 22 base62 characters. Not derived from the report number. Not sequential. One token per issued version of a report.
- **Public tier (no login) shows only:** report number; date of issue; issuing lab name and address; NABL accreditation status of the tests; a generic sample description (e.g. "Raw silk — 2 samples"); the client name **masked** (e.g. "S___ L____ S____, Dharmavaram") or omitted entirely, per lab policy; **status: VALID / SUPERSEDED / CANCELLED**; the first 16 hex characters of the SHA-256 digest of the issued PDF; and, if superseded, the report number that replaces it.
- **Results tier requires one factor:** a 6-digit access code printed on the paper report, **or** an OTP to the client's registered mobile, **or** a portal login. Whoever holds the paper can read the results; the internet at large cannot.
- Controls: `noindex`/`nofollow` plus `robots.txt`; per-IP and per-token rate limiting with lockout; no directory or listing endpoint; constant-time token lookup; token never appears in a redirect or third-party call; access log (timestamp, coarse geo, no PII) visible to the client; optional client-set expiry for the public page.
- Cost: low. Fits the existing skill set. No key management.

**Option B — Cryptographically signed, offline-verifiable QR**

- QR encodes a compact signed payload (CBOR or compact JSON): lab ID, report number, issue date, job codes, a short digest of the key results, key ID, and an **Ed25519 signature**.
- A verifier (the lab's page, or a small app, or any tool with the lab's published public key) validates the signature **without network access** and displays the signed fields.
- Revocation still needs an online check, so a status endpoint is required for "has this been cancelled?".
- Pros: real forgery resistance for the signed fields; works in a godown with no signal.
- Cons: bigger QR; key generation, storage and rotation become the lab's problem; only the fields you sign are protected, so full results still need Option A or C.

**Option C — Authenticated portal only**

- QR is a deep link into the customer portal. Nothing is public. Report visible only to the logged-in client and authorised lab staff; third parties get access only via a client-generated, expiring share link.
- Pros: maximum confidentiality; simplest legal position.
- Cons: an auditor, a buyer, or a bank cannot verify a certificate handed to them — which was the entire point of point 8.

### 3.3 Recommendation

**Adopt Option A as the baseline, add the signing and digest mechanics from Option B, and provide Option C's portal for the client's own history.** Concretely:

1. **Token:** 128-bit random, base62, unique per report *version*. New version ⇒ new token; old token stays live and reports `SUPERSEDED BY <new report no.>`. Never 404 a withdrawn report — a 404 lets a forger claim "the server is down".
2. **Two tiers, hard-coded:** public = authenticity + status + minimal metadata; results = access code / OTP / login. Make the tier boundary a configuration the Unit Incharge signs off, not a developer's guess.
3. **Sign the PDF** with a Class 3 DSC (PAdES) in the name of the authorising signatory, and **print the digest** on the report face: `Document digest: 9f3a c218 74be 0d51`. A verifier can compare it to the digest shown on the verification page — that catches report substitution.
4. **Defeat the forged QR by not trusting the QR.** Print, in human-readable text next to the QR: *"Verify only at https://verify.<lab-domain> — do not rely on any other link."* Provide a **manual verification form** on that fixed domain: report number + date of issue + last four digits of the client's registered mobile. Publish a short notice on the lab/CSB site naming the one legitimate verification domain. Now the trust anchor is the published domain, not the ink on the paper.
5. **Tamper-evident verification page** design: a single large status banner (green VALID / amber SUPERSEDED / red CANCELLED); the report number and issue date in large type; the digest; "Results are not shown publicly. Enter the access code printed on the report."; the number of times this report has been verified; and an explicit statement that the page reflects the lab's live record as of the timestamp shown. No lab logo tricks that a forger can screenshot — the value is in the domain and the live status.
6. **Rate-limit and monitor.** Alert on burst scanning of many tokens from one source; that is a scraping attempt or a leaked token list.
7. **Get written IT clearance early** for domain, hosting and security audit. Treat the public page as a separate deliverable with its own go-live gate, so it cannot block the internal LIMS.
8. **Offer opt-out.** A customer with a confidentiality concern can request that the public page show status only, with no description at all.

---

## PART 4 — Critique of "the tester must not see customer details"

### 4.1 Where the instinct is right

- **Impartiality (cl. 4.1).** Knowing that the sample belongs to a large, well-connected trader creates pressure — conscious or not — to nudge a borderline grade. Removing the name removes the nudge.
- **Confidentiality (cl. 4.2).** A tester who cannot see the customer list cannot leak it. In a cluster where everyone knows everyone, "who is testing what" is itself valuable information.
- **Financial insulation.** Testers have no reason to see invoice values, payment status, GSTIN, PAN or bank details. Hide these permanently, not merely by default.

### 4.2 Where it breaks down — concretely

1. **The sample carries its own identity.** A silk bale arrives with the filature's mark, lot number, and often a printed tag. A fabric roll has a selvedge stamp or a brand label. A cone has the twister's sticker. The tester is holding the customer's name in their hand. Software blinding does not change this.
2. **The tester must know the declared values.** Size deviation is computed *against the declared nominal denier* (e.g. 20/22 D). A conformity statement needs the *declared composition* (100 % mulberry silk) and the *specification* to judge against. Blind the client, but you cannot blind the client's declarations — those are test inputs.
3. **Bale marks may need to appear on the report.** 17025 requires unambiguous identification of the item tested. The customer's own marks are often the only unambiguous identification, so they must be captured at receipt and printed — meaning they exist in the record the tester's worksheet derives from.
4. **A repeat sample must be linked.** If the same customer resubmits after a fail, someone must know it is a repeat. If the tester can see "repeat of J-1182", they can look up J-1182's result and anchor on it. If they cannot see it, the lab loses a control.
5. **The lab has three or four people.** The tester was standing at the counter when the customer walked in with the bales. They carried the sample to the oven. Claiming in the quality manual that testers "cannot view customer details" is a claim an assessor will disprove in ten minutes by asking the tester.
6. **Search is a leak channel.** If a tester can type a customer name into a global search box and get hits, the masking is cosmetic.
7. **Report generation needs the client.** Whoever generates the report sees everything. If the tester also generates reports (likely, in a small unit), blinding ends there.
8. **Complaints and phone calls.** "Sir, my sample number 417 — what is the status?" The tester answers the phone. Now they know.

### 4.3 Concrete design

**Classify every field into three tiers, in a written matrix.**

- **Tier 0 — always visible to testers:** job code, sample lab code, sample description, quantity received, condition on receipt, sample marks *as recorded* (see below), tests and parameters, method and version, declared/claimed values (denier, count, composition, claimed grade), specification limits and decision rule, priority, due date, storage location, linked-sample family token.
- **Tier 1 — masked by default, revealable with authorisation:** client name, address, contact person, mobile, email, brand, PO/letter reference, sample-submitted-by, previous reports for the same client.
- **Tier 2 — never visible to the tester role:** invoice, charges, payment status, GSTIN, PAN, bank details, any waiver or concession, customer notes of a commercial nature.

**Then implement:**

1. **Stable pseudonym, not a blank.** Show `CLIENT-4417` everywhere Tier 1 identity would appear. A pseudonym is better than a blank because testers can talk to each other ("the 4417 lot") without learning identity, and because it makes cross-job patterns visible for QC without disclosure.
2. **Declared values are first-class fields**, captured on the Test Request / receipt form, explicitly labelled "client-declared" (so the report can say the declaration was not verified by the lab). They are Tier 0.
3. **Physical masking SOP, enforced by the software's checklist.** At receipt: photograph the sample as received *with* its original marks (image stored Tier 1), transcribe the marks into a Tier 1 field, then over-label the sample with the lab's own code label so the customer's mark is covered. The receipt screen has a mandatory tick: "sample over-labelled with lab code". Where a mark cannot be covered (woven selvedge, printed bale cloth), record "identity not maskable" on the job — this is honest and it is what an assessor wants to see.
4. **Role-scoped search and export.** The tester's search index contains Tier 0 only. No global search across Tier 1. No CSV export of client fields for the tester role. Screens visible to testers are watermarked with their own user ID and timestamp to discourage photography.
5. **Break-glass reveal.** A tester can request unmasking with a reason from a fixed list (e.g. "sample marks ambiguous", "need to clarify declared denier"). The Unit Incharge approves; the reveal is time-boxed (e.g. 60 minutes), scoped to that one job, and written to the audit trail. Reveals are reviewed monthly. This converts an unenforceable rule into a measurable control.
6. **Linked samples without identity.** Give each physical lot a `sample_family_id`. A repeat carries the same family ID and shows the tester "REPEAT — related job exists" **without** the earlier result and **without** the client. For blind repeat testing (the strongest QC), assign the repeat to a *different* tester and withhold the first result from both until both worksheets are submitted.
7. **Segregation with honesty.** Configure the roles so tester ≠ approver ≠ report-issuer where headcount allows, and where it does not, let the system *record* the overlap on the job (`same person tested and approved — justification: single-analyst unit`) so the lab can defend it and monitor how often it happens.
8. **Do not over-claim in the quality manual.** Write the policy as: *"Client identity is masked by default in the testing interface; testers have no access to commercial or financial data; any unmasking is authorised and logged; residual visibility through physical sample marks is recognised and managed by over-labelling and by staff confidentiality undertakings."* That is defensible. "Testers cannot see customer details" is not.

---

## PART 5 — Top 10 project risks and mitigations

| # | Risk | Why it will bite here | Mitigation |
|---|---|---|---|
| 1 | **Wrong core data model** — "one sample = one job = one report" cannot express conditioning lots, multi-test samples, specimens and replicate readings | Discovered in month 4, after screens are built. Rework touches every table, screen and report | Before writing code, model against **three real past jobs**: (a) a 20-bale conditioning lot, (b) a full raw silk grading, (c) a multi-parameter fabric test. Adopt the hierarchy Request → Sample → Sample-Test → Specimen → Reading → Computed Result, with a lot-level certificate. Get the Scientist to sign a one-page ER diagram in plain English |
| 2 | **NABL requirements discovered late** | Audit trail, method versioning, environment capture, uncertainty and amendment control cannot be bolted on; they are schema-level | Build the compliance skeleton in Phase 1 even if the UI is thin: immutable audit trail, versioned method master, per-test equipment/environment/reagent capture, no-hard-delete policy. Read ISO/IEC 17025:2017 clauses 6.2–6.6, 7.1–7.11, 8.3–8.9 as the requirements list |
| 3 | **CloudZoo ERP boundary undefined** — its customer/invoice primitives cannot express contract review, part payment, challans, or immutable snapshots; and an ERP upgrade silently breaks the LIMS | The draft assumes the ERP "already has" invoicing. It has *generic* invoicing | Write an integration contract on day one: which entity is master for what, read vs write direction, API or DB, snapshot-on-issue into LIMS tables, versioned interfaces, no LIMS writes into ERP internals. Test against an ERP upgrade before go-live |
| 4 | **Public QR page becomes a confidentiality and security incident** | Sensitive trade results, enumerable URLs, permanent exposure, government hosting review not budgeted | Implement Part 3's Option A + signing. Gate the public page behind written CSB IT approval and a CERT-In empanelled security audit. Ship the internal LIMS first so the portal cannot block it |
| 5 | **Staff never stop using the paper registers** | Small unit, entrenched habits, counter under time pressure, and a system that doesn't print the slip they need | Design for the counter: single-screen receipt entry, bulk bale entry, one-click acknowledgement slip and labels, printable bench worksheets. Run a 4-week parallel period with a hard cut-over date, train all staff (not just the Incharge), and make the two technical assistants the UAT owners |
| 6 | **Single-champion dependency** — the Scientist-D is the only person who wants this, and central government officers get transferred | Successor inherits a system built around one person's habits and abandons it | Keep everything configuration-driven (tests, parameters, rates, templates, roles) so no code change is needed to adapt. Get CSTRI Bangalore aware early. Deliver written user documentation and a handover pack, in the lab's possession, not the developer's |
| 7 | **Money-handling audit objection** — untracked cash, unbilled tests, uncontrolled waivers, unreconciled challans | Public receipts; CAG and internal audit will sample it | Serially numbered receipts with no deletion, invoice numbers gapless and cancel-only, waiver requires higher-level approval with a reason, daily collection vs remittance reconciliation report, monthly revenue statement, and a "report released without payment" exception report |
| 8 | **Data integrity challenged in a trade dispute** — two traders litigate a conditioning weight and the lab's record is questioned | Conditioning certificates decide payments. Someone will eventually allege tampering | Immutable append-only audit trail with old/new values and reason; no hard deletes anywhere; signed report PDFs with stored hashes; restricted and logged database access; server time from a trusted source; documented change control on the software itself |
| 9 | **Connectivity and power at Dharmavaram** | Testing is physical and continues regardless; if the software stops, trust evaporates permanently after the first outage | Offline-capable worksheet and receipt entry with local queue and conflict-safe sync; printable fallback forms with a documented manual procedure and a rule for entering them later; UPS on the server/router; if hosted in the cloud, keep a read-only local cache of today's jobs |
| 10 | **Wrong calculations shipped** — grading table, size deviation, or commercial net weight computed incorrectly | Silent, systematic, and it corrupts issued certificates in bulk. This is the highest-consequence defect class in the whole system | Extract 20 historical worksheets with their manually computed results as **test vectors**; the software must reproduce every one exactly, including rounding. Keep the vectors as an automated regression suite. Record this as the cl. 7.11.2 validation evidence and re-run it after every change to a formula or method version |

*Runners-up worth tracking:* scope creep from "also do stock and assets" swallowing the core (phase it); liability exposure from pass/fail statements without a decision rule; DPDP-driven consent and retention obligations for individual reelers; and unclear ownership of the source code and data if the developer moves on (settle in writing before the first invoice).

---

## PART 6 — Ten questions to put to the lab before writing code

Ordered by how much rework the answer prevents.

1. **"Walk me through your last twenty completed jobs with the actual worksheets and the issued reports in front of us. For each: what did you call a 'sample', how many separate readings did you write down, and how many identifiers did you assign?"**
   *Prevents:* the entire data model being wrong. This one conversation determines the schema. Specifically resolve: is a bale a sample; is a 450 m skein a specimen; does one report cover many samples.

2. **"Is this lab NABL accredited today, applying, or not going for it — and which exact tests are in the scope?"**
   *Prevents:* building a system that must be rebuilt for audit, or over-building compliance the lab does not need. The answer flips roughly fifteen Tier-1 capabilities between mandatory and optional, and it decides whether the report template must carry the NABL symbol and non-accredited-test marking.

3. **"Give me the complete test catalogue: test name, standard number and year, every parameter, number of replicates, the exact formula and rounding, minimum sample quantity, turnaround, current charge, and whether it is accredited."**
   *Prevents:* the worksheet, report, pricing and TAT modules all being guesses. Include the conditioning calculation (regain, gross/tare/dry weights) and the grading table in full. This is the single most valuable document the lab can hand over.

4. **"Exactly what does CloudZoo ERP own, what can I change in it, and how do I read from and write to it?"**
   *Prevents:* an integration rewrite. Nail down: is the customer master authoritative there; can invoices be created by the LIMS; can I add fields; is there an API or only the database; who upgrades it and how often.

5. **"On money: who sets the rates and by what instrument, is GST charged on testing and at what rate, must the customer pay before testing or before report release, how does the money physically arrive (cash / DD / NEFT / Bharatkosh challan), who can waive a charge, and how is a refund sanctioned?"**
   *Prevents:* rebuilding the entire commercial module and, worse, a tax or audit problem discovered a year in.

6. **"Who is authorised to sign a test report, by name and designation? Who reviews before them? And what happens when that person is on tour for a week?"**
   *Prevents:* an approval workflow that either blocks all work during absences or is bypassed by paper signatures. Also determines whether you need DSC tokens and how many.

7. **"Is the public QR verification page approved by CSB/CSTRI IT — on whose domain, hosted where, and does it need a CERT-In empanelled security audit and GIGW compliance? And is the lab willing for results to be visible to anyone at all?"**
   *Prevents:* building a public portal that cannot be deployed, or deploying one that causes a confidentiality incident. Get the answer in writing, and phase the portal separately.

8. **"Will this run only at Dharmavaram, or is CSTRI likely to want it at other silk conditioning and testing houses?"**
   *Prevents:* a full retrofit for multi-unit data separation, unit-coded numbering, per-unit rate cards and consolidated HQ reporting. Cheap to design in now, a rewrite later.

9. **"What must happen to every sample after testing — returned to the customer, retained for how long, or destroyed? Who witnesses disposal, and what do you do with the material consumed during the test?"**
   *Prevents:* rebuilding the sample lifecycle, storage-location and custody model. Also settles the recurring customer dispute about valuable silk remnants.

10. **"What are your lab's environmental conditions and pre-conditioning practice — do you have a data logger or a manual hygrometer, does the standard atmosphere apply to every test, and how long must specimens condition before testing?"**
    *Prevents:* a workflow with no wait-state, TAT calculations that are impossible to meet, and results whose validity cannot be defended. It also decides whether environment capture is an integration or a data-entry screen.

*Eleventh, ask it anyway:* **"Which paper registers must this system replace, which must survive on paper, and what historical data has to be migrated?"** — because the answer defines the cut-over, and a half-migrated launch is worse than a late one.