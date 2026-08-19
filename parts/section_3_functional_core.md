## M1. Master Data

**What this module is for, in plain words.** Master data is the set of reference lists the laboratory maintains once and then re-uses on every job. Customers, sample types, the list of tests the laboratory offers, the methods behind those tests, the parameters measured under each method, the fee schedule, the units of measure, the holiday calendar, the storage bins and the pick-lists of reasons. If these lists are correct, almost everything else in the system fills itself in. If they are wrong, every sample, every report and every invoice inherits the error. This module also decides who may change a master and what happens to work already done under an older version — because a test report issued in August 2026 must still print the method version, the price and the customer address that were in force in August 2026, not today's.

### M1 screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Customer list and Customer edit | Front Desk (create), Unit Incharge (approve) | Maintain the customer master |
| Customer contact list | Front Desk | People, phones, e-mail addresses per customer |
| Customer merge | Unit Incharge only | Combine duplicate customer records |
| Sample Type master | Unit Incharge | Silk and textile material categories |
| Test Catalogue | Unit Incharge | The list of billable tests offered |
| Test Method master (with revisions) | Unit Incharge / Quality Manager | Method code, standard reference, revision, verification record |
| Parameter master | Unit Incharge / Quality Manager | Individual characteristics measured |
| Test-Parameter mapping | Unit Incharge / Quality Manager | Which parameters belong to which method, in what order |
| Specification / Limit Set and grade tables | Quality Manager | Grade bands and pass/fail limits |
| Unit of Measure master | Unit Incharge | denier, tex, %, g/den, strokes, kg, metres, numbers |
| Rate Card and Rate Card Lines | Accounts (draft), Unit Incharge (approve) | Fee schedule with effective dates and concession rules |
| Tax master | Accounts | GST codes, rates, SAC codes, effective dates |
| Working-day calendar and holiday list | Front Desk / Unit Incharge | Working hours, weekly off, declared holidays |
| Department / Section master | Unit Incharge | Physical Testing, Chemical Testing, Conditioning |
| Location / Storage bin master | Store Keeper | Racks, shelves, cupboards, conditioning chamber |
| Numbering series and counters | Unit Incharge (setup), system (allocation) | Number formats for every document type |
| Reason code master | Quality Manager | Rejection, cancellation, amendment, send-back, hold, disposal reasons |
| Master data change log viewer | Unit Incharge / Quality Manager / auditor | Who changed which master, when, from what to what, and why |
| Master data import (CSV) | Unit Incharge | Bulk load at go-live |

### M1 requirements

**General master-data rules**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-01 | Every master record has a machine identifier that is never shown to users, and a separate human-readable code that is unique and never re-used. | [MUST] | Create two masters with the same code; the second is rejected. |
| M1-02 | No master record may be deleted once it has been referenced by any transaction. The only way to stop using it is to set `is_active = No`, which hides it from new selection lists but keeps it visible on old records. | [MUST] | Try to delete a test that appears on an issued report; the system refuses and offers "deactivate" instead. |
| M1-03 | Every master record carries created-by, created-on, last-changed-by, last-changed-on, and every field change is written to the master data change log with old value, new value and a reason. | [MUST] | Change a customer address; the change log shows old and new value, the user, the timestamp and the reason text. |
| M1-04 | Masters that affect money, method identity or reported results are **version-controlled with effective dates**, not edited in place. These are: Test Method, Parameter, Specification/Limit Set, Rate Card, Tax master. Editing them creates a new version; the old version stays retrievable. | [MUST] | Revise a method; a report issued last month still prints the older revision number. |
| M1-05 | Masters that are descriptive only (customer address, contact phone, storage bin name) may be edited in place, but every transaction that prints them takes a **frozen copy** at the moment of issue. | [MUST] | Change a customer's address after a report is issued; reprint the report — the old address still appears. |
| M1-06 | Only the roles named in the screen table may create or change each master. The system refuses and logs any attempt by another role. | [MUST] | A tester tries to open the Rate Card screen; access is denied and the attempt is logged. |
| M1-07 | Every master list screen supports search, filter by active/inactive, sort, and export to CSV and PDF. | [MUST] | Export the test catalogue to CSV; the file opens in Excel with all columns. |
| M1-08 | A bulk import from CSV exists for each master, with a dry-run mode that reports every row that would fail and why, before anything is written. | [SHOULD] | Import a file with two bad rows; the dry-run report names both rows and the reason, and nothing is saved. |
| M1-09 | A "master data readiness" screen lists every master with a record count and a red/amber/green status against the go-live checklist in M1-52. | [SHOULD] | Open the screen before go-live; incomplete masters show red. |

**Customer master**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-10 | The system holds a Customer master with the fields listed in the field table below, including customer category, concession category, GSTIN, credit terms, advance-required flag and blacklist flag. | [MUST] | Create a customer with every field populated and save successfully. |
| M1-11 | Customer category is a controlled pick-list, not free text. Minimum values: Reeler, Twister/Throwster, Weaver (Handloom), Weaver (Powerloom), Trader, Exporter, Co-operative Society, Self-Help Group (SHG), Government Department, Government Scheme, CSB Internal Unit, CSB Internal R&D, Student/Training, Individual, Other. | [MUST] | The category field shows exactly these values and refuses a typed value. |
| M1-12 | Concession category is a separate pick-list from customer category, because the same firm may qualify for a concession on one test and not another. Minimum values: None, Handloom Weaver, Tamil Nadu Co-operative Unit, Indigenous ARM Silk Unit, Bivoltine, Government (non-commercial), Scheme-linked (TCIDS or similar), In-house Research / Advisory (zero charge), Other. | [MUST] | Set a customer to "Handloom Weaver"; the rate card resolves the handloom rate for zari chemical testing. |
| M1-13 | The system supports a **walk-in / one-time customer** created from a short form carrying only the fields marked "Yes (clerk must enter)" in the "Required at provisional save?" column of the M1 field table — customer name, primary mobile and customer category. Every other mandatory field is stored at its declared default, not left null. The record is marked `is_provisional = Yes`. A Test Request may be confirmed, a sample registered, tested and reported, and a Money Receipt (M17-16) issued against a provisional customer. A tax invoice, bill of supply or receipt voucher may not be issued until State is present — because the place-of-supply split in M1-62 and M17-29 is computed from it — and, where the document value exceeds `unregistered_recipient_value_threshold` (M17-27), until Address line 1, Village / town, District and PIN code are present. Completing the record clears `is_provisional` and never changes the customer identifier or the customer code. | [MUST] | Save a customer with name, mobile and category only; sample registration, acceptance, testing and the Money Receipt all succeed. Attempt a tax invoice; it is blocked with the missing fields named. Fill the address and state; the same customer code is retained, `is_provisional` clears, and the invoice issues with the correct intra-State or inter-State split. |
| M1-14 | The system warns on likely duplicates at save time by comparing normalised name (case-folded, punctuation and common words such as "M/s", "Silks", "Sri", "Sree" removed) and mobile number, and shows the candidate matches. It warns; it does not block. | [MUST] | Create "Sree Laxmi Silks" when "Sri Lakshmi Silks" exists with the same mobile; a warning lists the existing record. |
| M1-15 | A customer merge function exists, restricted to the Unit Incharge. It moves all transactions to the surviving record, keeps the losing record as a permanently redirected alias, and writes a merge log. Issued reports and invoices continue to print the frozen name they were issued with. | [SHOULD] | Merge two customers; all orders appear under the survivor, and an old issued report still prints its original name. |
| M1-16 | A customer flagged `is_blacklisted = Yes` cannot be selected on a new Test Request. An override requires the Unit Incharge, a mandatory reason, and is logged. | [MUST] | Try to raise a request for a blacklisted customer as Front Desk; blocked. As Unit Incharge with a reason; allowed and logged. |
| M1-17 | Bill-to party and report-to party may be different customers or different contacts. Both default to the requesting customer. | [MUST] | Set report-to to a different contact; the report dispatch uses that contact. |
| M1-18 | The system records, per customer, whether the customer has been informed of the privacy notice and which version, and whether the customer consents to (a) SMS or WhatsApp status messages and (b) inclusion of their data in any published or aggregated statistics. Both consents default to No. | [MUST] | Save a customer with consent unticked; the system does not send SMS to that customer. |
| M1-19 | The system records whether the customer is a registered business entity for tax purposes, separately from whether a GSTIN has been supplied. | [MUST] | Save a registered customer with no GSTIN and see a validation warning. |
| M1-20 | A customer may have an "extra confidentiality requested" flag which, when set, suppresses the customer name entirely (not merely masks it) on the public verification page described in M9. | [SHOULD] | Set the flag; the public verification page shows "Customer name withheld at customer's request". |
| M1-21 | An **internal pseudo-customer** must exist for CSB in-house research and advisory samples, and for samples referred from other CSB units. These carry concession category "In-house Research / Advisory (zero charge)". A test request against them produces a report but no invoice. | [MUST] | Register an internal R&D sample; the order completes and no invoice is generated. |
| M1-22 | Customer name and address must accept and correctly store Telugu and Devanagari script in addition to Latin script, and must render correctly in the generated PDF. | [MUST] | Enter a Telugu customer name; it appears correctly on the printed report, not as boxes. |

**Contact master**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-23 | A customer may have many contacts. Each contact has name, designation, mobile, alternate mobile, e-mail, preferred language, and flags for "primary", "report recipient" and "invoice recipient". | [MUST] | Add three contacts, mark one primary; only one primary is allowed. |
| M1-24 | At most one contact per customer may be marked primary. | [MUST] | Mark a second contact primary; the system either refuses or automatically clears the first, and logs it. |

**Sample Type master**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-25 | The Sample Type master exists with, at minimum, these seeded records: Raw Silk – Skein/Hank, Raw Silk – Bobbin, Raw Silk – Book, Raw Silk – Bale, Raw Silk – Lot (multi-bale), Dupion Raw Silk, Tasar Raw Silk, Muga Raw Silk, Eri Silk, Thrown / Twisted Silk Yarn (cone), Thrown / Twisted Silk Yarn (hank), Warp Beam / Warp, Weft Yarn, Zari Thread, Silk Fabric (piece), Saree, Blended Fabric, Knitted Fabric, Loose Fibre, Cocoon (fresh), Cocoon (stifled/dried), Reeling Water, Dye / Chemical, Soap, Other. | [MUST] | Open the Sample Type list; all seeded types are present and each has a short code. |
| M1-26 | Each sample type carries: short code used as a label and number prefix, default retention days, default disposal mode, minimum quantity, default unit of measure, a "requires pre-conditioning" flag, a "destructive testing likely" flag, and a "is this an entity with sub-samples (bales, books, skeins)" flag. | [MUST] | Set Raw Silk – Lot to "has sub-samples"; sample registration then asks for the number of bales. |
| M1-27 | Sample type short codes must be three characters or fewer, because the code is used inside the sample number. | [MUST] | Enter a four-character code; rejected. |

**Test Catalogue**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-28 | The Test Catalogue holds one record per **billable service as the customer understands and pays for it**. A conceptually identical test performed under two different standards at two different prices is **two catalogue records**, not one. | [MUST] | The catalogue contains "Cohesion – BIS (IS 15090 Pt XI)" and "Cohesion – ISA" as separate records with different prices. |
| M1-29 | Each catalogue record carries: test code, test name as printed on the report, section, default method, standard turnaround in working days (or hours, for tests under one day), whether the test is inside the NABL accredited scope, whether it is offered at this unit or must be referred, unit of charge, minimum chargeable quantity, quantity step, required equipment types, required consumable types, required competency (method + activity), applicable sample types, and SAC code for tax. **Minimum chargeable quantity is a commercial figure only.** It sets the smallest quantity the customer is billed for and must never drive a material-sufficiency check; the technical minimum sample quantity lives on the method version (M14-10). | [MUST] | Open any catalogue record; every field above is present and editable by the authorised role. Set a minimum chargeable quantity below the method's technical minimum; the sufficiency check of M2-26 is unaffected by it. |
| M1-30 | **Unit of charge** is a controlled pick-list: Per sample, Per lot, Per bale, Per skein, Per bobbin, Per reading, Per measurement point, Per kilogram, Per 1000 numbers, Per warp, Per metre, Per year (rental), Per consignment value band, Per certificate. The system must be able to price all of these without code changes. | [MUST] | Price a zari test at four measurement points; the invoice line shows quantity 4 at the per-point rate. |
| M1-31 | A catalogue record may be marked as a **non-test chargeable service** (machine rental per year, warping per warp, cocoon stifling per 1000, test-dyeing, training fee, pre-shipment inspection). These do not create test allocations but do create invoice lines and, where relevant, a certificate. | [MUST] | Add a machine rental line to an order; no tester allocation is created but the invoice includes it. |
| M1-32 | A catalogue record may be marked as a **test bundle / profile** that expands into several component tests when selected. The bundle may carry a package price different from the sum of the components. | [SHOULD] | Select "All testing & grading – BIS"; the system creates the component test allocations and prices the bundle once. |
| M1-33 | Each catalogue record carries a flag "requires prior tests" and a list of prerequisite tests, because in raw silk grading the winding test physically produces the bobbins that all downstream tests use. Ordering a downstream test alone must automatically include the prerequisite, with a visible note. | [MUST] | Order Cleanness only; the system adds Winding and Seriplane winding as prerequisites and shows why. |
| M1-34 | The catalogue must record, per test, whether the test is normally performed at this unit or is normally **referred to another CSB unit** (for example TTL Bengaluru), and if referred, the default receiving unit. | [MUST] | Select a referred test; the system prompts for the subcontracting workflow in M3. |
| M1-35 | A test may be marked Tatkal-eligible (completable within six hours) so the express-service rules in M2 and M3 can be enforced. | [MUST] | Try to book Tatkal on a non-eligible test; blocked with a message naming the six-hour rule. |

**Test Method master (with revision control)**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-36 | The Method master holds one record per method **revision**. Fields: method code, title, issuing body (Bureau of Indian Standards / International Silk Association / International Organization for Standardization / American Society for Testing and Materials / American Association of Textile Chemists and Colorists / CSTRI in-house), designation, edition or year, revision number, status, effective from, effective to, superseded-by link, scope note, required standard atmosphere, required pre-conditioning hours, the sample draw rule as defined once on the method version in M14-10 and not restated here, required reading counts, rounding rule, significant figures, calculation formula version, measurement uncertainty value and its reporting policy, required equipment types, required consumable types, and attached documents. | [MUST] | Create a method revision; all fields save and the method appears in the selection list only while its effective dates are current. |
| M1-37 | A method revision cannot be set to status Active unless a **verification record** is attached, showing that this laboratory has demonstrated it can perform the method. | [MUST] | Try to activate a method with no verification record; blocked with a clear message. |
| M1-38 | A method revision that is Superseded or Withdrawn cannot be selected for new work. It may be selected only with an explicit override, a reason, and a record that the customer was informed. | [MUST] | Select a superseded method on a new request; the system demands a reason and records customer intimation. |
| M1-39 | Editing an active method **never** changes it in place. The system creates the next revision and marks the previous one Superseded on a date the user sets. | [MUST] | Edit an active method; the list now shows two revisions with non-overlapping effective dates. |
| M1-40 | Every result row and every issued report stores the **method revision identifier**, not just the method identifier. | [MUST] | Open a report from before a method revision; it prints the older revision. |
| M1-41 | Where the method is a non-standard, laboratory-developed, or modified method, a **validation record** with five named sections (validation procedure, specification of requirements, determination of performance characteristics, results obtained, statement of fitness for intended use) must be attached before activation. | [MUST] | Activate an in-house method with no validation record; blocked. |
| M1-42 | The method master records whether the method requires two independent assessors (for visual and photographic comparison work such as neatness and cleanness), so M6 can demand two sets of readings. | [SHOULD] | Set the flag on Neatness; result entry asks for a second assessor's readings. |

**Parameter master and Test-Parameter mapping**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-43 | The Parameter master holds one record per measured characteristic, with: parameter code, printed name, unit of measure, data type (numeric / text / enumerated list / boolean / grade letter), decimal places, rounding rule, permitted enumerated values where applicable, plausibility minimum and maximum, and whether the parameter feeds a conformity (pass/fail) decision. Where M14-06 defines a permitted value list on a particular method version, **that list governs**, and the Parameter master's list is a default only. | [MUST] | Create "Cohesion (strokes)" as integer, zero decimals, and the entry screen refuses a decimal value. Define a different value list for the same parameter on one method version; the entry screen uses the method version's list, not the Parameter master's. |
| M1-44 | Parameters whose value is chosen from a fixed set must be enumerated, not numeric-free. Neatness in particular must be an enumerated picker with the values 100, 90, 80, 70, 60, 50, 30, 10, because the method judges panels against a fixed set of official standard photographs. The permitted value list is held on the per-method-version parameter definition of M14-06, not as a global property of the parameter, because the same characteristic may be judged against different official value sets under different methods. The eight values above are the IS 15090 Part 9 / BIS set and are seeded as unconfirmed; the ISA set is not yet established — see OPEN-Q12. | [MUST] | Under the BIS method revision 85 is not selectable for neatness; the picker offers only the values configured for that method revision, and the same parameter code can carry a different value list under another method revision. |
| M1-45 | The Test-Parameter mapping table links parameters to a **method revision**, with display sequence, mandatory flag, reportable flag, number of readings required, whether the parameter is calculated, and the calculation formula. | [MUST] | Map 12 parameters to the grading method; the worksheet shows them in the mapped order. |
| M1-46 | Where a parameter is calculated, the formula must be stored as data (not in program code), must be versioned, and must reference other parameters by code. | [MUST] | Change a formula; the change creates a new formula version and old results still show the value computed under the old one. |
| M1-47 | The system must store **both denier and tex** for every linear-density parameter, or store one and display both, because the Indian standard prefers tex while the trade speaks denier. | [MUST] | Enter a size result in denier; the report can print tex as well. |
| M1-48 | Every calculation formula in the master must have a stored set of **test vectors** (input values and the expected output, taken from historical manual worksheets) which the system re-runs automatically on every software release. | [MUST] | Run the test vector suite; all vectors pass and the run is logged as validation evidence. |

> **OPEN-Q12:** Confirm against a real ISA grading worksheet (i) the permitted neatness value set under the ISA method, and (ii) whether the rounding convention recorded in the research — 100 to 50 percent to the nearest 5 percent, below 50 percent to the nearest 10 percent — applies to the individual panel assessment or only to the reported average and low neatness. — *Recommended default:* seed the BIS eight-value list for the BIS method revision, and hold the ISA neatness value list as **unconfirmed** rather than assuming it matches BIS. Do not seed a specific ISA value list until the worksheet is seen, and keep the rounding rule where it already lives, on the method revision (M1-36).

**Specification / Limit Set and grade tables**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-49 | A Specification Set holds named limit and grade schemes, each with: code, name, applicable sample type, applicable size category, standard reference, effective from, effective to, and whether it is a customer-specific specification or a standard-based one. | [MUST] | Create a BIS grading set and an ISA grading set as separate records. |
| M1-50 | Specification lines hold: parameter, grade code (where the line is a grade band), minimum value, maximum value, expected text value, and sequence. The grade code list for raw silk must support 4A, 3A, 2A, A, B, C, D, E and must be extendable without code change. | [MUST] | Load the BIS grade table; a size deviation value maps to the correct grade band. |
| M1-51 | Grade computation is **configuration, not code**. The system must express: (a) which parameters are Major tests, (b) which are Auxiliary tests, (c) the size category rule that decides which parameters apply, (d) the rule that the provisional grade is the worst Major grade, (e) the rule that Auxiliary shortfalls lower the provisional grade by the number of class differences, and (f) the cap that a difference of more than one class counts as one class for specified parameters. All six must be data. | [MUST] | Change the Major/Auxiliary classification of one parameter in the master; the computed grade changes accordingly with no software change. Compute a grade for a 40-denier lot (Category III); cohesion is excluded from the computation and maximum deviation is evaluated as a major test, with no software change. Repeat for a 20-denier lot (Category II); cohesion is included and maximum deviation is evaluated as an auxiliary test with the one-class cap applied. |

#### Raw silk grade computation reference data, IS 15090:2002, marked unconfirmed pending the scientist's grade tables

This is the content of the M1-51 configuration. Every value below is seeded from the governing standard, held with an effective date, and marked **unconfirmed** until the scientist signs it off against a real Dharmavaram grading worksheet before go-live (OPEN-Q13). None of it may appear in program code.

| Item | Seeded content | Notes |
|---|---|---|
| Size categories | Category I up to 2.0 tex (18 denier); Category II 2.1 to 3.6 tex (19 to 33 denier); Category III 3.7 tex (34 denier) and above | The category is resolved from the size **marked or declared on the bales**, not from the measured size. A lot marked 33 denier may measure 34.5 denier and still pass the 7 percent gate of WF-74, so M6-03's "declared or measured size" must not be free to resolve the category differently — the marked size governs category resolution, and the measured size governs the reading-count rule only. |
| Major characteristics | Size deviation, evenness variation I, evenness variation II, cleanness, average neatness, low neatness — plus maximum deviation in Category III only | |
| Auxiliary characteristics | Maximum deviation (Categories I and II only), evenness variation III, winding breaks, tenacity, elongation, cohesion | |
| Cohesion applicability | Evaluated only where the marked size is 33 denier or finer, that is Categories I and II | Applying cohesion to coarse silk produces a wrong grade that looks plausible, which is why this rule is stated rather than left implicit. |
| One-class cap | Applies to evenness variation III, and to maximum deviation only in the categories where maximum deviation is auxiliary (I and II) | Do not state the cap for maximum deviation unqualified: in Category III it is a major test and the auxiliary cap cannot apply to it. |
| Authoritative classification store | The Major / Auxiliary classification lives on `mst_grade_rule`, which is keyed on `spec_set_id` and therefore per category | The `is_major_characteristic` and `is_auxiliary_characteristic` booleans on `mst_method_parameter` cannot express maximum deviation being major in Category III and auxiliary in Categories I and II. They are **non-authoritative report-ordering defaults only**, and the grade engine must never read them. |

The BIS and ISA grade tables are entered as separate records because they deliberately differ; they are not translations of each other. Any enumeration of the major and auxiliary sets found elsewhere in this document is scoped to Category II and points here.

> **OPEN-Q13:** Do Dharmavaram's grade tables match the seeded IS 15090 reference data above — the three size category boundaries, the major and auxiliary sets, the Category III promotion of maximum deviation, and the 33-denier cohesion cut-off? — *Recommended default:* seed exactly the values in the table above, mark every row unconfirmed, and have the scientist confirm or correct each one against a real grading worksheet and the unit's own grade tables before go-live. Do not compute a grade in a live system while any row is still unconfirmed.

**Unit of Measure master**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-52 | A Unit of Measure master exists with, at minimum: denier (den), tex, gram (g), milligram (mg), kilogram (kg), metre (m), millimetre (mm), micrometre (µm), percent (%), gram per denier (g/den), gram per tex (g/tex), centinewton per tex (cN/tex), turns per metre (TPM), strokes, breaks, panels, stripes, numbers (Nos), skeins, bobbins, books, bales, lots, degrees Celsius (°C), relative humidity percent (%RH), grams per square metre (gsm), cycles, litres (L), millilitres (mL). Each unit may declare a base unit and a conversion factor. | [MUST] | Convert 20 denier to tex using the master; the result is 2.22 tex. |

**Rate Card / fee schedule**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-53 | The Rate Card is a dated header with: code, name, approval reference (the CSB or CSTRI office order number), approval date, effective from, effective to, and active flag. Rate card lines carry: test, concession category, unit of charge, unit price, minimum charge, quantity step, express (Tatkal) multiplier, express flat addition, tax code, and any form surcharge. | [MUST] | Create a rate card effective 01-Dec-2023 and another effective a later date; a request dated between them prices from the correct card. |
| M1-54 | The system must never allow two active rate card lines for the same combination of test plus concession category plus overlapping effective dates. | [MUST] | Create an overlapping line; blocked with a message naming the conflict. |
| M1-55 | Historical documents reprint at the rate in force on their own date, not today's rate. | [MUST] | Reprint an invoice from an earlier rate card period; the old price appears. |
| M1-56 | A rate card line may be marked zero-charge (advisory basis). A zero-charge line still creates a report and full traceability but no invoice line. | [MUST] | Register an in-house research sample; the order shows zero value and no invoice. |
| M1-57 | The express (Tatkal) rule must be expressible as: price multiplier, a booking cut-off time of day, a maximum number of samples per day, and a restriction to tests flagged Tatkal-eligible. All four are configuration values. | [MUST] | Book a sixth Tatkal sample on the same day; blocked with a message naming the daily cap. |
| M1-58 | A **fallback rule** must exist: where no rate line is found for a test at this unit, the system resolves to the rate approved for the reference laboratory (TTL, CSTRI, Bengaluru) and flags the line as "priced by fallback rule" for review. | [SHOULD] | Order a test with no local rate; the system prices it from the fallback card and flags the line. |
| M1-59 | Pre-shipment inspection and any other **consignment-value-band** service must be priced from a band table (value from, value to, fee) and must capture the declared consignment value at request time. | [SHOULD] | Enter a consignment value; the correct band fee is applied. |

**Tax master**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-60 | The Tax master holds: tax code, description, SAC or HSN code, Central GST percentage, State GST percentage, Integrated GST percentage, tax treatment (taxable forward / exempt / nil-rated / recipient-liable under reverse charge / non-GST), notification or authority reference, effective from, effective to. **No tax rate may appear anywhere in program code.** | [MUST] | Change a tax rate in the master with a new effective date; new invoices use the new rate and old ones do not change. |
| M1-61 | The SAC code is held on the test catalogue record, not globally on the invoice, because renting a machine, stifling cocoons and testing a skein are different services with different classifications. | [MUST] | An invoice with a test line and a machine-rental line shows two different SAC codes. |
| M1-62 | Each unit is linked to the tax registration (GSTIN) under which it raises invoices, with that registration's state and state code, so the system can decide Central plus State GST versus Integrated GST by comparing the supplier state with the place of supply. This must never be a checkbox a clerk ticks. | [MUST] | Raise an invoice for a customer in another state; the system produces Integrated GST automatically. |
| M1-79 | The system shall refuse to issue any tax invoice, bill of supply or receipt voucher while the issuing unit has no linked tax registration, or while its linked registration is marked **unconfirmed**, naming the missing or unconfirmed registration in the refusal message. A registration is marked confirmed only by recording who confirmed it, on what date, and against what written evidence. This is what gives the "unconfirmed" mark a defined behaviour rather than leaving it decorative. | [MUST] | With no registration row present, attempt to issue an invoice; refused with a message naming the missing registration. Mark the registration unconfirmed and retry; still refused. Record the confirmation with its evidence; the invoice then issues with the correct intra-State or inter-State split. |

> **OPEN-Q1:** Which GSTIN does RSTRS Dharmavaram raise invoices under — the Karnataka registration held by CSTRI, or a separate Andhra Pradesh registration? Every invoice's tax split depends on this. — *Recommended default:* build the tax registration as a configurable master with one row per registration and **seed no registration row**. Do not pre-populate the parent institute's Karnataka registration: the research pack records it as unverified and expressly warns against assuming which registration the unit bills under, and a Karnataka state code on an Andhra Pradesh unit would set the intra-State versus inter-State computation wrongly on every local invoice. Obtain the registration in writing, with a copy of a recent real invoice from the unit, per PLN-02 and PLN-06, before the first invoice is issued. Do not code either answer in. Until it is answered, M1-79 refuses to issue any tax document. This is the same question as OPEN-Q-B14 and OPEN-Q-D18; answer it once.

> **OPEN-Q2:** What is the correct GST treatment of each test — taxable at the standard rate under the technical testing and analysis classification, or exempt for cocoon-related work that may qualify as a service in respect of agricultural produce? — *Recommended default:* set every test to "taxable forward" at the rate the finance wing confirms, and give the Accounts role the ability to mark specific tests exempt with a notification reference. Obtain a written opinion from CSB's tax adviser before go-live.

> **OPEN-Q3:** Is CSB inside the electronic-invoicing (Invoice Reference Number) mandate, or has an exemption declaration been filed? — *Recommended default:* build the invoice with every field an Invoice Registration Portal submission needs, and add nullable columns for the reference number, acknowledgement number, acknowledgement date and signed payload. Leave the integration switched off until the answer is in writing.

**Working-day calendar**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-63 | The calendar master holds the normal weekly working pattern (working days, start time, end time, lunch break) plus a dated exception list with day types: full holiday, half day, working Saturday, local holiday, restricted holiday. | [MUST] | Add 15 August as a holiday; a due date computed across it moves forward one working day. |
| M1-64 | A cut-off time of day exists. A sample accepted after the cut-off starts its turnaround clock at the start of the next working day. | [MUST] | Accept a sample at 17:45; the clock starts next morning. |
| M1-65 | The holiday list for the current and next financial year must be loaded before go-live and must be maintainable by the Front Desk role without developer help. | [MUST] | Front Desk adds a locally declared holiday and saves it. |

**Department / Section, Location / Storage bin**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-66 | A Section master exists with, at minimum: Physical Testing, Chemical Testing, Conditioning, Sample Receipt / Counter, Stores. Each section has a code and a section in-charge. | [MUST] | Assign a test to a section; the tester work queue filters by section. |
| M1-67 | The Location master is hierarchical (building → room → rack → shelf → bin), each level with a code, and each location may declare whether temperature and humidity are controlled and monitored. | [MUST] | Create a four-level hierarchy and assign a sample to the deepest bin. |

**Numbering series**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-68 | A numbering series master exists, with one series per document type per financial year per unit. Series types must include at least: Enquiry, Quotation, Test Request, Sample, Sub-sample, Test Allocation, Worksheet, Test Report, Grading Certificate, Weight (Conditioning) Certificate, Preliminary Examination Report, Unique Laboratory Report number, Tax Invoice, Bill of Supply, Receipt Voucher, Refund Voucher, Credit Note, Debit Note, Money Receipt, Nonconformity, Complaint, Amendment. | [MUST] | Every document type in the list has a configured series before go-live. |
| M1-69 | Each series defines: prefix, financial-year format, sequence width, reset policy, and (for tax documents) a maximum total length of sixteen characters composed only of letters, digits, hyphen and slash. The system must refuse to save a series whose maximum possible number would exceed sixteen characters for a tax document type. | [MUST] | Try to save a tax invoice series that could produce a 21-character number; blocked with the length shown. |
| M1-70 | Numbers are allocated by the server at the moment of issue, inside the same database transaction that saves the document, using a locked counter row. Numbers are never allocated when a user opens a blank form, and never derived by taking the highest existing number and adding one. | [MUST] | Two users issue documents at the same instant; both get distinct consecutive numbers with no gap and no duplicate. |
| M1-71 | A number, once allocated, is never re-used. A cancelled document keeps its number and is marked Cancelled. | [MUST] | Cancel an invoice; the number remains listed as cancelled and the next invoice takes the next number. |
| M1-72 | A series register report exists which lists, for every series, every number from one to the current counter with its state: Issued, Cancelled or **Missing**. A Missing entry raises an alert to the Unit Incharge. | [MUST] | Force a gap in a test database; the register shows the number as Missing and an alert is raised. |
| M1-73 | The Unique Laboratory Report number format must be a **configuration template**, expressed as an ordered list of parts with fixed text, date-derived parts and a running number, with the running number's length, number base and reset policy configurable, and with a valid-from and valid-to date on the template itself so the laboratory can operate an old and a new format across a transition. | [MUST] | Configure two templates with adjoining validity dates; reports issued either side of the date produce the correct format with no software change. |

> **OPEN-Q4:** What are the existing legacy number formats at Dharmavaram, and must the new system continue any of them (for example continuing the sample serial rather than restarting at one)? — *Recommended default:* configure each series with an opening counter value set to the legacy series' last used number, so continuity is preserved. Ask for the last used number of every register on the day before go-live.

**Reason code master**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M1-74 | All reasons throughout the system are chosen from a **pick-list plus optional free-text note**. Free text alone is never permitted where a reason is required. | [MUST] | Try to save a rejection with only free text; the system demands a code. |
| M1-75 | Reason code groups that must exist before go-live, each with seeded values: Sample Rejection; Sample Acceptance-with-Reservation; Order Cancellation; Sample Withdrawal; Test Abort; Hold; Result Revision; Verification Send-back; Report Amendment; Report Withdrawal; Disposal Method; Unblinding; Override (calibration expired, expired consumable lot, unauthorised analyst, quality-control breach, segregation of duties); Lost Enquiry; Refund. | [MUST] | Open the reason code master; all fifteen groups exist with at least three seeded values each. |
| M1-76 | Seeded sample rejection reasons must include at minimum: quantity insufficient for the tests requested; sample wet or damp; sample stained or contaminated; packaging damaged in transit; seal broken; identification marks absent or illegible; sample does not match the customer's declaration; suspected admixture of commercial varieties; suspected adulteration; sample type outside the unit's scope; sample perished; other (note mandatory). | [MUST] | The rejection screen offers all of these. |
| M1-77 | Seeded amendment reasons must include at minimum: transcription error; calculation error; equipment later found out of calibration; consumable lot later found unsuitable; method deviation discovered after issue; customer detail correction (non-technical); result superseded by repeat test; other (note mandatory). Each reason carries a flag "does this reason automatically raise a nonconformity record" and a flag "is this reason technical or purely clerical". | [MUST] | Amend a report for a calculation error; a nonconformity record opens automatically. Amend for a customer address correction; no nonconformity opens. |
| M1-78 | Each reason code is active or inactive, is never deleted, and prints on documents by its printed description, not its code. | [MUST] | Deactivate a reason; it disappears from new pick-lists but still displays on old records. |

### M1 field table — Customer create/edit screen

The "Required at provisional save?" column exists so that the Mandatory column keeps its meaning for the full form while the two-field counter creation of M1-13 remains possible. It takes exactly three values: **Yes (clerk must enter)**; **Default applies**, meaning the field is stored at its declared default rather than left null; and **No**, meaning the field may be blank until the record is completed.

| Field | Type | Mandatory? | Required at provisional save? | Validation | Notes |
|---|---|---|---|---|---|
| Customer code | Text, up to 12 | Auto | Auto | System-generated from the Customer series; unique | Never editable |
| Customer name | Text, up to 200, multi-script | Yes | Yes (clerk must enter) | Not blank; duplicate warning per M1-14 | Prints on report and invoice |
| Trade name / brand | Text, up to 200 | No | No | — | Sometimes differs from legal name |
| Customer category | Pick-list | Yes | Yes (clerk must enter) | From M1-11 list | Drives statistical returns, the M17-42 payment-release rule and the M20 monthly return. "Individual" and "Other" are acceptable single-click values, so the field costs one tap at the counter |
| Concession category | Pick-list | Yes | Default applies (None) | From M1-12 list; default "None" | Drives rate resolution |
| Is registered business entity for tax | Yes / No | Yes | Default applies (No) | Default No | Drives place-of-supply logic |
| GSTIN | Text, 15 | Conditional | No | If "registered business entity" = Yes then required; 15 characters; checksum validated; state code must match address state | Warn, do not block, if the checksum fails, so a bad card is not blocked at the counter |
| PAN | Text, 10 | No | No | Format check if entered | Fallback identifier |
| Address line 1 | Text, up to 200, multi-script | Yes | No | Not blank | Frozen on issued documents; required before a tax document above the M17-27 threshold |
| Address line 2 | Text, up to 200 | No | No | — | |
| Village / town | Text, up to 100 | Yes | No | Not blank | Used for regional analysis; required before a tax document above the M17-27 threshold |
| District | Text, up to 100 | Yes | No | Not blank | Required before a tax document above the M17-27 threshold |
| State | Pick-list | Yes | No | Indian states and union territories with codes | Drives tax split; required before any tax document per M1-13 |
| PIN code | Text, 6 | Yes | No | Six digits | Required before a tax document above the M17-27 threshold |
| Country | Pick-list | Yes | Default applies (India) | Default India | |
| Primary mobile | Text, 10–15 | Yes | Yes (clerk must enter) | Digits; ten-digit Indian mobile validated; duplicate warning | Used for one-time-password based report access in M9 |
| Alternate phone | Text | No | No | — | |
| E-mail | Text | No | No | Format check | Report delivery |
| Preferred language | Pick-list | Yes | Default applies (English) | English / Telugu / Hindi; default English | Drives SMS and customer-facing text |
| Credit terms | Pick-list | Yes | Default applies (Advance required) | Advance required / Payment before report release / Net 15 / Net 30 / Government scheme (no charge) | Default "Advance required". Stored as `credit_terms`; supplies the default for the order-level Payment terms field of the M3 request header, and nothing more |
| Advance required | Yes / No | Yes | Default applies (derived) | Derived from credit terms; editable by Accounts only | Together with `credit_terms` this sets the per-order Payment terms default that M3-26 reads when it raises the Hold-for-Payment state. It is **subordinate to WF-5's `payment_release_rule`**: where the two disagree, the `payment_release_rule` for that order type, with its customer-category override, decides whether and at which gate a hold arises, and these two customer fields only carry the order's default terms and the advance-demand prompt at the counter. Overrides follow WF-41 and M17-43 |
| Credit limit | Decimal (14,2) | No | No | Zero or more | Only meaningful with credit terms |
| Is blacklisted | Yes / No | Yes | Default applies (No) | Default No; only Unit Incharge may set Yes | Requires reason |
| Blacklist reason | Pick-list + note | Conditional | No | Required if blacklisted | |
| Extra confidentiality requested | Yes / No | Yes | Default applies (No) | Default No | Affects M9 public page |
| Privacy notice version shown | Text | Yes | Default applies (auto, current version) | Auto-filled with the current notice version | Cannot be blank on save |
| Consent — status messages by SMS or WhatsApp | Yes / No | Yes | Default applies (No) | Default No | Unticked by default; the default is recorded as No, never null |
| Consent — inclusion in published statistics | Yes / No | Yes | Default applies (No) | Default No | Unticked by default; the default is recorded as No, never null |
| Relationship with laboratory staff declared | Yes / No + note | Yes | Default applies (No) | Default No | Impartiality flag; if Yes, alerts on allocation |
| Is provisional (walk-in) | Yes / No | Auto | Auto (set Yes) | Set Yes when created with the short form | Clears when the full record is completed |
| Is active | Yes / No | Yes | Default applies (Yes) | Default Yes | |
| Linked external accounting system customer identifier | Text | No | No | Must be unique if present | Empty today, because this system masters the customer; filled only if the optional M22 interface is ever switched on |
| Remarks | Long text | No | No | — | Not printed |

### M1 rules and edge cases

1. **What must exist before go-live (hard prerequisites).** Unit and tax registration; Section master; Sample Type master; Unit of Measure master; the complete Test Catalogue for every test the unit actually performs, with prices; the Method master with at least one Active, verified revision per test; the Parameter master and Test-Parameter mapping for those methods; the Specification Sets and grade tables for raw silk BIS and ISA grading; one Rate Card with a valid effective date and its approval reference; the Tax master; the Numbering series for every document type; the Working-day calendar including the current year's holidays; all fifteen Reason Code groups; the Location master down to at least rack level; and the internal pseudo-customer for research and advisory samples. Without any one of these, a sample cannot be registered or a report cannot be printed.
2. **What may be filled progressively.** The customer master (walk-ins can be created at the counter as they arrive; only regular customers need pre-loading); customer contacts; test bundles and profiles; the consignment-value band table; customer-specific specification sets; the fallback rate card; storage bins below rack level; and non-test chargeable services other than those the unit actually sells today.
3. **The same test at two prices is two catalogue records.** This is the single most important modelling decision in this module. A test in the catalogue is the combination of *what is measured*, *under which standard*, *for which class of customer*. Collapsing them into one record makes correct pricing impossible.
4. **Concession category versus customer category.** These are deliberately separate. A firm may be a Trader by category but qualify for a scheme-linked concession on one particular test. Rate resolution reads the concession category on the *request line*, defaulted from the customer but overridable with a reason.
5. **Rate resolution order.** For each request line the system resolves the price in this order: (a) an active rate line matching test plus the request line's concession category plus the order date; (b) an active rate line matching test plus concession category "None"; (c) the fallback reference-laboratory rate, flagged for review; (d) if none, the line cannot be priced and the request cannot be confirmed. The resolution path taken must be stored on the line, so an auditor can see why a price was charged.
6. **Deactivating a test mid-year.** Deactivation stops new selection only. Open allocations continue. Any partially completed order keeps working. The catalogue record and all its method links stay retrievable forever.
7. **Method revision during an open job.** A job that has already started continues on the method revision it snapshotted. It is never silently migrated to the new revision. If the laboratory decides the job must be redone on the new revision, that is an explicit decision recorded as a repeat, not an edit.
8. **Parameter plausibility limits are warnings, not blocks.** A genuinely unusual sample exists. The system warns loudly, requires the tester to confirm, and records the confirmation. It does not refuse the reading.
9. **Deleting a reason code.** Never permitted. Deactivate only. Otherwise historic rejections lose their explanation.
10. **Duplicate customers already merged.** A merged-away customer identifier must continue to resolve (redirect) forever, because barcode labels, old acknowledgement slips and the unit's own paper registers may still carry it.
11. **Numbering across a financial year boundary.** A sample received on 31 March and reported on 2 April takes its sample number from the closing year's series and its report number from the opening year's series. Both are correct; the system must not attempt to make them match.
12. **Two masters to watch if an external accounting system ever arrives.** Customer and Consumable Item. There is no such system at this unit, so this system masters both outright: every field on the customer record above, and every field on the consumable item, is entered, edited and read here. If the parent body ever mandates an accounting system for the unit, the rule from that day is that for each field exactly one system is the source of truth and the other is read-only for that field, and the recommended split then is that the accounting system takes customer identity, tax identifiers and financial terms while this system keeps concession category, confidentiality flags, consents and laboratory-specific notes. The rule is recorded now, while it is dormant, because a split of this kind is far easier to agree before the data exists than after several years of it. See M22 and OPEN-Q-T8.

---

## M2. Enquiry and Quotation

**What this module is for, in plain words.** Before a customer commits, they usually ask a question: "what do you charge to test raw silk, and how long will it take?" This module records that question, checks whether the laboratory can actually do the work asked for, produces a priced offer with a validity date, and — if the customer accepts — turns that offer into a confirmed Test Request without anybody re-typing anything. The capability check is not a formality. The international laboratory standard requires the laboratory to record that it confirmed it has the method, the equipment, a competent person and the capacity **before** accepting the work. This module is where that record is made.

### M2 screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Enquiry capture | Front Desk | Record a walk-in, phone, e-mail, letter or portal enquiry |
| Enquiry list and follow-up | Front Desk / Unit Incharge | Open enquiries, ageing, next action |
| Capability check (Can we do this?) | Front Desk (runs), Unit Incharge (approves exceptions) | System-assisted check per requested test |
| Quotation build | Front Desk | Priced lines, taxes, turnaround, terms |
| Quotation approval | Unit Incharge | Approve before sending |
| Quotation send and print | Front Desk | PDF, e-mail, print, WhatsApp/SMS link |
| Quotation revision | Front Desk | New revision, old one retained |
| Convert to Test Request | Front Desk | One-click carry-forward into M3 |
| Lost enquiry / expired quotation | Front Desk | Close with a reason code |
| Enquiry and quotation reports | Unit Incharge | Conversion rate, lost reasons, ageing |

### M2 requirements

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M2-01 | An Enquiry can be created in under 30 seconds with only: source, contact name, mobile, and a free-text requirement. Customer master creation is not required at enquiry stage. | [MUST] | A clerk creates an enquiry from a phone call in four fields and saves. |
| M2-02 | Enquiry source is a pick-list: Walk-in at counter, Telephone, E-mail, Letter, WhatsApp, National CSB testing portal, Referral from another CSB unit, Government department, Other. | [MUST] | The source field offers exactly these values. |
| M2-03 | An enquiry may be linked to an existing customer or left unlinked. If unlinked, converting it to a Test Request forces customer creation (which may be a provisional walk-in record). | [MUST] | Convert an unlinked enquiry; the system prompts for the customer. |
| M2-04 | Enquiry lines record the intended sample type, the intended test or a free-text description of what the customer wants measured, and the expected number of samples. | [MUST] | Add three enquiry lines with different sample types. |
| M2-05 | Every enquiry has a state: Open, Under Capability Review, Quoted, Converted, Lost, Expired. Transitions are recorded with actor and timestamp. | [MUST] | Move an enquiry through all states; the history shows each hop. |
| M2-06 | **Capability check [the core requirement of this module].** For each requested test the system automatically evaluates and displays five checks: (a) is the test in the catalogue and active at this unit; (b) is there an Active, verified method revision; (c) is at least one required instrument present and with calibration valid today and expected to be valid on the likely test date; (d) is at least one person currently authorised for that method and activity; (e) is the requested sample type permitted for that test, and is the intended quantity at or above the **technical minimum sample quantity** on the test's Active method revision (M14-10) — not the minimum chargeable quantity of M1-29, which is commercial. Each check shows a clear green tick, amber warning or red cross with a one-line reason. | [MUST] | Run the check on a test whose only balance is out of calibration; check (c) shows red with the instrument name and expiry date. |
| M2-07 | The capability check result is **stored as a record**, not merely displayed: which checks passed, which failed, who ran it, when, and any narrative note. This record satisfies the standard's requirement for a documented contract review (which this document calls the Request Review) and must be printable. | [MUST] | Print the capability check record for a past enquiry. |
| M2-08 | A sixth capability check covers **capacity**: the system shows the current count of open allocations for each required section and the expected turnaround given the present queue, and flags amber if the promised date is already at risk. | [SHOULD] | With 40 pending allocations in Physical Testing, the check shows an amber capacity warning. |
| M2-26 | A seventh capability check covers **material sufficiency for the request as a whole**. The system resolves the sample-draw chains of all requested tests from their Active method revisions, deduplicates the chains that share a parent draw, sums only across independent chains, and compares the total with the intended or received quantity, flagging amber where the quantity is short. It never sums the per-test minima, because downstream grading tests share intermediate specimens and the minima sit at different specimen levels. This deduplicated figure is the single order-level sufficiency number used by M3 rules item 4 and by the Received-to-Accepted gate. | [MUST] | Quote a full raw-silk grading order whose size, evenness, tenacity and cohesion tests all draw from the winding test's ten bobbins; the check reports one deduplicated required quantity rather than the sum of every test's minimum, and flags amber only where the quantity is genuinely short. |
| M2-09 | Where a check fails, the system offers exactly three named routes forward, and the chosen route is recorded: (i) decline the enquiry; (ii) refer the test to another CSB unit (subcontracting), which requires the customer's approval to be recorded before any work starts; (iii) proceed with an explicit, reasoned override authorised by the Unit Incharge. | [MUST] | Fail a check and select "refer to another unit"; the quotation line is marked as referred and a customer-approval task is created. |
| M2-10 | A quotation may be raised only after the capability check has been run for every line. Lines that failed and were not resolved by one of the three routes cannot be quoted. | [MUST] | Try to quote an unresolved failed line; blocked with the failing check named. |
| M2-11 | The Quotation carries: quotation number, revision number, date, customer or prospect, valid-until date, rate card used, per-line price resolved from M1, discount with reason, tax, total, estimated turnaround in working days per line and overall, payment terms, sample submission instructions (minimum quantity per test, packaging advice, how to mark the sample), sample return and retention terms, subcontracting disclosure, and standard terms text pulled from a versioned Statements master. | [MUST] | Generate a quotation PDF; every listed element is present. |
| M2-12 | Prices on a quotation are resolved by the M1-05 rate resolution rule at the quotation date and are then **frozen on the quotation**. A later rate card revision does not silently change an outstanding quotation. | [MUST] | Revise the rate card; an outstanding quotation still shows its original prices. |
| M2-13 | The quotation must show the estimated turnaround computed from the standard turnaround per test plus any mandatory pre-conditioning time plus the working-day calendar — not a flat number typed by the clerk. | [MUST] | Quote a test requiring 24 hours of pre-conditioning; the estimate includes it. |
| M2-14 | A quotation requires approval by the Unit Incharge before it may be sent, unless its total value is below a configurable threshold in which case the Front Desk may send it directly. | [SHOULD] | Set the threshold to ₹2,000; a ₹150 quotation sends without approval, a ₹5,000 one does not. |
| M2-15 | Quotations are revised, never edited. A revision carries the same quotation number with the revision number increased by one, references the revision it supersedes, and states the reason for revision. | [MUST] | Revise a sent quotation; both revisions are retrievable and the later one is marked current. |
| M2-16 | A quotation has a valid-until date. On expiry it moves to state Expired automatically and cannot be converted without a fresh revision. | [MUST] | Let a quotation expire; conversion is blocked and the system offers to revise it. |
| M2-17 | **Convert to Test Request** carries forward: customer, contact, all quoted lines with their frozen prices, the capability check record, the estimated turnaround, the agreed payment terms, the decision rule agreed for any conformity statement, and any recorded deviations or subcontracting approvals. The clerk re-types nothing. | [MUST] | Convert a five-line quotation; the resulting Test Request has five lines with identical prices and a link back to the quotation. |
| M2-18 | Where a customer requests a **statement of conformity** (a pass or fail against a specification), the specification and the **decision rule** must be selected and recorded on the quotation and agreed with the customer, because they cannot be added later without re-reviewing the contract. | [MUST] | Quote a conformity statement without selecting a decision rule; blocked. |
| M2-19 | Lost enquiries and lost quotations are closed with a reason from a pick-list: price too high, turnaround too long, test not available here, customer went to another laboratory, customer's requirement changed, no response after follow-up, sample never sent, duplicate enquiry, other (note mandatory). | [MUST] | Close an enquiry as lost; a reason code is demanded. |
| M2-20 | Every conversation with the customer about the enquiry or quotation is logged with date, channel, participants, substance and outcome. This log carries into the Test Request. | [MUST] | Log a phone discussion; it appears on the resulting Test Request's communication log. |
| M2-21 | Where the customer has **not specified a method** and the laboratory selects one, the system records "method selected by laboratory" and creates a task to inform the customer of the choice, with a record of that intimation. | [MUST] | Leave the method blank; the system marks it laboratory-selected and creates the intimation task. |
| M2-22 | Where the customer **requests a method that is Superseded or Withdrawn** in the Method master, the system blocks quoting until an intimation record exists stating that the customer was told the method is out of date and confirmed the choice. | [MUST] | Request a withdrawn method; blocked until intimation is recorded. |
| M2-23 | Enquiry and quotation are optional in the workflow. A walk-in customer standing at the counter with silk in hand may go straight to M3 Test Request, and the capability check then runs inside M3 instead. The capability check is never skipped; only the quotation is. | [MUST] | Create a Test Request with no prior enquiry; the capability check runs at request stage. |
| M2-24 | A conversion report shows, per month: enquiries received by source, quotations raised, value quoted, converted count and value, lost count with reasons, and average days from enquiry to conversion. | [SHOULD] | Run the report for a month; all figures reconcile to the underlying records. |
| M2-25 | Express (Tatkal) service may be quoted only for tests flagged Tatkal-eligible, only if the request would be received before the configured cut-off time, and only within the configured daily sample cap. The doubled price is applied from the rate card, not typed. | [MUST] | Quote Tatkal at 11:30 with a 11:00 cut-off; the option is unavailable with the reason shown. |

### M2 field table — Enquiry capture screen (the main data-entry screen for this module)

| Field | Type | Mandatory? | Validation | Notes |
|---|---|---|---|---|
| Enquiry number | Text | Auto | From the Enquiry series | Allocated on save |
| Enquiry date and time | Date-time | Auto | Server clock; not editable | |
| Source | Pick-list | Yes | From M2-02 | |
| Existing customer | Lookup | No | Must be an active, non-blacklisted customer | Leave blank for a prospect |
| Prospect name | Text, up to 200 | Conditional | Required if no existing customer | |
| Contact person name | Text, up to 100 | Yes | Not blank | |
| Mobile | Text, 10–15 | Yes | Digits; ten-digit Indian mobile validated | Used for follow-up |
| E-mail | Text | No | Format check | |
| Village / town, District, State | Text / pick-list | No | State from the master list | Helps regional analysis |
| Preferred language | Pick-list | Yes | Default English | |
| Requirement description | Long text | Yes | Not blank | The customer's words |
| Intended sample type (per line) | Pick-list | Yes per line | From the Sample Type master | |
| Intended test (per line) | Lookup | No per line | From the active Test Catalogue | May be blank if the customer does not know |
| Free-text "what do you want measured" (per line) | Text | Conditional per line | Required if intended test is blank | |
| Expected number of samples (per line) | Integer | Yes per line | One or more | Drives the quotation quantity |
| Expected quantity and unit (per line) | Decimal + pick-list | No per line | Against the sample type's minimum | Warn if below minimum |
| Declared size / count / composition (per line) | Text | No per line | — | Often quoted as a range such as 20/22 denier |
| Specification to test against | Lookup | No | From the Specification Set master | Required if a conformity statement is wanted |
| Conformity statement wanted | Yes / No | Yes | Default No | If Yes, decision rule becomes mandatory at quotation |
| Decision rule | Lookup | Conditional | Required if conformity wanted | See M7 |
| Priority requested | Pick-list | Yes | Normal / Urgent / Express (Tatkal) | Express validated per M2-25 |
| Required-by date | Date | No | Not in the past | Used for the capacity warning |
| Sample return required | Yes / No | Yes | Default No | Carries to M3 and M4 |
| Report delivery mode | Pick-list (multi) | Yes | Counter collection / Post / Courier / E-mail / Portal download | At least one |
| Subcontracting permitted by customer | Yes / No / Not asked | Yes | Default "Not asked" | Must become Yes before any referral |
| Next follow-up date | Date | No | Not in the past | Drives the follow-up list |
| Assigned to | Lookup (staff) | Yes | Active staff member | Owner of the enquiry |
| Remarks | Long text | No | — | |

### M2 rules and edge cases

1. **The capability check is the compliance product of this module.** Everything else is convenience. Even where a customer walks in and the laboratory has done the same test for them a hundred times, the check must run and be recorded, because it is what proves the laboratory did not accept work it could not do.
2. **Amber versus red.** Red means the work cannot proceed on the requested basis. Amber means it can proceed but something needs watching — a calibration that expires next week, a queue that puts the promised date at risk, a quantity slightly below the comfortable minimum. Amber never blocks; it must be acknowledged.
3. **Calibration validity is checked against the likely test date, not today.** A balance whose calibration expires in three days will fail a test scheduled in five days. The check must look forward, otherwise it gives false comfort.
4. **The customer who does not know what test they need.** This is common. The enquiry line permits a free-text description with no test selected, and the capability check is run after a scientist has translated the requirement into catalogue tests. The translation itself is recorded, so the laboratory can show that it selected the method and informed the customer.
5. **Enquiries that arrive as samples.** Silk sometimes arrives by bus or courier with no prior contact. The correct handling is: register the sample in M3 in a "received, request not yet complete" state, run the capability check, and then contact the sender. The enquiry module is not the entry point for that path; M3 and M4 are.
6. **Quotation for a customer who will never pay a rupee.** In-house research and advisory samples still benefit from a quotation-shaped record because it captures the capability check and the turnaround promise. Price zero; the document is titled "Advisory Testing Confirmation", not "Quotation".
7. **Referral to another unit changes the money as well as the work.** The receiving unit may perform the test while the charge is collected here. The quotation must therefore be able to price a line the laboratory itself will not perform, and the resulting order must carry three separate unit references: receiving unit, testing unit, billing unit.
8. **A quotation is not a contract until converted.** Nothing in M2 creates a sample, a label, a test allocation or an invoice. Conversion is the only bridge.
9. **Revising a quotation after the customer has already sent the sample.** Permitted, but the system must warn that a sample already exists, must require a reason, and must re-run the capability check because the physical sample may differ from what was described.

---

## M3. Test Request and Sample Registration

**What this module is for, in plain words.** This is the front door of the laboratory. When a customer's silk arrives, this module records three separate things that people often confuse: the **request** (what the customer wants done, and on what terms), the **samples** (the physical items received, one record per item), and the **test allocations** (one unit of work for each sample-and-test pair, which is what a tester actually gets given). It then prints an acknowledgement slip the customer can carry away, prints a barcode label for each physical item, and computes the promised date from the turnaround and the working-day calendar. Getting the three-level structure right here is the single most important design decision in the whole system, because per-test assignment, per-test turnaround and per-test revenue all become impossible later if the grain is wrong.

### M3 screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Test Request (TRF) create / edit | Front Desk | The customer's request and its terms |
| Capability check (embedded) | Front Desk / Unit Incharge | Same check as M2-06, run here if no prior quotation |
| Request Review and accept | Unit Incharge / Section Head | The recorded decision to accept the work |
| Request Review — decline | Unit Incharge / Section Head | Recorded refusal of the work, with reason |
| Customer declaration capture | Front Desk | Declared size, marks, weight, composition, undertakings |
| Sample bulk registration | Front Desk / Sample Receipt Clerk | Fast entry of many items in one screen |
| Allocation preview | Front Desk | Shows the sample × test grid before confirming |
| Acknowledgement slip print | Front Desk | Serially numbered receipt for the customer |
| Label print / reprint | Sample Receipt Clerk | Barcode labels per physical item |
| Due-date recompute | System | On acceptance, hold, release, amendment |
| Advance-payment hold | Accounts | Hold and release with reason |
| Request amendment | Front Desk (raise), Unit Incharge (approve) | Add or remove tests after confirmation |
| Request cancellation / withdrawal | Unit Incharge | With reason and part-billing |
| Pending requests dashboard | Unit Incharge | Awaiting review, awaiting sample, awaiting payment |

### M3 requirements

**Structure — the three levels**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M3-01 | The system maintains three distinct record types with a strict parent-child relationship: one **Test Request** (the contract), many **Samples** (one per physical item or lot received), and many **Test Allocations** (one per sample-and-test pair). No screen names any of these three records a "job"; the word's only permitted appearance in the interface is the transitional `(Job No.)` subtitle on the Allocation number allowed by Part B §8.4 for one release. | [MUST] | Register five samples with three tests each; the system shows 1 request, 5 samples and 15 allocations; a full-text scan of screen labels and printed templates returns no occurrence of "job" other than the permitted `(Job No.)` subtitle. |
| M3-02 | A **Test Allocation** is the only assignable unit of work. It is what a section head allocates, what a tester opens, what carries its own state, its own due date, its own price and its own tester. | [MUST] | Allocate three of a sample's five allocations to different testers; each shows its own state and due date. |
| M3-03 | Where a sample type is flagged "has sub-samples", the sample record additionally records the count and identity of its sub-samples (bales, books, skeins, bobbins, cones, pieces) as rows in `txn_subsample` with the appropriate `prep_type`, numbered as the parent sample number plus the sub-sample suffix defined in Part B §10.1, so that a lot of many bales is one sample with many sub-samples, not many samples. The word "sub-unit" is never used for physical material anywhere in this system; it is reserved for its organisational meaning, a CSTRI branch establishment. | [MUST] | Register a lot of 20 bales as one sample with 20 sub-sample rows of prep_type bale. |
| M3-04 | Sample numbers, sub-sample numbers and allocation numbers are all allocated by the server from configured series and are never re-used. | [MUST] | Cancel a sample; its number is retired and the next sample takes the following number. |

**The Test Request Form content**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M3-05 | The Test Request records the **customer** (the party who owns the result and is billed) and, separately, the **sender** (the person, agent, broker or courier who physically delivered the sample). These are different fields and both are captured. | [MUST] | Register a sample brought by a broker for a mill; both parties are recorded and the report names the mill. |
| M3-06 | The Test Request records the customer's **declaration**, which the laboratory does not verify: declared size or count (as a free-text range such as "20/22" and also as numeric minimum and maximum), declared composition or variety, declared silk origin (Indigenous / Imported / Not stated), declared twist, declared colour, declared weight, declared quantity, the customer's own lot number, mark, chop, and the claimed grade if any. Every declared field is visibly labelled "declared by customer" on screen and on the report. | [MUST] | Enter a declared range "20/22"; the system stores the text and the numeric 20 and 22, and the report prints it as customer-declared. |
| M3-07 | The Test Request records the **reeling or production device** where relevant: Domestic Basin, Cottage Basin, Charkha, Multi-end Reeling Machine, Automatic Reeling Machine, Reeling-cum-Twisting Machine, Handloom, Powerloom, Not stated. This drives the effective test recipe. It is a technical attribute and never resolves a price by itself; price class is carried by the request-line concession category per M1 rules item 5. | [MUST] | Select Automatic Reeling Machine and leave the request-line concession category as None; the standard ISA grading rate resolves and the stored resolution path names the concession-category-None line. Then set the request-line concession category to Indigenous ARM Silk Unit with a reason; the concessional rate resolves and the resolution path is stored on the line. |
| M3-34 | Where the request-line concession category is **Indigenous ARM Silk Unit** and either the reeling or production device is not Automatic Reeling Machine or the declared silk origin is not Indigenous, the system warns and requires a reason code before the request can be confirmed. The warning does not block; the machine type alone never establishes indigenous production, and the declared origin is the customer's assertion, not a laboratory finding. | [MUST] | Set the concession category to Indigenous ARM Silk Unit with device Charkha; confirmation is refused until a reason is recorded, and the reason is stored on the request line. |
| M3-08 | The Test Request records the tests requested per sample type, the method choice per test (a specific method revision, or the explicit value "laboratory to decide"), the specification to test against, whether a conformity statement is wanted, the decision rule where applicable, and the priority. | [MUST] | Choose "laboratory to decide"; the system records that the laboratory selected the method and creates the customer intimation task. |
| M3-09 | The Test Request records the commercial and handling terms: sample return required (Yes / No / Return unused portion only), retention period if not returned, report delivery mode, number of hard copies required, agreed deviations from the method, subcontracting consent, whether the customer wants opinions and interpretations, and any special confidentiality request. | [MUST] | Tick "sample return required"; M4 creates a return task after reporting. |
| M3-10 | The customer's consent and acknowledgement is captured as one of: a physical signature on the printed acknowledgement slip which is then scanned and attached; an on-screen signature captured on a tablet; a one-time-password confirmation to the registered mobile; or an attached covering letter or e-mail from the customer. At least one must be present before the request can be confirmed. | [MUST] | Try to confirm a request with no consent evidence; blocked with the four options offered. |
| M3-11 | The customer's own covering letter, purchase order, e-mail or portal booking confirmation is attachable to the request as a file, with the file's checksum stored. | [MUST] | Attach a scanned letter; it is retrievable from the request and its checksum is recorded. |
| M3-12 | Where the request arrives from the national CSB testing portal or by another electronic channel, the system records the channel and the external booking reference, and marks the payment as already collected where the channel confirms it. | [SHOULD] | Import a portal booking; the external reference and the payment status carry across. |
| M3-13 | The Test Request cannot be confirmed until the **capability check** (identical logic to M2-06) has been run and every line resolved, and a **Request Review** record exists naming the reviewer, the review date, the capability-check outcome and the review outcome (Accept / Decline / Clarify). Confirming a Test Request is the transition **Pending review → Accepted**, that is, the Accept outcome of the Request Review. It is a different act from **sample acceptance** in M4, which is what starts the turnaround clock under M3-23, and the two must never be collapsed into one word. | [MUST] | Try to confirm without a review; blocked. |
| M3-14 | Confirmation of the request creates the Sample records in state **Expected**, or **Received** where the sample is already in hand (in which case the receipt fields required by WF-32 and the condition checklist of WF-33 are captured at confirmation). Confirmation does **not** create Test Allocations. Test Allocations are created by the system on the sample's entry to **Accepted** or **Accepted with Reservation**, one per requested test, together with the sub-samples each method version requires (WF-38). Until then the **Allocation preview** shows the sample x test grid that *will* be created, and the request's promised date and estimated charges are computed from that preview, without creating any allocation record. | [MUST] | Confirm a request for 5 samples x 3 tests: the 5 samples appear in Expected, the preview shows 15 rows, and a query for allocations against the request returns none. Accept one sample: exactly 3 allocations appear for that sample and none for the other four. Reject a second sample: still no allocations for it (M4-06). |
| M3-35 | A Request Review outcome of **Decline** sets the request to state **Declined**, requires a coded reason, creates no Samples and no Test Allocations, and fires the `REQ_DECLINED` customer notification. A declined request is never deleted; the customer may only submit a fresh request. | [MUST] | Decline a request; no samples and no allocations are created, the state reads Declined, and the customer notification is logged with the reason. |

**Sample registration**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M3-15 | A **bulk registration** screen allows many samples of the same type and test set to be created in one action, with a per-row grid for the differing fields (customer's mark, declared size, quantity, number of sub-samples). Registering 40 bales must take one screen and one save, not 40 forms. | [MUST] | Register 40 samples in one grid in under three minutes; all 40 appear with distinct numbers. |
| M3-16 | Registration records, per sample: date and time of receipt, mode of receipt (hand delivery, courier, post, inter-unit transfer, portal-linked despatch), courier docket number where applicable, who received it, quantity and unit, number of sub-samples, packing description, and the storage location assigned. Mode of receipt includes **"Drawn by the laboratory"**, for the case where laboratory staff draw the sample themselves rather than receiving it, which requires the Sampling Record of M4-35. | [MUST] | Register a courier sample; the docket number is mandatory and stored. Register a sample as drawn by the laboratory; the Sampling Record becomes mandatory before acceptance. |
| M3-17 | Where the number of samples actually received differs from the number requested, the system records the shortfall or excess, flags it, and creates a customer-intimation task. It does not silently create fewer or more allocations without a record. | [MUST] | Request five, receive four; the system creates four samples, flags a shortfall and creates the intimation task. |
| M3-18 | The **acknowledgement slip** is serially numbered from its own series and prints: unit name and address, slip number and date, customer name, sender name, list of samples with their numbers and descriptions, list of tests per sample, priority, estimated completion date, total charges with tax, payment status, sample return and retention terms, the laboratory's contact number, and a line stating that results relate only to the items submitted. | [MUST] | Print a slip; every listed element is present and the slip number is unique. |
| M3-19 | The acknowledgement slip is printable without the customer's identity being visible to a tester — that is, the slip is a counter document, not a bench document. | [MUST] | A tester role cannot open or reprint an acknowledgement slip. |
| M3-20 | A **barcode label** is printed for each physical item on entry to **Accepted** or **Accepted with Reservation**, as part of the acceptance action, and never while the sample is still Expected or Received (per WF-32 and §7.2 steps 7 and 8). Until acceptance the sample number travels on the acknowledgement slip of M3-18, which is what the clerk works from during the condition check. The label carries the laboratory's own sample number, sample type and unit count, received date, due date, test short codes, an opaque barcode payload and a two-dimensional code. The due date and the test short codes are printable at this trigger because acceptance has already started the turnaround clock (M3-23) and created the allocations that carry the due dates (WF-38, M3-24, M3-25). It must **not** carry the customer's name. | [MUST] | Confirm that no label prints for a sample in Expected or in Received. Accept the sample; the label prints carrying the due date and the test short codes, the customer name is absent, and the sample number is scannable. |
| M3-21 | Labels can be reprinted. A reprint keeps the same payload, increments a reprint counter on the sample, and is logged with the reason. A high reprint count is visible on a report as a physical-handling signal. | [MUST] | Reprint a label twice; the counter reads two and both reprints are logged with reasons. |
| M3-22 | Sub-sample labels are supported, numbered as the parent sample number plus a suffix, in a smaller label size. The normative statement of this requirement is **M4-14**; this row exists for locality in M3 and adds nothing to it. | [MUST] | See M4-14. Print 20 bale labels for a lot of 20 bales; each carries the parent sample number and a distinct suffix, and none names the customer. |

**Due dates, priority and holds**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M3-23 | The turnaround clock starts at the moment of **sample acceptance** (not request date, not receipt), adjusted by the cut-off time so a late-evening acceptance starts next working morning. | [MUST] | Accept at 18:10 with a 17:00 cut-off; the clock starts the next working day. |
| M3-24 | The due date per allocation is computed as: acceptance clock start, plus any mandatory pre-conditioning hours from the method, plus the test's standard turnaround, all counted in working time from the calendar, adjusted by the priority factor. The computation is performed by one shared server function used everywhere. | [MUST] | A three-working-day test accepted on a Friday afternoon before a Monday holiday shows the correct Thursday due date. |
| M3-25 | The sample's due date is the latest due date among its allocations. The request's promised date is the latest due date among its samples. | [MUST] | Change one allocation's turnaround; the sample and request dates update. |
| M3-26 | Where WF-5's `payment_release_rule` for this order type and customer category evaluates to *Required before testing begins* — the customer's `advance_required` flag and credit terms supplying only the order's default Payment terms — confirming the request places the samples in a Hold-for-Payment state. Testing cannot start. The turnaround clock **pauses** for the whole hold duration and the due date shifts forward by the hold length. | [MUST] | Hold for two working days; the due date moves two working days later and the net laboratory turnaround excludes the hold. |
| M3-27 | The Unit Incharge may release a sample for testing against a **provisional payment record** (a demand draft in hand, a quoted bank transaction reference, a portal callback not yet reconciled), with a mandatory reason. The release is logged with the authoriser's name. | [MUST] | Release against a provisional receipt; the log names the authoriser and reason. |
| M3-28 | Express (Tatkal) requests are validated against the four configured rules at confirmation time: test eligibility, booking before the cut-off time, the daily sample cap, and the price multiplier. Failure blocks with the specific rule named. | [MUST] | Confirm a sixth Tatkal sample on a five-sample cap; blocked naming the cap. |
| M3-29 | A **holds** mechanism exists at request, sample and allocation level, with reason codes: awaiting payment, awaiting additional sample quantity, awaiting customer clarification, equipment out of service, awaiting pre-conditioning, awaiting subcontractor, awaiting reference material, other. Every hold records who applied it, when, the reason and when it was released. | [MUST] | Apply and release a hold; the durations are recorded and the due dates shift. |

**Amendment, cancellation and withdrawal**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M3-30 | A confirmed request may be **amended** to add or remove tests, change priority, change the specification or change delivery terms. An amendment creates a new revision of the request, re-runs the capability check for any new test, re-prices, re-computes due dates, records the reason, and notifies every affected tester in the application. | [MUST] | Add a test to a request already in testing; the new allocation appears, prices update, and the assigned testers see a notification. |
| M3-31 | A test may be removed by amendment only if no result has yet been submitted for it. Where a result has been submitted, the test may be cancelled but remains billable, and the removal reason is recorded. | [MUST] | Try to remove a test whose result is entered; the system offers cancellation-with-billing instead of silent removal. |
| M3-32 | A request may be cancelled, and a sample may be withdrawn at the customer's written request, each with a reason code. Cancellation cancels open allocations and part-bills completed ones. Nothing is deleted. | [MUST] | Cancel a request with two completed and three open tests; the invoice covers two and the three show Cancelled. |
| M3-33 | Refund eligibility follows the published policy: cancellation is only accepted before testing begins, a full refund only before the sample is processed, and no refund once processing or testing has started. The system evaluates and displays the eligibility, and any departure from it needs the Unit Incharge and a reason. | [MUST] | Request cancellation after a test has started; the system shows "no refund due" with the policy reason. |

### M3 field table — Test Request and Sample Registration screen

*Request header*

| Field | Type | Mandatory? | Validation | Notes |
|---|---|---|---|---|
| Test Request number | Text | Auto | From the Test Request series | Allocated on save |
| Revision number | Integer | Auto | Starts at 0 | Increases on amendment |
| Request date | Date | Auto | Server date | |
| Source quotation | Lookup | No | Must be an approved, unexpired quotation | Carries all lines forward |
| Order source | Pick-list | Yes | Walk-in / Post / Courier / E-mail / National CSB portal / Inter-unit referral / Government scheme / Other | Enables later portal integration |
| External booking reference | Text | Conditional | Required if source is a portal | |
| Customer | Lookup | Yes | Active, not blacklisted (or overridden) | The party billed and named on the report |
| Customer contact | Lookup | Yes | Belongs to the selected customer | |
| Bill-to party | Lookup | Yes | Defaults to customer | |
| Report-to party | Lookup | Yes | Defaults to customer contact | |
| Sender name | Text, up to 200 | Yes | Not blank; may equal the customer | The person who handed it over |
| Sender mobile | Text | Yes | Digits | For collection contact |
| Sender relationship | Pick-list | Yes | Self / Employee / Agent or Broker / Courier / Society / Another CSB unit / Other | |
| Request type | Pick-list | Yes | Commercial / Internal research (advisory) / Inter-unit referral / Government scheme / Statutory or Customs / Training | Drives billing and priority |
| Concession category (order level) | Pick-list | Yes | Defaults from the customer; override needs a reason | Drives price resolution |
| Priority | Pick-list | Yes | Normal / Urgent / Express (Tatkal) | Express validated per M3-28 |
| Required-by date | Date | No | Not in the past | Informational |
| Specification set | Lookup | Conditional | Required if conformity statement wanted | |
| Conformity statement wanted | Yes / No | Yes | Default No | |
| Decision rule | Lookup | Conditional | Required if conformity wanted | Locked after confirmation |
| Opinions and interpretations wanted | Yes / No | Yes | Default No | Gates M8 printing |
| Sample return required | Pick-list | Yes | No, dispose after retention / Yes, return all / Yes, return unused portion | Drives M4 |
| Retention period override | Integer days | No | Zero or more | Defaults from the sample type |
| Report delivery mode | Pick-list (multi) | Yes | Counter / Post / Courier / E-mail / Portal download | At least one |
| Number of hard copies | Integer | Yes | One or more | Default 1 |
| Subcontracting consent | Pick-list | Yes | Granted / Refused / Not required | Must be Granted before any referral |
| Agreed deviation from method | Long text + attachment | No | If present, a report disclaimer is auto-added | |
| Payment terms | Pick-list | Yes | Defaults from the customer's credit terms | The terms only; whether the order is held is decided by WF-5's `payment_release_rule` per M3-26 |
| Advance amount received | Decimal (14,2) | No | Zero or more | Links to a receipt record |
| Customer consent evidence | Pick-list + attachment / signature | Yes | One of the four routes in M3-10 | Blocks confirmation if absent |
| Privacy notice acknowledged | Yes / No | Yes | Must be Yes | Records the notice version shown |
| Capability check status | Derived | Auto | All lines resolved before confirmation | Read-only |
| Reviewed by | Lookup | Yes | Unit Incharge or Section Head | Recorded on confirmation |
| Review remarks | Long text | No | — | |
| Request state | Derived | Auto | Draft / Pending review / Pending customer (clarification requested) / Accepted / Declined / On hold for payment / Cancelled / Closed | |
| Total value | Derived | Auto | Sum of lines plus tax | Read-only |

*Sample registration grid (one row per physical sample)*

| Field | Type | Mandatory? | Validation | Notes |
|---|---|---|---|---|
| Sample number | Text | Auto | From the Sample series | Never re-used |
| Sample type | Pick-list | Yes | From the Sample Type master; must be permitted for the requested tests | |
| Customer's own reference / lot number | Text, up to 100 | No | — | Confidential to the tester (see M5) |
| Mark | Text, up to 100 | No | — | The lot's identifying mark |
| Chop | Text, up to 100 | No | — | The producer's or filature's trade mark |
| Declared size / count (text) | Text, up to 30 | No | — | Trade range such as "20/22" |
| Declared size minimum | Decimal (18,6) | No | Zero or more | Derived from the text where parseable |
| Declared size maximum | Decimal (18,6) | No | At least the minimum | |
| Declared size unit | Pick-list | Conditional | Required if a size is declared | denier or tex |
| Declared variety | Pick-list | No | Mulberry / Bivoltine / Cross-breed / Tasar / Muga / Eri / Dupion / Blend / Not stated | Affects price |
| Declared silk origin | Pick-list | Conditional | Indigenous / Imported / Not stated; required where the request-line concession category is Indigenous ARM Silk Unit | Customer-declared, not verified by the laboratory; printed as customer-declared |
| Declared composition | Text | No | — | For example "100% mulberry silk" |
| Declared twist | Text | No | — | Turns per metre and direction |
| Declared colour | Text | No | — | |
| Declared weight | Decimal (18,6) + unit | No | Zero or more | The customer's stated weight |
| Reeling / production device | Pick-list | Yes | From M3-07 | Affects the test recipe; not a pricing input |
| Quantity received | Decimal (18,6) | Yes | Greater than zero; warn if below the sample type minimum | |
| Quantity unit | Pick-list | Yes | From the Unit of Measure master | |
| Number of sub-samples | Integer | Conditional | Required if the sample type has sub-samples; one or more | Bales, books, skeins, cones, pieces |
| Sub-sample type | Pick-list | Conditional | Required if sub-samples are counted | |
| Sub-sample serial numbers | Text or grid | Conditional | Mandatory where the sample type is a raw-silk lot or bale type; one row per sub-sample, each distinct | The customer's bale serial numbers; M10 defaults the lot's bale rows from them |
| Books or bundles per sub-sample | Integer | Conditional | Required where the sub-sample type is Bale or Carton; one or more | The standard's "No. of books or bundles in a bale"; may differ from bale to bale, and is the multiplier for M10's tare line 6 |
| Mode of receipt | Pick-list | Yes | Hand / Courier / Post / Inter-unit / Portal despatch / Drawn by the laboratory | "Drawn by the laboratory" requires the Sampling Record of M4-35 |
| Courier or postal docket number | Text | Conditional | Required if courier or post | |
| Date and time received | Date-time | Yes | Not in the future; not before the request date | Starts the clock at acceptance, not here |
| Received by | Lookup (staff) | Yes | Active staff member | |
| Packing description | Text | Yes | Not blank | Free text, for example "gunny bag, stitched, one seal" |
| Seal number | Text | No | — | |
| Storage location | Lookup | Yes | An active bin from the Location master | |
| Tests requested (multi-select) | Lookup (multi) | Yes | At least one; each must be permitted for the sample type | Determines the allocations that will be created on acceptance |
| Method per test | Lookup or "laboratory to decide" | Yes per test | Active revision, or the explicit laboratory-decides value | |
| Photograph on receipt | File (multi) | Yes | At least one image | See M4 |
| Sample state | Derived | Auto | Expected / Received / Accepted / Rejected / In testing / … | Set by M4 |
| Remarks | Long text | No | — | |

### M3 worked example — the case the specification must settle

**Scenario.** A twisting unit sends **five hanks of raw silk**. Each hank is to be tested for **denier (size)**, **evenness** and **tenacity**.

**What the system creates:**

| Level | Count | Detail |
|---|---|---|
| Test Request | **1** | One contract, one acknowledgement slip, one set of terms, one promised date, one capability check record |
| Sample | **5** | `DVM/2026-27/RS/00411` … `DVM/2026-27/RS/00415`, one label printed per hank on acceptance |
| Test Allocation | **15** | 5 samples × 3 tests. Each has its own state, its own tester, its own due date, its own price. Created in M4 on acceptance, like the sub-samples |
| Sub-sample / specimen | many | Created in M4 — the winding test converts each hank into bobbins, and the bobbins feed size, evenness and tenacity |
| Invoice line | **15** or **3** | 15 lines (one per allocation) if per-sample pricing; 3 lines (one per test, quantity 5) if the customer prefers a summarised bill. Both must be supported; the underlying link to the 15 allocations is retained either way |
| Report | **1** or **5** | **This is the configurable choice below** |

**The report choice, stated explicitly.** The system must support three report groupings, selected on the Test Request and defaulted from a configuration setting:

| Option | Produces | When to use it |
|---|---|---|
| **A. One consolidated report per Test Request** | 1 report, 5 sample blocks, 15 result rows | The customer treats the five hanks as one consignment. Fewer documents, fewer numbers, faster despatch. |
| **B. One report per sample** | 5 reports, 3 result rows each | The customer will resell or forward the hanks separately and needs a certificate per hank. |
| **C. One report per sample per test family** | Up to 15 reports | Rare. Needed only where different tests are signed by different authorised signatories, or where accredited and non-accredited parameters must be split (see M8). |

> **Recommendation.** Default to **Option A, one consolidated report per Test Request**, with Option B selectable per request on a single tick-box labelled "separate report for each sample". Reason: the research shows Dharmavaram's dominant work is a high-volume, low-value test done in daily batches of ten to thirty lots. Producing one report per lot would triple the number of documents to number, sign, verify and despatch, for no customer benefit in most cases. Option C must exist in the software but is driven by rules in M8 (the accredited/non-accredited split), not by a clerk's choice.

> **OPEN-Q5:** Which grouping does Dharmavaram use today — one certificate per lot, or one covering many lots? Obtain scans of three real issued reports before freezing the default. — *Recommended default:* build all three options, default to Option A, and set the actual default from the scanned examples.

### M3 rules and edge cases

1. **Sample arrives before the request is complete.** Register the sample immediately in state Received with the minimum fields (type, quantity, sender, receipt time, photograph, storage bin). The request is completed afterwards. Testing cannot start until the request is confirmed and the capability check is recorded. This path must exist because silk arrives unannounced.
2. **A request with no sample yet.** Permitted. Samples sit in state Expected. The turnaround clock has not started. A daily "expected but not received" list drives follow-up.
3. **The customer adds a test while the sample is on the bench.** Handled as an amendment (M3-30). The existing allocations are untouched; a new allocation is created and the due dates recomputed. This is the reason the three-level structure matters.
4. **Insufficient sample for all requested tests.** The registration screen does **not** sum the minimum quantities of the requested tests. Downstream grading tests share intermediate specimens — the ten bobbins the winding test produces feed size, evenness, tenacity and cohesion, and the same twenty seriplane panels serve evenness, cleanness and neatness — so a sum of per-test minima demands several times the material the work actually consumes, and it compares quantities at different specimen levels (skeins plus bobbins plus panels) against a received quantity in skeins. It would therefore raise a false shortfall on every grading order. Instead the screen resolves the sample-draw chain of each requested test from that test's Active method revision (M14-10), deduplicates the chains that share a parent draw, sums only across independent chains, and compares that deduplicated figure with the quantity received. This is the same figure the order-level capability check of M2-26 computes, and the only figure the Received-to-Accepted gate may use. Proceeding below it requires either a reduced test list (an amendment) or a recorded customer consultation accepting the risk, which auto-adds a disclaimer to the report.
5. **The same physical item registered twice.** The duplicate warning compares customer, sample type, customer's own reference and receipt date. It warns; it does not block, because two genuinely separate lots may share a mark.
6. **Sub-samples are not samples.** A lot of 20 bales is one sample with 20 sub-samples of type bale. Each bale gets a label, each bale may carry its own weight readings, but there is one sample number, one set of allocations and one result per lot for grading purposes. Treating bales as samples would produce 20 grading certificates where the trade expects one.
7. **Prerequisite tests are added silently but visibly.** Where a customer orders only cleanness, the system adds winding and seriplane winding as prerequisites, shows them on screen with the note "added automatically — physically required before the test you ordered", and prices them per the rate card unless the catalogue marks them as included in the parent test's price.
8. **The declared value that the test contradicts.** The declared size is an input, and a large discrepancy between declared and measured size has commercial consequences and, under the grading standard, can force a full repeat of every test. The declared value must therefore be captured at registration, before any measurement, and must be immutable thereafter except by amendment with a reason.
9. **Requests that will never be invoiced.** In-house research, advisory and inter-unit referral requests follow the identical path, produce identical traceability and reports, and simply do not generate an invoice. They still consume capacity and still appear in workload and turnaround reporting.
10. **Three different units on one request.** Receiving unit, testing unit and billing unit may all differ. All three are stored on the allocation, and the report must state where the testing was performed.
11. **Numbering across the year end.** As in M1, a sample received on 31 March keeps the old year's sample number even if reported in April. Do not attempt to align the two series.
12. **Nothing is deleted.** A mis-registered sample is cancelled with a reason, and its number is retired. A mis-typed declared value is corrected by amendment with the old value retained in the change log.

---

## M4. Sample Handling and Chain of Custody

**What this module is for, in plain words.** From the moment silk is handed over the counter until it is returned, consumed or destroyed, the laboratory is responsible for it. This module records the physical life of the sample: what condition it was in when it arrived, whether the laboratory accepted it, how it was weighed and on which balance, how it was cut or reeled into the specimens that tests actually consume, how long it sat in the conditioning room and at what temperature and humidity, where it was stored, every hand it passed through, and finally whether it went back to the customer or was disposed of and on whose authority. Sample mix-up is the most serious error a testing laboratory can make, and every event in this module is written to a log that can never be edited.

### M4 screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Receipt condition recording | Sample Receipt Clerk | Structured condition checklist plus photographs |
| Weighing on receipt | Sample Receipt Clerk | Weight captured with the balance's equipment identifier |
| Sample acceptance | Sample Receipt Clerk | Accept, accept with reservation, or refer for rejection |
| Sample rejection | Unit Incharge | Reject with reason, notify customer, record the outcome |
| Doubt / suitability hold | Sample Receipt Clerk | Block testing pending customer consultation |
| Customer consultation record | Front Desk | The consultation and the customer's instruction |
| Sub-sample / specimen preparation | Tester / Section staff | Create specimens with traceability to the parent |
| Conditioning register | Tester | Start and end of pre-conditioning with atmosphere readings |
| Storage assignment and move | Store Keeper | Assign, move, find |
| Custody log viewer | Any authorised role | The full movement history of one sample |
| Scan station (in / out) | All bench staff | Barcode scan at each hop |
| Retention due list | Store Keeper | Samples past their retention date |
| Return to customer | Store Keeper | Handover with acknowledgement |
| Disposal | Store Keeper (raise), Unit Incharge (authorise) | Authorised disposal with witness |
| Sample search / locate | Any authorised role | Where is sample X right now |

### M4 requirements

**Receipt condition and acceptance**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M4-01 | Receipt condition is recorded as a **structured checklist** with coded answers, not free text. Minimum checklist items: outer packaging intact; seal present and intact; seal number matches the declaration; sample dry; sample free of stains and contamination; identification marks present and legible; marks match the customer's declaration; quantity matches the declaration; sample type matches the declaration; sample free of visible mildew or insect damage; sample free of foreign matter or suspected admixture. Each item answers Yes / No / Not applicable, and any No requires a note. | [MUST] | Answer "sample dry = No"; the system demands a note and flags a deviation. |
| M4-02 | At least one **photograph on receipt** is mandatory before acceptance. The photograph must be taken with the sample number label or a written slip bearing the sample number visible in the frame. Multiple photographs are supported: as-received packaging, the sample itself, the customer's marks, and any damage. | [MUST] | Try to accept without a photograph; blocked. |
| M4-03 | Photographs are stored with their checksum, are treated as technical records, inherit the audit and retention rules, and can never be replaced — a corrected photograph is an additional photograph. | [MUST] | Attempt to overwrite a receipt photograph; the system adds a new one and keeps the original. |
| M4-04 | The **quantity or weight on receipt** must be recorded with the identifier of the balance used, and the system must record whether that balance's calibration was valid at that moment. Weighing on an out-of-calibration balance is blocked, with a role-restricted, reason-mandatory override that raises a nonconformity. | [MUST] | Weigh on a balance whose calibration expired yesterday; blocked with the expiry date shown. |
| M4-05 | Sample acceptance has exactly three outcomes, each a distinct recorded state: **Accepted**; **Accepted with reservation** (a deviation exists, the customer has been consulted, and a disclaimer will print on the report naming the results that may be affected); **Rejected**. | [MUST] | Accept with reservation; the report later carries the auto-generated disclaimer naming the affected results. |
| M4-06 | Rejection requires a reason code from the seeded list (M1-76), a note, a photograph, authorisation by the Unit Incharge, and a customer intimation record with date, channel and content. No test allocations are created for a rejected sample. | [MUST] | Reject a sample; no allocations exist and the intimation record is present. |
| M4-07 | A rejected sample remains a full record with a number, a storage location and a custody trail, because it must still be returned or disposed of, and it may still be partly billable as a handling charge. | [MUST] | Reject a sample and then return it to the customer with an acknowledgement. |
| M4-08 | A **Doubt Raised** state exists which blocks all testing until a customer consultation record exists carrying the customer's instruction. This covers the case where the laboratory is unsure whether the item is suitable, or where the item does not match the description supplied. | [MUST] | Raise a doubt; allocations cannot be started until the consultation is recorded. |
| M4-09 | The customer consultation record holds: date and time, channel, who at the laboratory spoke, who at the customer spoke, the question put, the customer's instruction, and the outcome (proceed / proceed with disclaimer / send replacement sample / withdraw / reject). Where the outcome is "proceed with disclaimer", the report disclaimer is generated automatically and names the affected results. | [MUST] | Record a consultation with outcome "proceed with disclaimer"; the disclaimer appears on the report. |

**Sub-sampling and specimen preparation**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M4-10 | The system supports an arbitrary-depth **sub-sample tree**: parent sample → as-received package (bale, book) → drawn sample (skein) → prepared specimen (bobbin, sizing skein, seriplane panel, test piece, strip, swatch, aliquot). Every node has its own identifier formed from the parent's number plus a suffix, its own quantity, and a permanent link to its parent. | [MUST] | Build a five-level tree from a lot down to a sizing skein; every node traces back to the lot. |
| M4-11 | Sub-sample creation records: the preparation type, the quantity taken, the quantity remaining in the parent, who prepared it, when, on what equipment where relevant, and the method's sample-draw rule that governed the draw. | [MUST] | Draw six skeins from six different books; the parent's remaining quantity reduces and the draw rule is recorded. |
| M4-12 | The system must support **shared intermediate specimens**. Ten bobbins produced by the winding test feed the size, evenness, tenacity and cohesion tests; twenty seriplane panels serve evenness, cleanness and neatness. One specimen may therefore be linked to several test allocations, and the system must show which allocations consumed which specimen. | [MUST] | Link ten bobbins to four allocations; each allocation shows the same ten bobbin identifiers. |
| M4-13 | Quantity accounting must be honest. Where a specimen is destroyed in testing, the system records the quantity consumed and marks it destroyed. A retest request against an exhausted sample must return "insufficient sample remaining", not a promise. | [MUST] | Consume the whole sample in testing, then request a retest; the system reports insufficient material. |
| M4-14 | Sub-sample labels are printable in a smaller format, carrying the parent number, the suffix, the specimen type and a scannable code — and never the customer's name. | [MUST] | Print forty sizing-skein labels; each is distinct and none names the customer. |

**Conditioning in the standard atmosphere**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M4-15 | The system maintains a **conditioning register**. For every specimen that a method requires to be pre-conditioned, the register records: conditioning start date and time, conditioning end date and time, the location (which chamber or room), and the temperature and relative humidity of that location during the period, with the source of the reading (which sensor or which manual log entry). | [MUST] | Condition a specimen for 24 hours; the register shows start, end, location and the atmosphere readings. |
| M4-16 | The standard atmosphere for textile testing used in Indian practice — and therefore the configured default — is **27 ± 2 degrees Celsius and 65 ± 2 percent relative humidity**, with specimens conditioned to moisture equilibrium for the period the method specifies (commonly 24 hours for raw silk physical tests). These values are held in the Method master as configuration, not in program code, with an effective date. | [MUST] | Change the tolerance in the master; the out-of-band warning threshold changes with no software change. |
| M4-17 | Conditioning is an explicit **wait state** in the workflow, not a hidden delay. An allocation whose method requires pre-conditioning cannot move to In Test until the conditioning end time has passed, and the wait period is included in the due-date computation. | [MUST] | Try to start a test before conditioning completes; blocked with the remaining time shown. |
| M4-18 | Where the recorded atmosphere was outside the configured band during the conditioning period or at the time of test, the system warns at result submission, records the excursion, and requires either a decision that the result is unaffected (with technical justification) or a repeat. An excursion automatically opens a nonconformity record. | [MUST] | Record 72 percent humidity during conditioning; submission warns, the excursion is recorded and a nonconformity opens. |
| M4-19 | The word "conditioning" must be used for exactly one meaning in each context, and the two meanings must never share a field name. **Pre-conditioning** means bringing a specimen to moisture equilibrium in the standard atmosphere before a physical test. **Conditioned mass** means the commercial trade weight computed from oven-dry mass plus the official regain, and is handled entirely in M10. The interface must label each explicitly. | [MUST] | Search the interface for "conditioning"; every occurrence is qualified as either "pre-conditioning" or "conditioned mass". |

**Storage, custody and movement**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M4-20 | Every sample and sub-sample has a current storage location at all times, chosen from the Location master, and a full history of every location it has occupied. | [MUST] | Move a sample three times; the history shows four locations with timestamps. |
| M4-21 | The **custody log** is an append-only event stream. Rows can be inserted and read; they can never be updated or deleted, and the application's database account has no permission to do so. | [MUST] | Attempt a direct database update on a custody row; the database refuses. |
| M4-22 | Custody event types, at minimum: Sampled by the laboratory; Received; Condition recorded; Accepted; Rejected; Weighed; Moved to location; Issued to tester; Returned to store; Sub-divided; Loaded to conditioning; Removed from conditioning; Consumed in testing; Placed in retention; Handed to customer; Despatched by courier; Transferred to another unit; Transferred to subcontractor; Disposed. | [MUST] | Perform each event type once; all appear in the log with the correct type. |
| M4-23 | Every custody event records: event type, date and time from the server clock, the sample or sub-sample, the acting staff member, the from-party and to-party where a handover occurred, the from-location and to-location, the quantity involved, a remark, and where a physical handover occurred, the receiver's acknowledgement (a signature capture, a scanned slip, or a system confirmation by the receiving user). | [MUST] | Issue a sample to a tester; the tester's own confirmation is recorded, not merely the issuer's claim. |
| M4-24 | **Scan stations** exist at, at minimum: receipt counter, store-in, issue to tester, bench / result entry, verification desk, report desk, retention store, and disposal or return. Each scan writes a custody event and a scan-event row, and opens the correct screen for that station. | [MUST] | Scan a label at the bench station; the result-entry screen for that sample opens directly. |
| M4-25 | The issue-to-tester scan **blocks** if the scanning user is not the tester allocated to any open allocation for that sample, or is not authorised for the relevant method. The block is overridable only by a section head with a reason. | [MUST] | Scan as an unauthorised tester; blocked with the reason shown. |
| M4-26 | An unresolved scan (a barcode the system does not recognise) is recorded as a scan event with "not resolved", and a daily count of unresolved scans is reported as a data-quality signal. | [SHOULD] | Scan an unknown code; the event is logged and appears on the daily count. |
| M4-27 | A one-click **custody trail report** for any single sample prints the whole chain from receipt to final disposition, including every specimen derived from it, in one document suitable for handing to an auditor. | [MUST] | Print the trail for a completed sample; it shows every event and every specimen. |

**Retention, return and disposal**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M4-28 | Each sample carries a **retain-until date** computed from the retention days on its sample type, with a per-request override, counted from the report issue date. | [MUST] | Report a sample with 90-day retention; the retain-until date is 90 days after issue. |
| M4-29 | A retention due list shows every sample past its retain-until date, grouped by storage location, with its age and the customer's return preference. | [MUST] | Run the list; overdue samples appear with their locations. |
| M4-30 | **Return to customer** records: date, mode (counter handover, post, courier), courier docket where applicable, quantity returned, the receiver's name and identification, and the receiver's acknowledgement (signature, scanned slip, or one-time-password confirmation). | [MUST] | Return a sample at the counter; the acknowledgement is captured and the state becomes Returned. |
| M4-31 | **Disposal** requires: authorisation by the Unit Incharge; a disposal reason code; a disposal method (returned to trade stock, incinerated, handed to scrap, retained as a laboratory reference specimen, other); the date; the disposing staff member; and, where the sample has material value, a witness. The disposal record is permanent and the sample state becomes Disposed, which is terminal. | [MUST] | Dispose a sample without authorisation; blocked. With authorisation and a witness; the record is permanent. |
| M4-32 | The system must never delete a sample record on disposal. The record, its photographs, its custody trail and its results all survive under the retention policy for records, which is separate from the retention policy for the physical material. | [MUST] | Dispose a sample, then retrieve its full record and results a year later. |
| M4-33 | Where the customer cancels after the sample has arrived, the published policy applies: the customer bears the cost of collecting or returning the sample. The system records the arrangement and the outcome. | [MUST] | Cancel with a sample in hand; the system creates a collection task and records the cost arrangement. |
| M4-34 | Unclaimed samples past their retention period are disposed of under laboratory protocol, but only after a recorded intimation to the customer and a configurable grace period. Automatic disposal without an authorising human action is never permitted. | [MUST] | Let a retention period lapse; the system flags the sample and creates an intimation task, but does not dispose of anything by itself. |

**Laboratory sampling, batch custody and role overlap**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M4-35 | Where laboratory staff draw the sample themselves rather than receiving it, the system shall hold a **Sampling Record** against the sample: the sampling plan reference, the date and time of sampling, the place of sampling (customer premises, godown, market yard, another CSB unit), the person who sampled and the M13 authorisation relied on, the population sampled and its identification (bale or lot marks, lot size, number of packages presented), the sampling method and its version from M14, the number and size of increments taken, the equipment used where relevant, the temperature and humidity at sampling where the method requires them, and any departure from the plan with the authorisation for it. A sample whose mode of receipt is "Drawn by the laboratory" cannot reach Accepted until its Sampling Record is complete. The record is a technical record: append-only, audited and retained under M21. Until document control exists, the sampling plan reference is held as a text reference and becomes a controlled-document link when M14 is delivered; the M13 authorisation check on the sampling activity binds from the phase in which the authorisation matrix is enforced. | [MUST] | Register a sample with mode of receipt "Drawn by the laboratory"; acceptance is refused while the Sampling Record is incomplete. Once complete, M8-08 prints its date of sampling and M8-11 prints its plan and method reference. |
| M4-36 | For tests flagged **batch-custody** in the test catalogue, one confirmation action by the receiving tester writes the issue-to-tester custody event for every sample on a worksheet, and one action by the returning tester writes the return-to-store event for every sample on it. One custody row is still written per sample, preserving the per-sample trail required by M4-27, M20-11 and NFR-106; each row carries the worksheet number as the authorising batch reference and the same receiver confirmation identifier. The batch action runs the M4-25 allocation and competency check against every allocation on the worksheet and is refused in full, naming the offending sample, if any one fails. Per-sample custody events with individual receiver acknowledgement remain mandatory for grading lots, conditioned-mass lots (M10), rejected samples, samples under complaint or dispute, and samples transferred to another unit or to a subcontractor; any such sample is excluded from the batch action and listed for individual handling, as in M7-36(c). | [MUST] | Issue a 30-lot Limited-test worksheet containing one grading lot; one tester confirmation covers the 29 Limited-test lots, each of which has its own custody row bearing the worksheet number, and the grading lot is held for an individual per-sample confirmation. |
| M4-37 | Where the from-party and the to-party of a handover resolve to the same staff member — routine in a three-person unit where the receipt clerk also tests — the event is recorded once with both parties named and no second confirmation is demanded, since a person cannot acknowledge receipt from themselves. The record states that the parties coincided, so the overlap is visible to an auditor rather than disguised as an independent acknowledgement, consistent with the treatment of role overlap in M5-12. | [MUST] | Issue a sample to the same person who received it at the counter; one custody row is written naming both parties and stating that they coincided, and no second acknowledgement is requested. |

### M4 field table — Receipt Condition and Acceptance screen

| Field | Type | Mandatory? | Validation | Notes |
|---|---|---|---|---|
| Sample number | Lookup / scan | Yes | Must exist and be in state Received | Populated by lookup, or by scanning the acknowledgement slip; the sample label does not exist until acceptance |
| Date and time of condition check | Date-time | Auto | Server clock | |
| Checked by | Lookup (staff) | Auto | The logged-in user | No shared logins permitted |
| Outer packaging intact | Yes / No / Not applicable | Yes | Note required if No | |
| Seal present and intact | Yes / No / Not applicable | Yes | Note required if No | |
| Seal number | Text | Conditional | Required if a seal is present | Compared with the declaration |
| Seal number matches declaration | Yes / No / Not applicable | Conditional | Note required if No | |
| Sample dry | Yes / No | Yes | Note required if No | Wet silk invalidates moisture and grading work |
| Free of stains and contamination | Yes / No | Yes | Note required if No | |
| Identification marks present and legible | Yes / No | Yes | Note required if No | |
| Marks match customer declaration | Yes / No / Not applicable | Yes | Note required if No | |
| Quantity matches declaration | Yes / No | Yes | Note required if No; triggers the shortfall flow | |
| Sample type matches declaration | Yes / No | Yes | Note required if No | |
| Free of mildew or insect damage | Yes / No | Yes | Note required if No | |
| Free of foreign matter / suspected admixture | Yes / No | Yes | Note required if No | Feeds the preliminary examination outcome |
| Deviation codes observed | Pick-list (multi) | Conditional | At least one if any answer above is No | From the reason code master |
| Condition remarks | Long text | Conditional | Required if any deviation | Free text in addition to codes |
| Photographs | File (multi) | Yes | At least one; sample number visible in frame | Checksums stored |
| Gross quantity / weight measured | Decimal (18,6) | Yes | Greater than zero | |
| Quantity unit | Pick-list | Yes | From the Unit of Measure master | |
| Balance / equipment used | Lookup | Yes | Must be In Service with valid calibration on this date | Block plus override per M4-04 |
| Calibration valid at weighing | Derived | Auto | Read-only | Recorded on the row |
| Number of sub-samples counted | Integer | Conditional | Required if the sample type has sub-samples | |
| Storage location assigned | Lookup | Yes | Active bin | Writes a custody event |
| Acceptance decision | Pick-list | Yes | Accepted / Accepted with reservation / Refer for rejection / Raise doubt | |
| Rejection reason code | Pick-list | Conditional | Required if referred for rejection | From the seeded list |
| Reservation deviation description | Long text | Conditional | Required if accepted with reservation | Drives the report disclaimer |
| Results that may be affected | Multi-select of parameters | Conditional | Required if accepted with reservation | Named in the report disclaimer |
| Customer consulted | Yes / No | Conditional | Must be Yes for acceptance with reservation | Links to the consultation record |
| Authorised by | Lookup | Conditional | Unit Incharge, for rejection or reservation | |
| Handling instructions from customer | Long text | No | — | Carried to the bench |

### M4 rules and edge cases

1. **Rejection is a real outcome with real consequences, not an error path.** A rejected lot still consumed counter time, still needs a photograph, still needs storing, still needs returning or disposing, and may still be billable as a handling charge. Build it as a first-class flow.
2. **The preliminary examination gate.** For raw silk grading, the governing standard provides an accept-or-reject examination before any test begins, and its stated grounds include admixture of commercial varieties and adulteration. The condition checklist above is the software form of that examination, and its outcome must be printable as a document in its own right (see M8 and M10).
3. **Two separate meanings of "conditioning".** Repeated here because it is the most common misunderstanding: pre-conditioning a specimen before a physical test is not the same thing as computing a commercial conditioned weight. Different data, different purpose, different module. Never one shared field.
4. **The atmosphere reading source matters.** A manual reading from a wall hygrometer, a logger export and a live sensor feed are all acceptable, but the record must say which. An auditor will ask.
5. **Custody handovers need the receiver, not just the giver.** A row saying "issued to Ramesh" written by the store keeper proves nothing. The receiving user's own confirmation, or a scan by the receiving user, is what makes the log evidence.
6. **Shared specimens break naive traceability.** Because ten bobbins feed four tests, the link between specimen and allocation is many-to-many. A one-specimen-one-test model will fail on the first grading job.
7. **Destructive testing must reduce the recorded quantity.** Otherwise the system will cheerfully accept a retest request for material that no longer exists.
8. **Disposal is authorised, witnessed and never automatic.** Silk has real value. An automated overnight job that disposes of expired samples is a liability, not a feature.
9. **The photograph is evidence, not decoration.** In an adulteration dispute the receipt photograph showing the customer's own marks and the packing condition is the laboratory's protection. Mandate it, require the sample number in frame, and never permit replacement.
10. **Custody events are immutable even when wrong.** A mis-entered custody event is corrected by adding a corrective event that references the erroneous one, with a reason. The original stays visible.
11. **Match the custody grain to the grain at which the material actually moves** — see note 5, which this note qualifies. A custody log that records thirty tester-confirmed handovers a day that did not physically occur is worse evidence than an honest batch record, because it is falsified. For the dominant routine test the material moves one worksheet at a time, so the batch confirmation of M4-36 is the honest grain, exactly as M7-36 matches the verification grain to the batch. The per-sample row survives; only the confirmation action is shared.

---

## M5. Work Allocation

**What this module is for, in plain words.** Once samples are accepted, somebody has to decide who does what. This module takes each unit of work — one sample and one test — and gives it to a tester who is authorised for that method, on an instrument that is in calibration, in an order that respects priority and due dates. It also groups work that is physically run together into a worksheet, so a tester weighing forty sizing skeins from eight samples does it in one pass rather than eight. And it implements the confidentiality requirement the scientist raised: the tester sees the work, not the customer. That last point needs to be specified honestly, because software alone cannot hide a customer's mark woven into the selvedge of their own fabric.

### M5 screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Allocation queue | Section Head | Unallocated work, oldest and most urgent first |
| Allocate / reallocate | Section Head | Assign to a tester and an instrument |
| Competency and calibration gate | System | Automatic checks at the moment of allocation |
| Workload board | Section Head / Unit Incharge | Open work per tester, weighted by turnaround |
| My work queue | Tester | The tester's own list — blinded |
| Worksheet builder | Section Head / Tester | Group allocations into one physical run |
| Worksheet print (blinded) | Tester | Bench paper with no customer identity |
| Unblinding request and approval | Tester (request), Unit Incharge (approve) | Time-boxed reveal with a logged reason |
| Reallocation history | Unit Incharge | Who was allocated what, when, and why it changed |

### M5 requirements

**Allocation and its gates**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M5-01 | Allocation operates on the **Test Allocation** (one sample × one test), never on the sample as a whole. Different tests on the same sample may be allocated to different testers, on different days, with different due dates. | [MUST] | Allocate a sample's three tests to three testers; each appears only in its own tester's queue. |
| M5-02 | Allocation may be performed by a Section Head or the Unit Incharge. A tester may also **self-pick** from an unallocated pool if a configuration setting permits it, subject to the same gates. | [MUST] | Enable self-pick; a tester picks an item and becomes its assignee, recorded as self-picked. |
| M5-03 | **Competency gate.** Allocation is blocked unless the proposed tester holds a valid authorisation for that exact method revision and the activity "perform", on the date of allocation. The block names the missing authorisation. | [MUST] | Allocate a cohesion test to a tester authorised only for size; blocked with the method named. |
| M5-04 | **Calibration gate.** Allocation is blocked unless at least one instrument of every equipment type the method requires is In Service with a valid calibration and a valid intermediate check, and expected to remain valid on the planned test date. | [MUST] | Allocate a test whose only serimeter is under repair; blocked naming the instrument and its state. |
| M5-05 | **Consumable gate.** Where the method requires a controlled reagent or reference material, allocation warns if no approved, unexpired lot is available in sufficient quantity. | [SHOULD] | Allocate a chemical test with no approved lot; a warning names the missing item. |
| M5-06 | Both the competency gate and the calibration gate may be overridden only by the **Approving Authority** — the role the Unit Incharge holds at Dharmavaram, the same authority M11-20 and M12-11 name for the equipment and consumable-lot gates — only with a reason from the override reason list, and the override automatically opens a nonconformity record. Every refused attempt is also logged. | [MUST] | Override a competency block; the nonconformity opens and the override is logged with the reason. |
| M5-07 | Allocation records: assignee, allocating user, allocation date and time, the instrument selected, the planned start date, and the worksheet if any. | [MUST] | Open any allocation; all six fields are present. |
| M5-08 | **Reallocation** is permitted, requires a reason code (leave, transfer, tour, workload balancing, competency issue, equipment change, other), retains the full history of previous assignees, and notifies both the old and the new tester. | [MUST] | Reallocate a started test; both testers are notified and the history shows both. |
| M5-09 | The allocation queue orders work by: express (Tatkal) first, then by due date, then by age of the sample. A section head may override the order manually, and the override is recorded. | [MUST] | Add a Tatkal item; it appears at the top of the queue. |
| M5-10 | The **workload board** shows, per tester: count of open allocations, the same count weighted by standard turnaround (a capacity figure, not a headcount), the number overdue, and the number due today. It also shows unallocated work per section. | [MUST] | Open the board; the weighted figure differs from the raw count where turnarounds differ. |
| M5-11 | Where a tester is flagged as having a declared relationship with the customer of a sample, allocation warns and requires the Unit Incharge to confirm, recording the impartiality decision. | [SHOULD] | Allocate a sample from a related customer; the warning appears and the confirmation is recorded. |
| M5-12 | Where the system can foresee at allocation time that the same person is likely to end up performing and later verifying or authorising the same work (a real situation in a three-person unit) — because no other person holding the required "technical review" or signatory authorisation for that method is available — it warns at allocation, records the foreseen overlap on the allocation, and counts it on a monthly report, so the Unit Incharge can decide in advance whether to raise a small-laboratory exception under M7-05, use the M13-10 override for an authorisation overlap, or hold the work. Allocation itself is not blocked. Whether the overlap is actually permitted at the later verification or authorisation step is governed by M7-04, M7-05 and M13-10, not by this requirement, which only ensures the overlap is never silent. | [MUST] | Allocate a cohesion test where the proposed tester is the only holder of the technical-review authorisation; the warning appears, the foreseen overlap is recorded on the allocation, and the monthly report counts it. Then attempt verification by that same person with no M7-05 exception in force; verification is blocked per M7-04. Enable the M7-05 exception for that method and repeat; verification succeeds and the occurrence is recorded on the allocation with its justification and counted. |

**Worksheets**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M5-13 | A **worksheet** groups allocations that are physically run together in one session, across many samples and many customers, on one instrument, by one tester, under one method. | [MUST] | Build a worksheet of thirty size allocations from eight samples; all thirty appear on one sheet. |
| M5-14 | The worksheet records: worksheet number, date, section, analyst, instrument, method revision, the ambient temperature and relative humidity at the start and end of the run, and its state (Open, In progress, Submitted, Verified, Closed). | [MUST] | Open a worksheet; the atmosphere fields are captured and stored. |
| M5-15 | A worksheet may contain quality-control positions in addition to customer samples: blank, duplicate of another position, reference material, and blind or spiked control. Each position is typed. | [SHOULD] | Add a duplicate position; it references the position it duplicates. |
| M5-16 | The printed worksheet is the bench document. It must be printable on ordinary A4, must carry the worksheet number, the method revision, the required reading count per parameter, blank spaces sized for the readings, and the atmosphere fields — and must be **blinded** per M5-17 to M5-23. | [MUST] | Print a worksheet; no customer name or price appears anywhere on it. |
| M5-17 | A worksheet may be re-printed. Each reprint is logged with the reason and the count. | [SHOULD] | Reprint a worksheet; the log records it. |

**Blinding — exactly what the tester sees and does not see**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M5-18 | Blinding is implemented as **field-level access control enforced in the data layer**, not by hiding a field in the user interface. The tester's own application response must physically not contain the customer's identity fields. | [MUST] | Call the tester's work-queue endpoint directly as a tester; the response body contains no customer name. |
| M5-19 | Each sample carries a **stable pseudonym** of the form `CUST-nnnn`, derived once and never changed, which appears wherever the customer's identity would otherwise appear in a blinded view. A pseudonym is used rather than a blank so that staff can discuss "the 4417 lot" without learning who it is. The pseudonym is allotted per customer from its own independent sequence, is unrelated to and not derivable from the Customer code `C-<5>`, and is stored on the customer master (see the customer table in Section 5). | [MUST] | Two samples from the same customer show the same pseudonym; a third from a different customer shows a different one. |
| M5-20 | The tester's search index and export functions contain blinded fields only. A tester cannot search by customer name, cannot export a list containing customer names, and cannot reach an invoice, receipt or acknowledgement slip screen. | [MUST] | Search the customer name as a tester; no results and the attempt is logged. |
| M5-21 | Blinding is **configurable per section and per role**, because for some referral work the sample arrives already coded by an external body and for internal research work blinding is pointless. Configuration changes are logged. | [MUST] | Switch blinding off for the Chemical Testing section; testers there see the customer, and the change is logged. |
| M5-22 | An **unblinding request** exists. A tester requests a reveal with a reason from a pick-list (sample marks ambiguous, need to clarify the declared size, sample does not match the description, suspected mix-up, customer contact required, other). The Unit Incharge approves. The reveal is time-boxed to a configurable window (default 60 minutes), scoped to that one sample, and written to the audit log. Unblinding events are reviewed monthly. | [MUST] | Request and approve an unblinding; the reveal expires after the window and appears on the monthly review report. |
| M5-23 | The reviewer and the Approving Authority are **not blinded**. They must see the customer, because the report names the customer and they are signing it. Their access is normal, not an unblinding event. | [MUST] | Open a report as a verifier; the customer is visible with no unblinding request needed. |

#### M5 field-level blinding table — the definitive list

| Field | Tester (blinded) | Section Head | Verifier | Approving Authority (Unit Incharge) | Accounts | Store Keeper |
|---|---|---|---|---|---|---|
| Sample number | Visible | Visible | Visible | Visible | Visible | Visible |
| Customer pseudonym (`CUST-nnnn`) | Visible | Visible | Visible | Visible | Visible | Visible |
| Customer name | **Hidden** | Visible | Visible | Visible | Visible | Visible |
| Customer address, district, state | **Hidden** | Visible | Visible | Visible | Visible | Hidden |
| Customer contact person and mobile | **Hidden** | Visible | Visible | Visible | Visible | Visible (for return handover only) |
| Customer GSTIN, PAN | **Hidden** | Hidden | Hidden | Visible | Visible | Hidden |
| Customer category | Visible | Visible | Visible | Visible | Visible | Hidden |
| Concession category | **Hidden** | Visible | Visible | Visible | Visible | Hidden |
| Sender name and relationship | **Hidden** | Visible | Visible | Visible | Visible | Visible |
| Customer's own lot number / reference | **Hidden by default; revealable** | Visible | Visible | Visible | Hidden | Visible |
| Mark | **Hidden by default; revealable** | Visible | Visible | Visible | Hidden | Visible |
| Chop (producer's trade mark) | **Hidden by default; revealable** | Visible | Visible | Visible | Hidden | Visible |
| Sample type | Visible | Visible | Visible | Visible | Visible | Visible |
| Sample description | Visible | Visible | Visible | Visible | Visible | Visible |
| Quantity, number of sub-samples | Visible | Visible | Visible | Visible | Visible | Visible |
| **Declared size / count and its range** | **Visible — required to perform the test** | Visible | Visible | Visible | Hidden | Hidden |
| **Declared composition and variety** | **Visible — required to perform the test** | Visible | Visible | Visible | Hidden | Hidden |
| **Declared twist, colour, weight** | **Visible — required to perform the test** | Visible | Visible | Visible | Hidden | Hidden |
| **Claimed grade** | **Visible — required for the conformity decision** | Visible | Visible | Visible | Hidden | Hidden |
| Reeling / production device | Visible | Visible | Visible | Visible | Visible | Hidden |
| Specification set and decision rule | Visible | Visible | Visible | Visible | Hidden | Hidden |
| Tests and parameters | Visible | Visible | Visible | Visible | Visible | Hidden |
| Method code and revision | Visible | Visible | Visible | Visible | Hidden | Hidden |
| Priority and due date | Visible | Visible | Visible | Visible | Visible | Visible |
| Condition on receipt and deviations | Visible | Visible | Visible | Visible | Hidden | Visible |
| **Receipt photographs** | **Visible only after the customer's marks are masked or the image is cropped; original visible to Section Head and above** | Visible | Visible | Visible | Hidden | Visible |
| Storage location | Visible | Visible | Visible | Visible | Hidden | Visible |
| "This is a repeat — related sample exists" flag | **Visible (flag only)** | Visible | Visible | Visible | Hidden | Hidden |
| The earlier related sample's results | **Hidden** | Visible | Visible | Visible | Hidden | Hidden |
| Sample family identifier | **Hidden (the flag is shown, the identifier is not)** | Visible | Visible | Visible | Hidden | Hidden |
| Price, discount, invoice, receipt, payment status | **Hidden** | Hidden | Hidden | Visible | Visible | Hidden |
| Acknowledgement slip | **Hidden** | Visible | Visible | Visible | Visible | Hidden |
| Any waiver or concession note | **Hidden** | Hidden | Hidden | Visible | Visible | Hidden |
| Complaint record naming the customer | **Hidden** | Visible | Visible | Visible | Hidden | Hidden |

#### M5 unavoidable cases and how each is handled

| Unavoidable case | Why software cannot solve it | Required handling |
|---|---|---|
| **The customer's mark is physically on the sample** — a filature's mark stamped on a book, a printed tag on a bale, a woven selvedge stamp on fabric, a twister's sticker on a cone | The tester is holding the customer's identity in their hand | At receipt the clerk must (a) photograph the sample **with** the marks, storing that image at Section Head visibility; (b) transcribe the marks into the hidden mark field; (c) **over-label** the sample with the laboratory's own code so the customer's mark is covered — at receipt this is a plain slip bearing the sample number, since the barcode label itself is printed only on acceptance (M3-20), and the barcode label is fixed over that slip when it prints; and (d) tick a mandatory confirmation "sample over-labelled with laboratory code". Where the mark cannot be covered (woven selvedge, printed bale cloth), the clerk records **"identity not maskable"** on the sample. That flag is reported monthly, and it is what the laboratory shows an assessor instead of a false claim. |
| **The declared size is needed to compute the result** | Size deviation is computed against the declared nominal denier; a conformity statement needs the declared composition | Declared values are Tier-0 visible to the tester, explicitly labelled "declared by customer, not verified by the laboratory". Blinding covers who the customer is, never what the customer declared. |
| **A repeat sample must be linked, but the tester must not anchor on the earlier result** | Knowing "this failed last time at 22.4 denier" biases the reading | The tester sees a flag only: "Repeat — a related sample exists". The earlier result and the family identifier are hidden. The system allocates a repeat to a **different tester** wherever staffing permits, and withholds both results from both testers until both worksheets are submitted; where no second tester is available the overlap is recorded as in M5-12. This control matters more because the stable pseudonym of M5-19 already re-links a tester to a result they produced themselves. |
| **The tester was at the counter when the customer walked in** | A three-person unit shares one room | Blinding cannot be claimed as absolute. The system's job is to remove the *systematic* channel (screens, searches, exports, printed sheets) and to record the residual. See the honesty requirement below. |
| **The tester answers the telephone** | Customers ring and identify themselves | Route status enquiries to the Front Desk role, which is not blinded. Publish a counter telephone number distinct from the bench. Accept that leakage occurs and monitor it. |
| **The tester also writes reports in a small unit** | Report generation requires the customer | Report generation is a separate role with normal access. Where one person holds both roles, the overlap is recorded per M5-12. |

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M5-24 | The system must record, per sample, whether the customer's physical identity was maskable, and must report the count of "identity not maskable" samples monthly. The monthly report states, beside that count, that each such sample also resolves that customer's stable pseudonym for the tester who handled it, so the residual re-identification risk is visible in the impartiality control-effectiveness review (M21-23) rather than left implicit. | [MUST] | Register a fabric with a woven mark; the flag is set, appears on the monthly count, and the report carries the re-identification note. |
| M5-25 | The quality manual wording the software supports must be the honest version: customer identity is masked by default in the testing interface; testers have no access to commercial or financial data; unblinding is authorised and logged; residual visibility through physical sample marks is recognised and managed by over-labelling and staff confidentiality undertakings. It must also state that the stable customer pseudonym of M5-19 is a **persistent re-identification key**, so that any single leak — an approved unblinding under M5-22, a counter encounter, or a sample recorded "identity not maskable" — resolves that customer's whole past and future history for that tester. The software must **not** be described, in the interface or in its documentation, as making blinding absolute. | [MUST] | Read the in-application help text on blinding; it states the limits explicitly, including the persistence of the pseudonym. |
| M5-27 | The pseudonym may be configured to be re-derived per financial year, or replaced by a per-sample label, for sections where cross-lot correlation by testers is not wanted. | [SHOULD] | Switch a section to per-financial-year pseudonyms; the same customer's lots from two years show different pseudonyms to a tester, and Section Head and above still see the customer. |
| M5-26 | Screens that display blinded views watermark the page with the viewing user's identifier and the timestamp, to discourage photography of the screen. | [SHOULD] | Open a tester queue; the watermark shows the user and time. |

### M5 field table — Allocate / Reallocate screen

| Field | Type | Mandatory? | Validation | Notes |
|---|---|---|---|---|
| Allocation identifier | Text | Auto | From the Allocation series | Read-only |
| Sample number | Derived | Auto | — | Shown blinded or unblinded per the viewing role |
| Test and method revision | Derived | Auto | — | Read-only; snapshotted at creation |
| Section | Derived | Auto | From the test catalogue | |
| Priority | Derived | Auto | From the request | Express items highlighted |
| Due date and time | Derived | Auto | From M3-24 | Read-only here |
| Assign to tester | Lookup (staff) | Yes | Must hold a valid "perform" authorisation for this method revision on today's date | Competency gate |
| Competency check result | Derived | Auto | Green or red with a reason | Read-only |
| Instrument | Lookup (equipment) | Yes where the method requires one | Must be In Service, calibration and intermediate check valid on the planned date | Calibration gate |
| Calibration check result | Derived | Auto | Green, amber (expiring soon) or red with the expiry date | Read-only |
| Consumable lot | Lookup | Conditional | Approved, unexpired, sufficient quantity | Warning only |
| Planned start date | Date | Yes | Not before today; not after the due date without a warning | |
| Worksheet | Lookup or "create new" | No | Same method revision, same instrument, same tester | Groups the run |
| Reallocation reason | Pick-list + note | Conditional | Required on any reallocation | From the reason master |
| Override authorisation | Lookup + reason | Conditional | Approving Authority (the Unit Incharge) only; required if any gate is red | Opens a nonconformity |
| Impartiality confirmation | Yes / No + note | Conditional | Required if the tester is flagged as related to the customer | |
| Allocation remarks | Long text | No | — | Visible to the tester |

### M5 rules and edge cases

1. **Never allocate a sample; always allocate an allocation.** This is the correction of the draft note's central modelling error. If four testers must work one sample, four rows must exist.
2. **Gates check the planned date, not today.** A calibration valid today but expiring before the planned start must show amber, and must block if the planned start is past the expiry.
3. **Refusals are logged.** Every blocked allocation attempt is recorded. The pattern of refusals is a training-needs report and an equipment-shortage report in disguise.
4. **Two-assessor methods.** Where the method master flags a method as requiring two independent assessors, allocation must create two performer slots and the second assessor must not see the first's readings until both are submitted.
5. **Self-pick versus assignment.** Both are valid operating models. The configuration switch matters because a section head in a three-person unit may be the tester, and forcing formal assignment then becomes theatre.
6. **Blinding is a control on a documented impartiality risk, not a feature for its own sake.** The laboratory should record it in its risk register with the risk it mitigates and evidence that the control works. The software provides the evidence: unblinding logs, "identity not maskable" counts, and refused-search logs.
7. **Blinding must never block the workflow.** Customer consultations, clarifications about the declared size, and doubt-raised holds all route through the Front Desk role, which is not blinded.
8. **The commonest leak is the printed page.** Verify the actual worksheet template, the actual label and the actual queue export on the actual printer. A perfectly blinded screen with a job header printed on the bench sheet defeats the whole control.
9. **Hide the sample family identifier so the tester cannot find which earlier sample this one repeats.** The flag "repeat exists" is safe; the identifier would let the tester locate the earlier sample and anchor on its result. Note that the stable customer pseudonym (M5-19) does deliberately allow a customer's lots to be correlated over time — that is intended, for quality-pattern visibility (M21-16). The family identifier is hidden for the anti-anchoring reason, not to prevent correlation.

---

## M6. Result Entry

**What this module is for, in plain words.** This is where the laboratory's actual output is created: the numbers a tester reads off a balance, a serimeter, a twist tester or a seriplane panel. Silk testing is not one number per test — a single size test weighs forty individual sizing skeins, a cohesion test frictions the thread at twenty places on ten test pieces, an evenness test compares twenty panels against standard photographs. So this module must capture many raw readings, compute the statistics from them, and keep the raw readings forever. It must also record which instrument was used, which reagent lot, and what the temperature and humidity were, because an auditor will ask and because a later problem with any of those must be traceable to every result it touched. And it must be fast, because a tester entering fifty readings will abandon any screen that needs a mouse.

### M6 screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| My work queue (blinded) | Tester | Today's allocations, ordered by priority and due date |
| Worksheet entry grid | Tester | Fast multi-sample, multi-reading entry |
| Single allocation entry | Tester | One sample, one test, all parameters |
| Reading grid | Tester | The individual readings for one parameter |
| Computed values panel | Tester | Mean, standard deviation, coefficient of variation, derived results, with the formula shown |
| Enumerated picker (photograph comparison) | Tester | Neatness, cleanness, evenness panel ratings |
| Equipment and consumable selection | Tester | Instrument identifier and lot identifier per activity |
| Environment panel | Tester | Temperature and relative humidity at test time |
| Attachments | Tester | Sample images, instrument printouts, imported files |
| Observations and remarks | Tester | Structured plus free-text notes |
| Draft save / Submit | Tester | Two clearly different actions |
| Result revision history | Tester / Verifier / auditor | Every previous value with its reason and author |
| Offline entry queue | Tester | Local capture when the network is down |
| File import (later phase) | Tester / Section Head | Comma-separated values from a balance or tester |

### M6 requirements

**Reading capture and computation**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M6-01 | Every parameter's readings are stored as **individual reading rows**, one per reading, each with its reading number, raw value, unit, the instrument used, the observation timestamp, the observing user and the entry mode. Readings are never collapsed into a single stored average. | [MUST] | Enter forty sizing-skein weights; forty rows exist and are individually retrievable. |
| M6-02 | The system enforces the **required reading count** from the method master. Submission is blocked while any mandatory parameter has fewer readings than required, and the message names the shortfall. | [MUST] | Try to submit a size test with 38 of 40 readings; blocked naming the two missing. |
| M6-03 | Where a method's reading count varies by size category (for example four sizing skeins from each of ten bobbins for finer silk versus eight for coarser), the required count is resolved from the method master using the declared or measured size, not typed by the tester. | [MUST] | Enter a coarse-silk sample; the system asks for 80 readings, not 40. |
| M6-04 | Computed values are calculated by the system from the readings, using the versioned formula in the method master, and the formula is **displayed on screen next to the result** in a form the scientist can read. | [MUST] | Open a size result; the mean, standard deviation and maximum deviation appear with their formulas visible. |
| M6-05 | The system stores all **intermediate values** of a multi-step calculation, not just the final answer, so the calculation can be re-executed and audited years later. | [MUST] | Open the calculation detail for a computed grade; every intermediate value is stored and displayed. |
| M6-06 | Standard computed values available to every numeric parameter: number of readings, mean, standard deviation, coefficient of variation as a percentage, minimum, maximum, range. Method-specific computed values (size deviation, maximum deviation from the coarsest and finest readings, cleanness percentage from weighted defect counts, average neatness, low neatness as the mean of the worst one-fifth of panels, conditioned size) are configured per method. | [MUST] | Compute low neatness on twenty panels; the system averages the worst four, matching the manual calculation. |
| M6-07 | Rounding and the number of significant figures are applied per the method master, not by the display layer. The system stores both the **raw computed value** and the **presented (rounded) value**, so the report and the record agree. | [MUST] | A value computed as 20.3849 stores as such and presents as 20.38 in denier to two decimal places. |
| M6-08 | Where the standard prescribes different precision in different units (three decimal places in tex, two in denier for size deviation; two in tex, one in denier for maximum deviation; whole numbers with no decimals for cohesion strokes), the system applies the correct precision per unit. | [MUST] | Switch the display unit from denier to tex; the decimal places change to the standard's requirement. |
| M6-09 | Enumerated parameters present a **picker, not a numeric field**. Neatness offers only the values configured for the method revision in force — under the BIS method revision, 100, 90, 80, 70, 60, 50, 30, 10. Evenness variation offers only the classification bands. Visual and tactual ratings offer only the standard's ordinal values (colour light / medium / deep; lustre bright / medium / dull; hand smooth / medium / rough; finish good / fair / inferior). | [MUST] | Under the BIS method revision, attempt to type 85 for neatness; only the values configured for that method revision are selectable. |
| M6-10 | Count-based parameters record not only the count but the required narrative detail. A winding test records each break **and its cause**, because the standard requires break causes and their frequency to be mentioned in the certificate. | [MUST] | Record five breaks with causes; the causes carry through to the report. |
| M6-11 | Both units of measure are handled throughout. A tester may enter in denier or tex, and the system converts and stores both, or stores one and renders both. Tenacity handles grams per denier and grams per tex. | [MUST] | Enter tenacity in grams per denier; the report can print grams per tex. |
| M6-12 | Plausibility limits per parameter produce a **warning with a confirmation prompt**, never a hard block. The confirmation is recorded. | [MUST] | Enter a size reading far outside the plausible band; the warning appears, the tester confirms, and the confirmation is stored. |

**Traceability captured at the bench**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M6-13 | The **equipment identifier is mandatory** on every test activity. It cannot be left blank and cannot be defaulted silently. This single field is what makes retrospective impact analysis possible when an instrument later fails a calibration. | [MUST] | Try to submit with no instrument selected; blocked. |
| M6-14 | Result entry is **blocked** where the selected instrument is not In Service at the observation time, or where its calibration or its intermediate check had expired at the observation time. The check is against the observation date, not today. Override requires the **Approving Authority** — the role the Unit Incharge holds at Dharmavaram, named as in M11-20 and M12-11 — a reason, and automatically opens a nonconformity. | [MUST] | Back-date an observation to a period when the instrument's calibration had lapsed; blocked with the dates shown. |
| M6-15 | Where a method requires a controlled reagent or reference material, the **lot identifier is mandatory** per activity. Expired lots are blocked, evaluated against the observation date. Override rules as in M6-14. | [MUST] | Select an expired lot; blocked with the expiry date. |
| M6-16 | Where the calibration certificate carries a **correction factor**, the current factor is applied automatically by the calculation engine, its value is stored on the result, and the factor's version is recorded. Applying a stale factor must be impossible. | [MUST] | Update a balance's correction factor; new results use the new factor and old results retain the old one. |
| M6-17 | The **temperature and relative humidity at the time of test** are recorded on every test activity, auto-filled from the environment log where a monitored source exists, and manually entered with the source stated where it does not. | [MUST] | Submit a result; the atmosphere fields are populated and the source is stated. |
| M6-18 | Where the atmosphere was outside the method's required band at the time of test, the system warns at submission, records the excursion, opens a nonconformity, and requires either a justified decision that the result is unaffected or a repeat. | [MUST] | Record 30 degrees Celsius against a 27 ± 2 requirement; the excursion is recorded and a nonconformity opens. |
| M6-19 | Where the method's sample-draw rule names a specimen level (sizing skein, seriplane panel, test piece, bobbin, skein), **each reading row carries the identifier of the single specimen it was taken from**, and that identifier is mandatory. The specimen must be one of those recorded against the allocation and must belong to this sample's sub-sample tree from M4. The system validates the specimens used across a parameter's readings against the draw rule's expected shape recorded under M4-11 — for example 40 sizing-skein readings resolving to 4 skeins from each of 10 bobbins — and blocks submission where the shape does not match, naming the discrepancy. Where a parameter is a whole-sample judgement with no specimen basis (the visual and tactual ratings in M6-09), no per-reading specimen is required. | [MUST] | Open reading 27 of a size test; it names one sizing skein and its ancestors (parent bobbin, parent skein) from the M4 tree, and a per-bobbin summary of the 40 readings is available. Enter 40 readings drawn from 9 bobbins instead of 10; submission is blocked naming the shape mismatch. |
| M6-20 | Test start and end date-times are captured as real values, not derived from the submission time, because the report must state the date or dates on which the test was performed. | [MUST] | Start a test on Monday and finish on Wednesday; the report shows both dates. |

**Outliers, corrections and immutability**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M6-21 | A reading may be **excluded** from the computation but never deleted. Exclusion sets a flag, requires a reason from a pick-list (instrument misread, specimen defect unrelated to the material, specimen damaged in preparation, transcription error, statistical outlier per the method's own rule, other), records who excluded it and when, and the excluded reading remains visible on screen and printable. | [MUST] | Exclude a reading; it shows struck through with its reason, and the mean recomputes without it. |
| M6-22 | Exclusion of a reading beyond a configurable count or percentage requires the Section Head's authorisation. | [SHOULD] | Exclude a fourth reading from forty with a limit of three; authorisation is demanded. |
| M6-23 | Where the method itself prescribes a repeat rule (for example, repeat the test if two determinations differ by more than a stated percentage), the system evaluates the rule automatically and tells the tester that a repeat is required. It does not leave the tester to remember. | [MUST] | Enter two moisture determinations differing by 0.7 percent against a 0.5 percent rule; the system requires a repeat. |
| M6-24 | Once **submitted**, a raw reading can never be overwritten. A correction creates a new revision row holding the old value, the new value, the changing user, the timestamp, a reason code and a reason note. The original remains visible in the interface, not merely recoverable from a backup. | [MUST] | Correct a submitted reading; the screen shows the current value with a "changed — view history" link, and the history shows the original first. |
| M6-25 | The result-entry screen and any printed technical record must be able to show the original value alongside the amendment, mirroring the paper practice of striking through, initialling and dating. | [MUST] | Print the technical record for a corrected result; both values appear. |
| M6-26 | No record in the result chain is ever hard-deleted. Voiding sets a void timestamp, a voiding user and a reason, and the voided record remains queryable and printable, watermarked Void. | [MUST] | Void a result; it remains retrievable and is watermarked. |
| M6-27 | The system detects **back-dating**. Where the entered observation time differs from the server's record-creation time by more than a configurable tolerance, a reason is required and the discrepancy is stored. | [MUST] | Enter yesterday's observation today; a reason is demanded and stored. |
| M6-28 | Observation timestamps come from the server clock, which is synchronised to a trusted time source. Client-supplied times are never trusted. | [MUST] | Change a workstation's clock; the recorded observation time is unaffected. |

**Attachments, observations, and the two save actions**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M6-29 | Sample images and instrument printouts can be attached at any point, with a category (sample photograph, instrument printout, imported data file, panel photograph, other), and each attachment's checksum is stored. | [MUST] | Attach a printout; its checksum is stored and it is retrievable. |
| M6-30 | Where a method's result rests on an instrument printout or a scanned trace, attaching that artefact is **mandatory** before submission. The requirement is configured per method. | [MUST] | Submit a serigraph test with no printout attached; blocked. |
| M6-31 | Observations are captured as **structured coded observations plus free text**. Coded observations exist for the narrative items the standard requires on the certificate: exceptional or outstanding defects, break causes, visual ratings such as "Fair", and any deviation from the method. | [MUST] | Record an outstanding defect; it appears in the report's narrative block automatically. |
| M6-32 | **Save as draft** and **Submit** are visually and functionally distinct. A draft is editable by the tester and invisible to the verifier. A submitted result is locked to the tester and appears in the verification queue. The interface must make it impossible to submit by accident. | [MUST] | Save a draft, close the browser, reopen; the draft is intact and not in the verification queue. |
| M6-33 | Submission runs a completeness check and lists every reason it cannot proceed in one message: missing readings, missing instrument, missing lot, missing atmosphere, missing mandatory attachment, unapproved method deviation, out-of-band environment not dispositioned, expired calibration. | [MUST] | Submit an incomplete result; a single message lists all blocking reasons. |
| M6-34 | "Test could not be performed" is a legitimate submission outcome, with reasons (specimen insufficient, specimen destroyed in preparation, instrument failed mid-test, material unsuitable for the method, other). It routes to verification like any other result and produces an honest report entry, not a blank. | [MUST] | Submit "could not be performed"; the allocation moves to verification and the report states it. |

**Speed of entry — the requirement that decides adoption**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M6-35 | The reading grid must be operable **entirely from the keyboard with no mouse**. `Tab` and `Enter` both advance to the next reading cell; `Shift+Tab` moves back; the numeric keypad works including the decimal point; `Enter` on the last reading of a parameter advances to the first reading of the next parameter. | [MUST] | Enter forty readings using only the numeric keypad and `Enter`; all forty are captured in order. |
| M6-36 | Tab order is strictly top-to-bottom then left-to-right within the reading grid, and never jumps to a toolbar, a menu, a help link or a browser control. Focus is placed in the first empty reading cell when the screen opens. | [MUST] | Open the grid; the cursor is already in the first empty cell, and forty `Tab` presses never leave the grid. |
| M6-37 | Values are auto-saved as the tester moves off each cell, so a power cut loses at most one reading. The last saved reading number is visible on screen. | [MUST] | Enter twenty readings and pull the network cable; on reconnection, twenty readings are present. |
| M6-38 | Computed values (mean, standard deviation, coefficient of variation) update **live** as readings are entered, so the tester sees an implausible entry immediately rather than after forty readings. | [MUST] | Type an obviously wrong reading; the running mean visibly jumps and the plausibility warning appears at once. |
| M6-39 | The grid supports paste from a spreadsheet: a column of forty numbers pasted into the first cell fills forty readings, with a confirmation showing how many were read and any that failed validation. | [SHOULD] | Paste forty values; all forty populate and the confirmation states forty. |
| M6-40 | A **worksheet-mode grid** presents many samples down the rows and readings across the columns, for the dominant case of one test performed on ten to thirty lots in one batch. Moving from the last reading of one sample to the first of the next requires one keystroke. | [MUST] | Enter one test across thirty samples in worksheet mode; the whole batch is entered without a mouse. |
| M6-41 | Entry speed for the dominant test (Limited test, twenty readings per lot). The authoritative target is Section 1 goal 3 and success measure S3: a trained tester completes one lot's twenty readings in **under ninety seconds**, and a batch of thirty lots in **under forty-five minutes**, excluding the physical weighing. The batch figure is derived from the per-lot figure (30 x 90 s) and must never be stated independently of it. Because raw typing time is a property of the tester and not of the software, the obligation on the screen is the **overhead**: keystrokes and waits beyond the digits of the readings themselves must not exceed one keystroke per reading to commit and advance, and no more than three keystrokes to move from the last reading of one lot to the first of the next (per M6-40). | [MUST] | Time a trained tester on a thirty-lot batch and count keystrokes. The overhead limits are met, or the screen is redesigned; raw typing time is not treated as a defect. |
| M6-42 | The screen must remain usable on a modest workstation over a slow local network: server-rendered pages, no large downloads, no dependence on fonts or scripts fetched from the internet. | [MUST] | Load the entry screen with the internet disconnected; it works fully. |

**Offline and poor-network behaviour**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M6-43 | The result-entry screen must continue to accept readings when the connection to the server is briefly lost, holding them in a local queue and posting them when the connection returns, with a visible indicator of queued items. | [MUST] | Disconnect, enter ten readings, reconnect; all ten arrive and the indicator clears. |
| M6-44 | Queued offline entries are posted as an **append-only stream** with the observation times captured locally and the server-received time recorded separately. No merge or conflict resolution logic is required, because only one tester owns an allocation at a time. | [MUST] | Post an offline batch; both timestamps are stored. |
| M6-45 | Numbers of any kind (worksheet numbers, revision numbers) are **never allocated by an offline client**. They are allocated by the server when it accepts the entry. | [MUST] | Create an offline worksheet; its number is assigned on sync, not locally. |
| M6-46 | A printable blank worksheet exists as the documented manual fallback for a total outage, together with a documented procedure for entering it afterwards with the true observation times and a reason for the delayed entry. | [MUST] | Print a blank worksheet; the fields match the on-screen grid exactly. |

**Instrument data import (later phase)**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M6-47 | A file-watch import reads comma-separated or plain-text output from an instrument folder, using a per-instrument mapping held in configuration (delimiter, header rows, column-to-parameter map, sample identifier column), writes readings with entry mode "file import", archives the source file as an attachment with its checksum, and quarantines rows it cannot match for human resolution. | [LATER] | Drop a file with thirty-two matching rows and two unmatched; thirty-two import and two are quarantined. |
| M6-48 | An import must never silently overwrite a manually entered value. A conflict is flagged for a human decision, and the decision is recorded. | [MUST when M6-47 is built] | Import a value where one was typed; the conflict is flagged, not overwritten. |
| M6-49 | Imported readings carry exactly the same audit trail as manually entered ones, plus the source file name and checksum. | [MUST when M6-47 is built] | Change an imported value; the revision history is identical in form to a manual correction. |
| M6-50 | Serial capture from a balance's print output is deferred to a later phase, and when built must place one weight into the focused reading cell and nothing else. | [LATER] | Press the balance's print key; one value lands in the focused cell. |

### M6 field table — Result entry screen (single allocation)

| Field | Type | Mandatory? | Validation | Notes |
|---|---|---|---|---|
| Allocation identifier | Derived | Auto | — | Read-only |
| Sample number | Derived | Auto | — | Blinded view for the tester |
| Customer pseudonym | Derived | Auto | — | `CUST-nnnn` |
| Sample description and quantity | Derived | Auto | — | Read-only |
| Declared size / count | Derived | Auto | — | Labelled "declared by customer, not verified" |
| Declared composition, twist, colour | Derived | Auto | — | Same labelling |
| Test and method revision | Derived | Auto | — | Read-only; snapshotted |
| Specification set | Derived | Auto | — | Read-only |
| Worksheet | Lookup | No | Same method, tester and instrument | |
| Specimen / sub-sample used | Lookup (multi) | Yes | Must belong to this sample's tree and be in state Prepared or In use | The permitted set for this allocation; the per-row Specimen used field selects from it |
| Instrument | Lookup | Yes | In Service; calibration and intermediate check valid at the observation time | Block plus override per M6-14 |
| Correction factor applied | Derived | Auto | From the current calibration record | Read-only; version stored |
| Consumable / reference material lot | Lookup | Conditional | Approved, unexpired at the observation time, sufficient quantity | Required where the method uses one |
| Test start date and time | Date-time | Yes | Not in the future; not before conditioning end | Real value, not the submission time |
| Test end date and time | Date-time | Yes | At or after the start | Prints on the report |
| Temperature at test | Decimal (5,1) °C | Yes | Warn outside the method band | Auto-filled where a source exists |
| Relative humidity at test | Decimal (5,1) % | Yes | Warn outside the method band | Auto-filled where a source exists |
| Environment source | Pick-list | Yes | Sensor / Logger export / Manual hygrometer reading | Must be stated |
| Pre-conditioning start and end | Derived | Auto | From the M4 conditioning register | Read-only; blocks start if incomplete |
| Reading number (per row) | Integer | Auto | Sequential from 1 | Read-only |
| Raw reading value (per row) | Decimal (18,6) or enumerated or text | Yes to the required count | Plausibility band warns; decimals per parameter; enumerated values restricted | The heart of the screen |
| Reading unit | Derived / pick-list | Yes | From the parameter, overridable where the method allows | |
| Specimen used (per row) | Lookup | Yes where the method's draw rule names a specimen level | Must be one of the allocation's specimens and belong to this sample's tree; draw-rule shape validated at submission | Links this one reading to one physical item |
| Reading excluded | Yes / No | No | Default No | Never deletes the row |
| Exclusion reason | Pick-list + note | Conditional | Required if excluded | |
| Break cause (winding only, per break) | Pick-list + note | Yes per break | From a configured cause list | Prints on the report |
| Computed values | Derived | Auto | — | Read-only, with the formula shown |
| Result verdict against specification | Derived | Auto | — | Read-only; see M7 for the decision rule |
| Computed grade | Derived | Auto | — | Read-only; never typed |
| Coded observations | Pick-list (multi) | No | From a configured list | Feeds the report narrative |
| Free-text observations | Long text | No | — | Prints where the method requires narrative |
| Deviation from method | Long text + authorisation link | No | If present, must reference an approved deviation record | Blocks release if unapproved |
| Attachments | File (multi) | Conditional | Mandatory where the method requires a printout | Checksums stored |
| Test could not be performed | Yes / No + reason | No | Reason required if Yes | Honest alternative to a blank result |
| Entered by | Derived | Auto | The logged-in user | No shared logins |
| Draft / Submit | Action buttons | — | Submit runs the M6-33 completeness check | Two visually distinct actions |

### M6 rules and edge cases

1. **Raw readings and computed results are different things and live in different places.** A computed value is never stored over a raw reading, and a raw reading is never replaced by a computed one.
2. **The mean is not the result.** For several silk parameters the reportable value is not the mean at all — low neatness is the mean of the worst one-fifth of panels; maximum deviation comes from the four coarsest and four finest readings. The formula belongs to the method master, and the software must not assume "average the readings".
3. **Grade is computed, never entered.** No tester ever types "3A". The grade engine reads the classification tables, takes the worst major-test grade, then applies auxiliary-test class differences with the capping rule. If the engine cannot compute a grade because a required parameter is missing, it says so; it does not guess.
4. **A result can be invalidated by another result.** Where the conditioned size differs from the marked size by more than the standard's tolerance, the standard requires every other test to be discarded and the whole set repeated. The system must therefore support marking a whole set of results as Discarded, creating the repeat set, linking the two, and issuing the certificate from the repeat. This is not an edge case; it is a rule in the governing standard.
5. **Zero readings is not the same as a zero reading.** A parameter with no readings entered is incomplete. A parameter with a genuine value of zero (zero breaks in the winding test) is complete. The interface must distinguish them.
6. **Two assessors, two sets of readings.** For photographic-comparison work, each assessor's readings are stored separately and attributed. The resolution rule (average, or a third assessor) is configured per method, and the individual assessments survive.
7. **The tester who is also the section head.** Permitted, recorded per M5-12, and monitored. The software's job is the record, not a false prohibition.
8. **Keyboard-first is not a nicety.** At roughly eleven thousand samples a year in daily batches, a screen that adds ten seconds per sample adds thirty hours a year of pure friction and guarantees the tester keeps the paper register. Treat M6-35 to M6-41 as functional requirements of equal weight to the compliance ones.
9. **Never trust the client clock, and never let the client allocate a number.** Both rules exist because offline entry otherwise silently corrupts the audit trail and the numbering series.
10. **Correcting a submitted reading is a normal event, not a failure.** Make it easy, make it visible, and make the reason mandatory. A system that makes correction hard produces testers who avoid submitting until they are sure, which destroys the "recorded at the time they are made" requirement.

---

## M7. Verification and Approval

**What this module is for, in plain words.** No result leaves the laboratory on the word of one person. This module implements two separate steps. First **technical verification**: a competent person who did not enter the result checks that the readings are complete, the calculations are right, the instrument was in calibration, the correct method version was used, and the conclusion follows from the data. Second **authorisation**: a named person on the laboratory's approved signatory list takes responsibility for the report and signs it. This module also defines exactly what happens when a result sits so close to a specification limit that the measurement's own uncertainty makes the pass-or-fail answer arguable — which is a decision the laboratory must make in advance and agree with the customer, not something a verifier decides on the day.

### M7 screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Verification queue | Verifier | Submitted results awaiting technical verification, with ageing |
| Verification screen | Verifier | Readings, computed values, checklist, decision |
| Send back to tester | Verifier | Reason code plus observations |
| Conformity decision panel | Verifier | Specification, decision rule, computed verdict |
| Second-level verification | Section Head | Where the laboratory operates two levels |
| Authorisation queue | Approving Authority | Verified work awaiting signature |
| Authorisation and signing | Approving Authority | Re-authenticate and sign |
| Delegation of signing authority | Unit Incharge | Named alternate, dated, scoped |
| Bulk verification | Verifier | High-volume routine tests, with safeguards |
| Retraction | Unit Incharge | Pull back a verified but unreported result |
| Verification performance report | Unit Incharge / Quality Manager | Send-back rates, first-time-right, ageing |

### M7 requirements

**The two-step model**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M7-01 | The workflow has two mandatory, separately recorded steps between result submission and report issue: **technical verification** and **authorisation**. There is no path from a submitted result to an issued report without both. | [MUST] | Attempt to issue a report from an unverified result; blocked. |
| M7-02 | Technical verification is performed per **test allocation**. Authorisation is performed per **report**. This distinction matters because a report may carry several allocations, each verified separately, and the authoriser signs the whole document. | [MUST] | Verify three allocations individually, then authorise one report covering all three. |
| M7-03 | The verifier must hold a valid authorisation for the activity "technical review" on that exact method revision, on the date of verification. The check runs at the moment of the action, not at login. | [MUST] | Attempt verification without the authorisation; blocked naming the method. |
| M7-04 | **Segregation of duties.** By default the verifier must not be the person who entered the result. The default is enforced. | [MUST] | Try to verify your own result; blocked by default. |
| M7-05 | **The small-laboratory exception.** Where headcount makes segregation impossible, the Unit Incharge may permit self-verification for a named method and a stated period. Each occurrence is recorded on the allocation with a justification, is reported monthly with a count, and appears in the management review pack. The exception is a configuration with an expiry date, never a permanent silent setting. | [MUST] | Enable the exception for one method for one month; self-verification is then permitted, recorded, counted, and blocked again after expiry. |
| M7-06 | The verifier may not change a reading or a result value. The verifier may only **verify** or **send back**. Only the tester may change a value, and every change creates a visible revision with a reason. | [MUST] | Attempt to edit a reading as a verifier; the field is not editable and the action is unavailable. |
| M7-07 | **Send-back** requires a reason code from a pick-list plus free-text observations. Seeded reasons: readings incomplete; calculation appears incorrect; transcription suspected; wrong method revision used; instrument out of calibration at test time; consumable lot unsuitable; environment out of band and not dispositioned; insufficient replicates; specimen preparation questionable; conformity decision does not follow from the data; observations or narrative missing; attachment missing; other (note mandatory). | [MUST] | Send back a result; a reason code is demanded and stored. |
| M7-08 | A send-back increments a retest counter on the allocation, archives the current result values as a revision, returns the allocation to the tester with the observations visible, and **does not stop the turnaround clock** — because poor first-time-right work should not be rewarded with extra time. | [MUST] | Send back and resubmit; the counter reads one and the due date is unchanged. |
| M7-09 | A configurable **two-level verification** mode exists, where a second verifier (typically the Section Head) must also verify before authorisation. The mode is set per test or per test family. | [SHOULD] | Enable two levels for grading; both verifications are demanded and separately recorded. |
| M7-10 | The verification record stores: level, action taken, the acting person, the timestamp, the checklist answers, the observations, and the electronic signature record. | [MUST] | Open a verification record; all seven elements are present. |

**The verification checklist**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M7-11 | Verification presents a **structured checklist** which must be completed before the verify action becomes available. Every item is answered Yes / No / Not applicable, and any No blocks verification and steers the verifier toward send-back. | [MUST] | Answer one checklist item No; the verify button is unavailable and send-back is offered. |
| M7-12 | Minimum checklist items: (a) all mandatory parameters have the required number of readings; (b) excluded readings are within the permitted count and each carries a reason; (c) computed values recompute correctly on demand; (d) the instrument used was In Service with valid calibration and intermediate check at the observation time; (e) the correction factor applied was the current one; (f) the consumable or reference material lot was approved and unexpired at the observation time; (g) the method revision used was Active on the test date; (h) any deviation from the method is documented, technically justified, internally authorised and accepted by the customer; (i) the temperature and relative humidity at test were within the method's band, or an excursion has been dispositioned; (j) pre-conditioning was completed for the required duration; (k) the tester held a valid authorisation for the method at the observation time; (l) the specimens used trace to the correct parent sample; (m) mandatory attachments are present; (n) the narrative items the method requires (exceptional defects, break causes, visual ratings) are recorded; (o) where a conformity statement is to be made, the specification, the decision rule and the computed verdict are consistent; (p) where measurement uncertainty must be reported, it is present and in the correct unit. | [MUST] | Open a verification screen; all sixteen items are shown with their automatic answers pre-filled where the system can determine them. |
| M7-13 | Wherever the system can determine a checklist answer itself (calibration validity, method status, lot expiry, authorisation validity, reading counts), it pre-fills the answer and shows the evidence, so the verifier confirms rather than re-investigates. | [MUST] | Open the screen; items (a), (d), (f), (g), (k) are pre-filled with the supporting values displayed. |
| M7-14 | A recompute action re-executes every calculation from the stored raw readings and shows any difference from the stored computed value. A difference blocks verification and raises a nonconformity, because it means the calculation engine or the data changed. | [MUST] | Alter a stored computed value directly in the database; recompute detects the difference and blocks. |

**Conformity statements and the decision rule**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M7-15 | A conformity statement (a pass or fail against a specification) may be made only where the customer requested one, the specification was recorded at request time, and a **decision rule** was selected and agreed with the customer at request time. None of these may be chosen at verification time. | [MUST] | Try to add a conformity statement to a request that did not ask for one; blocked. |
| M7-16 | A **Decision Rule master** exists, holding: code, plain-language description, the guard-band width expressed as a formula (zero, one uncertainty, two uncertainties, a stated multiple of the standard deviation), the risk basis, and whether the rule is prescribed externally by the customer, a regulation or the standard itself. | [MUST] | Create two decision rules with different guard bands; each produces a different verdict on the same borderline result. |
| M7-17 | Conformity is decided **per parameter**, never once for the whole report. Each parameter's verdict names the specification and the clause it was judged against. | [MUST] | A report with one failing parameter and five passing shows five passes and one fail, not a single overall fail. |
| M7-18 | The system computes the verdict deterministically from the result, the specification limit, the measurement uncertainty and the guard band. The verifier confirms; the verifier does not compute. | [MUST] | Enter a borderline result; the verdict is computed and displayed with the arithmetic shown. |
| M7-19 | **The borderline case, specified explicitly.** Where the result lies close enough to the limit that the measurement uncertainty spans the limit, the outcome depends entirely on the agreed decision rule, and the system must implement at least these four named rules: | [MUST] | Run the same borderline result under all four rules; four different, correct outcomes are produced. |

| Decision rule | Guard band | What the system does when the uncertainty band spans the limit | Printed statement |
|---|---|---|---|
| **Simple acceptance (shared risk)** | Zero | Compares the measured value alone with the limit. Passes if the measured value is inside the limit, even though the uncertainty crosses it. | "Pass. Decision rule: simple acceptance — the measured value is compared directly with the limit; measurement uncertainty has not been used to guard the decision. Approximately 50 percent risk of false acceptance at the limit." |
| **Guarded acceptance (one uncertainty)** | One expanded uncertainty inside the limit | Passes only if the measured value plus the expanded uncertainty is still inside the limit. A value inside the limit but within one uncertainty of it is reported as **not demonstrated to conform**. | "Conformity not demonstrated. The measured value lies within the measurement uncertainty of the specified limit. Decision rule: guarded acceptance with a guard band of one expanded uncertainty." |
| **Guarded rejection (one uncertainty)** | One expanded uncertainty outside the limit | Fails only if the measured value minus the expanded uncertainty is still outside the limit. Used where a false rejection is the costlier error. | "Non-conformity not demonstrated. Decision rule: guarded rejection with a guard band of one expanded uncertainty." |
| **Prescribed by the specification** | As stated in the standard | Applies the rule the standard itself prescribes, and does not add a laboratory guard band. Where the standard is silent on uncertainty (as the raw-silk grading tables are), the classification tables are applied to the measured value as written. | "Pass. Judged against the classification table of the cited standard, as prescribed by that standard." |

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M7-20 | Where no conformity statement was requested, the report presents results with no pass or fail wording anywhere. The system must not volunteer a verdict. | [MUST] | Issue a report with no conformity requested; no pass, fail, satisfactory or unsatisfactory wording appears. |
| M7-21 | The measurement uncertainty is reported where any of these is true: it is relevant to the validity or application of the result; the customer has asked for it; or it affects conformity against a specification limit. The third trigger is evaluated automatically by the system, not remembered by a person. | [MUST] | Produce a borderline conformity result; the uncertainty prints automatically even though the customer did not ask. |
| M7-22 | Uncertainty is reported in the same unit as the measured quantity or as a relative percentage, per the method's configured policy. | [MUST] | Switch a method's policy from absolute to relative; the printed form changes accordingly. |
| M7-23 | Where a parameter's grade or class is assigned rather than a numeric verdict (the raw-silk grade letters), the system prints the classification and, where the standard requires it, the degrading arithmetic — for example the provisional grade, each auxiliary shortfall, and the resulting overall grade. | [MUST] | Compute a grade lowered by two classes; the report shows the provisional grade, the two class differences and the final grade. |
| M7-24 | Only personnel authorised for the activity "issue a statement of conformity" may verify a result that carries one. Only personnel authorised for "give opinions and interpretations" may verify one that carries an opinion. These are separate authorisations from technical review. | [MUST] | A technically-authorised verifier without conformity authorisation cannot verify a conformity result. |

**Authorisation and signing**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M7-25 | Authorisation is performed only by a person on the laboratory's **Authorised Signatory register**, and only for the specific disciplines, groups, products, parameters or methods that person is authorised to sign. The system verifies coverage **for every parameter on the report** and refuses otherwise. | [MUST] | A signatory authorised only for physical testing attempts to sign a report containing a chemical parameter; blocked naming the parameter. |
| M7-26 | The Authorised Signatory register holds, per person: the scope lines they may sign for, the accreditation-body approval reference and date where applicable, the location (because accreditation is location-specific), a designated alternate, and the date the person was declared to the accreditation body. | [MUST] | Open the register; every field is present for each signatory. |
| M7-27 | Signing requires **re-authentication at the moment of signing** — being logged in is not signing. The system captures the signer's identity, role, the specific authorisation basis relied on, the server timestamp, the checksum of the exact document signed, the network address and device, and the signature artefact. | [MUST] | Sign a report; a password or second factor is demanded and all seven items are recorded. |
| M7-28 | Where the laboratory operates a countersignature by the Unit Incharge in addition to the reviewer and the authoriser, a third signature slot exists, each slot with its own authorisation check. | [SHOULD] | Enable three slots; all three are demanded before issue. |
| M7-29 | **No shared or generic signing accounts, ever.** Each signature is attributable to one named individual with their own credential. | [MUST] | Attempt to create a shared account with signing permission; blocked. |
| M7-30 | Signature images, where used, are controlled assets: stored encrypted, accessible only to the owning user, never bulk-exportable, never applicable by another user, with a full usage log. | [MUST] | Attempt to apply another user's signature image; blocked and logged. |

**Delegation — because it will happen**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M7-31 | A **delegation** function exists. The Unit Incharge (or the delegating signatory, per configuration) records: who is delegating, to whom, the start and end dates, and the scope delegated (which methods, disciplines or report types). The delegate must independently hold a valid authorisation for that scope; delegation cannot create competence. | [MUST] | Delegate to a person without the underlying authorisation; blocked. Delegate to an authorised alternate; permitted for the stated dates only. |
| M7-32 | A delegation automatically expires on its end date. It cannot be open-ended. The maximum duration is a configuration value. | [MUST] | Create a delegation past the maximum; blocked. Let one expire; signing is blocked afterwards. |
| M7-33 | Every report signed under a delegation records that fact, names the delegating authority and the delegation reference, and prints the signing person's own name and designation — never the absent person's name. | [MUST] | Sign under delegation; the report shows the delegate's name and a note that they signed under a recorded delegation. |
| M7-34 | Where a change is made to the list of persons authorised to report, review or authorise results, the system creates a task with a fifteen-day due date to notify the accreditation body, and records the notification's date, mode and reference when done. | [MUST] | Add a signatory; the notification task appears with the correct due date. |
| M7-35 | Where no Approving Authority is available for a report's parameters and no valid delegation exists, the report cannot be issued and the system explains precisely which parameter has no available Approving Authority. Work waits; it is not signed by an unauthorised person. | [MUST] | Remove all signatories for one discipline; the report is held with a clear explanation. |

**Bulk verification, retraction and monitoring**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M7-36 | **Bulk verification** is permitted for high-volume routine tests, and only where safeguards are met. The safeguards, all mandatory: (a) bulk verification is enabled per test in the catalogue, not globally; (b) every allocation in the batch must have every automatic checklist item green; (c) any allocation with a warning, an excursion, an override, an excluded reading beyond the permitted count, a plausibility confirmation, or a conformity verdict other than a clear pass is **excluded from the batch** and must be verified individually; (d) the batch size is capped by configuration; (e) the verifier must open and confirm a summary screen showing the batch's aggregate statistics and any outliers before confirming; (f) each allocation still receives its own individual verification record and signature. | [MUST] | Bulk-verify thirty routine size tests where two have plausibility confirmations; twenty-eight verify and the two are held for individual verification. |
| M7-37 | A **retraction** function lets the Unit Incharge return a verified but not-yet-reported result to the tester, with a mandatory reason, archiving the verification and the result values as revisions. | [MUST] | Retract a verified result; it returns to the tester and the verification is archived. |
| M7-38 | Where a result has already been reported, it cannot be retracted. It can only be **invalidated**, which requires the report to be amended or withdrawn first (see M8), creates a replacement allocation linked as a repeat, and opens a nonconformity. | [MUST] | Try to retract a reported result; the system directs you to the report amendment path instead. |
| M7-39 | A verification performance report shows, per period, per test and per tester: submitted count, verified first time without send-back (first-time-right percentage), send-back count by reason, average and ninetieth-percentile hours from submission to verification, and count of self-verifications under the small-laboratory exception. | [MUST] | Run the report for a month; the figures reconcile to the underlying records. |
| M7-40 | Ageing alerts fire where a result has been awaiting verification longer than a configured threshold in working hours, and where verified work has been awaiting authorisation longer than its own threshold. | [MUST] | Leave a result unverified past the threshold; the verifier and the section head are alerted. |

### M7 field table — Verification screen

| Field | Type | Mandatory? | Validation | Notes |
|---|---|---|---|---|
| Allocation identifier | Derived | Auto | — | Read-only |
| Sample number and description | Derived | Auto | — | Verifier sees the customer; not blinded |
| Customer name | Derived | Auto | — | Visible to the verifier |
| Test, method code and revision | Derived | Auto | — | Read-only |
| Entered by / submitted at | Derived | Auto | — | Read-only; drives the segregation check |
| Readings table | Derived | Auto | — | Read-only, including excluded readings shown struck through with reasons |
| Computed values | Derived | Auto | — | Read-only, with the formula and a Recompute action |
| Recompute result | Action + derived | Yes | Any difference blocks verification | Raises a nonconformity on difference |
| Instrument and its calibration status at test | Derived | Auto | — | Pre-filled checklist evidence |
| Consumable lot and its status at test | Derived | Auto | — | Pre-filled checklist evidence |
| Temperature and humidity at test, with band | Derived | Auto | — | Excursions highlighted |
| Pre-conditioning start, end and duration | Derived | Auto | — | Against the method requirement |
| Tester authorisation status at test time | Derived | Auto | — | Pre-filled checklist evidence |
| Method deviation record | Derived | Auto | — | Must be approved and customer-accepted |
| Checklist items (a) to (p) | Yes / No / Not applicable | Yes, all | Any No blocks verify | Auto-filled where determinable |
| Specification set and clause | Derived | Auto | — | Read-only |
| Decision rule | Derived | Auto | — | Read-only; locked at request time |
| Measurement uncertainty | Derived | Auto | — | Read-only; printing decided automatically |
| Computed conformity verdict per parameter | Derived | Auto | — | Read-only, with the arithmetic shown |
| Computed grade and degrading arithmetic | Derived | Auto | — | Read-only |
| Verification level | Pick-list | Auto | 1 or 2 per configuration | |
| Action | Pick-list | Yes | Verify / Send back | No third option |
| Send-back reason code | Pick-list | Conditional | Required if sending back | From the reason master |
| Verifier observations | Long text | Conditional | Required if sending back; optional on verify | Visible to the tester |
| Self-verification justification | Long text | Conditional | Required where the small-laboratory exception applies | Counted monthly |
| Verified by / at | Derived | Auto | The logged-in, authorised user; server clock | Signature record created |
| Re-authentication | Password or second factor | Yes | Must succeed | Signing is not the same as being logged in |

### M7 rules and edge cases

1. **The verifier cannot fix the number.** This is the most important rule in the module. If a verifier could edit a reading, the reading would no longer be attributable to the person who observed it, and the whole technical record loses its meaning. Verify or send back — nothing else.
2. **The small-laboratory exception is dated and counted, never silent.** A three-person unit genuinely cannot always segregate duties. The honest handling is an exception with an expiry, a justification per occurrence, and a monthly count that the Unit Incharge sees.
3. **The decision rule is chosen before the work, not after.** A verifier who chooses the decision rule after seeing the number is choosing the answer. That is why M3 locks it at request time.
4. **A borderline result is not a failure of the laboratory.** "Conformity not demonstrated" is a legitimate, honest outcome under guarded acceptance, and the report must be able to say it in plain words rather than being forced into a pass or a fail.
5. **Uncertainty printing is triggered automatically.** Relying on a verifier to remember that a near-limit result needs its uncertainty printed is exactly the kind of human step that fails an assessment.
6. **Authorisation is scoped per parameter, not per person.** A signatory authorised for physical testing must not be able to sign a report that happens to contain one chemical parameter. The system checks every parameter.
7. **Delegation does not create competence.** The alternate must already hold the authorisation. Delegation only transfers the act of signing, for a bounded period, with a record.
8. **Bulk verification is a genuine operational need, not laziness.** Eleven thousand samples a year of one routine test cannot be verified one screen at a time. The safeguards in M7-36 are what make it defensible: only clean batches, only enabled tests, individual records retained, and anything unusual pulled out automatically.
9. **Ageing in the verification queue is a real bottleneck.** The state-transition history makes it measurable. Report it, because in most laboratories the days are lost between submission and verification, not at the bench.
10. **A verified result is not yet a report.** Nothing has been issued, no number has been allocated to a certificate, and nothing is public until M8 issues it.

---

## M8. Report and Certificate Generation

**What this module is for, in plain words.** The report is the laboratory's product. Everything else exists to produce it. This module builds the document, checks that it contains everything the international laboratory standard requires, marks clearly which tests are inside the laboratory's accreditation and which are not, prints it as a fixed file that can never be quietly altered, signs it, gives it a number, puts a verification code on it, and records where it went and who received it. It also handles the two things that go wrong: a report that must be corrected after issue, and a report that must be taken back entirely. The single most important technical instruction in this module is that the issued file is stored as the exact bytes that were issued — not as data that gets re-drawn later — because a template change, a font substitution or a logo update three years from now must not be able to change what an auditor sees when they open a 2026 report.

### M8 screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Reportable work list | Report Writer | Verified allocations awaiting a report |
| Report compile | Report Writer | Choose grouping, template, content |
| Draft preview | Report Writer | Watermarked draft, on screen and printable |
| Mandatory content check | System | Blocks submission until every required element is present |
| Accreditation scope split | System | Automatic split into accredited and non-accredited reports |
| Report submit for approval | Report Writer | Sends to the Approving Authority |
| Authorisation and issue | Approving Authority | Sign, allocate the numbers, freeze the file |
| Report register | Unit Incharge / auditor | Every report ever issued, in serial order, with status |
| Amendment | Unit Incharge (raise), Approving Authority (issue) | Supplementary document or replacement report |
| Withdrawal | Unit Incharge | Take a report out of force |
| Dispatch register | Front Desk | Mode, date, tracking, acknowledgement |
| Duplicate copy issue | Front Desk | Marked duplicate, logged |
| Archive and retrieval | Any authorised role / auditor | The exact issued file, by number or by date |

### M8 requirements

**Mandatory report content — the enumerated list**

Each of the following is a separate requirement so that it can be checked one by one and referred to in a meeting.

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M8-01 | The report carries a **title** identifying the document type, from a controlled list: Test Report, Test Certificate, Grading Certificate of Raw Silk, Record and Report of Conditioned Mass of Raw Silk, Record and Report of Preliminary Examination of Raw Silk, Cocoon Test Report, Zari Test Report, Water Analysis Report, Pre-shipment Inspection Certificate, Classification (HSN) Certificate, Advisory Test Report. | [MUST] | Generate one of each type; each prints its own title. |
| M8-02 | The report carries the **name and address of the laboratory** as configured for the issuing unit. | [MUST] | The unit name and full postal address appear. |
| M8-03 | The report states the **location where the testing was performed**, per test line, which may differ from the laboratory's own address (customer premises, another CSB unit, a subcontractor). | [MUST] | Issue a report with one test performed at another unit; that line names the other location. |
| M8-04 | The report carries a **unique identification** — the laboratory's own report number and revision — printed on **every page**, together with **"Page n of m"** on every page, and a clear **"End of Report"** marker on the last page. | [MUST] | Print a four-page report; every page shows the number and "Page n of 4", and page 4 ends with the marker. |
| M8-05 | The report carries the **customer's name and contact information**, taken as a frozen snapshot at the moment of issue, not read live from the customer master. | [MUST] | Change the customer address after issue and reprint; the original address still appears. |
| M8-06 | The report **identifies the method used** per test: the method code, its title, and its version, edition year or revision (for example the standard's part and year, or an in-house procedure with its revision number). | [MUST] | Every test line shows the method with its version. |
| M8-07 | The report gives a **description, unambiguous identification and, where necessary, the condition** of the item tested: sample number, sample type, description, quantity, number of sub-samples, the customer's own mark and lot number where supplied, and the condition on receipt where it affects the result. | [MUST] | A sample accepted with a deviation shows its condition on the report. |
| M8-08 | The report states the **date of receipt** of the item, and the **date of sampling** where the laboratory drew the sample and that date affects the validity of the results. | [MUST] | Both dates print where applicable. |
| M8-09 | The report states the **date or dates on which the testing was performed**, taken from the captured test start and end times, never derived from the issue date. | [MUST] | A test performed over three days shows the date range, not the issue date. |
| M8-10 | The report states its own **date of issue**, set at the moment the state becomes Issued. | [MUST] | The issue date matches the state transition record. |
| M8-11 | Where the laboratory performed the sampling, the report references the **sampling plan and sampling method** used. | [MUST] | A laboratory-sampled job prints the sampling reference; a customer-submitted one prints nothing. |
| M8-12 | The report carries the statement that the **results relate only to the items tested**. | [MUST] | The statement appears on every report. |
| M8-13 | The report presents the **results with their units of measurement**, at the precision the method prescribes, using the presented (rounded) value while the raw computed value remains in the record. | [MUST] | A size result prints to two decimal places in denier per the method's rule. |
| M8-14 | The report states any **additions to, deviations from, or exclusions from the method**, drawn from the approved deviation records linked to the work. | [MUST] | A job with an approved deviation prints it; one without prints nothing. |
| M8-15 | The report **identifies the person authorising it** by name and designation — a printed identity, not merely a signature image. | [MUST] | The signatory's name and designation print in text. |
| M8-16 | The report **clearly identifies any result obtained from an external provider** (another CSB unit or a subcontractor), naming the provider and, where relevant, their accreditation status. | [MUST] | A subcontracted line is visibly marked as externally provided with the provider named. |
| M8-17 | Where necessary for interpretation, the report states the **specific test conditions, including the environmental conditions** — the temperature and relative humidity during test, and the pre-conditioning applied. For textile work this is normally required. | [MUST] | The report prints the atmosphere and pre-conditioning for physical tests. |
| M8-18 | Where a conformity statement is made, the report states it per parameter, naming the specification or standard and the clause met or not met, and naming the **decision rule applied** unless that rule is inherent in the cited specification. | [MUST] | A conformity result prints the specification, the clause and the decision rule. |
| M8-19 | Where applicable, the report states the **measurement uncertainty**, in the unit of the measured quantity or as a relative percentage, whenever it is relevant to validity or application, whenever the customer asked, or whenever it affects conformity against a limit. | [MUST] | A near-limit conformity result prints the uncertainty automatically. |
| M8-20 | Where the laboratory gives **opinions and interpretations**, they appear in a visually distinct, separately headed block, explicitly labelled as opinions and interpretations, only where the customer requested them and only where the signing person is authorised for that activity. | [MUST] | Issue a report with an opinion; it appears in its own headed block, marked as an opinion. |
| M8-21 | The report carries the statement that it **shall not be reproduced except in full**, without the written approval of the laboratory. | [MUST] | The statement appears on every report. |
| M8-22 | Where the laboratory was **not responsible for sampling**, the report states that the results apply to the sample as received. | [MUST] | A customer-submitted sample's report carries this statement. |
| M8-23 | Where the customer supplied information that can affect the validity of the results (declared size, declared composition, declared weight, claimed grade), the report **identifies that information as customer-supplied and unverified**, and carries a disclaimer that validity may be affected by it. | [MUST] | A report on a sample with a declared denier prints the declaration as customer-supplied with the disclaimer. |
| M8-24 | Where an item was accepted with a deviation from specified conditions, the report names the deviation **and names the results that may be affected**. | [MUST] | A wet-sample acceptance-with-reservation prints the deviation and the affected parameters by name. |
| M8-25 | Where accreditation applies, the report carries the statement that **accreditation of the laboratory does not imply that the product tested is approved by the accreditation body**. | [MUST] | The statement appears on accredited-scope reports. |
| M8-26 | Every statement, disclaimer and boilerplate sentence is held in a **Statements master** with a code, the text, the language, the trigger condition, a version number and effective dates. Templates reference statements by code, never by literal text. A wording change is one data edit with a version history, and every previously issued file keeps the wording that was in force. | [MUST] | Change a disclaimer's wording; new reports show the new text and a report from last month still shows the old text. |

**Unique Laboratory Report number and accreditation marking**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M8-27 | Where the laboratory is accredited and the report is entirely within the accredited scope, the report carries a **Unique Laboratory Report number** in addition to the laboratory's own report number. Both print on the report and both are unique. | [MUST] | An accredited-scope report shows two distinct identifiers, both unique across the system. |
| M8-28 | The Unique Laboratory Report number is produced by the **configuration-driven template engine** described in M1-73. Its parts, lengths, number base, reset policy and validity dates are configuration. No part of the number is built by joining text together in program code. | [MUST] | Change the template configuration; the next number changes format with no software change. |
| M8-29 | The Unique Laboratory Report number sequence resets each calendar year, is gap-free, is allocated atomically by the server, and is allocated **only at the moment of authorisation** — never at sample registration. A draft report has no such number. | [MUST] | Create a draft; it has no Unique Laboratory Report number. Authorise it; the number is allocated. |
| M8-30 | Every test carries a flag **"is this parameter inside the accredited scope"**, derived from a Scope master holding product, parameter, method, discipline and group with validity dates, synchronised from the accreditation certificate's scope. | [MUST] | Mark one parameter out of scope; the report engine reacts per M8-31 and M8-32. |
| M8-31 | **Hard block.** The system must refuse to place a Unique Laboratory Report number or the accreditation body's symbol on any report that contains at least one out-of-scope parameter. | [MUST] | Attempt to issue a mixed report with the symbol; blocked naming the out-of-scope parameter. |
| M8-32 | **Automatic split.** Where one sample's requested tests mix accredited and non-accredited parameters, the system generates **two reports** from the same work: an accredited report carrying the symbol and the Unique Laboratory Report number, and a separate non-accredited report carrying neither and containing no wording that implies accreditation. Both reference the same sample internally; neither hints at the other's accreditation status. | [MUST] | Order three accredited and two non-accredited parameters on one sample; two reports are produced with the correct content in each. |
| M8-33 | **Asterisks and footnote markers to denote accreditation status are forbidden** in the accredited template. The template is checked at build time and any pattern that marks a parameter as outside scope with a symbol is rejected. | [MUST] | Add an asterisk-based "not in scope" note to the accredited template; the build fails with a clear message. |
| M8-34 | Nothing in the report, its attachments or any accompanying material may imply that work is accredited when it is not. A review checklist item covers this and the Quality Manager signs the template off. | [MUST] | The template sign-off record exists for every template version. |
| M8-35 | The accreditation body's symbol is stored as a controlled asset with valid-from and valid-to dates. It is swapped automatically when a new certificate is issued and is **suppressed automatically** the moment accreditation validity lapses. | [MUST] | Set the symbol's validity to expire yesterday; today's reports print without it. |
| M8-36 | Where the laboratory prints the discipline and group before the product and parameters (for example, Mechanical — Textile Materials), that is configured per template and per unit. | [SHOULD] | Enable the setting; the discipline and group print above the results table. |

> **OPEN-Q6 — ANSWERED.** RSTRS Dharmavaram **is** accredited in its own right. Certificate **NABLT0726AD18713**, ISO/IEC 17025:2017, field Testing, issued 17/07/2026 and valid until 16/07/2030, in the name of the Central Silk Board for the Textile Testing Laboratory, Regional Silk Technological Research Station, at Regetipalli Road, Dharmavaram. The unit is therefore configured as **accredited**: the accreditation symbol and the Unique Laboratory Report number are switched on, the ULR is built by the 26-character format (a) described in OPEN-Q-B12, and the certificate's validity dates drive the automatic suppression rule of M8-35. **The per-test scope flag still governs**, and the scope is now known — it is seeded in §M8.5 below.

### M8.5 The accredited scope, as seed data

The Scope master required by M8-30 is not a hypothetical. The scope annexure to certificate **NABLT0726AD18713** (page 1 of 1, validity 17/07/2026 to 16/07/2030, never yet amended) lists **exactly seven accredited entries**, all in the discipline and group **MECHANICAL — TEXTILE MATERIALS**, all under **Permanent Testing**. This table is the seed data for the Scope master and must be loaded before the first report is issued.

| # | Material or product tested | Parameter or characteristic | Test method specification |
|---|---|---|---|
| 1 | Fabric | Length | IS 1954 |
| 2 | Fabric | Mass | IS 1964 |
| 3 | Fabric | Number of Threads Per Unit Length | IS 1963 |
| 4 | Fabric | Percentage by Weight of Warp and Weft Yarn | IS 17208 |
| 5 | Fabric | Width | IS 1954 |
| 6 | Raw Silk Yarn | Count | IS 15090 (Part 5) |
| 7 | Woven Fabric | Linear Density of Yarn Removed from Fabric | IS 3442 |

**M8-69 [MUST]** — The scope key is the **triple (material or product, parameter, method)**, not the test name and not the parameter alone. *Count* is accredited for **Raw Silk Yarn** only; the same characteristic measured on twisted or thrown silk is outside the scope. *Length* and *Width* are both accredited under the one method IS 1954, so a method may cover several parameters and a parameter may appear under several materials. **Acceptance check:** configure a Count test against sample type *Twisted Silk*; the scope flag resolves to out-of-scope even though *Count* appears in the scope table.

**M8-70 [MUST]** — The scope entries carry the certificate's validity dates and the annexure's *last amended* date. A scope row is only in force between those dates, and re-loading an amended annexure supersedes the previous set rather than editing it, so a report issued last year can still be shown against the scope that was in force then. **Acceptance check:** load an amended annexure; a report issued before the amendment still resolves against the earlier scope set.

**M8-71 [MUST]** — The scope covers **Permanent Testing** — testing performed at the accredited premises. Any test performed away from those premises is outside the scope regardless of the parameter. **Acceptance check:** mark an allocation as performed off-site; the symbol and Unique Laboratory Report number are withheld.

> **Read this before assuming the accreditation covers the day's work.** Comparing the seven rows above with the unit's actual revenue mix has a blunt consequence for the design: **most of what this laboratory sells is outside its accredited scope.** Raw silk grading (both BIS and ISA), evenness, neatness, cleanness, cohesion, twist, boil-off, winding breaks, tenacity and elongation, fibre identification, blend composition, cocoon tests and the whole of conditioning and weight certification appear nowhere in the annexure. Five of the seven accredited entries are fabric tests, while the recorded revenue is overwhelmingly raw silk work. Therefore: the automatic split of M8-32 is the **normal case, not the exception**; the Unique Laboratory Report number will be allotted on a **minority** of reports; and the non-accredited report template is the one most staff will see most days. It must be designed as a first-class document, not as a degraded version of the accredited one.

> **OPEN-Q14 — ANSWERED.** Does the *Limited Test* fall inside scope row 6 (*Raw Silk Yarn / Count / IS 15090 (Part 5)*)? **No.** The Unit In-Charge has confirmed it directly — "limited test will be non nabl" — and has supplied a status list, *RSTRS DMM Proposed testing charges*, marking the Limited Test and seventeen other catalogue items **Non-NABL**. He also confirmed that where accredited and non-accredited work meet, a **separate report** is required, which is exactly the split of M8-32. The recommended default in the earlier draft of this document (treating *Count* as inside scope) was therefore **wrong**, and is withdrawn. The seeded status list is §M8.6 below.

### M8.6 Catalogue accreditation status, as seed data

Confirmed by the Unit In-Charge. Every item below is **outside** the accredited scope and its reports carry no accreditation symbol and no Unique Laboratory Report number.

| # | Catalogue item | Status |
|---|---|---|
| 3 | Limited test (5 skein) | Non-NABL |
| 4 | Raw silk testing & Grading — BIS | Non-NABL |
| 5 | Raw silk testing & Grading — ISA (IARM) | Non-NABL |
| 6 | Raw silk testing & Grading — ISA | Non-NABL |
| 7 | Fibre Identification | Non-NABL |
| 8 | Composition of raw silk (Blend analysis) | Non-NABL |
| 9 | Nature | Non-NABL |
| 10 | Seriplane tests of raw silk — BIS | Non-NABL |
| 11 | Serigraph test of raw silk — BIS | Non-NABL |
| 12 | Cohesion test of raw silk — BIS | Non-NABL |
| 13 | Twist (twisted silk) — single | Non-NABL |
| 14 | Twist (twisted silk) — composite | Non-NABL |
| 15 | Denier test of twisted silk | Non-NABL |
| 18 | Computerized zari testing | Non-NABL |
| 19 | Computerized zari testing at multiple point | Non-NABL |
| 20 | Zari testing chemical method | Non-NABL |
| 21 | Zari testing Handloom weavers | Non-NABL |
| 27 | Reelability test (cocoons) | Non-NABL |
| 28 | Reelability test with neatness | Non-NABL |
| 29 | Cocoon Testing (Renditta, CQI) | Non-NABL |
| 30 | Water Hardness / pH / Total dissolved solids | Non-NABL |

**M8-72 [MUST]** — The accreditation status of a catalogue item is **explicit master data with a default of Non-NABL**. A newly created catalogue item is Non-NABL until somebody with the Quality Manager's authority sets it otherwise against a named row of the scope annexure, and the system records which annexure row was relied on. There is no derivation of status from a test's name, its method, or the fact that a similar test is accredited. **Acceptance check:** create a new catalogue item called "Denier test"; it is created Non-NABL, and setting it accredited demands the selection of a scope annexure row.

**M8-73 [MUST]** — The **non-accredited certificate is the primary template**. It is designed first, tested first and is the default for a new catalogue item. The accredited template is the exception path. **Acceptance check:** issue reports for the twenty-one items above; every one uses the non-accredited template, carries no symbol and no Unique Laboratory Report number, and consumes no number from that series.

> **The design consequence, stated plainly.** Every item on the unit's current proposed charge list is Non-NABL. The seven accredited scope entries are five fabric parameters, one woven-fabric parameter and *Raw Silk Yarn / Count*, and **none of the twenty-one items above maps to any of them**. On the present catalogue the accreditation symbol and the Unique Laboratory Report number would therefore appear on **no report at all**. That is not a defect in this design — the machinery is built and tested and waits behind a per-item flag — but it changes what is built first and what must be demonstrated at acceptance. Build the plain certificate properly; treat the accredited one as the smaller, later stream.

> **OPEN-Q15:** The status list supplied by the unit is numbered 3 to 30 with gaps — serial numbers **1, 2, 16, 17 and 22 to 26 are absent**, and no fabric test appears anywhere on it, although five of the seven accredited scope entries are fabric parameters. What are the missing items, and are any of them the accredited ones? — *Recommended default:* assume the missing serial numbers correspond to the fabric and count parameters named in the scope annexure, and treat them as accredited **only** once the unit confirms both the item name and the annexure row it maps to. Until then every catalogue item is Non-NABL, which is the safe direction.

> **OPEN-Q16:** Does the unit actually offer, and charge for, the seven accredited parameters — fabric length, mass, threads per unit length, warp and weft percentage by weight, width, raw silk yarn count, and linear density of yarn removed from fabric? None of them appears on the proposed charge list. If they are not offered, the accreditation covers work the unit does not sell, and the accredited template will never be used. — *Recommended default:* build the accredited path as specified but schedule its acceptance demonstration only once the unit confirms at least one accredited item is on the price list. Ask the Quality Manager whether these parameters are newly added, planned, or performed for another CSB unit.

> **OPEN-Q17:** The file supplied is titled *Proposed testing charges* but contains only test names and their accreditation status — **no charges**. What are the current rates for each item, and are the "proposed" rates a revision awaiting approval or already in force? — *Recommended default:* seed the rate card from the published CSTRI schedule effective 01.12.2023 (Limited test ₹50, Denier test bobbin ₹30, Denier test skein ₹40, Raw silk testing & Grading BIS ₹400, ISA ₹1,100 or ₹2,000 by origin) and mark every rate **unconfirmed**, with an effective date, so a revision supersedes rather than overwrites it.

> **OPEN-Q7:** Does the accreditation body require one verification code on the report or two (one to the report, one to the accreditation certificate and scope)? The research could not confirm the two-code requirement from an official source. — *Recommended default:* design the template with **two code positions**, populate only the report-verification code, and leave the second position empty until the requirement is confirmed.

**Templates, grouping and the draft**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M8-37 | Report templates exist per test family, each versioned with effective dates, each referencing statements by code, and each recording which document type it produces. Minimum template set at go-live: Raw Silk Test Report (the routine denier and limited-test format); Raw Silk Grading Certificate; Twisted or Thrown Silk Yarn Test Report; Fabric or Saree Test Report; Chemical Test Report; Water Analysis Report; Cocoon Test Report; Zari Test Report; Preliminary Examination Report; Conditioned Mass (Weight) Certificate; Advisory Test Report; Classification (HSN) Certificate. | [MUST] | Generate a report from each template; each renders correctly with its own layout. |
| M8-38 | Report grouping follows the choice recorded on the Test Request per M3, defaulting to one consolidated report per request, with a per-request option for one report per sample, and an automatic split where the accreditation scope requires it. | [MUST] | Issue a five-sample request both ways; the consolidated and per-sample outputs are both correct. |
| M8-39 | A **partial or interim report** may be issued where at least one test is verified and others remain open. It is titled and marked clearly as partial, lists which tests are reported and which remain outstanding, and does not close the sample. The remaining tests continue and a final report is issued later, referencing the partial one. | [MUST] | Issue a partial report on two of five tests; the sample stays in testing and the final report references the partial. |
| M8-40 | A **draft** report may be previewed and printed. Every page of a draft carries a diagonal watermark reading DRAFT — NOT FOR ISSUE, a distinct background tint, no report number, no Unique Laboratory Report number, no verification code, no signature and no accreditation symbol. A draft file, if saved, has a file name beginning with "DRAFT_". | [MUST] | Print a draft; it is visually unmistakable and carries none of the five issue-only elements. |
| M8-41 | The report language is configurable per template and per customer, supporting English, and Hindi and Telugu where the laboratory requires them, with a font set that renders all three correctly in the generated file. | [SHOULD] | Generate a bilingual report; both scripts render correctly, not as boxes. |

> **OPEN-Q8:** Must certificates issued by this unit be bilingual in Hindi and English under the official language requirements applying to central government offices? — *Recommended default:* build the template engine to support a second language column from the start, generate English only at go-live, and add Hindi when the administrative wing confirms the requirement. Retro-fitting bilingual layout is expensive; retro-fitting the content is not.

**Issue, freezing and signing**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M8-42 | On authorisation the system performs, in one transaction: the mandatory content check; the accreditation scope check; the signatory scope check; allocation of the report number and, where applicable, the Unique Laboratory Report number; rendering of the file; computation of the **content fingerprint** of the rendered bytes, which is the value that prints on the face under M8-48 and that the M9-04 payload carries; creation of the verification token; the signature, bound to that content fingerprint per M8-45; and **last, computation of the stored file checksum `pdf_sha256`, taken over the final stored bytes of the signed file** as DB-14 requires. The stored checksum is therefore computed **after** signing, never before, so that the weekly integrity job of NFR-42 re-computes the same value for the life of the record. If any step fails, nothing is issued and no number is consumed except as a retired number if already allocated. | [MUST] | Force a failure mid-issue; no partial report exists and the numbering register is consistent. Issue a report with a certificate-based signature and run the NFR-42 integrity check at once; the stored checksum matches the bytes on disk. |
| M8-43 | **The issued file is frozen and stored as bytes.** The system stores the rendered file itself, its checksum, the template identifier, the template version and the render timestamp. Reports are never re-rendered from data for display, download, reprint or verification. | [MUST] | Change the template and the logo, then reprint a report issued last month; the output is byte-identical to the original. |
| M8-44 | **Why this matters, recorded in the specification for the developer's benefit:** a report is a legal and commercial document that other parties act on financially. If the system re-draws it on demand, then a later change to a template, a font, a logo, an address or a statement's wording silently changes what an auditor, a customer or a court sees. Storing the bytes plus a checksum means the laboratory can prove that what it produced in 2026 is exactly what is produced in 2031. Re-rendering on demand also fails the accreditation requirement that the retained copy be an exact replica of the report issued to the customer, including its header, footer and symbol. | [MUST] | The stored file's checksum recomputes to the stored value at any later date. |
| M8-45 | Where the file is signed cryptographically, the signature is bound to the **file's checksum**, not to a database row, so a later template change cannot alter what was signed. | [MUST] | Verify the signature on a stored file; it validates against the stored bytes. |
| M8-46 | Signing uses the tier ladder defined once in M21-43 and no other set: (a) a printed name and designation with an in-application signature record; (b) an in-application electronic signature with re-authentication at the moment of signing, cryptographically bound to the file's checksum, with a tamper-evident audit record; (c) a cryptographic digital signature applied to the file with a certificate from a Certifying Authority licensed by the Controller of Certifying Authorities. Tier (c) is the design target, tier (b) the minimum acceptable; tier (a) alone is never presented to a customer as a signature, and neither is a pasted signature image. The tier actually used is recorded on every signature record. **No signing tier that requires a call outside the laboratory network may be offered for report issue**, because report issue must complete with the internet disconnected — see NFR-27, NFR-29, NFR-32 and acceptance case AC-33. This rules out an Aadhaar-based electronic signature service on this path, which needs a UIDAI/ESP round trip per signature. | [MUST] | Configure tier (b); a signature record is created carrying the checksum, the signer, the re-authentication and the tier used. Inspect the tier options offered in configuration; none requires an external network call at the moment of signing. |
| M8-47 | Where a certificate-based signature is used, the signature carries a trusted timestamp so that a report signed in one year still validates after the certificate expires. | [SHOULD] | Validate a signed file after its signing certificate's expiry; it still validates by virtue of the timestamp. |
| M8-48 | The report prints, in human-readable text, a short **document fingerprint** — the first characters of the file's checksum — so that a person holding the paper can compare it against the fingerprint shown on the verification page. | [MUST] | Compare the printed fingerprint with the one shown on the verification page; they match. |
| M8-49 | The report carries a short note explaining how to verify it: the fixed verification web address, and where a cryptographic signature is used, a line on validating the signature in any file reader. | [MUST] | The note appears on every issued report. |

**Amendment and withdrawal**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M8-50 | An issued report and its stored file are **append-only**. There is no update and no delete, enforced at the database level by revoking those permissions on the issued-report tables from the application's account, and by a trigger that raises an error on any modification attempt. | [MUST] | Attempt a direct database update on an issued report row; the database refuses. |
| M8-51 | Two distinct correction mechanisms exist, both first-class documents. **(A) Amendment** — a supplementary document with its own unique number, carrying the literal statement "Amendment to Report, serial number ⟨original report number⟩" and the reason for the change. **(B) Replacement report** — a complete new report with its own unique number, carrying the statement "This report supersedes and replaces Report No. ⟨number⟩ dated ⟨date⟩". | [MUST] | Produce one of each; both carry the required statement and reference the original. |
| M8-52 | An amendment or replacement is generated through the **same pipeline** as an original report and must satisfy every requirement M8-01 to M8-49 in its own right. It is never a hand-typed letter. | [MUST] | Issue an amendment; the mandatory content check runs and all elements are present. |
| M8-53 | A mandatory, non-blank **reason for change** is selected from the amendment reason pick-list plus free text, and prints on the document. | [MUST] | Try to issue an amendment without a reason code; blocked. |
| M8-54 | The system generates a machine-produced **change manifest**: a field-level before-and-after comparison between the superseded content and the new content. It is stored and printable. | [MUST] | Amend one result value; the manifest lists exactly that field with both values. |
| M8-55 | The full lineage is recorded: which report a document amends, which it supersedes, and which superseded it. Any view or print of a superseded report is watermarked **SUPERSEDED — see Report No. ⟨number⟩**. | [MUST] | Print a superseded report; the watermark names its replacement. |
| M8-56 | Re-issue never silently re-uses the original report number. Numbering follows a configuration: either a suffixed revision (R1, R2) or a fresh number from the series. | [MUST] | Issue a replacement; its number differs from the original by the configured rule. |
| M8-57 | Whether an amendment carries the same Unique Laboratory Report number as the original or a new one is a **laboratory policy switch** with a documented default of re-use. The choice is recorded in the quality manual. | [MUST] | Switch the policy; the amendment's number behaves accordingly. |
| M8-58 | Issuing an amendment automatically opens a **nonconforming work record**, unless the reason code is explicitly classified as non-technical (for example a customer address correction). | [MUST] | Amend for a calculation error; a nonconformity opens. Amend for an address correction; none opens. |
| M8-59 | **Withdrawal** takes a report out of force entirely without replacing it. It requires the Unit Incharge, a reason code, a nonconformity record, a customer notification record, and a recall record listing every copy issued and its status. The withdrawn report remains retrievable and is watermarked WITHDRAWN. | [MUST] | Withdraw a report; the recall record lists the two hard copies and the e-mail despatch. |
| M8-60 | Customer notification of an amendment or withdrawal is a logged event: who was told, when, by what channel, what was said, and whether the original was recalled and acknowledged. | [MUST] | Notify a customer of a withdrawal; the log records the channel and the acknowledgement. |

**Register, despatch, duplicates and archive**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M8-61 | A **report register** lists every report ever issued in serial order, with: report number, revision, Unique Laboratory Report number where applicable, type, issue date, customer, sample numbers, signatory, current status (Issued / Superseded / Withdrawn — the report lifecycle status, distinct from the series number states of M8-62), and links to the amendment lineage. It is printable and exportable. | [MUST] | Print the register for a month; every issued report appears in serial order with no gaps. |
| M8-62 | The register cross-checks the numbering series and flags any number that is neither Issued nor Cancelled as **Missing**, raising an alert. | [MUST] | Force a gap in a test database; the register flags it and alerts the Unit Incharge. |
| M8-63 | A **despatch register** records, per report and per copy: mode (counter handover, post, courier, e-mail, portal download), date and time, the number of copies, the recipient's name, the courier or postal tracking number, the e-mail address used and the delivery or bounce outcome, and the recipient's acknowledgement where obtained. | [MUST] | Despatch by courier and by e-mail; both rows appear with tracking and delivery outcome. |
| M8-64 | A **duplicate copy** of an issued report may be printed. It renders the identical stored file with an added overlay reading DUPLICATE COPY, increments a duplicate counter, and is logged with who requested it, who authorised it, when and why. | [MUST] | Print a duplicate; the overlay appears, the counter increments and the log records the request. |
| M8-65 | Reprinting is never a silent re-render. Every reprint and every duplicate is logged. | [MUST] | Reprint twice; two log rows exist. |
| M8-66 | The stored file, its checksum, its template version, its signature record, its change manifests and its despatch records are retained under the configured retention policy for issued reports, with **no automatic hard deletion**. Records due for review are flagged and a named person authorises any disposal, which itself creates a permanent record. | [MUST] | Set a short retention in a test system; the report is flagged for review, not deleted. |
| M8-67 | Any issued report can be retrieved by report number, by Unique Laboratory Report number, by sample number, by customer, by date range or by signatory, and can be exported in a human-readable form independent of the application. | [MUST] | Retrieve a report six different ways; all six return the same file. |
| M8-68 | A report cannot be issued while a payment hold is in force, unless the Unit Incharge releases it with a reason. The commercial hold is explicit, logged, and kept separate from the technical release decision so that an unpaid invoice never silently suppresses a technical decision. | [MUST] | Attempt issue under a payment hold; blocked with the hold named, and released only by the Unit Incharge with a reason. |

### M8 field table — Report compile screen

| Field | Type | Mandatory? | Validation | Notes |
|---|---|---|---|---|
| Report number | Text | Auto at issue | From the series; not allocated for drafts | Blank while Draft |
| Revision number | Integer | Auto | Starts at 0 | Increases on replacement |
| Unique Laboratory Report number | Text | Auto at issue | Only where the whole report is in accredited scope | Blank otherwise |
| Report type | Pick-list | Yes | From the M8-01 list | Drives the template |
| Template and version | Lookup | Yes | Active template for that type; version recorded | Frozen on issue |
| Test Request | Lookup | Yes | Must be Accepted | |
| Samples included | Multi-select | Yes | At least one; all must have verified allocations | Drives grouping |
| Allocations included | Multi-select | Yes | Only Verified allocations selectable | Drives partial reports |
| Grouping | Pick-list | Yes | Consolidated per request / One per sample / Split by accreditation scope | Defaults from the request |
| Is partial or interim | Yes / No | Auto | Derived from whether any ordered test remains open | Prints the partial marking |
| Outstanding tests listed | Derived | Auto | — | Printed on a partial report |
| Customer name (frozen) | Derived | Auto | Snapshot at issue | Read-only after issue |
| Customer address (frozen) | Derived | Auto | Snapshot at issue | Read-only after issue |
| Date of sampling | Derived | Auto | From the Sampling Record (M4-35) | Printed only where the laboratory sampled |
| Sampling plan and method reference | Derived | Auto | From the Sampling Record (M4-35) | Printed only where the laboratory sampled |
| Location of testing per line | Derived | Auto | From the allocation | May differ from the laboratory address |
| External provider per line | Derived | Auto | Where subcontracted | Printed and marked |
| Method and version per line | Derived | Auto | Snapshot from the allocation | Read-only |
| Results table | Derived | Auto | Presented values at method precision | Read-only |
| Conformity verdict per parameter | Derived | Auto | From M7 | Read-only |
| Decision rule named | Derived | Auto | Where a conformity statement is made | Read-only |
| Measurement uncertainty | Derived | Auto | Printed per the automatic trigger | Read-only |
| Computed grade and degrading arithmetic | Derived | Auto | Where grading applies | Read-only |
| Environmental conditions | Derived | Auto | From the result records | Printed for physical tests |
| Customer-declared information block | Derived | Auto | Marked as customer-supplied and unverified | With the disclaimer |
| Deviations from method | Derived | Auto | From approved deviation records | Printed if any |
| Coded and free-text observations | Derived | Auto | From result entry | Printed where the method requires narrative |
| Opinions and interpretations | Long text | No | Only if the request asked and the signer is authorised | Own headed block, marked |
| Statements applied | Derived | Auto | By statement code and version | Read-only list |
| Accreditation symbol printed | Derived | Auto | Only if all parameters are in scope and the symbol is valid | Read-only |
| Sample photograph included | Yes / No + selection | No | From the sample's attachments | Inside the signed file |
| Report language | Pick-list | Yes | English / Hindi / Telugu / Bilingual | Per template support |
| Number of hard copies | Integer | Yes | From the request; editable | Drives despatch rows |
| Amends report | Lookup | Conditional | Required for an amendment | Prints the required statement |
| Supersedes report | Lookup | Conditional | Required for a replacement | Prints the required statement |
| Reason for change | Pick-list + note | Conditional | Required for any amendment or replacement | Prints on the document |
| Report state | Derived | Auto | Draft / Pending approval / Approved / Issued / Superseded / Withdrawn | |
| Approving Authority | Lookup | Yes at issue | Must be on the Authorised Signatory register and authorised for every parameter on the report | Scope-checked |
| File checksum | Derived | Auto at issue | Computed on the rendered bytes | Printed in short form |
| Verification token | Derived | Auto at issue | Random, non-guessable | See M9 |

### M8 rules and edge cases

1. **Store the bytes, not the recipe.** Repeated because it is the requirement most often skipped and the most expensive to retro-fit.
2. **The accreditation split is automatic, not a clerk's judgement.** A clerk who forgets to split a mixed report creates a compliance failure. The system must do it.
3. **No asterisks.** A footnote marker distinguishing a non-accredited parameter on an accredited report is explicitly not permitted. Two documents, not one with a footnote.
4. **A superseded report must never return "not found".** A verification lookup for a superseded or withdrawn report must return its status. A missing page invites the claim that the server was down.
5. **Amendment versus replacement.** Choose amendment where a discrete item is being corrected or added; choose replacement where the document as a whole must be re-stated. Both must exist because assessors differ on which is required, and the change manifest satisfies both readings.
6. **A partial report does not close the sample.** The sample remains in testing and the final report references the partial one.
7. **The photograph is inside the signed file.** A photograph attached alongside the file, rather than embedded within it, is not protected by the signature and can be swapped.
8. **The commercial hold is visible, never silent.** Blocking a technical release because Accounts has not been paid, without saying so, is an impartiality risk. Name the hold.
9. **Number allocation only at authorisation.** Allocating a report number when a draft is opened produces gaps that a government audit will question.
10. **Every template version is signed off.** A template is a controlled document. A change to it is a change requiring authorisation, documentation and validation before use, exactly like a change to a calculation.

---

## M9. Public Verification by Code

**What this module is for, in plain words.** A two-dimensional code printed on the report lets anyone holding the paper check that it is genuine. This module specifies exactly what that check reveals. The draft note asked that anyone scanning the code should be able to view the whole report online. That is a genuine and useful instinct, but as written it publishes commercially sensitive trade information to the world, permanently, with no way to take it back. This module keeps the intent — a stranger can confirm the document is real — while protecting the customer's business. It does that by splitting the answer into two levels: a public level that proves authenticity and current status, and a protected level, reached with a one-time password or a login, that shows the actual results.

### What a signed code achieves — in one plain paragraph for the scientist

The laboratory keeps one secret key that nobody else has. When a report is authorised, the software takes a small set of that report's key facts — the report number, the issue date, the sample identity, and a mathematical fingerprint of the whole file — writes them into a very short message, and uses the secret key to produce a **seal** over that message. The message and the seal together are printed as the code on the report. The laboratory publishes the matching **public key** on its website. Anyone can now check the seal using that public key. If even one character of the message has been altered, the seal no longer matches and the check fails. This works **with no internet connection at all**, because the checking arithmetic needs only the public key, which a verification application already holds. The internet is needed for one extra question only — "has this report since been amended or withdrawn?" — because a seal is a statement about the past and can never tell you about the future.

### M9 screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Code generation (internal) | System, at authorisation | Build the signed payload and the token |
| Public verification page | Anyone with the paper | Authenticity and current status |
| Protected result view | Customer, or a person holding the access code | The full result table |
| One-time-password request | Anyone with the printed access code or the customer's mobile | Escalate from public to protected |
| Manual verification form | Anyone | Verify without scanning, by typing the report number |
| File-check tool | Anyone | Upload a copy of the report and compare its fingerprint |
| Public key publication page | Anyone, and verification apps | The published keys with their identifiers |
| Verification audit log | Unit Incharge / Quality Manager | Every verification attempt |
| Token administration | Unit Incharge | Revoke, extend, view access counts |

### M9 requirements

**What is encoded**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M9-01 | The code encodes a **signed payload** using a published, standard compact signature format, with three parts — a header naming the algorithm and the key identifier, the payload, and the signature — so that any competent developer can verify it with standard libraries. | [MUST] | Decode a code with a standard library; the three parts are present and the signature validates. |
| M9-02 | The signing algorithm is an elliptic-curve digital signature algorithm producing a compact signature, chosen so that the whole code fits comfortably in a printed square that an ordinary phone camera can read from paper. | [MUST] | Generate codes for a 1-sample and a 40-sample consolidated report, with the M9-06 headline-result flag off and on, and print each at 33 millimetres square at 300 dots per inch. All four are within the M9-44 byte cap and print at symbol version 14 or lower, and five different phones read each one first time from the printed original. |
| M9-03 | The header carries a **key identifier**, so the laboratory can change its key in future without invalidating years of already-issued reports. A verifier looks up the right public key by that identifier. | [MUST] | Issue reports under two key identifiers; both verify against their respective published keys. |
| M9-04 | The payload carries, and carries only: a payload version; the issuing unit code; the report number and revision; the report issue date; the number of samples the report covers together with the first sample number, and the last where the samples are a contiguous block; the first 16 bytes of the fingerprint of the issued file, rendered base64url; and the issue timestamp. It may additionally carry the two optional fields already required elsewhere — the headline result under the M9-06 configuration flag, and the opaque customer token permitted by M9-05 — and nothing else. The Unique Laboratory Report number, the sample description, the test or standard code and the verification address are **not** carried in the payload: they are printed on the report face, and the online tier returns them per ARC-20. The verification address in particular is already the URL wrapper of M9-07, and M9-37 makes the published address, not the encoded one, the trust anchor. | [MUST] | Decode a payload; exactly these fields are present, and neither the Unique Laboratory Report number nor the verification address appears in it. |
| M9-05 | The payload carries **no personal data**. The customer's identity, if referenced at all, is an opaque short token derived from the customer identifier under a server-side secret, never the name, mobile number, address or tax identifier. | [MUST] | Decode a payload; no customer name, phone number or tax identifier is present in any form. |
| M9-06 | Whether the payload carries the **headline result** (for example the grade letter) is a per-unit configuration flag, defaulting to **off**. It is useful to a buyer at the market with no internet, and it is also instantly visible to anyone who picks up the paper. The choice belongs to the laboratory, not the developer. | [MUST] | Toggle the flag; the payload gains or loses the result field with no software change. |
| M9-07 | The code is encoded as a web address whose signed payload sits in the **fragment** part of the address, after the hash character. A fragment is not sent to the server and does not appear in server or proxy logs. An ordinary camera application opens the page; a purpose-built verification application ignores the address wrapper and verifies the payload directly. | [MUST] | Scan with a plain camera app; the page opens. Inspect the server log; the payload does not appear in it. |
| M9-08 | The web address itself carries **no personal or sensitive data in any query parameter**. | [MUST] | Inspect the address; it contains only the fixed path and the fragment. |
| M9-44 | The complete encoded string — the URL wrapper, the header, the payload and the signature — must not exceed **360 bytes**, so the symbol is QR version 14 or lower at error-correction level M (73 modules). The build fails if any configuration can produce a longer string: the check must be run with the headline-result flag on and off, with the longest configured unit code, and with the largest sample count the bulk registration of M3-15 permits. The symbol prints at not less than **33 millimetres square**, giving at least 0.45 mm per module. | [MUST] | Configure the longest unit code, turn the headline-result flag on, and issue a consolidated report covering 40 samples; the encoded string is within 360 bytes and the symbol is version 14 or lower. Lengthen the payload past the cap in a test build; the build fails naming the offending configuration. |
| M9-45 | The printed symbol should remain machine-readable after one generation of ordinary office photocopying or faxing, because customers and buyers reproduce certificates. | [SHOULD] | Photocopy an issued report once on the unit's own copier; three phones still read the code. |

**Token and non-enumerability**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M9-09 | Every issued report version has a **verification token** of at least 128 bits of cryptographically secure randomness, rendered in a URL-safe, human-transcribable alphabet that omits easily confused characters. | [MUST] | Generate a thousand tokens; none repeats and none is derivable from another. |
| M9-10 | The token is **not derived** from the report number, the sample number, the date, a counter or a hash of any of these. It is random. | [MUST] | Inspect a hundred consecutive reports' tokens; no pattern relates them to the report numbers. |
| M9-11 | A new report version (an amendment or a replacement) receives a **new token**. The old token stays live and reports the superseded status. Tokens are never re-used and never deleted. | [MUST] | Amend a report; the old token reports superseded and the new token reports valid. |
| M9-12 | There is no endpoint that lists reports, and no endpoint that accepts a bare report number as a lookup key without either the signed payload or a challenge such as a short code. | [MUST] | Attempt to enumerate reports by number; no listing endpoint exists and bare-number lookup is challenged. |
| M9-13 | The verification response must not distinguish "this report does not exist" from "this report exists but you may not see it" in a way that lets an attacker map the laboratory's customer base. | [MUST] | Query a non-existent and a restricted report; the responses are indistinguishable in timing and content. |

**What a public, anonymous scan reveals**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M9-14 | An anonymous scan reveals **only** the fields in the table below. | [MUST] | Scan anonymously; exactly these fields appear and no others. |

| Shown to an anonymous scanner | Not shown to an anonymous scanner |
|---|---|
| A single large status banner: **GENUINE — VALID**, **GENUINE — SUPERSEDED**, **GENUINE — WITHDRAWN**, or **NOT GENUINE** | Any measured value or result |
| Issuing laboratory name, unit and full address | Any computed value, statistic or grade |
| Report number and revision | The conformity verdict, pass or fail |
| Unique Laboratory Report number where one exists | The customer's full name |
| Report issue date | The customer's address, district, contact person, mobile, e-mail or tax identifier |
| Sample identifiers and a short sample description | The customer's own lot number, mark or chop |
| Test or standard cited | Any price, invoice or payment information |
| The customer's name **masked** (for example `A***** T******* S**** M****`), or omitted entirely where the customer has requested extra confidentiality | Any other report belonging to the same customer |
| Whether the report was issued within the accredited scope | Any measurement uncertainty, opinion or narrative observation |
| The document fingerprint, shown in short readable form | Any staff member's name other than the signatory's designation |
| A file-check tool: upload your copy and the page compares its fingerprint in your own browser | The photograph of the sample |
| Where superseded: the number of the report that replaces it | The count of reports this customer has ever submitted |
| Where withdrawn: the withdrawal date, and a line stating the report is no longer in force | Any aggregate or historical quality record |
| The count of times this report has been verified | The identity of anyone who previously verified it |
| A clear line stating that results are not shown publicly and how to obtain them | |

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M9-15 | The **headline result** may optionally be shown on the public tier, controlled by the same configuration flag as M9-06, defaulting to off. | [MUST] | Toggle the flag; the public page gains or loses the result line. |
| M9-16 | The status banner must never rely on colour alone. Each status carries an icon and explicit words, so that it is readable by a colour-blind user and legible in a black-and-white printout. | [MUST] | View the page in greyscale; the status is still unambiguous. |
| M9-17 | Four distinct failure states exist, each with plain, non-alarming wording where appropriate: **"Signature verified"**; **"NOT GENUINE — the seal does not match. This document may have been altered."**; **"Unknown issuer key — this verifier may need updating"** (never "not genuine"); and **"This is not a report verification code."** | [MUST] | Produce all four conditions; each shows its own wording. |
| M9-18 | A fifth, distinct state covers the report-substitution attack: **"Signature verified, but the file you uploaded does not match this code."** This is the state that catches a genuine code photographed and pasted onto a forged document. | [MUST] | Upload a modified file against a genuine code; this exact state is shown. |
| M9-19 | Where the device has no internet connection but the verification application can validate the seal locally, the page or application must say so honestly: **"Signature verified offline. Amendment and withdrawal status could not be checked — no internet connection."** It must never imply the report is current when it cannot know. | [MUST] | Verify with the network disabled; the honest wording appears. |

**What requires a one-time password or a login**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M9-20 | The **full result table** is shown only after one of three escalations: (a) entry of a short numeric access code printed on the paper report; (b) a one-time password sent to the customer's registered mobile number; or (c) a login by the customer or by laboratory staff. | [MUST] | View the results only after one escalation succeeds; without one, they are absent from the response body. |
| M9-21 | The printed access code is six digits, unique per report version, printed on the report face, and stored only as a salted hash so that a database read cannot reveal it. | [MUST] | Inspect the stored value; it is a hash, not the code. |
| M9-22 | The access code and the one-time password route are both rate-limited with lockout after a configurable number of failures, and every failure is logged. | [MUST] | Enter five wrong codes; the token locks for the configured period and all five failures are logged. |
| M9-23 | The protected tier reveals: the full customer name and address; the complete result table with units; the conformity verdict and the decision rule; the measurement uncertainty where reported; the observations and narrative; the sample photograph; the amendment lineage; the signatory's name and designation; and a download of the original signed file. | [MUST] | Escalate and view; all listed items are present. |
| M9-24 | A logged-in customer sees their own reports only, and can generate a **share link** for a specific report with a short expiry and an access log, so a buyer or a bank can be given access without the customer handing over their login. | [SHOULD] | Generate a share link; it expires on time and the customer can see who opened it. |
| M9-25 | Laboratory staff verification access follows the normal role permissions and is not treated as an unblinding event. | [MUST] | A verifier opens the page while logged in; no unblinding request is required. |

**Rate limiting, abuse protection and logging**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M9-26 | The verification endpoint is rate-limited per network address and per token, with progressive back-off, and returns a clear "too many requests, please try again shortly" rather than an error. | [MUST] | Exceed the limit; the friendly message appears and the block lifts after the configured interval. |
| M9-27 | An alert fires on **burst verification of many different tokens from one source**, which indicates a scraping attempt or a leaked list of tokens. | [MUST] | Query fifty tokens from one address in a minute; the alert fires. |
| M9-28 | Every verification attempt is written to an audit log with: the token or the report identifier, the timestamp, the outcome, the tier reached, a coarse location derived from the network address, and the user agent. Personal data of the verifier is not collected. | [MUST] | Verify a report; one log row exists with these fields and nothing more. |
| M9-29 | The verification audit log is itself treated as sensitive, because who is checking whose reports is commercially useful information. It is visible only to the Unit Incharge and the Quality Manager, and it is never exposed on the public page beyond the aggregate verification count. | [MUST] | A customer views their report's page; they see the count, not the log. |
| M9-30 | The public page carries no third-party scripts, no external analytics, no fonts fetched from another site and no advertising, so that no external party learns which reports are being verified. | [MUST] | Inspect the page's network requests; every request goes to the laboratory's own address. |
| M9-31 | The page instructs search engines not to index it, and there is no page that lists tokens or reports. | [MUST] | Search for a report number on a public search engine; nothing is found. |

**Offline path, key management and accessibility**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M9-32 | The laboratory publishes its **public keys** at a stable web address in a standard machine-readable format, each with its key identifier and issue date, plus a printable fingerprint sheet that an offline verification application can embed. | [MUST] | Fetch the published keys; the identifier in a report's code resolves to a published key. |
| M9-33 | Separate keys exist for testing and for live operation from the first day, with distinct identifiers. A test key must never sign a live report and a live report must never verify against a test key. | [MUST] | Attempt to verify a live report with the test key; it fails. |
| M9-34 | The private key is never held in the source code repository, never in a configuration file under version control, never in an environment variable dump and never in a plain database backup. On an in-house server it lives in the operating system's protected key store or a hardware security module. | [MUST] | Search the repository and the backups for the key material; it is absent. |
| M9-35 | A written **key compromise procedure** exists in the specification: revoke the key identifier, generate and publish a new one, and — critically — enable the verification page to state that reports signed with the compromised key between two dates require manual confirmation with the laboratory, rather than silently failing thousands of legitimate reports. | [MUST] | Simulate a revocation; affected reports show the manual-confirmation message, not "not genuine". |
| M9-36 | A **manual verification form** exists on the same fixed address, accepting the report number, the issue date and the last four digits of the customer's registered mobile number, for anyone who cannot scan. It is rate-limited and challenged. | [MUST] | Verify a report by typing the three fields; the correct status is returned. |
| M9-37 | The report prints, next to the code, in human-readable text: **"Verify only at ⟨fixed address⟩. Do not rely on any other link."** The laboratory also publishes a short notice on its own website naming that one legitimate verification address. This is what defeats the forged-code attack: the trust anchor becomes the published address, not the ink on the paper. | [MUST] | The instruction appears on every report and the notice exists on the laboratory's site. |
| M9-38 | The verification page meets the accessibility level required for Indian government web pages: semantic structure, correct heading order, visible focus indication, text contrast at the required ratio, real labels on the file-upload and code-entry controls, full keyboard operability, a declared page language, and no meaning conveyed by colour alone. | [MUST] | Run an accessibility check to the required level; no failures at that level. |
| M9-39 | The page renders correctly on a small mobile screen at a slow connection: server-rendered, no large downloads, status banner legible without zooming, and usable in Telugu, Hindi and English with a language selector. | [MUST] | Open the page on a small screen over a throttled connection; the status is readable without zooming. |
| M9-40 | Because the laboratory's internal system must work with no internet, the public verification service is a **separately deployed component** that receives a one-way publication of the minimum data it needs. The internal system never depends on it being reachable. | [MUST] | Disconnect the internal server from the internet; report issue continues normally and the publications queue. |

**The full-public switch, if the laboratory insists**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M9-41 | A configuration switch exists, **defaulting to off**, that makes the full result table visible on an anonymous scan, implementing the draft note's original wording exactly. Turning it on requires the Unit Incharge, records the authorising person, the date and the reason, and displays a standing banner in the administration screen stating that full public disclosure is active. | [MUST] | Turn the switch on; the full results appear anonymously and the authorisation record exists. |
| M9-42 | Even with the full-public switch on, three items remain protected in all cases: the customer's full address and contact details; any price, invoice or payment information; and any other report belonging to the same customer. | [MUST] | With the switch on, confirm these three are still absent. |
| M9-43 | An **opt-out** exists at customer level and at report level. Where the customer has requested extra confidentiality, the public page shows status only, with no sample description and no customer name in any form, regardless of the global switch. | [MUST] | Set the customer flag; the public page shows status only. |

### M9 field table — Public verification page (what the page presents, and the controls it offers)

| Field / control | Type | Mandatory on the page? | Validation | Notes |
|---|---|---|---|---|
| Status banner | Display | Yes | One of the four banners of M9-14 (GENUINE — VALID / GENUINE — SUPERSEDED / GENUINE — WITHDRAWN / NOT GENUINE), plus the distinct signature-check wordings of M9-17, M9-18 and M9-19 | Icon plus words, never colour alone |
| Issuing laboratory name and address | Display | Yes | From the frozen report record | |
| Report number and revision | Display | Yes | — | |
| Unique Laboratory Report number | Display | Conditional | Only where one exists | Absent for non-accredited work |
| Issue date | Display | Yes | — | |
| Sample identifiers | Display | Yes | — | |
| Short sample description | Display | Conditional | Suppressed under the confidentiality opt-out | |
| Test or standard cited | Display | Yes | — | |
| Accredited scope indicator | Display | Yes | — | States plainly whether the report is within the accredited scope |
| Customer name, masked | Display | Conditional | Masked pattern; omitted under the opt-out | Never the full name at the public tier |
| Document fingerprint, short form | Display | Yes | Matches the printed fingerprint | |
| Replacement report number | Display | Conditional | Shown when superseded | |
| Withdrawal date and notice | Display | Conditional | Shown when withdrawn | |
| Verification count | Display | Yes | — | Aggregate only |
| Headline result | Display | Configurable | Off by default | Per M9-06 and M9-15 |
| Language selector | Control | Yes | English / Hindi / Telugu | |
| File-check upload | Control (file) | Yes | Any file; fingerprint computed in the visitor's own browser | The file is never uploaded to the server |
| Access code entry | Control (6 digits) | Yes | Rate-limited; hashed comparison | Escalates to the protected tier |
| Send one-time password to registered mobile | Control | Yes | Rate-limited; the mobile number is never displayed | Escalates to the protected tier |
| Customer login | Control (link) | Yes | — | Escalates to the protected tier |
| Manual verification form link | Control (link) | Yes | — | For those who cannot scan |
| "Verify only at this address" notice | Display | Yes | Fixed text from the Statements master | The anti-forgery anchor |
| Offline-status caveat | Display | Conditional | Shown when the status could not be checked | Honest wording per M9-19 |

### M9 rules and edge cases — and why the draft's wording is a risk

1. **Why the draft's "anyone can view the full test report" is a commercial and privacy risk.** A raw silk grade, a size deviation, a moisture percentage that fixes a commercial settlement weight, or a composition result showing a synthetic fibre in goods sold as pure silk — these decide payments, contracts and reputations within a small, concentrated silk cluster where the traders all know each other. Publishing them to anyone who scans a piece of paper means: a competitor can harvest a rival reeler's quality history; a buyer can see a seller's earlier poor lot; the record is permanent, indexed and cached, so a single bad lot in 2026 remains findable indefinitely; and individual reelers are natural persons, so their name, contact details and test results are personal data whose publication needs a lawful basis and, in practice, their informed consent. It also breaches the laboratory's own confidentiality obligation, which treats all information created during laboratory activities as confidential unless the customer has made it public or agreed otherwise.
2. **The recommendation satisfies the intent.** The draft's real purpose was stated as helping "customers, auditors and authorized users verify the report digitally". Verification is exactly what the public tier does: it proves the document is genuine, unaltered and still in force. Reading the numbers is a separate need, and the person who legitimately needs to read them is holding the paper — so the printed six-digit access code gives them entry, while the internet at large gets authenticity without disclosure.
3. **The switch exists, and it is off.** If the laboratory, having seen the risk in writing, still wants full public disclosure, M9-41 provides it as a deliberate, authorised, recorded decision by the Unit Incharge — not as a default that a developer chose.
4. **A code in a square is not proof by itself.** The obvious forgery is a fake report carrying a code that points at a lookalike page, which then says "verified". The defence is not in the code; it is the printed instruction naming one fixed verification address, plus the published notice, plus the file fingerprint check that catches a genuine code pasted onto a doctored document.
5. **Never return "not found" for a withdrawn report.** Return the withdrawal. A missing page lets a forger claim the server is down.
6. **Do not log the payload.** Because the payload sits in the fragment, it never reaches the server. Any change that moves it into a query parameter would put report metadata into web server logs, proxy logs and browser history, and must be treated as a defect.
7. **Sample labels are not public.** The barcode on a physical sample resolves only for logged-in staff. Only report codes are publicly resolvable. Confusing the two would expose samples in progress.
8. **Get the hosting decision early.** A publicly reachable page carrying government-issued certificates will attract requirements for the domain, the hosting environment, an independent security audit and accessibility conformance. Treat the public component as its own deliverable with its own approval gate, so that it cannot delay the internal laboratory system.

---

## M10. Weight and Conditioning Certificate

**What this module is for, in plain words.** Raw silk absorbs moisture from the air, and it is sold by weight. Its weight therefore changes with the humidity of the day, which means neither the buyer nor the seller will accept the other's weighing. A conditioning house solves this by determining the silk's oven-dry weight and then adding back a fixed, agreed allowance for moisture, producing a **conditioned weight** — sometimes called the correct invoice weight — that is independent of the weather. That number settles money between two traders. This module produces the certificate that carries it. It is a **weight and settlement document**, not a quality document, and it must not be forced into the same table, the same layout, the same numbering series or the same approval path as a test report. The unit's very name — Silk Conditioning and Testing House — comes from this function.

### An honest note on priority

The research found that neither the published rate card nor the unit's online catalogue currently lists a charge for conditioning or for a conditioned-mass certificate, and the unit's reported annual test mix does not mention it. The function may therefore be largely dormant at present and performed only on request, for example for an export consignment or a dispute. **Build the module, because the arithmetic is exact, the document is a recognised trade instrument and the unit's name rests on it — but do not assume high volume, and do not let it delay the routine testing workflow.**

> **OPEN-Q9:** Does RSTRS Dharmavaram still issue conditioned-mass or weight certificates? Roughly how many per year, and under which rate head are they billed? — *Recommended default:* build the module as specified, mark it inactive in the go-live configuration, and activate it when the answer confirms it is used. Ask for a scan of one real conditioned-mass certificate.

### M10 screens and functions

| Screen / function | Who uses it | Purpose |
|---|---|---|
| Conditioning lot registration | Front Desk / Sample Receipt Clerk | The lot, its bales and the packing details |
| Bale weighing sheet | Tester | Gross weight per bale, on a recorded balance |
| Tare build-up sheet | Tester | Itemised packing weights, computed not guessed |
| Skein draw and set allocation | Tester | Six skeins in two sets of three, traceable to their books |
| Oven drying register | Tester | The dry-to-constant-mass loop, weighing by weighing |
| Moisture computation panel | System | Per-set moisture, agreement check, average |
| Conditioned weight computation | System | Oven-dry mass and the regain allowance applied |
| Certificate compile and preview | Report Writer | The certificate layout, watermarked while draft |
| Certificate authorisation and issue | Approving Authority | Sign and issue |
| Weight certificate register | Unit Incharge / auditor | Its own serial register |
| Amendment and withdrawal | Unit Incharge | Same discipline as M8, own numbering |

### M10 requirements

**Structure and identity of the document**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M10-01 | The Weight (Conditioned Mass) Certificate is a **distinct document type** with its own template, its own numbering series, its own register and its own approval path. It is not a variant of the test report. | [MUST] | Issue one of each; two separate registers and two separate number series exist. |
| M10-02 | The document's data shape is mass-based: kilograms, gross, tare, net, oven-dry and conditioned weight, plus a moisture percentage. It shares no fields with the quality-grade data shape. | [MUST] | Inspect the stored records; the weight certificate has its own tables and no grade columns. |
| M10-03 | A separate **Record and Report of Preliminary Examination** document type exists for the accept-or-reject examination that precedes grading, with its own template and number series. Its content is the receipt examination captured in M4. | [MUST] | Issue a preliminary examination report; it carries its own number and the M4 checklist content. |
| M10-04 | The three raw-silk document types — Preliminary Examination, Conditioned Mass, and Grading Certificate — are each separately numbered, separately templated and separately retrievable. They are never merged into one document. | [MUST] | Issue all three for one lot; three documents with three numbers exist and each is retrievable independently. |
| M10-05 | A conditioning record is registered against a **lot**, which contains a stated number of **bales** (or cartons), each containing a stated number of **books**. The certificate is issued per lot, with the bale-wise arithmetic shown. The bales of the lot, their serial numbers and the number of books in each are defaulted from the sample's sub-sample rows created at registration under M3-03, and are not blind-entered here. Where the weighing-time count differs from the registered count, the difference is recorded with a reason, raises a nonconformity, and blocks the certificate until the Unit Incharge resolves it, consistent with the override discipline in M10-06. | [MUST] | Register a lot of four bales of twenty-five, twenty-five, twenty-two and twenty-eight books; the certificate shows four bale rows, each with its own book count, and a lot total of one hundred books. |

**Weighing and tare**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M10-06 | The **gross mass of each bale** is recorded in kilograms on a platform balance, with the balance's equipment identifier captured, and the system records whether that balance's calibration was valid at the moment of weighing. Weighing on an out-of-calibration balance is blocked, with an override restricted to the Unit Incharge that opens a nonconformity. | [MUST] | Weigh on a lapsed balance; blocked with the expiry date shown. |
| M10-07 | The balance's capacity and least count are held on the equipment record and are printed on the certificate, because the standard prescribes the apparatus. The platform balance for bale weighing, the skein balance for skein weighing, and the in-oven balance are three distinct instruments, each separately recorded per weighing. The standard's **minimum** apparatus specification is held against the conditioning method version as a required-range attribute — platform balance of at least 100 kg capacity with least count 0.1 kg; skein balance of 1 kg capacity with least count 0.1 g; in-oven balance reading to 0.1 g — and the system warns at selection time where an instrument chosen for conditioning work falls short of it. The actual capacity and least count of each instrument stay on the per-instrument equipment record (M11-03), never in method configuration. | [MUST] | The certificate names all three instruments with their identifiers and least counts. Select a skein balance whose least count is 1 g; a warning names the standard's 0.1 g minimum alongside the instrument's own least count. |
| M10-08 | **Tare is itemised and computed, never weighed as one lump.** The system captures the individual packing components, computes the tare per book from the sampled books, scales it to **that bale's own book count**, adds any bale-level components, and shows every line of the arithmetic. Bales in one lot may contain different numbers of books, and the tare is computed independently for each bale. The customer will audit this. | [MUST] | Enter shirt 0.900 kg, papers and labels of 5 sampled books 0.250 kg, aggregate mass of the middle bands of those 5 books 0.300 kg, 3 bands per book, 5 books sampled, 25 books in the bale; the system computes tare of the sampled books 1.150 kg, tare of one book 0.230 kg, tare of all books 5.750 kg and total tare 6.650 kg, and a hand calculation matches every line. Then register a two-bale lot with 25 and 22 books and identical packing-component masses; the two bales show different values for tare line 6 and for total tare. |
| M10-09 | The tare build-up follows the standard's structure, with each line captured and displayed: the mass of the outer wrapper (the 'shirt'); the mass of the wrapping papers and labels of a stated sample of books; the mass of the middle cotton bands of that same sample of books multiplied by the number of bands per book; the tare of that sample of books; the tare of one book, obtained by division; the tare of all the books in the bale, obtained by multiplication; and the total tare of the bale. Each line is a stored value, not a derived display. The arithmetic is held as named stored values so the multiplier chain cannot be misread: tare_sampled_books = mass_papers_labels_sampled_books + (mass_bands_sampled_books x bands_per_book); tare_one_book = tare_sampled_books / books_sampled; tare_all_books = tare_one_book x books_in_this_bale; total_tare_bale = tare_all_books + shirt_mass + sum(other bale-level components) + excess_lacing_mass; net_mass_bale = gross_mass_bale - total_tare_bale. The divisor books_sampled is applied once, at tare line 5, and applies to tare lines 2 and 3 together. | [MUST] | Print the tare section; all seven lines appear with their values. |
| M10-10 | The **skein lacings are exempt from tare** provided they do not exceed the length per skein that the standard permits. The system records whether the lacings were within that limit, and where they were not, the excess is included in the tare with a note. | [MUST] | Record over-length lacings; they are added to the tare and a note prints. |
| M10-11 | The **net mass of the bale** is computed as gross mass minus total tare, and is displayed and stored, never typed. | [MUST] | Change a tare component; the net mass recomputes. |
| M10-12 | All materials used in packing count as tare, with the lacing exemption above. The certificate carries the sentence stating this rule so the customer can see the basis. | [MUST] | The rule statement appears on the certificate. |

**Moisture determination**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M10-13 | Skeins for moisture determination are drawn per the standard's rule: a stated number of skeins, one skein per book, with the books distributed equally across the bales of the lot, each skein taken from a different part of its book, and the draw divided into **two independent sets**. The system records which book and which bale each skein came from. | [MUST] | Draw six skeins into two sets of three; each skein's source book and bale are recorded. |
| M10-14 | Skeins are drawn **at the same time as the bale net mass is determined**, weighed immediately, and their masses recorded **separately** per set. The system records the draw time and the weighing time and warns where the gap between the skein draw and that bale's weighing exceeds `skein_draw_gap_warn_minutes`, seeded at **120 minutes**. That figure is a local operating assumption with no basis in the standard, which says only "at the same time"; it is configuration with an effective date and is confirmed under OPEN-Q11. | [MUST] | Record a draw two hours after the bale weighing; a warning appears and is stored. |
| M10-15 | After drawing, the books are **replaced in their bales**, and the system records that this was done. | [MUST] | The replacement confirmation is captured before drawing can proceed. |
| M10-16 | The **oven drying register** captures, per set, the mass before drying and then every successive weighing in the dry-to-constant-mass loop, with the elapsed drying time for each weighing, and the computed loss between successive weighings. | [MUST] | Enter four successive weighings; all four are stored with their times and losses. |
| M10-17 | The dry-to-constant-mass rule is implemented as **configuration, not code**: an initial drying period, then a shorter period, and a convergence threshold expressed as a percentage of the previous weighing, with continued weighings at the shorter interval until the loss between successive weighings falls at or below the threshold. The oven temperature is likewise configuration with an effective date. The system evaluates the rule and tells the tester whether another drying interval is required. Seeded from the governing standard, each value held with an effective date and marked unconfirmed until checked against a real worksheet: oven temperature **140 °C**; first drying period **15 minutes**, then successive periods of **5 minutes**; convergence threshold **0.25 percent of the previous weighing**. The conditioned-size determination of Part 6 uses a **10-minute** first period — hold it as a second configuration row keyed to that method version, never as a branch in code. The full seed set is listed in the seeded method parameters table below. | [MUST] | Enter a loss above the threshold; the system requires another drying interval and refuses to accept the mass as final. |
| M10-18 | The oven temperature used is recorded per drying run, together with the oven's equipment identifier and its calibration status, and is printed on the certificate. | [MUST] | The certificate states the drying temperature and the oven identifier. |
| M10-19 | The moisture content percentage is computed **separately for each set** from that set's pre-drying and oven-dry masses, and both values are displayed and printed. | [MUST] | Two set moisture values print, not one. |
| M10-20 | The system applies the **set agreement rule**: where the two sets' moisture results differ by more than the configured tolerance, the test must be repeated. The system blocks the certificate, states the difference and the tolerance, and creates the repeat. The tolerance is seeded at **0.5 percent**, the figure the governing standard prescribes ("if the two results vary by more than 0.5 percent, the test shall be repeated"), held as configuration with an effective date. | [MUST] | Enter two set results differing beyond the tolerance; the certificate is blocked and a repeat is created. |
| M10-21 | Where the sets agree, the **average moisture content** is computed and used in the conditioned weight calculation. Both set values and the average print on the certificate. | [MUST] | The certificate shows both set values and the average. |

#### M10 seeded method parameters

Seeded method parameters for IS 15090 (Part 3), held per method version under M14-06, effective date 01-Apr-2026, every row marked **unconfirmed** pending OPEN-Q11. None of these values may appear in program code.

| Parameter | Seeded value | Basis and notes |
|---|---|---|
| Oven temperature | 140 °C | The standard's apparatus clause. The standard prescribes no tolerance, so none is seeded — do not write "± 2", which belongs to the standard atmosphere of M4-16, not to the oven. The oven's own control tolerance comes from its calibration certificate. |
| First drying period | 15 minutes | The standard's dry-to-constant-mass procedure (M10-17). |
| Subsequent drying period | 5 minutes, repeating | The standard's dry-to-constant-mass procedure (M10-17). |
| Convergence threshold | 0.25 percent of the previous weighing | The loop ends when the loss between successive weighings is at or below this figure (M10-17). |
| Set agreement tolerance | 0.5 percent | The standard's wording is "if the two results vary by more than 0.5 percent, the test shall be repeated". Applied as the absolute difference between the two sets' moisture percentages (M10-20). |
| Skein lacing tare exemption | 1 metre per skein | The length per skein the standard exempts from tare (M10-10). |
| Tare sample | 5 books, with 3 middle cotton bands per book | The sample of books the standard's proforma weighs for the tare build-up (M10-09). |
| Skein draw gap warning | 120 minutes | A **local operating assumption with no basis in the standard**, which says only "at the same time". Seeded so that M10-14 agrees with its own acceptance check. Confirm or correct it under OPEN-Q11. |
| Method designation and edition | IS 15090 (Part 3):2002 | Seeded on the conditioning method version in the Method master (M1-36). M10-29's bracketed attribution line and M10-30's method identification are both rendered from it; the edition printed is the one in force at the date of test. |

Notes on this table. The drying periods are held **per method version**, because the conditioned-size determination of IS 15090 (Part 6) uses a **10-minute** first drying period — a single global drying period would be wrong for Part 6. The regain rate is seeded in M10-23 and the six-skein, two-set-of-three draw in M10-13; they are cross-referenced here, not restated, so there is one source of truth for each. The standard's minimum apparatus specification is held as a required-range attribute on the method version per M10-07, not as a row here, because the actual capacity and least count of each instrument belong to the equipment record.

**The conditioned weight calculation**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M10-22 | The **oven-dry mass of the bale** is computed from the net mass and the average moisture content, and is displayed with its formula. | [MUST] | Change the moisture value; the oven-dry mass recomputes and the formula is visible. |
| M10-23 | The **conditioned (commercial invoice) weight** is computed by adding the official regain allowance to the oven-dry mass. The regain rate is held as **configuration with an effective date**, seeded at **eleven percent of the oven-dry mass**, which is the rate the governing Indian standard prescribes for raw silk and which international trade practice uses. It is never a number in program code. | [MUST] | Change the configured regain rate in a test system; the computed conditioned weight changes with no software change, and a previously issued certificate is unaffected. |
| M10-24 | The certificate prints the regain rate applied, in words and figures, together with the definition of conditioned mass, so that the basis of the number is on the face of the document. | [MUST] | The rate and its definition appear on the certificate. |
| M10-25 | The calculation is shown as a visible chain on the certificate: gross mass, total tare, net mass, average moisture percentage, oven-dry mass, regain rate, conditioned weight — per bale and totalled for the lot. Every intermediate value is stored. | [MUST] | Print the certificate; the seven-step chain appears per bale and as a lot total. |
| M10-26 | Rounding follows the configured rule for mass, with the platform balance's least count respected, and the certificate states the precision used. | [MUST] | A mass computed to five decimal places prints at the configured precision. |
| M10-27 | The calculation has a stored set of **test vectors** taken from historical manual conditioning worksheets, which the system re-runs automatically on every software release. This is the validation evidence for the calculation. | [MUST] | Run the vectors; every historical certificate's conditioned weight reproduces exactly, including rounding. |
| M10-28 | Where the customer has declared a weight, the system compares the computed conditioned weight with the declaration and displays the difference in kilograms and as a percentage. The declared weight prints as customer-supplied and unverified. | [MUST] | Enter a declared weight; the difference is computed and both figures print. |

> **OPEN-Q10:** Is the conditioning charge levied per bale, per kilogram, per lot or per certificate? The research found no per-kilogram charge anywhere in the published rate card, so a per-kilogram basis would be a local or legacy practice. — *Recommended default:* configure the charge as **per bale** with a per-certificate minimum, because the work scales with the number of bales weighed and skeins dried; make the unit of charge a rate-card field per M1-30 so any of the four bases can be selected without a software change.

> **OPEN-Q11:** Are the drawn skein count, the two-set split, the oven temperature, the drying periods, the convergence threshold and the set agreement tolerance the same at Dharmavaram as in the governing standard, or does local practice differ? — *Recommended default:* seed the values listed in the M10 seeded method parameters table (six skeins in two sets of three; oven 140 °C; 15 minutes then successive 5-minute periods; convergence 0.25 percent of the previous weighing; set agreement tolerance 0.5 percent), mark every row unconfirmed, and have the scientist confirm or correct each one against a real Dharmavaram conditioning worksheet — the same worksheet and the scanned certificate that OPEN-Q9 asks for — before go-live. Confirm in the same pass the skein-draw gap warning of 120 minutes in M10-14, which is a local assumption with no basis in the standard. Every one of these values is configuration with an effective date, so a correction is a data edit.

**Certificate layout, signature and numbering**

| ID | Requirement | Priority | Acceptance check |
|---|---|---|---|
| M10-29 | The certificate layout follows the standard's proforma structure, in this order: the issuing conditioning house's name and address as the letterhead; the title **Record and Report of Conditioned Mass of Raw Silk**; a bracketed method attribution line rendering the proforma's own wording, **[Conducted in accordance with IS 15090 (Part 3) Raw silk — Grading and methods of tests: Part 3 Determination of conditioned mass]** — the proforma carries no year inside the bracket — with the designation and edition supplied from the method version per M10-30 and never written into the template as literal text; the lot identification block (mark of the lot, serial numbers of the bales in the lot, number of bales, the total number of books in the lot, chop where supplied); **Section I — calculation of average moisture content**, with the six numbered lines and the computed average; **Section II — calculation of the conditioned weight**, with the itemised tare build-up and the gross, net, oven-dry and conditioned masses, each bale row stating that bale's own book count alongside its tare build-up; the apparatus block naming the balances and the oven with their identifiers and least counts; the remarks block; the date; and the signature block. | [MUST] | Print the certificate; every block appears in this order. |
| M10-30 | The certificate carries the same universal elements as a test report where they apply: the laboratory's name and address, the location where the work was performed, a unique identification on every page, "Page n of m", the end-of-report marker, the customer's frozen name and address, the method identification with its version, the sample description and identification, the date of receipt, the dates on which the work was performed, the date of issue, the results with units, any deviation from the method, the identity of the authorising person, the statement that the results relate only to the items submitted, the statement that the certificate shall not be reproduced except in full, and the customer-declaration disclaimer where a weight was declared. | [MUST] | Run the mandatory content check on a weight certificate; all listed elements are present. |
| M10-31 | The certificate carries the verification code and the document fingerprint on the same terms as a test report, and is verifiable through M9. Its public tier shows the conditioned weight only if the headline-result configuration flag is on; the default is off, and this default matters more here than anywhere else, because the conditioned weight **is** the commercial settlement figure. | [MUST] | Verify a weight certificate publicly; the weight is not shown by default. |
| M10-32 | The certificate is signed by an Approving Authority whose authorisation scope covers conditioning work. Where the laboratory's practice requires the tester's signature on the record in addition to the authorising signature — as the standard's proforma provides — the template carries **two signature blocks**: "Signature of Tester" and the Approving Authority. Each is separately authorisation-checked. | [MUST] | Issue a certificate; both signature blocks are populated and each was separately checked. |
| M10-33 | The certificate's numbering series is separate from the test report series, with its own prefix, its own financial-year reset and its own gap-free register. | [MUST] | Issue a weight certificate and a test report on the same day; their numbers come from different series. |
| M10-34 | Where the laboratory is accredited for this work, the Unique Laboratory Report number and the accreditation symbol apply on the same terms and with the same hard blocks as M8-27 to M8-35. Where it is not, neither prints. | [MUST] | With the unit configured as non-accredited, no symbol and no such number print. |
| M10-35 | The issued certificate is frozen and stored as bytes with its checksum, exactly as in M8-43, for exactly the reasons in M8-44 — and with greater force here, because two traders settle money on this document and may produce it years later in a dispute. | [MUST] | Reprint a certificate after a template change; the output is byte-identical to the original. |
| M10-36 | Amendment and withdrawal follow the M8 discipline in full: an amendment or a replacement, a mandatory reason from the pick-list, a change manifest, the lineage, the superseded watermark, the automatic nonconformity, the customer notification and the recall record. The certificate's own numbering series is used. | [MUST] | Amend a weight certificate; every M8 amendment behaviour applies within this series. |
| M10-37 | A weight certificate register exists, separate from the report register, listing every certificate in serial order with its status and lineage, and flagging any Missing number. | [MUST] | Print the register; every certificate appears in serial order with no unexplained gaps. |

### M10 field table — Conditioning Certificate entry screen

*Lot header*

| Field | Type | Mandatory? | Validation | Notes |
|---|---|---|---|---|
| Conditioning Certificate number | Text | Auto | From the gap-free `DVM/CM/<FY>/<4>` series (Part B §8.4) | |
| Test Request | Lookup | Yes | Must be Accepted | |
| Sample number (the lot) | Lookup | Yes | Sample type must be a raw-silk lot or bale type | |
| Mark of the lot | Text, up to 100 | Yes | Not blank | Prints on the certificate |
| Chop | Text, up to 100 | No | — | The producer's trade mark |
| Number of bales in the lot | Integer | Yes | One or more | Drives the bale rows |
| Bale serial numbers | Grid of text | Yes | One row per bale; each distinct | Prints on the certificate |
| Total books in the lot | Derived | Auto | Sum of the per-bale book counts | Prints on the certificate as the lot total |
| Manner of packing | Text | Yes | Not blank | From the receipt examination |
| Skein formation | Text | Yes | Not blank | Single or double skein |
| Circumference of the skeins | Decimal + unit | No | — | Recorded where measured |
| Reeling device | Pick-list | Yes | From M3-07 | |
| Declared weight by customer | Decimal (18,6) kg | No | Zero or more | Prints as customer-declared |
| Bales sorted by colour into groups | Yes / No | Yes | Default No | Where Yes, the skein draw is proportional to the books in each group |
| Colour group detail | Grid | Conditional | Required if sorted | Group, number of books, skeins drawn |

*Per bale — weighing and tare*

| Field | Type | Mandatory? | Validation | Notes |
|---|---|---|---|---|
| Bale serial number | Derived | Auto | — | |
| Gross mass | Decimal (18,3) kg | Yes | Greater than zero | On the platform balance |
| Platform balance identifier | Lookup | Yes | In Service; calibration valid at the weighing time | Blocked otherwise |
| Weighing date and time | Date-time | Yes | Not in the future | Compared with the skein draw time |
| Number of books in this bale | Integer | Yes | One or more; defaulted from the bale's sub-sample row and editable only with a reason | The multiplier for tare line 6; may differ from bale to bale |
| Mass of the outer wrapper ('shirt') | Decimal (18,3) kg | Yes | Zero or more | Tare line 1 |
| Mass of wrapping papers and labels of the sampled books | Decimal (18,3) kg | Yes | Zero or more | Tare line 2 |
| Number of books sampled for tare | Integer | Yes | One or more; the same book sample must underlie tare lines 2 and 3 | The divisor, applied once at tare line 5 |
| Mass of the middle cotton bands of the sampled books | Decimal (18,3) kg | Yes | Zero or more | Tare line 3 input: one band weighed from each of the sampled books and weighed together as one aggregate, not a single band. Must be the same books as tare line 2. |
| Number of bands per book | Integer | Yes | One or more | Tare line 3 multiplier |
| Tare of the sampled books | Derived | Auto | — | Tare line 4 |
| Tare of one book | Derived | Auto | — | Tare line 5 |
| Tare of all books in the bale | Derived | Auto | — | Tare line 6 |
| Other bale-level packing components | Grid: description + mass | No | Zero or more each | Added to the total |
| Lacings within the permitted length | Yes / No | Yes | Default Yes | If No, the excess is added with a note |
| Excess lacing mass | Decimal (18,3) kg | Conditional | Required if lacings exceed the limit | |
| Total tare of the bale | Derived | Auto | — | Tare line 7 |
| Net mass of the bale | Derived | Auto | Gross minus total tare; must be positive | Never typed |

*Skein draw and moisture*

| Field | Type | Mandatory? | Validation | Notes |
|---|---|---|---|---|
| Number of skeins drawn | Integer | Yes | Matches the configured draw rule | Seeded at the standard's count |
| Set number (per skein) | Pick-list | Yes per skein | Set 1 or Set 2 | Two independent sets |
| Source bale and source book (per skein) | Lookup | Yes per skein | Must be a book of a bale in this lot; distribution checked | Warns if not distributed across bales |
| Draw date and time | Date-time | Yes | Compared with the bale weighing time | Warns on a material gap |
| Books replaced in their bales | Yes / No | Yes | Must be Yes to proceed | Recorded confirmation |
| Mass before drying, per set | Decimal (18,4) g | Yes per set | Greater than zero | On the skein balance |
| Skein balance identifier | Lookup | Yes | In Service; calibration valid | Blocked otherwise |
| Oven identifier | Lookup | Yes | In Service; calibration valid | Printed on the certificate |
| Drying temperature | Decimal (5,1) °C | Yes | Warns outside the configured value and tolerance | Configuration-seeded |
| Drying weighings, per set | Grid: elapsed minutes + mass | Yes | At least two weighings; convergence rule evaluated | The dry-to-constant-mass loop |
| Loss between successive weighings | Derived | Auto | Against the configured threshold | System states whether to continue drying |
| Oven-dry mass, per set | Derived | Auto | Accepted only when the convergence rule is satisfied | |
| Moisture content, per set | Derived | Auto | — | Both values print |
| Difference between the two sets | Derived | Auto | Against the configured tolerance | Blocks and creates a repeat if exceeded |
| Average moisture content | Derived | Auto | Only where the sets agree | Used in the calculation |
| Oven-dry mass of the bale | Derived | Auto | From net mass and average moisture | Formula shown |
| Regain rate applied | Derived | Auto | From configuration, with its effective date | Printed in words and figures |
| Conditioned (commercial invoice) weight, per bale | Derived | Auto | From oven-dry mass and the regain rate | Formula shown |
| Conditioned weight, lot total | Derived | Auto | Sum across bales | The settlement figure |
| Difference from the declared weight | Derived | Auto | In kilograms and percent | Printed where a weight was declared |
| Remarks | Long text | No | — | Prints on the certificate |
| Tester signature | Signature record | Yes | Authorisation-checked | First signature block |

### M10 rules and edge cases

1. **The two meanings of "conditioning" must never share a field, a screen or a label.** Pre-conditioning a specimen for a physical test (M4) and determining a commercial conditioned mass (this module) are different concepts with different data. The interface must always qualify the word.
2. **This is a settlement document.** Money moves on the number it carries. Every consequence follows from that: the arithmetic must be shown line by line so the customer can audit it; the instruments must be named with their least counts; the file must be stored as bytes; the amendment discipline must be strict; and the conditioned weight must not appear on a public verification page by default.
3. **Tare is computed, not weighed.** A single "tare" figure typed by a tester cannot be audited and will be disputed. The seven-line build-up exists precisely because the customer will check it.
4. **Everything numeric in the method is configuration with an effective date.** The regain rate, the oven temperature, the drawn skein count, the set split, the convergence threshold and the set agreement tolerance. All of them. A change to any is a data edit with a version history, and a certificate issued earlier is unaffected.
5. **The set agreement rule is a hard block, not a warning.** Where the two sets disagree beyond the tolerance, the standard requires a repeat. Averaging two disagreeing results and issuing a certificate would be a defect with financial consequences.
6. **Bales sorted by colour change the draw.** Where a consignment is sorted into colour groups, the skeins drawn from each group must be proportional to the number of books in that group. The system must enforce the proportion, not leave it to memory.
7. **Do not merge this with grading.** A lot may receive a preliminary examination report, a conditioned mass certificate and a grading certificate — three documents, three number series, three data shapes, possibly three different signature requirements. Merging them into one "test report" table is the modelling error this module exists to prevent.
8. **Historical worksheets are the acceptance test.** Before go-live, take twenty completed manual conditioning worksheets with their hand-computed conditioned weights and require the software to reproduce every one exactly, including rounding. Keep them as an automated regression suite. This is both the validation evidence and the cheapest insurance available against a systematic arithmetic error propagating into signed settlement documents.