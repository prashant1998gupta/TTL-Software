## 7. The corrected end-to-end workflow

### 7.1 What the draft note proposed

The discussion note written in the unit proposed this sequence, quoted in its own words:

> Customer Creation → Invoice Creation with Multiple Tests → Sample Received Entry → Auto Job Creation for Each Sample → Job Assignment to Testing Team → Tester Log Entry → Test Log Approval → Test Report Generation with Sample Image → QR Code-Based Online Report View

That is a good and honest summary of a conversation. It is not yet a workflow that a laboratory can be audited against, and three parts of it will break in normal daily use. This section sets out the corrected flow and states plainly what changed and why.

### 7.2 The corrected flow, as a numbered step list

Read this as "what happens, in order, to one consignment of silk that a reeler brings to the counter". Steps marked *(optional)* can be switched off in configuration; the rest are always followed.

| Step | What happens | Who does it |
|---|---|---|
| **1** | **Customer record** created or found. The paying/owning party is identified. | Front Desk |
| **2** | **Enquiry** recorded — "what do you charge to test 5 skeins of 20/22 denier?" No commitment either way. *(optional)* | Front Desk |
| **3** | **Quotation** issued — a priced **estimate** with a validity date. It is an offer, not a bill. *(optional)* | Front Desk |
| **4** | **Test Request** captured on a Test Request Form (TRF). The customer states what they are sending, what tests they want, the declared denier / count / composition, the specification they want it judged against (if any), whether they want the sample back, and signs the declaration. | Front Desk, with the customer or the sender |
| **5** | **Request Review.** A named officer records that the laboratory has the method, an instrument in calibration, a competent tester and the capacity to do every requested test, and that the customer's requirements are clear. Outcome is **Accept**, **Decline** (with reason) or **Clarify** (go back to step 4). | Unit Incharge or Section Head |
| **6** | **Advance demand / proforma** raised, if the lab's policy requires payment before testing. This is a demand for money, not a tax invoice. *(optional, switchable)* | Accounts |
| **7** | **Sample receipt.** Physical custody begins. Date and time of receipt, quantity, number of units (skeins / bobbins / bales / pieces), mode of receipt (hand / courier / post), sender's name, packing and seal condition, and photographs are recorded. No label is printed yet; the sample number goes on an acknowledgement slip, and the lab's own label is printed at step 8, on acceptance. | Sample Receipt Clerk |
| **8** | **Sample acceptance decision.** Accept / Accept with reservation (a recorded deviation, which will print as a caveat on the report) / Raise doubt and consult the customer / Reject with a coded reason. On Accept or Accept with reservation the lab's own label is printed and fixed, carrying the due dates and test short codes that acceptance creates (step 10). | Sample Receipt Clerk, with Unit Incharge for reservations and rejections |
| **9** | **Sub-samples prepared** — the skeins, sizing skeins, panels, strips or oven-drying sets that the methods actually consume — and **pre-conditioning started** where the method requires it (standard atmosphere, commonly 27 ± 2 °C and 65 % relative humidity, for a stated number of hours). This is a genuine waiting period, not an administrative delay. | Tester / Technical Assistant |
| **10** | **Test Allocations created automatically** — one for every combination of one sample and one test. Five samples with four tests each creates twenty allocations, not five jobs. | System |
| **11** | **Allocation assigned** to a tester who is authorised for that method, against a specific instrument that is within calibration validity. Each allocation gets its own due date. | Section Head |
| **12** | **Conditioning gate cleared.** The allocation cannot start until the specimen's conditioning period has elapsed. | System |
| **13** | **Readings captured.** The tester enters the individual raw readings on a worksheet — 6 skein masses, 10 winding results, 20 weighings, 40 sizing-skein masses, 20 panel ratings, whatever the method prescribes — together with the instrument used, the reagent or reference-material lot used, and the temperature and humidity at the time. | Assigned Tester |
| **14** | **Results computed.** The system calculates the reportable value per parameter from the readings — average, standard deviation, coefficient of variation (CV %), maximum deviation, grade — using the formula version recorded against the method. The tester does not type the average. | System |
| **15** | **Result submitted.** The tester can no longer change the readings; any later change is a recorded, reasoned amendment that keeps the original visible. | Assigned Tester |
| **16** | **Technical verification.** A second competent person checks the readings, the arithmetic, the instrument and reagent status, the environmental conditions and the plausibility of the result. Outcome is **Verified** or **Sent back with a reason**. | Verifier (not the tester, wherever staffing allows) |
| **17** | **Report compiled** as a draft from the verified allocations. All printed values are frozen into the report at this point. | Report Writer |
| **18** | **Report authorised and signed** by the Approving Authority, who must be on the declared list of signatories for those parameters. The report number is allotted here. The Unique Laboratory Report (ULR) number is allotted here too, **only** if every parameter on the report is inside the accredited scope. | Approving Authority |
| **19** | **Final invoice raised** for the work actually done, at the rate in force on the request date, with tax computed at that moment. If the payment rule of WF-5 requires payment before report release, release waits for payment or for a recorded override. | Accounts |
| **20** | **Report issued and delivered** — printed, e-mailed, handed over, or made available on the verification page. The QR code and the public verification record become live. Delivery is logged. | Front Desk / Approving Authority |
| **21** | **Sample retained, returned or disposed of**, according to the retention period for that sample type and the customer's stated preference. Material destroyed during testing is recorded as consumed. | Store Keeper |
| **22** | **Amendment path**, used only if an error is found after issue: an Amendment document or a replacement report is generated, the original is marked superseded everywhere including the public verification page, and a Nonconformity record is opened. The issued report is never edited. | Approving Authority |

### 7.3 What changed, and why

| # | The draft note said | The corrected model says | Why it must change |
|---|---|---|---|
| 1 | Start with Customer, then go straight to Invoice. | Start with Customer, then Enquiry → Quotation → **Test Request** → **Request Review**. | ISO/IEC 17025:2017 clause 7.1 requires a **recorded** review that the laboratory has the capability and resources for every requested test, and that the customer's requirements are defined and agreed, **before** work begins. Without that record the lab has contracted for work it may not be able to do, and the review cannot be reconstructed afterwards. |
| 2 | The invoice is the entry document and is raised before the sample arrives. | A **Quotation** (estimate) is given at enquiry; a **proforma / advance demand** is raised if money is needed up front; the **tax invoice** is raised at report issue for the work actually done. | The charge frequently cannot be known before receipt. The rate card charges "minimum of 5 skeins", per bale, per warp, per 1000 cocoons and per measurement point. A customer says "about 20 bales"; 18 arrive, one is torn open. A grading order arrives with too little material for the seriplane tests. Invoicing first means cancelling and re-raising invoices as routine practice, which is exactly what a government audit objects to. |
| 3 | Nothing between request and receipt. | An explicit **sample receipt** step, then a separate **sample acceptance decision** with accept / accept-with-reservation / doubt / reject. | Clause 7.4.3 requires deviations on receipt to be recorded, and requires the customer to be consulted before proceeding where there is doubt about suitability. A wet, short, damaged or unmarked consignment is a normal daily event and the draft flow has nowhere to put it. A rejected lot has still consumed counter time and may still be billable. |
| 4 | "One job per sample. 5 samples = 5 jobs." | One **Sample** per submitted item, and one **Test Allocation** per **(sample × test)**. Five samples with four tests each = 5 samples and **20 allocations**. | The assignable unit of work is one test on one sample. Four testers cannot share one job row. Per-test status, per-test due date, per-test tester, per-test equipment and per-test revenue are all impossible if the sample is the unit of work. This single correction is the most important change in the document. |
| 5 | No layer between the sample and the reading. | A **Sub-sample / Specimen** layer between them. | The methods do not test "the sample". Conditioned mass draws 6 skeins in two sets of 3. Winding produces 10 bobbins. Size deviation cuts 40 or 80 sizing skeins from those bobbins. Seriplane makes 20 panels from the same 10 bobbins, and evenness, cleanness and neatness all re-use those same 20 panels. Without a specimen layer you cannot record what was consumed, what was retained, or which downstream tests shared an intermediate. |
| 6 | "Tester updates the test log with observations, results, remarks." | The tester enters **individual raw Observations**; the system computes the **Result**. Raw readings are stored permanently and are never overwritten. | Clause 7.5.1 requires original observations to be recorded at the time they are made and retained so that the test can be repeated. A denier result is 20 or 40 weighings, an average, a standard deviation, a CV % and a maximum deviation. A free-text log box cannot hold that, cannot be checked, and cannot be re-computed if a formula is corrected. |
| 7 | "Test Log Approval" — one step by "the authorized person". | Two distinct steps: **technical verification** of the numbers by a competent person other than the tester, then **authorisation and signing** of the report by the Approving Authority. | These are different acts by different people with different competence requirements. Clause 7.5.1 requires the identity of the person who **checked** data and results; clause 7.8.2.1(o) requires the identity of the person who **authorised the report**. Merging them removes the check. |
| 8 | Verification/approval implicitly lets the approver fix the numbers. | The verifier may only **Verify** or **Send back with a reason**. Only the tester changes readings, and every change is versioned with a mandatory reason. | If the approver edits a reading, the reading is no longer attributable to the person who observed it, and the audit trail becomes meaningless. |
| 9 | Report generated after approval. Nothing about later corrections. | The issued report is **immutable**. Corrections are issued as an **Amendment** ("Amendment to Report, serial number …") or as a **replacement report** that references and supersedes the original. | Clause 7.8.8 requires exactly this. A silently edited certificate is indefensible in a trade dispute over a conditioning weight or a grade, which is the situation this lab's documents are most likely to end up in. |
| 10 | QR gives "anyone" the full report online. | QR gives **anyone** authenticity and status; the **results** need the access code printed on the report, an OTP to the customer's registered number, or a login. Superseded and cancelled reports show their status, never a blank page. | A grade, a size deviation or a fibre-composition result decides payments in the local cluster. Publishing them to the world breaches clause 4.2 confidentiality and exposes personal data of individual reelers. (Design detail belongs to the reporting section; the workflow point is that report issue must **publish a verification record**, not the whole report.) |
| 11 | Equipment treated as "an asset system". | Equipment status is a **gate inside the workflow**: an allocation cannot be assigned to, or results entered against, an instrument that is out of calibration or out of service on the test date. | Otherwise the calibration module is a filing cabinet. The reason to hold equipment in the same system is so that when an instrument later fails calibration, the system can list every allocation and every issued report that used it. |
| 12 | Internal stock kept as a stock list. | Reagent and reference-material **lots** are recorded against the allocation that consumed them, and an expired lot blocks result entry on that date. | Same reason as equipment. Lot traceability is the only way to answer "which results are affected by this bad batch". |
| 13 | No place for work that is not billed. | An **order type**: Commercial / Internal R&D (advisory, zero charge) / Inter-unit referral / Statutory. | The published rate card says "All the In-House Research samples of CSTRI and Sub units are tested on advisory basis". Advisory samples still need a sample number, a tester, readings, verification and a report — they simply raise no invoice. A customer-to-invoice-to-job chain has nowhere to put them. |
| 14 | Linear flow, no waiting states. | Explicit **hold** states with coded reasons (payment, clarification, additional sample, equipment down, conditioning), and hold time excluded from turnaround measurement. | Textile methods require a 24-hour pre-conditioning wait. Payment and clarification delays are the customer's or Accounts' delay, not the laboratory's, and must not count against the lab's promised date. |

### 7.4 The corrected flow as a diagram

Paste-safe (plain characters, all lines under 90 columns).

```
              +---------------------------------------------+
              | 1  CUSTOMER  (master record, held in LIMS)  |
              +---------------------------------------------+
                                  |
                                  v
              +---------------------------------------------+
              | 2  ENQUIRY                     [optional]   |
              +---------------------------------------------+
                                  |
                                  v
              +---------------------------------------------+
              | 3  QUOTATION  = ESTIMATE, has validity date |
              +---------------------------------------------+
                                  |
                                  v
              +---------------------------------------------+
              | 4  TEST REQUEST (TRF)                       |
              |    declared denier / composition / spec     |
              |    signed by customer or sender             |
              +---------------------------------------------+
                                  |
                                  v
              +=============================================+
              | 5  REQUEST REVIEW                           |
              |    method? instrument? competent tester?     |
              |    capacity? requirements clear?            |
              +=============================================+
                 |                |                    |
        DECLINE <-+                |                    +-> CLARIFY --+
        (reason,                   |  ACCEPT                          |
         customer told)            v                        back to 4 -+
                     +---------------------------------------------+
                     | 6  ADVANCE DEMAND / PROFORMA   [optional]   |
                     +---------------------------------------------+
                                  |
                                  v
              +---------------------------------------------+
              | 7  SAMPLE RECEIPT                           |
              |    date+time, qty, units, sender, packing,  |
              |    seal, photographs (no label yet)         |
              +---------------------------------------------+
                                  |
                                  v
              +=============================================+
              | 8  ACCEPTANCE DECISION -> LABEL PRINTED     |
              +=============================================+
                 |            |              |            |
        REJECT <-+    ACCEPT WITH        RAISE DOUBT      ACCEPT
        (coded        RESERVATION        (ask customer)     |
         reason,      (caveat will        |                 |
         customer     print on report)    +-> instruction --+
         told,        |                        recorded     |
         NCR if       +------------------------------------>+
         lab-caused)                                        |
                                                            v
              +---------------------------------------------+
              | 9  SUB-SAMPLES PREPARED                     |
              |    skeins / bobbins / sizing skeins /       |
              |    panels / strips / oven sets              |
              |    PRE-CONDITIONING STARTED (24 h typical)  |
              +---------------------------------------------+
                                  |
                                  v
              +---------------------------------------------+
              | 10 TEST ALLOCATIONS CREATED AUTOMATICALLY   |
              |    one per SAMPLE x TEST                    |
              |    5 samples x 4 tests  =  20 allocations   |
              +---------------------------------------------+
                                  |
            +---------------------+---------------------+
            v                     v                     v
   +------------------+  +------------------+  +------------------+
   | 11 ALLOCATION A  |  | 11 ALLOCATION B  |  | 11 ALLOCATION C  |
   |  tester assigned |  |  tester assigned |  |  SUBCONTRACTED   |
   |  instrument set  |  |  instrument set  |  |  (customer told  |
   |  own due date    |  |  own due date    |  |   and agreed)    |
   +------------------+  +------------------+  +------------------+
            |                     |                     |
            v                     v                     |
   +------------------+  +------------------+            |
   | 12 CONDITIONING  |  | 12 CONDITIONING  |            |
   |    GATE CLEARED  |  |    GATE CLEARED  |            |
   +------------------+  +------------------+            |
            |                     |                      |
            v                     v                      |
   +------------------+  +------------------+             |
   | 13 READINGS      |  | 13 READINGS      |             |
   |  raw values only |  |  raw values only |             |
   |  + instrument    |  |  + instrument    |             |
   |  + reagent lot   |  |  + reagent lot   |             |
   |  + temp / RH     |  |  + temp / RH     |             |
   +------------------+  +------------------+             |
            |                     |                      |
            v                     v                      |
   +------------------+  +------------------+             |
   | 14 RESULT        |  | 14 RESULT        |             |
   |  computed by     |  |  computed by     |             |
   |  system: mean,   |  |  system: mean,   |             |
   |  SD, CV%, grade  |  |  SD, CV%, grade  |             |
   +------------------+  +------------------+             |
            |                     |                      |
            v                     v                      |
   +------------------+  +------------------+             |
   | 15 SUBMITTED     |  | 15 SUBMITTED     |             |
   +------------------+  +------------------+             |
            |                     |                      |
            v                     v                      v
   +-------------------------------------------------------------+
   | 16 TECHNICAL VERIFICATION                                   |
   |    second competent person checks numbers, instrument,      |
   |    reagent, environment, plausibility                       |
   +-------------------------------------------------------------+
            |                                    |
    SEND BACK (reason) --> back to 13        VERIFIED
                                                 |
                                                 v
                     +---------------------------------------------+
                     | 17 REPORT DRAFT COMPILED                    |
                     |    printed values FROZEN into the report    |
                     +---------------------------------------------+
                                       |
                                       v
                     +=============================================+
                     | 18 AUTHORISATION AND SIGNING                |
                     |    Approving Authority, declared signatory  |
                     |    -> Report No. allotted                   |
                     |    -> ULR allotted only if fully in scope   |
                     +=============================================+
                            |                        |
                 SEND BACK -+                        v
                 to 17           +---------------------------------------+
                                 | 19 FINAL INVOICE (work actually done) |
                                 +---------------------------------------+
                                                     |
                                        payment required
                                        before release? ------+
                                                     |         |
                                                  no |         | yes,
                                                     |         | unpaid
                                                     |         v
                                                     |   +-------------+
                                                     |   | ON HOLD     |
                                                     |   | (payment)   |
                                                     |   | override    |
                                                     |   | with reason |
                                                     |   +-------------+
                                                     |         |
                                                     +<--------+
                                                     v
                     +---------------------------------------------+
                     | 20 REPORT ISSUED AND DELIVERED              |
                     |    QR / verification record published       |
                     |    delivery logged                          |
                     +---------------------------------------------+
                                       |
                                       v
                     +---------------------------------------------+
                     | 21 SAMPLE RETAINED / RETURNED / DISPOSED    |
                     |    (consumed-in-test recorded honestly)     |
                     +---------------------------------------------+

    ......... error found after issue .........................
    :                                                          :
    v                                                          :
 +---------------------------------------------------------+    :
 | 22 AMENDMENT or REPLACEMENT REPORT                      |    :
 |    original marked SUPERSEDED everywhere, including     |    :
 |    the public verification page. Nonconformity opened.  |    :
 |    THE ISSUED REPORT IS NEVER EDITED.                   |....:
 +---------------------------------------------------------+
```

### 7.5 The one-line version (for the front of the document)

```
Customer -> Enquiry -> Quotation -> Test Request (reviewed, capability confirmed)
-> Sample received and accepted -> Sub-samples and conditioning
-> Test Allocations, one per sample x test -> Readings -> Result
-> Technical Verification -> Report authorised and signed -> Invoice
-> Report issued with QR -> Sample retained / returned / disposed
     (with a formal Amendment path if an error is found after issue)
```

### 7.6 Workflow rules for the overall flow

| ID | Priority | Rule | Acceptance check |
|---|---|---|---|
| **WF-1** | [MUST] | No sample may be physically accepted, and no testing may start, against a Test Request that is not in state **Accepted**. The Request Review record (reviewer, date, capability confirmed, remarks) must exist before acceptance. | Attempt to receive a sample against a Test Request in state *Pending Review*. The system refuses and names the missing review. |
| **WF-2** | [MUST] | The Request Review must record, per requested test, that (a) the test exists in the catalogue for that sample type, (b) an active verified method version exists, (c) at least one instrument of each required type is in calibration validity, and (d) at least one person is authorised for that method. Any failure must be shown to the reviewer, who may still accept with a recorded justification. | Take a request containing a test whose only instrument is overdue for calibration. The review screen shows a red line naming the instrument, and acceptance requires a typed justification. |
| **WF-3** | [MUST] | A Quotation is an estimate only. It never posts to accounts, never allots an invoice number, and carries a validity date. | Issue a quotation. No entry appears in any invoice or receipt register. |
| **WF-4** | [MUST] | A tax invoice may only be raised for tests that reached state **Verified** or a chargeable terminal state (see WF-37, WF-84). Tests that were aborted through no fault of the customer must not appear on the invoice. | Abort one allocation as "sample insufficient — lab error" and raise the invoice. That line is absent. |
| **WF-5** | [MUST] | A configuration rule **`payment_release_rule`** exists per unit, taking one of three values — *Not required*; *Required before testing begins*; *Required before report release*. The rule is set per **order type** (WF-19), with an optional override per **customer category** (M1-11). Evaluation order: the order-type value is read first; where it is *Not required* the order is never held; otherwise the customer-category override for that order's customer applies, falling back to the order-type value. *Required before report release* blocks the move to *Issued*; *Required before testing begins* raises the Hold-for-Payment state of M3-26. Either may be overridden by a named officer with a reason (WF-41, M17-43). | Set the Commercial order-type value to *Required before report release*, attempt to issue an unpaid report, confirm refusal, then override as Unit Incharge and confirm the override appears in the audit trail and in an exception report. Set the customer-category override for Government Department to *Not required* and confirm a Commercial order for that customer is not held. |
| **WF-6** | [MUST] | The commercial hold in WF-5 is separate from and must never alter the **technical** release decision. Verification and authorisation proceed normally; only the final issue step waits. | With the rule set to *Required before report release* and payment absent, a verifier can still verify and the Approving Authority can still sign. Only "Issue" is blocked. |
| **WF-7** | [MUST] | One **Test Allocation** is created for every combination of one accepted sample and one requested test. Each allocation carries its own state, assignee, instrument, due date and price. | Accept one sample against a request line requesting 4 tests. Exactly 4 allocations appear, each independently assignable. |
| **WF-8** | [MUST] | Where a method requires a specimen, the allocation must be linked to a **Sub-sample**. Where several methods share one physical intermediate (for example the 10 bobbins from the winding test, or the 20 seriplane panels), the same sub-sample may be linked to several allocations. | Create a grading order; confirm that size, evenness, cleanness, neatness, tenacity and cohesion allocations all point at sub-samples derived from the same 10 bobbins, and that the panel set is shared by evenness, cleanness and neatness. |
| **WF-9** | [MUST] | Raw **Observations** are append-only. An observation is never updated in place and never deleted. A correction is a new observation row plus an exclusion marker and a mandatory reason on the original. | Enter a reading, then correct it. Both values remain visible in the reading history, original first, with the reason shown. |
| **WF-10** | [MUST] | The reportable **Result** for a parameter is computed by the system from the observations using the formula version recorded on the method version. It is not typed by the tester, except for parameters whose data type is text, enumeration or grade-by-inspection. | Enter 40 sizing-skein masses. The average size, standard deviation, CV % and maximum deviation appear without being typed, and match the worked example supplied by the lab. |
| **WF-11** | [MUST] | Verification is a separate act from authorisation. The system records the verifier and the authoriser separately, each with identity, role, and server timestamp. | Verify and then sign a report. Two distinct signature records exist with two distinct meanings. |
| **WF-12** | [MUST] | By default, the verifier must be a different person from the tester. The rule is configurable per section. Where staffing forces the same person to do both, the system permits it only with a reason and records "performed and verified by the same person" on the allocation for management review. | Attempt self-verification with the rule on. Refused. Switch to single-analyst mode, retry, confirm the override reason is captured and appears in a monthly exception report. |
| **WF-13** | [MUST] | The verifier may only **Verify** or **Send back**. The verifier cannot alter an observation or a result value. | Log in as verifier; the reading fields are read-only, and only two action buttons are available. |
| **WF-14** | [MUST] | A Test Allocation cannot enter **Result Entered** unless every mandatory parameter has at least the required number of readings for that method version, and every instrument recorded against those readings was within calibration validity on the observation date, and every consumable or reference-material lot recorded was unexpired on the observation date (detailed in WF-70). | Attempt submission with 38 of 40 required readings, then with an out-of-calibration balance, then with an expired reagent lot. Each is refused with a specific message. |
| **WF-15** | [MUST] | Sending a report back for correction, amending a report, overriding a calibration block, overriding an expired-lot block, overriding the segregation-of-duties rule, or overriding a quality-control failure each requires a reason from a controlled list plus free text. None may be left blank. | Attempt each action with an empty reason. Refused in every case. |
| **WF-16** | [MUST] | An issued report is immutable. There is no edit path. Corrections are made only by issuing an Amendment document or a replacement report, each with its own number, each referencing the original. | Attempt to open an issued report for editing. No such option exists for any role, including administrator. |
| **WF-17** | [MUST] | Issuing an Amendment or a replacement report automatically opens a Nonconformity record, unless the reason code is on a configured list of non-nonconforming reasons (for example a corrected customer postal address). | Amend a report for "calculation error". A Nonconformity record is created and linked. Amend for "customer address correction". No Nonconformity is created. |
| **WF-18** | [MUST] | Report issue publishes a verification record containing the report number, date, status and document fingerprint. When a report is superseded or withdrawn, the verification record for the original changes status; it is never removed. | Issue a report, scan the QR, see *Valid*. Amend it, scan the same QR, see *Superseded by …*. |
| **WF-19** | [MUST] | Order type is one of **Commercial**, **Internal R&D (advisory, zero charge)**, **Inter-unit referral**, **Statutory / scheme**. Internal R&D orders follow the full technical workflow and produce a report but never produce an invoice. | Create an Internal R&D order, complete it, issue the report. No invoice is created and no receivable appears. |
| **WF-20** | [MUST] | The system records, per order and per allocation, which unit **received** the sample, which unit **performed** the test, and which unit **bills** it. These may differ. | Record an order received at Dharmavaram, tested at TTL Bengaluru, billed at Dharmavaram. All three appear on the record and on the relevant registers. |
| **WF-21** | [SHOULD] | Turnaround measurement uses two clocks reported separately: **Gross** (sample acceptance to report issue) and **Net** (Gross minus all hold time and all withheld time, WF-91). Both are taken from the recorded state history, not from a manually typed field. | Put an allocation on hold for two days, complete it, and confirm Gross exceeds Net by two working days. |
| **WF-22** | [SHOULD] | Bulk entry must exist for the high-volume case: registering many samples of the same type against one request, creating and assigning their allocations in one action, entering readings for many lots of the same test on one screen, and printing all their labels together. | Register 30 lots for the Limited Test and assign them in a single action, in under five minutes measured on the lab's own machine. |

**OPEN-Q1:** Does the unit currently require payment before testing, before report release, or neither, and does the answer differ by customer class (for example advance from traders, none from government departments)? — *Recommended default:* payment required before **report release**, not before testing, with the order-type value on for Commercial and off for Internal R&D, Inter-unit referral and Statutory / scheme, and per-customer-category overrides seeded to *Not required* for Government Department, CSB Internal Unit and CSB Internal R&D so that a government department placing a Commercial order is not held.

**OPEN-Q2:** With three or four technical staff, is a verifier who is different from the tester achievable for every test, or only for some? — *Recommended default:* enforce tester ≠ verifier as the rule, permit a recorded override, and review the override count monthly. State the position honestly in the quality manual rather than claiming a separation that cannot be kept.

**OPEN-Q3:** Should one report be allowed to cover several samples (for example one certificate for a 20-bale conditioning lot), or is it strictly one report per sample? — *Recommended default:* allow one report to cover many samples of the same order, controlled by a per-report-type setting, because the conditioning and grading customers expect a single certificate.

**OPEN-Q4:** Is the Tatkal same-day scheme (double charge, maximum 5 samples, booked before 11:00, only tests completable within 6 hours) actually used at Dharmavaram? — *Recommended default:* build the priority flag and the eligibility rules, leave the scheme disabled in configuration until the unit confirms.

---

## 8. Core things the system keeps track of

This section is the vocabulary of the whole project. Once these words are agreed, the screens, the database tables and every future meeting should use exactly these words and no others.

### 8.1 The entities, in plain language

**Customer**
The party who owns the test result, whose name is printed on the report, and who is billed.
*Example:* M/s Sri Lakshmi Silks, Regatipalli, Dharmavaram — a multi-end reeling unit that sends silk for the Limited Test most weeks.
*It is NOT the Sender.* The person who physically carried the skeins to the counter is often a broker, a boy from the unit, or a courier. If those two are stored in one field, the certificate ends up in the broker's name and the reeler cannot prove ownership of it.

**Contact**
A named person at the Customer, with a mobile number and e-mail, who may be the primary contact, the report recipient, or both.
*Example:* Sri K. Ramesh, Manager, mobile 9xxxxxxxxx, marked "report recipient".
*It is NOT the Customer.* One customer has several contacts, and contacts change while the customer stays.

**Sender / Agent**
The person or agency that physically handed over or despatched this particular sample.
*Example:* "Brought by Sri M. Naidu (broker), on behalf of M/s Sri Lakshmi Silks"; or "Received by courier, docket 1234567890".
*It is NOT the Customer, and NOT a Contact.* It is recorded on the **Sample**, because it can differ from consignment to consignment for the same customer.

**Enquiry**
A recorded question about price, method or turnaround, with no commitment from either side.
*Example:* "Phone call, 12 August: what do you charge for ISA grading of ARM silk, and how long does it take?"
*It is NOT a Quotation and NOT an Order.* No work may be started against it and no number may be quoted from it as a price commitment.

**Quotation**
The laboratory's priced offer, with a validity date, that may be accepted or ignored.
*Example:* Quotation for 20 lots of Limited Test at the approved rate, plus tax, valid 30 days.
*It is NOT an Invoice.* It creates no receivable, posts nothing to accounts, and is an **estimate** that the final invoice may differ from because the actual sample count or weight differed.

**Test Request (TRF) / Order**
The customer's accepted, reviewed request that authorises the laboratory to work and creates the commercial relationship. It carries the customer's declarations and signature.
*Example:* TRF from M/s Sri Lakshmi Silks, 5 lots of raw silk, declared 20/22 denier, multi-end reeled, Limited Test on each, sample not required back, normal priority, signed by the sender.
*It is NOT the Sample and NOT the Invoice.* One request may cover many samples and result in one or several invoices.

**Request Line**  *(the line item on a Test Request; table `txn_order_line`)*
One requested test, at one agreed price, for a stated number of samples, within a Test Request.
*Example:* Line 1 — Limited Test, raw silk, 5 samples, ₹50 each. Line 2 — Twist test (single), twisted silk, 2 samples, ₹55 each.
*It is NOT a Test Allocation.* The request line is what was agreed and priced; the allocation is the actual piece of work on one actual sample.

**Sample**
One physical item or lot submitted by the customer and registered under one laboratory reference number.
*Example:* 5 skeins of raw silk received on 19 August 2026, marked "SLS-118", declared 20/22 denier, 350 g, registered as `DVM/2026-27/RS/01188`.
*It is NOT a Sub-sample and NOT a Test Allocation.* Deciding what counts as one sample is a decision the lab must make per sample type, and it is recorded in the Sample Type master — see OPEN-Q5.

**Sub-sample / Specimen**
The physical piece actually consumed or measured by one test, prepared from a Sample.
*Example:* skein 3 of the 6 drawn for conditioned mass; bobbin 7 of the 10 wound; sizing skein 24 of 40; seriplane panel 12 of 20; the kilcha made on the wrap reel.
*It is NOT the Sample.* Several sub-samples come from one sample, and one sub-sample can feed several tests — the 10 bobbins feed size, evenness, tenacity and cohesion; the 20 panels feed evenness, cleanness and neatness.

**Test Catalogue Item**
A billable service in the price list, as the customer would name and buy it.
*Example:* "Limited test (5 skeins minimum) — ₹50"; "Raw silk testing and grading — BIS — ₹400"; "Cohesion test of raw silk — BIS — ₹60"; "Cohesion — ISA — ₹400".
*It is NOT the Test Method.* The same characteristic sold under two different standards is **two catalogue items** with two prices, because that is how the approved rate card is written.

**Test Method**
The documented procedure actually followed, identified by standard, part and year of issue, in a specific revision, with the conditioning requirement, replicate counts, formulae, rounding rule and required equipment attached.
*Example:* IS 15090 (Part 5):2002 — Determination of size deviation and maximum deviation, revision 2, requires 24 h conditioning at 27 ± 2 °C and 65 ± 2 % RH, 4 sizing skeins of 450 m from each of 10 bobbins = 40 readings.
*It is NOT the Test Catalogue Item.* Price and customer-facing name belong to the catalogue item; competence, equipment, environment and arithmetic belong to the method version. Every result must store the **method version** that produced it, not just the method.

**Parameter / Characteristic**
One measured or assessed property, with its unit of measure, data type, number of decimals and rounding rule.
*Example:* Average size (denier, 2 decimals); Size deviation (denier, 2 decimals); Maximum deviation (denier, 1 decimal); Cleanness (%); Panel neatness rating (%, **chosen** by the assessor against the official standard photographs — under the BIS method revision the permitted set is 100, 90, 80, 70, 60, 50, 30, 10, held per method revision, M1-44); Average neatness (%, **computed** as the mean of the panel ratings and then rounded by that method revision's rounding rule, M6-06 — it is never picked from a list); Cohesion (strokes, whole number, no decimals); Twist direction (S or Z).
*It is NOT a Result.* The parameter is the definition; the result is the value for one sample.

**Specification / Limit Set**
A named set of limits or grade bands against which results are judged, with a standard reference and effective dates.
*Example:* the BIS raw silk grading tables for Category II (2.1–3.6 tex, that is 19–33 denier), giving the grade bands 4A, 3A, 2A, A, B, C, D, E for the **Category II** major tests — size deviation, evenness I, evenness II, cleanness, average neatness and low neatness — plus the **Category II** auxiliary classes for maximum deviation, evenness III, winding, tenacity, elongation and cohesion. That split is **Category II only** and must not be read as a general rule: in other size categories the same characteristic can move between the major and the auxiliary set. The authoritative per-category major and auxiliary sets, the size category boundaries, the cohesion cut-off and the one-class cap are held as reference data under M1-51 in Part C, in the raw silk grade computation annex that follows it; that annex governs and this example only illustrates it.
*It is NOT the Parameter and NOT the Result.* Limits change between BIS and ISA and change with the edition of the standard, so they are dated reference data, never numbers inside program code.

**Test Allocation** — *the thing the draft note called "the Job"*
One test, on one sample, assigned to one tester, on one instrument, with its own due date and its own state. This is the unit of work.
*Example:* `DVM/2026-27/RS/01188-T01` — Limited Test on sample 01188, assigned to Smt. P. Sujatha, denier balance EQ-014, due 22 August 2026, 14:00.
*It is NOT the Sample and NOT the Worksheet.* One sample with four tests has four allocations. One worksheet may contain thirty allocations from eight different samples.

**Worksheet**
One tester's run sheet, grouping many allocations that will be done together in one session on one instrument, together with the quality-control positions for that run and the ambient temperature and humidity.
*Example:* Worksheet for the morning of 19 August: 26 Limited Test allocations from 26 different lots, plus one duplicate position and one check-weight position, ambient 27.4 °C and 64 % RH.
*It is NOT the Allocation.* The worksheet is how a batch is organised; the allocation is what is owed to one customer.

**Observation / Reading**
One raw value as first read from the instrument or judged by eye, before any calculation.
*Example:* sizing skein 7 weighed 0.318 g on balance EQ-014 at 11:42; panel 12 rated 80 against the standard photographs; break 3 in the winding test caused by a "loose end".
*It is NOT the Result.* Twenty or forty observations produce one result. Observations are permanent and are never overwritten.

**Result**
The single reportable value for one parameter on one allocation, computed from the observations, with its unit, its statistics and its comparison against the limit set.
*Example:* Average size 21.34 denier; size deviation 1.12 denier; CV 5.2 %; maximum deviation 2.8 denier; grade 2A.
*It is NOT an Observation.* A result carries its own revision history: if it changes, the old value is retained with a reason.

**Verification**
The recorded act of a competent person checking an allocation's readings, arithmetic, instrument, reagent lot, environment and plausibility, and either passing it or sending it back with a reason.
*Example:* "Verified by Sri B. Srinivas, Technical Assistant, 20 August 2026 10:15" or "Sent back: two readings outside plausible range, re-weigh skeins 12 and 19."
*It is NOT Authorisation.* Verification is about the numbers. Authorisation is about issuing the document.

**Report**
The document instance issued to the customer, with its own number, its type, its signatory, its frozen contents and its stored file.
*Example:* Test Report `DVM/TR/2026-27/00380` dated 20 August 2026, covering the Limited Test result on sample 01188, signed by the Scientist-D as Approving Authority.
*It is NOT the Result and NOT a "certificate" as a separate concept.* Test report, grading certificate, conditioned-mass certificate, pre-shipment certificate and HSN certificate are all **report types** — one entity, different templates, different numbering series and different signatory rules.

**Report Revision**
A further document that corrects an issued report — either an **Amendment** (a supplementary page carrying the words "Amendment to Report, serial number …") or a **Replacement** (a complete new report that states which report it supersedes).
*Example:* `DVM/TR/2026-27/00380/R1`, reason "transcription error in average size", superseding `DVM/TR/2026-27/00380`.
*It is NOT an edit.* The original stays in the system, stays retrievable, and is marked superseded wherever it appears, including on the public verification page.

**Weight / Conditioning Certificate**
A report type that states the commercial invoice weight of a lot of raw silk: gross mass, itemised tare, net mass, moisture content, oven-dry mass and conditioned mass (oven-dry mass plus 11 %).
*Example:* Conditioned mass of a lot of 22 books — gross 60.4 kg, tare 1.6 kg, net 58.8 kg, average moisture 7.2 %, oven-dry 54.57 kg, **conditioned weight 60.57 kg**.
*It is NOT a test report.* It is a mass and settlement document in kilograms, with an arithmetic build-up the customer will audit line by line. Its data shape is completely different from a quality report and it must not be forced into the same tables.

**Invoice**
The tax document that demands money for work done, with its own financial-year number series, tax breakdown and place of supply.
*Example:* `DVM/I/2627/00417` — 5 Limited Tests at ₹50, taxable value ₹250, plus tax as applicable.
*It is NOT the Order and NOT the Receipt.* The order says what was agreed; the invoice says what is owed; the receipt says what was paid.

**Receipt / Challan**
The record that money was actually tendered and credited, with its mode and its mode-specific references.
*Example:* the full amount due on invoice `DVM/I/2627/00417` tendered in cash at the counter, money receipt `DVM/MR/2026-27/00902`; or a Demand Draft; or a bank transaction reference and Unique Transaction Reference; or a government challan reference.
*It is NOT the Invoice.* One receipt may settle several invoices, one invoice may take several receipts, and advances arrive before any invoice exists.

**Equipment**
One instrument, measurement standard or item of auxiliary apparatus that can influence a result, with its identity, location, status and calibration programme.
*Example:* EQ-014 — electronic balance, 220 g capacity, readability 0.1 mg, calibrated 12 March 2026, next due 11 March 2027, in service, denier room.
*It is NOT an accounting asset record.* The fixed-asset register (cost, supplier, depreciation, physical verification, condemnation) and the metrological control register (range, interval, calibration result, correction factors, out-of-service status) are two different registers with two different owners. Both are needed; neither replaces the other.

**Calibration Record**
One dated calibration, verification, intermediate check, maintenance or breakdown event against one item of equipment, with its result, its acceptance criteria, its validity period and its certificate.
*Example:* External calibration of EQ-014 by an accredited calibration laboratory, certificate no. XYZ/2026/442, result Pass, correction factors attached, valid to 11 March 2027.
*It is NOT the Equipment record.* Equipment is the thing; calibration records are its history. The current due date shown on the equipment record is a cached copy of the latest record.

**Consumable Lot**
One received batch of a reagent, chemical, reference material or consumable, with its supplier, lot number, expiry, certificate and remaining quantity.
*Example:* Sodium hydroxide, lot 22B/2026, received 4 July 2026, expiry 3 July 2028, 480 g on hand, certificate of analysis attached, status Approved.
*It is NOT the item / stock code.* The item is "sodium hydroxide". The lot is the specific batch that a specific result depended on. Traceability and expiry blocking work at lot level only.

**Personnel Competency**
An authorisation for one named person to perform one named activity on one named method, valid between two dates, with the evidence on which it was granted.
*Example:* Smt. P. Sujatha — authorised to **perform** IS 15090 Part 5, valid from 1 April 2025, basis "competence assessment dated 28 March 2025", authorised by Unit Incharge.
*It is NOT a login role.* A role decides which screens a person can open. A competency decides which methods a person may actually run, check, sign or interpret. Both are required, and a role is never a substitute for a competency.

**Complaint**
A recorded expression of dissatisfaction from a customer or other party, with its investigation, decision and outcome.
*Example:* "Customer disputes size deviation reported on `DVM/TR/2026-27/00380`, alleges sample was mixed up."
*It is NOT a Nonconformity.* A complaint is what someone told us. A nonconformity is a finding that our own work did not conform. A valid complaint usually opens a nonconformity; an invalid one does not.

**Nonconformity / CAPA**
A record that some aspect of the laboratory's work did not conform, with the immediate action, the impact analysis on previous results, the decision on acceptability, the customer notification and recall where needed, the root cause, the corrective action and the check that the action worked.
*Example:* "Balance EQ-014 failed calibration on 2 September. Suspect from 12 March. 214 allocations and 198 issued reports used it in that window. Disposition per report recorded. 6 reports replaced, customers notified."
*It is NOT a Complaint and NOT an Amendment.* An amendment is one of the actions a nonconformity may require.

### 8.2 How they relate

Cardinality notation: `1---*` means one to many; `*---1` means many to one; `0/1` means optional single.

```
CUSTOMER
  |
  |1---*  CONTACT
  |
  |1---*  ENQUIRY  1---*  QUOTATION  0/1---1  TEST REQUEST (ORDER)
  |                                              |
  |1---*  TEST REQUEST (ORDER) --------------->  |
                                                 |1---*  REQUEST LINE
                                                 |
                                                 |1---*  SAMPLE
                                                          |
                (SENDER / AGENT recorded here) -----------+
                                                          |
                                     |1---*  SUB-SAMPLE / SPECIMEN
                                     |
                                     |1---*  TEST ALLOCATION  *---1 REQUEST LINE
                                                   |
                                                   |*---1  TEST CATALOGUE ITEM
                                                   |          |1---*  TEST METHOD
                                                   |                    |1---*
                                                   |                  PARAMETER
                                                   |*---0/1 SPECIFICATION SET
                                                   |*---0/1 SUB-SAMPLE
                                                   |*---0/1 WORKSHEET
                                                   |*---0/1 EQUIPMENT
                                                   |*---*   CONSUMABLE LOT
                                                   |
                                                   |1---*  OBSERVATION
                                                   |1---*  RESULT   (one per parameter)
                                                   |1---*  VERIFICATION event
                                                   |
                                                   |*---*  REPORT
```

```
REPORT
  |*---*  TEST ALLOCATION        (a report may cover many allocations;
  |                               an allocation may appear on the original
  |                               report and on its replacement)
  |0/1--1 REPORT it supersedes
  |1---0/* REPORT REVISION       (amendment or replacement)
  |*---1  CUSTOMER  (name and address frozen at issue)
  |*---1  APPROVING AUTHORITY (personnel)
  |
  +-- report_type = TEST REPORT | GRADING CERTIFICATE
                  | WEIGHT / CONDITIONING CERTIFICATE
                  | PRE-SHIPMENT CERTIFICATE | HSN CERTIFICATE
                  | PRELIMINARY EXAMINATION RECORD
```

```
TEST REQUEST (ORDER)
  |1---*  INVOICE  1---*  INVOICE LINE  *---0/1  TEST ALLOCATION
  |                   |
  |                   |*---*  RECEIPT / CHALLAN     (many-to-many:
  |                                                  one receipt may settle
  |                                                  several invoices)
  |0/1--*  ADVANCE / RECEIPT VOUCHER

EQUIPMENT 1---* CALIBRATION RECORD
CONSUMABLE (item) 1---* CONSUMABLE LOT
PERSONNEL 1---* PERSONNEL COMPETENCY  *---1 TEST METHOD
COMPLAINT 0/1---1 NONCONFORMITY 1---* CAPA ACTION
NONCONFORMITY *---0/1 EQUIPMENT | CONSUMABLE LOT | TEST ALLOCATION | REPORT
```

### 8.3 Settled vocabulary — use exactly these words

| Concept | The word this project uses | Database table | Label on screen | Do **not** call it |
|---|---|---|---|---|
| Party who owns the result and is billed | **Customer** | `mst_customer` | Customer | Client, Party, Firm, Sender |
| Person at the customer | **Contact** | `mst_customer_contact` | Contact | User, Party |
| Who physically brought or sent this consignment | **Sender** | fields on `txn_sample` | Received from / Sender | Customer, Agent (in the database), Broker |
| Priced offer with validity | **Quotation** | `txn_quotation` | Quotation (Estimate) | Estimate slip, Proforma, Invoice |
| Reviewed, accepted request that authorises work | **Test Request** (short form **TRF**) | `txn_order` | Test Request | Job, Order form, Booking, Indent |
| One requested test at one price for n samples | **Request Line** | `txn_order_line` | Request Line | Job line, Test |
| One physical submitted item or lot | **Sample** | `txn_sample` | Sample | Job, Lot, Consignment, Specimen |
| Physical piece below the Sample — an as-received package (bale, book, cone, skein) or a prepared specimen | **Sub-sample** | `txn_subsample` | Sub-sample | Sample, Specimen (informal use is fine in speech, not in the system), Partition, Sub-unit |
| Billable service in the price list | **Test** *(catalogue)* | `mst_test` | Test (Catalogue) | Method, Parameter, Analysis |
| Documented procedure and its revision | **Method Version** | `mst_test_method` | Method / Version | Test, Standard, SOP (the SOP is an attachment to it) |
| One measured property | **Parameter** | `mst_parameter` | Parameter | Test, Result, Characteristic (acceptable in speech) |
| Limits and grade bands | **Specification Set** | `mst_spec_set`, `mst_spec_limit` | Specification | Standard, Limits, Grade table |
| One test on one sample — the assignable work unit | **Allocation** | `txn_sample_test` | Allocation (Job No.) | Job, Test, Task, Work order |
| Batch run sheet | **Worksheet** | `txn_worksheet` | Worksheet | Log, Register, Batch |
| One raw value | **Reading** | `txn_observation` | Reading | Result, Observation (acceptable in speech), Value, Entry |
| Computed reportable value | **Result** | `txn_result` | Result | Reading, Value, Test log |
| Checking the numbers | **Verification** | `txn_verification` | Verify | Approval, Checking, Sign-off |
| Signing and issuing the document | **Authorisation** | fields on `txn_report`, `sys_esign` | Authorise and Sign | Approval, Verification |
| The issued document | **Report** (with a **report type**) | `txn_report` | Report | Certificate (as a separate thing), Test log, Result sheet |
| Correction after issue | **Amendment** or **Replacement Report** | `txn_report` with lineage links | Amendment / Replacement | Revision, Correction, Edit, Re-issue |
| Mass and settlement document | **Conditioning Certificate** (report type) | `txn_report`, type `CONDITIONING` (mass arithmetic in its own tables, M10-02) | Conditioning Certificate | Weight certificate (acceptable in speech), Test report |
| Person authorised to sign | **Approving Authority** | `mst_personnel` + `mst_competency` | Approving Authority | Approver, Signatory (acceptable in speech), Officer. Approving Authority is the role and the screen label; Authorised Signatory Register is the proper name of the register of such persons, retained because it is the accreditation body's term. |
| Register of persons authorised to sign | **Authorised Signatory Register** (the accreditation body's own term) | `mst_signatory_scope` | Authorised Signatory Register | Signatory list, Approver list |
| Money demand | **Invoice** | `txn_invoice` | Invoice | Bill (acceptable in speech), Receipt, Challan |
| Money received | **Receipt** | `txn_receipt` | Receipt | Invoice, Challan (a challan reference is a field on a Receipt) |
| Instrument record | **Equipment** | `mst_equipment` | Equipment | Asset, Machine, Instrument (acceptable in speech) |
| Calibration event | **Calibration Record** | `mst_equipment_event` | Calibration / Check | Certificate, Asset entry |
| Batch of a reagent | **Lot** | `mst_consumable_lot` | Lot | Batch (acceptable in speech), Stock, Item |
| Authorisation to run a method | **Competency** | `mst_competency` | Competency / Authorisation | Role, Permission, Training |
| Customer's expression of dissatisfaction | **Complaint** | `txn_complaint` | Complaint | Nonconformity, Issue, Ticket |
| Finding that our work did not conform | **Nonconformity** (short form **NCR**) | `txn_ncr` | Nonconformity | Complaint, Error, Problem |

### 8.4 Words we will stop using

| Word to stop using | Why it is dangerous | Say this instead |
|---|---|---|
| **"Job"** on its own | In the draft note it means the request, the sample, the test on a sample, and the worksheet, in different sentences. Four different things. | **Test Request**, **Sample**, **Allocation** or **Worksheet** — whichever is meant. If the unit's habit is too strong to break, the screen may print `Allocation No.` with the subtitle `(Job No.)` for one release only. |
| **"Test"** on its own | It means the catalogue item, the method, the parameter, and the allocation. | **Test (Catalogue)**, **Method Version**, **Parameter**, or **Allocation**. |
| **"Approval"** on its own | It merges checking the numbers with signing the document. These are different acts, by different people, with different competence rules. | **Verification** or **Authorisation**. |
| **"Test log"** | Suggests one free-text box, which is exactly the wrong data model. | **Readings** and **Results**, held on a **Worksheet**. |
| **"Sample"** meaning a strip, skein, panel or sizing skein | Confuses the customer's consignment with the piece the instrument touched. | **Sub-sample**. |
| **"Lot"** used loosely | In this trade "lot" is the customer's commercial lot **and** the grading unit under IS 15090 **and** a reagent batch. | **Sample** (customer's submission), **Grading Lot** (the IS unit), **Lot** (reagent) — always qualified. |
| **"Customer"** meaning whoever handed the sample over | Puts the broker's name on the certificate. | **Sender** for the person who handed it over; **Customer** for the owner. |
| **"Certificate"** as a separate module | Encourages three near-identical modules that drift apart. | **Report**, with a **report type**. |
| **"Revise"** / **"Correct"** a report | Implies editing in place, which is prohibited. | **Amend** (supplementary document) or **Replace** (new report superseding the original). |
| **"Asset"** for an instrument | Hides the calibration obligation behind an accounting word. | **Equipment**, and keep the accounting asset record separate. |
| **"Lab In-Charge"** | It is used for two different offices — the officer who signs reports and the sectional supervisor. Those are different acts, with different authority. | Say **Approving Authority** for the signing role or **Section Head** for the sectional supervisor — state which is meant. |
| **"Unit In-Charge"** (hyphenated) | Two spellings of one post, used loosely for both the signing role and the sectional supervisor. The post itself is written **Unit Incharge**; the signing role it holds is **Approving Authority**. | Say **Approving Authority** for the signing role or **Section Head** for the sectional supervisor — state which is meant. |
| **"Order line"** | A second name for the Request Line settled in 8.3, so the screen label and the specification prose drift apart. | **Request Line** — the table is still `txn_order_line`. |

| ID | Priority | Rule | Acceptance check |
|---|---|---|---|
| **WF-23** | [MUST] | The words in the table in 8.3 are used identically in the user interface, in the database table and column names, in printed documents and in all project correspondence. | Open any five screens and any five tables; the words match the table exactly. |
| **WF-24** | [MUST] | Every transaction record carries created-by, created-at, updated-by and updated-at, plus current state, state-changed-by and state-changed-at. No transaction record is ever hard-deleted. | Attempt a delete on any transaction table through the application database account. Refused at the database level, not only in the application. |
| **WF-25** | [MUST] | Human-readable numbers (sample number, report number, invoice number) are separate unique columns. The internal database key is never a human-readable number. | Change the display format of a series in configuration. No existing links break. |
| **WF-26** | [MUST] | A measured value column supports both a numeric value and a text value, because grades, S/Z twist direction, "Absent", "Pass" and inspection ratings are legitimate results. | Record a cohesion result of 87 strokes, a grade of "2A" and a twist direction of "Z". All three store and print correctly. |

**OPEN-Q5:** For each sample type, what counts as **one sample**? Specifically: for conditioning, is one bale one sample with the lot as a grouping, or is the lot one sample with per-bale readings? For a multi-cone twisted-silk submission, is each cone a sample? — *Recommended default:* the **grading or settlement unit** is the Sample, and the physical bales, books, cones or skeins inside it are Sub-samples. For conditioning that means the **lot** is the sample and each bale contributes readings. Confirm per sample type before any code is written; this decision cannot be changed later without re-registering history.

**OPEN-Q6:** Does the unit still issue conditioned-mass / weight certificates, how many a year, and under which rate head are they billed? — *Recommended default:* build the Conditioning Certificate as a report type with its own number series and its own tare build-up form, but schedule it after the high-volume Limited Test path, and do not assume volume.

---

## 9. Sample and test allocation lifecycle

Two state machines, coupled. The **Sample** state describes where the physical silk is and what may be done to it. The **Allocation** state describes the progress of one test. The Sample state is largely **derived** from its allocations and is written by one service function only, never by scattered screen code.

### 9.1 Table A — Sample states

| State | Meaning in plain English | Who can move it out | Allowed next states | What the system does automatically on entry |
|---|---|---|---|---|
| **Expected** | Registered against an accepted Test Request. Not physically here yet. | Front Desk, Sample Receipt Clerk, Unit Incharge | Received, Cancelled, Withdrawn | Allots the sample number. Does **not** print a label. Does **not** start any clock. |
| **Received** | Physically in the laboratory. Custody has started. Condition not yet checked. | Sample Receipt Clerk, Unit Incharge | Accepted, Accepted with Reservation, Doubt Raised, Rejected | Records date and time of receipt, receiver, quantity, unit count, mode of receipt, sender. Writes the first custody event. Starts the turnaround clock, subject to the daily cut-off time. |
| **Doubt Raised** | The laboratory is not satisfied the sample is suitable, or it does not match the declaration. The customer must be consulted before anything else happens. | Front Desk (records the customer's instruction), Unit Incharge | Accepted with Reservation, Rejected, Withdrawn, Cancelled | Blocks all testing. Creates a customer consultation task. Turnaround clock pauses. |
| **Accepted** | Fit for testing as submitted. | System (on first test start), Section Head, Unit Incharge | Conditioning, In Testing, On Hold, Cancelled, Withdrawn | Creates one Allocation per requested test. Creates the sub-samples the methods require. Computes each allocation's due date. Prints the sample label, which is now able to carry the due date and test short codes. |
| **Accepted with Reservation** | Accepted although something is wrong (short quantity, damp, damaged packing, marks unreadable, declaration mismatch), with the customer's recorded instruction to proceed. | System, Section Head, Unit Incharge | Conditioning, In Testing, On Hold, Cancelled | Same as Accepted, including printing the sample label, which is now able to carry the due date and test short codes, **plus** it sets the deviation text that must print as a caveat on every report from this sample, naming which results may be affected. |
| **Rejected** | Not accepted for testing. Terminal for testing purposes. | Store Keeper (for disposal or return) | Returned, Disposed, Reinstated (Accepted) if the customer supplies what was missing | Records the coded rejection reason and photographs. Notifies the customer. Creates no allocations. Opens a Nonconformity if the cause was the laboratory's. Marks the request lines as not chargeable, or chargeable at a handling fee only, per configuration. |
| **Conditioning** | Sub-samples are in the standard atmosphere for the mandatory pre-conditioning period. Nothing may be tested yet. | System (when the period elapses), Section Head | In Testing, On Hold, Cancelled | Records conditioning start, the required duration from the method version, and the computed earliest test time. Adds the conditioning hours to each affected allocation's due date. |
| **In Testing** | At least one allocation is in progress. | System | Testing Complete, Part Reported, On Hold, Cancelled | Nothing further; the state simply reflects the allocations. |
| **Testing Complete** | Every **current** allocation has reached Verified, Cancelled or Aborted. An allocation in Discarded or Invalidated is not current once its linked repeat allocation exists (`superseded_by_id` set); the repeat is then the current allocation for that test. Ready to report. | Report Writer, Approving Authority | Part Reported, Reported, In Testing (if an allocation is retracted), On Hold | Notifies the report writer. Starts the report-queue ageing clock. |
| **Part Reported** | A report has been issued for some allocations while others are still running. | Approving Authority, System | Reported, In Testing, On Hold | Marks the issued allocations as Reported. Leaves the rest running. |
| **Reported** | All results have been reported. | Store Keeper, Unit Incharge | In Retention, Returned, Disposed, In Testing (only if the report is withdrawn or a result is invalidated) | Sets the retention-until date from the sample-type retention policy. Triggers the invoice if not already raised. |
| **On Hold** | Work is deliberately paused. A coded reason is mandatory: *Payment*, *Awaiting customer clarification*, *Awaiting additional sample*, *Equipment out of service*, *Reagent or reference material unavailable*, *Quality-control failure under investigation*, *Nonconformity under investigation*, *Other (text)*. | Section Head, Unit Incharge, Accounts (for Payment only) | Returns to the previous state | Puts all open allocations on hold with the same reason. Stops the turnaround clock and records the hold start. On release, shifts every affected due date forward by the hold duration. |
| **In Retention** | Reported and stored for the retention period, in a recorded location. | Store Keeper | Returned, Disposed, In Testing (retest on retained material) | Records the storage location. Sets the retention-until date. Adds the sample to the retention register. |
| **Returned** | Handed back to the customer or despatched to them. Terminal. | — | — | Records the custody handover: who received it, when, and either a signature image or a despatch reference. |
| **Disposed** | Destroyed or otherwise disposed of, under authority. Terminal. Disposal modes include *Consumed in testing*, *Disposed as per protocol*, *Destroyed*, *Unclaimed and disposed*. | — | — | Records the disposal mode, date, authoriser and, where required, a witness. Writes the disposal register entry. |
| **Withdrawn** | The customer withdrew the request before testing progressed. Terminal for testing. | Store Keeper | Returned, Disposed, Reinstated (Accepted) | Cancels all open allocations. Bills only the allocations that were already past Result Entered. Records the customer's written request as an attachment. |
| **Cancelled** | Cancelled by the laboratory (duplicate registration, request cancelled, wrong entry). Terminal for testing. | Unit Incharge (to reinstate) | Reinstated (Accepted), Returned, Disposed | Cancels all open allocations. Keeps the sample number, which is never reused. Requires a coded reason. |

### 9.2 Table B — Test Allocation states

| State | Meaning in plain English | Who can move it out | Allowed next states | What the system does automatically on entry |
|---|---|---|---|---|
| **Pending** | Created, waiting to be assigned to a tester. | Section Head, Unit Incharge, System (WF-74) | Allocated, On Hold, Subcontracted, Cancelled, Discarded | Freezes a copy of the method version, replicate counts, standard turnaround and price. Computes the due date, including any conditioning hours. |
| **Allocated** | Assigned to a named tester, with a named instrument. | Assigned Tester, Section Head, Unit Incharge, System (WF-74) | In Test, Allocated (reassigned), Awaiting Conditioning, On Hold, Subcontracted, Cancelled, Aborted, Discarded | Notifies the tester. Adds the allocation to the tester's queue and, if applicable, to a worksheet. |
| **Awaiting Conditioning** | The instrument and tester are ready, but the specimen has not finished its mandatory conditioning. | System (when the period elapses, or under WF-74), Section Head, Unit Incharge | In Test, On Hold, Cancelled, Discarded | Shows the earliest permitted start time. Blocks the Start action until then. |
| **In Test** | Being tested. Readings are being entered. | Assigned Tester, Section Head, Unit Incharge, System (WF-74) | Result Entered, On Hold, Aborted, Allocated (reassigned with reason), Cancelled, Discarded | Records the actual start time. Records the consumption of any reagent or reference-material lot. Records ambient temperature and humidity. |
| **Result Entered** | The tester has submitted the readings and the computed results. The tester can no longer change them. | Verifier, Section Head, Unit Incharge, System (WF-74) | Under Verification, In Test (retracted by the tester's supervisor with a reason), On Hold, Discarded | Runs all calculations. Compares against the specification set. Records the submission time and the submitting person. Starts the verification-queue ageing clock. |
| **Under Verification** | A verifier has picked it up and is checking it. | Verifier, Unit Incharge, System (WF-74) | Verified, In Test (sent back), Under Verification (second level), On Hold, Discarded | Locks the record to that verifier so two people do not verify the same allocation. |
| **Verified** | The numbers have been checked and passed by a competent person. Ready to be reported. | Approving Authority (at Dharmavaram, the Unit Incharge — Part A 4.1), System (WF-74) | Reported, In Test (retracted before reporting, with reason), Discarded | Writes the verification record with the verifier's identity and an electronic signature. Makes the allocation available to the report compiler. |
| **Reported** | Included in an issued report. | Unit Incharge | Invalidated | Links to the report. Marks the allocation as billable. |
| **Discarded** | The result is technically valid on its own but must be thrown away because another result invalidated it — most importantly the IS 15090 rule that if the conditioned-size test differs from the size marked on the bales by more than 7 % either way, **all** other tests are discarded and every test, including the conditioned-size test, is repeated. | — | (terminal; a repeat allocation is created) | Records the discard reason and the triggering allocation. Creates a repeat allocation in Pending, linked as a retest of this one. Does **not** re-bill the customer. |
| **Invalidated** | The reported result has been found unsound after issue. | — | (terminal; a repeat allocation is created) | Requires that the report be withdrawn or superseded first. Opens a Nonconformity. Creates a repeat allocation. Records the customer notification. |
| **On Hold** | Deliberately paused, with a coded reason (same list as the Sample states). | Section Head, Unit Incharge, Accounts (Payment only) | Returns to the previous state | Stops this allocation's turnaround clock. On release, shifts its due date forward by the hold duration. |
| **Withheld** | Release is blocked because something may have affected the result — a quality-control breach in the run, an instrument found out of calibration, a suspect consumable batch, a superseded formula version, or an environmental excursion. The work itself is not paused; only verification and report issue are barred, until a named authorised person records a disposition. Entered from **any** state before Reported, including Verified and results already sitting in a draft or awaiting authorisation. | The named authorised person who records the disposition, Unit Incharge | Returns to the state held immediately before (see WF-91) | Records the withholding cause, the triggering record (quality-control run, instrument, batch, method version or environmental log) and the person. Blocks verification and report issue and shows the reason on both queues. Stops this allocation's turnaround clock. |
| **Subcontracted** | Being tested by another laboratory or another CSB unit. | Front Desk (on receipt of the external result), Unit Incharge | Result Entered, Aborted, Cancelled | Requires a recorded customer notification and the customer's approval before the state may be entered. Records the external laboratory and, where relevant, its accreditation reference. Flags the allocation so the report identifies the external provider. |
| **Aborted** | The test could not be completed — sample insufficient, specimen destroyed in preparation, method not achievable, equipment failed irrecoverably. | Unit Incharge (to create a repeat) | (terminal) | Requires a coded reason. Opens a Nonconformity if the cause was the laboratory's. Marks the allocation as not chargeable where the cause was the laboratory's, and chargeable where the customer's material was at fault, per configuration. |
| **Cancelled** | Removed because the customer withdrew it or the request was amended. | Unit Incharge (to reinstate) | Pending (reinstated) | Requires a reason. Removes the line from any draft invoice. Keeps the allocation number, which is never reused. |

### 9.3 Every unhappy path, and where it lives

| The situation | Where it is handled |
|---|---|
| Sample rejected at receipt | Sample state **Rejected**, coded reason, photographs, customer notified, Nonconformity if lab-caused |
| Sample damaged in transit | Sample **Received** → **Doubt Raised** → customer consulted → **Rejected** or **Accepted with Reservation** with a printed caveat |
| Insufficient quantity for one of the requested tests | Sample **Accepted with Reservation**; the affected Allocation goes **Aborted** with reason *sample insufficient*; other allocations proceed normally |
| Insufficient quantity for all tests | Sample **Rejected**, reason *quantity below minimum*, or **On Hold** with reason *Awaiting additional sample* if the customer will send more |
| Sample does not match the declaration (variety, denier, adulteration suspected) | Sample **Doubt Raised**; the customer's instruction is recorded; if the customer says proceed, **Accepted with Reservation** and the mismatch prints on the report |
| Request cancelled by the customer before testing | Sample **Withdrawn**, allocations **Cancelled**, part-billed only for allocations past Result Entered |
| Request cancelled by the customer after some tests are done | Same, and the completed allocations remain **Verified** and are billed and reported |
| On hold because payment has not arrived | **On Hold**, reason *Payment*, set by Accounts; released on receipt or by a recorded override; hold time excluded from turnaround |
| On hold awaiting clarification | **On Hold**, reason *Awaiting customer clarification*, with the customer communication logged |
| Retest requested by the customer after the report was issued | A **new** Allocation, linked to the original as a retest, separately priced, on retained material if available; the original report is untouched |
| Result sent back by the verifier | Allocation **Under Verification** → **In Test**, retest count increased by one, previous result revision archived, turnaround clock keeps running |
| Test failed and had to be repeated because of the 7 % conditioned-size rule | Affected allocations → **Discarded**; repeat allocations created automatically; certificate issued from the repeat run only |
| Instrument found out of calibration after work was done | Nonconformity → impact analysis lists every allocation and report that used it → every affected allocation not yet reported goes **Withheld** at once (WF-91) → per-allocation and per-report disposition → already-reported allocations **Invalidated** and their reports amended or replaced |
| Reagent or reference-material batch found defective or mis-stored | Same path, driven by the batch instead of the instrument: affected allocations not yet reported go **Withheld** (WF-91); reported ones follow the Invalidated route |
| Allocation reassigned to another tester | **Allocated** → **Allocated**, with reason if it had already started; the original assignee remains in the history |
| Tester not authorised for the method | Assignment refused at the point of assignment; refusal logged; override only by Unit Incharge with a reason, which opens a Nonconformity |
| Report withdrawn after issue | Report state **Withdrawn**, Nonconformity opened, customer notified, recall recorded, public verification page shows *Withdrawn*, affected allocations **Invalidated** |
| Report amended after issue | Amendment or replacement report issued, original marked **Superseded**, public verification page shows *Superseded by …* |
| Sample destroyed during testing | Sub-sample marked consumed; sample carries *destroyed in testing* so a later retest request gets an honest "insufficient sample remaining" answer |
| Sample not collected by the customer | **In Retention** past the retention date → alert to the Store Keeper → **Disposed** with mode *Unclaimed and disposed*, authorised and recorded |

### 9.4 Transition rules

**Sample transitions**

| ID | Priority | Rule | Acceptance check |
|---|---|---|---|
| **WF-31** | [MUST] | A Sample may be created only against a Test Request in state Accepted, or as a walk-in registration that immediately creates a Test Request and forces the Request Review before acceptance. | Attempt to create a sample with no request. The system creates the request shell and demands the review. |
| **WF-32** | [MUST] | **Expected → Received** requires date and time of receipt, receiver, quantity with unit of measure, number of units, mode of receipt and sender name. No label is printed on entry to Received; the label is printed on entry to Accepted or Accepted with Reservation, once allocations and their due dates exist (M3-20, M3-24). | Attempt receipt with the quantity blank. Refused. Confirm no label prints for a sample in Expected or Received, and that the label prints on acceptance carrying the due date and test short codes. |
| **WF-33** | [MUST] | On entry to Received the system records a structured condition-on-receipt checklist (packing intact, seal number, wet, stained, mildewed, marks legible, quantity matches declaration) plus free text, and at least one photograph where any checklist item is adverse. | Mark "packing torn" and try to save without a photograph. Refused. |
| **WF-34** | [MUST] | **Received → Accepted** is permitted only if the deduplicated required-quantity figure for the order (M2-26) is met, and, per test, the technical minimum sample quantity on that test's Active method revision is satisfied. The minimum chargeable quantity held on the test catalogue item is a commercial figure and never drives this check (M1-29). | Receive 10 skeins against a full BIS grading order; Accept is available. Receive 3 skeins; Accept is unavailable, and only Accepted with Reservation, Doubt Raised or Rejected are offered. |
| **WF-35** | [MUST] | **Received → Accepted with Reservation** requires a coded deviation, a free-text description, and the identification of which requested tests may be affected. That text is stored on the sample and printed as a caveat on every report drawn from it. | Accept with reservation, then issue the report. The caveat appears verbatim and names the affected tests. |
| **WF-36** | [MUST] | **Received → Doubt Raised** blocks the creation of allocations. Leaving Doubt Raised requires a customer consultation record containing the date, channel, person spoken to, the substance of the discussion and the customer's instruction. | Attempt to assign work to a sample in Doubt Raised. Refused. Attempt to leave Doubt Raised with no consultation record. Refused. |
| **WF-37** | [MUST] | **Received → Rejected** requires a reason from a controlled list (quantity below minimum, packing damaged, seal broken, sample wet, sample contaminated, marks not identifiable, does not match declaration, unsafe, other) plus free text, and records the customer notification. | Reject with a blank reason. Refused. After rejection, the notification record exists with a timestamp. |
| **WF-38** | [MUST] | On entry to Accepted or Accepted with Reservation the system creates exactly one Allocation per requested test for that sample, and the sub-samples specified by each method version. | Accept a sample against 4 tests. 4 allocations and the correct sub-samples appear without further action. |
| **WF-39** | [MUST] | Where any method version on the sample specifies pre-conditioning, the sample enters **Conditioning** and its affected allocations enter **Awaiting Conditioning**. Conditioning start time and required duration are recorded, and the required duration is added to the due dates. | Accept a sample requiring 24 h conditioning. The due date is 24 h later than for an identical sample with no conditioning requirement. |
| **WF-40** | [MUST] | **On Hold** requires a reason code. Entering On Hold cascades to all open allocations and stops the turnaround clock; releasing it restores each allocation to its previous state and shifts each due date forward by the hold duration to the minute. | Hold for 2 working days, release, and confirm each affected due date moved by exactly 2 working days. |
| **WF-41** | [MUST] | Only Accounts may set or clear the hold reason *Payment*. Only Unit Incharge may override a payment hold, and the override is recorded with a reason and appears in a monthly exception report. | Attempt to clear a payment hold as Section Head. Refused. Override as Unit Incharge and find it in the exception report. |
| **WF-42** | [MUST] | **Reported** is entered automatically when every **current** allocation on the sample is Reported, Cancelled or Aborted, where Discarded and Invalidated allocations whose repeat exists are excluded. It cannot be set by hand. | There is no button that sets a sample to Reported. Take a sample whose four allocations were discarded under WF-74 and whose four repeats are all Reported: the sample reaches Reported, sets the retention date and raises the invoice. |
| **WF-43** | [MUST] | On entry to Reported the system sets the retention-until date from the sample type's retention policy and the sample appears in the retention register. | Report a raw silk sample. Its retention-until date matches the policy for raw silk. |
| **WF-44** | [MUST] | **In Retention → Disposed** requires that today is on or after the retention-until date, **and** a disposal authorisation by the Unit Incharge. Early disposal requires a separate recorded authorisation with a reason. | Attempt disposal one day early. Refused unless the early-disposal authorisation is given. |
| **WF-45** | [MUST] | **Returned** requires the receiver's name and either a captured signature or a despatch reference. | Attempt to mark Returned with neither. Refused. |
| **WF-46** | [MUST] | **Withdrawn** requires the customer's written request to be attached. All open allocations are cancelled. Allocations already past Result Entered remain and are billed. | Withdraw a sample where one of four tests is already verified. That one is billed and reported; the other three are cancelled. |
| **WF-47** | [MUST] | **Cancelled** and **Withdrawn** keep the sample number. The number is never reused, and the record remains searchable and printable. | Cancel a sample, then create a new one. The new number is the next in sequence, not the cancelled one. |
| **WF-48** | [MUST] | **Reinstate** (Cancelled or Withdrawn → Accepted) is allowed only if the physical sample is still in the laboratory's custody, and it creates fresh allocations with fresh due dates while preserving the cancelled ones in history. | Reinstate a sample already marked Disposed. Refused. Reinstate one in retention. New allocations appear; the old cancelled ones remain visible. |
| **WF-49** | [MUST] | Every state change on a Sample writes a state-history row containing from-state, to-state, event, actor, server timestamp, duration in the previous state and reason code where one applies. | Move a sample through six states and print its history. All six rows are present, in order, with durations. |
| **WF-50** | [MUST] | Every physical movement of a Sample or Sub-sample writes a custody event: received, moved, issued to tester, returned to store, sub-divided, consumed, retained, returned to customer, disposed — each with from-party, to-party, location, timestamp and actor. Where the test is flagged batch-custody, the issue-to-bench and return-from-bench events for all samples on one worksheet may be written by a single confirmation action per M4-36. The per-sample trail printed by M4-27 must still show both hops for every sample. | Print the custody trail for one sample. Every physical hop appears, including issue to and return from the bench. Issue a batch-custody worksheet with one confirmation action, then print the trail for one sample on it. Both hops are present on that sample's own trail. |
| **WF-51** | [SHOULD] | The turnaround clock starts at **sample acceptance**, not at request date and not at receipt. Where acceptance happens after the configured daily cut-off time, the clock starts at the next working day's opening time. | Accept a sample at 17:50 with a 17:00 cut-off. The clock starts the next working morning. |

**Allocation transitions**

| ID | Priority | Rule | Acceptance check |
|---|---|---|---|
| **WF-61** | [MUST] | On creation, an Allocation freezes the method version identifier, the replicate counts, the standard turnaround, the specification set and the unit price. Later changes to the master data do not alter existing allocations. | Change the price on the rate card. An allocation created yesterday still shows yesterday's price. |
| **WF-62** | [MUST] | **Pending → Allocated** is refused unless the proposed assignee holds a valid Competency to *perform* that method version on the date of assignment. | Assign to an unauthorised tester. Refused, and the refusal is logged. |
| **WF-63** | [MUST] | **Pending → Allocated** is refused unless the selected instrument is In Service and its calibration and any required intermediate check are valid on the planned test date. | Select an instrument whose calibration expires tomorrow for work planned next week. Refused. |
| **WF-64** | [MUST] | Where WF-62 or WF-63 blocks an assignment, only the Unit Incharge may override, with a mandatory reason, and the override automatically opens a Nonconformity. | Override WF-63. A Nonconformity appears, linked to the allocation and the instrument. |
| **WF-65** | [MUST] | **Allocated → In Test** is refused while the linked sub-sample's conditioning period has not elapsed. | Start a conditioning-dependent test 4 h after conditioning began, against a 24 h requirement. Refused, with the earliest permitted time shown. |
| **WF-66** | [MUST] | **Allocated → Allocated** (reassignment) after the allocation has entered In Test requires a reason. The original assignee stays in the history and their readings remain attributed to them. | Reassign a started allocation. The reason is demanded and the original readings still show the first tester's name. |
| **WF-67** | [MUST] | Every reading entered in In Test records the instrument used, the entry mode (manual, file import, instrument capture, calculated), the observation timestamp taken from the server, and the person who entered it. | Enter one reading and inspect it. All four are populated without the tester typing them. |
| **WF-68** | [MUST] | Where the method version requires a reagent, chemical or reference material, the allocation cannot leave In Test without at least one recorded consumable lot. | Submit a chemical test with no lot recorded. Refused. |
| **WF-69** | [MUST] | Where the method version specifies environmental conditions, the temperature and relative humidity at the time of test are recorded against the allocation or its worksheet, together with the source (which sensor or which log entry). | Submit a physical test with no environment recorded. Refused. |
| **WF-70** | [MUST] | A Test Allocation cannot enter **Result Entered** unless every mandatory parameter has at least the required number of readings for that method version, every instrument recorded against those readings was within calibration validity on the observation date of each reading, and every consumable or reference-material lot recorded was unexpired on that observation date. | Attempt submission with one parameter short of its required reading count. Refused, naming the parameter and the shortfall. |
| **WF-71** | [MUST] | On entry to Result Entered the system computes every derived result using the formula version recorded on the method version, applies the rounding rule and the number of decimals, and evaluates the specification set to give a verdict and, where applicable, a grade. | Enter the lab's own historical worked example. Every computed figure matches, including rounding. |
| **WF-72** | [MUST] | Once Result Entered, the tester cannot change a reading or a result. A change requires the supervisor to retract the allocation to In Test with a reason; the previous result values are archived as a revision. | Attempt to edit after submission. No edit control is available. Retract, change one value, and confirm both values appear in the result revision history with the reason. |
| **WF-73** | [MUST] | Grade is computed, never typed. The grading engine reads the results against the dated, category-specific classification tables of the selected specification set, takes the worst major-test grade, then lowers it by the auxiliary class differences, applying the capping rule. | Enter a set of results whose published grade is known. The engine produces the same grade and shows the intermediate provisional grade and each degradation step. |
| **WF-74** | [MUST] | Where the specification set is BIS and the conditioned-size result differs from the declared size marked on the bales by more than 7 % either way, the system discards every other allocation on that sample, creates repeat allocations for all of them including conditioned size, and prevents the certificate being issued from the discarded run. | Enter a conditioned size 9 % away from the declared size. All sibling allocations move to Discarded, repeats are created, and the report compiler refuses the discarded results. |
| **WF-75** | [MUST] | **Result Entered → Under Verification** locks the allocation to one verifier. A second verifier attempting to pick it up is told who holds it. | Two verifiers open the same allocation. The second is refused with the first verifier's name. |
| **WF-76** | [MUST] | The verifier must hold a valid Competency to *verify* that method version on the verification date, and, unless single-analyst mode is configured, must not be the person who submitted the result. | Attempt self-verification. Refused. Attempt verification by someone with no verify competency. Refused. |
| **WF-77** | [MUST] | **Under Verification → In Test** (send back) requires a reason from a controlled list (calculation error, transcription error, insufficient replicates, reading outside plausible range, environment out of band, equipment or reagent issue, method deviation, needs repeat) plus free text. The retest count increases by one. The turnaround clock does **not** reset. | Send back an allocation. Its retest count becomes 1, its due date is unchanged, and the tester is notified with the reason. |
| **WF-78** | [MUST] | **Under Verification → Verified** writes a verification record with the verifier's identity, role, server timestamp and an electronic signature bound to the verified content. | Verify, then inspect the record. All four are present. |
| **WF-79** | [SHOULD] | Where the section is configured for two-level verification, a second verification at level 2 is required before Verified is reached, and the level-2 verifier must be different from the level-1 verifier. | Turn on two-level verification. One verification alone does not reach Verified. |
| **WF-80** | [MUST] | **Verified → In Test** (retract) is permitted only while the allocation has not been reported, requires Unit Incharge authority and a reason, and archives the verified result as a revision. Where the allocation appears on any report not yet Issued, the retraction automatically returns that report to Draft, marks its snapshot stale so it must be recompiled before it can be submitted for authorisation again, names the report number to the retracting user, and notifies the report writer and the signatory. This reuses the existing send-back transition from Pending approval to Draft; no new allocation state is needed. | Retract a verified but unreported allocation. Allowed with reason. Retract a reported one. Refused. Compile a draft covering a verified allocation, submit it for authorisation, then retract that allocation. The report drops back to Draft with its snapshot marked stale, the signatory is notified, and authorisation is refused until the report is recompiled. |
| **WF-81** | [MUST] | **Verified → Reported** happens only as a consequence of a report reaching Issued. It cannot be set directly. | There is no control that marks an allocation Reported. |
| **WF-82** | [MUST] | **Reported → Invalidated** requires that the covering report has first been withdrawn or superseded. On entry, a Nonconformity is opened and a repeat allocation is created, linked to the invalidated one. | Attempt to invalidate while the report is still Valid. Refused, with the instruction to withdraw or supersede first. |
| **WF-83** | [MUST] | **→ Subcontracted** requires a recorded customer notification and the customer's recorded approval, with date and evidence, before the state may be entered. The allocation is flagged so that the report identifies the external provider. | Attempt to subcontract without the approval record. Refused. After subcontracting, the issued report names the external provider against that parameter. |
| **WF-84** | [MUST] | **→ Aborted** requires a coded reason and a chargeability decision. Where the reason is on the configured "laboratory at fault" list, the allocation is automatically marked not chargeable and a Nonconformity is opened. | Abort for *specimen destroyed in preparation — operator error*. The line disappears from the invoice and a Nonconformity appears. |
| **WF-85** | [MUST] | **→ Cancelled** removes the allocation from any draft invoice, requires a reason, and keeps the allocation number, which is never reused. | Cancel an allocation on a draft invoice. The line is removed and the number is not reissued. |
| **WF-86** | [MUST] | A customer-requested retest after a report has been issued creates a **new** allocation linked to the original as a retest, separately priced, and does not alter the original allocation or its report. | Raise a customer retest. Two allocations exist, both visible, with the retest link, and the retest appears as a separate invoice line. |
| **WF-87** | [MUST] | A quality-control failure in a run (control chart breach, duplicate outside limits, check-standard outside limits) automatically moves every allocation in that run to the **Withheld** state of Table B, which blocks release until a named authorised person records a disposition (M15-04, and WF-91 for the other causes). | Fail the check weight on a worksheet. Every allocation on it becomes Withheld and unreleasable until dispositioned. |
| **WF-88** | [MUST] | Every state change on an Allocation writes a state-history row with from-state, to-state, event, actor, server timestamp, duration in the previous state and reason code where one applies. All turnaround and bottleneck reporting reads from this history, not from scattered timestamp columns. | Print the bottleneck report. Average time in each state is derived from the history table. |
| **WF-89** | [MUST] | Escalation notices are generated from the due date and the allocation state: not allocated at 25 % of turnaround elapsed; not started at 50 %; not submitted at 80 %; in the verification queue beyond one working day; in the report queue beyond one working day; overdue. Each notice is sent once per threshold, not repeatedly. | Let an allocation age past 80 %. Exactly one at-risk notice is produced, addressed to the tester and the Section Head. |
| **WF-90** | [SHOULD] | The system reports First-Time-Right percentage — allocations verified with a retest count of zero, divided by allocations verified — per tester, per test and per month. | Send back one of ten allocations. First-Time-Right shows 90 %. |
| **WF-91** | [MUST] | **Withheld** is a release block, not a pause in the work, and it is entered automatically. An allocation in any state before Reported may enter **Withheld** — in addition to the next states listed against that state in Table B — on any of these causes: a quality-control breach in its run (WF-87, M15-04); an out-of-calibration impact analysis that names it (M11-24(g)); a consumable-batch impact analysis that names it (M12-12); or an environmental excursion against the method's stated requirement. Results already Verified, and results already sitting on a draft report or on a report awaiting authorisation, are included. While Withheld, verification and report issue are both refused and the cause is shown on the verification and report queues. The turnaround clock is stopped. On a recorded disposition by a named authorised person the allocation returns to the state it held immediately before, and its due date shifts forward by the withheld duration. | Open an out-of-calibration impact analysis on a balance used by a verified but unreported allocation. That allocation becomes Withheld, verification and issue are refused with the instrument and the suspect-from date named, and its clock stops. Record the disposition; the allocation returns to Verified and its due date has moved forward by the withheld duration. |

**OPEN-Q7:** What retention period applies to each sample type, and what is the default disposition — return to customer, retain then dispose, or dispose immediately? — *Recommended default:* raw silk and twisted silk retained 3 months then disposed; cocoons disposed immediately after test (perishable); fabric and zari retained 6 months; water and chemical samples disposed after test. Confirm against the unit's quality manual and against any scheme-specific requirement before go-live.

**OPEN-Q8:** Which abort and rejection reasons are chargeable to the customer, and which are not? — *Recommended default:* material-related causes (insufficient quantity, sample not conforming to declaration, sample unusable as submitted) are chargeable at a handling fee if the sample was already registered; laboratory-caused failures are not chargeable. A waiver above a configured amount requires the Unit Incharge's recorded approval.

**OPEN-Q9:** Is the daily cut-off time for starting the turnaround clock the same as the Tatkal 11:00 booking cut-off, or different? — *Recommended default:* two separate configured times — a turnaround cut-off (suggest 16:00) and the Tatkal booking cut-off (11:00).

---

## 10. Numbering schemes

Every number the system issues follows one pattern family so that a person can read a number and know what it is:

```
<UNIT>/<DOC>/<FY>/<SERIAL>          for most documents
<UNIT>/<D>/<FY4>/<SERIAL>           for GST documents, which are limited to
                                    16 characters in total
```

- **UNIT** — the three-letter unit code. `DVM` for Dharmavaram. Present on every number so that a consolidated CSTRI-level register never has two records with the same number.
- **DOC** — a short document code, so the number is self-describing.
- **FY** — the Indian financial year, 1 April to 31 March, written **`2026-27`** in full and compressed to **`2627`** where character length is constrained. Only five series are length-constrained — invoice, bill of supply, advance receipt voucher, refund voucher and credit note. Every other series writes the year in full, including in worked examples.
- **SERIAL** — a zero-padded running number.

### 10.1 The series

| Series name | Format | Example | Reset rule | Who can see it | Notes |
|---|---|---|---|---|---|
| **Customer code** | `C-<5>` | `C-00417` | Never resets | Front Desk, Accounts, Section Head, Unit Incharge. **Not** the Tester | Never printed on a tester's worksheet or sample label. |
| **Enquiry number** | `DVM/ENQ/2026-27/<4>` | `DVM/ENQ/2026-27/0042` | Financial year | Front Desk, Section Head, Unit Incharge | Gaps permitted. Not a statutory record. |
| **Quotation number** | `DVM/QTN/2026-27/<4>` + `/R<n>` for revisions | `DVM/QTN/2026-27/0031/R1` | Financial year | Front Desk, Accounts, Unit Incharge | Each revision is a new document with the same base number and an incremented revision suffix. Superseded revisions are retained. |
| **Test Request number** | `DVM/TRF/2026-27/<5>` + `/R<n>` | `DVM/TRF/2026-27/00417/R1` | Financial year | Front Desk, Accounts, Section Head, Unit Incharge. **Not** the Tester | Amending an accepted request creates revision R1, which triggers a fresh Request Review. |
| **Sample number** *(the laboratory reference number the tester sees)* | `DVM/2026-27/<TYPE>/<5>` | `DVM/2026-27/RS/01188` | Financial year, per sample type | **Everyone, including the Tester** | This is the anonymous handle. `TYPE` is the sample-type code (RS raw silk, DS dupion, TS twisted silk, FB fabric, CC cocoon, ZR zari, WT water, CH chemical). It must contain **nothing** that identifies the customer — no initials, no district, no mark. Once allotted it is never changed, even if the customer or the test list changes. |
| **Sub-sample number** | parent sample number + `-P<3>` | `DVM/2026-27/RS/01188-P007` | Per parent sample | Everyone, including the Tester | Suffix only; the parent number is never re-derived. Three digits. One raw-silk grading sample yields 6 conditioning skeins, 10 bobbins, 40 or 80 sizing skeins and 20 seriplane panels, each of which is a sub-sample in its own right (see 8.1 and M4-14) — over 110 on one sample before any repeat. `txn_subsample.suffix VARCHAR(8)` already accommodates this. |
| **Allocation number** *(what the draft note called the Job Number)* | parent sample number + `-T<2>` | `DVM/2026-27/RS/01188-T03` | Per parent sample | Everyone, including the Tester | Derived from the sample number so a tester can read it and know which sample it belongs to without any lookup. A repeat allocation takes the next free suffix, and its lineage to the original is stored. Two digits suffice: a sample carries one allocation per requested test, and repeats under WF-74 take the next free suffix. |
| **Worksheet number** | `DVM/WS/2026-27/<5>` | `DVM/WS/2026-27/00219` | Financial year | Tester, Section Head, Verifier, Unit Incharge | Gaps permitted. |
| **Report number** | `DVM/<TYPE>/2026-27/<5>` + `/R<n>` for a replacement, `/A<n>` for an amendment | `DVM/TR/2026-27/00380`, `DVM/TR/2026-27/00380/R1`, `DVM/TR/2026-27/00380/A1` | Financial year, **separate series per report type** | Everyone; printed on the report and on every page of it | Report types: `TR` test report, `GC` grading certificate, `CM` conditioning (conditioned mass) certificate, `PE` preliminary examination record, `PS` pre-shipment certificate, `HS` HSN certificate. **Gap-free.** A cancelled report keeps its number. The conditioning (conditioned mass) certificate is report type `CM` in this series — e.g. `DVM/CM/2026-27/00007`. Per the reset rule above it has its own gap-free counter, its own prefix and its own register, separate from the `TR` test-report series (M10-01, M10-33, M10-37); it is not a second series with a different format. |
| **ULR — Unique Laboratory Report number** | Three formats, driven by the laboratory's NABL accreditation certificate format (see 10.2) | `TC115162600000042` | Running number resets on **1 January** (calendar year, not financial year) | Everyone; printed on the report | Applies **only** to reports in which every parameter is inside the accredited scope. Allotted at the moment of authorisation, never at registration. A draft report has no ULR. |
| **Conditioning job number** | `DVM/CJ/2026-27/<4>` | `DVM/CJ/2026-27/0031` | Financial year | Front Desk, Tester, Section Head, Unit Incharge | Internal work record for the lot registration. Gaps permitted. Never printed on the certificate; the certificate carries its `CM` report number, allotted at authorisation. |
| **Invoice number** | `DVM/I/<FY4>/<5>` — **exactly 16 characters** | `DVM/I/2627/00417` | Financial year, starting fresh on 1 April | Front Desk, Accounts, Unit Incharge, and the customer | **Gap-free and statutory.** Maximum 16 characters. Only letters, digits, hyphen and slash. Unique for the financial year. The serial is capped at 5 digits so the number can never overflow 16 characters. |
| **Bill of Supply number** *(exempt or nil-rated supplies)* | `DVM/B/<FY4>/<5>` — 16 characters | `DVM/B/2627/00042` | Financial year | As invoice | Same statutory rules as the invoice. |
| **Proforma / advance demand number** | `DVM/PF/2026-27/<4>` | `DVM/PF/2026-27/0123` | Financial year | Front Desk, Accounts, and the customer | Not a tax document, so no length limit. Never posts to accounts. |
| **Advance Receipt Voucher number** | `DVM/R/<FY4>/<5>` — 16 characters | `DVM/R/2627/01203` | Financial year | Accounts, Unit Incharge, and the customer | **Gap-free and statutory.** Issued when money is taken in advance of the service. |
| **Refund Voucher number** | `DVM/F/<FY4>/<4>` | `DVM/F/2627/0009` | Financial year | Accounts, Unit Incharge, and the customer | **Gap-free and statutory.** Must reference the Advance Receipt Voucher it reverses; that link is a stored relationship, not a note. |
| **Credit Note number** | `DVM/C/<FY4>/<4>` | `DVM/C/2627/0011` | Financial year | Accounts, Unit Incharge, and the customer | **Gap-free and statutory.** Must reference the invoice number and date it adjusts. |
| **Money Receipt number** *(the counter receipt for cash, draft or transfer)* | `DVM/MR/2026-27/<5>` | `DVM/MR/2026-27/00902` | Financial year | Accounts, Front Desk, Unit Incharge, and the customer | **Gap-free.** This is the government money receipt and is a different document from the tax invoice. Its mode-specific references (draft number, transaction reference, unique transaction reference, government challan reference) are fields on it, not part of its number. |
| **Equipment identifier** | `DVM/EQ/<3>` | `DVM/EQ/014` | Never resets | Everyone; printed on the physical label on the instrument | Never reused, even after an instrument is condemned. |
| **Calibration record reference** | `DVM/CAL/2026-27/<4>` | `DVM/CAL/2026-27/0044` | Financial year | Everyone | The **external** calibrating laboratory's certificate number is stored separately and verbatim, exactly as printed on their certificate. |
| **Consumable lot identifier** | `DVM/LOT/2026-27/<4>` | `DVM/LOT/2026-27/0156` | Financial year | Tester, Store Keeper, Section Head, Unit Incharge | The **supplier's** lot or batch number is stored separately and verbatim; the internal identifier exists because supplier lot numbers collide across suppliers. |
| **Complaint number** | `DVM/CMP/2026-27/<3>` | `DVM/CMP/2026-27/007` | Financial year | Front Desk, Quality, Unit Incharge | Gap-free; a complaint closed as out of scope keeps its number. |
| **Nonconformity number** | `DVM/NCR/2026-27/<3>` | `DVM/NCR/2026-27/012` | Financial year | Quality, Section Head, Unit Incharge | Gap-free. |

### 10.2 The ULR format in detail

The Unique Laboratory Report number is **in addition to** the laboratory's own report number, not a replacement for it. Both print on the report. The format depends on the format of the laboratory's NABL accreditation certificate number. All three forms below must be supported, because the accreditation system is mid-transition.

| Certificate format held | ULR structure | Total length | Worked example |
|---|---|---|---|
| **New format** `NABLFMMYYSCXXXXX` | `NABL` + field letter + month of grant (MM) + year of grant (YY) + two-letter State code + 5-digit certificate serial + **year of this report (YY)** + **8-digit running number** | 26 characters | Certificate `NABLT0626MP20001`, first report of 2026 → `NABLT0626MP200012600000001` |
| **Legacy 5-digit** `TC-XXXXX` | `TC` + 5-digit serial (hyphen dropped) + year of report (YY) + 8-digit running number | 17 characters | Certificate `TC-11516`, report 42 of 2026 → `TC115162600000042` |
| **Legacy 4-digit** `TC-XXXX` / `CC-XXXX` / `RC-XXXX` | First letter (`T`, `C` or `R`) + `C` + 4-digit serial + year of report (YY) + 8-digit running number | 16 characters | Certificate `TC-4779`, report 42 of 2026 → `TC47792600000042` |

In the field-letter position of the new format: `T` = Testing, `C` = Calibration, `M` = Medical, `P` = Proficiency Testing Provider, `R` = Reference Material Producer, `B` = Biobank. The two-letter State code is `AP` for Andhra Pradesh.

Two things that older guidance contains and the current format does **not**: there is **no location digit**, and there is **no trailing `F`** flag. Any implementation copied from a pre-2026 article will be wrong.

### 10.3 Numbering rules

| ID | Priority | Rule | Acceptance check |
|---|---|---|---|
| **WF-96** | [MUST] | Every series is defined as configuration: unit, document type, financial year, prefix, document code, serial width, reset cycle and a maximum-length limit. No number format is written into program code. A series whose numbers are derived per parent record is refused if its serial width cannot accommodate the largest specimen or replicate count declared on any active method version applicable to that sample type. | Change the report number prefix in configuration. New reports use the new prefix; existing reports and all their links are unaffected. Then define a sub-sample series with a two-digit serial for a sample type whose method versions draw 80 sizing skeins. Refused, with the required width shown. |
| **WF-97** | [MUST] | A serial number is allotted **at the moment the document is committed**, by the server immediately before the business transaction commits (see DB-08), never when a user opens a blank form. | Open five blank invoice forms and abandon them. The next committed invoice takes the next number with no gap. |
| **WF-98** | [MUST] | Allotment uses a locked counter row per (unit, document type, financial year, scope). Numbers are never derived from "highest existing number plus one". | Two clerks commit a receipt at the same moment. Two consecutive numbers are issued and neither collides. |
| **WF-99** | [MUST] | The following series are **gap-free**: invoice, bill of supply, advance receipt voucher, refund voucher, credit note, money receipt, report (per type), ULR, complaint and nonconformity. Gaps are permitted in enquiry, quotation, worksheet, conditioning job, sample, sub-sample and allocation series. | Run the Series Register report for a gap-free series. Every number from 1 to the current counter is listed as Issued or Cancelled, and no number is reported Missing. |
| **WF-100** | [MUST] | A number is **never reused**. A cancelled document keeps its number, remains stored, remains searchable and remains printable, marked Cancelled. | Cancel an invoice, then raise the next. The new invoice takes the following number, not the cancelled one. |
| **WF-101** | [MUST] | There is **no delete** for any numbered document. The application's database account holds no delete permission on those tables. | Attempt a delete through the application account. Refused at the database level. |
| **WF-102** | [MUST] | A **Series Register** report exists per series, listing every number in the current financial year with its state — Issued, Cancelled or **Missing** — and a Missing entry raises an alert to the Unit Incharge. | Force a gap in a test system. The Missing row appears and an alert is raised. |
| **WF-103** | [MUST] | The financial year runs 1 April to 31 March, is labelled `2026-27`, and every year-reset series restarts at 1 on 1 April. The system creates the next year's counters automatically before 1 April. | Change the system date to 1 April. The first invoice of the new year is number 1 in the new year's series. |
| **WF-104** | [MUST] | The **ULR** running number resets on **1 January**, not 1 April, because it follows the calendar year of the report. Both reset cycles therefore exist in the same system and must not be confused. | Issue a report on 31 December and another on 1 January. The report number series continues; the ULR running number restarts at 1. |
| **WF-105** | [MUST] | Series marked as tax documents are validated at series-creation time so that the longest possible number they can produce does not exceed **16 characters**, and contain only letters, digits, hyphen and slash. The system refuses to save a non-compliant series definition. | Attempt to define an invoice series `DVM/INV/2026-27/00417` (21 characters). Refused, with the character count shown. |
| **WF-106** | [MUST] | A ULR is allotted **only** at the moment a report is authorised, and **only** if every parameter on that report is inside the accredited scope on that date. A draft report has no ULR. A report containing any out-of-scope parameter is refused a ULR and refused the accreditation symbol. | Compile a report mixing an accredited and a non-accredited parameter. The system refuses a ULR and offers to split the work into two reports. |
| **WF-107** | [MUST] | Where an amendment is issued, the ULR follows a configured laboratory policy: **reuse** the original ULR, or allot a **new** one. The chosen policy is recorded once and applied consistently. | Set the policy to reuse. Amend a report. The amendment carries the original ULR. |
| **WF-108** | [MUST] | A replacement report takes a **new** number. It never silently re-uses the number of the report it replaces. The numbering style for replacements is configurable as either a revision suffix on the original base number or a wholly new sequence number. | Replace a report. The new document has its own unique number and states which report it supersedes. |
| **WF-109** | [MUST] | The sample number, the allocation number and the sub-sample number contain nothing that identifies the customer, and the printed sample label and printed worksheet carry only these numbers. | Print a label and a worksheet. Neither contains a customer name, code, mark, district or contact. |
| **WF-110** | [MUST] | A reprint of any numbered document does not change its number. Every reprint increments a reprint counter and writes an audit entry recording who reprinted it and when. | Reprint a report three times. The reprint counter reads 3 and three audit entries exist. |
| **WF-111** | [MUST] | A person reading any number issued by the system can determine the unit, the document type and the financial year from the number alone, without opening the system. | Show ten different numbers to someone who has read only this section. They correctly name the document type of each. |
| **WF-112** | [MUST] | Where a legacy paper register series is being continued, the series may be started at a specified opening number rather than at 1, and that opening number and its authority are recorded once against the series. | Start the report series at 4213 with a recorded reason. The first system-issued report is 4214. |
| **WF-113** | [SHOULD] | Each numbered document is stored as the exact rendered file that was issued, together with a checksum of that file, so a reprint years later is byte-identical to what the customer received. | Reprint a report after a template change. The reproduced file is identical to the stored original, not re-rendered from the new template. |
| **WF-114** | [SHOULD] | Where the physical paper file for a sample or report is retained, its file number and shelf location are recorded against the record, so the paper and the electronic record can be found from each other. | Search by report number and find the paper file reference. |

**OPEN-Q10:** Does the unit maintain **separate registers and separate number series for Physical Testing and Chemical Testing** — the monthly revenue sheets count PTS, PTA, CTS and CTA separately — and if so what do those four abbreviations stand for? — *Recommended default:* build the sample series with an optional division component (`PT` / `CT`) that is switched off until confirmed, because retro-fitting a division into an existing number series is not possible. Ask the unit before the first sample is registered.

**OPEN-Q11:** Are there **existing legacy number series** in the paper registers that must be continued rather than restarted — for report numbers, money receipts and conditioning certificates in particular? What is the last number used in each? — *Recommended default:* continue every existing series from its last used number, recorded under WF-112, and start no series at 1 without written confirmation.

**OPEN-Q12 — ANSWERED.** *Question was:* is the unit itself NABL-accredited, and if so what is its accreditation certificate number and format? **Answer, confirmed against the certificate itself:** yes. The unit holds accreditation in its own right, separate from the Bengaluru laboratory. The certificate reads: legal entity **Central Silk Board**; accredited facility **Textile Testing Laboratory, Regional Silk Technological Research Station, Central Silk Technological Research Institute**, at **D. No. 25-650, Parthasaradhi Nagar, Regetipalli Road, Dharmavaram, Sri Sathya Sai, Andhra Pradesh, India**; field **Testing**; standard **ISO/IEC 17025:2017**; certificate number **NABLT0726AD18713**; issued **17/07/2026**; valid until **16/07/2030**.

Consequences, all of which are now settled rather than assumed:

- The certificate number is in the **current (2026) format**, `NABLFMMYYSCXXXXX`, not the legacy `TC-XXXXX` form. Therefore the Unique Laboratory Report number is built by **format (a) and is 26 characters**: the 16-character certificate number, then the two-digit year of the report, then an eight-digit running number restarted each calendar year. For the first report of 2026 that is `NABLT0726AD18713` + `26` + `00000001` = `NABLT0726AD187132600000001`. The unit never needs the legacy 16- or 17-character forms, though WF-107 keeps the builder configuration-driven so a future re-issue in another form costs no code change.
- Decoding the certificate number for the configuration record: `NABL` literal, `T` = Testing, `07` = month granted, `26` = year granted, `AD` = the two-letter State code as printed on this certificate, `18713` = the five-digit serial. **Note the State code is `AD`, not the `AP` that might be expected for Andhra Pradesh — take it verbatim from the certificate and never derive it.**
- The accreditation symbol and the ULR are **switched on** for this unit, subject to the per-test scope rule below.
- The **validity dates are configuration**, not constants: the symbol and ULR suppress automatically after 16/07/2030 unless renewed (M8-35).

**OPEN-Q12a — ANSWERED:** which tests are inside the accredited scope? The scope annexure to certificate `NABLT0726AD18713` has been obtained and lists **exactly seven accredited entries**, all in the discipline and group *MECHANICAL — TEXTILE MATERIALS* and all under *Permanent Testing*: Fabric / Length / IS 1954; Fabric / Mass / IS 1964; Fabric / Number of Threads Per Unit Length / IS 1963; Fabric / Percentage by Weight of Warp and Weft Yarn / IS 17208; Fabric / Width / IS 1954; **Raw Silk Yarn / Count / IS 15090 (Part 5)**; Woven Fabric / Linear Density of Yarn Removed from Fabric / IS 3442. The full table, with the rules that follow from it, is the seed data in **§M8.5** of Part C. The scope key is the **triple (material, parameter, method)** — never the test name and never the parameter alone.

Two consequences run through the whole design and are not merely reporting details. First, **most of what the unit sells is outside this scope** — grading, evenness, cohesion, twist, boil-off, tenacity, fibre identification, cocoon work and all conditioning and weight certification are absent from the annexure — so the accredited-plus-non-accredited split of M8-32 is the ordinary daily case and the non-accredited report is the common document, not the exception. Second, the one question that decides the scale of this is whether the workhorse *Limited Test* falls under scope row 6; that is now **ANSWERED**: the Unit In-Charge has confirmed the Limited Test is **Non-NABL**, and has supplied a status list marking twenty-one catalogue items — the entire current charge list — outside the accredited scope. He also confirmed that accredited and non-accredited work must go on **separate reports**. The consequence is that on the present catalogue no report carries the symbol or the Unique Laboratory Report number at all, so the plain certificate is the primary template and the accredited one is the exception path. The seeded status list and the questions it raises are in §M8.6 of Part C.

**OPEN-Q13:** Which unit code should be used in every number — `DVM`, or a code already used in CSTRI correspondence? — *Recommended default:* `DVM`, with the code held in configuration so a CSTRI-wide standard can be adopted later without changing program code.

**OPEN-Q14:** Under which GST registration does the unit raise invoices, and what is the registered address printed on them? This decides whether an Andhra Pradesh customer is an intra-State or an inter-State supply, and therefore the tax split on every invoice. — *Recommended default:* do not guess. Obtain a copy of a recent real invoice from the unit before the invoice module is built, and hold the registration as configuration with its State code, so the tax split is computed rather than ticked by a clerk.