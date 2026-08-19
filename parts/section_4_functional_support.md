## M11. Equipment and Calibration Management

**What this module is for, in plain words.** Every instrument in the laboratory that affects a test result must be under control. That means the laboratory knows what the instrument is, where it is, whether it is working, when it was last calibrated, when the next calibration is due, and which tests were done on it. The draft note called this an "asset system". It is actually two registers that happen to describe the same physical objects: a **money register** for the parent institute's asset and depreciation records, and a **measurement control register** for calibration and traceability. This module builds both and keeps them linked. The single most valuable function in the whole module is the **out-of-calibration impact analysis**: when a balance or a tensile tester is found to be wrong, the system must instantly list every result it produced since it was last known to be good, so the laboratory can decide whether any issued report has to be withdrawn.

### M11.1 Screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Equipment Register (list + search) | All staff (read), Equipment Custodian (edit) | Find any instrument; see calibration status at a glance |
| Equipment Master (add / edit) | Equipment Custodian, Lab In-Charge | Full instrument record including identity, range, location, criticality |
| Applicable Methods tab | Lab In-Charge | Link instrument to the test methods it may be used for |
| Calibration Plan (calendar + list) | Equipment Custodian | Yearly calibration programme; overdue and upcoming |
| Calibration Event (record) | Equipment Custodian | Record one calibration, upload the certificate, enter correction factors |
| Intermediate Check (record) | Tester, Equipment Custodian | Daily / weekly check against a working standard between calibrations |
| Equipment State Change | Lab In-Charge | Move instrument between in-service, maintenance, out-of-service, condemned |
| **Impact Analysis** | Lab In-Charge, Quality Manager | List every result and report produced by an instrument in a chosen date window, and disposition each |
| Breakdown / Maintenance Log | Equipment Custodian | Faults, repairs, preventive maintenance |
| Service Contract (AMC) Register | Accounts, Equipment Custodian | Annual Maintenance Contract periods, vendor, cost, renewal alerts |
| Usage Log (view) | Lab In-Charge | Which tests used which instrument, and when |
| Label Print | Equipment Custodian | Printed calibration status sticker for the instrument |
| Asset / Depreciation tab | Accounts | Fields the parent institute's asset register and CloudZoo ERP need |
| Reference Standards Register | Equipment Custodian | Sub-register for standard weights, grey scales, standard photographs, reference fabrics |

### M11.2 Requirements

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M11-01 | [MUST] | The system shall hold one record per instrument with a permanent, unique **Equipment ID** that is never reused, never edited after creation, and printed on the physical instrument label. | Create an instrument; the Equipment ID field is read-only after save, and an attempt to create a second instrument with the same ID is refused. |
| M11-02 | [MUST] | The equipment record shall carry all fields listed in M11.3 as mandatory or optional exactly as marked. | Saving with any mandatory field blank is refused with a message naming the field. |
| M11-03 | [MUST] | The system shall record **measurement range** and **least count / resolution** for every measuring instrument, and shall warn (not block) when a test method requires a range the instrument does not cover. The warning shall be **acknowledged by a named person** before the link is saved, and the acknowledgement — who, when and the reason given — shall be stored against the link and printed on the Equipment Register, in the same way M6-12 requires a plausibility warning to be confirmed and recorded. Enforcement against the value actually measured is at the point of use, under M11-19(e). | Link a balance with range 0–200 g to a method requiring 0–1000 g; the system shows a warning on linking, the link cannot be saved until a named person acknowledges it with a reason, and the acknowledgement appears on the Equipment Register. |
| M11-04 | [MUST] | Each instrument shall carry a **criticality** flag: *Critical to result* / *Supporting* / *Not result-affecting*. Only instruments marked *Critical to result* or *Supporting* may be selected on a result-entry screen. | A *Not result-affecting* instrument does not appear in the equipment picker on the result screen. |
| M11-05 | [MUST] | Each instrument shall carry a **Requires calibration: Yes / No** flag, and where it is *No*, a mandatory free-text reason. | Set *Requires calibration = No*; save is refused until a reason is entered; the reason prints on the Equipment Register. |
| M11-06 | [MUST] | The system shall link an instrument to one or more **test method versions** it is approved for (see M14). Only linked, in-service, in-calibration instruments shall be selectable when a tester enters a result for that method. | Enter a result for method X; the equipment picker lists only instruments linked to X. |
| M11-07 | [MUST] | The system shall maintain a **calibration schedule** per instrument: calibration interval in months, last calibration date, next due date computed as last date plus interval. Interval changes shall require a reason and an approver, and the previous interval shall remain visible in history. | Change an interval from 12 to 6 months; save is refused without a reason; the history tab shows both intervals with dates and the approver's name. |
| M11-08 | [MUST] | The system shall record each **calibration event** with the fields in M11.4, distinguishing **External** (done by an outside agency) from **Internal** (done by the laboratory itself), and shall require, for external calibrations, the calibrating agency's name, its accreditation certificate number and the specific scope line relied on. | Record an external calibration without the agency accreditation number; save is refused. |
| M11-09 | [MUST] | The system shall store the **calibration certificate file** (PDF or scanned image) against the calibration event, and shall show a warning on the Equipment Register for any calibration event with no certificate attached. | Record a calibration with no file; the register row shows "Certificate missing". |
| M11-10 | [MUST] | The system shall record the **traceability route** of each calibration: *Tier 1 — National Metrology Institute (National Physical Laboratory, India, or an equivalent under the international mutual-recognition arrangement)*; *Tier 2 — an accredited calibration laboratory whose accredited scope covers this calibration*; *Tier 3 — a calibration laboratory meeting ISO/IEC 17025 without accreditation for this line*. Tier 3 shall require a written justification. | Select Tier 3; save is refused until the justification field is filled; the justification prints on the traceability report. |
| M11-11 | [MUST] | The system shall print, on demand, a **traceability chain sheet** for any instrument: instrument → calibration certificate → calibrating laboratory (name, accreditation number, validity) → its reference standard → national standard, each link with its stated measurement uncertainty where available. | Open any calibrated instrument, click "Traceability chain", get a one-page PDF. |
| M11-12 | [MUST] | The system shall record the **calibration result** as *Pass* / *Pass with correction* / *Fail* / *Limited use*, together with the acceptance criteria used and the observed deviations. | Record a Fail; the system immediately offers to start an Impact Analysis (M11-24) and to move the instrument out of service. |
| M11-13 | [MUST] | Where a calibration certificate gives **correction factors or reference values**, the system shall store them as dated, versioned data attached to that calibration event, and shall make them available to the calculation engine for results observed within that calibration's validity period. | Enter a correction factor of +0.02 g valid 01-Apr-2026 to 31-Mar-2027; a result observed 10-May-2026 uses +0.02, and a result observed 10-May-2027 does not. |
| M11-14 | [SHOULD] | The system shall prevent a user from editing a stored correction factor. Corrections are made by voiding the calibration event (with reason) and recording a replacement. | Attempt to edit a correction factor; the field is read-only and the screen offers "Void and re-record". |
| M11-15 | [MUST] | The system shall send **calibration due alerts** at configurable lead times, default 60, 30, 15, 7 and 0 days before the due date, to the Equipment Custodian and the Lab In-Charge. Lead times shall be a configuration setting, not code. | Change lead times to 45 and 10 days in configuration; the next alert cycle uses the new values (see M19). |
| M11-16 | [MUST] | The system shall support **intermediate checks** between calibrations, with a defined check frequency, a working standard or reference material used, acceptance criteria, and a Pass / Fail outcome. An overdue intermediate check shall be treated the same as an overdue calibration. | Set a daily balance check; miss a day; the instrument shows "Intermediate check overdue" and result entry is blocked as per M11-19. |
| M11-17 | [MUST] | A **failed intermediate check** shall automatically offer to move the instrument out of service and start an Impact Analysis from the date of the last passed check. | Record a failed daily balance check; the system proposes `suspect_from` = date of last passed check. |
| M11-18 | [MUST] | Each instrument shall have a **state** from the set in M11.5, changed only through the recorded state-change function with actor, date/time and reason. | Change a state without a reason; save is refused. Every state change appears in the instrument's history. |
| M11-19 | [MUST] | The system shall **block** entry or submission of a test result against an instrument that, at the date and time of observation, was (a) not *In service*, or (b) past its calibration due date, or (c) past its intermediate-check due date, or (d) not linked to the method being performed, or (e) the value observed, for the parameter being measured, falls outside the measurement range for which that instrument's calibration in force at the date of observation is valid, including any range excluded by a Limited-use limitation. | Attempt to submit a result naming an instrument whose calibration expired the previous day; submission is refused with the reason shown. Record 400 g on a balance whose calibration covers 0–200 g; submission is refused, naming the calibrated range and the certificate relied on. |
| M11-20 | [MUST] | The block in M11-19 shall be overridable **only by the Approving Authority**, with a mandatory reason from the override reason list, and the override shall automatically raise a Nonconformity record (M15) and be flagged on the resulting report for the Approving Authority's attention. The Section Head may raise the request but may not grant it. This matches M5-06 and M6-14, which reserve the calibration and competency overrides to the same officer. | Override once; a Nonconformity record appears in M15 with a link back to the test, and the report review screen shows a red banner. Attempt the same override as the Section Head; refused and logged. |
| M11-21 | [MUST] | The system shall print an **equipment status label** containing Equipment ID, instrument name, date of last calibration, next calibration due date, and the status word (In service / Out of service). Where a Limited-use limitation is in force, the label shall also carry that limitation description, because the tester at the bench reads the sticker and not the calibration event. Label size and layout shall be configurable. | Print a label for one instrument; the printed sticker carries all five items. Print a label for an instrument carrying a Limited-use limitation; the limitation description appears on the sticker. |
| M11-22 | [MUST] | The system shall keep a **breakdown and maintenance log** per instrument covering: fault reported, date and time reported, reported by, symptom, whether the fault could have affected results, action taken, parts replaced, downtime hours, cost, engineer or vendor, date returned to service. | Log a breakdown and a repair; the instrument's downtime total updates and appears on the equipment utilisation report (M20). |
| M11-23 | [MUST] | Return of an instrument to *In service* after repair, modification or a failed calibration shall require a **re-verification record** (what was checked, against what criteria, by whom, result). Without it, the state change is refused. | Attempt to set *In service* after a repair with no re-verification record; save is refused. |
| M11-24 | [MUST] | **OUT-OF-CALIBRATION IMPACT ANALYSIS.** When a calibration fails, an intermediate check fails, a fault is reported that could affect results, or a calibration is discovered to have lapsed, the system shall provide a one-action function that: (a) takes a `suspect_from` date proposed by the system as the last known-good calibration or intermediate check and editable by the user; (b) lists **every** test, sample, worksheet, issued report and customer where that instrument was used between `suspect_from` and the date the instrument was taken out of service; (c) requires a named authorised person to disposition **each** affected test and **each** affected issued report — an issued report as *Not affected (with technical justification)* / *Retest* / *Amend report* / *Withdraw and replace*, and a test not yet reported using the M15-05 vocabulary of *Release (with technical justification)* / *Repeat the test* / *Reject and retest with fresh material*, since amending or withdrawing a report is meaningless for a test that has not been issued; (d) records the disposition, the reason, the person and the date; (e) drives customer notification and report recall records; (f) links the whole exercise to a Nonconformity record; and (g) on opening, automatically places every affected test that has not yet been reported — including results already Verified and those in draft or awaiting authorisation — into the **Withheld** state of M15-04, which blocks verification and report issue until that test is individually dispositioned, the withholding being visible on the verification and report queues with the instrument and the `suspect_from` date as the stated reason. | Record a failed calibration on a balance used in 40 tests over three weeks, 12 of which were reported. The Impact Analysis screen lists exactly those 40 tests and 12 reports; the 28 unreported tests are immediately Withheld and can be neither verified nor issued; closing the analysis is refused while any of the 40 tests or any of the 12 reports is un-dispositioned. The completed analysis prints as a single PDF. |
| M11-25 | [MUST] | The Impact Analysis result set shall be produced by a database query on a **mandatory** equipment reference stored on every result observation, not by a manual search. | Delete no data; run the analysis twice on the same window; both runs return an identical list. |
| M11-26 | [MUST] | The system shall keep an **equipment usage log**: for every result observation, the instrument used, the test, the sample, the tester and the date/time. This log shall be queryable by instrument and by date range. | Query one instrument for last month; the list matches the tests recorded against it. |
| M11-27 | [SHOULD] | The system shall hold an **Annual Maintenance Contract (AMC) / service contract register**: vendor, contract number, start date, end date, coverage (comprehensive / labour only / preventive visits only), number of preventive visits per year, visits used, annual value, renewal alert lead time (default 60 days). | Enter an AMC ending in 45 days; a renewal alert is generated. |
| M11-28 | [SHOULD] | The system shall hold **asset and depreciation fields** for the parent institute's asset register: purchase order reference, supplier, invoice number and date, capitalised cost, date put to use, funding source or scheme, asset classification, expected useful life, depreciation method and rate, accumulated depreciation, book value, physical verification date and outcome, condemnation reference. These fields shall be readable by CloudZoo ERP (see M22). | The Asset tab prints an asset card containing all listed fields; the same data is available through the integration export. |
| M11-29 | [SHOULD] | The system shall support an **annual physical verification** run: generate a verification sheet listing all instruments by location, record found / not found / found elsewhere, record shortages, and require Lab In-Charge sign-off. | Start a verification run, mark one instrument "not found", close the run; a shortage report is produced and the instrument is flagged. |
| M11-30 | [MUST] | The system shall maintain a **Reference Standards sub-register** for items whose only purpose is to check other equipment: standard weights, grey scales for colour change and staining, official standard photographs for evenness / cleanness / neatness, standard and reference fabrics, standard thermometers. Each shall carry its own recertification or replacement due date and the same alerting as instruments. | Add a set of standard weights with a 2-year recertification interval; it appears on the calibration due list. |
| M11-31 | [MUST] | The equipment record shall include **software and firmware version** where the instrument has embedded software, and a change to that version shall be a recorded event requiring a re-verification record. | Update a firmware version; the system creates an event and asks for re-verification before allowing continued use. |
| M11-32 | [SHOULD] | The system shall record **ownership** of each instrument: Owned / Leased / On loan from another unit / Customer-supplied / External. All calibration and state rules shall apply equally regardless of ownership. | Add a loaned instrument; it appears on the calibration due list like any other. |
| M11-33 | [MUST] | The equipment record shall carry the **current physical location** (building, room, bench) and every location change shall be recorded with date and actor. | Move an instrument between rooms; the history shows both locations with dates. |
| M11-34 | [SHOULD] | The system shall produce a **monthly calibration plan** and a **calibration compliance percentage** (calibrations completed on or before due date ÷ calibrations due) for the management review pack (M15). | Generate the plan for next month; it lists every instrument due, with the vendor and estimated cost. |
| M11-35 | [LATER] | The system shall import calibration certificate data (dates, results, correction factors) from a structured file supplied by a calibration agency, rather than manual entry. | Import one agency file; the calibration event is created with the source file retained as an attachment. |
| M11-36 | [MUST] | No equipment record, calibration event, intermediate check, breakdown record or impact analysis shall ever be deleted. Corrections are made by voiding with a reason; voided records remain visible marked "VOID". | Attempt a delete anywhere in this module; no delete action exists in the interface, and the database refuses deletion. |

### M11.3 Field table — Equipment Master

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Equipment ID | Short code, e.g. `DVM-BAL-001` | Yes | Permanent. Printed on label and on every result. |
| Instrument name | Text | Yes | Plain name the staff use, e.g. "Electronic balance, 0.1 mg" |
| Category | List: Balance / Oven / Winding machine / Wrap reel / Seriplane board / Serigraph or tensile tester / Cohesion tester / Twist tester / Conditioning chamber / Microscope / X-ray fluorescence unit / Colour matching cabinet / Glassware-and-apparatus / Reference standard / Other | Yes | Drives which extra fields are shown |
| Make | Text | Yes | |
| Model | Text | Yes | |
| Serial number | Text | Yes | Unique where the manufacturer supplies one |
| Manufacturer's year | Year | No | |
| Software / firmware version | Text | Conditional | Mandatory where the instrument has embedded software |
| Measurement range | Text plus numeric low/high plus unit | Conditional | Mandatory for measuring instruments |
| Least count / resolution | Numeric plus unit | Conditional | Mandatory for measuring instruments |
| Stated accuracy or maximum permissible error | Text | No | From the manufacturer's specification |
| Criticality | List: Critical to result / Supporting / Not result-affecting | Yes | See M11-04 |
| Requires calibration | Yes / No plus reason if No | Yes | See M11-05 |
| Calibration type | External / Internal / Both | Conditional | Required if Requires calibration = Yes |
| Calibration interval (months) | Number | Conditional | Required if Requires calibration = Yes |
| Intermediate check required | Yes / No | Yes | |
| Intermediate check frequency | Daily / Weekly / Monthly / Per batch / Other | Conditional | |
| Section | Link to laboratory section | Yes | |
| Location | Building / Room / Bench | Yes | |
| Custodian | Link to staff member | Yes | Person answerable for this instrument |
| Ownership | Owned / Leased / On loan / Customer-supplied / External | Yes | |
| State | See M11.5 | Yes | Set by state-change function only |
| Applicable method versions | Multi-select, links to M14 | Yes for result-affecting instruments | |
| Environmental requirement | Text | No | e.g. "must be on vibration-free bench" |
| Notes | Long text | No | |

Asset tab (see M11-28): purchase order reference, supplier, invoice number, invoice date, capitalised cost, date put to use, warranty start, warranty end, funding source or scheme name, asset class, useful life (years), depreciation method, depreciation rate, accumulated depreciation, book value as at date, last physical verification date, verification outcome, condemnation order reference, disposal date, disposal value.

### M11.4 Field table — Calibration Event

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Equipment | Link | Yes | |
| Event type | Calibration / Intermediate check / Verification after repair / Commissioning verification | Yes | |
| Calibration type | External / Internal | Yes for Calibration | |
| Date performed | Date | Yes | |
| Performed by (agency) | Text | Yes for External | |
| Agency accreditation certificate number | Text | Yes for External | |
| Agency accredited scope line relied on | Text | Yes for External | The specific parameter and range |
| Agency accreditation valid until | Date | Yes for External | System warns if expired at date performed |
| Performed by (staff member) | Link | Yes for Internal | Must be competency-authorised (M13) |
| Certificate number | Text | Yes for External | |
| Certificate file | File upload | Yes for External | See M11-09 |
| Reference standard used | Link to Reference Standards sub-register or text | Yes | |
| Traceability tier | 1 / 2 / 3 | Yes | See M11-10 |
| Tier 3 justification | Long text | Conditional | Mandatory when tier = 3 |
| Acceptance criteria applied | Text | Yes | e.g. "±0.2 mg at each test point" |
| Observed deviations | Table of point, nominal, observed, deviation, uncertainty | Yes | Free-form table permitted in v1 |
| Result | Pass / Pass with correction / Fail / Limited use | Yes | |
| Limitation description | Text | Conditional | Mandatory when result = Limited use |
| Correction factors | Table of parameter, range, correction, unit | Conditional | Mandatory when result = Pass with correction |
| Stated measurement uncertainty | Text | No | From the certificate |
| Valid from | Date | Yes | Usually the date performed |
| Valid until / next due | Date | Yes | Default = valid from + interval, editable with reason |
| Cost | Amount | No | Feeds the calibration budget report |
| Remarks | Long text | No | |

### M11.5 Equipment states and permitted transitions

| From | To | Who | Requires |
|---|---|---|---|
| (new) | Received, not commissioned | Equipment Custodian | Equipment master saved |
| Received, not commissioned | In service | Lab In-Charge | Commissioning verification record |
| In service | Under calibration | Equipment Custodian | Reason |
| In service | Under maintenance | Equipment Custodian | Fault or preventive-maintenance reference |
| In service | Out of service | Lab In-Charge | Reason; system offers Impact Analysis |
| In service | Quarantined | Lab In-Charge | Reason; used when results are doubtful but the cause is unknown |
| Under calibration | In service | Lab In-Charge | A Pass or Pass-with-correction calibration event |
| Under calibration | In service, with a recorded limitation | Lab In-Charge | A Limited-use calibration event; the limitation description (M11.4) is stored against the instrument, printed on the label per M11-21, and enforced at point of use per M11-19(e) |
| Under calibration | Out of service | Lab In-Charge | A Fail calibration event, or a Limited-use event whose limitation cannot be expressed as an enforceable range restriction; Impact Analysis opened |
| Under maintenance | In service | Lab In-Charge | Re-verification record (M11-23) |
| Out of service / Quarantined | In service | Lab In-Charge | Re-verification record and, where relevant, a closed Impact Analysis |
| Any | Condemned | Lab In-Charge | Condemnation order reference; terminal state |
| Condemned | (none) | — | Terminal. Record is retained for ever. |

*In service, with a recorded limitation* is **not a separate state**. The state remains *In service* and the limitation is a flag with a stored description, so M11-06 selectability, M11-19(a) and the M11-21 status word all keep their existing meaning. The limitation is what M11-19(e) enforces.

### M11.6 Rules and edge cases

1. **Calibration due date falls on a holiday.** The due date is not moved. The instrument is overdue from the day after the due date. If the laboratory needs breathing room, it must shorten the effective interval or use the override in M11-20, which raises a Nonconformity. The system must not silently extend a due date.
2. **A calibration is done late.** The next due date is calculated from the **actual date performed**, not from the original due date, unless the laboratory sets a configuration switch `calibration_due_from = ORIGINAL_DUE_DATE`. The default is `ACTUAL_DATE`. The gap between the original due date and the actual date is recorded and appears on the compliance report as a lapse.
3. **The instrument was overdue but nobody noticed.** This is the commonest real case. When the lapse is discovered, the system must treat it exactly like a failed calibration for the purpose of Impact Analysis: `suspect_from` defaults to the original due date, and every result produced after that date must be dispositioned.
4. **One instrument, several ranges.** A balance may be calibrated over 0–20 g and separately over 20–200 g, with different corrections. Store the correction table by range, and apply by the observed value's range. Where an observed value falls in none of the stored correction ranges, the system shall not silently apply a zero correction; the observation is blocked under M11-19(e).
5. **Ovens and conditioning chambers.** These are calibrated for temperature and, for chambers, relative humidity. They are also the source of the environmental record in M16. Both roles must be modelled: the chamber is an instrument (M11) and it is also a monitored area's controlling equipment (M16).
6. **Instruments with no digital output and no adjustment.** A seriplane inspection board, a colour matching cabinet, a wrap reel. These still need control: circumference, illumination level, condition of the standard photographs. Model them as instruments with *Requires calibration = Yes* where a measurable characteristic exists (reel circumference, illumination in lux), or as instruments with *Requires calibration = No* plus a stated reason and a periodic *verification* event.
7. **Standard photographs and grey scales wear out.** They must be in the Reference Standards sub-register with a replacement-due date. A faded neatness photograph set silently degrades every neatness result; this is exactly the kind of failure the register exists to catch.
8. **Break-glass override abuse.** If the override in M11-20 is used more than a configurable number of times per month (default 2), the Quality Manager receives an alert and the count appears in the management review pack.
9. **An instrument shared with another CSB unit.** Ownership = *On loan*. The calibration record may be held by the owning unit. The record must still exist here, with the certificate copy attached, because this unit's reports depend on it.
10. **Condemned instruments and old reports.** A condemned instrument's record, its calibration history and its usage log are retained for the full retention period (M21) because a five-year-old report may need to be defended.

**OPEN-Q1:** Which instruments at Dharmavaram are calibrated externally, by which agencies, and are those agencies accredited for the specific parameter and range? — *Recommended default:* build the register with all three traceability tiers available and no assumption about the current position; ask the Unit In-Charge for the last three calibration certificates for the balance, the oven and the tensile tester, and load them as the first records.

**OPEN-Q2:** Does the laboratory currently perform daily or weekly intermediate checks on the balances and the oven, and if so against what standard and what acceptance criterion? — *Recommended default:* configure a daily single-point balance check against a certified standard weight with an acceptance criterion of the balance's least count × 2, and an oven temperature check per working day; make the frequency and criterion configuration, not code, so the laboratory can change them without a developer.

**OPEN-Q3:** Does the parent institute's asset register need to be fed from this system, or does it already exist independently in CloudZoo ERP or on paper? — *Recommended default:* hold the asset fields in the LIMS as the working copy, export to CloudZoo ERP (M22), and treat CloudZoo ERP as the system of record for capitalised cost and depreciation once the integration is live.

---

## M12. Consumables and Reagent Stock

**What this module is for, in plain words.** Laboratory results depend on the chemicals, reference materials and consumable items used to produce them. If a reagent has expired, or a reference material has been mis-stored, the results are questionable. This module records what the laboratory holds, in what lot, from whom, with what certificate, until what date, and — the important part — **which lot was used in which test**. The settled word for one received batch of a reagent or consumable is **Consumable Lot**, short form **lot**; the supplier's own batch number is a separate field on it. That usage-link is what allows the laboratory to answer the question "a bad lot of reagent has been identified; which of our reports are affected?" in the same way M11 answers it for instruments. It also handles the ordinary stores work: stock balance, reorder alerts, physical counting, purchase indents and disposal of expired chemicals.

### M12.1 Screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Item Master | Store Keeper, Lab In-Charge | Define each item once: name, category, unit, whether lot-tracked, whether expiry-tracked |
| Goods Receipt | Store Keeper | Record arrival of a lot against a purchase order |
| Consumable Lot Register | Store Keeper, Tester (read) | Every lot with its certificate, dates, storage location and remaining quantity |
| Acceptance / Quarantine Release | Lab In-Charge | Approve an incoming lot for use after checking it against acceptance criteria |
| Issue to Test / Worksheet | Tester | Record which lot was consumed on which test, and how much |
| Stock Balance and Ledger | Store Keeper | Current quantity per lot and per item, with every movement |
| Reorder / Expiry Alerts | Store Keeper | Items below reorder level; lots expiring soon |
| Physical Stock Verification | Store Keeper, Lab In-Charge | Count sheet, variance entry, variance approval |
| Purchase Indent | Store Keeper, Lab In-Charge | Raise a request that goes to CloudZoo ERP purchasing |
| Prepared Solution Register | Tester | Solutions made up in the laboratory, with strength, preparer and validity |
| Disposal Register | Store Keeper, Lab In-Charge | Expired or rejected material disposed, with authority and method |
| Approved Supplier List | Lab In-Charge, Accounts | Supplier, items approved for, evaluation score and next re-evaluation date |
| Lot Impact Analysis | Lab In-Charge, Quality Manager | Given a suspect lot, list all tests and reports that used it |

### M12.2 Requirements

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M12-01 | [MUST] | The system shall hold an **Item Master** covering at least these categories: Chemical / reagent; Certified reference material; Reference or standard silk sample; Standard fabric; Glassware and apparatus; General consumable (labels, tags, bags, stationery, seals); Spare part. | Create one item in each category; each appears in the category filter. |
| M12-02 | [MUST] | Each item shall carry flags **Lot tracked (Yes/No)** and **Expiry tracked (Yes/No)**. Chemicals, reference materials and standard samples shall default to Yes for both. | Create a chemical; both flags default to Yes and cannot be set to No without Lab In-Charge approval and a reason. |
| M12-03 | [MUST] | For a lot-tracked item, **the consumable lot is the unit of control, not the item**. Stock quantity, expiry, certificate and usage are all held at lot level. | Receive two lots of the same reagent; the stock screen shows two separate rows with separate expiry dates and quantities. |
| M12-04 | [MUST] | The consumable lot record shall hold the fields in M12.4. | Save with a mandatory field blank; refused with the field named. |
| M12-05 | [MUST] | The system shall store the supplier's **Certificate of Analysis** or **reference material certificate** as a file against the lot, and shall show "Certificate missing" on the Consumable Lot Register where absent. | Receive a chemical without a certificate; the lot row shows the warning. |
| M12-06 | [MUST] | For a **certified reference material**, the system shall additionally store the certified value or values, the stated measurement uncertainty, the traceability statement, the period of validity, and whether the producer is accredited to ISO 17034 with its accreditation number. | Create a reference material lot; all six fields are present and printable on the lot card. |
| M12-07 | [MUST] | A newly received lot shall enter state **Quarantined** and shall not be selectable for use until a named person records **acceptance against defined criteria**. | Receive a lot; attempt to issue it to a test; the lot does not appear in the picker until accepted. |
| M12-08 | [MUST] | The system shall record **shelf life after opening** separately from the sealed expiry date, together with the **date opened**, and shall compute an effective expiry as the earlier of (sealed expiry) and (date opened + shelf life after opening). | Set a sealed expiry of Dec 2027 and a 30-day open life; record opening on 01-Jun-2026; the effective expiry becomes 01-Jul-2026. |
| M12-09 | [MUST] | **Every test activity that consumes a controlled reagent, reference material or standard sample shall record the lot actually used.** The result cannot be submitted without it where the method declares a required consumable (M14). | Submit a result for a method requiring reagent R without selecting a lot; submission refused. |
| M12-10 | [MUST] | The system shall **block** the use of a lot that is expired, quarantined, rejected, exhausted or disposed, evaluated against the **date of observation**, not against today's date. | Enter a result dated 10-Jun-2026 naming a lot that expired 05-Jun-2026; entry refused. |
| M12-11 | [MUST] | The block in M12-10 shall be overridable **only by the Approving Authority**, with a mandatory reason from the override reason list; the Section Head may raise the request but may not grant it. The override shall raise a Nonconformity record (M15) and be flagged for the Approving Authority on report review. | Override once; a Nonconformity appears with the lot, the test and the reason. Attempt the same override as the Section Head; refused and logged. |
| M12-12 | [MUST] | **LOT IMPACT ANALYSIS.** Given a consumable lot found to be defective, mis-stored, or wrongly certified, the system shall list every test, sample, worksheet, issued report and customer that used that lot, **whether the lot was consumed directly in the test or consumed indirectly through a prepared solution (M12-23) made from it**, and shall require a disposition per affected **test** and per affected **issued report** exactly as in M11-24. On opening, the analysis shall automatically place every affected test that has not yet been reported — including results already Verified and those in draft or awaiting authorisation — into the **Withheld** state of M15-04, which blocks verification and report issue until that test is individually dispositioned. Report-level dispositions are the four values listed in M11-24(c); test-level dispositions use the M15-05 vocabulary of *Release (with technical justification)* / *Repeat the test* / *Reject and retest with fresh material*. | Make a solution from lot L; use the solution in five tests and lot L directly in two; mark L suspect; the analysis lists all seven tests, and for the five it names the prepared-solution record in the chain. The affected tests not yet reported are immediately Withheld and can be neither verified nor issued. Closing the analysis is refused while any affected test or any affected report is un-dispositioned. |
| M12-13 | [MUST] | The system shall maintain a **stock ledger** per lot recording every movement: receipt, acceptance, issue to test, issue to worksheet, return to store, adjustment on physical count, expiry write-off, disposal. Every movement shall carry actor, date/time, quantity and reason. | Issue 5 mL then return 1 mL; the ledger shows both lines and the balance is correct. |
| M12-14 | [MUST] | Lot quantity shall never be allowed to go below zero. An attempted issue exceeding the balance shall be refused with the available quantity shown. | Attempt to issue 100 mL from a 50 mL balance; refused. |
| M12-15 | [MUST] | The system shall generate **reorder alerts** when the total available quantity of an item across all usable lots falls to or below its reorder level. | Set a reorder level; consume down to it; an alert is generated (M19). |
| M12-16 | [MUST] | The system shall generate **expiry alerts** for lots expiring within configurable lead times, default 90, 60, 30 and 7 days. | Change the lead times in configuration; the next alert cycle uses them. |
| M12-17 | [MUST] | On the effective expiry date, the system shall move the lot automatically to state **Expired**, remove it from the pickers for any observation dated on or after the effective expiry date, and place it on the disposal worklist. The lot shall remain selectable for an observation whose date falls within that lot's validity, displayed marked "expired — valid at the observation date entered". M12-10 is the single test of selectability and is always evaluated against the observation date; no state alone removes a lot from a picker. | Advance the system date past an expiry; the lot state changes without human action and appears on the disposal list; a result dated before the expiry can still name that lot and shows the "valid at the observation date entered" marker; a result dated after it cannot. |
| M12-18 | [MUST] | The system shall support a **physical stock verification** run: generate a count sheet by storage location, record counted quantity per lot, compute variance, require a reason per variance line, and require Lab In-Charge approval before the book quantity is adjusted. | Count one lot short by 10 mL; the adjustment is not posted until approved; the approval and reason appear in the ledger. |
| M12-19 | [MUST] | The system shall record **disposal** of expired, rejected or unwanted material: quantity, method of disposal, date, authorised by, carried out by, witness where required, and the disposal reference. Disposal records are permanent. | Dispose one expired lot; the record prints on the disposal register (M20). |
| M12-20 | [MUST] | The system shall raise a **purchase indent** listing items, quantities, required-by date, technical acceptance criteria per item, suggested supplier and estimated value, route it for Lab In-Charge approval, and transmit the approved indent to CloudZoo ERP purchasing (M22). Where CloudZoo ERP is unreachable, the indent shall queue and retry. | Approve an indent; it appears in the outbound queue and, on success, carries the CloudZoo ERP purchase-requisition number back. |
| M12-21 | [MUST] | The purchase indent shall carry **technical acceptance criteria** per line, not only item and quantity, so that the goods can be checked on receipt against a stated requirement. | Create an indent line without acceptance criteria for a chemical; save is refused. |
| M12-22 | [SHOULD] | The system shall hold an **Approved Supplier List**: supplier, items or categories approved for, evaluation criteria, evaluation score, evaluation date, next re-evaluation due date, and an action log. Indents to a supplier not on the list, or whose approval has lapsed, shall warn. | Add a supplier with an expired evaluation; raising an indent to them shows a warning. |
| M12-23 | [MUST] | The system shall hold a **Prepared Solution Register** for solutions made up in the laboratory: solution name, method or SOP reference, source lots consumed, nominal strength, standardisation factor where applicable, prepared by, date prepared, container label code, validity period, storage condition, and quantity remaining. A prepared solution shall be selectable in result entry exactly like a purchased lot, and shall be blocked when past validity. | Prepare a solution from two source lots; the register shows both source lot identifiers; use it in a test after its validity date; blocked. |
| M12-24 | [MUST] | Consumption of a source lot to make a prepared solution shall reduce the source lot's quantity and shall be traceable in both directions: from the prepared solution to its sources, and from a source lot to every prepared solution made from it. | Follow both links from the prepared solution record and from the source lot record. |
| M12-25 | [SHOULD] | The system shall record **storage conditions required** per item (e.g. "2–8 °C", "away from light", "flammable cabinet") and the **storage location** per lot, using the location hierarchy (building → room → cupboard → shelf). | Assign a lot to a shelf; the Consumable Lot Register shows the full location path. |
| M12-26 | [SHOULD] | The system shall hold a **Safety Data Sheet** file per chemical item and shall show a warning where one is missing for a hazardous item. | Add a chemical marked hazardous with no safety data sheet; a warning appears on the item and on the disposal screen. |
| M12-27 | [SHOULD] | Issue shall default to **first-expiry-first-out**: the picker shall present usable lots ordered by earliest effective expiry, with the earliest pre-selected. Selecting a later-expiring lot shall require no reason but shall be recorded. A lot in state Expired, Exhausted or Disposed shall never be pre-selected by the first-expiry-first-out default even where it is selectable for the observation date; it must be chosen explicitly. | Two lots available; the earlier-expiring one is pre-selected. Enter a back-dated observation for which an Expired lot is selectable; it is not pre-selected. |
| M12-28 | [SHOULD] | The system shall produce a **consumption report** by item, by lot, by test and by month, so the laboratory can estimate annual requirement and support the purchase indent. | Run the report for one quarter; consumption per test type is shown. |
| M12-29 | [MUST] | Purchase documents for chemicals and culture media shall be retained at least until the validity of that chemical or medium expires, and in any case for the retention period set in M21. | Attempt to purge a purchase document for an in-date chemical; refused with the reason. |
| M12-30 | [MUST] | No consumable lot record, ledger line, disposal record or verification run shall be deleted. Corrections are made by an adjustment line with a reason. | No delete action exists; a wrong receipt is corrected by a reversing adjustment that remains visible. |
| M12-31 | [LATER] | The system shall print lot labels carrying the lot identifier as a barcode, item name, date opened, effective expiry and storage condition, for sticking on the container. | Print one label; it scans to the lot record. |
| M12-32 | [MUST] | The Lot Impact Analysis result set shall be produced by a **single database query over stored links, not by a manual search or a two-step navigation** (the principle of M11-25 and DB-20). Where a prepared solution may itself be made from another prepared solution, the traversal shall be recursive and the analysis shall name every prepared-solution record in the chain for each affected test. | Run the analysis twice on the same suspect lot; both runs return an identical list; the chain column is populated for every indirectly affected test. |

### M12.3 Field table — Item Master

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Item code | Short code | Yes | Permanent |
| Item name | Text | Yes | |
| Category | List (see M12-01) | Yes | |
| Unit of measure | List: mL, L, g, kg, number, metre, set, pack | Yes | |
| Lot tracked | Yes / No | Yes | |
| Expiry tracked | Yes / No | Yes | |
| Hazardous | Yes / No | Yes | Drives safety data sheet warning |
| Storage condition required | Text | No | |
| Reorder level | Number in item unit | Conditional | Required where reorder alerts wanted |
| Standard pack size | Number | No | Helps indent quantity |
| Default acceptance criteria | Long text | Yes for chemicals and reference materials | Copied on to each indent line and used at goods receipt |
| Linked to CloudZoo ERP item | Reference | No | Populated by integration (M22) |
| Active | Yes / No | Yes | Inactive items cannot be indented or received |

### M12.4 Field table — Consumable Lot Record

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Lot identifier | System-generated | Yes | From the `DVM/LOT/<FY>/<4>` series of §10.1. Unique in the laboratory, never reused. A sub-lot takes a suffix on this identifier (see M12.6 rule 2) |
| Item | Link | Yes | |
| Supplier's / manufacturer's batch or lot number | Text | Yes for lot-tracked items | As printed on the container. Stored verbatim and separately, because supplier numbers collide across suppliers |
| Manufacturer | Text | Yes | May differ from supplier |
| Supplier | Link to Approved Supplier List or text | Yes | |
| Purchase order / indent reference | Text or link | Yes where purchased | |
| Goods receipt date | Date | Yes | |
| Quantity received | Number plus unit | Yes | |
| Quantity on hand | Number | System-maintained | Never editable directly |
| Date of manufacture | Date | No | |
| Sealed expiry date | Date | Conditional | Mandatory for expiry-tracked items |
| Shelf life after opening (days) | Number | No | |
| Date opened | Date | No | Set when first issued, or entered manually |
| Effective expiry | Date | System-computed | See M12-08 |
| Certificate of Analysis / reference material certificate | File | Yes for chemicals and reference materials | |
| Certified value(s) | Table | Conditional | Reference materials only |
| Stated measurement uncertainty | Text | Conditional | Reference materials only |
| Traceability statement | Text | Conditional | Reference materials only |
| Producer accredited to ISO 17034 | Yes / No plus accreditation number | Conditional | Reference materials only |
| Storage location | Link to location hierarchy | Yes | |
| State | See M12.5 | Yes | |
| Acceptance checked against | Text | Yes to leave Quarantined | The criteria applied |
| Accepted by / date | Link, date | Yes to leave Quarantined | |
| Rejection reason | Text | Conditional | Where state = Rejected |
| Remarks | Long text | No | |

### M12.5 Consumable lot states

| State | Meaning | Selectable for an observation dated while the lot was in this state? |
|---|---|---|
| Quarantined | Received, not yet accepted | No |
| Approved | Accepted, sealed, not yet opened | Yes |
| In use | Opened and being consumed | Yes |
| Exhausted | Quantity reached zero | Yes for an observation dated before the balance reached zero |
| Expired | Past effective expiry | Yes for an observation dated within validity |
| Rejected | Failed acceptance | No |
| Disposed | Physically disposed of, record retained | Yes for an observation dated before disposal |

The state is a fact about today. Selectability is a fact about the observation date. Do not conflate them.

Permitted transitions: Quarantined → Approved or Rejected. Approved → In use → Exhausted or Expired. Approved → Expired. Any of Rejected / Expired / Exhausted → Disposed. No transition back out of Disposed.

### M12.6 Rules and edge cases

1. **A lot is opened but the date is not recorded.** The system shall set *Date opened* automatically on the first issue from that lot, and allow the Store Keeper to correct it with a reason. Silent absence of an opening date defeats the open-shelf-life rule.
2. **Two containers of the same supplier batch.** These are one lot for control purposes but may be opened on different dates. Where the laboratory needs per-container control, create sub-lots by adding a suffix to the lot identifier from the §10.1 series — `DVM/LOT/2026-27/0156-A`, `-B` — in the same way a sub-sample suffixes its parent sample number. The parent identifier is never re-derived, and the system shall support the suffix without a schema change.
3. **A lot expires mid-test.** The block in M12-10 is evaluated against the observation date. If a test began before expiry and observations continued after, each observation is judged on its own date; observations after expiry are blocked. This is the correct outcome and the tester must be told plainly why. The same rule read backwards: an observation dated before expiry remains enterable after the lot has moved to Expired. Blocking it would force the tester either to abandon the record or to name a lot that was not used, and the second outcome corrupts M12-12.
4. **Standard and reference silk samples.** These are used for evenness, cleanness and neatness comparison and they degrade. They belong in this module as items with a replacement-due date, and they also appear in the Reference Standards sub-register in M11. Model the item once here and cross-link, rather than duplicating.
5. **Non-consumable glassware.** Track by quantity only, no expiry, no per-test linkage. Do not force glassware into lot tracking; it creates work with no traceability benefit.
6. **General consumables such as sample bags and tags.** Track quantity and reorder level only. Do not require a lot or a certificate.
7. **Free samples and gifts.** Received with no purchase order. Allow a goods receipt with the purchase order reference marked "Not purchased — source stated in remarks", but the acceptance step still applies.
8. **Physical count variance that cannot be explained.** The variance line must still be approved with a reason from a controlled list including "Reason not established". If the value is material, the Lab In-Charge raises a Nonconformity (M15). Do not allow silent write-off.
9. **Where CloudZoo ERP holds stock valuation.** CloudZoo ERP is the system of record for money value and for the accounting stock ledger. The LIMS is the system of record for **fitness for use** — quarantine, acceptance, expiry, blocking. The two must not both decide whether a lot may be used. See M22.
10. **Disposal of chemicals.** Some material cannot go into ordinary waste. The disposal record must capture the method and, where an outside agency collects it, the agency and its reference. Keep the record permanently.

**OPEN-Q4:** Which chemicals and reference materials does the laboratory actually consume, and does it hold any certified reference material at present? — *Recommended default:* build for the general case; load the register initially with the reagents used for degumming loss, scouring loss and fibre identification, plus the standard photograph sets, grey scales and standard weights, and leave certified reference material support unused until needed.

**OPEN-Q5:** Does the laboratory prepare working solutions in-house, and does it standardise them? — *Recommended default:* build the Prepared Solution Register (M12-23) as specified; if the laboratory does not prepare solutions, the register simply stays empty and costs nothing.

**OPEN-Q6:** Does CloudZoo ERP already hold a consumables inventory, and if so does it support lot and expiry tracking? — *Recommended default:* keep the lot, expiry, certificate and fitness-for-use in the LIMS; send only quantity and value movements to CloudZoo ERP; do not attempt to store expiry in the ERP.

---

## M13. Personnel Competency

**What this module is for, in plain words.** A test result is only as good as the person who produced it. The laboratory must be able to show, for any test done on any date, that the person who performed it was authorised to perform it, that the person who checked it was authorised to check it, and that the person who signed the report was authorised to sign for those particular tests. This module holds the staff records, the training and competence evidence, and — the operative part — an **authorisation matrix** that the system *enforces*. Enforcement is the difference between a compliant laboratory and a laboratory with a filing cabinet. The rule is simple: if the matrix does not authorise you for this method and this activity on this date, the system will not let you do it.

### M13.1 Screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Staff Register | Lab In-Charge, Administrator | List of all personnel, active and left |
| Staff Record | Lab In-Charge | Personal, employment, qualification and contact details |
| Qualification and Experience | Lab In-Charge | Degrees, diplomas, prior experience, with certificate uploads |
| Training Record | Lab In-Charge | Training planned, attended, evaluated |
| Competence Assessment | Lab In-Charge, Quality Manager | Witness or observation assessment against a method, with outcome |
| **Authorisation Matrix** | Lab In-Charge, Approving Authority | Person × method version × activity, with effective dates |
| Authorised Signatory Register | Approving Authority, Quality Manager | Who may sign reports, for which test areas, with the external declaration reference |
| Delegation Register | Approving Authority | Temporary transfer of approval authority with start and end dates |
| Competency Expiry Dashboard | Lab In-Charge | Authorisations and assessments falling due |
| Confidentiality and Impartiality Undertakings | Lab In-Charge | Signed undertakings per person, with validity |
| Authorisation-as-at-date Query | Quality Manager, Approving Authority | "On 12-Mar-2026, who was authorised for method X?" |

### M13.2 Requirements

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M13-01 | [MUST] | The system shall hold one **staff record** per person who can influence a laboratory result, whether regular staff, contract staff, trainee or staff on deputation from another unit. A staff record may exist without a login. | Create a staff record for a trainee with no login; it saves and appears in the matrix picker. |
| M13-02 | [MUST] | The staff record shall be **separate from the login account**. One person, one staff record, at most one active login. Logins are managed in M21. | Delete nothing; deactivate a login; the staff record and its history remain intact. |
| M13-03 | [MUST] | The system shall record **documented competence requirements per function** — what qualification, training, knowledge, skill and experience a person needs to hold a given role or to perform a given method. These requirements shall be versioned. | Define competence requirements for "Tester — raw silk size"; edit them; both versions remain visible with dates. |
| M13-04 | [MUST] | The system shall hold **qualification and experience** records with certificate file uploads: qualification name, institution, year, and for prior experience the employer, role, period and nature of work. | Add a degree with a scanned certificate; it prints on the staff competence card. |
| M13-05 | [MUST] | The system shall hold **training records**: training title, type (internal / external / on-the-job / refresher), provider, dates, duration, trainer, content covered, method or methods addressed, evaluation of effectiveness, and an attendance or certificate file. | Record a training; it appears on the person's card and links to the method it covered. |
| M13-06 | [MUST] | The system shall hold **competence assessment** records: assessment type (witness of testing / re-analysis of a retained sample / blind sample / theoretical test / review of records / interview), method assessed, assessor, date, criteria applied, outcome (Competent / Competent with supervision / Not yet competent), and evidence file. The assessor shall not be the person assessed. | Attempt to record an assessment where assessor = assessee; refused. |
| M13-07 | [MUST] | **AUTHORISATION MATRIX.** The system shall hold one row per (person, method version, activity), with the activities listed in M13.4, plus effective-from date, effective-to date, authorising person, basis of authorisation (which training or assessment record supports it), and an optional suspension with date and reason. | Create an authorisation; the matrix view shows the person, the method, the activity and the dates. |
| M13-08 | [MUST] | **The matrix shall be enforced, not merely displayed.** The system shall refuse, at the moment of the action and evaluated against the date of the action, any of: allocating a test to an unauthorised performer; entering or submitting a result by an unauthorised performer; checking a calculation by an unauthorised checker; making a statement of conformity; giving an opinion or interpretation; technically reviewing a result; authorising or signing a report; performing an internal calibration; sampling. Every refusal shall be logged. | Log in as a tester with no authorisation for method X; the test does not appear in the allocation picker, and direct navigation to the result screen is refused with a clear message. |
| M13-09 | [MUST] | Enforcement shall be evaluated against the **date of the action**, not today's date. A person whose authorisation lapsed yesterday cannot enter today's result; a person authorised last month can still be recorded as the performer of last month's work during back-entry, with the back-entry rules of M21 applying. | Set an authorisation ending 31-May-2026; attempt to enter a result observed 02-Jun-2026 as that person; refused. |
| M13-10 | [MUST] | The system shall enforce **segregation of duties** as a configurable rule set, defaulted on: performer ≠ checker; checker ≠ authoriser; and at minimum performer ≠ authoriser. Where headcount makes this impossible, an override by the Approving Authority with a mandatory justification shall be permitted, and the system shall **record the overlap on the test and on the report** so the laboratory can defend it and count how often it happens. | Same person submits and verifies; refused by default; after override, the test record carries "Performer and verifier are the same person — justification: …" and the count appears in the management review pack. |
| M13-11 | [MUST] | The system shall hold an **Authorised Signatory Register** distinct from the general matrix: person, the test areas or scope lines they may sign for, the reference and date of their declaration to the accreditation body where applicable, the location covered, a designated alternate, and effective dates. | Add a signatory for physical testing only; attempting to authorise a chemical-testing report with that signatory is refused. |
| M13-12 | [MUST] | The report authorisation step shall verify that the signatory is authorised **for every test appearing on that report**, not merely that they are a signatory. | Build a report with one physical and one chemical test; a physical-only signatory cannot authorise it; the system names the offending test. |
| M13-13 | [MUST] | The system shall hold a **Delegation Register**: the delegating authority, the person delegated to, the scope of delegation (which activities, which methods or test areas), start date, end date, the written order or note reference, and the reason. Delegation shall be time-bounded and shall expire automatically. | Create a delegation for 5 days; on day 6 the delegate can no longer authorise; the delegation appears in the audit trail of every report signed under it. |
| M13-14 | [MUST] | The system shall not permit a delegation that grants an activity the delegating authority does not itself hold. | Attempt to delegate chemical-report signing from a physical-only authority; refused. |
| M13-15 | [MUST] | The system shall support **periodic re-authorisation**: each authorisation may carry a monitoring or review interval; when it falls due the system shall either warn or automatically suspend the authorisation, per a configuration switch (default: warn at 60, 30 and 7 days, then suspend on the due date). | Set a 12-month monitoring cycle; on the due date with no new assessment, the authorisation is suspended and the person can no longer perform that method. |
| M13-16 | [MUST] | The system shall answer the question **"as at date D, who was authorised for method M and activity A?"** for any past date. | Run the query for a date six months ago; the answer matches the authorisations that were in force then, not the current ones. |
| M13-17 | [MUST] | The system shall hold **supervision records** for personnel assessed as *Competent with supervision*: who supervises, for which methods, and until when. Results entered by such a person shall be flagged as requiring the supervisor's check before verification. | A supervised tester submits a result; the verification screen shows "Entered under supervision — supervisor check required" and blocks verification until the supervisor's check is recorded. |
| M13-18 | [MUST] | The system shall record a **joiner / leaver / transfer** process: date of joining, date of leaving or transfer, and on leaving shall automatically end-date all authorisations, deactivate the login, list all open work assigned to that person for reassignment, and create a task to notify any external body where the person was a declared signatory. | Mark a person as left; their authorisations end that day, their open tests appear on a reassignment list, and a notification task is created. |
| M13-19 | [MUST] | Where a person is added, removed, suspended or has their scope changed as an **authorised signatory**, the system shall create a task with a due date of **15 days** to notify the accreditation body, and shall record the notification (date, mode, reference) when done. | Add a signatory; a 15-day task appears; recording the notification closes it. |
| M13-20 | [MUST] | The system shall hold **signed confidentiality and impartiality undertakings** per person, with the signed date, validity and file, covering regular staff, contract staff, trainees, and any external party with access. Missing or expired undertakings shall appear on a warning list. | A person with no undertaking on file appears on the warning list and their record shows a red flag. |
| M13-21 | [SHOULD] | The system shall hold **impartiality declarations**: any relationship between a staff member and a customer (family, financial interest, prior employment). Where a declared relationship exists, allocating that customer's samples to that person shall warn the allocator. | Declare a relationship; allocate that customer's test to that person; a warning appears and must be acknowledged. |
| M13-22 | [SHOULD] | The system shall produce a **printable competence file** per person: qualifications, experience, training, assessments, authorisations with dates, undertakings, and delegation history. This is the document an assessor asks for. | Print one person's file; it is one continuous PDF. |
| M13-23 | [SHOULD] | The system shall produce a **training needs list** derived from gaps between the authorisation matrix and the methods the laboratory offers, plus authorisations approaching review. | Run the list; it names methods with fewer than two authorised performers. |
| M13-24 | [SHOULD] | The system shall warn where **fewer than two people** are authorised to perform, or fewer than two to authorise, any active method. This is a single-point-of-failure warning, not a block. | Deactivate one of two authorised performers for a method; a warning appears on the Lab In-Charge dashboard. |
| M13-25 | [MUST] | The system shall hold the person's **specimen signature image** where the laboratory prints one on reports, stored with restricted access as set out in M21. | Upload a specimen signature; it is visible only to the owner, cannot be viewed or downloaded by any other user including the Administrator, and cannot be exported. |
| M13-26 | [MUST] | No staff record, training record, assessment record or authorisation row shall be deleted. Authorisations are ended or suspended; records are voided with a reason and remain visible. | No delete action exists; a wrongly created authorisation is voided and remains in the as-at-date query with its void marker. |
| M13-27 | [MUST] | Every change to the authorisation matrix shall be captured in the audit trail with old value, new value, actor, timestamp and reason. | Change an effective-to date; the audit trail shows both dates and the reason. |

### M13.3 Field table — Staff Record

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Staff code | Short code | Yes | Permanent |
| Full name | Text | Yes | |
| Name in Telugu / Hindi | Text | No | For local documents |
| Designation | Text or list | Yes | e.g. Scientist-D, Technical Assistant, Laboratory Assistant |
| Employment type | Regular / Contract / Deputation / Trainee / Outsourced | Yes | |
| Section | Link | Yes | |
| Reports to | Link to staff | No | |
| Date of joining the unit | Date | Yes | |
| Date of leaving / transfer | Date | No | Setting it triggers M13-18 |
| Mobile | Text | No | Personal data — see M21 |
| Official email | Text | No | |
| Login account | Link | No | At most one |
| Specimen signature file | File | No | Restricted access |
| Photograph | File | No | |
| Active | Yes / No | Yes | Derived from leaving date |

### M13.4 Activities in the authorisation matrix

| Activity code | Plain meaning |
|---|---|
| PERFORM | Carry out the test and record observations |
| CHECK_CALC | Check calculations and data transfers |
| ANALYSE_RESULT | Interpret and analyse the results |
| STATE_CONFORMITY | Issue a pass / fail or grade statement against a specification |
| GIVE_OPINION | Give an opinion or interpretation beyond the numbers |
| TECHNICAL_REVIEW | Technically review the result before authorisation |
| AUTHORISE_REPORT | Authorise and sign the issued report |
| SAMPLE | Draw the sample where the laboratory does the sampling |
| CALIBRATE_INTERNAL | Perform an internal calibration or intermediate check |
| OPERATE_EQUIPMENT | Operate a specific named instrument |
| DEVELOP_METHOD | Develop, modify, verify or validate a method |

Authorisation rows are held against a **method version** (M14) for the test activities and against an **equipment record** (M11) for `OPERATE_EQUIPMENT`. Where the laboratory prefers to authorise at test level rather than method-version level, the system shall allow a wildcard row covering all versions of a method, with the effective dates still applying.

### M13.5 Rules and edge cases

1. **The single-scientist problem.** In a small unit the Unit In-Charge may be the only person authorised to perform, review and authorise. The system must not pretend otherwise. It permits the overlap through M13-10's override, records it on the test and the report, and counts it. The laboratory then has an honest record it can show and a number it can work to reduce.
2. **A tester also works at the receipt counter.** This is normal in a small unit and it weakens the blinding control in M21. The system records the fact through role assignment; the quality documentation must acknowledge it rather than claim a separation that does not exist.
3. **New method introduced.** Nobody is authorised for it yet. The system must therefore allow a *provisional* authorisation issued by the Approving Authority with a short expiry (default 90 days) and a mandatory plan to complete assessment. It appears in a distinct colour on the matrix and on the management review pack.
4. **A trainee produces useful work.** Model as *Competent with supervision* (M13-17). The trainee is the recorded performer; the supervisor's check is a separate recorded step. Do not record the supervisor as the performer — that falsifies the technical record.
5. **Authorisation lapses in the middle of a test.** Observations already recorded stand. New observations after the lapse date are blocked. The test can be reassigned or the authorisation renewed.
6. **Retrospective data entry.** When the laboratory enters last week's paper worksheets, the performer must have been authorised **last week**. The system checks against the observation date. Where it was not, the entry is refused and a Nonconformity is the correct outcome, not an override.
7. **Person leaves and reports must still be defended.** All records are retained. The as-at-date query (M13-16) is what allows the laboratory to show, three years later, that the person was authorised at the time.
8. **Two people with the same name.** The staff code, not the name, is the identifier. The interface must show designation alongside name in every picker.

**OPEN-Q7:** Who at Dharmavaram is currently authorised to sign test reports, for which test areas, and is there a written declaration to the accreditation body or to CSTRI headquarters recording this? — *Recommended default:* build the Authorised Signatory Register as specified; load it initially with the Unit In-Charge for all test areas performed at the unit, and record "declaration reference: to be obtained" until the document is produced.

**OPEN-Q8 — ANSWERED.** The unit **is** accredited in its own right, on certificate **NABLT0726AD18713** (ISO/IEC 17025:2017, field Testing, issued 17/07/2026, valid until 16/07/2030, legal entity Central Silk Board). The accreditation-related fields — declared signatory reference, the notification task for changes the accreditation body must be told about, and the scope lines — are therefore **live and required**, not optional. The per-unit switch that prints the accreditation symbol is defaulted **ON**, governed at all times by the per-test scope flag and by the certificate's validity dates. See OPEN-Q-B12 for the certificate details and the Unique Laboratory Report number format, and **OPEN-Q-B12a for the one part still outstanding** — the scope annexure listing which tests are accredited, which must be loaded into the test catalogue before the first report is issued. Until it is loaded, every test is treated as out of scope.

**OPEN-Q9:** How often does the laboratory intend to reassess competence? — *Recommended default:* 24 months for routine methods, 12 months for methods involving subjective visual judgement (evenness, cleanness, neatness, colour fastness rating), configurable per method.

---

## M14. Method and Document Control

**What this module is for, in plain words.** Every test the laboratory performs is done according to a written method — an Indian Standard, an international standard, or the laboratory's own written procedure. That method has a version. Methods change. If a report issued in 2026 says "tested to IS 15090 Part 5", and the standard is revised in 2028, the laboratory must still be able to show exactly which text it followed in 2026. This module is the controlled catalogue of methods, the place where the calculation formulas live, and the document-control system for procedures, quality manuals and printed forms. The one non-negotiable rule: **a result records the method *version* used, not just the method name.**

### M14.1 Screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Method Register | All staff (read) | Find any method and its current version |
| Method Version (add / edit / supersede) | Quality Manager, Lab In-Charge | The controlled definition of one version of one method |
| Parameter Definitions | Lab In-Charge | What is measured under this method: name, unit, decimals, data type |
| Calculation Formulas | Lab In-Charge, Developer initially | Formulas, rounding rules and significant figures per parameter |
| Requirements tab | Lab In-Charge | Equipment types, consumables, environmental conditions, competency, sample quantity |
| Verification / Validation Record | Quality Manager | Evidence that the laboratory can perform this method version |
| Method Deviation Register | Lab In-Charge, Approving Authority | Documented, justified, authorised and customer-accepted departures |
| Document Register (SOPs, manuals, standards) | All staff (read), Quality Manager (edit) | Controlled documents with issue and revision |
| Controlled Copy List | Quality Manager | Who holds which copy of which document |
| Read-and-Acknowledge Tracking | All staff | Confirm having read a new or revised document |
| Format (Form) Register | Quality Manager | Every printed form with its format number and revision |
| Obsolete Document Archive | Quality Manager | Withdrawn documents, watermarked, retained |
| Standards Library | All staff (read) | Purchased standards held by the laboratory, with edition and holding location |

### M14.2 Requirements

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M14-01 | [MUST] | The system shall hold a **Method Master** in which the versioned unit is the **method version**, with the fields in M14.3. A method has one or more versions; exactly one may be *Active* for new work at any date. | Create two versions of a method; only one is offered when starting new work. |
| M14-02 | [MUST] | A method version shall carry the **issuing body** (Bureau of Indian Standards, International Organization for Standardization, ASTM, AATCC, International Silk Association, laboratory in-house, other), the **designation** (e.g. `IS 15090 (Part 5)`), and the **edition or year of issue** and any amendment number. | Record `IS 15090 (Part 5):2002, Amendment 1 (February 2007)`; all three parts appear on the printed report method line. |
| M14-03 | [MUST] | A method version shall have a **state** from: Draft / Verified / Active / Superseded / Withdrawn, with the transitions in M14.5. | Attempt to use a Draft version for live work; refused. |
| M14-04 | [MUST] | A method version shall not become **Active** without a linked **verification record** showing that the laboratory can properly perform it: what was done, by whom, on what date, against what criteria, the results, and the conclusion. | Attempt to activate a version with no verification record; refused with the reason. |
| M14-05 | [MUST] | Where a method is **non-standard, developed in-house, used outside its intended scope, or modified**, the system shall require a **validation record** with five named sections: the validation procedure used; the specification of requirements; the determination of performance characteristics; the results obtained; and a statement on the validity of the method detailing its fitness for the intended use. | Mark a method as in-house; activation is refused until all five sections are non-blank. |
| M14-06 | [MUST] | The system shall hold **parameter definitions** per method version: parameter name, plain description, unit of measure, data type (numeric / text / list of allowed values / grade / yes-no), number of decimal places, rounding rule, number of readings expected, whether mandatory, whether reportable, and whether calculated. | Define "Size deviation" as numeric, 2 decimals in denier; the result screen enforces 2 decimals. |
| M14-07 | [MUST] | Where a parameter is **calculated**, the method version shall carry the **formula**, with a version number of its own, and the system shall store on each result both the computed value and the formula version applied. | Change a formula; old results still show the old formula version and are unchanged; new results use the new one. |
| M14-08 | [MUST] | The system shall support **enumerated-value parameters** where the method requires selection from a fixed set rather than free entry — for example the official standard photograph values for neatness (100, 90, 80, 70, 60, 50, 30, 10). | Define neatness with that value list; the result screen offers a picker, not a free number field. |
| M14-09 | [MUST] | The method version shall record **units in both tex and denier** where the domain uses both, or shall record one and declare the conversion, so a report can render either. | Enter a size in denier; the printed report can show tex as well without re-entry. |
| M14-10 | [MUST] | The method version shall record its **requirements**: required equipment categories or specific instruments; required consumables or reference materials; required environmental conditions (temperature, relative humidity, and any pre-conditioning duration); minimum sample quantity and the number of sub-samples or specimens, and the specimen level the draw produces plus the method whose output it draws from, so shared specimen chains are resolvable; and the competency activities it needs. These requirements shall drive the enforcement in M11-19, M12-09, M13-08 and M16, and the sample-draw rule recorded here is the single definition of that rule for the whole document — M1-36, M2-26 and the M3 rules read the chains from it and do not restate them. | Define an environmental requirement; a result entered outside the recorded condition raises the excursion warning of M16. Set the consumables flag to Yes and leave the list empty; activation is refused. Set it to No with no reason; save is refused. Set it to No with a reason; activation succeeds and the reason appears on the Method Register. Record winding as producing bobbins from skeins, and size as drawing bobbins from winding; the two draw chains resolve to one shared parent draw and are not counted twice. |
| M14-11 | [MUST] | The method version shall record a **standard turnaround time** and, separately, any mandatory **pre-conditioning wait** so that due dates are computed honestly. | Set 24 hours pre-conditioning plus 2 hours test; the due-date calculation includes both. |
| M14-12 | [MUST] | **The result record shall store the method version identifier**, not the method identifier. Reports shall print the designation, edition and amendment as at the date of test. | Supersede a method version; reprint a report issued before the change; it shows the old version. |
| M14-13 | [MUST] | The system shall refuse to select a **Superseded** or **Withdrawn** version for new work, unless the Approving Authority records a reason (for example, the customer or a regulator requires the earlier edition). Such a selection shall be recorded on the test and printed on the report. | Select a superseded version with a reason; the report carries the reason as a note. |
| M14-14 | [MUST] | Where a requested method version is superseded or withdrawn at the time of a customer's request, the system shall require an **intimation record** to the customer before work proceeds. | Register a request naming a withdrawn edition; the system blocks acceptance until intimation is recorded. |
| M14-15 | [MUST] | Where the laboratory, not the customer, selects the method, the system shall record `method_selected_by_laboratory = Yes` and evidence that the customer was informed of the choice. | Register a request with no method specified; the system records the flag and prompts for the intimation. |
| M14-16 | [MUST] | The system shall hold a **Method Deviation Register**. A deviation shall require four things before the test can be released: a description of the deviation; a technical justification; an internal authoriser; and the customer's acceptance with evidence and date, or a reference to a contract clause pre-agreeing it. Approved deviations shall print automatically on the report. | Create a deviation with no customer acceptance; the test cannot be verified. Add acceptance; the report prints the deviation text. |
| M14-17 | [MUST] | When the issuing body publishes a **new edition or amendment** of a standard the laboratory uses, the system shall allow the Quality Manager to record it and shall automatically create a **re-verification task** with a due date. | Record a new edition; a task appears on the Quality Manager's list. |
| M14-18 | [MUST] | The system shall attach **supporting documents** to a method version — the standard itself where the laboratory holds a licensed copy, the laboratory's own working procedure, worksheets, calculation notes — and shall make them openable from the result-entry screen. | Open a result-entry screen; the method's working procedure is one click away. |
| M14-19 | [MUST] | The system shall hold a **Document Register** for controlled documents: quality manual, procedures, standard operating procedures, work instructions, formats, external standards, policies. Each document shall carry a document number, title, type, issue number, revision number, effective date, prepared by, reviewed by, approved by, and state (Draft / Approved / Issued / Under revision / Obsolete). | Create a procedure through to Issued; each stage records a different named person. |
| M14-20 | [MUST] | The system shall keep a **controlled copy list**: which numbered hard copies of a document exist, who holds each, and the date issued. On revision, the system shall produce a list of copies to be recalled and shall record their return or destruction. | Revise a document held in 3 controlled copies; the recall list names all 3 holders. |
| M14-21 | [MUST] | The system shall track **read-and-acknowledge**: on issue or revision of a document, each person in a defined distribution list shall be required to confirm having read it, with date and time. Outstanding acknowledgements shall appear on the Lab In-Charge dashboard and on the individual's home screen. | Issue a revision to 4 staff; 2 acknowledge; the dashboard shows 2 outstanding. |
| M14-22 | [MUST] | **Obsolete documents** shall be retained and shall be visibly watermarked "OBSOLETE — NOT FOR USE" on screen and on any print, with the number of the superseding document shown. They shall not appear in ordinary search results unless the user chooses to include obsolete documents. | Withdraw a document; open it; the watermark and the superseding reference are visible. |
| M14-23 | [MUST] | Every **printed form and format** produced by the system — worksheets, receipt slips, labels, registers, certificates, invoices — shall carry a **format number and revision** and, where the laboratory requires it, the effective date, printed in the footer. Format numbers shall be held in a Format Register. | Print any form; the footer shows e.g. `Format DVM/F/12, Rev. 03, w.e.f. 01-Apr-2026`. |
| M14-24 | [MUST] | A change to a printed format shall be a **controlled change**: new revision number, reason for change, approver, effective date. The previously issued documents shall continue to display the format revision that was in force when they were issued. | Revise the report format; reprint an old report; it shows the old format revision. |
| M14-25 | [SHOULD] | The system shall hold a **Standards Library**: which external standards the laboratory holds, edition, purchase or subscription reference, physical or electronic location, and a review date to check whether a newer edition exists. | Run the review list; standards not checked in 12 months are listed. |
| M14-26 | [SHOULD] | The system shall support **method families** so that shared physical preparation is recorded once. For example, the winding test produces the bobbins used for size, evenness, cleanness, neatness, tenacity and cohesion. The method version shall be able to declare a **prerequisite method** and the system shall warn where a prerequisite has not been performed. | Order cleanness alone; the system warns that winding and seriplane panel preparation are prerequisites. |
| M14-27 | [MUST] | The system shall keep a **change history** per method version showing every field changed, old value, new value, actor, timestamp and reason. Changing a formula, a rounding rule or an environmental requirement shall be treated as a change requiring the software change-control record of M21. | Change a rounding rule; the history shows both values and a change-control reference is required. |
| M14-28 | [SHOULD] | The system shall record **measurement uncertainty** per parameter per method version: the model or basis, the value, and a reporting policy from: Never / Always / On customer request / When the result is near a specification limit. | Set the policy to "When near limit"; a result close to a limit prints the uncertainty and a result far from it does not. |
| M14-29 | [MUST] | No method version, document, format record or deviation shall be deleted. Versions are superseded or withdrawn; documents are made obsolete; records are voided with a reason and remain visible. | No delete action exists anywhere in this module. |
| M14-30 | [LATER] | The system shall support a **method comparison view** showing what changed between two versions of the same method, to support the re-verification decision. | Compare two versions; changed fields are highlighted. |

### M14.3 Field table — Method Version

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Method code | Short code | Yes | Stable across versions, e.g. `RS-SIZE` |
| Method title | Text | Yes | Plain title staff recognise |
| Version / revision number | Text | Yes | Laboratory's own version numbering |
| Issuing body | List | Yes | See M14-02 |
| Designation | Text | Yes | e.g. `IS 15090 (Part 5)` |
| Edition / year | Text | Yes | e.g. `2002` |
| Amendment | Text | No | e.g. `Amd. 1, Feb 2007` |
| Method type | Standard / In-house / Standard modified / Standard used outside scope | Yes | Drives whether validation is required |
| Scope | Long text | Yes | What material and what range it applies to |
| Sample types applicable | Multi-select | Yes | Raw silk, dupion, twisted silk, cocoon, fabric, water, zari, etc. |
| Parameters | Child table | Yes | See M14-06 |
| Calculation formulas | Child table with formula version | Conditional | Where any parameter is calculated |
| Required equipment categories | Multi-select | Yes for result-affecting methods | |
| Uses controlled consumables or reference materials | Yes / No plus reason if No | Yes | Reason prints on the Method Register; see M14-10 |
| Required consumables / reference materials | Multi-select | Conditional | Required and non-empty where the preceding flag is Yes; drives M12-09 |
| Environmental requirement | Temperature, relative humidity, tolerance, pre-conditioning hours | Conditional | Drives M16 |
| Minimum sample quantity | Number plus unit | Yes | e.g. "5 skeins minimum" |
| Sub-sample / specimen plan | Text plus counts | Yes | e.g. "10 skeins → 10 bobbins → 40 sizing skeins of 450 m" |
| Number of readings per parameter | Number | Yes per parameter | |
| Replicate agreement rule | Text plus numeric threshold | No | e.g. "repeat if the two sets differ by more than 0.5 %" |
| Standard turnaround | Working hours or days | Yes | |
| Pre-conditioning wait | Hours | No | Added to turnaround |
| Competency activities required | Multi-select from M13.4 | Yes | |
| Measurement uncertainty | Text plus value plus reporting policy | No | See M14-28 |
| In accreditation scope | Yes / No | Yes | Per-unit; drives report symbol rules |
| State | Draft / Verified / Active / Superseded / Withdrawn | Yes | |
| Effective from | Date | Yes | |
| Effective to | Date | No | Set on supersession |
| Superseded by | Link to method version | No | |
| Verification record | Link | Yes to activate | |
| Validation record | Link | Conditional | See M14-05 |
| Attached documents | Files | No | |
| Prepared by / Reviewed by / Approved by | Links plus dates | Yes to activate | |

### M14.4 Field table — Controlled Document

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Document number | Text | Yes | e.g. `DVM/SOP/RS/04` |
| Title | Text | Yes | |
| Document type | Quality manual / Procedure / Standard operating procedure / Work instruction / Format / External standard / Sampling plan / Policy / Other | Yes | Sampling plan is the type the Sampling Record of M4-35 references |
| Issue number | Number | Yes | |
| Revision number | Number | Yes | |
| Effective date | Date | Yes | |
| Reason for revision | Long text | Yes from revision 1 onwards | |
| Prepared by / date | Link, date | Yes | |
| Reviewed by / date | Link, date | Yes | |
| Approved by / date | Link, date | Yes | |
| State | Draft / Approved / Issued / Under revision / Obsolete | Yes | |
| Supersedes | Link | No | |
| Superseded by | Link | No | |
| Distribution list | Multi-select staff or roles | Yes for Issued | Drives read-and-acknowledge |
| Controlled hard copies | Child table: copy number, holder, issued date, returned date | No | |
| File | File upload | Yes for Issued | |
| Retention class | Link to retention policy (M21) | Yes | |

### M14.5 Method version state transitions

| From | To | Who | Requires |
|---|---|---|---|
| (new) | Draft | Quality Manager | Method code, title, designation |
| Draft | Verified | Quality Manager | Complete verification record; validation record where required |
| Verified | Active | Lab In-Charge or Approving Authority | Prepared / reviewed / approved names; effective-from date; at least one authorised performer in M13; the consumables declaration resolved per M14-10 |
| Active | Superseded | Quality Manager | A newer version in Active state; effective-to date |
| Active or Superseded | Withdrawn | Quality Manager | Reason; no open work using it |
| Draft | Withdrawn | Quality Manager | Reason |
| Superseded / Withdrawn | (none) | — | Terminal for new work; remains readable for ever |

### M14.6 Rules and edge cases

1. **Two methods for the same test at different prices.** The research shows the same conceptual test (for example cohesion) offered under an Indian Standard method at one price and under an International Silk Association method at another. This is why the catalogue entry a customer buys is a combination of **test plus method**, and why the method version, not the test name, is what the report cites.
2. **Local practice differs from the standard.** For example, sizing-skein length may be 225 m for cottage-basin silk against 450 m prescribed in the standard. Do not hide this in code. Either create a separate in-house method version with a validation record, or record it as a formal deviation under M14-16. Both are honest; a silent difference is not.
3. **A formula is found to be wrong.** This is a serious event. The correct sequence is: create a new formula version; record the change with reason under change control (M21); use the Impact Analysis pattern of M11-24 driven by formula version to list every result computed with the old formula; disposition each affected test and each affected report. On opening, that analysis shall withhold every affected test not yet reported, exactly as M11-24(g) requires, and closure shall be refused while any affected test or report is un-dispositioned. The system shall provide this analysis by formula version, not only by equipment and batch.
4. **The laboratory does not hold the standard.** Some standards are licensed and cannot be attached as a file. Record the designation, edition and where the copy is held, and attach the laboratory's own working procedure instead. Do not attach a copy the laboratory is not licensed to hold.
5. **Rounding.** Rounding is part of the method, not a display preference. Record the number of significant places and the rounding convention per parameter, apply it once at result computation, and store both the unrounded and the presented value.
6. **Grade computation.** Where a grade is derived from several parameters through classification tables, those tables are **reference data belonging to a method version**, with their own effective dates, and they differ between issuing bodies. Load them as data. Never compute a grade from constants written into program code.
7. **A method version is activated with no authorised performer.** Blocked by M14.5. Otherwise the laboratory can sell a test nobody may legally perform.
8. **Documents held only on paper.** Record them in the register with state Issued and the file field marked "Paper only — location recorded". The register is still the single index.

**OPEN-Q10:** What is the complete list of tests the unit performs, with the exact standard designation, edition, parameters, number of readings, formulas, rounding and turnaround? — *Recommended default:* this is the single largest data-loading task of the project and it must be treated as a scheduled deliverable with the scientist, not discovered during build. Begin with the Limited Test (which the research indicates is roughly 98 % of the unit's volume), then twist test, denier of twisted silk, water analysis, and grading under the Indian Standard and the International Silk Association method.

**OPEN-Q11:** Does the unit already operate a documented quality system with numbered procedures and formats? — *Recommended default:* build the Document Register and Format Register as specified; if there is an existing numbering convention, adopt it exactly rather than inventing a new one, and load the existing document list before go-live.

**OPEN-Q12:** For the Limited Test, is there an existing computer program on the test personal computers that computes denier and size deviation, and can it export its readings? — *Recommended default:* assume no export; specify manual reading entry with the statistics computed by this system; keep a file-import path as [LATER] so an export can be used if one is found.

---

## M15. Quality Assurance

**What this module is for, in plain words.** This module is how the laboratory keeps proving that its results are right, and how it deals with the occasions when they are not. It has six parts. **Internal quality control** repeats known material and plots the answers, so that a drifting oven or a tiring standard photograph is caught before a customer's report is wrong. **Proficiency testing and inter-laboratory comparison** compares this laboratory's answers with other laboratories'. **Complaints** records what customers say went wrong. **Nonconformity and corrective action** records what actually went wrong, why, what was done and whether it worked. **Internal audit** checks the laboratory against its own rules. **Management review** is the annual meeting where the Unit In-Charge looks at all of it — and this system should assemble that meeting's papers automatically, because that is one of its strongest practical selling points.

### M15.1 Screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Quality Control Plan | Quality Manager | Which control techniques apply to which method, at what frequency, with what acceptance criteria |
| Control Sample Entry | Tester | Record the result of a control, duplicate or blind sample |
| Control Chart | Quality Manager, Lab In-Charge | Plot control results over time with limits and rule breaches |
| QC Breach Disposition | Lab In-Charge, Quality Manager | Decide what happens to the customer results in the affected run |
| Proficiency Testing Register | Quality Manager | Rounds entered, provider, assigned and reported values, z-score, outcome, follow-up |
| Two-Year Participation Plan | Quality Manager | Coverage matrix of test areas against planned participation |
| Complaint Register | Front Desk (log), Quality Manager (handle) | Every customer complaint, its investigation and its outcome |
| Nonconformity Register | All staff (raise), Quality Manager (handle) | Anything that did not conform to procedure or to the agreed requirement |
| Corrective Action (CAPA) | Quality Manager, action owners | Root cause, action, owner, target date, effectiveness check, closure |
| Internal Audit Plan and Execution | Quality Manager, auditors | Audit schedule, checklists, findings, closure |
| Management Review Pack | Approving Authority, Quality Manager | Automatically assembled inputs; recorded decisions and actions |
| Risk and Opportunity Register | Quality Manager, Lab In-Charge | Identified risks, controls, review dates |

### M15.2 Requirements — internal quality control

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M15-01 | [MUST] | The system shall hold a **Quality Control Plan per method version** stating which techniques apply, the frequency (per batch / per n samples / daily / weekly / monthly), the acceptance criteria, and the responsible role. Available techniques shall include: control or reference material; alternative instrument comparison; functional check of equipment; check standard with a control chart; intermediate check; replicate test by the same or a different method; retest of a retained sample; correlation between different characteristics of the same item; periodic review of reported results; comparison between analysts or between instruments; and blind sample testing. | Create a plan for one method; the tester's screen shows the control due for that run. |
| M15-02 | [MUST] | The system shall let a tester record a **control result** in the same structured way as a customer result, linked to the analyst, the instrument, the consumable batch, the environmental record and the customer samples in the same run. | Record a control; the linked customer tests are listed on the control record. |
| M15-03 | [MUST] | The system shall plot **control charts** with a configurable centre line and control limits, and shall evaluate configurable out-of-control rules. At minimum the following rules shall be available and individually switchable: one point beyond three standard deviations; two consecutive points beyond two standard deviations on the same side; a range between consecutive points exceeding four standard deviations; four consecutive points beyond one standard deviation on the same side; ten consecutive points on the same side of the centre line. | Enter a point beyond three standard deviations; the chart flags it and a breach record is created. |
| M15-04 | [MUST] | **A quality control breach shall withhold release, not merely display a warning.** When a control result breaches the acceptance criteria, the system shall automatically place every customer test in the same run into a **Withheld** state that blocks verification and report issue, until a named authorised person records a disposition. | Fail a control; the customer tests in that run cannot be verified; the block is visible with the reason. |
| M15-05 | [MUST] | The **QC breach disposition** shall record: the investigation, the cause where established, and per affected customer test one of *Release (with technical justification)* / *Repeat the test* / *Reject and retest with fresh material*; plus whether previously issued reports are implicated, and a link to a Nonconformity record. | Disposition a breach; the withheld tests are released or repeated according to the decision, and the Nonconformity record exists. |
| M15-06 | [MUST] | The system shall support **replicate and duplicate testing rules**: where a method declares a repeatability limit, the system shall compute the difference between replicates and flag a result exceeding the limit. | Enter two replicates differing by more than the stated limit; the result is flagged before submission. |
| M15-07 | [SHOULD] | The system shall support **blind sample injection**: the Quality Manager can enter a retained or control sample into the ordinary work queue under an ordinary-looking sample number, so the tester does not know it is a control. The true identity shall be visible only to the Quality Manager until the result is submitted. | Inject a blind sample; the tester's queue shows nothing unusual; after submission the Quality Manager sees the comparison against the known value. |
| M15-08 | [SHOULD] | The system shall support **analyst-versus-analyst and instrument-versus-instrument comparison** records, with the material used, the two sets of results, the acceptance criterion and the conclusion. | Record one comparison; it appears in the management review pack. |
| M15-09 | [SHOULD] | The system shall support **cross-parameter plausibility rules** per method version — for example flagging a combination of size, tenacity and elongation that is internally inconsistent — as warnings at submission, not blocks. | Define one rule; a violating result shows a warning that the tester must acknowledge. |
| M15-10 | [MUST] | The system shall keep a **periodic review of reported results** record: who reviewed, over what period, what sample of reports, what was found, and what action followed. | Record one review; it appears in the management review pack. |

### M15.3 Requirements — proficiency testing and inter-laboratory comparison

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M15-11 | [MUST] | The system shall hold a **Proficiency Testing / Inter-laboratory Comparison Register** with: scheme name; provider and whether the provider is accredited for proficiency testing; round or year; test area, parameter and material; date of receipt and date of reporting; the value the laboratory reported; the assigned or reference value; the performance score (z-score or equivalent, or the equivalence number for calibration comparisons); outcome (Satisfactory / Questionable / Unsatisfactory); and evidence attachments. | Record one round; the outcome and score appear on the register and the dashboard. |
| M15-12 | [MUST] | An **Unsatisfactory** or **Questionable** outcome shall automatically create a Nonconformity record and, where earlier results may be implicated, shall offer the Impact Analysis (as in M11-24) driven by the affected method and period. | Record an unsatisfactory z-score; a Nonconformity appears with a root-cause section requiring completion. |
| M15-13 | [MUST] | The system shall hold a **two-year participation plan** as a coverage matrix: rows are the laboratory's test areas, parameters and materials; columns are the planned rounds across the coming two years; cells show planned and actual participation. The system shall highlight test areas with no planned or actual participation in the rolling two-year window. | Generate the matrix; a test area with no coverage is highlighted in the gap list. |
| M15-14 | [SHOULD] | Where no proficiency testing provider exists for a test area, the system shall allow the laboratory to record an **inter-laboratory comparison** instead — typically with another CSB unit — with the comparison protocol, the participating laboratories, the material, the results and the conclusion. | Record a comparison between two CSB units; it counts as coverage in the matrix. |
| M15-15 | [SHOULD] | The system shall track **repeat unsatisfactory performance** in the same test area and shall raise this to the Approving Authority and the management review, because it may lead to a reduction of the laboratory's declared scope. | Two unsatisfactory outcomes in the same area within two years; a prominent alert appears. |

### M15.4 Requirements — complaints

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M15-16 | [MUST] | The system shall hold a **Complaint Register** with the fields in M15.8. Complaints may be received in person, by telephone, by letter, by email, through the customer portal or through the parent institute. | Log a complaint from each channel; all appear in the register. |
| M15-17 | [MUST] | Every complaint shall be linked, where applicable, to the **report, sample and test** complained about, so that the whole file is reachable from one place. | Open a complaint; one click reaches the report and the test records. |
| M15-18 | [MUST] | The system shall record a decision on whether the complaint **relates to laboratory activities the laboratory is responsible for**, with a written rationale. Complaints found out of scope shall be closed with that reason recorded, never deleted. | Close one complaint as out of scope; the rationale is required and the record remains. |
| M15-19 | [MUST] | The system shall record **acknowledgement to the complainant**, **progress updates**, and the **final outcome communication**, each with the date, channel and the person who communicated. | Log a complaint; the register shows acknowledgement pending until it is recorded. |
| M15-20 | [MUST] | **The person who approves or communicates the outcome shall not be a person involved in the laboratory activities complained about.** Involvement shall be determined from a defined **involvement set** on the complained-about work, not from the presence of the person's name anywhere in the audit trail. The involvement set shall comprise: the performer; the checker or calculator; the verifier (technical reviewer); the authorising signatory and any countersignatory; the person who performed sampling where the laboratory sampled; anyone who entered, amended, excluded or voided an observation, result, method deviation or report content on it; and, according to the complaint category, the person who received or held custody of the sample (Sample handling), the person who raised or amended the invoice (Billing), the person who approved an unblinding (Confidentiality or Personal data), and the person whose conduct is complained of (Staff conduct). Read, print, export, download, login, share-link access and permission-denial events shall not, of themselves, constitute involvement. | Attempt to close a complaint where the approver was the tester on the disputed test; refused with the reason. Attempt closure by a Quality Manager whose only audit entries on that work are prints and exports made during the investigation; permitted. |
| M15-20a | [MUST] | Where **no member of the unit falls outside the involvement set**, the system shall require an **external approver** to be recorded — name, designation, organisation, date of decision, and the evidence of the decision attached — and shall not permit closure by a person in the involvement set under any override. | Configure a single-person unit; closure by that person is refused; closure with an external approver and attached evidence succeeds. |
| M15-21 | [MUST] | The system shall run an **SLA clock** on complaints with configurable targets for acknowledgement (default 2 working days) and for closure (default 30 days, hard maximum configurable), and shall escalate to the Approving Authority as the target approaches. | Log a complaint and let the acknowledgement target pass; an escalation notification is sent. |
| M15-22 | [MUST] | A complaint found valid shall create or link to a **Nonconformity** record. | Mark a complaint valid; the system creates the Nonconformity and links both ways. |
| M15-23 | [SHOULD] | The system shall record where a complaint has been **escalated to an external body** (the accreditation body, CSTRI headquarters, the Ministry, a consumer forum, a court), with the reference and the date. | Record an escalation; it appears prominently on the complaint and in the management review pack. |
| M15-24 | [SHOULD] | The system shall publish, for any interested party on request, a **description of the complaint-handling process** — a printable page maintained as a controlled document (M14). | Print the process description from the register screen. |
| M15-25 | [MUST] | The system shall record **grievance handling under the personal-data law** in the same register with a distinguishing category, because the law requires a published grievance route and a response within a stated period. | Log a data-related grievance; it is categorised separately and its own SLA applies (see M21). |

### M15.5 Requirements — nonconformity and corrective action

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M15-26 | [MUST] | The system shall hold a **Nonconformity Register**. A Nonconformity may be raised by any staff member and shall record: source; description; the sample, test, report, instrument, batch, method version or person concerned; the risk level; the immediate action; and who raised it and when. | Any user raises a Nonconformity from any screen; it appears in the register within one action. |
| M15-27 | [MUST] | The system shall create Nonconformity records **automatically** for: a failed calibration or intermediate check; use of an out-of-calibration instrument under override; use of an expired or unapproved consumable batch under override; a quality-control breach; an unsatisfactory proficiency-testing outcome; an environmental excursion outside a method's stated limits; a result entered by an unauthorised person under override; a method deviation used without approval; an issued report being amended or withdrawn (unless the reason code is classified as non-nonconforming, for example a purely cosmetic address correction); and a valid complaint. | Trigger each of these once; each produces a Nonconformity linked to its cause. |
| M15-28 | [MUST] | Each Nonconformity shall carry a **risk level** (Minor / Major / Critical) that drives mandatory actions, and shall support a **Withhold report** state that actually blocks report issue for the affected work. | Set risk to Critical with withhold; the affected report cannot be issued. |
| M15-29 | [MUST] | Each Nonconformity shall require an **evaluation of significance including an impact analysis on previous results**, using the Impact Analysis function driven by whichever cause applies (instrument, batch, method version, analyst, environmental record, or quality-control run). Where the cause is a demonstrated technical defect — a failed calibration or intermediate check, a defective or mis-stored batch, or a superseded or erroneous formula version — the automatic withholding of M11-24(g) shall apply. For every other cause the withholding shall remain risk-level-driven under M15-28, so that the action stays proportionate to the risk. | Open a Nonconformity; the "Analyse impact on previous results" action is present and its output is stored on the record. Open one driven by a failed calibration; the unreported affected tests are Withheld without further action. Open a Minor Nonconformity with an analyst cause; withholding is decided by risk level under M15-28. |
| M15-30 | [MUST] | Each Nonconformity shall require, before closure, all of: the decision on the acceptability of the nonconforming work; whether the customer was notified and when; whether work was recalled and which reports; and who authorised the resumption of work. | Attempt to close with any of these blank; refused with the field named. |
| M15-31 | [MUST] | Where the Nonconformity could recur, or where there is doubt about the laboratory's conformity with its own system, the system shall require a **corrective action** record with: root cause analysis; the action decided; the responsible person; the target date; evidence of completion; an **effectiveness check** with its own date and outcome; and closure by a named person. | Mark "could recur"; a corrective action record is created and the Nonconformity cannot close until the effectiveness check is recorded. |
| M15-32 | [MUST] | The system shall maintain a **recall register**: which reports were recalled, which customers were told, when, by what channel, and whether an acknowledgement was received. | Recall two reports; both appear on the recall register with notification status. |
| M15-33 | [SHOULD] | The system shall report **overdue corrective actions** on the Quality Manager and Approving Authority dashboards, aged in buckets. | One action past target date; it appears in the overdue list. |
| M15-34 | [SHOULD] | The system shall allow a Nonconformity to be raised as an **opportunity for improvement** without the full corrective-action machinery, distinguished by category. | Raise an improvement suggestion; it is tracked but does not require root cause analysis. |

### M15.6 Requirements — internal audit

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M15-35 | [MUST] | The system shall hold an **internal audit programme**: audit number, period covered, areas or clauses to be audited, planned dates, auditors, and auditee areas. An auditor shall not audit their own work. | Assign an auditor to their own section; the system warns and requires a justification. |
| M15-36 | [MUST] | The system shall hold **audit checklists** as reusable templates linked to the clauses or procedures being audited, and shall record the response and evidence per checklist line. | Run an audit from a checklist; each line records Conforms / Does not conform / Observation, with evidence. |
| M15-37 | [MUST] | An audit finding of nonconformity shall create a **Nonconformity record** linked to the audit, and shall follow the same corrective-action route. | Record a nonconforming finding; the Nonconformity is created automatically. |
| M15-38 | [MUST] | The system shall produce an **audit report** and shall track closure of every finding, with the audit unable to close while any finding is open. | Attempt to close an audit with one open finding; refused. |
| M15-39 | [SHOULD] | The system shall show **clause coverage** across the audit programme, so the laboratory can see which parts of its system have not been audited in the current cycle. | Run the coverage view; unaudited clauses are listed. |

### M15.7 Requirements — management review, risk and opportunity

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M15-40 | [MUST] | The system shall **assemble the management review input pack automatically** from its own data for a chosen period. The pack shall include, as a minimum, the items listed in M15.9. | Generate the pack for one financial year; every item in M15.9 is present with real figures, and the whole pack prints as one PDF. |
| M15-41 | [MUST] | The management review record shall capture the meeting date, attendees, the inputs considered, the decisions taken, and the resulting actions with owners and target dates. Actions shall be tracked to closure like corrective actions. | Record a review with three actions; all three appear on the action tracker. |
| M15-42 | [MUST] | The system shall hold a **Risk and Opportunity Register**: risk description, category (impartiality / confidentiality / technical / resource / equipment / supplier / information system / statutory / commercial / safety), likelihood, consequence, resulting rating, existing controls, additional action, owner, review date, and status. | Add a risk; it appears with its rating and next review date. |
| M15-43 | [MUST] | The register shall contain, as pre-loaded entries the laboratory can edit, the impartiality risks the research identifies as real for this unit — in particular that analysts in a concentrated silk cluster will personally recognise many customers — together with the control applied (the blinding rule of M21) and the method of verifying that the control works. | Open the register on a new installation; the impartiality entry is present with the blinding control referenced. |
| M15-44 | [SHOULD] | The system shall flag risks whose **review date has passed**. | Let a review date pass; the risk appears in the overdue list. |
| M15-45 | [SHOULD] | The system shall record **customer feedback** (not only complaints) with a simple capture form, and shall summarise it in the management review pack. | Record five feedback entries; the pack shows the summary. |

### M15.8 Field table — Complaint

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Complaint number | System-generated | Yes | Own series |
| Date and time received | Date-time | Yes | |
| Received by | Link to staff | Yes | |
| Channel | In person / Telephone / Letter / Email / Customer portal / Through CSTRI or CSB / Other | Yes | |
| Complainant | Link to customer, or name and contact if not a customer | Yes | |
| Related report | Link | No | |
| Related sample / test | Link | No | |
| Complaint category | Result disputed / Delay / Sample handling / Billing / Staff conduct / Confidentiality / Report content or error / Personal data / Other | Yes | |
| Complaint text | Long text | Yes | In the complainant's own words where possible |
| Attachments | Files | No | |
| Relates to our laboratory activities | Yes / No plus rationale | Yes | See M15-18 |
| Acknowledged on / by / channel | Date, link, list | Yes | |
| Investigated by | Link | Yes | Must not be a person involved in the disputed work for the closure approval |
| Investigation findings | Long text | Yes | |
| Validity | Valid / Partly valid / Not valid | Yes | |
| Decision and remedy | Long text | Yes | |
| Linked Nonconformity | Link | Conditional | Required where Valid or Partly valid |
| Outcome communicated on / by / channel | Date, link, list | Yes | |
| Closure approved by | Link | Yes | Independence checked per M15-20 |
| Escalated externally | Body, reference, date | No | |
| State | Received / Under investigation / Awaiting customer / Resolved / Closed / Closed as out of scope | Yes | |

### M15.9 Management review pack — what the system collects automatically

| Input | Source module |
|---|---|
| Number of samples received, tested, reported, rejected, withdrawn, in the period | M20 registers |
| Turnaround time performance: on-time percentage, median and 90th-percentile net turnaround, by test and by section | M20 |
| Turnaround breaches with reasons | M20 |
| Volume and revenue by test, by customer category and by month | M17, M20 |
| Zero-charge advisory and internal research work volume | M17 |
| Complaints: number, category, validity, time to close, escalations | M15 |
| Nonconformities: number by source and risk level, open and overdue | M15 |
| Corrective actions: open, closed, overdue, effectiveness checks pending | M15 |
| Quality control: number of control runs, breaches, dispositions | M15 |
| Proficiency testing and inter-laboratory comparison: rounds, scores, outcomes, coverage gaps against the two-year plan | M15 |
| Internal audit: audits completed, findings by clause, findings open | M15 |
| Report amendments and withdrawals, with reasons — the amendment rate is a quality indicator | M20 |
| Equipment: calibration compliance percentage, overdue calibrations, breakdowns, downtime hours, impact analyses run | M11 |
| Consumables: expired write-offs, stock-outs, batch impact analyses run | M12 |
| Personnel: authorisations added, ended, suspended; assessments due and overdue; segregation-of-duty override count; single-point-of-failure methods | M13 |
| Method changes: versions activated, superseded, withdrawn; deviations approved | M14 |
| Environmental excursions and actions taken | M16 |
| Overrides used, by type and by person | M21 audit trail |
| Customer feedback summary | M15 |
| Risk register: new risks, risks whose rating changed, overdue reviews | M15 |
| Information system: incidents logged, backup and restore test results, user access review outcome, change-control records | M21 |
| Actions from the previous management review and their status | M15 |

### M15.10 Rules and edge cases

1. **A control fails and the run has already been reported.** The withhold in M15-04 cannot help. The correct route is Nonconformity → Impact Analysis → report amendment or withdrawal → customer notification and recall. The system must make this the obvious path, not an afterthought.
2. **A control fails because the control material has expired.** This is a consumables problem (M12), not a testing problem. The disposition should record it as such and the corrective action should address stock control, not testing technique.
3. **No proficiency testing provider exists for silk grading.** Likely, in practice. Use inter-laboratory comparison with another CSB unit and record it as the coverage. Record honestly that no accredited provider exists; do not leave the matrix cell blank.
4. **A complaint about the grade, from the buyer rather than the customer.** The complainant is not the laboratory's customer. Log it; decide whether it relates to laboratory activities; be careful, because information about the customer obtained from a third party is confidential between that source and the laboratory, and the source's identity is not disclosed to the customer without the source's agreement (see M21).
5. **The same person is Quality Manager, Lab In-Charge and Approving Authority.** In a very small unit this is possible. Where that person falls inside the involvement set of the disputed work, M15-20a applies: closure requires an external reviewer — for example an officer from CSTRI or another unit — recorded as the independent approver, with a login of limited scope or with the approval recorded on their behalf and the evidence attached.
6. **A Nonconformity with no root cause found.** Allowed, but the root cause field must say so explicitly, and the corrective action must then be a monitoring action with a review date rather than a blank closure.
7. **Auditing your own work.** In a three-person unit, unavoidable in part. Record the conflict, and prefer an auditor from another CSB unit for the clauses where the conflict is worst.

**OPEN-Q13:** Does the unit currently participate in any proficiency testing or inter-laboratory comparison, run by CSTRI or otherwise? — *Recommended default:* build the register and the two-year plan; assume participation is through CSTRI-organised inter-laboratory comparison until told otherwise.

**OPEN-Q14:** What retained or control material could serve as the internal quality control sample for the Limited Test, and does one exist? — *Recommended default:* propose a retained, well-characterised skein lot re-tested weekly, with the centre line and limits established from twenty initial runs; this is a decision for the scientist and must not be assumed.

---

## M16. Environment Monitoring

**What this module is for, in plain words.** Silk absorbs and releases moisture with the air around it, and its measured weight, strength and stretch change accordingly. Textile testing therefore has to be done in a controlled atmosphere, and the specimen has to be left in that atmosphere long enough to settle before it is tested. If the room was too humid, the result is not defensible. This module records the temperature and relative humidity of each area, checks them against the limits the method requires, tells the laboratory when they drift out, and — the important part — **attaches the conditions at the time of test to the test result**, so a report can state the conditions and an auditor can see them.

An important warning about words. The word "conditioning" means two different things in this building and they must never share a field name:
- **Commercial conditioned mass** — the oven-dry weight of raw silk plus 11 percent, used to settle a commercial invoice weight. That belongs to the testing modules, not here.
- **Pre-conditioning of a specimen** — leaving a test specimen in the standard atmosphere for a set number of hours before testing it. That belongs here.

### M16.1 Screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Area Master | Lab In-Charge | Define each room, chamber or bench area that is monitored |
| Area Limits | Lab In-Charge, Quality Manager | Temperature and humidity limits per area, with effective dates |
| Condition Reading Entry | Tester, any staff on duty | Record a temperature and humidity reading |
| Conditions Log (view and print) | All staff, auditors | The register of readings for an area over a date range |
| Excursion Register | Quality Manager, Lab In-Charge | Every reading outside limits, with the action taken |
| Specimen Pre-conditioning Tracker | Tester | Which specimens are conditioning, in which area, from when, until when |
| Reading Schedule | Lab In-Charge | When readings are due; missed-reading alerts |
| Data Logger Import | Administrator | [LATER] Import a comma-separated file from a logger |

### M16.2 Requirements

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M16-01 | [MUST] | The system shall hold an **Area Master**: area code, name, type (testing room / conditioning chamber / oven room / store / sample retention store / office), the instrument used to measure the conditions (a link to M11), and whether the area is under active control (air conditioning, humidifier) or simply monitored. | Create three areas of different types; each appears in the reading-entry area picker. |
| M16-02 | [MUST] | The system shall hold **limits per area** with effective dates: temperature minimum and maximum, relative humidity minimum and maximum, and optionally a target with a tolerance. Limits shall be data, not code, and changing them shall require a reason and remain in history. | Change a humidity limit; both the old and the new limit are visible with dates. |
| M16-03 | [MUST] | The default limits offered for a textile testing area shall be the **standard atmosphere for testing textiles as used in India: 27 °C ± 2 °C and 65 percent ± 2 percent relative humidity**, presented as an editable default and clearly labelled as the Indian variant of the standard atmosphere. | Create a testing area; the limits pre-fill with 25–29 °C and 63–67 percent, editable. |
| M16-04 | [MUST] | Where a **method version** declares its own environmental requirement (M14-10), that requirement shall take precedence over the area default for tests performed under that method, and the system shall evaluate the test against the method's requirement. | A method requiring a tighter tolerance is used in a room within the wider area limits but outside the method's; the test is flagged. |
| M16-05 | [MUST] | **Manual reading entry shall be the version 1 method.** A reading shall record: area, date and time, temperature, relative humidity, the measuring instrument, the person recording, and remarks. | Record one reading; it appears in the log within one action. |
| M16-06 | [MUST] | The system shall hold a **reading schedule** per area (for example twice per working day, or hourly for a chamber) and shall alert when a scheduled reading is missed. | Miss a scheduled reading; an alert is generated and the log shows a gap marker. |
| M16-07 | [MUST] | Readings shall carry a server-generated timestamp for when they were **entered**, separate from the **observed** date and time. Where the two differ by more than a configurable tolerance (default 2 hours) the system shall require a reason. | Enter a reading for yesterday; a reason is required and both timestamps are stored. |
| M16-08 | [MUST] | A reading outside the applicable limits shall automatically create an **Excursion record** requiring: what happened, the suspected cause, the immediate action, whether any test in progress was affected, whether any result must be withheld or repeated, who decided, and when. | Record a reading at 72 percent humidity; an excursion record opens and appears on the Quality Manager's list. |
| M16-09 | [MUST] | An excursion outside a **method's** stated requirement, where testing was in progress under that method, shall create a **Nonconformity** record (M15) automatically and shall place the affected tests in a Withheld state pending disposition. | Cause such an excursion; the affected tests cannot be verified until dispositioned. |
| M16-10 | [MUST] | **Every test result shall be linked to the environmental conditions at the time of test**: the area, and the reading nearest in time before the observation together with the reading nearest after, or the logger record covering the period. The linked conditions shall be printable on the report where the method or the customer requires it. | Open any completed test; the conditions at test are shown and print on the report. |
| M16-11 | [MUST] | Where **no reading exists** covering the period of a test in a monitored area, the system shall flag the test at submission and require an acknowledgement with a reason from the tester, and shall list such tests for the Quality Manager. | Submit a result in a period with no reading; the flag and the reason are captured, and the test appears on the "conditions not recorded" list. |
| M16-12 | [MUST] | The system shall track **specimen pre-conditioning**: which sample or sub-sample is conditioning, in which area, the start date and time, the required duration from the method version, and the computed earliest permitted test time. The system shall **block** the start of a test before that time. | Start pre-conditioning with a 24-hour requirement; attempt to start the test after 6 hours; refused with the earliest permitted time shown. |
| M16-13 | [MUST] | Pre-conditioning time shall be included in the due-date calculation for the test, so the promised date is honest. | Order a test with a 24-hour pre-conditioning requirement; the due date reflects it. |
| M16-14 | [MUST] | The system shall produce a **printable conditions log** for any area and date range, showing every reading, the limits in force, excursions highlighted, missed readings marked, and the filter criteria printed on the output. This is the document an auditor asks for. | Print the log for last month; it shows all of the above on one continuous PDF. |
| M16-15 | [SHOULD] | The system shall show a simple **chart** of temperature and humidity over time per area, with the limit lines drawn. | Open the chart for one area for one month; excursions are visually obvious. |
| M16-16 | [SHOULD] | The system shall record **corrective and preventive maintenance of environmental equipment** (air conditioner, humidifier, dehumidifier) through the equipment maintenance log in M11, and shall show the equipment's downtime alongside the excursion record so the connection is visible. | An excursion during an air-conditioner breakdown shows the breakdown reference. |
| M16-17 | [MUST] | Readings and excursion records shall never be edited destructively. A wrong reading is voided with a reason and a corrected reading is added; both remain visible. | Void a reading; it remains in the log marked VOID with the reason and the replacement reference. |
| M16-18 | [LATER] | The system shall import readings from a **data logger** file (comma-separated or the logger vendor's export), with a configurable column mapping per logger, retaining the source file as an attachment with its checksum, and marking imported readings with the source. | Import one logger file; readings appear marked "imported", and the source file is attached. |
| M16-19 | [LATER] | Where a logger is used, the system shall reconcile logger readings against any manual readings for the same period and flag disagreements beyond a configurable tolerance. | Import a file that disagrees with a manual reading by 3 °C; a disagreement is flagged. |
| M16-20 | [SHOULD] | The system shall record the **oven temperature** used for conditioned-mass and conditioned-size work (the standard requires a specified oven temperature) as an equipment reading rather than a room reading, and shall link it to the test in the same way. | Record an oven temperature at the start and end of a drying run; both link to the test. |

### M16.3 Field table — Condition Reading

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Area | Link | Yes | |
| Observed date and time | Date-time | Yes | The moment the reading was taken |
| Entered date and time | Date-time | System | Server clock; not editable |
| Temperature | Number, 1 decimal, °C | Yes | |
| Relative humidity | Number, 1 decimal, percent | Yes | |
| Measuring instrument | Link to M11 | Yes | Must be in calibration at the observed time |
| Source | Manual / Imported | System | |
| Recorded by | Link to staff | Yes | |
| Within limits | Yes / No | System-computed | Against the limits in force at the observed time |
| Excursion record | Link | Conditional | Created automatically where out of limits |
| Back-entry reason | Text | Conditional | See M16-07 |
| Remarks | Text | No | |
| Void marker, reason, replaced by | — | No | See M16-17 |

### M16.4 Rules and edge cases

1. **The room is not air-conditioned at all.** Then it is *monitored* rather than *controlled*, and many results will be outside the standard atmosphere. This is a real possibility at a district unit and the system must handle it honestly: record the conditions, record the excursion, and let the laboratory decide whether the affected tests can be reported and what caveat the report must carry. Do not set limits so wide that nothing is ever an excursion — that defeats the purpose.
2. **The measuring instrument is a wall hygrometer of unknown accuracy.** It is still an instrument in M11 and it still needs a calibration decision. If it is not calibrated, record *Requires calibration = No* with the reason, and understand that the environmental record then carries limited weight. This is worth saying plainly to the scientist.
3. **A power cut.** The air conditioning stops, the humidity climbs, and nobody is taking readings because the lights are off. The missed-reading alert (M16-06) is what catches this. The excursion record should reference the power failure.
4. **Pre-conditioning across a weekend.** The computed earliest permitted test time is an absolute clock time and takes no account of working days. A 24-hour pre-conditioning started on Saturday morning is complete on Sunday morning whether anyone is present or not. The due-date calculation, by contrast, uses working time. Keep the two calculations separate.
5. **Specimen removed from the conditioning area and left on a bench.** The system cannot detect this. The pre-conditioning record should therefore capture *removed at* as well as *placed at*, and the method's rule about how long a conditioned specimen may be out of the atmosphere before testing should be recorded in the method version.
6. **Retrospective conditions for a paper-based backlog.** When the laboratory enters last month's worksheets, the conditions may be on the paper record. Allow entry with the observed time and the back-entry reason. Where no conditions were recorded at all, the flag in M16-11 must appear on the test and the laboratory must accept the consequence rather than invent a plausible number.
7. **Two areas, one test.** Winding in one room, weighing in another. The method version should declare which area applies to which activity, and the test record should link the conditions of the area where each observation was made. In version 1 a single linked area per test is acceptable, with the others recorded in remarks.

**OPEN-Q15:** Is the testing area at Dharmavaram air-conditioned and humidity-controlled, and what instrument measures the conditions? — *Recommended default:* assume a monitored, not controlled, room with a wall-mounted thermometer and hygrometer; configure manual readings twice per working day; set the default limits to the Indian standard atmosphere but expect frequent excursions and design the excursion workflow to be quick to complete rather than punitive.

**OPEN-Q16:** Does the laboratory pre-condition specimens today, and for how long, for each test? — *Recommended default:* record the requirement per method version from the standard (24 hours for the physical tests where the standard requires equilibrium conditioning) and let the actual practice be recorded honestly against it; where practice differs, treat it as a method deviation under M14-16 rather than adjusting the method silently.

---

## M17. Billing, Payments and Government Receipts

**What this module is for, in plain words.** This module turns testing work into money received and accounted for, in a way a government auditor will accept. It applies the approved rate card, works out the charge, takes the money in whatever form it arrives — cash at the counter, a demand draft, a bank transfer, an online payment, a government challan — records the correct reference numbers for each of those routes, matches the money to the test order, raises the tax invoice, and follows up what is unpaid. Two things make this harder than ordinary commercial billing. First, the laboratory is part of a statutory body, so the money route may be a government account with its own document types and reference numbers. Second, the tax position on laboratory testing by such a body has aspects the research could not settle, so this document states those as questions with recommended defaults rather than as facts.

**Recommendation on ownership, stated up front.** CloudZoo ERP should own the **accounting ledger** — the tax invoice as a posted accounting document, the receipt as a posted accounting document, the credit note, the tax masters, and the general ledger. The LIMS should own the **commercial decision and the link to the work** — which rate applies, what the charge is, which test each charge line belongs to, whether the report may be released, and the reconciliation of money against orders. The reason is simple: only the LIMS knows which test a rupee belongs to, and only the ERP can post to a ledger. Full table in M22.

### M17.1 Screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Rate Card Register | Accounts, Lab In-Charge | Approved rate schedules with effective dates and approval reference |
| Rate Card Lines | Accounts | Price per test per customer category per method |
| Charge Estimate / Proforma | Front Desk | Priced estimate given to the customer before work |
| Advance Demand and Receipt Voucher | Accounts | Demand for advance; the document issued when advance money is taken |
| Money Receipt (counter receipt) | Accounts, Front Desk | The laboratory's own numbered receipt for money tendered |
| Payment Entry | Accounts | Record one tender of money with its route-specific references |
| Awaiting Credit Worklist | Accounts | Money tendered but not yet confirmed in the bank |
| Bank / Portal Statement Import and Match | Accounts | Import a statement or portal report and match lines to payments |
| Tax Invoice | Accounts | The tax document raised on completion |
| Credit Note / Refund Voucher | Accounts, Approving Authority | Reversal for cancelled, non-performable or over-charged work |
| Customer Ledger | Accounts | Running account per customer: charges, receipts, advances, balance |
| Outstanding and Ageing | Accounts, Lab In-Charge | What is unpaid and how old |
| Payment Hold and Override | Accounts, Lab In-Charge | The rule that holds a report until payment, and the logged override |
| Daily Collection Register and Handover | Accounts | Cash and instruments received today, and the handover to the cash book |
| Financial-Year Series Register | Accounts, Administrator | Every numbered financial document series with its gaps report |

### M17.2 Requirements — rate cards and charge computation

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M17-01 | [MUST] | The system shall hold **versioned rate cards**: code, name, the approving authority's reference (for example a headquarters office order number), approval date, effective-from date, effective-to date, and an active flag. A rate card row, once used on an issued document, shall never be edited; it is superseded by a new card. | Create a rate card, issue an invoice against it, then attempt to change the price; refused, with "supersede instead" offered. |
| M17-02 | [MUST] | A rate card line shall be keyed by **test plus method plus customer category**, not by test alone, because the same physical test is priced differently under different standards and for different classes of customer. | Enter two lines for cohesion, one under the Indian Standard method and one under the International Silk Association method, at different prices; both save and both are selectable according to the method chosen. |
| M17-03 | [MUST] | The system shall support these **customer categories** as configuration, extensible without code: reeler; twister; weaver; handloom weaver; handloom co-operative; trader; exporter; corporate or producer; state government department; another CSB unit; internal research (zero charge); student or training; scheme-linked; other. | Add a new category in configuration; it becomes available on the customer master and on rate card lines. |
| M17-04 | [MUST] | The system shall support the **charging bases** the research identifies, per rate card line: per test per sample or lot; per test with a stated minimum sample size; per measurement point; per physical unit of material (per thousand cocoons, per warp); per year (machine rental); per consignment value band; and a form-based surcharge (for example an extra amount where yarn is presented in hank form). | Create one line of each basis; the charge computes correctly for each on a test order. |
| M17-05 | [MUST] | Where a rate card line states a **minimum sample size**, the system shall warn at sample receipt if less is received, and shall not silently charge for a test it cannot perform. | Receive 3 skeins where 5 are the minimum; a warning appears and the order line is flagged. |
| M17-06 | [MUST] | The system shall compute the charge for an order as the sum of its lines, applying the rate card in force **on the order date**, and shall store the computed unit price on each order line as a snapshot so later rate changes do not alter it. | Change a rate after an order is accepted; the order's price does not change. |
| M17-07 | [MUST] | The system shall support an **urgent or express priority** with a configurable multiplier or flat addition per rate card line, and configurable eligibility rules: a daily cap on the number of samples, a booking cut-off time, and a restriction to tests that can be completed within a stated number of hours. Where the rules are not met, the priority shall not be selectable. | Configure a cap of 5 samples, an 11:00 cut-off and a 6-hour test limit; attempt a sixth urgent sample at 11:30; refused with the reason. |
| M17-08 | [MUST] | The system shall support **zero-charge** orders for internal research samples, samples from other CSB units where the charge is collected elsewhere, and any category the laboratory marks as advisory. A zero-charge order shall still produce a full test record and a report, and shall **not** produce an invoice. | Create an internal research order; a report is issued; no invoice exists; the order appears in the zero-charge volume report. |
| M17-09 | [MUST] | The system shall support **inter-unit work** where the receiving unit, the testing unit and the billing unit differ, and shall record all three on the order. | Create an order received here, tested at another unit, billed here; all three are recorded and appear on the statutory return. |
| M17-10 | [MUST] | The system shall support a **concession or waiver** with: the amount or percentage, the reason from a controlled list, the approving officer, and the approval reference. Waivers above a configurable limit shall require the Approving Authority. | Apply a waiver above the limit as Accounts; refused; the same waiver by the Approving Authority succeeds and is logged. |
| M17-11 | [MUST] | The system shall produce a **priced estimate or proforma** before work, listing each test, the method, the quantity, the unit price, any surcharge, the tax treatment, and the total, with a validity date; and it shall carry the payment instructions including, where the government challan route is used, the exact reference the customer must quote (see M17-22). | Print an estimate; it carries the reference instruction and a validity date. |
| M17-12 | [MUST] | Where the order is amended after acceptance (a test added or removed), the system shall re-price, produce a revised estimate, and require a fresh acceptance record before the added work starts. | Add a test to an accepted order; the revised estimate is produced and the added test cannot start until acceptance is recorded. |

### M17.3 Requirements — money receipt, government routes and reconciliation

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M17-13 | [MUST] | The system shall record one **Payment** record per tender of money, with a payment mode from: Cash; Demand draft; Cheque; Bank transfer (National Electronic Funds Transfer or Real Time Gross Settlement); Unified Payments Interface; Payment gateway; Government non-tax receipt portal challan; Bank collection product. | Record one payment of each mode; each saves with its own reference set. |
| M17-13a | [MUST] | **Every payment mode in M17-13 is a movement of money.** The Daily Collection Register (M17-24) and the collection-versus-remittance reconciliation (M17-25) shall be computed only over Payment records, and no non-monetary settlement shall ever create a Payment record, consume a Money Receipt number (M17-16), or appear in either report. | Grant a full waiver and apply an advance on the same day; the day's Daily Collection Register total equals the cash and instruments physically handed over, and the period reconciliation difference is nil. |
| M17-13b | [MUST] | **Application of an advance.** Applying an existing advance to an order shall be recorded as a row in the "Applied to orders" child table of the originating advance Payment (M17.6), which shall carry a link to that Payment. It shall not create a new Payment record. The advance is counted as money received once, on the date it was tendered. | Post one advance of Rs 10,000 and consume it across three orders; the customer ledger (M17-21) is correct at each step, exactly one Payment record exists, and the collection register shows the Rs 10,000 only on the day the advance was tendered. |
| M17-13c | [MUST] | **Waiver.** An approved concession or waiver (M17-10) reduces the charge; it is never a receipt. Before the invoice is raised, it shall be applied at pricing and shall appear in the concession column of M17-49. After the invoice is raised, the only instrument is a credit note under M17-35, referencing the waiver approval; the invoice-correction constraints of M17-36 apply unchanged. A waiver shall never reduce the amount shown as due on an issued tax invoice by a ledger entry alone. | Grant a waiver before invoicing; the invoice is raised net and the concession column shows the amount. Grant one after invoicing; the system requires a credit note and refuses a bare ledger adjustment. |
| M17-14 | [MUST] | Each payment shall be able to carry **any number of reference values**, each with a type, a value, a date, who captured it, how it was captured (typed by staff / received from a portal / imported from a bank statement), and an evidence file. The reference types shall include at minimum: government portal transaction reference; government receipt document number; government challan document number; the purpose string selected on the government portal; the paying-and-accounts-office code; the drawing-and-disbursing-office code; the bank's unique transaction reference; the bank transfer reference; demand draft number; cheque number; bank deposit slip reference; bank collection reference; internet banking reference; payment gateway order identifier; payment gateway transaction identifier; the retrieval reference number of a Unified Payments Interface transaction; the electronic receipt number; and the booking identifier from the parent institute's national testing portal. | Record a government challan payment with five different reference values; all five save with their types and evidence. |
| M17-15 | [MUST] | Each payment shall have a **status** from: Tendered; Awaiting credit; Credited; Dishonoured; Refunded; Reversed. Money is only treated as received for the purposes of the payment-hold rule when it is *Credited*, or when the Lab In-Charge or the Approving Authority has explicitly released against a provisional receipt (see M17-20). | Record a demand draft as Tendered; the payment-hold rule still holds the report until the draft is marked Credited or released. |
| M17-16 | [MUST] | The system shall issue its own numbered **Money Receipt** for money tendered at the laboratory, in a gap-free financial-year series, printed with a format number, showing the amount in figures and words, the mode, the references, the order or orders it relates to, and the receiving officer's name. | Take cash at the counter; a numbered receipt prints; the number is the next in the series. |
| M17-17 | [MUST] | The Money Receipt series shall be **separate from the tax invoice series** and shall never be reused. A cancelled receipt retains its number, marked cancelled, with a reason. | Cancel a receipt; the number is not reissued; the cancellation and reason appear on the daily collection register. |
| M17-18 | [MUST] | The system shall maintain an **Awaiting Credit worklist** of payments that are Tendered but not yet Credited, aged, so that unreconciled demand drafts and bank transfers are visible. | Two drafts awaiting deposit appear on the list with their ages. |
| M17-19 | [MUST] | The system shall support **import of a bank statement or a payment portal report** (comma-separated or spreadsheet) and a manual matching screen supporting: one payment to one order; one payment to many orders; many payments to one order; and part payment. Unmatched statement lines shall remain visible until resolved. | Import a statement with four lines; match three; the fourth remains on the unmatched list. |
| M17-20 | [MUST] | The system shall permit the **Lab In-Charge or the Approving Authority** to **release work against a provisional receipt** — money evidently tendered but not yet confirmed credited — recording who released it, when and why. Accounts may raise the request; no other role may release. This reflects the practical reality that settlement takes one or two days while the customer wants the test today. | Release one order against a provisional receipt; the release, actor and reason are recorded and appear on an exception report. |
| M17-21 | [MUST] | The system shall maintain a **customer running account (ledger)**: charges raised, advances received, receipts applied, credit notes, refunds and the balance, so a regular customer sending many samples a month is not forced into one payment per sample. | Post an advance, consume it across three orders; the ledger balance is correct at each step. |
| M17-22 | [MUST] | Where the customer pays through a government portal that offers a free-text remarks field, the system shall print on the estimate and the demand the **exact laboratory reference the customer must enter in that field**, and shall store it on the order as the expected payer remark, so that reconciliation can match on it. | Print an estimate; it instructs the customer to quote the order reference; the reconciliation screen offers matching by that reference. |
| M17-23 | [SHOULD] | Where the payment mode is a government portal challan, the system shall warn if a **refund request** is raised later than the portal's stated window (the research indicates fifteen days from the transaction) so that staff know a refund may no longer be possible through that route. | Raise a refund 20 days after such a payment; a warning appears. |
| M17-24 | [MUST] | The system shall produce a **Daily Collection Register**: every payment received today by mode, with references, the total, the receipts issued (including cancelled ones), and a handover section for the officer receiving the cash and instruments, with a signature line. It shall also produce a reconciliation of collection against deposit. | Print today's register at close of counter; totals per mode reconcile to the individual entries. |
| M17-25 | [MUST] | The system shall produce a **collection versus remittance reconciliation** for a chosen period: money received, money deposited or credited, and the difference with an ageing of undeposited items. | Run for one month; undeposited drafts are listed with their ages. |
| M17-26 | [MUST] | Payments, receipts and their references shall never be deleted. A wrong entry is reversed with a reason and both entries remain visible. | No delete action exists; a wrong receipt is reversed and both records stand. |

### M17.4 Requirements — tax invoice, credit note and refund

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M17-27 | [MUST] | The system shall raise a **tax invoice** carrying every field required by the tax rules: supplier legal name, address and registration number; the invoice number and date; the recipient's name, address and registration number where registered; for an unregistered recipient above a configurable value threshold, the recipient's name and address, address of delivery, and the name and code of the state; the service classification code; the description of the service; quantity and unit where applicable; total value; taxable value after any discount; the rate of tax shown separately for each component; the amount of tax shown separately for each component; the place of supply with the state name for an inter-state supply; the address of delivery where it differs; whether tax is payable on a reverse-charge basis; and the signature or digital signature of the supplier or the authorised representative. Amounts shall also be shown in words. | Print an invoice; every field above is present or shown as not applicable with a reason. |
| M17-28 | [MUST] | The invoice number shall be **consecutive, at most sixteen characters, composed only of letters, digits, hyphen and slash, and unique within the financial year**. The series shall reset at the start of each financial year. The system shall refuse to save a series definition whose maximum possible number would exceed sixteen characters. | Define a series `DVM/INV/2026-27/{5 digits}`; save is refused as too long; `DVM/2627/{5 digits}` is accepted. |
| M17-29 | [MUST] | The system shall hold **one registration record per tax registration number** the parent body holds, with the state, state code, registered address and effective dates, and shall link each unit to the registration under which it bills. The tax component split shall be computed by comparing the **supplier's registration state** with the **place of supply state**, never by a clerk ticking a box. | Change the linked registration from one state to another; an invoice to a customer in the first state changes from an intra-state split to an inter-state single tax automatically. |
| M17-30 | [MUST] | The **tax treatment per rate card line** shall be one of: taxable at a configured rate; exempt with a reason and notification reference; nil-rated; not liable to tax; or tax payable by the recipient on a reverse-charge basis. The rate shall be held in a dated tax master, never written into program code. | Change the configured rate in the tax master with a new effective date; invoices before that date keep the old rate. |
| M17-31 | [MUST] | The **service classification code** shall be held per rate card line, not once for the whole invoice, because the laboratory sells items that are not testing at all — machine rental, warping, cocoon stifling, test dyeing — which are classified differently. | Create an invoice with a testing line and a machine-rental line; each carries its own classification code. |
| M17-32 | [MUST] | Where advance money is taken for a service, the system shall issue a **receipt voucher** carrying: supplier name, address and registration; a consecutive number of at most sixteen characters unique in the financial year; the recipient's details; the date; the description; the amount of advance received; the rate of tax; the amount of tax by component; the place of supply with state name and code for an inter-state supply; whether tax is on reverse charge; and the signature. | Take an advance; a receipt voucher is issued with its own series, distinct from the money receipt and the invoice. |
| M17-33 | [MUST] | Where an advance is taken and the service is not supplied, the system shall issue a **refund voucher** that **references the number and date of the receipt voucher** it reverses, as a hard link, not a free-text note. | Refund an advance; the refund voucher shows the receipt voucher number and date, and the link is navigable. |
| M17-34 | [MUST] | The system shall support a **bill of supply** for exempt or nil-rated supplies, in its own financial-year series with the same sixteen-character rule. | Invoice an exempt test; a bill of supply is produced, not a tax invoice. |
| M17-35 | [MUST] | The system shall support a **credit note** referencing the original invoice number and date, with a reason from a controlled list (test not performed; sample rejected; sample insufficient; equipment unavailable; customer withdrew; over-charged; rate applied wrongly; concession or waiver approved under M17-10; other with text), an approver, and where a refund of money follows, a link to the refund payment. | Cancel a test after invoicing; a credit note is raised referencing the invoice; the ledger balance updates. |
| M17-36 | [MUST] | An invoice shall be **cancellable only before it has been included in a filed tax return**; thereafter the only correction instrument is a credit note. The system shall hold, per registration and per return period, the date up to which returns have been filed, and shall enforce this. | Set returns filed to 31-Jul-2026; attempt to cancel a July invoice; refused, with the credit note route offered. |
| M17-37 | [MUST] | The system shall produce a **series register with a gaps report**: for every financial document series, every number from the first to the last allotted, and its state — Issued, Cancelled, or **Missing**. A Missing entry shall raise an alert. | Force a gap in a test environment; the gaps report shows it and an alert is raised. |
| M17-38 | [MUST] | A financial document number shall be allotted **at the moment the document is committed**, inside the same database transaction, never when a user opens a blank form. Abandoned drafts shall consume no numbers. | Open five invoice forms and abandon them; no numbers are consumed. |
| M17-39 | [MUST] | Every issued financial document shall be stored as the **exact rendered file** (portable document format) that was issued, with a checksum, and shall be re-served from that stored file rather than re-generated. | Change the invoice template; reprint an old invoice; it renders exactly as first issued. |
| M17-40 | [SHOULD] | The invoice record shall carry empty, ready fields for **electronic invoicing** through the government's invoice registration system — the invoice reference number, the acknowledgement number and date, the signed invoice payload, the signed quick-response payload, and the status — so that integration later is a background job rather than a redesign. | The fields exist and are nullable; the invoice prints correctly with them empty. |
| M17-41 | [MUST] | The service classification code shall be stored to at least **six digits**, as required above the turnover threshold, and the system shall not truncate it. | Enter a six-digit code; it prints in full. |

### M17.5 Requirements — payment hold, outstanding and follow-up

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M17-42 | [MUST] | The payment gate is the configuration rule **`payment_release_rule`** defined in **WF-5**, which owns it entirely: its three values, the level at which it is set, and the order in which those levels are evaluated. This module does not restate them and shall not key the gate to customer category on its own. What this module owns is the effect: where WF-5 resolves to *Required before report release*, report issue is blocked while the balance is unpaid; where it resolves to *Required before testing begins*, the Hold-for-Payment state applies before work starts; and either block is the explicit commercial hold of M17-44, overridable only under M17-43. | Set the rule as WF-5 describes and confirm that a report for an order the rule holds cannot be issued while the balance is unpaid, that the hold is shown as a commercial hold, and that this module contains no second copy of the rule or of its values. |
| M17-43 | [MUST] | The payment hold shall be **overridable only by the Approving Authority**, as WF-41 requires, with a mandatory reason from a controlled list, and every override shall be logged and shall appear on an exception report reviewed at the management review. Only Accounts may set or clear the hold reason itself; the Section Head may neither clear the hold nor override it. | Override once as the Approving Authority; the report issues; the override appears on the exception report with the reason and the actor. Attempt to clear the hold as the Section Head; refused. |
| M17-44 | [MUST] | The payment hold shall be an **explicit, visible, separately-recorded commercial hold**, distinct from any technical hold. A commercial hold shall never silently suppress or influence a technical release decision, and the two shall be shown separately on the order screen. | Place a commercial hold; the technical verification of results still proceeds and is recorded; only the report issue is held. |
| M17-45 | [MUST] | Time spent on a payment hold shall be **excluded** from the laboratory's turnaround measurement, and the due date shall move forward by the duration of the hold. | Hold an order for three working days; the due date moves by three working days and the turnaround report does not count them as laboratory delay. |
| M17-46 | [MUST] | The system shall produce an **outstanding and ageing report** by customer, in buckets 0–30, 31–60, 61–90 and over 90 days, with the underlying invoices listed. | Run the report; the totals reconcile to the customer ledgers. |
| M17-47 | [SHOULD] | The system shall produce **payment reminder** notifications at configurable intervals after the due date, through the channels in M19. | Configure a reminder at 15 and 30 days; both are generated for an overdue invoice. |
| M17-48 | [SHOULD] | The system shall support **advance deposit accounts** for regular customers, with a minimum balance warning and automatic application of the deposit to new orders. | Set up a deposit; three orders draw on it; a low-balance warning fires at the configured level. |
| M17-49 | [MUST] | The system shall produce a **revenue report by test, by customer, by customer category and by month**, showing quantity, gross charge, concession, net charge and tax, and reconciling to the invoice ledger. | Run the report for one month; the net total equals the sum of invoices for the month. |
| M17-50 | [MUST] | Where the parent institute's national testing portal is used as an order source, the system shall record the **portal booking identifier and the payment already collected there**, and shall not raise a second demand for the same work. | Import or enter a portal-sourced order marked paid; the payment hold does not fire. |

### M17.6 Field table — Payment

| Field | Type | Mandatory | Notes |
|---|---|---|---|
| Payment number | System-generated | Yes | Own series |
| Date and time received | Date-time | Yes | |
| Received by | Link to staff | Yes | |
| Customer | Link | Yes | |
| Amount | Money | Yes | |
| Mode | List (M17-13) | Yes | |
| Status | List (M17-15) | Yes | |
| Credited on | Date | Conditional | Required for status Credited |
| Bank statement line | Link | No | Set at reconciliation |
| Money receipt number | Link | Conditional | Where the laboratory issued its own receipt |
| Applied to orders | Child table: order, amount applied | Yes unless held as an advance | |
| Held as advance | Yes / No | Yes | Where Yes, no order link is required |
| References | Child table (M17-14) | Yes | At least one for non-cash modes |
| Provisional release | Yes / No, by whom, reason | No | See M17-20 |
| Dishonour details | Date, reason, bank charge | Conditional | Where status Dishonoured |
| Remarks | Long text | No | |

### M17.7 Rules and edge cases

1. **The customer pays a round figure for several samples.** Record one payment applied across several orders. The ledger, not the invoice, is the place where this reconciles.
2. **The customer pays twice by mistake.** Record both payments. The excess sits on the customer ledger as an advance, or is refunded through the refund route with the sanction reference recorded. Never delete a payment.
3. **The demand draft bounces.** Set the payment to Dishonoured with the date, the reason and any bank charge. If a report was already released against it, the payment hold cannot help; the follow-up is a commercial matter recorded on the order and on the customer ledger.
4. **A sample is rejected after invoicing.** The correct sequence is: reject the sample; decide whether a handling fee applies; raise a credit note for the balance with the reason "sample rejected"; refund if money was already received, with the sanction reference.
5. **A test cannot be performed because the instrument is down.** Same route as sample rejection, with the reason "equipment unavailable". The Nonconformity in M15 covers the quality side; the credit note covers the money side. Both must exist.
6. **Zero-charge work still consumes capacity.** It appears in every volume report and every workload figure, and it is excluded only from revenue reports. This is deliberate: the research shows the parent institute reports test volume and revenue as separate figures.
7. **The rate card is revised mid-year.** Old orders keep their snapshot prices. New orders use the new card from its effective date. Reprints of old invoices show the old rate. This is not optional; it is how a reprint stays truthful.
8. **Cash at a counter with no cashier present.** Whoever receives the money issues the numbered receipt in their own name. The daily collection register and the handover section are what protect them. Do not allow a shared login for receipt issue (see M21).

**OPEN-Q17:** Where does testing-fee money physically go today — into a bank account of the parent statutory body, or into the government account through a paying-and-accounts office? Which routes are actually in use at Dharmavaram: cash, demand draft, the government non-tax receipt portal, a bank collection product, the national testing portal's gateway? — *Recommended default:* build all routes as described, none as the assumed default; ask the unit's accounts staff and record the answer as a configuration setting. This is the single question with the widest effect on this module.

**OPEN-Q18:** Under which tax registration number does RSTRS Dharmavaram raise invoices, and what registered address is printed on it? The research found a registration for the parent institute in one state, and the unit is in another; it could not confirm a registration in the unit's own state. — *Recommended default:* hold the registration as configuration with the state code driving the tax split; obtain a copy of a recent real invoice from the unit before any invoice template is finalised. **Do not guess.** Everything about the tax split depends on this.

**OPEN-Q19:** Is laboratory testing by this statutory body taxable, and at what rate? The research found the published rate card states that tax is charged in addition, at prevailing rates, and deliberately does not fix a percentage. Secondary sources are consistent on one rate but not unanimous, and one source conflicts. — *Recommended default:* hold the rate in a dated tax master, set it from the figure the parent institute's accounts wing confirms in writing, and print nothing until that confirmation exists. **This document deliberately does not state a rate as fact.**

**OPEN-Q20:** Are any tests exempt — in particular cocoon-related tests, where the material may be treated as agricultural produce? — *Recommended default:* treat every test as taxable at the confirmed rate; provide the exempt option per rate card line with a mandatory reason and notification reference so that a tax adviser's opinion can be applied as data, not code.

**OPEN-Q21:** Is the parent body within the electronic-invoicing requirement, or has it filed an exemption declaration? The research notes that the exemption is written for a "government department" while the tax authority's own position is that a statutory body is not "Government", which leaves a real risk that electronic invoicing applies. If it applies and is not done, the customer may be denied input tax credit — a commercial problem for a laboratory whose customers are traders and exporters. — *Recommended default:* build the invoice electronic-invoicing-ready per M17-40 and obtain a written answer from the parent body's tax adviser before go-live.

**OPEN-Q22:** Retired. The question of whether payment is required before testing or before report release, and whether the answer differs by class of customer, is asked once in Part B as **OPEN-Q-B1**, whose recommended default now covers both the order-type half and the customer-category half. It is not asked again here; the rule itself is `payment_release_rule` in WF-5, applied by M17-42.

---

## M18. Customer Portal

**What this module is for, in plain words.** The portal is the customer's own window into their work at the laboratory. It lets a reeler, twister, weaver or trader ask a question, book a test in advance, print the request form and a label to send with the sample, see where their sample has got to, download the finished report and the invoice, and raise a complaint — without telephoning the counter. It reduces the telephone traffic that consumes the counter staff's day, and it gives the customer a record they can show a buyer. What it must not do is show the customer anything internal: other customers' work, the laboratory's internal notes, staff names on the bench, prices given to anyone else, or the laboratory's own quality records.

Note that the parent institute already operates a national testing portal and mobile application covering this unit. This module should therefore be designed so that it can either stand alone or act as a thin local layer, and so that an order arriving from the national portal is simply one more order source.

### M18.1 Screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Register / Request access | Prospective customer | Ask for a portal account, linked to a customer master record |
| Access Approval | Front Desk, Lab In-Charge | Approve or reject a portal registration and link it to the right customer |
| Home / Dashboard | Customer | Open requests, samples in progress, reports ready, balance due |
| Submit Enquiry | Customer | Ask what a test costs and what is needed, with no commitment |
| Create Test Request | Customer | Book tests in advance of sending the sample |
| Print Request Form and Label | Customer | A printable request form and a pre-filled label to attach to the sample |
| Track Status | Customer | Where each sample has reached, by laboratory reference |
| Download Report | Customer | The issued report, authenticated |
| Download Invoice and Receipt | Customer | Financial documents |
| Payment | Customer | [LATER] Pay online where a gateway or portal route exists |
| Raise Complaint | Customer | Log a complaint that lands in the register in M15 |
| Request Repeat Test or Amendment | Customer | Ask for a retest or a correction to a report |
| Authorised Representatives | Customer | Nominate people who may act for the firm |
| Notification Preferences | Customer | Choose channels and language |
| Consent and Privacy | Customer | See the privacy notice, manage consent, see their own data |

### M18.2 Requirements

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M18-01 | [MUST] | A portal account shall be created only by **registration followed by laboratory approval**, and shall be linked to exactly one customer master record. Self-registration alone shall not grant access to any data. | Register a new account; no data is visible until the Front Desk links and approves it. |
| M18-02 | [MUST] | The approval step shall require the laboratory to **verify the applicant's connection to the customer** (for example against a letter, a visiting card, or a known mobile number already on the customer record) and shall record who approved, when, and on what basis. | Approve one account; the basis of verification is a mandatory field. |
| M18-03 | [MUST] | The portal shall show a customer **only their own records**. Record-level filtering shall be applied in the data layer, not by hiding items in the interface. | Log in as customer A and attempt to open customer B's report by changing the address in the browser; refused, and the attempt is logged. |
| M18-04 | [MUST] | A customer may **submit an enquiry** with a free-text requirement, the material, and an optional quantity; the laboratory replies with an estimate that the customer can see and accept in the portal. | Submit an enquiry; it appears on the Front Desk queue; the priced reply appears on the customer's screen. |
| M18-05 | [MUST] | A customer may **create a test request in advance**, selecting material, tests and methods from the catalogue applicable to that material, stating the number of samples and the quantity per sample, and shall see the estimated charge and the estimated completion date before submitting. | Create a request for three samples of two tests; the estimate and the date appear before submission. |
| M18-06 | [MUST] | The request shall capture the customer's own **declarations** — declared denier or count (including a range such as 18/20), declared variety, declared twist, the producing technology where known (charkha, cottage basin, multi-end reeling, automatic reeling), the customer's own lot or bale mark, the number of bales or books, and any specification the customer wants the result judged against — and shall label them clearly as declared by the customer and not verified by the laboratory. | Submit a request with declarations; they appear on the laboratory's registration screen marked "customer-declared". |
| M18-07 | [MUST] | Where the customer wants a **pass or fail statement**, the request shall capture the specification and the decision rule, and shall require the customer's agreement to that rule before the request is accepted. | Ask for a pass/fail statement; the decision rule must be selected and agreed before submission completes. |
| M18-08 | [MUST] | The portal shall **print the test request form** with a laboratory reference number, and a **pre-filled label** carrying that reference in both human-readable text and a scannable code, for the customer to attach to the sample before sending it. | Print both; the counter scans the label and the request opens immediately. |
| M18-09 | [MUST] | The printed label shall **not** carry the customer's name or firm name, so that it does not defeat the blinding rule in M21. It shall carry the laboratory reference, the material, the number of units and the request date. | Print a label; no customer name appears anywhere on it. |
| M18-10 | [MUST] | The portal shall show **sample status** for each sample by laboratory reference, using customer-facing status words only: Request submitted; Awaiting sample; Sample received; Sample accepted; Testing in progress; Testing complete; Report under approval; Report issued; On hold — awaiting your response; On hold — payment; Sample rejected; Request cancelled. | Move a sample through the internal workflow; the portal shows the mapped customer-facing word at each step. |
| M18-11 | [MUST] | The portal shall **not** show internal notes, internal state names, the names of the tester or verifier, internal remarks, quality records, individual readings before the report is issued, the internal reasons for a hold beyond the customer-facing category, or any other customer's information. | Inspect the data returned to the portal for one sample; none of the listed items is present in the response, not merely hidden in the display. |
| M18-12 | [MUST] | The portal shall allow **download of the issued report** only after authentication, and only the frozen issued file. Superseded reports shall be shown with a clear superseded marker and a link to the current version; withdrawn reports shall be shown as withdrawn. | Amend a report; the portal shows the amendment as current and the original marked superseded. |
| M18-13 | [MUST] | The portal shall allow **download of invoices, bills of supply, receipt vouchers, credit notes, refund vouchers and money receipts** relating to that customer. | Download each document type; each is the frozen issued file. |
| M18-14 | [MUST] | The portal shall allow the customer to **raise a complaint**, attach files, and see its progress and outcome. The complaint shall land in the register in M15 with channel = Customer portal. | Raise a complaint in the portal; it appears in the register and the customer sees the acknowledgement. |
| M18-15 | [MUST] | The portal shall allow the customer to **request a repeat test** or an **amendment to a report**, with a reason. Such a request shall create a task for the laboratory and shall not by itself change any record. The laboratory decides whether the repeat is chargeable and whether an amendment is warranted. | Request a repeat; a task appears for the Lab In-Charge; nothing in the report changes until the laboratory acts. |
| M18-16 | [MUST] | The portal shall allow the customer to **nominate authorised representatives** — named people who may submit requests, collect reports or collect samples on the firm's behalf — with their name, designation, mobile number and validity period, subject to laboratory approval. | Nominate a representative; after approval, the counter screen shows that person as authorised to collect. |
| M18-17 | [MUST] | The portal shall allow the customer to set **notification preferences**: which events they wish to be told about, by which channel, and in which language (English, Telugu, Hindi). | Set preferences; the next notification uses them (see M19). |
| M18-18 | [MUST] | The portal shall display the **privacy notice** as a short standalone page in plain language, in the customer's chosen language, and shall record the version of the notice the customer saw and agreed to. | Register; the notice version and the agreement timestamp are recorded. |
| M18-19 | [MUST] | The portal shall let the customer **see the personal data held about them**, request a correction, and withdraw any consent given for optional purposes such as marketing or inclusion in a published list. Withdrawal of an optional consent shall not affect work in progress. | Withdraw marketing consent while a test is running; the test continues and the marketing flag changes. |
| M18-20 | [MUST] | The portal shall display the laboratory's **grievance contact** and the published time limit for a response. | The contact appears in the footer of every portal page. |
| M18-21 | [MUST] | The portal shall show the customer's **outstanding balance** and the payment instructions applicable to them, including the reference the customer must quote where a government challan route is used. | View the balance; the instruction with the order reference is shown. |
| M18-22 | [SHOULD] | The portal shall allow the customer to **generate a time-limited share link** for an issued report, so that a buyer or a bank can view it without an account, with an expiry and a log of who opened it and when. | Create a share link with a 7-day expiry; access after 7 days is refused; the access log shows the opens. |
| M18-23 | [SHOULD] | The portal shall show a **history** of the customer's past requests, samples and reports, searchable by date, reference and material. | Search for a report from last year by material; it is found. |
| M18-24 | [SHOULD] | The portal shall be usable on a **mobile telephone browser** on a slow connection: server-rendered pages, no large downloads, no dependence on files fetched from outside India. | Load the status page on a throttled connection; it renders within a few seconds. |
| M18-25 | [SHOULD] | The portal shall be available in **English and Telugu** at minimum, with Hindi where required, including correct rendering of Telugu text in any file it produces. | Switch to Telugu; the labels, the printed request form and the label render correctly. |
| M18-26 | [MUST] | Portal access shall be governed by the same authentication rules as staff access where they apply: password policy, lockout on repeated failures, session timeout. A one-time password to the registered mobile number shall be an acceptable second factor. | Enter a wrong password repeatedly; the account locks per the configured policy. |
| M18-27 | [MUST] | The portal shall log every **login, download, share-link creation and share-link access** with the actor, timestamp and address, for the audit trail in M21. | Download a report; the access appears in the audit trail. |
| M18-28 | [MUST] | Where the parent institute's national portal is the order source, the portal shall show the same status and the same report for that order, identified by the national booking reference as well as the local reference. | Enter a portal-sourced order; the customer finds it by either reference. |
| M18-29 | [LATER] | The portal shall accept **online payment** through whichever route the parent body sanctions, and shall record the resulting references automatically against the payment in M17. | Pay online; the payment record carries the gateway references without manual entry. |
| M18-30 | [MUST] | The portal shall be deployable as a **separate front end** from the internal application, so that the internal laboratory system can run with no internet connection while the portal is unreachable, and so that the portal's public surface can be secured and reviewed on its own. | Disconnect the internet; sample receipt, testing, verification and report issue all continue; the portal is unavailable and nothing internal breaks. |

### M18.3 What the customer must NOT see — explicit list

| Item | Reason |
|---|---|
| Any other customer's records, reports, invoices or samples | Confidentiality |
| The name of the tester or the verifier | Internal, and not required on the report |
| Internal remarks, internal hold reasons beyond the customer-facing category, and internal correspondence | Internal working papers |
| Individual raw readings and worksheets before the report is issued | Unapproved data; the report is the released result |
| Any result that has not been verified and authorised | Only reviewed and authorised results are released |
| Quality control results, control charts, proficiency-testing scores | Internal quality records |
| Nonconformity records, corrective actions, internal audit findings | Internal quality records |
| The prices offered to any other customer, or any other customer's concession | Commercial confidentiality |
| Rate card lines for categories the customer does not belong to | Commercial confidentiality |
| Staff records, competency matrix, delegation records | Personnel data |
| Equipment calibration certificates and instrument records | Internal, available to an assessor, not to a customer, unless the laboratory chooses to share |
| The laboratory's internal state names, technical status codes and workflow internals | Confusing and unnecessary |
| The identity of a third party who supplied information about the customer | Required to be kept confidential to the laboratory |
| Any data-store search across customers | Prevents enumeration |
| Internal file numbers, audit trail, system logs | Internal |

### M18.4 Rules and edge cases

1. **Two people from the same firm want access.** Allow several portal logins linked to one customer record, each an authorised representative, each with its own login and its own audit trail. Never a shared login.
2. **A broker submits on behalf of a mill.** The customer of record is the party whose name goes on the report and who is billed. The broker is a sender or an authorised representative. The portal must make this distinction visible at registration, because getting it wrong means the certificate is issued in the wrong name.
3. **A customer disputes a status.** The portal's status is derived from the internal state by a fixed mapping table. Keep the mapping as configuration so the laboratory can adjust the words without a code change, and keep it visible in the documentation so the counter staff and the customer are looking at the same vocabulary.
4. **A customer requests a report that is on payment hold.** The portal shows "On hold — payment" and the balance, with payment instructions. It does not show the report.
5. **A customer asks for their data to be erased while a report is retained.** Technical records and issued reports are retained under a legal and regulatory obligation. Marketing and optional contact data are not. The portal must be able to service the request for the second category without breaking the first, and must say so plainly (see M21).
6. **The laboratory does not want a public portal at all.** Then M18 is deferred and M19's channels carry the customer communication instead. The internal system must not depend on the portal existing.

**OPEN-Q23:** Should this project build a local customer portal at all, given that the parent institute already operates a national testing portal and mobile application listing this unit? — *Recommended default:* build the internal laboratory system first and treat the national portal as an inbound order source; hold the local portal as a later phase, with the reference-tracking and report-download functions as the first parts to build if it is wanted.

**OPEN-Q24:** Will a public-facing web surface be permitted, and on which domain and hosting, and does it require a security audit and a website-quality certification before it goes live? — *Recommended default:* assume yes, assume a security audit by an empanelled auditor is required, and treat the portal and the public report-verification page as a separate deliverable with their own approval gate so they cannot delay the internal system.

---

## M19. Notifications

**What this module is for, in plain words.** People do not watch a screen all day. The system therefore has to tell them when something needs doing or when something has happened: the report is ready, the calibration is due, the stock is low, the approval has been waiting three days. This module is the single place where all of that is defined, so that messages are consistent, they can be switched on and off without changing the program, they are sent in the right language, they are retried if they fail, and every one of them is recorded so that "we told the customer on the 12th" can be proved.

### M19.1 Event-to-notification matrix

Channels: **E** = email, **S** = short message service (SMS), **W** = WhatsApp [LATER], **A** = in-application. Timing "immediate" means within the notification job's cycle (default 15 minutes).

| Event | Recipient | Channel | Template | Timing | Priority |
|---|---|---|---|---|---|
| Enquiry received | Front Desk | A, E | `ENQ_RECEIVED` | Immediate | [MUST] |
| Estimate sent to customer | Customer | E, S | `ESTIMATE_SENT` | Immediate | [MUST] |
| Test request received from portal | Front Desk | A, E | `REQ_RECEIVED` | Immediate | [MUST] |
| Request accepted after review | Customer | E, S | `REQ_ACCEPTED` | Immediate | [MUST] |
| Request declined after review | Customer | E, S; and telephone note by staff | `REQ_DECLINED` | Immediate | [MUST] |
| **Sample received** | Customer | S, E | `SAMPLE_RECEIVED` (carries laboratory reference, tests, expected date, charge) | Immediate | [MUST] |
| Sample received | Front Desk, Lab In-Charge | A | `SAMPLE_RECEIVED_INT` | Immediate | [MUST] |
| **Sample rejected** | Customer | S, E | `SAMPLE_REJECTED` (carries the reason and the options) | Immediate | [MUST] |
| Sample accepted with a recorded deviation | Customer | E | `SAMPLE_DEVIATION` | Immediate | [MUST] |
| Clarification needed from the customer | Customer | S, E | `CLARIFY_NEEDED` | Immediate | [MUST] |
| **Request on hold** (any reason) | Customer | S, E | `REQUEST_ON_HOLD` (carries the customer-facing category only) | Immediate | [MUST] |
| Request released from hold | Customer | S | `HOLD_RELEASED` | Immediate | [SHOULD] |
| Test allocated to a tester | Tester | A | `TEST_ALLOCATED` | Immediate | [MUST] |
| Test not allocated, 25 percent of turnaround elapsed | Section head, Lab In-Charge | A, E | `TEST_NOT_ALLOCATED` | On the alert cycle | [MUST] |
| Test not started, 50 percent elapsed | Tester, Lab In-Charge | A | `TEST_NOT_STARTED` | On cycle | [MUST] |
| Test at risk, 80 percent elapsed | Tester, Lab In-Charge | A, E | `TEST_AT_RISK` | On cycle | [MUST] |
| **Test delayed past due date** | Lab In-Charge; and Approving Authority if more than a configurable number | A, E | `TEST_OVERDUE` | On cycle, once per day | [MUST] |
| Result submitted, awaiting verification | Verifier | A, E | `VERIFY_PENDING` | Immediate | [MUST] |
| Verification pending more than the configured hours | Verifier, Lab In-Charge | A, E | `VERIFY_OVERDUE` | On cycle | [MUST] |
| Result sent back by the verifier | Tester | A, E | `RESULT_SENT_BACK` | Immediate | [MUST] |
| **Approval pending too long** | Approving Authority, Lab In-Charge | A, E | `APPROVAL_OVERDUE` | On cycle | [MUST] |
| **Report ready / issued** | Customer | S, E; portal notice | `REPORT_ISSUED` (carries report number and how to download or collect) | Immediate | [MUST] |
| **Report dispatched** | Customer | S, E | `REPORT_DISPATCHED` (carries mode and any tracking number) | Immediate | [MUST] |
| **Report amended** | Customer | S, E, and a telephone call recorded by staff | `REPORT_AMENDED` (carries both report numbers and the reason category) | Immediate | [MUST] |
| Report withdrawn / recalled | Customer | S, E, and a telephone call recorded by staff | `REPORT_WITHDRAWN` | Immediate | [MUST] |
| **Payment received** | Customer | S | `PAYMENT_RECEIVED` (amount, receipt number) | Immediate | [MUST] |
| **Payment overdue** | Customer | S, E | `PAYMENT_OVERDUE` | At configurable intervals after the due date | [MUST] |
| Payment overdue beyond the escalation age | Lab In-Charge, Accounts | A, E | `PAYMENT_ESCALATION` | Weekly | [SHOULD] |
| Advance deposit balance low | Customer, Accounts | S, A | `DEPOSIT_LOW` | On cycle | [SHOULD] |
| Provisional release used | Lab In-Charge | A, E | `PROVISIONAL_RELEASE` | Immediate | [MUST] |
| **Calibration due** | Equipment custodian, Lab In-Charge | A, E | `CALIB_DUE` | At 60, 30, 15, 7 and 0 days (configurable) | [MUST] |
| Calibration overdue | Equipment custodian, Lab In-Charge, Quality Manager | A, E | `CALIB_OVERDUE` | Daily until resolved | [MUST] |
| Intermediate check due / missed | Tester, Equipment custodian | A | `INTCHK_DUE` | On schedule | [MUST] |
| Calibration failed | Lab In-Charge, Quality Manager, Approving Authority | A, E | `CALIB_FAILED` | Immediate | [MUST] |
| Equipment moved out of service | Lab In-Charge, affected testers | A | `EQUIP_OUT` | Immediate | [MUST] |
| Impact analysis opened / not closed after the configured days | Quality Manager, Approving Authority | A, E | `IMPACT_OPEN` | Immediate, then daily | [MUST] |
| Service contract expiring | Accounts, Equipment custodian | A, E | `AMC_EXPIRY` | 60 and 30 days | [SHOULD] |
| **Competency expiring** | The person, Lab In-Charge | A, E | `COMPETENCY_EXPIRY` | 60, 30 and 7 days | [MUST] |
| Competency suspended automatically | The person, Lab In-Charge | A, E | `COMPETENCY_SUSPENDED` | Immediate | [MUST] |
| Delegation starting / ending | Delegate, delegating authority | A | `DELEGATION` | On the day | [SHOULD] |
| Signatory notification task due | Quality Manager | A, E | `SIGNATORY_NOTIFY` | 10 and 14 days into the 15-day window | [MUST] |
| **Stock below reorder level** | Store keeper, Lab In-Charge | A, E | `STOCK_LOW` | Weekly digest and immediate on crossing | [MUST] |
| **Stock expiring** | Store keeper | A, E | `STOCK_EXPIRING` | 90, 60, 30 and 7 days | [MUST] |
| Batch moved to expired automatically | Store keeper, Lab In-Charge | A | `BATCH_EXPIRED` | Immediate | [MUST] |
| Indent approved / rejected | Store keeper | A | `INDENT_STATUS` | Immediate | [SHOULD] |
| **Quality control out of control** | Tester, Quality Manager, Lab In-Charge | A, E | `QC_BREACH` | Immediate | [MUST] |
| Customer tests withheld by a quality control breach | Lab In-Charge, Approving Authority | A, E | `QC_WITHHELD` | Immediate | [MUST] |
| Proficiency test result unsatisfactory | Quality Manager, Approving Authority | A, E | `PT_UNSATISFACTORY` | Immediate | [MUST] |
| **Complaint logged** | Quality Manager, Lab In-Charge; and Approving Authority for a Critical category | A, E | `COMPLAINT_LOGGED` | Immediate | [MUST] |
| Complaint acknowledgement due / overdue | Quality Manager | A | `COMPLAINT_ACK_DUE` | On cycle | [MUST] |
| Complaint outcome communicated | Customer | E, S | `COMPLAINT_OUTCOME` | Immediate | [MUST] |
| Nonconformity raised | Quality Manager; and Approving Authority if Critical | A, E | `NCR_RAISED` | Immediate | [MUST] |
| Corrective action due / overdue | Action owner, Quality Manager | A, E | `CAPA_DUE` | 7 days before, on the day, then weekly | [MUST] |
| Environmental excursion | Lab In-Charge, Quality Manager | A, E | `ENV_EXCURSION` | Immediate | [MUST] |
| Scheduled environmental reading missed | Staff on duty, Lab In-Charge | A | `ENV_READING_MISSED` | On cycle | [MUST] |
| Sample retention period ended | Store keeper | A, E | `RETENTION_DUE` | Monthly digest | [MUST] |
| Sample ready for collection / return | Customer | S | `SAMPLE_COLLECT` | Immediate | [SHOULD] |
| Document issued or revised, acknowledgement required | Everyone in the distribution list | A, E | `DOC_ACK_REQUIRED` | Immediate, then weekly reminder | [MUST] |
| Internal audit scheduled | Auditor, auditee | A, E | `AUDIT_SCHEDULED` | 14 days before | [SHOULD] |
| Audit finding open past target | Action owner, Quality Manager | A, E | `AUDIT_FINDING_DUE` | Weekly | [SHOULD] |
| Backup failed or restore test overdue | Administrator, Lab In-Charge | A, E | `BACKUP_ALERT` | Immediate / monthly | [MUST] |
| Override used (any type) | Quality Manager | A | `OVERRIDE_USED` | Daily digest | [MUST] |
| System incident logged | Administrator, Lab In-Charge | A, E | `SYSTEM_INCIDENT` | Immediate | [MUST] |
| Login locked after failed attempts | The user, Administrator | A, E | `ACCOUNT_LOCKED` | Immediate | [SHOULD] |
| User access review due | Administrator, Lab In-Charge | A | `ACCESS_REVIEW_DUE` | Quarterly | [SHOULD] |
| Portal registration awaiting approval | Front Desk | A | `PORTAL_REG_PENDING` | Immediate | [MUST] |
| Data-related grievance logged | Grievance officer | A, E | `DPDP_GRIEVANCE` | Immediate | [MUST] |

### M19.2 Requirements

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M19-01 | [MUST] | The system shall hold every notification as an **event definition** in configuration: event code, description, default recipients by role, default channels, template, timing rule, and an on/off switch. Adding a recipient or turning an event off shall not require a program change. | Turn one event off in configuration; it stops being generated; turn it back on; it resumes. |
| M19-02 | [MUST] | The system shall hold **message templates** per event, per channel and per language (English, Telugu, Hindi), with named placeholders. Templates shall be versioned, and every sent message shall record the template version used. | Change a template; previously sent messages still show the wording that was sent. |
| M19-03 | [MUST] | Templates shall be **short enough for the short message service** where that channel is used, and the system shall warn the editor if a template exceeds the single-message length. | Edit an SMS template beyond the limit; a warning appears with the character count. |
| M19-04 | [MUST] | Every notification attempt shall be recorded in a **sent log** with: event, recipient identity, channel, address or number used, template version, the rendered content, created time, sent time, delivery status, provider reference, retry count, and failure reason. The log shall be part of the audit record and shall be retained per the retention policy. | Send one message; the log shows all fields; a failed send shows the reason. |
| M19-05 | [MUST] | Notifications shall be produced by a **scheduled job** with an idempotency key of (event code, entity identifier, threshold), so the same alert is not sent repeatedly on each cycle. | Leave an overdue test overdue for a week; the overdue alert is sent once per day, not once per cycle. |
| M19-06 | [MUST] | Failed sends shall be **retried** with increasing intervals up to a configurable maximum (default 5 attempts over 24 hours), after which the notification is marked failed and appears on an administrator's list. | Break the email connection; the retries are visible; after the maximum, the failure is listed. |
| M19-07 | [MUST] | The system shall support **quiet hours** per channel (default: no outbound SMS or WhatsApp between 21:00 and 07:00), holding messages until the quiet period ends, except for a configurable list of urgent events. | Generate a routine SMS at 22:00; it is sent at 07:00. Generate an urgent one; it is sent at once. |
| M19-08 | [MUST] | The system shall support **digest** notifications so that low-urgency events (stock low, overrides used, retention due) are combined into one message rather than many. | Configure the stock alert as a weekly digest; one message lists all low items. |
| M19-09 | [MUST] | The system shall respect **recipient preferences** (M18-17 for customers, a personal setting for staff) for channel and language, subject to a list of events that cannot be opted out of because the laboratory must be able to prove it told the customer — sample rejected, report amended, report withdrawn, complaint outcome, and any recall. | Opt out of all optional notifications; a report-withdrawal message is still sent and the opt-out is respected for everything else. |
| M19-10 | [MUST] | Notifications to customers shall contain **no more personal or commercial data than necessary**, shall never contain the report content itself, and shall never place personal data in a web address or query string. Links shall use an opaque token. | Inspect a report-ready message; it contains the reference and a tokenised link, not results and not the customer's identifiers in the address. |
| M19-11 | [MUST] | The system shall provide an **in-application notification centre** per user showing unread items, with the ability to mark as read and to navigate directly to the record concerned. | Receive three in-application notifications; the count is 3; opening one reduces it to 2. |
| M19-12 | [MUST] | The system shall **queue outbound messages** and shall never block a user action while sending. Where the internet is unavailable, the queue shall hold and drain when connectivity returns, and staff shall be able to see the queue length. | Disconnect the internet; receive a sample; the customer message queues; reconnect; it sends. |
| M19-13 | [SHOULD] | The system shall support a **manual send** and a **resend** of any notification by an authorised user, with the reason recorded, for the case where a customer says they did not receive it. | Resend one message; the log shows the original and the resend with the reason. |
| M19-14 | [SHOULD] | The system shall record **telephone calls** made instead of, or in addition to, an electronic message, as a communication log entry against the order or complaint, with who called, when, whom they spoke to and the substance. This matters because several required notifications will in practice be made by telephone. | Log a call against an order; it appears in the customer communication log. |
| M19-15 | [MUST] | Where a notification is required as **evidence** — the customer was told the sample was rejected, the customer was told the report was amended, the customer was told the complaint outcome — the sent log entry shall be linked to the record concerned and shall be printable as part of that record's file. | Print a complaint file; the acknowledgement and outcome messages appear in it. |
| M19-16 | [SHOULD] | The system shall allow **WhatsApp** as a channel through a business messaging provider, using approved message templates. | [LATER] Send one WhatsApp message; the log records the provider reference. |
| M19-17 | [MUST] | The system shall hold **provider configuration** (email server, short message service provider, sender identity, template registration identifiers) as configuration with credentials stored securely, never in program code or in a file kept with the source code. | Change the provider in configuration; sending continues without a program change. |

### M19.3 Rules and edge cases

1. **The customer has no email address.** Very likely for a small reeler. Short message service is then the primary channel and the printed acknowledgement at the counter is the fallback. Design every customer-facing notification to be meaningful in a single short message.
2. **The customer's mobile number is wrong.** The sent log records the failure. The counter should be prompted to confirm the number at the next visit. Do not silently accept undelivered messages as delivered.
3. **A message must go out but the internet is down.** The queue holds it. The counter staff should be able to see that it is queued and, if the matter is urgent, telephone the customer and record the call under M19-14.
4. **Too many alerts.** The commonest failure of notification systems. Every alert must be switchable, digest-able and directed at a role rather than everyone. Review the notification volume at the management review and turn off what nobody acts on.
5. **A notification names a tester to the customer.** Never. Customer-facing templates must not include internal staff names. Lint the templates for placeholder names that resolve to staff identities.

**OPEN-Q25:** What short message service provider will be used, what will the sender identity be, and is registration of the sender identity and of every message template with the telecom regulator's distributed-ledger platform required before messages can be sent? — *Recommended default:* assume that a registered sender identity and pre-registered message templates are required for transactional messages in India, that registration takes time and involves a cost per message, and that a small monthly volume estimate should be prepared from the expected sample volume; build the template mechanism so that a registered template identifier can be stored against each template.

**OPEN-Q26:** Who pays for the short message service, and is there an existing parent-institute arrangement (the national testing portal and mobile application already send messages) that this unit can use? — *Recommended default:* ask CSTRI whether the national portal's messaging account can be extended to the unit; if not, budget a small prepaid volume and keep email plus the printed counter acknowledgement as the guaranteed channels, with short message service as an enhancement rather than a dependency.

**OPEN-Q27:** Does the unit have an official email account it can send from, and will an outgoing mail server be available on the unit's network? — *Recommended default:* assume a single official mailbox on the parent body's domain, configured as an outbound relay; hold the credentials as configuration; if no relay is available, hold all customer email in the queue and rely on short message service and paper until one is provided.

---

## M20. Reports, Registers and Dashboards

**What this module is for, in plain words.** Three different audiences need to read out of this system. An **assessor or auditor** asks for registers — the bound-book style lists that show, in date order, every sample that came in, every test done, every report issued, every calibration, every complaint. A **manager** asks for performance and money reports — what is pending, what is late, what earned, what was rejected. And **headquarters** asks for a monthly and annual return in a fixed format. This module builds all three. The most important single item in it is the monthly return to the parent institute: if the system cannot produce it, the staff will keep a parallel spreadsheet, and once a parallel spreadsheet exists the system's own data stops being trusted.

### M20.1 Screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Register Viewer | All staff, assessors | Any statutory or quality register, filtered, printable |
| Management Report Viewer | Lab In-Charge, Accounts, Quality Manager | Performance, money and volume reports |
| Statutory Return Builder | Lab In-Charge | The monthly and annual return to the parent institute, submitted and locked |
| Return Archive | Lab In-Charge | Every return as submitted, immutable |
| Dashboards | Each role | The few tiles that role acts on daily |
| Export | All authorised users | Spreadsheet and portable-document-format export of any register or report |
| Scheduled Report Delivery | Lab In-Charge | [SHOULD] Email a chosen report on a schedule |

### M20.2 Requirements — registers (build these first)

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M20-01 | [MUST] | The system shall produce a **Sample Inward Register**: serial, date and time of receipt, laboratory sample number, customer (or the pseudonym where the viewer is not permitted to see identity), customer's own mark or lot reference, material, quantity and units, mode of receipt, received by, tests requested, charge, expected date, and current status. | Print for one month; every sample received in that month appears exactly once, in date order. |
| M20-02 | [MUST] | The system shall produce a **Test Register**: serial, sample number, test, method designation and version, tester, date started, date completed, verifier, date verified, result summary, grade or verdict where applicable, and report number. | Print for one month; each test appears once; the count reconciles to the sample register. |
| M20-03 | [MUST] | The system shall produce a **Report Issue Register**: serial, report number, revision, report type, date of issue, sample numbers covered, customer, authorising signatory, whether it amends or supersedes another report, and status (issued / superseded / withdrawn). | Print for one year; the report numbers form an unbroken series with cancellations and gaps explained. |
| M20-04 | [MUST] | The system shall produce a **Dispatch Register**: report number, date dispatched, mode (handed over at counter / post / courier / email / portal download), the tracking or reference number, the person who collected and their signature reference where handed over, and the number of copies. | Print for one month; each dispatch shows its evidence. |
| M20-05 | [MUST] | The system shall produce an **Equipment Calibration Register**: equipment identifier and name, calibration date, agency or internal, certificate number, result, valid until, next due date, and current status. | Print the register; it matches the equipment records and shows overdue items in a distinct marking. |
| M20-06 | [MUST] | The system shall produce a **Reagent and Consumable Register**: item, batch, manufacturer, supplier, receipt date, expiry date, quantity received, quantity remaining, storage location, certificate on file yes or no, and state. | Print; every batch appears with its state. |
| M20-07 | [MUST] | The system shall produce a **Complaint Register** in the format of M15.8, in date order, with status and closure date. | Print for one year; every complaint appears once. |
| M20-08 | [MUST] | The system shall produce a **Nonconformity Register**: number, date raised, source, description, risk level, immediate action, corrective action reference, target date, closure date, and status. | Print; open and overdue items are visible at a glance. |
| M20-09 | [MUST] | The system shall produce a **Sample Retention and Disposal Register**: sample number, material, retention until, storage location, whether returned to the customer (with date and receiver) or disposed (with date, method, authorised by and witness), or consumed in testing. | Print for one year; every sample has one terminal outcome recorded or is shown as still retained. |
| M20-10 | [MUST] | The system shall produce an **Environmental Conditions Log** per area as specified in M16-14. | Print for one month; readings, limits, excursions and missed readings all appear. |
| M20-11 | [MUST] | The system shall produce a **Chain of Custody Trail** for any single sample: every movement, handover, sub-division, issue to a tester, return to store, retention, return or disposal, with actor, location and timestamp, on one page. | Open any sample; print the trail; it is complete and in time order. |
| M20-12 | [MUST] | The system shall produce a **Daily Collection Register** and a **Money Receipt Register** as specified in M17-24 and M17-16. | Print for one day; the totals reconcile. |
| M20-13 | [MUST] | The system shall produce an **Invoice Register** and a **Series Gaps Report** per financial document series as specified in M17-37. | Print for one financial year; no unexplained gaps. |
| M20-14 | [SHOULD] | The system shall produce a **Method Register** and a **Controlled Document Register** as specified in M14, and an **Authorisation Matrix Register** as specified in M13-07. | Print each; an assessor can read the laboratory's method and authorisation position from paper. |
| M20-15 | [SHOULD] | The system shall produce an **Internal Audit Register** and a **Proficiency Testing Register** in date order. | Print each for one cycle. |
| M20-16 | [MUST] | Every register shall carry, printed on the output itself: the laboratory name and unit, the register title, the format number and revision, the filter criteria applied (date range and every other filter), the date and time of printing, the name of the person who printed it, and page x of y. | Print any register with two filters applied; both filters appear in the header of the printed output. |
| M20-17 | [MUST] | Every register shall be exportable to a **spreadsheet** and to **portable document format**, with the same filter criteria printed on both. | Export one register both ways; both carry the filter line. |
| M20-18 | [MUST] | A register print shall reflect the data **as at the time of printing**, and the print event shall be logged (who printed what, with what filters, when). This is how the laboratory can explain why two prints of the same register differ. | Print, change a record, print again; both prints are logged and the difference is explainable from the audit trail. |
| M20-19 | [MUST] | Registers shall show **voided and cancelled entries**, marked as such, never hidden, so that the serial sequence is unbroken and an auditor can see what happened. | Cancel one report; the register shows it as cancelled in its serial position. |
| M20-20 | [MUST] | Where the viewer is not permitted to see customer identity (see M21), the register shall show the pseudonym in place of the customer name, and the print shall state that identities are masked for this user. | Print the sample inward register as a tester; identities are masked and the note appears. |

### M20.3 Requirements — management reports

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M20-21 | [MUST] | **Pending workload by tester and by test.** Open tests grouped by tester and by test, with age buckets and a turnaround-weighted workload figure rather than a plain count. | Run it; a tester with ten short tests shows a smaller load than a tester with three long ones. |
| M20-22 | [MUST] | **Turnaround performance and breaches.** On-time percentage, median and ninetieth-percentile net turnaround by test, by section and by priority; and a breach list with the reason and the hold time excluded. | Run for one month; the on-time percentage reconciles to the individual reports. |
| M20-23 | [MUST] | **Bottleneck report.** Average and ninetieth-percentile time spent in each workflow state, so the laboratory can see whether the delay is in allocation, testing, verification, approval or dispatch. | Run it; the state with the largest dwell time is identified. |
| M20-24 | [MUST] | **Revenue by test, by customer, by customer category and by month**, with quantity, gross, concession, net and tax, and a separate line for zero-charge advisory volume. | Run for one financial year; the net total reconciles to the invoice register. |
| M20-25 | [MUST] | **Sample volume trends.** Samples and lots received, tested and reported by month, by material and by customer category, with the previous year for comparison. Both the sample count and the lot count shall be reported, because the parent institute reports both. | Run for two years; both counters are present and distinct. |
| M20-26 | [MUST] | **Rejection and retest analysis.** Sample rejection rate by reason code, by material and by customer; test abort rate; first-time-right percentage (tests verified with no send-back); and send-back reasons. | Run for one quarter; the rejection reasons are ranked. |
| M20-27 | [MUST] | **Equipment utilisation and downtime.** Tests run per instrument, hours in use where recorded, breakdown count and downtime hours, by instrument and by month. | Run for one year; downtime reconciles to the maintenance log. |
| M20-28 | [MUST] | **Calibration and competency due lists.** Everything due in the next 30, 60 and 90 days, and everything already overdue, in one place. | Run it; the lists match the equipment and personnel modules. |
| M20-29 | [MUST] | **Stock position and consumption.** Current quantity by item and batch, items below reorder level, batches expiring within the alert windows, and consumption per test and per month. | Run it; the position reconciles to the stock ledger. |
| M20-30 | [MUST] | **Outstanding payments and ageing** as specified in M17-46, plus a collection-versus-remittance reconciliation. | Run it; totals reconcile to the customer ledgers. |
| M20-31 | [MUST] | **Result trend and grade distribution.** Distribution of a chosen parameter or grade over time, by material, by producing technology (charkha, cottage basin, multi-end reeling, automatic reeling) and by customer district. This is genuine domain value: it is how the unit can report which reeling technologies in the region are producing which grades. | Run for one year on grade; the distribution by reeling technology is produced. |
| M20-32 | [SHOULD] | **Out-of-specification rate.** Proportion of results failing the applicable specification, by parameter and by period — a measure of the quality of the material being tested, not of the laboratory. | Run it; the rate is reported per parameter. |
| M20-33 | [MUST] | **Pending approvals.** A personal queue per verifier and per signatory, aged, so nobody has to be reminded by telephone. | Log in as the Approving Authority; the queue shows items with their ages. |
| M20-34 | [MUST] | **Report amendment and reprint report.** Amendments and withdrawals by reason and by month (the amendment rate is a quality indicator), and reprint counts per report. | Run for one year; the amendment rate is a single number the management review can track. |
| M20-35 | [SHOULD] | **Override and exception report.** Every override used, by type (calibration block, expired batch, unauthorised person, segregation of duties, payment hold, provisional release), by person and by month. | Run for one month; every override in that month appears with its reason. |
| M20-36 | [SHOULD] | **Public report verification access log.** How many times each issued report's verification page was accessed, and when — useful for detecting abuse and for showing that the facility is used. | Run it; accesses per report are shown without exposing who accessed beyond what is lawful to record. |
| M20-37 | [SHOULD] | **Audit trail extract.** A filterable, exportable extract by entity, by user and by date, for producing to an assessor. | Extract one week for one user; the export is complete and readable without the application. |

### M20.4 Requirements — the statutory return to headquarters

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M20-38 | [MUST] | The system shall produce the **monthly return to the parent institute and the Board** in the exact format the unit currently submits, as a first-class, one-action report. | Generate one month's return; a member of staff who currently prepares it by hand confirms it needs no manual addition. |
| M20-39 | [MUST] | The return shall, at minimum, carry: number of samples and number of lots received, tested and reported, broken down by test name and by material; revenue collected with the tax components separated; number of pending samples at month end; zero-charge advisory samples tested; equipment status including calibration compliance; staff strength; and any other section the current format requires. | Compare the generated return against the last hand-prepared one for the same month; the figures agree or the differences are explained. |
| M20-40 | [MUST] | Each submitted return shall be **stored as an immutable snapshot** — the exact figures as submitted, with the submission date and the person who submitted it — so that a later data correction never silently changes a return already sent to headquarters. | Submit a return, then correct a sample record for that month; the stored return is unchanged and a variance note appears on the next return. |
| M20-41 | [MUST] | Where data is corrected after a return has been submitted, the system shall produce a **variance note** listing the differences between the submitted figures and the current figures for that period, so the unit can decide whether a revised return is needed. | Correct a record; open the variance note; the difference is itemised. |
| M20-42 | [SHOULD] | The system shall produce an **annual consolidated performance return** with the same breakdowns plus comparison against the previous year, and the counts of training programmes, demonstrations, participants and field visits where the unit records them. | Generate one year; the comparison columns are populated. |
| M20-43 | [SHOULD] | The system shall hold a place to record **non-testing activity** the unit reports on: training programmes conducted with fee collected, demonstrations, awareness programmes, field visits, post-dispatch inspections of reeling units, and adoption or mentoring of units — so that the return covers the unit's full reportable activity and not only tests. | Record one training programme with a fee; it appears in the return and in the revenue report under a non-test head. |
| M20-44 | [MUST] | Returns shall be **locked on submission** and thereafter read-only, printable and exportable. | Attempt to edit a submitted return; refused. |

### M20.5 Dashboards by role

Keep each dashboard to a small number of tiles. A dashboard the user cannot read in ten seconds does not get read.

**Front Desk dashboard**

| Tile | Content | Action on click |
|---|---|---|
| Awaiting sample | Accepted requests with no sample received yet, aged | Open the request |
| Received today | Samples received today, count and list | Open the sample |
| Registration incomplete | Samples received but not yet accepted or rejected | Open the acceptance screen |
| Reports ready to hand over | Issued reports not yet dispatched or collected | Open the dispatch screen |
| Enquiries and portal requests pending | Count | Open the queue |
| Money received today | Total by mode, and receipts issued | Open the daily collection register |
| Notifications failed to send | Count | Open the failed list |

**Tester dashboard** (with customer identity masked)

| Tile | Content | Action on click |
|---|---|---|
| My tests due today | Count and list, with the sample reference, material, test and due time | Open result entry |
| My tests overdue | Count, in red | Open result entry |
| Sent back to me | Tests returned by the verifier with the reason | Open result entry |
| Conditioning in progress | Specimens conditioning, with the earliest permitted test time | Open the pre-conditioning tracker |
| Controls due this run | Quality control items due per the plan | Open control entry |
| Documents to acknowledge | New or revised documents awaiting my confirmation | Open the document |
| My competency expiring | Authorisations expiring within 60 days | Open my competence file |

**Lab In-Charge dashboard**

| Tile | Content | Action on click |
|---|---|---|
| Samples in house | Count by state | Open the pending register |
| Tests pending, bucketed | Awaiting allocation / in test / awaiting verification / awaiting report | Open the list |
| Overdue tests | Count, split 0–1, 1–3 and more than 3 days late | Open the breach list |
| Awaiting my action | Allocations to make, holds to release, overrides to consider | Open the item |
| Equipment attention | Calibration overdue, out of service, impact analyses open | Open equipment |
| Quality attention | Quality control breaches, open nonconformities, overdue corrective actions, complaints past target | Open the register |
| Stock attention | Below reorder, expiring, expired awaiting disposal | Open stock |
| This month at a glance | Samples received, reported, revenue, on-time percentage | Open the management report |

**Accounts dashboard**

| Tile | Content | Action on click |
|---|---|---|
| Money received today | By mode, with receipt count | Open the daily collection register |
| Awaiting credit | Demand drafts and transfers tendered but not credited, aged | Open the worklist |
| Unmatched bank lines | Statement lines not yet matched | Open the matching screen |
| Reports held for payment | Count and value | Open the hold list |
| Outstanding | Total and the over-90-day figure | Open ageing |
| Invoices to raise | Completed work not yet invoiced | Open the invoicing screen |
| Series alerts | Any gap detected in a financial series | Open the gaps report |

**Approving Authority dashboard**

| Tile | Content | Action on click |
|---|---|---|
| Reports awaiting my authorisation | Count, aged | Open the report |
| Results awaiting review | Count where I am the reviewer | Open the result |
| Overrides awaiting or recently used | Count | Open the exception report |
| Critical nonconformities and recalls | Count | Open the record |
| Impact analyses open | Count, with age | Open the analysis |
| Signatory and delegation matters | Notifications due, delegations expiring | Open the register |
| Return to headquarters | Whether this month's return is prepared and submitted | Open the return builder |

### M20.6 Rules and edge cases

1. **Two people run the same report and get different numbers.** Almost always because of different filters or different times. This is why M20-16 requires the filter criteria and the print timestamp on the face of every output, and why M20-18 logs the print.
2. **A register must show a serial with no gaps.** Cancelled and voided entries keep their serial and are shown as cancelled. Never renumber.
3. **Reports must be readable without the application.** An assessor may ask to read records independently of the software. Every register must export cleanly to a spreadsheet and to portable document format.
4. **Large date ranges.** A year of the test register at eleven thousand samples is a big print. Provide a summary-plus-detail option and a paginated export, and warn before generating something very large.
5. **Masked identities in exports.** The export must honour the same masking as the screen. An export is the classic leak route.
6. **The parallel spreadsheet risk.** The single most effective defence is M20-38: ask for the exact current return format on day one and build to it before the interface is polished.

**OPEN-Q28:** What is the exact current format of the monthly and annual return submitted to CSTRI and the Board — a scanned copy or spreadsheet of the last three submissions? — *Recommended default:* treat this as a blocking item for the design of the sample and test records, because the return's breakdowns determine which fields must be captured at receipt; do not begin building until at least one real submitted return has been seen.

**OPEN-Q29:** Are there other periodic returns — quarterly progress, scheme-linked reports, results framework targets? — *Recommended default:* build the return builder generically so a new return format is a configured report rather than a program change.

---

## M21. Administration, Security and Audit

**What this module is for, in plain words.** This module decides who can do what, records everything that was done, and protects the records. It is the least visible part of the system and the part an assessor examines most closely. Four things in it are non-negotiable. **Every person has their own login** — never a shared one, because a shared login destroys the ability to say who did the work. **Nothing is ever deleted** — records are voided or superseded, and the original stays visible. **Every change to a technical record keeps the old value, with who changed it, when and why.** And **the audit trail cannot be edited or deleted by anyone, including the Administrator.**

### M21.1 Screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| User Management | Administrator | Create, modify, deactivate logins; link to staff records |
| Joiner / Leaver Checklist | Administrator, Lab In-Charge | Structured process on arrival and departure |
| Role Management | Administrator | Roles and their permissions |
| Permission Matrix Viewer | Administrator, Quality Manager, assessors | The full role-by-permission table, printable |
| Visibility Rules | Administrator | Blinding, masking and record-level rules |
| Audit Trail Viewer | Quality Manager, Approving Authority, Administrator (read only) | Search and print the audit trail |
| Electronic Signature Records | Quality Manager | Every signature applied, with its binding |
| Backup and Restore Status | Administrator | Backup schedule, last success, last restore test |
| System Incident Log | Administrator, Lab In-Charge | Failures, their impact on data, and the action taken |
| Change Control Register | Administrator, Quality Manager | Every software release and configuration change, with its test evidence |
| Configuration and Feature Switches | Administrator | Every switch this document introduces, in one place |
| Retention and Archival Policy | Administrator, Quality Manager | Retention period and disposal rule per record type |
| Personal Data and Consent | Administrator, Grievance Officer | Privacy notice versions, consent records, access and correction requests |
| Access Review | Administrator, Lab In-Charge | Periodic confirmation that each login is still needed and correctly scoped |

### M21.2 Requirements — users and authentication

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M21-01 | [MUST] | Every login shall belong to exactly one named person and shall be linked to a staff record (M13) or a portal customer contact (M18). **Shared, generic or role-based logins shall not be possible.** | Attempt to create a login named "tester" not linked to a person; refused. |
| M21-02 | [MUST] | The system shall implement a **joiner process**: create the staff record, assign a role, assign competency authorisations, record the confidentiality undertaking, issue the login, and require a password change at first login. Each step shall be a checklist item that can be seen as complete or outstanding. | Onboard one person; the checklist shows all six items and their state. |
| M21-03 | [MUST] | The system shall implement a **leaver process**: end-date all competency authorisations, deactivate the login within a stated time, list open work for reassignment, revoke any delegation, create the external-notification task where the person was a declared signatory, and record the return of controlled document copies. | Mark a person as left; all six actions are triggered or listed. |
| M21-04 | [MUST] | The system shall enforce a **password policy** as configuration: minimum length (default 12), required character classes, a check against a list of common passwords, no reuse of the last n passwords (default 5), and a maximum age (default 180 days, configurable including "never expires"). | Set a short password; refused with the policy stated. |
| M21-05 | [MUST] | The system shall **lock an account** after a configurable number of consecutive failed attempts (default 5) for a configurable period (default 30 minutes) or until an Administrator unlocks it, and shall log every failed attempt with the address it came from. | Fail five times; the account locks; the attempts appear in the audit trail. |
| M21-06 | [MUST] | The system shall enforce a **session timeout** on inactivity (default 30 minutes for staff, 15 minutes for the customer portal), configurable. | Leave a session idle past the timeout; the next action requires re-authentication. |
| M21-07 | [SHOULD] | The system shall support **two-factor authentication** and shall make it mandatory for the Approving Authority, the Quality Manager and the Administrator. The second factor may be a one-time code to a registered mobile number or an authenticator application. | Enable it for the Approving Authority; login requires the second factor. |
| M21-08 | [MUST] | The system shall require **re-authentication at the moment of signing** — entering the password again, or the second factor — for verification, report authorisation and any override. Being logged in shall not be treated as signing. | Authorise a report; the password is requested again before the signature is applied. |
| M21-09 | [MUST] | The system shall perform a **periodic access review** (default quarterly): a list of every active login with its role, last login date and the staff member's status, for the Administrator and the Lab In-Charge to confirm or change. The review outcome shall be recorded. | Run a review; confirm one login and remove another; both actions are recorded with the reviewer's name. |
| M21-10 | [MUST] | The system shall log every **login, logout, failed login, permission denial, print, export, report download and share-link access** with actor, timestamp, address and the record concerned. | Perform each action once; each appears in the audit trail. |

### M21.3 Role and permission matrix

Roles: **FD** Front Desk / Sample Receipt · **TS** Tester · **VR** Verifier · **SH** Section Head · **AA** Approving Authority (the Unit Incharge) · **QM** Quality Manager · **AC** Accounts · **SK** Store Keeper / Equipment Custodian · **AD** Administrator · **CU** Customer (portal)

**SH and AA are two different offices, and this matrix keeps them apart.** SH is the sectional supervisor who allocates work, supervises the bench and approves sectional records; AA is the officer who signs reports and authorises the acts the rest of this document reserves to the Unit Incharge. Where the prose of this part still uses the older name *Lab In-Charge*, it means the Section Head; where an act belongs to the signing officer alone, the prose names the Approving Authority.

Marks: **C** create · **R** read · **U** update · **D** delete (never granted anywhere) · **A** approve / authorise · **–** no access · **M** read with customer identity masked

| Permission | FD | TS | VR | SH | AA | QM | AC | SK | AD | CU |
|---|---|---|---|---|---|---|---|---|---|---|
| Customer master — view identity | R | – | R | R | R | R | R | – | R | R own |
| Unblinding request — approve (M21-21) | – | C (raise) | C (raise) | A | – | – | – | – | – | – |
| Customer master — create / edit | CU | – | – | U | A | – | CU | – | U | – |
| Customer portal account approve | A | – | – | A | – | – | – | – | A | – |
| Enquiry / estimate — create | C | – | – | C | A | – | C | – | – | C |
| Test request (order) — create | C | – | – | C | – | – | – | – | – | C |
| Test request — review and accept | – | – | – | A | A | – | – | – | – | – |
| Test request — decline | – | – | – | A | A | – | – | – | – | – |
| Test request — amend after acceptance | C | – | – | A | A | – | – | – | – | Request only |
| Sample — register and receive | C | – | – | C | – | – | – | – | – | – |
| Sample — accept / reject | A | – | – | A | A | – | – | – | – | – |
| Sample — accept with deviation | – | – | – | A | A | – | – | – | – | – |
| Sample — hold / release | C | – | – | A | A | – | C (payment only) | – | – | – |
| Sample — sub-divide / create specimens | – | C | – | C | – | – | – | – | – | – |
| Sample — print label | C | R | – | R | – | – | – | – | – | Own request only |
| Sample — retention, return, disposal | C | – | – | A | A | – | – | C | – | R own |
| Chain of custody — record movement | C | C | C | C | – | R | – | C | R | – |
| Test allocation | – | – | – | C | C | – | – | – | – | – |
| Result entry — observations | – | C | – | C | – | – | – | – | – | – |
| Result — submit | – | A | – | A | – | – | – | – | – | – |
| Result — amend before submission | – | U | – | U | – | – | – | – | – | – |
| Result — verify / send back | – | – | A | A | A | – | – | – | – | – |
| Result — retract after verification | – | – | – | – | A | – | – | – | – | – |
| Statement of conformity / grade | – | – | A | A | A | – | – | – | – | – |
| Opinion or interpretation | – | – | – | A | A | – | – | – | – | – |
| Report — compile draft | C | – | – | C | C | – | – | – | – | – |
| Report — authorise and issue | – | – | – | – | A | – | – | – | – | – |
| Report — amend / withdraw | – | – | – | – | A | – | C (raise) | – | – | Request only |
| Report — reprint | C | – | – | C | C | R | C | – | R | Download own |
| Report — dispatch record | C | – | – | R | R | R | – | – | – | R own |
| Rate card — create / edit | – | – | – | R | A | – | C | – | – | – |
| Concession / waiver | – | – | – | A (to limit) | A | – | C | – | – | – |
| Payment — record | – | – | – | R | R | – | C | – | – | – |
| Money receipt — issue / cancel | C | – | – | R | A (cancel) | R | C | – | – | R own |
| Invoice — raise | – | – | – | R | A | R | C | – | – | R own |
| Credit note / refund voucher | – | – | – | R | A | R | C | – | – | R own |
| Payment hold — override (WF-41, M17-43) | – | – | – | – | A | R | – | – | – | – |
| Provisional release against an unconfirmed receipt (M17-20) | – | – | – | A | A | – | C (raise) | – | – | – |
| Bank reconciliation | – | – | – | R | R | – | C | – | – | – |
| Equipment master | – | R | R | U | A | R | R (asset) | C | R | – |
| Calibration event — record | – | – | – | U | A | R | – | C | – | – |
| Intermediate check — record | – | C | – | C | – | R | – | C | – | – |
| Equipment state change | – | – | – | A | A | R | – | C (propose) | – | – |
| Equipment block — override (M11-20, M5-06, M6-14) | – | – | – | – | A | R | – | – | – | – |
| Impact analysis — run | – | – | – | C | C | C | – | – | – | – |
| Impact analysis — disposition | – | – | – | A | A | A | – | – | – | – |
| Consumable item master | – | R | R | U | A | R | – | C | R | – |
| Consumable lot — receive | – | – | – | R | – | R | – | C | – | – |
| Consumable lot — accept / reject | – | – | – | A | A | R | – | C (propose) | – | – |
| Consumable lot — issue to test | – | C | – | C | – | R | – | C | – | – |
| Expired lot — override (M12-11, M5-06) | – | – | – | – | A | R | – | – | – | – |
| Stock verification — approve | – | – | – | A | A | R | R | C | – | – |
| Disposal of chemicals | – | – | – | A | A | R | – | C | – | – |
| Purchase indent — raise / approve | – | – | – | A | A | – | R | C | – | – |
| Staff master | – | – | – | U | A | R | – | – | C | – |
| Competency authorisation | – | R own | R | C | A | R | – | – | – | – |
| Segregation-of-duties override (M13-10) | – | – | – | – | A | – | – | – | – | – |
| Delegation of authority | – | – | – | R | C, A | R | – | – | – | – |
| Method version — create / edit | – | R | R | U | A | C | – | – | – | – |
| Method version — activate | – | – | – | A | A | C | – | – | – | – |
| Method deviation — approve | – | C (raise) | – | A | A | R | – | – | – | – |
| Controlled document — issue | – | R | R | R | A | C | R | R | – | – |
| Format revision | – | – | – | R | A | C | – | – | – | – |
| Quality control plan | – | R | R | U | A | C | – | – | – | – |
| Control result — enter | – | C | – | C | – | C | – | – | – | – |
| Quality control breach — disposition | – | – | – | A | A | A | – | – | – | – |
| Proficiency test record | – | – | – | R | A | C | – | – | – | – |
| Complaint — log | C | – | – | C | C | C | C | – | – | C |
| Complaint — investigate / close | – | – | – | C | A | C, A | – | – | – | R own |
| Nonconformity — raise | C | C | C | C | C | C | C | C | C | – |
| Nonconformity / corrective action — close | – | – | – | A | A | A | – | – | – | – |
| Internal audit | – | – | – | R | A | C | – | – | – | – |
| Management review record | – | – | – | R | C, A | C | R | – | – | – |
| Risk register | – | – | – | U | A | C | – | – | – | – |
| Environmental reading — enter | C | C | C | C | – | R | – | C | – | – |
| Environmental excursion — action | – | – | – | A | A | A | – | – | – | – |
| Registers and reports — view / print | R | M | R | R | R | R | R (financial) | R (stock, equipment) | R | – |
| Statutory return — prepare / submit | – | – | – | C | A | R | R | – | – | – |
| Audit trail — read | – | – | – | R | R | R | – | – | R | – |
| Audit trail — edit or delete | – | – | – | – | – | – | – | – | **–** | – |
| User management | – | – | – | R | A | R | – | – | C, U | – |
| Role and permission changes | – | – | – | R | A | R | – | – | C, U | – |
| Configuration and feature switches | – | – | – | R | A | R | – | – | C, U | – |
| Backup / restore operations | – | – | – | R | R | R | – | – | C | – |
| System incident log | – | C | C | C | R | R | C | C | C, U | – |
| Change control register | – | – | – | R | A | R | – | – | C | – |
| Retention and disposal of records | – | – | – | R | A | A | – | – | C | – |
| Legal hold — place / lift (M21-66) | – | – | – | R | A | A | – | – | C | – |
| Personal data access / correction request | C | – | – | R | A | R | – | – | C | C own |

Notes on the matrix. **No role, including the Administrator, has delete on any record.** The Administrator can configure and can operate the system but cannot approve technical work, cannot authorise a report, and cannot alter the audit trail. Where a permission shows **A** for two roles, either may act; the segregation rules in M13-10 still apply on top.

Three overrides belong to the Approving Authority alone and therefore show **–** against SH: the payment-hold override (WF-41, M17-43), the equipment-block override (M11-20, and M5-06 and M6-14 in Part C) and the expired-consumable-lot override (M12-11). The Section Head does keep **A** on method-version activation, which M14.5 grants to the Section Head (written there under the older name) or the Approving Authority; on closing a nonconformity or corrective action, which M15-30 and M15-31 do not reserve to the signing officer; and on a concession or waiver up to the configured `waiver_approval_limit`, above which M17-10 requires the Approving Authority.

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M21-11 | [MUST] | The permission matrix shall be **data, not code**: roles, permissions and their mapping shall be editable by the Administrator, and every change shall be recorded in the audit trail with old and new values and a reason. | Move one permission between roles; the change appears in the audit trail with a reason. |
| M21-12 | [MUST] | Permissions shall be **state-aware** where required: for example, a tester may update a result only while the test is in progress, and not after submission. | Submit a result then attempt to change a reading as the tester; refused. |
| M21-13 | [MUST] | The full matrix shall be **printable** as one document for the quality manual and for an assessor. | Print it; roles are columns, permissions are rows, and the print carries a format number and date. |
| M21-14 | [MUST] | Every permission denial shall be **logged** and shall show the user a plain message stating what is not permitted and who can do it. | Attempt a denied action; the message names the role that can perform it and the denial is logged. |

### M21.4 Record-level visibility and the blinding rule

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M21-15 | [MUST] | **Blinding.** For roles without the *view customer identity* permission, the customer name, address, contact person, telephone number, email, tax registration number, price, invoice, payment status and any commercial note shall be **absent from the data returned by the system**, not merely hidden in the display. | Call the same data endpoint as a tester using a tool outside the interface; the response contains no customer identifying fields. |
| M21-16 | [MUST] | Blinded roles shall see a **stable pseudonym** in place of identity, of the form `CUST-nnnn` (for example `CUST-4417`), so that staff can discuss a lot without learning who owns it and so that patterns remain visible for quality purposes. | Two samples from the same customer show the same pseudonym; no name appears. |
| M21-17 | [MUST] | The customer's **own mark, lot number or chop** is recorded at receipt in a field flagged as identity-revealing and is **hidden from blinded roles by default**, per the M5 field-level blinding table, because such a mark is frequently the producer's or filature's trade mark. A separate **neutral laboratory description**, together with the sample number, is what the tester sees on screen. Where the tester genuinely needs the mark to identify the item unambiguously, they obtain it through the time-boxed unblinding request of M21-21, with the reason "sample marks ambiguous". | Record a bale mark that names a firm; the tester sees the neutral description and the sample number, not the mark. Record a plain lot number that names no firm; the tester still does not see it until an unblinding request is approved. |
| M21-18 | [MUST] | **Declared values are not blinded.** Declared denier or count, declared variety, declared twist, reeling technology, the specification to judge against and the decision rule are test inputs and shall always be visible to the tester. | Open the tester's screen; all declared values are present. |
| M21-19 | [MUST] | Printed **worksheets and sample labels** used at the bench shall carry only the sample reference and the neutral description, never the customer name. | Print a bench worksheet; no customer name appears. |
| M21-20 | [MUST] | **Search shall be role-scoped.** A blinded role's search shall not accept or match on customer name, and shall not return results across customers by identity. | Search for a firm's name as a tester; no results are returned and the attempt is logged. |
| M21-21 | [MUST] | **Unblinding shall be an event.** Where a blinded user needs the identity, they may request it with a reason from a controlled list; the Lab In-Charge approves; the reveal is limited to one sample and to a configurable period (default 60 minutes); and the whole exchange is logged and reviewed monthly. | Request and receive a reveal; it expires after the period; the request, approval and expiry are in the audit trail. |
| M21-22 | [MUST] | Blinding shall be **configurable per role and per section** and shall be switchable off where it serves no purpose (internal research work, or samples that arrive already coded by an outside body). | Turn blinding off for one section; testers there see identity; elsewhere they do not. |
| M21-23 | [MUST] | The system shall record honestly, per sample, where **identity could not be masked** in the physical world — a woven selvedge, a printed bale cloth, a customer who was standing at the counter — so that the laboratory's claim about blinding matches reality. | Mark one sample "identity not maskable"; it appears in the impartiality control-effectiveness report. |
| M21-24 | [MUST] | The **customer portal** shall enforce record-level filtering in the data layer so that a customer can reach only their own records, and shall log every attempt to reach another customer's record. | Attempt cross-customer access; refused and logged. |
| M21-25 | [SHOULD] | Screens showing customer identity or results shall carry a light **watermark with the viewing user's identity and the timestamp**, to discourage photography of the screen. | Open a report on screen; the watermark shows the current user. |

### M21.5 Audit trail

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M21-26 | [MUST] | The system shall keep an **append-only audit trail** written at the database level (by trigger or equivalent), not only by the application, so that a change made directly in the database is still captured. | Change a value with a direct database statement; the audit trail records it. |
| M21-27 | [MUST] | Each audit entry shall record: the record type, the record identifier, the action (insert / update / state change / void / print / export / login / download / permission denial), the field name, the **old value**, the **new value**, the actor, the server timestamp in coordinated universal time with the local offset, the **reason for change**, the network address, the session identifier, and a request identifier that ties related changes together. | Change one field; every listed item is present in the entry. |
| M21-28 | [MUST] | A **reason for change is mandatory and cannot be blank** for any change to a raw observation, a result, a method version, an equipment status, a calibration record, a batch status, a competency authorisation, a rate, a permission, or a configuration switch. | Attempt such a change with a blank reason; refused. |
| M21-29 | [MUST] | **The original value shall remain visible in the interface**, not merely recoverable from a backup. A changed field shall show a marker and a "view history" action; the history shall show the full chain with the original first. | Change a reading twice; the screen shows the marker; the history shows three values in order with actors, times and reasons. |
| M21-30 | [MUST] | A printed technical record shall be able to show the **original alongside the amendment**, mirroring the paper practice of striking through, initialling and dating. | Print the worksheet for an amended result; both values appear. |
| M21-31 | [MUST] | The audit trail shall be **immutable**: no user, no role, and specifically **not the Administrator**, shall be able to edit or delete an audit entry. Immutability shall be enforced in **two layers**, as for issued reports in M8-50. First, the application's database account shall hold INSERT and SELECT only on the audit tables; UPDATE, DELETE, TRUNCATE and all schema-changing rights (ALTER, DROP, and the right to create, alter, disable or drop a trigger) shall be revoked from it, and the audit tables shall not be owned by the application account. Second, a trigger on each audit table shall raise an error on any UPDATE, DELETE or TRUNCATE attempt, and shall record the attempt. | As the application account, attempt in turn an UPDATE, a DELETE, a TRUNCATE, an ALTER TABLE, a DROP TABLE and an ALTER TABLE ... DISABLE TRIGGER against an audit table; each is refused, and each attempt appears in the audit trail. |
| M21-31a | [MUST] | **Audit capture shall have no off switch.** No configuration setting, feature flag, environment variable or start-up option shall be capable of disabling audit capture in whole or in part, and the switch register in M21.11 shall contain no such entry. Removing, disabling or altering an audit trigger, or changing the set of audited tables, shall be possible only by a schema migration that is a change-control event under M21-57 and M21-58. | Inspect the switch register and the configuration screen; no audit-disabling entry exists. Search the code and configuration for any flag that bypasses audit writes; none is found. |
| M21-31b | [MUST] | A **daily audit-integrity job** shall verify that every required audit trigger exists and is enabled, that the audit table privileges are as M21-31 requires, and that the audit trail has no gap: each audit row shall carry the SHA-256 fingerprint of the preceding row's key fields, forming a chain that the job re-computes, so that a removed or altered row is detectable even where a partition has been archived under M21-38. Any failure shall raise a System Incident under M21-52 and an immediate alert delivered independently to the Quality Manager and the Approving Authority as well as to the recipients of the `SYSTEM_INCIDENT` event in M19.1, and the alert for this event shall not be suppressible or re-routable through the notification configuration of M19-01. | Disable one audit trigger in a test environment; the job reports it the same day and the incident and alerts are raised. Delete one archived audit row directly; the chain re-computation reports the break. |
| M21-32 | [MUST] | The audit trail shall be **readable** by the Quality Manager, the Approving Authority and the Administrator, and shall be searchable by record, by user and by date, and exportable. | Search for one user's actions last week; export the result. |
| M21-33 | [MUST] | **Soft delete only.** Where a record must be removed from use, it is voided with a voided-at date, a voided-by actor and a void reason; it remains queryable and printable, marked VOID. | Void a record; it appears in the register marked VOID with its reason. |
| M21-34 | [MUST] | **Back-dated entry shall be detected.** Where the recorded observation time differs from the entry time beyond a configurable tolerance, the system shall require a reason and shall flag the entry. A free-text date shall never silently replace the server clock. | Enter yesterday's reading; a reason is required and the entry is flagged. |
| M21-35 | [MUST] | The server clock shall be synchronised to a **trusted national time source**, and the system shall record which source and shall alert if synchronisation is lost. All timestamps shall come from the server, never from the user's device. | Break time synchronisation in a test environment; an alert is raised. |
| M21-36 | [MUST] | **Bulk imports and instrument file imports shall produce the same audit trail as manual entry**, and shall additionally record the source file name and its checksum. | Import one file; the audit trail shows the import with the file name and checksum. |
| M21-37 | [MUST] | Audit entries shall be retained for at least the retention period of the records they describe, and a retention purge shall never remove audit entries for records still within retention. Disposal of audit entries whose retention has ended shall be performed only by the separate, named disposal process of M21-64, using a distinct database account not reachable by the application, and shall itself create a permanent disposal record and preserve the chain of M21-31b across the disposed range. | Attempt to purge audit entries for an in-retention record; refused. Dispose one out-of-retention range through the M21-64 process; a permanent disposal record exists and the chain still re-computes across the gap. |
| M21-38 | [SHOULD] | The audit trail shall be **partitioned or archived** by month to keep it fast, with archived partitions still queryable. | Query a two-year-old date range; the result returns within a reasonable time. |

### M21.6 Electronic signatures

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M21-39 | [MUST] | Every signature event shall create a **signature record** holding: the record signed, the signer's login and staff identity, the role and the specific authorisation relied on, the meaning of the signature (entered by / checked by / verified by / authorised by / countersigned by), the timestamp, the network address, the authentication method used, and the checksum of exactly what was signed. | Authorise a report; the signature record shows all items including the checksum. |
| M21-40 | [MUST] | The signature shall be **bound to the frozen document**, by signing the file or its checksum, so that a later change to a template, a logo or a font cannot alter what was signed. | Change the report template; the old report's signature still verifies against the stored file. |
| M21-41 | [MUST] | The system shall verify, at the moment of signing, that the signer holds a valid authorisation **for every test on that report** at that date, and shall refuse and log otherwise. | Attempt to authorise outside scope; refused with the offending test named. |
| M21-42 | [MUST] | Where a specimen **signature image** is printed, the stored image file shall be encrypted at rest as set out in NFR-52 and shall not be readable as a file by any user through any interface. It shall be visible only to the person it belongs to, and then only as a confirmation thumbnail on that person's own profile. No other user, **including the Administrator and the Quality Manager**, shall be able to view, download, export or apply it. The Administrator may upload, replace or void a person's image on that person's recorded request but shall have no read access to it. The application shall retrieve the image only inside the signing and report-render operation, only for the signer's own signature, only after the re-authentication of M21-08, and shall never serve the raw image file to any screen, data response, print preview or export. No bulk export of signature images shall exist. Every retrieval shall be logged against the document signed. This clause restricts the stored image asset; it does not restrict an issued report — an image rendered into a frozen report file under M8-43 forms part of that report and is printed, reprinted, downloaded and verified with it. | Attempt to open or download another person's signature image as the Administrator; refused and logged. Attempt to apply another person's signature image; refused and logged. Inspect the data returned for a staff record and any staff-data export; the image bytes are not obtainable. Replace a person's image as the Administrator; the replacement succeeds, the old image is voided, and at no point is either image displayed. |
| M21-43 | [MUST] | The system shall support three tiers of signature and shall make the tier a configuration choice: (a) a printed name and designation with an in-application signature record; (b) an in-application electronic signature with re-authentication, bound to the document checksum; (c) a cryptographic digital signature applied to the file. The design target shall be (c), the minimum acceptable shall be (b), and (a) alone shall not be presented to a customer as a signature. | Switch the tier in configuration; the report is produced accordingly and the tier used is recorded on the signature record. |
| M21-44 | [SHOULD] | Where a cryptographic signature is used, the system shall apply a **trusted timestamp** so that the signature still verifies after the signing certificate expires. | Sign one report with a timestamp; verify it after simulating certificate expiry; it still validates. |
| M21-45 | [MUST] | Separate signature slots shall exist for **reviewed by** and **authorised by**, and a third for a countersignature by the Unit In-Charge where the laboratory uses one, each with its own authorisation check. | Configure a countersignature; the report requires all three before issue. |
| M21-46 | [SHOULD] | The system shall be able to produce, for any report, a **statement of how it was produced**: the system used, the period of regular use, the source data, the integrity controls, and the identity of the responsible official — for use where an electronic record must be produced as evidence. | Generate the statement for one report; it prints as a signed one-page document. |

### M21.7 Backup, recovery and system integrity

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M21-47 | [MUST] | The system shall take **automated backups** on a defined schedule: a full backup daily, and transaction-level backup at least every 15 minutes where the database supports it. Backups shall include the database, the stored report and invoice files, the sample photographs, the certificate attachments and the configuration. | Inspect the backup status screen; the last successful full and incremental backups are shown with their times and sizes. |
| M21-48 | [MUST] | At least one backup copy shall be kept **away from the laboratory** — an external disk taken off site on a defined rotation, and where connectivity permits an encrypted upload. Backups shall be encrypted. | Show two backup targets on the status screen, with the date of the last off-site rotation. |
| M21-49 | [MUST] | The system shall support and **record a restore test** at a defined interval (default monthly), including what was restored, to where, by whom, and whether the data was verified correct. An overdue restore test shall raise an alert. | Perform one restore test; the record is stored and the alert clears. |
| M21-50 | [MUST] | The laboratory shall state a **recovery time objective** and a **recovery point objective** in the configuration, and the documentation shall record the recovery procedure step by step so that a person who did not build the system can follow it. Defaults, which shall equal the objectives in NFR-95 and NFR-96: recovery point objective 15 minutes; recovery time objective 4 working hours for a software or data failure, extending to 1 working day for total loss of the server hardware. The laboratory may set a tighter objective but the system shall refuse a value looser than these without the Quality Manager's recorded authorisation. | Read the recovery procedure; it names the steps, the files and the commands. |
| M21-51 | [MUST] | Backup failure shall raise an **immediate alert** to the Administrator and the Lab In-Charge. | Cause a backup to fail; the alert is sent and logged. |
| M21-52 | [MUST] | The system shall keep a **System Incident Log** inside the application: what failed, when it was noticed and by whom, the effect on data, the immediate action, the corrective action, and closure. This is a record an assessor asks for and it is usually missing. | Log one incident through to closure; it prints as part of the management review pack. |
| M21-53 | [MUST] | The system shall keep **application and access logs** for a rolling period of at least **180 days**, stored within India, and shall be able to provide them on request. Personal data shall be kept out of these logs so that the log store does not itself become a personal-data risk. | Inspect the log retention setting; it is 180 days or more; inspect a sample of log lines; no names, telephone numbers or addresses appear. |
| M21-54 | [MUST] | Referential integrity and value constraints shall be enforced **in the database**, not only in the application, and a periodic integrity verification job shall check file checksums and report mismatches. | Attempt an invalid write directly to the database; refused by a constraint. Run the integrity job; a deliberately corrupted file is reported. |
| M21-55 | [MUST] | The system shall run correctly on a **single server inside the laboratory with no internet connection** for at least a full working week, with all outbound integrations queued. | Disconnect the internet for a working week in a test environment; receive samples, test, verify, issue reports and print everything; nothing internal fails. |

### M21.8 Software validation and change control

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M21-56 | [MUST] | Because this system is built for this laboratory rather than bought off the shelf, it shall be **validated by the laboratory before use**, and the developer shall produce the validation pack listed in M21.9. | The pack exists, is signed by the Approving Authority, and is held by the laboratory, not only by the developer. |
| M21-57 | [MUST] | The system shall hold a **Change Control Register**: change number, description, reason, category (program change / configuration change / method or formula change / report template change / permission change / infrastructure change), risk assessment, who requested, who authorised, the test evidence reference, the date implemented, and who verified afterwards. | Make one change; the register entry is complete before the change goes live. |
| M21-58 | [MUST] | **A change shall not go live without an authorisation and a test-evidence record.** This applies to configuration changes as much as to program changes — a change to a calculation formula, a decision rule, a rate, a report template or a permission is a validated change. | Attempt to activate a formula change with no change-control entry; refused. |
| M21-59 | [MUST] | Each release shall carry a **test-evidence pack**: the list of tests run, the expected and actual results, the person who ran them, the date, and any defect found and its disposition. The pack shall include the regression tests in M21.10. | Release once; the pack is attached to the change-control entry. |
| M21-60 | [MUST] | The system shall show its own **version number and release date** on every screen footer and on the login page, and shall record the version in use against every record created. | Open any screen; the version is visible. A record created before an upgrade shows the earlier version. |
| M21-61 | [MUST] | The system shall hold the **infrastructure specification** as a documented configuration item: operating system, database, runtime versions, server location, power arrangement, patching policy. A deviation from it shall be a change requiring change control. The privileged database account capable of schema change on the audit tables shall be named in the specification; its credential shall be held under **dual control by the Approving Authority**, not by the Administrator or the developer in day-to-day use, and every use of it shall be recorded as a change-control event under M21-57. | Read the specification; it names versions, not just product names, and it names the privileged audit-schema account and states who holds its credential. Use that account once; a change-control entry exists for the use. |
| M21-62 | [SHOULD] | The **user manual** shall be held under document control (M14), version-matched to the release, and reachable from within the application. | Open help from any screen; the manual version matches the application version. |

### M21.9 The validation pack the laboratory must hold

| Item | What it contains |
|---|---|
| User requirements specification | This document, signed by the laboratory |
| Risk assessment of the software | Which failures could produce a wrong reported result, and what controls address each |
| Design and configuration documentation | The data model, the calculation formulas per method, the report templates, the numbering formats, the permission matrix |
| Test protocol and executed test records | Positive and negative cases for every enforced control (see M21.10) |
| Traceability matrix | Requirement identifier → test case → result |
| Validation summary report | A fitness-for-intended-use statement, authorised by the Approving Authority |
| Change control procedure | How every later change will be authorised, documented and tested before implementation |
| Backup and restore test records | Evidence that a restore has actually been performed |
| System incident log | Live, not a blank template |
| User access review records | The periodic review outcomes |

### M21.10 Regression tests that must exist and be re-run every release

Each of these is a negative test — proof that the system refuses what it must refuse.

| # | Test | Expected result |
|---|---|---|
| 1 | Enter a result using an instrument whose calibration expired before the observation date | Refused |
| 2 | Enter a result using an expired or quarantined consumable batch | Refused |
| 3 | Enter a result as a person without competency authorisation for that method on that date | Refused |
| 4 | Verify a result submitted by the same person | Refused unless overridden, and the override raises a nonconformity |
| 5 | Authorise a report as a signatory not authorised for one of its tests | Refused, with the test named |
| 6 | Edit an issued report | Impossible; the amendment route is offered instead |
| 7 | Delete any record anywhere | No delete exists; database refuses |
| 8 | Edit an audit entry as the Administrator | Refused |
| 8a | As the application's database account, UPDATE a row in an audit table | Refused; the attempt is itself recorded in the audit trail |
| 8b | As the application's database account, DELETE a row in an audit table | Refused; the attempt is itself recorded in the audit trail |
| 8c | As the application's database account, TRUNCATE an audit table | Refused; the attempt is itself recorded in the audit trail |
| 8d | As the application's database account, ALTER an audit table | Refused |
| 8e | As the application's database account, DROP an audit table | Refused |
| 8f | As the application's database account, disable or drop an audit trigger | Refused; and where disabled by other means the daily audit-integrity job of M21-31b reports it the same day |
| 9 | Change a raw observation without a reason | Refused |
| 10 | Change a raw observation with a reason | Old value, new value, actor, time and reason all recorded and visible |
| 11 | Issue a report while a quality control breach withholds the run | Refused |
| 12 | Issue a report while a payment hold applies | Refused unless overridden, and the override is logged |
| 13 | Read customer identity as a blinded role, through the interface and through the data layer | Absent in both |
| 14 | Reach another customer's record from the portal | Refused and logged |
| 15 | Run the equipment impact analysis over a known window | Returns exactly the expected set, twice, identically |
| 16 | Run the batch impact analysis over a known window | Returns exactly the expected set |
| 16a | Verify or issue a report for a test caught in an open equipment or batch impact analysis and not yet dispositioned | Refused |
| 17 | Allot financial document numbers from two sessions at once | No duplicate, no gap |
| 18 | Define a financial series that could exceed sixteen characters | Refused |
| 19 | Compute a set of known historical results from real worksheets | Reproduces every one exactly, including rounding |
| 20 | Compute a pass or fail at and just inside and just outside a specification limit under the configured decision rule | Correct in all three cases |
| 21 | Start a test before pre-conditioning is complete | Refused |
| 22 | Enter an environmental reading outside limits | Excursion created; affected tests withheld where the method's limit is breached |
| 23 | Reprint an old invoice and an old report after a template change | Renders exactly as first issued |
| 24 | Operate for one working week with no internet | All internal functions work; outbound messages queue and later send |

### M21.11 Configuration and feature switches introduced by this document

The register covers M10 to M22. The first block is the conditioning method parameters seeded in the M10 seeded method parameters table. They are held per method version under M14-06, each with an effective date, and every one is seeded **unconfirmed** pending OPEN-Q-C11; none of them may appear in program code. They are listed here because this register is the single place an assessor looks for every value the laboratory can change without a developer.

| Switch | Default | Where it applies |
|---|---|---|
| `conditioning_oven_temperature` per method version | 140 °C, no tolerance seeded | M10-17, M10 seeded method parameters |
| `conditioning_first_drying_minutes` per method version | 15 minutes; 10 minutes on the IS 15090 (Part 6) conditioned-size method version | M10-17 |
| `conditioning_subsequent_drying_minutes` per method version | 5 minutes, repeating | M10-17 |
| `conditioning_convergence_threshold_percent` per method version | 0.25 percent of the previous weighing | M10-17 |
| `moisture_set_agreement_tolerance_percent` | 0.5 percent, as the absolute difference between the two sets | M10-20 |
| `skein_lacing_tare_exemption_metres` | 1 metre per skein | M10-10 |
| `tare_sample_books` / `tare_sample_bands_per_book` | 5 books / 3 middle cotton bands per book | M10-09 |
| `skein_draw_gap_warn_minutes` | 120 minutes — a local operating assumption, not a figure from the standard | M10-14, OPEN-Q-C11 |
| `conditioning_method_designation` | IS 15090 (Part 3):2002 | M10-29, M10-30, M1-36 |
| `calibration_alert_lead_days` | 60, 30, 15, 7, 0 | M11-15 |
| `calibration_due_from` | Actual date performed | M11 rule 2 |
| `calibration_override_alert_threshold` | 2 per month | M11 rule 8 |
| `equipment_label_layout` | Default layout | M11-21 |
| `amc_renewal_alert_days` | 60, 30 | M11-27 |
| `batch_expiry_alert_days` | 90, 60, 30, 7 | M12-16 |
| `batch_issue_order` | First expiry first out | M12-27 |
| `competency_review_warn_days` | 60, 30, 7 | M13-15 |
| `competency_on_review_lapse` | Suspend | M13-15 |
| `segregation_rules` | Performer ≠ checker; checker ≠ authoriser | M13-10 |
| `provisional_authorisation_days` | 90 | M13 rule 3 |
| `signatory_notification_days` | 15 | M13-19 |
| `superseded_method_use_allowed` | With Approving Authority reason | M14-13 |
| `measurement_uncertainty_policy` per method | When near limit | M14-28 |
| `qc_rules_enabled` | 1-in-3-sigma; 2-of-2-sigma; range-4-sigma; 4-of-1-sigma; 10-same-side | M15-03 |
| `qc_breach_withholds_release` | On | M15-04 |
| `impact_analysis_withholds_release` | On | M11-24, M12-12 |
| `complaint_ack_target_days` | 2 working days | M15-21 |
| `complaint_closure_target_days` | 30 | M15-21 |
| `environment_limits` per area | 27 ± 2 °C, 65 ± 2 percent relative humidity | M16-03 |
| `environment_reading_schedule` per area | Twice per working day | M16-06 |
| `back_entry_tolerance_hours` | 2 | M16-07, M21-34 |
| `urgent_priority_rules` | Cap 5 per day; cut-off 11:00; tests completable in 6 hours; charge multiplier 2 | M17-07 |
| `payment_release_rule` per unit, per order type with a per-customer-category override | Required before report release | WF-5, M17-42 |
| `unregistered_recipient_value_threshold` | To be confirmed with the tax adviser | M17-27 |
| `tax_rate_master` | Empty until confirmed in writing | M17-30, OPEN-Q19 |
| `returns_filed_upto` per registration | Blank | M17-36 |
| `waiver_approval_limit` | To be set by the unit | M17-10 |
| `payment_reminder_days` | 15, 30 | M17-47 |
| `accreditation_symbol_on_reports` | Off | M13 OPEN-Q8 |
| `notification_event_enabled` per event | As in the M19.1 table | M19-01 |
| `notification_quiet_hours` | 21:00 to 07:00 for SMS and WhatsApp | M19-07 |
| `notification_retry_policy` | 5 attempts over 24 hours | M19-06 |
| `notification_languages` | English, Telugu, Hindi | M19-02 |
| `blinding_enabled` per role and section | On for the Tester role | M21-22 |
| `unblind_window_minutes` | 60 | M21-21 |
| `password_policy` | Minimum 12 characters; 5-password history; 180-day age | M21-04 |
| `account_lockout` | 5 attempts, 30 minutes | M21-05 |
| `session_timeout_minutes` | 30 staff, 15 portal | M21-06 |
| `two_factor_required_roles` | Approving Authority, Quality Manager, Administrator | M21-07 |
| `signature_tier` | In-application electronic signature with re-authentication | M21-43 |
| `access_review_interval` | Quarterly | M21-09 |
| `backup_schedule` | Daily full; transaction logs every 15 minutes | M21-47, NFR-97 |
| `restore_test_interval` | Monthly | M21-49 |
| `recovery_point_objective` / `recovery_time_objective` | 15 minutes / 4 working hours, extending to 1 working day on total loss of server hardware | M21-50, NFR-95, NFR-96 |
| `log_retention_days` | 180 | M21-53 |
| `retention_policy` per record type | See M21.12 | M21-63 |
| `number_series_definitions` | See M17 and the numbering module | M17-28 |
| `working_calendar` | Monday to Saturday, unit hours, holiday list | Turnaround calculation |

### M21.12 Data retention and archival

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M21-63 | [MUST] | The system shall hold a **retention policy table keyed by record type**, each row stating the retention period, the event the clock starts from, the disposal method, and the role that must authorise disposal. | Open the table; every record type listed in M21.13 has a row. |
| M21-64 | [MUST] | **No record shall be deleted automatically.** The system shall flag records whose retention has ended, present them for review, and require a named person's authorisation; disposal shall itself create a permanent disposal record. | Let a retention period end; the record appears for review and is not removed until authorised. |
| M21-65 | [MUST] | Archived records shall remain **retrievable and printable**, and an archive tier shall not make them unavailable to a search. | Search a record moved to archive; it is found and prints. |
| M21-66 | [MUST] | Where a record is subject to a **legal hold** — a dispute, a court matter, an information request, an audit query — it shall be marked and shall be exempt from disposal until the hold is lifted, with the lifting recorded. A hold shall be placed or lifted only by the **Approving Authority or the Quality Manager**, with the ground for the hold and the authority relied on recorded; the Administrator may raise the request and the Lab In-Charge may read it, but neither may place or lift a hold. | Place a hold; attempt disposal; refused. Attempt to lift the hold as the Administrator; refused. |

Recommended default retention periods, to be confirmed against the parent body's own record rules:

| Record type | Recommended retention | Clock starts from |
|---|---|---|
| Issued reports and their frozen files | 10 years | Date of issue |
| Technical records: observations, worksheets, calculations, environmental records | 10 years | Date of test |
| Sample inward, test, report issue and dispatch registers | Permanent | — |
| Financial documents: invoices, receipts, credit notes, vouchers | 8 years | End of the financial year |
| Equipment records, calibration certificates, impact analyses | Life of the instrument plus 10 years | Condemnation |
| Consumable batch records and certificates | 5 years, and in any case until the material's validity has expired | Disposal of the batch |
| Personnel competence, training and authorisation records | Service plus 5 years | Date of leaving |
| Complaints, nonconformities, corrective actions | 10 years | Closure |
| Internal audit and management review records | 10 years | Date of the record |
| Audit trail | At least as long as the records it describes | — |
| Application and access logs | 180 days minimum | — |
| Customer personal contact data | 3 years after the last transaction, then pseudonymised | Last transaction |
| Retained physical samples | Per material type, set in the sample type master | Date of report |

The periods above apply to each record as a whole, including personal data frozen inside it. Pseudonymising the customer contact record does not and cannot alter personal data already frozen into an issued document or a signed file; that data is disposed of only with the document that contains it.

**OPEN-Q30:** What record-retention rules apply to this unit under the parent body's own regulations and government audit requirements? — *Recommended default:* adopt the table above unchanged — issued reports ten years from date of issue, technical records ten years from date of test. No universal figure exists: the accreditation standard fixes none and leaves the period to laboratory policy, and the only figure the research verified is a three-year minimum that applies solely to certain regulatory schemes, which government audit requirements typically exceed. Confirm against CSTRI's and the Board's own record rules and the government audit requirement before any disposal is ever authorised.

### M21.13 Personal data — practical requirements

The applicable data-protection law and its rules are in force in stages, with the substantive obligations on notice, consent, rights, retention and breach reporting taking full effect at a future date the research places in **May 2027**. Some relaxations exist for processing by the State and its instrumentalities, but the research could not confirm that they apply to a statutory body charging commercial fees, and it notes that liability for a security failure is not relaxed in any case. The sensible engineering position is therefore to build to the full obligation.

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M21-67 | [MUST] | The system shall present a **short, standalone privacy notice** in plain language at the point where personal data is collected — the sample submission form and the portal registration — stating what is collected, why, how long it is kept and whom to contact. It shall not be buried inside longer terms. Notices shall be versioned and the version shown shall be recorded against the consent. | Register a customer; the notice version and the timestamp are recorded. |
| M21-68 | [MUST] | Consent for anything **beyond the core service** — status messages by WhatsApp, marketing, inclusion in a published list of tested units, use of commercial test data in research or annual publications — shall be captured separately, unticked by default, and recorded as its own record with a timestamp and the channel. | Give consent for status messages only; the marketing flag remains off. |
| M21-69 | [MUST] | The notice and the consent capture shall be available in **English and Telugu**, with Hindi where required. | Switch to Telugu; the notice renders correctly. |
| M21-70 | [MUST] | The system shall **not collect a national identity number** for any purpose. Where a business identifier is needed, the tax registration number shall be used. | No field for a national identity number exists anywhere in the system. |
| M21-71 | [MUST] | The system shall tag each personal-data field with its **purpose**, so that retention and export limitation can be applied by rule rather than by an annual manual clean-up. | Inspect the field register; each personal-data field carries a purpose. |
| M21-72 | [MUST] | The system shall resolve the conflict between the duty to erase and the duty to retain by **separating technical records from personal contact data**, and by supporting **pseudonymisation** rather than deletion: after the retention period, the personal fields are replaced by the opaque customer token already used elsewhere, so the technical and accounting record survives intact and the person is no longer identifiable **from any live record**. Pseudonymisation applies to the live customer master and contact record, the notification addresses, the portal login and the optional-consent records. It does not apply to, and shall never alter, the name-and-address snapshots frozen into issued documents and their stored files (M8-05, M8-43, M10-30, M10-35, M17-27, M17-39, M22-20), the signature records bound to those files (M21-40), or the audit trail (M21-31). Those are retained under a legal and regulatory obligation for the periods in M21.12 and are outside the scope of erasure. The privacy notice (M21-67) shall say so in plain words, consistent with M18.4 rule 5. This decision and its reasoning shall be recorded in the quality documentation. | Pseudonymise one customer. The customer master, contact record, notification addresses and portal login no longer identify them, and a fresh print of the sample inward and test registers shows the token in place of the name (M20-18, M20-20). The frozen report and invoice files still open and print, are byte-identical to issue, still bear the name and address recorded at the time of issue, and their checksums and signatures still verify. |
| M21-72a | [MUST] | Because CloudZoo ERP is the master of customer legal name and address under M22.1 and pushes a nightly full reconciliation into the LIMS copy, a pseudonymisation decision shall be recorded as a **LIMS-side suppression flag that the reconciliation honours**, and shall raise a request to the ERP to pseudonymise its own master. Until the ERP confirms, the customer shall be shown as pseudonymised in the LIMS and the pending ERP request shall appear on an exception list. | Pseudonymise a customer, run the nightly reconciliation, and confirm the name is not restored and the pending ERP request is listed. |
| M21-73 | [MUST] | The system shall provide, through the portal and at the counter, the ability to **see the personal data held, request a correction, and withdraw an optional consent**. Withdrawal shall not break work in progress. | Exercise each right once; each is serviced and recorded. |
| M21-74 | [MUST] | The system shall record a **grievance** relating to personal data in the register in M15 with its own category, name a **Grievance Officer**, publish that officer's designation and contact on the portal footer and on printed documents, run an SLA clock, and escalate well before the published limit. The research places the outer limit at 90 days; the recommended internal target is far shorter. | Log one grievance; the officer is notified; the clock and escalation work. |
| M21-75 | [MUST] | The system shall hold an **incident register** capable of answering, quickly, **which individuals were affected** by a data incident. That requires access logging at record level for personal data, not only application-level logs. | Simulate an incident on a set of records; the affected customers are listed within minutes. |
| M21-76 | [MUST] | The system shall support **two separate notification clocks** with two different recipients and two different formats: notification of a cyber incident to the national computer emergency response team within **six hours** of noticing, and notification of affected individuals within **72 hours** of notifying the data-protection authority. The documentation shall state both plainly so that neither is missed. | Read the incident procedure; both clocks, both recipients and both formats are described. |
| M21-77 | [MUST] | The system shall keep **personal data out of application and access logs**, out of web addresses and query strings, and out of error messages. | Inspect logs, addresses and an error page; no names, numbers or addresses appear. |
| M21-78 | [MUST] | Where information about a customer is obtained from a **source other than the customer** — a complainant, a regulator, another unit — that information shall be marked as such, and the **identity of the source shall not be disclosed to the customer** unless the source agrees. | Record such information; the source field is masked from any customer-facing view. |
| M21-79 | [MUST] | Where information is released because the law requires it or a contract authorises it — an information request, a court order, a departmental requisition — the system shall record what was released, to whom, under what authority, and the **notification to the customer** unless notification is prohibited by law. | Record one such release; the register entry is complete. |
| M21-80 | [MUST] | Where the parent body intends to **publish aggregate statistics** or use commercial test data in research or an annual report, the system shall gate the analytics and publishing exports on the customer having been informed in advance, through a flag on the customer or the order. | Attempt a research export including a customer who has not been informed; that customer's data is excluded and the exclusion is reported. |
| M21-81 | [MUST] | The system shall hold **signed confidentiality undertakings** for staff, contract staff, trainees, escorts for external assessors, and any external party operating or maintaining the system, and shall flag missing or expired undertakings. | Add an external maintenance contractor with no undertaking; a warning appears. |
| M21-82 | [MUST] | Where the system is operated or maintained by an external party or hosted outside the laboratory, there shall be a **written agreement** covering confidentiality, impartiality, data ownership, where the data is located, breach notification, sub-contractors and exit with return of data; and the party shall be on the approved supplier list with periodic re-evaluation. | The agreement reference is recorded against the arrangement in the system. |

**OPEN-Q31:** Who will be the named Grievance Officer for personal-data matters, and what response time will the unit publish? — *Recommended default:* the Unit In-Charge, with a published response time of 30 days against an outer legal limit the research places at 90 days, and an internal target of 7 days.

**OPEN-Q32:** Does the relaxation available for processing by the State apply to this unit's commercial testing, and does the parent body intend to rely on it? — *Recommended default:* do not rely on it; build to the full obligation, which is achievable at modest cost if built from the start, and record the decision so it can be revisited if the parent body obtains a written opinion.

**OPEN-Q33:** Where will the system be hosted — a server inside the laboratory, the parent body's own facility, the national informatics provider, or an empanelled cloud service? The research notes that government workloads must be hosted within India and, where cloud is procured, from an empanelled provider whose specific service is empanelled. — *Recommended default:* a single server inside the laboratory as the primary deployment, with encrypted off-site backup; treat any cloud move as a change requiring the parent body's information-technology approval, and keep the software portable so the move is a deployment exercise rather than a rebuild.

**OPEN-Q34:** Will the public report-verification page and the customer portal require a security audit by an empanelled auditor and a website-quality certification before going live, and on which domain will they sit? — *Recommended default:* assume yes to the security audit; keep the public surface deliberately small so that conformance and audit are cheap; treat it as a separate deliverable with its own approval gate.

---

## M22. Integration with CloudZoo ERP

**What this module is for, in plain words.** CloudZoo ERP already exists and already knows how to hold customers, raise invoices, take receipts, keep inventory and hold assets. This system knows about samples, tests, results and reports. The two must work together without either one quietly overwriting the other. This section decides, field by field, which system is the master, which way the data flows, what triggers a flow, and what happens when the other system cannot be reached. The governing rule is stated once and applied everywhere: **for every field, exactly one system is the master, and the other holds a read-only copy.** The commonest integration failure in this kind of project is two editable copies of a customer's address.

**Stated plainly: we do not have CloudZoo ERP's documentation.** Everything below is therefore a recommendation with the assumption written next to it, and there is a list of things that must be learned before building.

### M22.1 Ownership table

| Data or function | Owned by CloudZoo ERP | Owned by LIMS | Direction of sync | Trigger | Failure handling |
|---|---|---|---|---|---|
| **Customer identity**: legal name, address, tax registration number, permanent account number, state and state code, category, credit terms | Master | Read-only copy plus LIMS-only fields (see next row) | ERP → LIMS | On creation and on change in the ERP; plus a nightly full reconciliation | LIMS uses its last known copy; the record is marked "not synchronised since"; a customer can still be received and a sample logged |
| **Customer LIMS-only attributes**: customer class for pricing, blinding pseudonym, sample return preference, report delivery preference, notification preferences and language, consent records, declared representatives, impartiality relationship flags, whether informed about publication of aggregate data | – | Master | LIMS only; not pushed | – | Not applicable |
| **New customer created at the laboratory counter** | Master, eventually | Creates a provisional record | LIMS → ERP, then ERP → LIMS to confirm | On acceptance of the first order | The provisional customer works fully in the LIMS with a temporary reference; the ERP identifier is filled in when the push succeeds; **sample receipt is never blocked** |
| **Customer contacts** | Master where the ERP holds them | Read-only copy; LIMS masters portal login contacts and authorised representatives | Both, by field | On change | As for customer identity |
| **Item and service master** (each sellable test as a service line, and each consumable as a stock item) | Master | Read-only copy; LIMS masters the technical definition of the test | ERP → LIMS for the sellable identity; LIMS → ERP when a new test is added to the catalogue | On catalogue change | The LIMS can price and record work using its own catalogue; the ERP link is filled in later |
| **Service classification code and tax code per service** | Master | Read-only copy | ERP → LIMS | On change | LIMS uses its last known copy and flags the invoice for review |
| **Rate card / price list** | Master of the posted price used on the accounting document | Master of the commercial decision: which rate card line applies to which test, method and customer class, and the computed charge | LIMS → ERP as the invoice line amount | At invoice creation | If the ERP is unreachable the LIMS holds the invoice as pending and the report may still be issued or held per the payment rule |
| **Concession or waiver** | Records the resulting amount | Master of the approval, the reason and the approver | LIMS → ERP as a discount line | At invoice creation | Queued |
| **Proforma / estimate** | – | Master | LIMS only | – | Not applicable |
| **Advance demand and receipt voucher** | Master of the accounting document | Master of the demand and its link to the order | LIMS → ERP | On taking an advance | Queued; the LIMS issues its own money receipt immediately so the customer is not kept waiting |
| **Tax invoice** | Master: the posted accounting document, its number and its ledger effect | Master of the link from each invoice line to the specific test, and of the decision to invoice | LIMS → ERP to create; ERP → LIMS to return the number, date and posted status | On completion of the work, or on order acceptance where advance billing applies | Queued with an idempotency key; the LIMS shows "invoice pending"; a reconciliation report lists anything queued for more than a configured period |
| **Invoice number series** | Master, if the ERP already maintains a compliant financial-year series | Master, if it does not | One or the other, never both | – | **This must be decided once and never split.** See OPEN-Q36 |
| **Receipt / payment** | Master of the accounting receipt and the ledger posting | Master of the money receipt issued at the counter, the route-specific reference values, the reconciliation to the order, and the release decision | Both: LIMS → ERP for money taken at the counter; ERP → LIMS for money received through bank or portal channels | On recording, and on statement import | Queued; the awaiting-credit worklist in the LIMS keeps working; nothing about testing is blocked |
| **Credit note and refund voucher** | Master of the accounting document | Master of the reason, the approval and the link to the test | LIMS → ERP | On approval | Queued |
| **Tax masters and rates** | Master | Read-only copy with effective dates | ERP → LIMS | On change | LIMS uses the last known dated rate and flags any invoice raised while out of sync |
| **Customer ledger and outstanding** | Master | Read-only view for the payment-hold decision and the ageing report | ERP → LIMS | Nightly, and on demand before a report release decision | If unavailable, the LIMS uses its own record of payments applied and marks the hold decision as made on local data |
| **General ledger postings** | Master, exclusively | No involvement | – | – | Not applicable |
| **Inventory quantity and valuation** for consumables | Master of value and of the accounting stock ledger | Master of **fitness for use**: batch, expiry, certificate, quarantine, acceptance, blocking | LIMS → ERP for quantity movements; ERP → LIMS for item identity and cost | On issue, receipt, adjustment and disposal | Queued; the LIMS never lets an ERP outage stop a test, and never lets the ERP decide whether a batch may be used |
| **Purchase indent / requisition** | Master of the purchase document and its approval chain beyond the laboratory | Master of the technical requirement, the acceptance criteria and the laboratory's own approval | LIMS → ERP | On laboratory approval of the indent | Queued; the indent is visible in the LIMS as "sent, awaiting ERP reference" |
| **Purchase order and goods receipt** | Master | Read-only reference on the batch record | ERP → LIMS | On goods receipt in the ERP, or entered in the LIMS and pushed | Manual entry permitted with the ERP reference filled in later |
| **Approved supplier list and evaluation** | Master if the ERP holds vendors | Master of the technical evaluation and the approval for specific items | Both, by field | On change | LIMS works from its own list |
| **Fixed assets and depreciation** for laboratory equipment | Master of capitalised cost, depreciation and the asset register entry | Master of the metrological record: calibration, traceability, state, usage, impact analysis | LIMS → ERP for asset identity and location; ERP → LIMS for the asset number and book values | On commissioning, on location change, and annually | Queued; nothing about calibration control depends on the ERP |
| **Employee master** | Master if the ERP holds personnel | Master of competency, authorisation, delegation, signatory status and undertakings | ERP → LIMS for identity and employment dates | On joining, transfer and leaving | LIMS can create a staff record locally and link the ERP identifier later |
| **Document and attachment storage** | – | Master | LIMS only | – | Not applicable. Frozen reports, certificates, photographs and signed files must be under the LIMS's own integrity controls |
| **Reports and test data** | – | Master, exclusively | LIMS may expose a read-only reference to the ERP if needed | – | Not applicable |
| **Numbering for sample, test, worksheet, report and quality documents** | – | Master, exclusively | – | – | Not applicable |
| **Audit trail** | Each system keeps its own | Master for everything in this document's scope | – | – | Not applicable |

### M22.2 Requirements

| ID | Priority | Requirement | Acceptance check |
|---|---|---|---|
| M22-01 | [MUST] | The integration shall be built as a set of **calls over a web interface** (representational state transfer over secure transport) using an **outbox pattern** with **idempotency keys**. *Outbox pattern, in two sentences: when the LIMS needs to tell CloudZoo ERP something, it first writes the message into its own outbox table in the same database transaction as the business change, so the message can never be lost even if the network is down; a separate background worker then reads the outbox and delivers the messages, retrying until each one succeeds.* | Cause a delivery failure; the business change is still committed, the message stays in the outbox, and it is delivered when the connection returns. |
| M22-02 | [MUST] | Every outbound message shall carry an **idempotency key** derived from the LIMS record and the operation, so that a retry after an uncertain response cannot create a duplicate invoice, receipt or indent in the ERP. | Send the same invoice twice with the same key; the ERP holds one invoice. |
| M22-03 | [MUST] | **The ERP being unreachable shall never block** sample receipt, sample acceptance, test allocation, result entry, verification, report authorisation, report issue, calibration recording, batch acceptance or stock issue. Only the creation of the accounting document itself may wait. | Disconnect the ERP; perform every listed action; all succeed; the outbox holds the accounting messages. |
| M22-04 | [MUST] | The outbox shall be **visible to staff** with a count and an age, so that Accounts can see that three invoices are waiting rather than discovering it a week later. | Queue three messages; the count and the oldest age appear on the Accounts dashboard. |
| M22-05 | [MUST] | Retries shall use increasing intervals up to a configurable ceiling, and a message that fails beyond a configurable age (default 24 hours) shall raise an alert to the Administrator and Accounts. | Leave a message undeliverable for the configured period; the alert is raised. |
| M22-06 | [MUST] | Inbound changes from the ERP shall be **applied only to fields the ERP masters**, and shall never overwrite a LIMS-mastered field. A conflicting inbound value for a LIMS-mastered field shall be logged and discarded, not applied. Inbound delivery shall be idempotent, symmetrically with the outbound rule of M22-02: an inbound message shall be recognised by its source identifier and applied at most once; a repeat delivery shall be logged and discarded, not re-applied. | Send an inbound customer record containing a value for a LIMS-only field; the LIMS value is unchanged and the attempt is logged. Deliver the same inbound message twice; the second delivery is logged and discarded and the record changes only once. |
| M22-07 | [MUST] | Every synchronised record shall hold the **other system's identifier** (`erp_customer_id`, `erp_invoice_id`, `erp_item_id`, `erp_asset_id`, `erp_receipt_id`, `erp_employee_id`) and a **last-synchronised timestamp**, and the interface shall show when a record has not synchronised recently. | Open a customer whose sync is stale; the screen shows the age of the last successful synchronisation. |
| M22-08 | [MUST] | The system shall produce a **reconciliation report** listing mismatches between the two systems for every synchronised entity: records present in one and not the other; records whose mastered fields disagree; invoices raised in the LIMS with no ERP counterpart; receipts in the ERP with no LIMS match; stock quantity differences. The report shall be runnable on demand and on a schedule. | Introduce a deliberate mismatch; the report finds it and names the field. |
| M22-09 | [MUST] | The reconciliation report shall be **actionable**: each line shall offer a resolution — resend, re-pull, accept the master's value, or flag for manual investigation — and every resolution shall be logged. | Resolve one line by resending; the resolution and actor are logged. |
| M22-10 | [MUST] | All integration traffic shall be **authenticated and encrypted in transit**, with credentials held as configuration in a protected store, never in program code or in a file kept with the source. | Inspect the configuration; credentials are not in the source repository. |
| M22-11 | [MUST] | Every inbound and outbound message shall be **logged** with its direction, the endpoint, the payload identifier (not the full personal data), the response status, the timestamp and the retry count, and shall be retained per the log retention policy. | Send and receive one message each; both appear in the integration log. |
| M22-12 | [MUST] | Personal data in integration payloads shall be limited to what the receiving system needs, and shall never be placed in a web address or query string. | Inspect an outbound customer message; personal fields are in the body, not the address. |
| M22-13 | [MUST] | The integration shall be **versioned**: each message shall carry a schema version, and the LIMS shall continue to work against the previous version for a defined transition period after the ERP changes. | Change the schema version; the previous version is still accepted for the configured period. |
| M22-14 | [MUST] | The integration shall be **tested against an ERP upgrade** before the upgrade goes live in production, and the test shall be part of the change-control record in M21-57. | An ERP upgrade is recorded in the change register with an integration test result. |
| M22-15 | [SHOULD] | Where CloudZoo ERP offers no programmatic interface, the integration shall fall back to **file exchange**: the LIMS writes a file to an agreed folder in an agreed format, the ERP imports it, and the ERP writes a response file the LIMS reads. The same outbox, idempotency key, logging and reconciliation requirements shall apply. | Configure file mode; the same reconciliation report works. |
| M22-16 | [SHOULD] | Where the LIMS is built as a **module inside CloudZoo ERP** rather than a separate application, the ownership table in M22.1 shall still be honoured field by field, and the technical records, audit trail, frozen report files and the enforcement gates in M11, M12, M13, M15 and M16 shall remain under the LIMS module's own control and shall not be reachable by generic ERP editing screens. | Attempt to edit a verified result through a generic ERP data screen; refused. |
| M22-17 | [MUST] | The LIMS shall be able to **operate with the integration switched off entirely**, using its own customer master, its own invoice numbering and its own stock records, so that go-live is not dependent on the ERP work being finished. | Turn the integration off; the whole system works; turn it on; the accumulated data pushes across. |
| M22-18 | [MUST] | A **commercial hold shall never silently influence a technical decision.** Where the ERP reports an unpaid balance, that shall appear as an explicit, logged commercial hold on report release, separate from and visible alongside the technical release state. | Set an unpaid balance in the ERP; verification of results still proceeds; only the report release is held, visibly and with a reason. |
| M22-19 | [SHOULD] | The system shall provide a **manual override entry** for every ERP-supplied reference — invoice number, receipt number, asset number, purchase order number — so that a value can be typed in when the integration is not yet built or is temporarily broken. | Type an ERP invoice number manually; the record links correctly. |
| M22-20 | [MUST] | The **frozen issued files** — reports, invoices, certificates, signed documents — shall be stored by the LIMS with their checksums and shall not be delegated to the ERP's document store unless that store can guarantee the same immutability and checksum verification. | Attempt to replace a stored report file; refused; the checksum verification detects any tampering. |

### M22.3 Assumptions being made, stated plainly

| # | Assumption | What breaks if it is wrong |
|---|---|---|
| 1 | CloudZoo ERP holds a customer master with at least name, address, tax registration number, state and a stable identifier | The LIMS must master the customer entirely, and the ERP becomes a downstream copy — a bigger change to the ownership table than it looks |
| 2 | CloudZoo ERP can create an invoice through an interface, or can import one from a file | Invoicing has to be done twice, once in each system, and the reconciliation report becomes the only control |
| 3 | CloudZoo ERP maintains, or can be made to maintain, a financial-year invoice series that is consecutive, at most sixteen characters, and unique in the year | The LIMS must master invoice numbering and the ERP must accept the LIMS's number; if neither can, the laboratory has a compliance problem that is not a software problem |
| 4 | CloudZoo ERP can hold custom fields, or can at least store an external reference against a customer, an item, an invoice and an asset | Every link has to be maintained in a mapping table inside the LIMS, which works but adds a reconciliation burden |
| 5 | CloudZoo ERP's inventory does not enforce expiry or quarantine | If it does, the two systems will fight over whether a batch may be used; the rule must then be that the LIMS decides and the ERP is told |
| 6 | CloudZoo ERP has a fixed-asset register with depreciation | If not, the asset fields in M11-28 are the laboratory's only asset record and must be printable as an asset card |
| 7 | The LIMS will be a separate application integrating with CloudZoo ERP, not a module inside it | If it is a module, M22-16 applies and the enforcement gates must be protected from generic ERP editing |
| 8 | Both systems will run on the same network, in the same building | If the ERP is hosted elsewhere, the outbox pattern becomes essential rather than merely prudent, and the offline requirement in M21-55 becomes the deciding architectural constraint |

### M22.4 Rules and edge cases

1. **A customer exists in both systems with slightly different names.** The mapping is by identifier, never by name. Where no identifier exists, the reconciliation report lists the candidates and a human decides. Never match on name automatically.
2. **The ERP creates an invoice the LIMS does not know about.** It appears on the reconciliation report as an unmatched ERP invoice. Someone must link it to an order or explain it. Do not hide it.
3. **The LIMS pushes an invoice and the response is lost.** The idempotency key makes the retry safe. Without the key, this single case produces duplicate invoices, which in a gap-free numbered series is a serious problem.
4. **The ERP is upgraded and a field changes name.** The schema version in M22-13 is what prevents a silent failure. Test before, not after.
5. **The laboratory decides to stop using CloudZoo ERP.** The LIMS must survive that. This is the practical reason for M22-17: the integration is a feature, not a foundation.
6. **Both systems hold a customer address and both are editable.** This is the failure the whole section exists to prevent. Whichever way it is decided, the non-master copy must be visibly read-only in the interface, with a note saying where to change it.

**OPEN-Q35:** What is CloudZoo ERP's integration surface — a documented web interface, direct database access, file import and export, or nothing? What authentication does it use? — *Recommended default:* assume a web interface is available and design the outbox against it; if only file exchange is possible, M22-15 applies and the same controls are retained. **This is the first question to answer before any integration code is written.**

**OPEN-Q36:** Which system will master the tax invoice number series, and does CloudZoo ERP's existing series already satisfy the consecutive, sixteen-character, financial-year-unique rule? — *Recommended default:* let CloudZoo ERP master the invoice number if its series is already compliant, because the accounting document belongs there; if it is not compliant, the LIMS masters the number and the ERP records it as supplied. Decide once. Never split.

**OPEN-Q37:** Can CloudZoo ERP hold custom fields or an external reference against customer, item, invoice and asset records? — *Recommended default:* assume not, and maintain the mapping inside the LIMS with the reconciliation report as the control.

**OPEN-Q38:** Is the LIMS to be a module inside CloudZoo ERP, or a separate application with an integration? — *Recommended default:* a separate application, because the offline requirement, the immutable audit trail, the frozen report files and the enforcement gates are all easier to guarantee in software the laboratory controls; and because it keeps the LIMS alive if the ERP is ever replaced.

**OPEN-Q39:** Does CloudZoo ERP already hold a consumables inventory and a fixed-asset register for this unit, with any data in them? — *Recommended default:* assume both exist but are unused for laboratory items; load the LIMS registers first and push to the ERP once the ownership table is agreed with whoever maintains the ERP.

**OPEN-Q40:** Who maintains CloudZoo ERP, and will they commit to a stable interface and to notifying this project before an upgrade? — *Recommended default:* obtain a named contact and a written note of the interface version in use before integration work starts; without that, build the LIMS to run with the integration switched off (M22-17) and treat the integration as a later phase.