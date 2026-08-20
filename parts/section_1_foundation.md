## 1. Purpose of this document

This document is the build specification for a Laboratory Information Management System (LIMS) for the Regional Silk Technological Research Station (RSTRS) / Silk Conditioning and Testing House at Dharmavaram, Andhra Pradesh, a unit of the Central Silk Technological Research Institute (CSTRI) under the Central Silk Board (CSB). "Laboratory Information Management System" means the software that records who sent a sample, what tests were asked for, what the testers measured, who checked it, what certificate was issued, and what happened to the sample afterwards. The system is a standalone application. It owns its own customer master, its own tax-invoice numbering, its own consumable stock records and its own equipment register, and it needs no other business software to run a day's work. The unit operates no external accounting system, so there is nothing for a laboratory layer to sit on top of. If one is ever adopted, the machinery for exchanging customers, invoices and stock movements with it is specified in M22 and delivered switched off. This document defines the whole application.

The document is written to be read by two different people at the same time. **The scientist and Unit Incharge** should read Sections 1 to 6 (purpose, background, goals, roles, glossary, scope) and then the specific module sections that describe his own work — sample registration, result entry, approval, certificates, and the registers and returns the unit must produce. He should treat every item marked **OPEN-Q** as a question addressed directly to him: nothing in this document invents a fact about the lab that has not been confirmed. **The implementing developer** should read every section, and should treat the numbered requirements as the work list, the tables as the data definitions, and the acceptance checks as the tests to write. Where the document says [MUST], the system is not finished without it. Where it says [SHOULD], it is needed but can follow shortly. Where it says [LATER], it is deliberately deferred to a later phase and must not consume phase-1 effort.

### What the first note got right

The original ten-point discussion note written by the scientist is the foundation of this document, and its instincts were sound. It was right that everything begins with a properly maintained customer master, and that the same customer record must feed both the invoice and the certificate — that single decision prevents a great deal of duplicate typing and mismatched names. It was right that a sample must generate its own trackable unit of work with its own unique number, so that five samples do not become one undifferentiated pile. It was right, and unusually thoughtful, to insist that the tester should not see the customer's identity — that is a genuine impartiality control that many accredited laboratories do not implement, and it is retained and strengthened here. It was right that no report may be generated until an authorised person has verified and approved the test log. It was right that each certificate should carry a QR code so that a customer, a buyer, an auditor or a bank can check the document digitally instead of telephoning the lab. And it was right to name equipment calibration and internal testing stock as modules in their own right rather than afterthoughts, because both of them decide whether a test result can be defended a year later.

This document extends that note; it does not replace it. Three things are changed rather than added, and the reasons are given plainly in the sections that follow. First, the order of the first two steps is reversed: the process starts with a **test request** that the lab reviews and accepts, and the invoice follows from it, because the charge for a silk lot cannot be known before the material is counted and inspected. Second, the word "job" is retired as the name of a record type, because in the original note it stood for four different things: they are named separately here as the **test request** (what the customer asked for), the **sample** (the physical material), the **allocation** (one test on one sample — the assignable unit of work) and the **worksheet** (one person's bench session covering many allocations). One sample commonly carries four or five different tests that different people perform on different days, so the sample cannot be the unit of work. Third, a record-keeping backbone is added underneath everything (audit trail, method versions, equipment status, environmental conditions, retention and disposal) because that backbone is what turns a workflow tool into a laboratory record that survives an audit, a dispute, or a change of staff.

---

## 2. Background and current situation

### 2.1 What the laboratory is

RSTRS Dharmavaram is a government silk and textile testing laboratory. It sits under CSTRI, Bengaluru, which in turn sits under the Central Silk Board — a statutory body established by the Central Silk Board Act, 1948, under the Ministry of Textiles, Government of India. The unit was formerly named "Silk Conditioning and Testing House (SCTH)" and both names are still in use locally. Its published address places it near the Government Cocoon Market at Regatipalli, Dharmavaram, Ananthapur District, Andhra Pradesh.

The unit does two kinds of work. The larger part is **commercial testing for outside parties**: silk reelers, twisters, weavers, traders, handloom units, co-operative societies, exporters, other government departments, and occasionally Customs. The smaller part is **internal work**: research samples from CSTRI's own divisions and from other CSB units, which are tested free of charge on an advisory basis but still need full records and a report. The unit also runs training, demonstrations, awareness programmes and field visits, and its published rate card includes non-testing charges such as machine rent per year, warping charges per warp and cocoon stifling per thousand cocoons. A system that models only tests would miss a real share of what the unit charges for and reports on.

Two facts about the workload shape the entire design and must be kept in view throughout this document.

**Fact one: the volume is high and the price per test is low.** For the financial year 2021-22, the unit's published figures were 11,294 silk and cocoon samples tested for total revenue of ₹7,56,789 — an average of roughly ₹67 per sample. Of those, approximately 11,071 (about 98 per cent) were a single test type, the "Limited test", priced at ₹50, performed in daily batches of ten to thirty lots. The remainder was a small number of full ISA gradings, twist tests, twisted-yarn denier tests and water tests. The practical consequence: a screen that takes ninety seconds per sample cannot process eleven thousand samples a year. Fast batch entry of many lots of the same test is the primary user-interface requirement, not a per-sample wizard.

**Fact two: one test result belongs to a lot, and a lot contains many physical pieces.** For raw silk the physical hierarchy runs: filament → skein (hank) → book (about 5 kg) → bale (about 60 kg) → lot (the unit of grading). One lot yields several bales, each bale several books, each book several skeins; from the skeins the lab winds bobbins; from the bobbins it reels sizing skeins and prepares inspection panels; and each of those levels produces its own readings — 6 skeins for conditioned mass, 10 bobbins for winding, 20 panels for evenness, 40 or 80 sizing skeins for size deviation. A single "the sample has a result" table cannot hold this.

### 2.2 How the work is most likely done today — assumption to be confirmed

> **This whole sub-section is an assumption.** It is reconstructed from what is publicly documented about CSB testing units and from how comparable government laboratories in India operate. It has **not** been confirmed with the Dharmavaram unit. It is written down here so that the scientist can read it and correct it in one sitting. Every sentence in it should be treated as a question, not a finding. See **OPEN-Q1** to **OPEN-Q4** below.

A customer arrives at the counter — often on foot, since the unit is beside the Government Cocoon Market — carrying skeins, cones, a bale sample or a fabric piece. A staff member writes the customer's name, the material, the number of pieces and the tests wanted into a **bound paper register**, allots the next serial number by hand, writes that number on a paper tag tied to the sample, and issues a hand-written receipt for the money taken. The sample is carried to the testing room and left on a bench or a rack.

The tester picks up the sample, performs the test, and writes the readings on a **loose worksheet or directly into the register** — for a Limited test, twenty individual skein weights, from which the average denier and the deviation are computed. Some of that arithmetic is done on a calculator and some by an existing piece of "inbuilt denier software" on a test-room PC. The Unit Incharge looks at the worksheet, agrees or disagrees, and then a report is **typed into a Word template or an Excel sheet**, with the customer's name, the sample particulars and the results copied across by hand. It is printed on the unit's letterhead, signed with a pen, stamped, and handed over or posted. A copy goes into a paper file. Separately, someone maintains **Excel sheets** for the monthly and annual return to CSTRI/CSB headquarters: number of samples by test type, revenue collected, pending work, staff strength.

Equipment calibration certificates are kept in a **physical folder**. Calibration due dates live in somebody's memory or on a wall chart. Chemicals and consumables are recorded in a **stock register**, with lot numbers and expiry dates written down if at all. The record of which balance was used for which test does not exist in writing.

### 2.3 The concrete pain this causes

Each item below is a specific, named failure mode that the software is intended to remove. They are listed in rough order of how often they bite.

| # | Pain | What it looks like in practice |
|---|---|---|
| P1 | **"Where is sample X?"** cannot be answered quickly | A customer telephones. Someone must find the register, find the entry, then physically look on the benches and racks. If the tester has taken it away, nobody knows. Minutes to hours per enquiry, several times a day. |
| P2 | **Pending workload is invisible** | Nobody can say, on any given morning, how many samples are in the building, how many tests are not yet started, how many are waiting for the Incharge's signature, and which are already late. Planning is done from memory. |
| P3 | **Reports are re-typed by hand, so they carry typing errors** | The customer's name, the declared denier, the sample marks and the results are all keyed a second time into a Word template. A transposed digit in a denier value or a wrong lot number on a certificate is a commercial document with a wrong number on it. |
| P4 | **Weight and conditioning certificates are typed by hand and the arithmetic is redone each time** | The conditioned-mass calculation is a multi-line tare build-up (shirt, wrapping papers, cotton bands, per book, per bale) followed by oven-dry mass and a fixed 11 per cent addition. Money changes hands on that final kilogram figure. Doing it on a calculator and typing it into Word is the highest-consequence manual step in the unit. |
| P5 | **No traceability at audit** | Asked "which balance produced this weight, was it in calibration that day, what was the room humidity, who checked the arithmetic" — the answer requires cross-referencing three folders, and for some of those questions there is no record at all. |
| P6 | **A register can be lost, damaged or destroyed** | One bound volume is the only copy of a year's sample intake. Water, fire, misplacement or simple wear ends the record. There is no second copy. |
| P7 | **A customer cannot check status or verify a report** | The only channel is the telephone. A buyer or a bank handed a printed certificate has no way to confirm it is genuine and current. |
| P8 | **Corrections are made by over-writing** | A value found wrong is struck out and rewritten, or a fresh page is typed. The original number and the reason for the change may or may not survive. In a dispute, that is the weakest possible position. |
| P9 | **The monthly and annual return is compiled by hand from registers into Excel** | Days of clerical work each year, with the risk that the figure sent to headquarters and the figure in the register do not agree. |
| P10 | **When equipment is found out of calibration, nobody can list the affected reports** | The record of which instrument was used for which test does not exist, so the question "which certificates issued in the last three months might be wrong?" cannot be answered at all. |
| P11 | **Retained samples and disposal are informal** | Valuable silk sits on a shelf with a paper tag. Which lot belongs to whom, how long it must be kept, whether it was returned or destroyed, and on whose authority — largely undocumented. |
| P12 | **Knowledge lives in one head** | A central-government scientist is transferable. When the person who knows the rate card, the grading tables, the return format and the local customers moves, a large part of the unit's operating knowledge moves with him. |

### 2.4 Open questions on the current situation

**OPEN-Q1:** Which paper registers exist today, exactly what columns does each have, and which of them must the software replace versus continue to exist on paper alongside it? — *Recommended default:* assume a sample-intake register, a report-issue register, a fee-receipt register, an equipment calibration folder and a consumable stock register; the software replaces the first three and mirrors the last two; nothing is switched off until the scientist confirms in writing that the printed equivalent from the software is acceptable to internal audit.

**OPEN-Q2:** What software and spreadsheets are in use today, and in particular what is the "inbuilt denier software" on the test-room PCs — can it export a file, and if so in what format? — *Recommended default:* assume it cannot export, and that the LIMS must re-implement the size and deviation statistics itself; treat any export capability as a bonus that removes typing rather than as a dependency.

**OPEN-Q3:** How many staff will use the system at once, how many computers exist in the unit, is there a local network, and what is the internet and power situation? — *Recommended default:* assume three to six concurrent users, two to four computers, a wired local network to be installed if absent, unreliable internet and frequent power interruptions; therefore assume the system must run on a single server inside the laboratory and must keep working with the internet down.

**OPEN-Q4:** What is the exact current format of the monthly and annual return sent to CSTRI/CSB headquarters? — *Recommended default:* obtain a copy of the last twelve months' returns as the very first requirement-gathering artefact; the software must produce that exact format without manual Excel work, because the return is the one report the unit is judged on, and a system that cannot produce it will be bypassed.

---

## 3. Goals, non-goals and success measures

### 3.1 Goals

Each goal is stated with a measurable criterion. The criterion is how the lab will decide, after go-live, whether the goal was met.

1. **Every sample in the building is findable and its status is known.**
   *Criterion:* any staff member, from any computer in the lab, can answer "where is sample X and what is its status" in under 10 seconds, without leaving their chair.

2. **Test results are recorded once, at the bench, and never re-typed.**
   *Criterion:* no number appears on an issued certificate that was keyed into the system more than once. The certificate is generated from the recorded readings, not transcribed from them.

3. **Batch work is fast enough for the real volume.**
   *Criterion:* a batch of 20 Limited-test lots can be registered, labelled, allocated and result-entered in less total staff time than the current paper process takes for the same 20 lots. Target: registration and labelling of 20 lots in under 15 minutes; entry of 20 readings for one lot in under 90 seconds.

4. **Every issued document is permanent, numbered without gaps, and cannot be silently altered.**
   *Criterion:* pick any issued certificate at random; the system produces the exact file that was issued, its number, its date, who approved it, and a complete list of every change ever made to the underlying data with the reason for each change.

5. **Any question an auditor or assessor asks about a single test can be answered from one screen.**
   *Criterion:* for any test, the system shows on one screen: the method and its version, the instrument used and its calibration validity on that date, the consumable lot used, the room temperature and humidity, who performed it, who checked it, who approved it, and every reading including any that were excluded and why.

6. **When an instrument or a consumable lot is found faulty, the affected work is listed automatically.**
   *Criterion:* entering an equipment failure with a "suspect from" date produces, in one click, the complete list of tests, samples and issued certificates that used that instrument in that period.

7. **The weight and conditioning certificate is computed by the system, line by line, and is auditable by the customer.**
   *Criterion:* the printed conditioned-mass certificate shows every intermediate figure (each tare component, gross, net, oven-dry, the 11 per cent addition) so a customer can check the arithmetic themselves, and the system's figure matches a hand calculation on 20 historical certificates exactly, including rounding.

8. **A customer can check status and verify a certificate without telephoning the lab.**
   *Criterion:* a customer or a third party holding a printed certificate can confirm within 30 seconds whether it is genuine, current, superseded or withdrawn, without logging in and without needing to reach the unit by phone.

9. **The tester does not see who the customer is.**
   *Criterion:* logged in as a tester, the customer's name, address, contact number and the invoice value do not appear on any screen, in any printed worksheet, on any label, or in any data the tester's browser receives. An independent check of the network response confirms the field is absent, not merely hidden.

10. **The monthly and annual return to headquarters is produced by the system, not by hand.**
    *Criterion:* the return is generated in one action in the exact format headquarters requires, and the submitted version is stored as a frozen snapshot so that a later data correction never silently changes a figure already sent.

11. **The system keeps working when the internet does not.**
    *Criterion:* with the internet connection physically disconnected, a full working day of the lab's core work — register a sample, print a label, enter results, approve, generate and print a certificate — completes normally. Only the outward-facing features (online verification page, payment reconciliation, notifications) queue and catch up later.

12. **The lab, not the developer, controls the reference data.**
    *Criterion:* the scientist can add a new test, a new method version, a new parameter, a new price, a new holiday and a new report template through data-entry screens, without the developer writing code.

13. **The system is defensible in a dispute.**
    *Criterion:* for any certificate, the system can produce the frozen document, its digital fingerprint, the identity of the approver, the full audit trail of the underlying readings, and a statement of how the document was produced — sufficient to support a certificate of authenticity if the report is ever contested.

### 3.2 Non-goals

The following are deliberately **not** part of this project. They are listed so that they cannot creep in.

| # | Not doing | Why not |
|---|---|---|
| N1 | Payroll, salary, leave, attendance, service records, pension | Handled by departmental systems. No overlap with laboratory work. |
| N2 | General financial accounting — ledgers, budgets, grants, expenditure heads, trial balance | The unit's accounts wing owns this, on whatever books it already keeps. The LIMS raises test invoices and records receipts; it does not keep the books. |
| N3 | Procurement **beyond the laboratory's own indent** — sanction, tender, GeM purchase, purchase order approval, and payment to the supplier | Existing government process, owned by the unit's accounts wing. The LIMS **does** raise and approve the laboratory's own purchase indent, with its technical acceptance criteria per line (M12-21), and prints it for that process; it then records what stock arrived and what it was used for. It goes no further down the chain. |
| N4 | Fixed-asset accounting, depreciation, condemnation committees, annual physical verification of assets | The LIMS holds the **metrological** equipment register — calibration, checks, status — and a working record of each instrument's purchase, cost and expected life, which calibration and traceability need. Fixed-asset accounting itself — capitalisation, depreciation, condemnation — belongs to the parent institute and the unit's accounts wing. Both records exist; they are not the same register. |
| N5 | Research data analysis, statistical modelling, publication figures | Scientists use their own tools. The LIMS holds records; it is not an analysis package. |
| N6 | Direct control of instruments — starting a test, setting a machine, driving a motor | Out of scope entirely and permanently. |
| N7 | Automatic reading capture from instruments in phase 1 | Deferred. Manual entry, hardened with validation and printout attachment, is the phase-1 answer. File import is a later phase. See M6. |
| N8 | Replacing the national CSB online booking portal (csbsilktesting.res.in) or its mobile app | That portal is a CSB-level system. This project treats it as one possible **inbound source** of test requests, not as something to replace. See **OPEN-Q5**. |
| N9 | Rolling out to other CSB units in phase 1 | The design must not *prevent* it (unit codes and per-unit configuration are built in), but no second unit is deployed in this phase. |
| N10 | Pushing certificates into DigiLocker | Requires CSB headquarters sponsorship and a nationwide issuer identity. Later phase. |
| N11 | Trainings, demonstrations, awareness programmes, field visits as full workflow modules | Recorded as simple counts for the headquarters return only. Full workflow deferred. |
| N12 | Non-testing chargeables (machine rent, warping, stifling, test-dyeing, training fees) as their own modules | Priced and invoiced as catalogue lines through M17. No separate workflow. |
| N13 | Multi-language user interface in phase 1 | English interface. Customer-facing documents and messages must support Telugu; the internal screens need not. See M8 and M19. |

**OPEN-Q5:** Is the intended scope (a) the internal laboratory workflow only, with the national CSB portal continuing as an outside booking channel, (b) a replacement for the portal at Dharmavaram, or (c) both, with an integration between them? — *Recommended default:* (a). Build the internal LIMS, and give every order an `order_source` field with values such as WALK_IN, POST, COURIER, CSB_PORTAL, EMAIL, INTER_UNIT, so that a portal integration can be added later without changing the data structure.

### 3.3 Success measures

Baselines marked "unknown" must be measured during the two weeks before go-live; without a baseline there is no way to demonstrate improvement.

| # | Measure | How measured | Baseline (today) | Target (6 months after go-live) |
|---|---|---|---|---|
| S1 | Time to answer "where is sample X and what is its status" | Stopwatch, 10 random samples, asked of a staff member | Unknown; estimated 2–20 minutes | Under 10 seconds, every time |
| S2 | Staff time to register and label a batch of 20 lots | Stopwatch, one real batch | Unknown | Under 15 minutes |
| S3 | Staff time to enter one lot's 20 denier readings and compute the result | Stopwatch, 10 lots | Unknown | Under 90 seconds per lot |
| S4 | Certificates issued with a typing error later requiring correction | Count of amendments whose reason code is a transcription error, per 100 certificates | Unknown; assume 2–5 per 100 | Under 0.5 per 100 |
| S5 | Time to compile the monthly headquarters return | Self-reported hours by the person who does it | Unknown; estimated 4–16 hours | Under 15 minutes |
| S6 | Proportion of tests whose record shows instrument, consumable lot, environment, performer and checker | System query | Effectively 0 per cent | 100 per cent |
| S7 | Time to list all work affected by an out-of-calibration instrument | Stopwatch on a live drill | Not achievable at all today | Under 60 seconds |
| S8 | On-time report issue against the promised date | System report; certificates issued on or before promised date ÷ certificates issued | Unknown, not currently tracked | 90 per cent or better, and tracked every month |
| S9 | First-time-right rate | Tests approved with zero send-backs ÷ tests approved | Unknown, not tracked | Tracked from month 1; improving trend, target 90 per cent |
| S10 | Certificate verifications performed by customers or third parties | Count of verification-page hits per month | Zero (no such facility) | 50 or more per month, showing the facility is actually used |
| S11 | Paper registers still being maintained in parallel | Physical count during a walk-round | All of them | Registers named in OPEN-Q1 as replaceable are no longer written in |
| S12 | Successful restore of a backup onto a clean machine | Documented drill | Unknown; likely never tested | Passed at least once before go-live, then once a quarter, each drill logged |

---

## 4. Who uses the system (roles and their day)

### 4.1 Role table

The word **role** means a named set of permissions. A person is given one or more roles. In a small unit one person will hold several roles — that is expected and permitted, but the system must **record** the overlap (for example, that the same person performed and approved a test) so the lab can justify it and monitor how often it happens.

Two things are enforced separately and must not be confused:

- **Role permission** — which screens and actions a person can reach at all.
- **Technical authorisation** — whether that specific person is authorised for that specific method and that specific activity on that specific date. A person may hold the Tester role and still be refused entry of a result for a method they are not authorised for. This is covered in module M13.

One role, several names — the synonyms used elsewhere in this document are recorded here so that no reader has to guess: the **Front Desk / Receipt Clerk** below is the **Sample Receipt Clerk** of Part B's step list; the **Store Keeper** below is the **Store Keeper / Equipment Custodian** of Part D; and the **Approving Authority** is referred to by post as the **Unit Incharge**, the officer in charge of the Dharmavaram unit. Part B §8.4 retires the older label "Lab In-Charge", because it was used for two different offices — the officer who signs reports (the Approving Authority) and the sectional supervisor (the Section Head).

| Role | What they do in the system | What they must never be able to do |
|---|---|---|
| **Front Desk / Receipt Clerk** | Create and edit walk-in customer records; record enquiries; raise a test request (TRF); record sample receipt with condition, quantity, packing state and photographs; print sample labels; print the numbered acknowledgement slip; record cash, demand draft or online payment references; issue the money receipt; answer status enquiries; record customer telephone and counter conversations against the Test Request or complaint (M19-14); record sample return or handover to the customer with the receiver's name. | Enter or change a test reading. Approve or verify a result. Sign or issue a certificate. Change a price on a rate card. Waive a charge. Delete any record. Change another user's permissions. |
| **Approving Authority (Scientist, e.g. Scientist-D; the Unit Incharge at Dharmavaram)** | Review and accept or decline a test request (the recorded capability check); accept a sample with a recorded deviation after consulting the customer; reject a sample with a coded reason; allocate and re-allocate tests; approve or send back a submitted result; authorise and sign the certificate; authorise an amendment or withdrawal of an issued certificate; authorise disposal of retained samples; authorise a break-glass override (expired calibration, expired reagent, unauthorised analyst) with a mandatory reason; unmask a customer identity for a tester on request; raise and close non-conformances; approve a waiver or concession within his delegated limit; view everything. | Alter a raw reading recorded by a tester — he may only approve it or send it back for correction. Delete any record. Edit an already-issued certificate (only amend or replace it). Sign for a test parameter he is not an authorised signatory for. Change the audit trail. |
| **Section Head (sectional supervisor)** | Review and accept, decline or send back for clarification a test request, alongside the Approving Authority (Part B §7.2 step 5); assign and re-assign each allocation to a tester who is authorised for that method and against an instrument that is within calibration validity, and set or adjust its due date (Part B §7.2 step 11); move a sample out of Accepted or Conditioning; put a sample or an allocation on hold with a coded reason and release it; retract a submitted result to the tester with a recorded reason; watch the section's queue, its overdue list and its workload. *In a small unit this is usually the same person as the Approving Authority; the roles are kept separate so the record shows in which capacity the person was acting. See OPEN-Q6.* | Enter or change a raw reading. Sign or issue a certificate unless separately authorised as a signatory. Verify or authorise a result they performed themselves without the system recording the overlap. Delete any record. Change the audit trail. |
| **Technical Manager** | Own the method master: create and version methods, record method verification and validation, activate and supersede method versions, define parameters, formulae, rounding rules, replicate counts and specification/grade tables; approve method deviations; define which instruments and consumables a method requires; second-level technical review where the lab uses two levels. *In a small unit this is usually the same person as the Approving Authority; the roles are kept separate so the record shows which capacity the person was acting in.* | Enter a test reading and then approve their own result without the system recording the overlap. Change an issued certificate. Change financial data. |
| **Quality Manager** | Own the quality registers: non-conformances, corrective and preventive actions, customer complaints, internal audits, management review inputs, risk register, quality control plans and control charts, proficiency-testing and inter-laboratory comparison records; run the document control register for standard operating procedures and forms; review the audit trail and the override log; review the customer-unmasking log; own the personnel competence and authorisation matrix records. | Approve a technical result or sign a certificate (unless separately authorised as a signatory). Close a complaint about work they themselves performed — the system must block this. Alter a reading or an issued certificate. |
| **Tester / Analyst** | See only their own allocated work queue; open a test by scanning the sample label; record sub-sample preparation and conditioning; enter raw readings; attach the instrument printout or a photograph; select the instrument and consumable lot actually used; record room temperature and humidity where the method requires it; add remarks and defect narratives; submit the result for verification; request unmasking of the customer identity with a reason. | See the customer name, address, contact details, GSTIN or the invoice value. See the price of the test. Approve or verify any result, including their own. Edit a reading after submitting it (they must ask for it to be sent back). Enter a result against an instrument that is out of calibration or a consumable lot that has expired, unless the Approving Authority records an override. Export customer data. |
| **Verifier (technical checker)** | Pick up a submitted result and check the readings, the arithmetic, the instrument and reagent status, the environmental conditions and the plausibility of the result (Part B §7.2 step 16); record the outcome as **Verified** or **Sent back with a coded reason and an explanation**; sign the verification record electronically. *Wherever staffing allows this is somebody other than the tester who did the work.* | Change a reading or a computed result — the only two permitted actions are verify and send back. Authorise or sign the report: verification and authorisation are separate acts (WF-11, M7-01). Verify their own work unless the overlap is permitted and recorded by the exception route in OPEN-Q7. Delete any record. |
| **Report Writer** | Compile the draft report from the verified allocations of a sample, choose the report type and template, check the printed particulars against the sample record, and pass the draft to the Approving Authority for authorisation (Part B §7.2 step 17); move a sample out of Testing Complete. All printed values are frozen into the draft at this point. *In a small unit this is usually the Approving Authority or the Front Desk clerk; see OPEN-Q6.* | Change a reading, a computed result or a grade. Authorise, sign or issue the report. Allot the report number — it is allotted on authorisation (Part B §7.2 step 18). Compile a report from an allocation that is not Verified. Delete any record. |
| **Store Keeper** | Receive consumables and reference materials; record lot number, quantity, expiry, storage conditions and the certificate of analysis; move a lot from quarantine to approved; record issue of a lot; record stock on hand and physical verification; manage retention storage locations; record sample movement into and out of the retention store; record disposal after the Approving Authority authorises it; record return of samples to customers. | Approve a lot for use without the defined acceptance record. Authorise disposal on their own. Enter or approve a test result. See customer identity beyond what is needed for a physical handover (name of the person collecting, which is recorded at handover). |
| **Accounts / Cashier** | Raise and issue invoices, bills of supply, receipt vouchers, credit and debit notes and refund vouchers; record receipts by cash, demand draft, cheque, NEFT/RTGS, challan, online gateway or bank collection; reconcile bank statement lines against receipts; maintain the customer running account; place work on payment hold with the reason recorded, and release it; produce the daily collection and remittance reconciliation, the receivables ageing and the revenue statements. | Change a test result, a grade or a certificate. Approve or issue a certificate. Suppress a technical release decision — a payment hold must be an explicit, logged, separate state, never a silent block on the science. Delete an issued invoice (only cancel it, before it is reported in a tax return). |
| **System Administrator** | Create and deactivate user accounts; assign roles; configure numbering series, working calendar, notification templates, report templates, tax configuration and system settings; run and verify backups and restore drills; maintain the system incident log; apply software updates under change control. | Enter, change or approve a test result. Sign a certificate. Change or delete any row in the audit trail or the state-transition log. View masked customer identity data unless separately granted the customer-identity permission. Grant themselves an approval or signatory authorisation. |
| **Customer (external, self-service)** | Log in with their own account; see the status of their own samples and test requests; download their own issued certificates and invoices; see the history of their own past reports; generate a time-limited share link so a buyer or bank can verify a specific certificate; raise and track a complaint or grievance; update their own contact details; give or withdraw consent for notifications. | See any other customer's data. See internal remarks, non-conformance records, the tester's identity, or the raw audit trail. Change any test data. See a draft or unapproved result. |
| **Public Verifier (anonymous, no login)** | Scan the QR code on a printed certificate, or type a certificate number into the published verification page, and see: whether the document is genuine, its number and date, the issuing laboratory, a short sample description, the certificate's live status (valid, superseded, withdrawn) and a document fingerprint they can check against their own copy. Optionally, if the lab enables it, the headline result. | See the customer's full name, address, contact number or GSTIN. See the detailed measured values. Enumerate or browse other certificates. See any internal record. Retrieve anything by guessing a serial number without the signed code or an additional check. |
| **Auditor (read-only — escorted access, no separate login in phase 1)** | Read everything, including the full audit trail, state-transition history, override log, unmasking log, all registers, all frozen certificate files, calibration and competence records, and the quality registers; export any register to a readable file. Used by internal audit, NABL assessors, CAG audit and RTI response. *Phase 1 builds no separate Auditor login. The need is served under escort, on a staff member's session, by the M20-37 audit-trail extract, the M21-13 printable permission matrix and the NFR-120 application-independent export, against a recorded confidentiality undertaking (M21-81). See OPEN-Q8.* | Change, add or delete anything at all. |
| **CSB HQ / CSTRI (consolidated view — no HQ login in phase 1)** | See consolidated, unit-level statistics: samples received and tested by material and test type, revenue by head, pending workload, turnaround performance, equipment status, staff strength, training counts — that is, everything the monthly and annual return contains, plus the ability to see the submitted return snapshots. *Phase 1 builds no HQ login. Headquarters receives the monthly return (M20-38), the annual return (M20-42) and the stored submitted-return snapshots (M20-40) as transmitted files; see non-goal N9 and OPEN-Q-T28.* | See individual customers' identities or their individual results, unless the customer has been informed in advance that such data may be used, per the confidentiality rules in M21. Change any unit-level record. Approve or sign anything on the unit's behalf. |

**OPEN-Q6:** Which named people at the unit hold which roles today, and specifically who other than the Unit Incharge may approve a result or sign a certificate? For each such person, which test disciplines are they authorised for? And is each of the Section Head, Verifier, Report Writer and Technical Manager roles above a separate post held by a separate person, or are they all held by the Unit Incharge himself — that is, is this one office or several? — *Recommended default:* configure the Unit Incharge as the only signatory at go-live, with one named alternate for periods of tour or leave, and add others only against a written competence record. Obtain the unit's declared-signatory list if the lab holds accreditation. Assume the Unit Incharge also holds the Section Head, Technical Manager and Report Writer roles, and that the Verifier is a different person wherever staffing allows (Part B §7.2 step 16); where staffing does not allow it, the overlap is permitted and recorded by the route in OPEN-Q7 rather than hidden. The roles stay separate rows in §4.1 even when one person holds them all, because the record must show in which capacity the person acted.

**OPEN-Q7:** Where the same person must both perform and approve a test (very likely in a three-person unit), does the lab want the system to (a) block it, (b) permit it and record the overlap on the allocation, or (c) permit it only with a second person's countersignature? — *Recommended default:* (a), with a recorded, dated exception — not (b). The system enforces segregation by default: performer ≠ checker, checker ≠ authoriser, and at minimum performer ≠ authoriser (M13-10, WF-12, WF-76, M7-04). Work is never blocked outright, but the permission is always someone's named, dated decision rather than a silent allowance — by the Approving Authority's justified per-action override (M13-10), by single-analyst mode configured per section (WF-12), or by the Unit Incharge's small-laboratory exception for a named method and a stated period (M7-05). Every occurrence is recorded on the allocation and on the report (M5-12) and counted in the monthly override and exception report (M20-35), so the lab can still state honestly how often it happens and why. See also OPEN-Q-B2 in Part B, which asks the same staffing question for the tester-and-verifier pair; verification and authorisation are separate acts (WF-11, M7-01).

**OPEN-Q8:** Does any assessor or auditor require a login of their own, rather than escorted read-only access on a staff member's session — and if so, does internal audit, a NABL assessor or CAG audit ask for the read-only property to be enforced below the application rather than in the interface? — *Recommended default:* no separate Auditor or CSB HQ login in phase 1. Serve an assessor under escort with the M20-37 audit-trail extract, the M21-13 printable permission matrix and the NFR-120 export, and serve headquarters with the transmitted returns and snapshots. If an assessor or auditor asks in writing for their own login, add it as a named, time-boxed, read-and-print-only role in a later phase, together with the confidentiality undertaking; do not promise an enforcement level below the application until the lab has asked for it.

### 4.2 A day in the life

**Front Desk / Receipt Clerk.** The morning is busy because the cocoon market is busy. A reeler arrives with five bundles of skeins and wants Limited tests. The clerk finds the reeler in the customer list by mobile number — no re-typing a name that is already there in three spellings — confirms the declared denier as 20/22, and raises one test request for five samples. She scans nothing yet; the samples do not officially exist until they are checked in. She counts the pieces, notes that one bundle's packing is torn and photographs it on the tablet, and marks that sample as accepted with a recorded deviation after the Approving Authority nods. She presses one button and five labels print, each with the sample number, material, piece count, due date, test short-codes and a QR code — and, deliberately, no customer name. She ties the labels on, prints the numbered acknowledgement slip listing the five sample numbers, the tests, the expected date and the charge, takes ₹250 in cash, issues the money receipt from the system, and puts the samples in the intake tray. When the same reeler telephones at four o'clock, she types the sample number, sees "in test, allocated to Tester 2, due tomorrow 11:00", and says so — in about eight seconds.

**Tester / Analyst.** He logs in and his queue shows fourteen tests allocated to him, sorted by due time, each identified by a sample number and a description — Raw silk, 5 skeins, 20/22 D declared — and nothing about who sent it. He scans the label of the first lot; the correct result-entry sheet opens directly, already showing the method and version, the twenty reading slots the method requires, and the balance he is expected to use. The system will not let him proceed with the balance he first selects, because its calibration expired on the fourteenth; he picks the other balance, and a note appears on the record that the first was unavailable. He weighs, and types twenty values; the average denier, the deviation and the coefficient of variation appear as he goes, and one reading that is far outside the plausible range is highlighted in amber for him to re-check rather than silently accepted. He photographs the printout from the denier PC and attaches it. He types a remark about two breaks and their cause, because the method requires break causes to be reported. He submits. The row leaves his queue and appears on the verifier's, and then on the Approving Authority's. He no longer has the ability to change the numbers, which is the point.

**Approving Authority (the Scientist, as Unit Incharge).** He opens the system at nine and the first screen tells him what he actually needs: eleven samples in the building, twenty-six tests not yet started, nine results waiting for his approval, two tests already overdue, one balance due for calibration in six days, and one consumable lot expiring this month. He accepts three new test requests, each of which records that he confirmed the lab has the method, an authorised person and a calibrated instrument for every test asked for. He works through the approval queue: seven he approves, and for one he presses "send back", picks the reason "calculation to be re-checked" from the list, and types a line of explanation — the tester will see it, the original submitted values are kept, and the send-back is counted against the first-time-right measure rather than quietly forgotten. He then generates and signs eight certificates in one batch; each is frozen as a file with a fingerprint, given its number and its QR code, and the sample moves to the retention shelf with a retention date. At noon a trader disputes a conditioned-mass figure from three weeks ago; he opens that certificate, sees every tare component, both moisture sets, the oven-dry mass and the 11 per cent addition line by line, together with which balance and which oven were used and who checked the arithmetic, and settles the argument in four minutes with the screen turned towards the trader. At the end of the month he presses one button and the return to headquarters is produced in the format headquarters wants, and a frozen copy of exactly what was sent is kept.

---

## 5. Glossary

Every term used anywhere in this document is defined here in one plain sentence. Where a Hindi or common-usage word genuinely helps, it is given in brackets. Terms are in alphabetical order.

| Term | Plain-English meaning |
|---|---|
| **Accredited scope** | The specific list of products, parameters and methods that an accreditation body has formally recognised a laboratory as competent to perform. |
| **Advisory basis (testing)** | Testing done free of charge, typically for the institute's own research samples or other CSB units, which still requires a full record and report but raises no invoice. |
| **Aliquot** | A measured portion taken out of a sample for testing; in this document the term **sub-sample** is preferred. |
| **Allocation** | One test on one sample: the assignable unit of work, which can be given to a named person, tracked, timed and priced. Five samples with four tests each make twenty allocations. Held in `txn_sample_test`, labelled *Allocation* on screen. This is the settled word for this thing — see the settled-vocabulary table in Part B §8.3. |
| **Amendment (of a report)** | A separate, newly numbered document that corrects or adds to an already-issued certificate and refers back to it; the original is never edited. |
| **API (Application Programming Interface)** | A defined way for one piece of software to ask another piece of software for data or to do something, without a human in between. |
| **Approving Authority** | The role that authorises and signs an issued report and takes the decisions reserved to the officer in charge; at Dharmavaram it is held by the Unit Incharge (see §4.1). The same person, viewed as formally recognised competent to sign for named parameters, is the **authorised signatory** — see that entry. Do not call this role the "Lab In-Charge", which Part B §8.4 retires. |
| **ARM (Automatic Reeling Machine)** | A machine that reels raw silk automatically; silk produced on it is priced differently from other silk on the CSTRI rate card. |
| **Audit trail** | A permanent, unchangeable list of every change made to a record, showing what was changed, the old value, the new value, who changed it, when, and why. |
| **Authorisation** | Signing and issuing the report. A different act from **verification** (checking the numbers), done by a different person wherever staffing allows. Neither act is called "approval" on its own. |
| **Authorised signatory** | A named person formally recognised as competent to review, authorise and sign test reports for specified parameters. |
| **Bale** | A large compressed package of raw silk, commonly about 60 kg, made up of twenty-two to thirty books. |
| **Bill of supply** | The tax document issued instead of a tax invoice when the supply is exempt from tax or the supplier is not charging tax. |
| **Blinding** | Deliberately hiding the customer's identity from the person performing the test, so that knowing whose sample it is cannot influence the result. |
| **Bobbin** | A small spool onto which silk thread is wound during the winding test; the bobbins produced then feed several downstream tests. |
| **Boil-off (degumming loss)** | The percentage of a silk sample's weight that is lost when the natural gum (sericin) is boiled off. |
| **Book** | A compressed package of raw silk weighing about 5 kg, containing a set number of skeins; several books make a bale. |
| **Break-glass override** | A deliberately awkward, role-restricted action that lets an authorised person bypass a safety block (such as expired calibration), which always demands a written reason and automatically raises a non-conformance record. |
| **Cancelled** | A state of a *number* in a gap-free numbering series whose document was never issued (WF-100, WF-102, M8-62). It is never a report lifecycle status and never appears on the public verification page, because only issued report versions receive a verification token (M9-09). |
| **CAPA (Corrective and Preventive Action)** | The recorded process of finding why something went wrong, fixing it, stopping it recurring, and checking that the fix worked. |
| **Certificate of Analysis (COA)** | The supplier's document stating what a chemical or reference material actually contains and to what accuracy. |
| **Chain of custody** | The unbroken written record of everybody who had physical possession of a sample, and when it moved from one place or person to another. |
| **Challan** | The document evidencing that money has been credited into a government account through a bank (*chalān*). |
| **Chop** | A field on the raw-silk grading certificate; understood locally to be the producer's or filature's trade mark stamped on books and bales. |
| **Cleanness** | A raw-silk quality measure, expressed as a percentage, based on counting defects such as slugs and gouts on inspection panels and subtracting penalty points. |
| **Cohesion** | A raw-silk test measuring how many strokes of friction the thread withstands before its filaments open out; reported as a whole number of strokes. |
| **Conditioned mass (conditioned weight, correct invoice mass)** | The trade weight of raw silk, calculated as its oven-dry weight plus exactly 11 per cent of that oven-dry weight. |
| **Conditioning (commercial)** | The service of determining the conditioned mass of raw silk so that buyer and seller can settle on a neutral weight. |
| **Conditioning (pre-conditioning a specimen)** | Leaving a specimen in a controlled temperature and humidity for a set period before a physical test, so the result does not depend on the day's weather. **A different thing from commercial conditioning, despite the shared word.** |
| **Consumable lot** | One specific batch of a chemical, reagent or reference material, with its own batch number, expiry date and certificate; the unit at which such stock must be controlled. |
| **Contract review** | The ISO/IEC 17025 clause 7.1 name for what this document calls the **Request Review** — see that entry. |
| **CV% (Coefficient of Variation)** | A measure of how spread out a set of readings is, expressed as a percentage of their average. |
| **Decision rule** | The agreed rule for turning a measured value into a pass or fail statement, including how the measurement's own uncertainty is treated. |
| **Denier** | The traditional unit of thickness for silk thread: the weight in grams of 9,000 metres of the thread. |
| **Denier range / nomenclature** | The way the trade quotes silk thickness as a band rather than a single number, such as 18/20, 20/22 or 22/24. |
| **Deviation (from a method)** | A documented, justified, authorised and customer-accepted departure from the written test procedure. |
| **DPDP Act 2023 (Digital Personal Data Protection Act)** | The Indian law governing how organisations may collect, use, keep and delete personal data. |
| **DSC (Digital Signature Certificate)** | A cryptographic credential issued by a licensed Indian Certifying Authority, held on a hardware token, used to sign documents with legal effect. |
| **Dupion silk** | Silk reeled from double cocoons, producing an irregular yarn, graded under its own Indian Standard. |
| **Elongation** | How much a thread stretches, as a percentage, before it breaks. |
| **Enquiry** | A customer's question about what a test costs or whether the lab can do it, before any commitment is made. |
| **eSign** | An Aadhaar-based electronic signature service that lets an individual sign a document online without holding any hardware. |
| **Evenness** | A raw-silk quality measure based on counting variation stripes on wound inspection panels compared against official standard photographs. |
| **External accounting system** | Any accounting or Enterprise Resource Planning (ERP) software outside this one that could hold customer records, invoices, stock or asset values. The unit operates none, so the LIMS holds that data itself; M22 specifies a generic interface to such a system and it is delivered switched off, in case the unit or CSB adopts one later. |
| **Financial year (FY)** | In India, 1 April to 31 March; written in this document as 2026-27. |
| **First-time-right** | The proportion of tests that are approved without ever being sent back to the tester for correction. |
| **Frozen document** | The exact file that was issued to the customer, stored byte for byte with a fingerprint, so that a later change to a template can never alter what an auditor sees. |
| **GAR 6 / GAR 7** | Standard government forms: GAR 6 is the receipt given to the payer; GAR 7 is the challan evidencing credit into the government account. |
| **GIGW (Guidelines for Indian Government Websites and Apps)** | The Government of India's rules for quality, accessibility, security and lifecycle management of government websites. |
| **Grade (raw silk)** | A single letter classification of overall raw-silk quality, such as 4A, 3A, 2A, A, B, C, D or E, calculated from twelve measured characteristics. |
| **Grading certificate** | The quality document that states a raw-silk lot's grade, distinct from the weight certificate. |
| **GST (Goods and Services Tax)** | India's indirect tax on the supply of goods and services; charged on the laboratory's testing fees on top of the approved rate. |
| **GSTIN** | The fifteen-character Goods and Services Tax Identification Number of a registered business. |
| **Hank** | Another word for a skein — a coil of silk thread removed from the reel as an open band. |
| **HSN / SAC code** | The official classification codes used on tax invoices: HSN for goods, SAC for services. |
| **Intermediate check** | A quick routine check between full calibrations — such as weighing a standard weight on a balance daily — to confirm an instrument is still behaving. |
| **ISA (International Silk Association)** | The body whose raw-silk testing and grading rules are used as an alternative to the Indian Standard, at a different price. |
| **ISO/IEC 17025** | The international standard that sets out what a testing laboratory must do to be considered competent; the 2017 edition is current. |
| **Job** | Never used as the **name of a record type**, because in the original note it meant four different things. Say **Test Request**, **Sample**, **Allocation** or **Worksheet** — whichever is actually meant (Part B §8.4). The word still appears in this document's explanatory prose, where it is being discussed rather than used, and the unrelated computing sense (a scheduled job, the `sys_outbound_job` queue) is unaffected. A screen may print `Allocation No.` with the subtitle `(Job No.)` for one release, as an aid to breaking the habit. |
| **Kilcha** | The local term for the small test skein made on the wrap reel, and the manual slight-twist step that produces it. |
| **Limited test** | The unit's high-volume in-house composite test — winding, wrap-reeling of sizing skeins, kilcha making, and denier with deviation — accounting for about 98 per cent of Dharmavaram's samples. |
| **LIMS (Laboratory Information Management System)** | Software that records samples, tests, results, approvals, certificates and the surrounding laboratory records. |
| **Lot** | The unit of raw-silk grading; under the current amended Indian Standard, two to four cartons of 30 kg each, or one to two bales of 60 kg each. |
| **Mark (of the lot)** | The identifying mark the producer or sender has put on the silk, recorded by the lab and often printed on the certificate. |
| **Master data** | Reference information that is set up once and used repeatedly — customers, tests, methods, parameters, units, prices, holidays — as opposed to day-to-day transactions. |
| **Measurement uncertainty** | The honest statement of how much a measured value could reasonably differ from the true value. |
| **Method** | The documented procedure for performing a test, identified by its standard number and edition, such as IS 15090 (Part 5):2002. |
| **Moisture regain** | Moisture expressed as a percentage of the dry weight; for silk the official trade figure is 11 per cent. |
| **MRM (Multi-end Reeling Machine)** | A reeling machine type; silk provenance (ARM, MRM, charkha, cottage basin) affects both the test recipe and the price. |
| **NABL (National Accreditation Board for Testing and Calibration Laboratories)** | The Indian body that accredits laboratories against ISO/IEC 17025. |
| **NCR (Non-Conformance Report)** | The record raised when any part of the laboratory's work fails to meet its own procedures or the customer's agreed requirements. |
| **Neatness** | A raw-silk quality measure of small imperfections such as nibs and loops, scored against a fixed set of official standard photographs. |
| **Non-accredited parameter** | A test parameter that is outside the laboratory's accredited scope, which must be reported separately and must not carry the accreditation symbol. |
| **Order** | See **Test Request (TRF)**. The word *order* survives in database names such as `txn_order`, in field names such as `order_source`, and in the phrase *order type*; the record itself is called a Test Request on screen and on paper. |
| **Parameter (characteristic)** | One individual thing that is measured within a test, such as average denier, size deviation, tenacity or elongation. |
| **Partition** | Another word for sub-sample; a physical piece taken from the submitted sample for one particular test. |
| **PT (Proficiency Testing)** | A scheme in which many laboratories test the same material and their results are compared, to check each lab's performance. |
| **Quotation** | The laboratory's priced written offer to a customer, with a validity date, which may be accepted and converted into a Test Request. |
| **Rate card** | The dated, approved schedule of testing charges, with the approving authority's reference; historical invoices must reprint at the rate in force on their date. |
| **Reading** | One raw measured value as observed and entered by the tester, held permanently in `txn_observation` and never overwritten. The computed reportable value is the **result**, not a reading. |
| **Reference material** | A material with an established, certified property value, used to check that a method or instrument is performing correctly. |
| **Replicate** | One of several repeated readings of the same thing, taken so that an average and a spread can be calculated. |
| **Request Line** | One requested test at one price for a stated number of samples, as it appears on a Test Request; held in `txn_order_line`. Not called an order line, a job line or simply a test. |
| **Request Review** | The recorded check, before work starts, that the laboratory has the method, the equipment, a competent person and the capacity to do everything the customer has asked for, and that the customer's requirements are clear. Its outcome is Accept, Decline with a reason, or Clarify (Part B §7.2 step 5). ISO/IEC 17025 calls this the contract review. |
| **Retention (of a sample)** | Keeping the tested material for a defined period after the report, in a known location, in case a retest is needed. |
| **Role** | A named set of permissions granted to a user, deciding which screens and actions they can reach. |
| **Sample** | The physical material the customer submitted, registered as one identified item in the laboratory. |
| **SAC code** | The service classification code printed on a GST tax invoice; technical testing and analysis services fall under 9983 group codes. |
| **Sender** | The person or firm who physically brought or sent the consignment, recorded separately from the **customer** who owns the result and is billed — so that a broker's or a carrier's name never lands on the certificate. |
| **Seriplane** | The inspection board on which silk is wound into panels for visual comparison against standard photographs, used for evenness, cleanness and neatness. |
| **Serigraph** | The instrument used to measure the breaking strength and stretch of a silk skein, giving tenacity and elongation. |
| **Shirt** | The outer wrapping cloth of a silk bale, counted as one line in the tare build-up of a conditioning certificate. |
| **Size (of silk)** | The thickness of the thread, expressed in tex or in denier; also called count. |
| **Size deviation** | A measure of how much the individual sizing skeins vary in thickness around their average; a major grading characteristic. |
| **Sizing skein** | A short measured length of silk (commonly 450 m or 112.5 m) reeled and weighed individually to determine size and its variation. |
| **Skein** | A coil of silk thread removed from the reeling machine as an open band, laced with cotton, typically about 70 g. |
| **Specification Set** | A named set of limits and grade bands that a result is judged against, such as a grade table from an Indian Standard; held as master data with its own version, not typed onto each report. |
| **Standard atmosphere (for testing textiles)** | The controlled room condition required for textile testing; in India commonly 27 ± 2 °C and 65 ± 2 per cent relative humidity. |
| **State machine** | The complete written list of the states a thing can be in, and exactly which state changes are permitted, by whom, and under what conditions. |
| **Sub-sample** | A physical piece taken from the submitted sample for one particular test, with its own identifier linked to the parent. Also written as **aliquot** or **partition**, and called a specimen informally in speech. A piece of material is never called a "sub-unit" (M3-03) — see the next entry. |
| **Sub-unit** | Organisational sense only: a branch establishment of CSTRI, or another CSB unit, which is one of the customer categories in `mst_customer_category` and whose in-house research samples are tested on an advisory basis. Never used for physical material; the physical piece is a **sub-sample** (M3-03). |
| **Superseded** | Marked as replaced by a newer version, while remaining permanently retrievable and clearly labelled as no longer current. |
| **TAT (Turnaround Time)** | The time promised and the time actually taken from acceptance of a sample to issue of the report, counted in working hours. |
| **Tare** | The weight of all the packing material, calculated line by line and subtracted from the gross weight to give the net weight. |
| **Tatkal** | The express service under the CSTRI rate card: same-day testing at double charge, maximum five samples, booked before 11:00, only for tests completable within six hours (*tatkāl* — immediate). |
| **Tenacity** | The breaking strength of a thread expressed relative to its thickness, such as grams per denier. |
| **Test Request (TRF)** | The reviewed and accepted request from a customer, captured on a Test Request Form, that authorises the laboratory to start work and creates the charge; held in `txn_order`. Not called a job, a booking or an order form. |
| **Tex** | The metric unit of thread thickness: the weight in grams of 1,000 metres; the Indian Standard prefers tex while the trade speaks denier. |
| **Twist (TPM, turns per metre)** | The number of turns inserted into a yarn per metre, together with its direction, S or Z. |
| **ULR (Unique Laboratory Report number)** | An additional report number in a nationally prescribed format, required by NABL on reports issued within an accredited scope, alongside the laboratory's own report number. |
| **Verification (of a result)** | An independent check of a submitted result by a competent person other than the one who performed the test, before the report is authorised. |
| **Verification (of a method)** | Recorded evidence that the laboratory can correctly perform a standard method before it starts using it on customers' work. |
| **Weight certificate** | The document stating a lot's conditioned mass, used for commercial settlement; a different document from the grading certificate. |
| **Winding breaks** | The number of times the thread breaks while being wound onto bobbins under fixed conditions, with the cause of each break recorded. |
| **Withdrawn** | An issued report taken out of force entirely, without a replacement document (M8-59); it remains permanently retrievable and is shown as withdrawn on the public verification page. |
| **Worksheet** | A run sheet grouping many tests together for one person's session at the bench, including any quality-control positions. |
| **Zari** | Metallic thread used in weaving, tested for gold and silver content by a chemical method or by an instrument at multiple points. |

---

## 6. Scope: what we are building, in one page

### 6.1 In scope — the twenty-two modules detailed in this document

| Module | Name | In one line |
|---|---|---|
| **M1** | Master Data | Customers, sample types, tests, methods, parameters, units, specification and grade tables, rate cards, numbering series, calendars, locations. |
| **M2** | Enquiry and Quotation | Recording a customer's question and issuing a priced, dated offer that can become a test request. |
| **M3** | Test Request and Sample Registration | The accepted request, the recorded capability check, sample check-in with condition and photographs, labels and the numbered acknowledgement slip. |
| **M4** | Sample Handling and Chain of Custody | Acceptance or rejection, sub-samples, every physical movement, retention, return and authorised disposal. |
| **M5** | Work Allocation | Creating one assignable test per sample per test, allocating it to an authorised person and a calibrated instrument, and tracking due dates. |
| **M6** | Result Entry | Structured worksheets, raw readings, automatic statistics and grades, instrument and consumable capture, photographs and remarks. |
| **M7** | Verification and Approval | Independent checking, send-back with a coded reason, one or two levels of review, and authorisation with an electronic signature. |
| **M8** | Report and Certificate Generation | Templated documents with every mandatory element, numbering, freezing, amendment, withdrawal, reprint control and dispatch record. |
| **M9** | Public QR Verification | The QR code on the certificate and the public page that confirms a document is genuine, current, superseded or withdrawn. |
| **M10** | Weight / Conditioning Certificate | The conditioned-mass calculation, line by line, from tare build-up through oven-dry mass to the 11 per cent addition. |
| **M11** | Equipment and Calibration | The instrument register, calibration and intermediate checks, out-of-service blocking, and listing all work affected when an instrument fails. |
| **M12** | Consumables and Reagent Stock | Lot-level control of chemicals and reference materials, expiry blocking, and which lot was used on which test. |
| **M13** | Personnel Competency | Who is authorised for which method and which activity, from which date to which date, on what evidence. |
| **M14** | Method and Document Control | Versioned methods with verification and validation records, controlled standard operating procedures and forms. |
| **M15** | Quality Assurance | Quality-control samples and control charts, proficiency testing, non-conformances, corrective actions and customer complaints. |
| **M16** | Environment Monitoring | Recording room temperature and humidity, and enforcing the pre-conditioning wait a method requires. |
| **M17** | Billing, Payments and Government Receipts | Rate-card pricing, tax documents, cash, demand draft, challan and online receipts, reconciliation and refunds. |
| **M18** | Customer Portal | Customers checking their own status, downloading their own certificates, and sharing a verification link. |
| **M19** | Notifications | Alerts and messages for staff and customers, with a delivery log. |
| **M20** | Reports, Registers and Dashboards | The statutory registers, the monthly and annual return to headquarters, management dashboards and full data export. |
| **M21** | Administration, Security and Audit | Users and roles, the audit trail, customer-identity masking, backups, retention policy and the system incident log. |
| **M22** | Interface to an External Accounting System | Dormant: if the unit ever adopts such a system, which side owns which data, how the two exchange it, and the rule that each field has exactly one system of record. Specified now, delivered switched off. |

### 6.2 Out of scope for phase 1

- **Automatic capture of readings from instruments.** Manual entry with strong validation and an attached instrument printout is the phase-1 answer. File import from a watched folder and serial capture from balances are later phases.
- **Two-way integration with the national CSB online testing portal.** Test requests arriving from it are recorded with a source flag; no live interface is built.
- **A live interface to an external accounting system.** The LIMS owns its customers, its tax invoices and its stock outright. M22 specifies the interface generically and it is delivered switched off, because there is no such system here to connect to.
- **DigiLocker issuance of certificates.** Requires CSB headquarters sponsorship. The design keeps a stable document identifier and a machine-readable copy of each report so that it becomes configuration work later.
- **Deployment at other CSB units.** Unit codes and per-unit configuration are built in so it is possible, but only Dharmavaram goes live.
- **Multi-language user interface.** English internal screens. Telugu is required for customer-facing documents and messages only.
- **Full workflow for trainings, demonstrations, awareness programmes and field visits.** Counts recorded for the headquarters return; no workflow.
- **Payroll, leave, attendance and service records.**
- **General financial accounting beyond test invoicing and receipts** — ledgers, budgets, expenditure heads and the trial balance stay with the unit's accounts wing.
- **Procurement beyond the laboratory's own indent** — sanction, tender, purchase order approval and payment to the supplier. The laboratory's own indent, with the technical acceptance criteria against which the goods are checked on receipt, is raised and approved inside the system (M12-21) and printed for the unit's purchasing process.
- **Fixed-asset financial accounting, depreciation and condemnation.** The metrological equipment register is in scope, together with the working record of what each instrument cost, because calibration and traceability need it. The financial asset register, with its capitalisation and depreciation, belongs to the parent institute and the accounts wing.
- **Research data analysis and statistical modelling for publications.**
- **Any form of instrument control.**
- **Mobile applications.** A browser interface that works acceptably on a tablet is sufficient; a native application is not built.