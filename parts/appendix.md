## Appendix A — The original discussion note, as written

This is the ten-point note that started the project, reproduced without change so that this document is self-contained and the two can be compared side by side. Every point in it is carried forward; see *Your ten points, and where each one now lives* in the Executive Summary.

> Key Discussion Points
>
> 1. Customer Creation
>
> The process will start with the creation and maintenance of customer details in CloudZoo ERP. Customer master details will be used for invoice generation and report reference.
>
> 2. Invoice Creation with Multiple Tests
>
> An invoice can be created for a customer, and each invoice may contain multiple tests. The tests will be selected based on the samples received and the testing requirements.
>
> 3. Sample-Based Job Creation
>
> For each sample received, the system should automatically create a separate job.
>
> Example:If 5 samples are received, the system should generate 5 individual jobs.
>
> Each job will be uniquely identified by a Job Number, and the testing process will be tracked sample-wise.
>
> 4. Job Assignment to Testing Team
>
> The created jobs should be assigned to the respective testing team members.
>
> A key requirement discussed was that the assigned team member should not be able to view customer details. The tester should only see the Job Number, sample details, assigned test, and required test parameters. This will help maintain confidentiality and avoid unnecessary exposure of customer information.
>
> 5. Test Log Entry by Tester
>
> The assigned tester will conduct the test and update the test log entry in the system. The test log will include the test observations, results, remarks, sample image if required, and other required testing details.
>
> 6. Test Log Approval
>
> Once the test log is entered by the tester, it should go through an approval process. The authorized person will verify and approve the test log before final report generation.
>
> 7. Test Report Generation
>
> After approval, the system should generate the final test report.
>
> 8. QR Code-Based Online Report Access
>
> Each generated test report should have a QR Code. Anyone scanning the QR code should be able to view the test report online. This will help customers, auditors, and authorized users verify the report digitally.
>
> 9. Internal Lab Equipment Calibration Management
>
> Apart from the testing workflow, it was discussed that the system should also maintain internal lab equipment details as an asset system.
>
> 10. Internal Stock Maintenance for Testing
>
> The system should also maintain the internal stock items used for testing purposes.
>
> Proposed CloudZoo ERP Workflow
>
> Customer Creation→ Invoice Creation with Multiple Tests→ Sample Received Entry→ Auto Job Creation for Each Sample→ Job Assignment to Testing Team→ Tester Log Entry→ Test Log Approval→ Test Report Generation with Sample Image→ QR Code-Based Online Report View
>
> Additional modules discussed:
>
> Lab Equipment / Asset Calibration Management
>
> Internal Testing Stock Maintenance
>

<<<PAGEBREAK>>>

## Appendix B — Open question register

Every question in the document that only the laboratory can answer, in one place. Each has a recommended default, so work is never blocked waiting for an answer — but a default that goes unchallenged becomes a decision by accident, so please read them. The identifier letter shows which part raises the question.


### Part A — Purpose, People and Scope

| ID | Question | Recommended default, or the answer where one is now known |
|---|---|---|
| **OPEN-Q-A1** | Which paper registers exist today, exactly what columns does each have, and which of them must the software replace versus continue to exist on paper alongside it? — | assume a sample-intake register, a report-issue register, a fee-receipt register, an equipment calibration folder and a consumable stock register; the software replaces the first three and mirrors the last two; nothing is switched off until the scientist confirms in writing that the printed equivalent from the software is acceptable to internal audit. |
| **OPEN-Q-A2** | What software and spreadsheets are in use today, and in particular what is the "inbuilt denier software" on the test-room PCs — can it export a file, and if so in what format? — | assume it cannot export, and that the LIMS must re-implement the size and deviation statistics itself; treat any export capability as a bonus that removes typing rather than as a dependency. |
| **OPEN-Q-A3** | How many staff will use the system at once, how many computers exist in the unit, is there a local network, and what is the internet and power situation? — | assume three to six concurrent users, two to four computers, a wired local network to be installed if absent, unreliable internet and frequent power interruptions; therefore assume the system must run on a single server inside the laboratory and must keep working with the internet down. |
| **OPEN-Q-A4** | What is the exact current format of the monthly and annual return sent to CSTRI/CSB headquarters? — | obtain a copy of the last twelve months' returns as the very first requirement-gathering artefact; the software must produce that exact format without manual Excel work, because the return is the one report the unit is judged on, and a system that cannot produce it will be bypassed. |
| **OPEN-Q-A5** | Is the intended scope (a) the internal laboratory workflow only, with the national CSB portal continuing as an outside booking channel, (b) a replacement for the portal at Dharmavaram, or (c) both, with an integration between them? — | (a). Build the internal LIMS, and give every order an `order_source` field with values such as WALK_IN, POST, COURIER, CSB_PORTAL, EMAIL, INTER_UNIT, so that a portal integration can be added later without changing the data structure. |
| **OPEN-Q-A6** | Which named people at the unit hold which roles today, and specifically who other than the Unit Incharge may approve a result or sign a certificate? For each such person, which test disciplines are they authorised for? And is each of the Section Head, Verifier, Report Writer and Technical Manager roles above a separate post held by a separate person, or are they all held by the Unit Incharge himself — that is, is this one office or several? — | configure the Unit Incharge as the only signatory at go-live, with one named alternate for periods of tour or leave, and add others only against a written competence record. Obtain the unit's declared-signatory list if the lab holds accreditation. Assume the Unit Incharge also holds the Section Head, Technical Manager and Report Writer roles, and that the Verifier is a different person wherever staffing allows (Part B §7.2 step 16); where staffing does not allow it, the overlap is permitted and recorded by the … |
| **OPEN-Q-A7** | Where the same person must both perform and approve a test (very likely in a three-person unit), does the lab want the system to (a) block it, (b) permit it and record the overlap on the allocation, or (c) permit it only with a second person's countersignature? — | (a), with a recorded, dated exception — not (b). The system enforces segregation by default: performer ≠ checker, checker ≠ authoriser, and at minimum performer ≠ authoriser (M13-10, WF-12, WF-76, M7-04). Work is never blocked outright, but the permission is always someone's named, dated decision rather than a silent allowance — by the Approving Authority's justified per-action override (M13-10), by single-analyst mode configured per section (WF-12), or by the Unit Incharge's small-laboratory exception for a named … |
| **OPEN-Q-A8** | Does any assessor or auditor require a login of their own, rather than escorted read-only access on a staff member's session — and if so, does internal audit, a NABL assessor or CAG audit ask for the read-only property to be enforced below the application rather than in the interface? — | no separate Auditor or CSB HQ login in phase 1. Serve an assessor under escort with the M20-37 audit-trail extract, the M21-13 printable permission matrix and the NFR-120 export, and serve headquarters with the transmitted returns and snapshots. If an assessor or auditor asks in writing for their own login, add it as a named, time-boxed, read-and-print-only role in a later phase, together with the confidentiality undertaking; do not promise an enforcement level below the application until the lab has asked for it. |

### Part B — How the Laboratory Will Work

| ID | Question | Recommended default, or the answer where one is now known |
|---|---|---|
| **OPEN-Q-B1** | Does the unit currently require payment before testing, before report release, or neither, and does the answer differ by customer class (for example advance from traders, none from government departments)? — | payment required before **report release**, not before testing, with the order-type value on for Commercial and off for Internal R&D, Inter-unit referral and Statutory / scheme, and per-customer-category overrides seeded to *Not required* for Government Department, CSB Internal Unit and CSB Internal R&D so that a government department placing a Commercial order is not held. |
| **OPEN-Q-B2** | With three or four technical staff, is a verifier who is different from the tester achievable for every test, or only for some? — | enforce tester ≠ verifier as the rule, permit a recorded override, and review the override count monthly. State the position honestly in the quality manual rather than claiming a separation that cannot be kept. |
| **OPEN-Q-B3** | Should one report be allowed to cover several samples (for example one certificate for a 20-bale conditioning lot), or is it strictly one report per sample? — | allow one report to cover many samples of the same order, controlled by a per-report-type setting, because the conditioning and grading customers expect a single certificate. |
| **OPEN-Q-B4** | Is the Tatkal same-day scheme (double charge, maximum 5 samples, booked before 11:00, only tests completable within 6 hours) actually used at Dharmavaram? — | build the priority flag and the eligibility rules, leave the scheme disabled in configuration until the unit confirms. |
| **OPEN-Q-B5** | For each sample type, what counts as **one sample**? Specifically: for conditioning, is one bale one sample with the lot as a grouping, or is the lot one sample with per-bale readings? For a multi-cone twisted-silk submission, is each cone a sample? — | the **grading or settlement unit** is the Sample, and the physical bales, books, cones or skeins inside it are Sub-samples. For conditioning that means the **lot** is the sample and each bale contributes readings. Confirm per sample type before any code is written; this decision cannot be changed later without re-registering history. |
| **OPEN-Q-B6** | Does the unit still issue conditioned-mass / weight certificates, how many a year, and under which rate head are they billed? — | build the Conditioning Certificate as a report type with its own number series and its own tare build-up form, but schedule it after the high-volume Limited Test path, and do not assume volume. |
| **OPEN-Q-B7** | What retention period applies to each sample type, and what is the default disposition — return to customer, retain then dispose, or dispose immediately? — | raw silk and twisted silk retained 3 months then disposed; cocoons disposed immediately after test (perishable); fabric and zari retained 6 months; water and chemical samples disposed after test. Confirm against the unit's quality manual and against any scheme-specific requirement before go-live. |
| **OPEN-Q-B8** | Which abort and rejection reasons are chargeable to the customer, and which are not? — | material-related causes (insufficient quantity, sample not conforming to declaration, sample unusable as submitted) are chargeable at a handling fee if the sample was already registered; laboratory-caused failures are not chargeable. A waiver above a configured amount requires the Unit Incharge's recorded approval. |
| **OPEN-Q-B9** | Is the daily cut-off time for starting the turnaround clock the same as the Tatkal 11:00 booking cut-off, or different? — | two separate configured times — a turnaround cut-off (suggest 16:00) and the Tatkal booking cut-off (11:00). |
| **OPEN-Q-B10** | Does the unit maintain **separate registers and separate number series for Physical Testing and Chemical Testing** — the monthly revenue sheets count PTS, PTA, CTS and CTA separately — and if so what do those four abbreviations stand for? — | build the sample series with an optional division component (`PT` / `CT`) that is switched off until confirmed, because retro-fitting a division into an existing number series is not possible. Ask the unit before the first sample is registered. |
| **OPEN-Q-B11** | Are there **existing legacy number series** in the paper registers that must be continued rather than restarted — for report numbers, money receipts and conditioning certificates in particular? What is the last number used in each? — | continue every existing series from its last used number, recorded under WF-112, and start no series at 1 without written confirmation. |
| **OPEN-Q-B12** — **ANSWERED** | *Question was:* is the unit itself NABL-accredited, and if so what is its accreditation certificate number and format? **Answer, confirmed against the certificate itself:** yes. The unit holds accreditation in its own right, separate from the Bengaluru laboratory. The certificate reads: legal entity **Central Silk Board**; accredited facility **Textile Testing Laboratory, Regional Silk Technological Research Station, Central Silk Technological Research Institute**, at **D. No. 25-650, Parthasaradhi Nagar, … | *see body text* |
| **OPEN-Q-B12a** — **ANSWERED** | which tests are inside the accredited scope? The scope annexure to certificate `NABLT0726AD18713` has been obtained and lists **exactly seven accredited entries**, all in the discipline and group *MECHANICAL — TEXTILE MATERIALS* and all under *Permanent Testing*: Fabric / Length / IS 1954; Fabric / Mass / IS 1964; Fabric / Number of Threads Per Unit Length / IS 1963; Fabric / Percentage by Weight of Warp and Weft Yarn / IS 17208; Fabric / Width / IS 1954; **Raw Silk Yarn / Count / IS 15090 (Part 5)**; Woven Fabric … | *see body text* |
| **OPEN-Q-B13** | Which unit code should be used in every number — `DVM`, or a code already used in CSTRI correspondence? — | `DVM`, with the code held in configuration so a CSTRI-wide standard can be adopted later without changing program code. |
| **OPEN-Q-B14** | Under which GST registration does the unit raise invoices, and what is the registered address printed on them? This decides whether an Andhra Pradesh customer is an intra-State or an inter-State supply, and therefore the tax split on every invoice. — | do not guess. Obtain a copy of a recent real invoice from the unit before the invoice module is built, and hold the registration as configuration with its State code, so the tax split is computed rather than ticked by a clerk. |

### Part C — The Testing Modules (M1–M10)

| ID | Question | Recommended default, or the answer where one is now known |
|---|---|---|
| **OPEN-Q-C1** | Which GSTIN does RSTRS Dharmavaram raise invoices under — the Karnataka registration held by CSTRI, or a separate Andhra Pradesh registration? Every invoice's tax split depends on this. — | build the tax registration as a configurable master with one row per registration and **seed no registration row**. Do not pre-populate the parent institute's Karnataka registration: the research pack records it as unverified and expressly warns against assuming which registration the unit bills under, and a Karnataka state code on an Andhra Pradesh unit would set the intra-State versus inter-State computation wrongly on every local invoice. Obtain the registration in writing, with a copy of a recent real invoice … |
| **OPEN-Q-C2** | What is the correct GST treatment of each test — taxable at the standard rate under the technical testing and analysis classification, or exempt for cocoon-related work that may qualify as a service in respect of agricultural produce? — | set every test to "taxable forward" at the rate the finance wing confirms, and give the Accounts role the ability to mark specific tests exempt with a notification reference. Obtain a written opinion from CSB's tax adviser before go-live. |
| **OPEN-Q-C3** | Is CSB inside the electronic-invoicing (Invoice Reference Number) mandate, or has an exemption declaration been filed? — | build the invoice with every field an Invoice Registration Portal submission needs, and add nullable columns for the reference number, acknowledgement number, acknowledgement date and signed payload. Leave the integration switched off until the answer is in writing. |
| **OPEN-Q-C4** | What are the existing legacy number formats at Dharmavaram, and must the new system continue any of them (for example continuing the sample serial rather than restarting at one)? — | configure each series with an opening counter value set to the legacy series' last used number, so continuity is preserved. Ask for the last used number of every register on the day before go-live. |
| **OPEN-Q-C5** | Which grouping does Dharmavaram use today — one certificate per lot, or one covering many lots? Obtain scans of three real issued reports before freezing the default. — | build all three options, default to Option A, and set the actual default from the scanned examples. |
| **OPEN-Q-C6** — **ANSWERED** | RSTRS Dharmavaram **is** accredited in its own right. Certificate **NABLT0726AD18713**, ISO/IEC 17025:2017, field Testing, issued 17/07/2026 and valid until 16/07/2030, in the name of the Central Silk Board for the Textile Testing Laboratory, Regional Silk Technological Research Station, at Regetipalli Road, Dharmavaram. The unit is therefore configured as **accredited**: the accreditation symbol and the Unique Laboratory Report number are switched on, the ULR is built by the 26-character format (a) described in … | *see body text* |
| **OPEN-Q-C7** | Does the accreditation body require one verification code on the report or two (one to the report, one to the accreditation certificate and scope)? The research could not confirm the two-code requirement from an official source. — | design the template with **two code positions**, populate only the report-verification code, and leave the second position empty until the requirement is confirmed. |
| **OPEN-Q-C8** | Must certificates issued by this unit be bilingual in Hindi and English under the official language requirements applying to central government offices? — | build the template engine to support a second language column from the start, generate English only at go-live, and add Hindi when the administrative wing confirms the requirement. Retro-fitting bilingual layout is expensive; retro-fitting the content is not. |
| **OPEN-Q-C9** | Does RSTRS Dharmavaram still issue conditioned-mass or weight certificates? Roughly how many per year, and under which rate head are they billed? — | build the module as specified, mark it inactive in the go-live configuration, and activate it when the answer confirms it is used. Ask for a scan of one real conditioned-mass certificate. |
| **OPEN-Q-C10** | Is the conditioning charge levied per bale, per kilogram, per lot or per certificate? The research found no per-kilogram charge anywhere in the published rate card, so a per-kilogram basis would be a local or legacy practice. — | configure the charge as **per bale** with a per-certificate minimum, because the work scales with the number of bales weighed and skeins dried; make the unit of charge a rate-card field per M1-30 so any of the four bases can be selected without a software change. |
| **OPEN-Q-C11** | Are the drawn skein count, the two-set split, the oven temperature, the drying periods, the convergence threshold and the set agreement tolerance the same at Dharmavaram as in the governing standard, or does local practice differ? — | seed the values listed in the M10 seeded method parameters table (six skeins in two sets of three; oven 140 °C; 15 minutes then successive 5-minute periods; convergence 0.25 percent of the previous weighing; set agreement tolerance 0.5 percent), mark every row unconfirmed, and have the scientist confirm or correct each one against a real Dharmavaram conditioning worksheet — the same worksheet and the scanned certificate that OPEN-Q-C9 asks for — before go-live. Confirm in the same pass the skein-draw gap warning … |
| **OPEN-Q-C12** | Confirm against a real ISA grading worksheet (i) the permitted neatness value set under the ISA method, and (ii) whether the rounding convention recorded in the research — 100 to 50 percent to the nearest 5 percent, below 50 percent to the nearest 10 percent — applies to the individual panel assessment or only to the reported average and low neatness. — | seed the BIS eight-value list for the BIS method revision, and hold the ISA neatness value list as **unconfirmed** rather than assuming it matches BIS. Do not seed a specific ISA value list until the worksheet is seen, and keep the rounding rule where it already lives, on the method revision (M1-36). |
| **OPEN-Q-C13** | Do Dharmavaram's grade tables match the seeded IS 15090 reference data above — the three size category boundaries, the major and auxiliary sets, the Category III promotion of maximum deviation, and the 33-denier cohesion cut-off? — | seed exactly the values in the table above, mark every row unconfirmed, and have the scientist confirm or correct each one against a real grading worksheet and the unit's own grade tables before go-live. Do not compute a grade in a live system while any row is still unconfirmed. |
| **OPEN-Q-C14** — **ANSWERED** | Does the *Limited Test* fall inside scope row 6 (*Raw Silk Yarn / Count / IS 15090 (Part 5)*)? **No.** The Unit In-Charge has confirmed it directly — "limited test will be non nabl" — and has supplied a status list, *RSTRS DMM Proposed testing charges*, marking the Limited Test and seventeen other catalogue items **Non-NABL**. He also confirmed that where accredited and non-accredited work meet, a **separate report** is required, which is exactly the split of M8-32. The | in the earlier draft of this document (treating *Count* as inside scope) was therefore **wrong**, and is withdrawn. The seeded status list is §M8.6 below. |
| **OPEN-Q-C15** | The status list supplied by the unit is numbered 3 to 30 with gaps — serial numbers **1, 2, 16, 17 and 22 to 26 are absent**, and no fabric test appears anywhere on it, although five of the seven accredited scope entries are fabric parameters. What are the missing items, and are any of them the accredited ones? — | assume the missing serial numbers correspond to the fabric and count parameters named in the scope annexure, and treat them as accredited **only** once the unit confirms both the item name and the annexure row it maps to. Until then every catalogue item is Non-NABL, which is the safe direction. |
| **OPEN-Q-C16** | Does the unit actually offer, and charge for, the seven accredited parameters — fabric length, mass, threads per unit length, warp and weft percentage by weight, width, raw silk yarn count, and linear density of yarn removed from fabric? None of them appears on the proposed charge list. If they are not offered, the accreditation covers work the unit does not sell, and the accredited template will never be used. — | build the accredited path as specified but schedule its acceptance demonstration only once the unit confirms at least one accredited item is on the price list. Ask the Quality Manager whether these parameters are newly added, planned, or performed for another CSB unit. |
| **OPEN-Q-C17** | The file supplied is titled *Proposed testing charges* but contains only test names and their accreditation status — **no charges**. What are the current rates for each item, and are the "proposed" rates a revision awaiting approval or already in force? — | seed the rate card from the published CSTRI schedule effective 01.12.2023 (Limited test ₹50, Denier test bobbin ₹30, Denier test skein ₹40, Raw silk testing & Grading BIS ₹400, ISA ₹1,100 or ₹2,000 by origin) and mark every rate **unconfirmed**, with an effective date, so a revision supersedes rather than overwrites it. |

### Part D — The Supporting Modules (M11–M22)

| ID | Question | Recommended default, or the answer where one is now known |
|---|---|---|
| **OPEN-Q-D1** | Which instruments at Dharmavaram are calibrated externally, by which agencies, and are those agencies accredited for the specific parameter and range? — | build the register with all three traceability tiers available and no assumption about the current position; ask the Unit In-Charge for the last three calibration certificates for the balance, the oven and the tensile tester, and load them as the first records. |
| **OPEN-Q-D2** | Does the laboratory currently perform daily or weekly intermediate checks on the balances and the oven, and if so against what standard and what acceptance criterion? — | configure a daily single-point balance check against a certified standard weight with an acceptance criterion of the balance's least count × 2, and an oven temperature check per working day; make the frequency and criterion configuration, not code, so the laboratory can change them without a developer. |
| **OPEN-Q-D3** | Does the parent institute's asset register need to be fed from this system, or does it already exist independently in CloudZoo ERP or on paper? — | hold the asset fields in the LIMS as the working copy, export to CloudZoo ERP (M22), and treat CloudZoo ERP as the system of record for capitalised cost and depreciation once the integration is live. |
| **OPEN-Q-D4** | Which chemicals and reference materials does the laboratory actually consume, and does it hold any certified reference material at present? — | build for the general case; load the register initially with the reagents used for degumming loss, scouring loss and fibre identification, plus the standard photograph sets, grey scales and standard weights, and leave certified reference material support unused until needed. |
| **OPEN-Q-D5** | Does the laboratory prepare working solutions in-house, and does it standardise them? — | build the Prepared Solution Register (M12-23) as specified; if the laboratory does not prepare solutions, the register simply stays empty and costs nothing. |
| **OPEN-Q-D6** | Does CloudZoo ERP already hold a consumables inventory, and if so does it support lot and expiry tracking? — | keep the lot, expiry, certificate and fitness-for-use in the LIMS; send only quantity and value movements to CloudZoo ERP; do not attempt to store expiry in the ERP. |
| **OPEN-Q-D7** | Who at Dharmavaram is currently authorised to sign test reports, for which test areas, and is there a written declaration to the accreditation body or to CSTRI headquarters recording this? — | build the Authorised Signatory Register as specified; load it initially with the Unit In-Charge for all test areas performed at the unit, and record "declaration reference: to be obtained" until the document is produced. |
| **OPEN-Q-D8** — **ANSWERED** | The unit **is** accredited in its own right, on certificate **NABLT0726AD18713** (ISO/IEC 17025:2017, field Testing, issued 17/07/2026, valid until 16/07/2030, legal entity Central Silk Board). The accreditation-related fields — declared signatory reference, the notification task for changes the accreditation body must be told about, and the scope lines — are therefore **live and required**, not optional. The per-unit switch that prints the accreditation symbol is defaulted **ON**, governed at all times by the … | *see body text* |
| **OPEN-Q-D9** | How often does the laboratory intend to reassess competence? — | 24 months for routine methods, 12 months for methods involving subjective visual judgement (evenness, cleanness, neatness, colour fastness rating), configurable per method. |
| **OPEN-Q-D10** | What is the complete list of tests the unit performs, with the exact standard designation, edition, parameters, number of readings, formulas, rounding and turnaround? — | this is the single largest data-loading task of the project and it must be treated as a scheduled deliverable with the scientist, not discovered during build. Begin with the Limited Test (which the research indicates is roughly 98 % of the unit's volume), then twist test, denier of twisted silk, water analysis, and grading under the Indian Standard and the International Silk Association method. |
| **OPEN-Q-D11** | Does the unit already operate a documented quality system with numbered procedures and formats? — | build the Document Register and Format Register as specified; if there is an existing numbering convention, adopt it exactly rather than inventing a new one, and load the existing document list before go-live. |
| **OPEN-Q-D12** | For the Limited Test, is there an existing computer program on the test personal computers that computes denier and size deviation, and can it export its readings? — | assume no export; specify manual reading entry with the statistics computed by this system; keep a file-import path as [LATER] so an export can be used if one is found. |
| **OPEN-Q-D13** | Does the unit currently participate in any proficiency testing or inter-laboratory comparison, run by CSTRI or otherwise? — | build the register and the two-year plan; assume participation is through CSTRI-organised inter-laboratory comparison until told otherwise. |
| **OPEN-Q-D14** | What retained or control material could serve as the internal quality control sample for the Limited Test, and does one exist? — | propose a retained, well-characterised skein lot re-tested weekly, with the centre line and limits established from twenty initial runs; this is a decision for the scientist and must not be assumed. |
| **OPEN-Q-D15** | Is the testing area at Dharmavaram air-conditioned and humidity-controlled, and what instrument measures the conditions? — | assume a monitored, not controlled, room with a wall-mounted thermometer and hygrometer; configure manual readings twice per working day; set the default limits to the Indian standard atmosphere but expect frequent excursions and design the excursion workflow to be quick to complete rather than punitive. |
| **OPEN-Q-D16** | Does the laboratory pre-condition specimens today, and for how long, for each test? — | record the requirement per method version from the standard (24 hours for the physical tests where the standard requires equilibrium conditioning) and let the actual practice be recorded honestly against it; where practice differs, treat it as a method deviation under M14-16 rather than adjusting the method silently. |
| **OPEN-Q-D17** | Where does testing-fee money physically go today — into a bank account of the parent statutory body, or into the government account through a paying-and-accounts office? Which routes are actually in use at Dharmavaram: cash, demand draft, the government non-tax receipt portal, a bank collection product, the national testing portal's gateway? — | build all routes as described, none as the assumed default; ask the unit's accounts staff and record the answer as a configuration setting. This is the single question with the widest effect on this module. |
| **OPEN-Q-D18** | Under which tax registration number does RSTRS Dharmavaram raise invoices, and what registered address is printed on it? The research found a registration for the parent institute in one state, and the unit is in another; it could not confirm a registration in the unit's own state. — | hold the registration as configuration with the state code driving the tax split; obtain a copy of a recent real invoice from the unit before any invoice template is finalised. **Do not guess.** Everything about the tax split depends on this. |
| **OPEN-Q-D19** | Is laboratory testing by this statutory body taxable, and at what rate? The research found the published rate card states that tax is charged in addition, at prevailing rates, and deliberately does not fix a percentage. Secondary sources are consistent on one rate but not unanimous, and one source conflicts. — | hold the rate in a dated tax master, set it from the figure the parent institute's accounts wing confirms in writing, and print nothing until that confirmation exists. **This document deliberately does not state a rate as fact.** |
| **OPEN-Q-D20** | Are any tests exempt — in particular cocoon-related tests, where the material may be treated as agricultural produce? — | treat every test as taxable at the confirmed rate; provide the exempt option per rate card line with a mandatory reason and notification reference so that a tax adviser's opinion can be applied as data, not code. |
| **OPEN-Q-D21** | Is the parent body within the electronic-invoicing requirement, or has it filed an exemption declaration? The research notes that the exemption is written for a "government department" while the tax authority's own position is that a statutory body is not "Government", which leaves a real risk that electronic invoicing applies. If it applies and is not done, the customer may be denied input tax credit — a commercial problem for a laboratory whose customers are traders and exporters. — | build the invoice electronic-invoicing-ready per M17-40 and obtain a written answer from the parent body's tax adviser before go-live. |
| **OPEN-Q-D22** | Retired. The question of whether payment is required before testing or before report release, and whether the answer differs by class of customer, is asked once in Part B as **OPEN-Q-B1**, whose | now covers both the order-type half and the customer-category half. It is not asked again here; the rule itself is `payment_release_rule` in WF-5, applied by M17-42. |
| **OPEN-Q-D23** | Should this project build a local customer portal at all, given that the parent institute already operates a national testing portal and mobile application listing this unit? — | build the internal laboratory system first and treat the national portal as an inbound order source; hold the local portal as a later phase, with the reference-tracking and report-download functions as the first parts to build if it is wanted. |
| **OPEN-Q-D24** | Will a public-facing web surface be permitted, and on which domain and hosting, and does it require a security audit and a website-quality certification before it goes live? — | assume yes, assume a security audit by an empanelled auditor is required, and treat the portal and the public report-verification page as a separate deliverable with their own approval gate so they cannot delay the internal system. |
| **OPEN-Q-D25** | What short message service provider will be used, what will the sender identity be, and is registration of the sender identity and of every message template with the telecom regulator's distributed-ledger platform required before messages can be sent? — | assume that a registered sender identity and pre-registered message templates are required for transactional messages in India, that registration takes time and involves a cost per message, and that a small monthly volume estimate should be prepared from the expected sample volume; build the template mechanism so that a registered template identifier can be stored against each template. |
| **OPEN-Q-D26** | Who pays for the short message service, and is there an existing parent-institute arrangement (the national testing portal and mobile application already send messages) that this unit can use? — | ask CSTRI whether the national portal's messaging account can be extended to the unit; if not, budget a small prepaid volume and keep email plus the printed counter acknowledgement as the guaranteed channels, with short message service as an enhancement rather than a dependency. |
| **OPEN-Q-D27** | Does the unit have an official email account it can send from, and will an outgoing mail server be available on the unit's network? — | assume a single official mailbox on the parent body's domain, configured as an outbound relay; hold the credentials as configuration; if no relay is available, hold all customer email in the queue and rely on short message service and paper until one is provided. |
| **OPEN-Q-D28** | What is the exact current format of the monthly and annual return submitted to CSTRI and the Board — a scanned copy or spreadsheet of the last three submissions? — | treat this as a blocking item for the design of the sample and test records, because the return's breakdowns determine which fields must be captured at receipt; do not begin building until at least one real submitted return has been seen. |
| **OPEN-Q-D29** | Are there other periodic returns — quarterly progress, scheme-linked reports, results framework targets? — | build the return builder generically so a new return format is a configured report rather than a program change. |
| **OPEN-Q-D30** | What record-retention rules apply to this unit under the parent body's own regulations and government audit requirements? — | adopt the table above unchanged — issued reports ten years from date of issue, technical records ten years from date of test. No universal figure exists: the accreditation standard fixes none and leaves the period to laboratory policy, and the only figure the research verified is a three-year minimum that applies solely to certain regulatory schemes, which government audit requirements typically exceed. Confirm against CSTRI's and the Board's own record rules and the government audit requirement before any … |
| **OPEN-Q-D31** | Who will be the named Grievance Officer for personal-data matters, and what response time will the unit publish? — | the Unit In-Charge, with a published response time of 30 days against an outer legal limit the research places at 90 days, and an internal target of 7 days. |
| **OPEN-Q-D32** | Does the relaxation available for processing by the State apply to this unit's commercial testing, and does the parent body intend to rely on it? — | do not rely on it; build to the full obligation, which is achievable at modest cost if built from the start, and record the decision so it can be revisited if the parent body obtains a written opinion. |
| **OPEN-Q-D33** | Where will the system be hosted — a server inside the laboratory, the parent body's own facility, the national informatics provider, or an empanelled cloud service? The research notes that government workloads must be hosted within India and, where cloud is procured, from an empanelled provider whose specific service is empanelled. — | a single server inside the laboratory as the primary deployment, with encrypted off-site backup; treat any cloud move as a change requiring the parent body's information-technology approval, and keep the software portable so the move is a deployment exercise rather than a rebuild. |
| **OPEN-Q-D34** | Will the public report-verification page and the customer portal require a security audit by an empanelled auditor and a website-quality certification before going live, and on which domain will they sit? — | assume yes to the security audit; keep the public surface deliberately small so that conformance and audit are cheap; treat it as a separate deliverable with its own approval gate. |
| **OPEN-Q-D35** | What is CloudZoo ERP's integration surface — a documented web interface, direct database access, file import and export, or nothing? What authentication does it use? — | assume a web interface is available and design the outbox against it; if only file exchange is possible, M22-15 applies and the same controls are retained. **This is the first question to answer before any integration code is written.** |
| **OPEN-Q-D36** | Which system will master the tax invoice number series, and does CloudZoo ERP's existing series already satisfy the consecutive, sixteen-character, financial-year-unique rule? — | let CloudZoo ERP master the invoice number if its series is already compliant, because the accounting document belongs there; if it is not compliant, the LIMS masters the number and the ERP records it as supplied. Decide once. Never split. |
| **OPEN-Q-D37** | Can CloudZoo ERP hold custom fields or an external reference against customer, item, invoice and asset records? — | assume not, and maintain the mapping inside the LIMS with the reconciliation report as the control. |
| **OPEN-Q-D38** | Is the LIMS to be a module inside CloudZoo ERP, or a separate application with an integration? — | a separate application, because the offline requirement, the immutable audit trail, the frozen report files and the enforcement gates are all easier to guarantee in software the laboratory controls; and because it keeps the LIMS alive if the ERP is ever replaced. |
| **OPEN-Q-D39** | Does CloudZoo ERP already hold a consumables inventory and a fixed-asset register for this unit, with any data in them? — | assume both exist but are unused for laboratory items; load the LIMS registers first and push to the ERP once the ownership table is agreed with whoever maintains the ERP. |
| **OPEN-Q-D40** | Who maintains CloudZoo ERP, and will they commit to a stable interface and to notifying this project before an upgrade? — | obtain a named contact and a written note of the interface version in use before integration work starts; without that, build the LIMS to run with the integration switched off (M22-17) and treat the integration as a later phase. |

### Part E — Build, Test and Roll Out (technical)

| ID | Question | Recommended default, or the answer where one is now known |
|---|---|---|
| **OPEN-Q-T1** | Are the assumed volumes in §23.0 correct — samples per year, peak day, tests per sample, readings per test, users? Is there an existing monthly figure reported to headquarters we can size against? | Proceed with §23.0 and re-measure after three months live. |
| **OPEN-Q-T2** | How many invoices, receipts and challans does the unit raise per month, and how many samples does a typical invoice cover? | One invoice may cover up to 50 samples; size for 500 invoices a month. |
| **OPEN-Q-T3** | Will the public verification page sit on a Government domain, and is STQC website certification plus a CERT-In empanelled auditor's "safe to host" certificate required before it goes live? | Assume "safe to host" is required; build to the Government website guidelines from day one; **do not let this block the internal system going live.** |
| **OPEN-Q-T4** | What printers exist today (make, model, laser, inkjet or dot-matrix)? Is there pre-printed letterhead stationery? Are any multi-part carbon forms in use? | Budget one new monochrome laser printer and one thermal label printer. Support plain-paper letterhead in Phase 1; add pre-printed alignment in Phase 2. Assume no dot-matrix. |
| **OPEN-Q-T5** | Must a test report or tax invoice from this unit be bilingual in Hindi and English under the Official Languages Act, section 3(3)? | Build the bilingual capability into the template engine; issue English-only in Phase 1. |
| **OPEN-Q-T6** | What retention periods does the quality manual set for technical records, issued reports, calibration certificates and retained samples, and what do Central Silk Board's departmental record rules require? | The retention periods set out in the table at M21.12; no periods are restated here. No automatic deletion, and a review-and-authorise step for every disposal. NFR-118's seven years is a floor for keeping records online and searchable, not a retention period. See also OPEN-Q-D30. |
| **OPEN-Q-T7** | Does the laboratory layer have to be built **inside** CloudZoo ERP — sharing its database, login and deployment — or is it a separate application that exchanges data with it? And what are CloudZoo's language, framework, database version, and integration surface (application programming interface, or database only)? | Assume a **separate application** integrating by a documented interface, with CloudZoo as the system of record for customer identity, tax registration, invoices, receipts and assets, and the laboratory system as the system of record for everything technical. |
| **OPEN-Q-T8** | Which fields does CloudZoo own and which does the laboratory system own? Specifically: customer master, tax registration, invoice, receipt, tax codes, asset register, consumable item master. | CloudZoo owns customer identity, invoice, receipt, tax and asset value. The laboratory system owns customer category, blinding token, rate application, calibration status, lot fitness-for-use, and everything else. |
| **OPEN-Q-T9** | Is the deployment to be **on-premise at the unit**, cloud, or the recommended hybrid? Is National Informatics Centre or National Informatics Centre Services hosting available to Central Silk Board units? Is there a departmental policy either way? | Hybrid: local server in the laboratory plus a small internet-facing verification service. Build so a later move to an empanelled cloud is a configuration change. |
| **OPEN-Q-T10** | What is the site reality: how many computers, what specification, is there a wired local network, what is the internet connection and how often does it fail, is there an uninterruptible power supply, and how many power cuts per week? | Assume 4 computers of the reference low specification, a wired network to be installed, an unreliable broadband line, no existing uninterruptible power supply, and 5 power cuts a week. |
| **OPEN-Q-T11** | Which paper registers must this system replace, which must survive on paper, and what historical data must be migrated? | Replace the sample register, test register, report register, calibration register and stock register. Migrate 12 months of report index plus all open samples. Keep the bound money-receipt book on paper until Phase 2. |
| **OPEN-Q-T12** | What is the exact format of the monthly return sent to CSTRI headquarters, and the annual return? Can we have last month's actual submitted copy? | Build from whatever copy is obtained in Phase 0. Do not defer this to a later phase. |
| **OPEN-Q-T13** | Who owns the source code, the database and the documentation, and is this in writing before the first payment? | Central Silk Board owns code, data and documentation; the repository is handed over before final payment; the developer retains no exclusivity. **Settle in writing before work starts.** |
| **OPEN-Q-T14** | Is the unit's laboratory conditioning and testing area monitored for temperature and humidity by a data logger, or by a manual hygrometer read at intervals? | Manual entry twice daily in Phase 1; file import in Phase 6. Record the source of every environment reading. |
| **OPEN-Q-T15** | What starting numbers should the live document series use, so they do not collide with the existing manual series? | Start each series at the next number after the highest already used in the current financial year, recorded and signed on cut-over day. |
| **OPEN-Q-T16** | Who will be the named owner of master data — the test catalogue, methods, parameters, specification tables and rate cards — after go-live? | The Unit Incharge personally, with one trained deputy. Name them in the go-live checklist. |
| **OPEN-Q-T17** | Where does the money physically go — a Central Silk Board bank account, or the Government Account through a Pay and Accounts Office? Which routes are live: cash, demand draft, the non-tax receipt portal, a bank collection product, the national testing portal's gateway? | Build the payment model polymorphically (§1.6 of the research brief) so **all** routes can be recorded without a schema change, and switch on only the routes the unit confirms. |
| **OPEN-Q-T18** | Is there a current approved rate card later than 01.12.2023, and is the section for the RSTRS and STSC units still the applicable one? | Load the 01.12.2023 card as it stands, plus the 15.11.2019 card as a superseded version so old invoices reprint correctly. |
| **OPEN-Q-T19** | Is the express ("Tatkal") double-charge scheme actually used at Dharmavaram, with its same-day, five-sample, 11:00 cut-off and six-hour-test eligibility rules? | Build the priority multiplier and the cut-off rule as configuration, default the scheme to disabled, and enable it if confirmed. |
| **OPEN-Q-T20** | Which non-testing chargeable items apply at this unit — machine rent per year, warping charges per warp, cocoon stifling per thousand, test dyeing, training fees? | Support the charge bases in `mst_test.charge_basis` (per sample, per point, per physical unit, per year, per consignment value band) from Phase 2, and load whichever the unit confirms. |
| **OPEN-Q-T21** | Is a same-day acknowledgement slip and a same-day money receipt required at the counter, and in what format? | Print a serially numbered acknowledgement slip in Phase 1 and a money receipt in Phase 2, both modelled on the existing paper forms collected in Phase 0. |
| **OPEN-Q-T22** | Should Telugu be offered in the staff interface as well as on customer-facing surfaces? | Customer-facing surfaces in Telugu (NFR-90); staff interface in English only. |
| **OPEN-Q-T23** | Should the headline result — for example the grade — be printed inside the QR code payload, so a buyer can see it without internet, or withheld because a poor grade would then be instantly readable by anyone holding the paper? | Make it a per-unit setting, **default off**, and ask. |
| **OPEN-Q-T24** | Should the customer's masked name appear on the public verification page, or be omitted entirely? | Show a masked form (first and last letters only). Offer an opt-out for any customer who asks for status-only. |
| **OPEN-Q-T25** | Is a second factor of authentication (a code by SMS or an authenticator application) acceptable to the staff for authorising roles, given that a mobile signal in the laboratory may be weak? | Use an authenticator application, which works without a signal, rather than SMS, for authorising roles. |
| **OPEN-Q-T26** | Who provides support after handover, on what response times, and what happens if the developer is unavailable for a month? | A written support arrangement with response times, plus two trained administrators inside the unit (PLN-26) and a documented restore procedure a non-developer has actually performed (NFR-100). |
| **OPEN-Q-T27** | Is a customer self-service portal wanted, and will Central Silk Board permit customer accounts on a unit-level system given that a national portal already exists? | Treat the national portal as an **inbound order source** (`order_source`) rather than replacing it, and build only a light status-and-download portal in Phase 5. |
| **OPEN-Q-T28** | Is the system likely to be rolled out to other Central Silk Board testing units? | Build the multi-unit columns and scoping now; assume single-unit deployment; re-review architecture if roll-out is proposed. |
| **OPEN-Q-T29** | Which instruments produce a digital output today (a serial line, a file on a computer, a printout), and can the existing denier-measurement software on the test computers export its data? | Assume manual entry with a mandatory attached instrument printout in Phase 1; investigate export in Phase 6. Do not attempt instrument interfacing earlier. |
| **OPEN-Q-T30** | Does this unit issue the conditioned-mass (conditioning) certificate of M10 itself, how many lots and bales a month, does it go out under the same report series and signatory rules as a test report, and where are the conditioning method's numeric constants written down? | Build it in Phase 1 as §26.3 assumes, sharing the report numbering, authorisation, signature and QR path of a test report, with the method's numeric constants held as versioned master data (go-live checklist item 5). Treat the Phase 1 effort as being at the upper end of the 32–38 week range until the volumes are known. |

<<<PAGEBREAK>>>

## Appendix C — Sources consulted

The domain facts in this document were researched rather than assumed. These are the sources used. Where a source could not settle a question, the document says so and raises an OPEN-Q instead of asserting a fact.

| # | Source | Used for |
|---|---|---|
| 1 | http://silks.csb.gov.in/nalgonda/where-to-get-what/ | silk domain |
| 2 | https://17025store.com/iso-iec-17025-2017-requirements/clause-4-general-requirements/ | nabl 17025 |
| 3 | https://17025store.com/iso-iec-17025-2017-requirements/clause-7-process-requirements/ | lims reference, nabl 17025 |
| 4 | https://advisera.com/17025academy/blog/2020/10/12/ensuring-impartiality-in-an-iso-17025-laboratory/ | nabl 17025 |
| 5 | https://agriculture.institute/introduction-to-sericulture/quality-standards-sericulture-cocoons-silk-production/ | lims reference |
| 6 | https://agriculture.institute/introduction-to-sericulture/test-grade-raw-silk-quality-assurance/ | lims reference |
| 7 | https://ambud.meity.gov.in/ | india commercial |
| 8 | https://aphl.org/docs/default-source/food-safety/human-and-animal-food-testing/eurolab-handbook-iso-iec-17025-2017.pdf | lims reference |
| 9 | https://apisetu.gov.in/digilocker | india commercial |
| 10 | https://archive.org/details/gov.in.is.15090.1-11.2002 | silk domain |
| 11 | https://archive.org/details/gov.in.is.15825.1 | silk domain |
| 12 | https://archive.org/details/gov.in.is.17618.3.2021 | silk domain |
| 13 | https://astrixinc.com/blog/commmon-causes-of-lims-implementation-failures/ | lims reference |
| 14 | https://aws.amazon.com/compliance/MeitY/ | india commercial |
| 15 | https://baobablims.org/ | lims reference |
| 16 | https://bharatkosh.gov.in | india commercial |
| 17 | https://bharatkosh.gov.in/NTRPHome/UserGuide | india commercial |
| 18 | https://bharatkosh.gov.in/pdf/UserGuideBharatkosh.pdf | india commercial |
| 19 | https://bhattandjoshiassociates.com/digital-signature-laws-in-india/ | india commercial |
| 20 | https://blog.ansi.org/anab/importance-contract-review-iso-iec-17025/ | lims reference |
| 21 | https://blog.certcube.com/gigw-3-0-certification-complete-compliance-guide/ | india commercial |
| 22 | https://blog.labtag.com/tips-for-choosing-the-right-barcode-in-the-lab/ | lims reference |
| 23 | https://busy.in/sac-code-998346/ | india commercial |
| 24 | https://cbic-gst.gov.in/hindi/pdf/central-tax-rate/Notification12-CGST.pdf | india commercial |
| 25 | https://cbic-gst.gov.in/pdf/circular-consolidated.pdf | india commercial |
| 26 | https://cca.gov.in/ | india commercial |
| 27 | https://cca.gov.in/dsc_organisational.html | india commercial |
| 28 | https://cca.gov.in/eSign.html | india commercial |
| 29 | https://cca.gov.in/faq.html | india commercial |
| 30 | https://cca.gov.in/sites/files/pdf/esign/CCA-EAUTH.pdf | india commercial |
| 31 | https://cca.gov.in/sites/files/pdf/guidelines/CCA-IOG.pdf | india commercial |
| 32 | https://cca.gov.in/sites/files/pdf/guidelines/CCA-IVG.pdf | india commercial |
| 33 | https://cf-media.api-setu.in/resources/DigiLocker-Issuer-APISpecification-v1-13.pdf | india commercial |
| 34 | https://cga.gov.in/DownloadPDF.aspx?filenameid=1804 | india commercial |
| 35 | https://cga.nic.in/Page/Bharatkosh.aspx | india commercial |
| 36 | https://cga.nic.in/writereaddata/file/FAQsNTRPforPAOPrAO08092017.pdf | india commercial |
| 37 | https://cga.nic.in/writereaddata/file/FAQsNTRPforUser08092017.pdf | india commercial |
| 38 | https://clearlycomply.org/blog/gst-e-invoicing-india-guide/ | india commercial |
| 39 | https://cleartax.in/s/e-invoice-api-faqs | india commercial |
| 40 | https://cleartax.in/s/gst-e-invoice-qr-code-generation | india commercial |
| 41 | https://cleartax.in/s/no-class-2-digital-signature-2021 | india commercial |
| 42 | https://cleartax.in/v/gst/gst-acts/igst-section-12-place-of-supply-of-services-where-location-of-supplier-and-recipient-is-in-india | india commercial |
| 43 | https://cloud.google.com/security/compliance/meity-india | india commercial |
| 44 | https://community.senaite.org/t/generating-custom-ids-for-samples/246 | lims reference |
| 45 | https://community.senaite.org/t/id-formatting-and-setup/82 | lims reference |
| 46 | https://computype.com/blog/engineer-laboratory-barcode-labels-for-reliable-scanning/ | lims reference |
| 47 | https://computype.com/blog/laboratory-barcodes-guide/ | lims reference |
| 48 | https://corporate.cyrilamarchandblogs.com/2025/03/role-of-state-governments-in-indias-data-protection-regime/ | india commercial |
| 49 | https://csb.gov.in/ | india commercial |
| 50 | https://csb.gov.in/sites/default/files/Service-Standards.pdf | silk domain |
| 51 | https://csbsilktesting.res.in/ | india commercial, silk domain |
| 52 | https://csbsilktesting.res.in/terms-and-conditions/ | india commercial |
| 53 | https://cstri.res.in/ | india commercial |
| 54 | https://cstri.res.in/?page_id=291 | india commercial |
| 55 | https://cstri.res.in/?page_id=297 | india commercial |
| 56 | https://cstri.res.in/?page_id=31 | silk domain |
| 57 | https://cstri.res.in/wp-content/uploads/2020/01/TestingCharges-2019.pdf | india commercial, silk domain |
| 58 | https://cstri.res.in/wp-content/uploads/2022/06/TestingChargesCollected.pdf | silk domain |
| 59 | https://cstri.res.in/wp-content/uploads/2023/08/AnnualReport_2021-22.pdf | silk domain |
| 60 | https://cstri.res.in/wp-content/uploads/2023/12/TestingCharges-2023.pdf | silk domain |
| 61 | https://cstri.res.in/wp-content/uploads/2025/07/NABL-Certificate-2026.pdf | silk domain |
| 62 | https://developers.digitallocker.gov.in/assets/img/onboarding-issuers-&-requesters.pdf | india commercial |
| 63 | https://developers.digitallocker.gov.in/faq.php | india commercial |
| 64 | https://digitalsignature.net.in/document-signer/ | india commercial |
| 65 | https://documentesign.com/blog/esignature-laws-in-india | india commercial |
| 66 | https://einvoice1.gst.gov.in/Documents/IRN_QR_FAQS.pdf | india commercial |
| 67 | https://envirocarelabs.com/qr-code-in-report-nabl-laboratory-transparency/ | lims reference |
| 68 | https://erp.iitkgp.ac.in/PaymentInstructions.pdf | india commercial |
| 69 | https://esanad.nic.in/ | india commercial |
| 70 | https://european-accreditation.org/sp_accordion_faqs/43-2-question-on-impartiality/ | nabl 17025 |
| 71 | https://european-accreditation.org/sp_accordion_faqs/45-2-question-on-amendments-to-test-reports-iso-iec-17025-clause-7-8-8-1/ | nabl 17025 |
| 72 | https://european-accreditation.org/sp_accordion_faqs/50-1-question-on-amendments-to-reports-iso-iec-17025-clause-7-8-8/ | nabl 17025 |
| 73 | https://findgst.in/saclist/9983/sac-998346 | india commercial |
| 74 | https://finodha.in/notification-no-23-2021-central-tax-gst/ | india commercial |
| 75 | https://fintaxblog.com/rule-46-of-cgst-rules-2017-tax-invoice/ | india commercial |
| 76 | https://fintaxblog.com/section-12-of-igst-act-2017-place-of-supply-of-services-supplier-recipient-located-in-india/ | india commercial |
| 77 | https://fp-lims.com/en/resources/blog/kpis-in-lims/ | lims reference |
| 78 | https://github.com/BaobabLims/baobab.lims | lims reference |
| 79 | https://github.com/open-lims/open-lims | lims reference |
| 80 | https://github.com/senaite/senaite.core | lims reference |
| 81 | https://github.com/senaite/senaite.core/issues/1327 | lims reference |
| 82 | https://gstcouncil.gov.in/sites/default/files/AAR/guj-2017-18-1_dt_13-12-17_guru_cold_0.pdf | india commercial |
| 83 | https://gstcouncil.gov.in/sites/default/files/e-version-gst-flyers/Reverse%20charge%20Mechanism.pdf | india commercial |
| 84 | https://gstgyaan.com/rule-50-of-the-cgst-rules-receipt-voucher | india commercial |
| 85 | https://gstlearn.com/2021/02/23/gst-sectoral-faq-government-services/ | india commercial |
| 86 | https://gstlearn.com/2024/01/24/tax-invoice-cgst-rule-46/ | india commercial |
| 87 | https://gstpress.com/notifications/ckpecyfmb7wnq0874rn9nznm6/amends-notification-no-13-2020-central-tax-to-exclude-government-departments-and-local-authorities-from-the-requirement-of-issuance-of-e-in … | india commercial |
| 88 | https://gstverify.co.in/gst/hsn/998346/ | india commercial |
| 89 | https://gstzen.in/a/receipt-voucher-cgst-rule-50.html | india commercial |
| 90 | https://gstzen.in/a/refund-voucher-cgst-rule-51.html | india commercial |
| 91 | https://guidelines.india.gov.in/ | india commercial |
| 92 | https://guidelines.india.gov.in/introduction/ | india commercial |
| 93 | https://guidelines.india.gov.in/new-features-of-gigw-3-0/ | india commercial |
| 94 | https://guidelines.india.gov.in/scope-and-objective/ | india commercial |
| 95 | https://hbmahesh.weebly.com/uploads/3/4/2/2/3422804/5.raw_silk_testing-word.pdf | lims reference |
| 96 | https://helpx.adobe.com/legal/esignatures/regulations/india.html | nabl 17025 |
| 97 | https://iimbg.ac.in/wp-content/uploads/2026/05/Employer_Verification_Guide_DigiLocker.pdf | india commercial |
| 98 | https://img1.digitallocker.gov.in/assets/img/Digital%20Locker%20Authorized%20Partner%20API%20Specification%20v1.11.pdf | india commercial |
| 99 | https://img1.digitallocker.gov.in/assets/img/issuer_api/Digital%20Locker%20Issuer%20API%20Specification%20v1.12.pdf | india commercial |
| 100 | https://indiadpdpa.com/india-dpdpa-article-13-right-of-grievance-redressal/ | india commercial |
| 101 | https://intuitionlabs.ai/articles/lims-system-guide-2025 | lims reference |
| 102 | https://intuitionlabs.ai/articles/open-source-lims-guide | lims reference |
| 103 | https://irisgst.com/effective-1st-april-2019-reset-the-invoice-number-series-gst-advisory/ | india commercial |
| 104 | https://kfbiopathology.com/application/qr-code-vs-data-matrix-code-principles-differences-and-why-dm-code-is-ideal-for-pathology-slide-digitization/ | lims reference |
| 105 | https://ksandk.com/data-protection-and-data-privacy/grievance-officers-under-indias-dpdp-act-and-2025-rules/ | india commercial |
| 106 | https://law.resource.org/pub/in/bis/manifest.txd.28.html | silk domain |
| 107 | https://learn.microsoft.com/en-us/compliance/regulatory/offering-meity-india | india commercial |
| 108 | https://lims | lims reference |
| 109 | https://lims.bis.gov.in/ | lims reference |
| 110 | https://martelinstruments.com/lims-instrument-integrations/ | lims reference |
| 111 | https://mndc.uidai.gov.in/en/ecosystem/authentication-devices-documents/qr-code-reader.html | india commercial |
| 112 | https://nabl-india.org/ | lims reference |
| 113 | https://nabl-india.org/nabl/file_download1.php?filename=202011030929-NABL-163-doc.pdf | nabl 17025 |
| 114 | https://nabl-india.org/nabl/file_download1.php?filename=202101120721-NABL-142-doc.pdf | nabl 17025 |
| 115 | https://nabl-india.org/nabl/file_download1.php?filename=202307131055-NABL-151-doc.doc | india commercial |
| 116 | https://nabl-india.org/nabl/file_download1.php?filename=202401230945-NABL-127-doc.pdf | india commercial |
| 117 | https://nabl-india.org/nabl/file_download1.php?filename=202404020602-CC-3373-doc.pdf | india commercial |
| 118 | https://nabl-india.org/nabl/file_download1.php?filename=202409080300-NABL-133-doc.pdf | nabl 17025 |
| 119 | https://nabl-india.org/nabl/file_download1.php?filename=202508280508-NABL-100B-doc.pdf | nabl 17025 |
| 120 | https://nabl-india.org/nabl/file_download1.php?filename=202512230649-NABL-120-doc.pdf | nabl 17025 |
| 121 | https://nabl-india.org/nabl/file_download1.php?filename=202601231130-NABL-131-doc.pdf | nabl 17025 |
| 122 | https://nabl-india.org/nabl/file_download1.php?filename=202608101119-NABL-127-doc.pdf | nabl 17025 |
| 123 | https://nabl-india.org/nabl/index.php?c=publicaccredationdoc&m=index&docType=both&Itemid=199 | nabl 17025 |
| 124 | https://nabl-india.org/news-announcements/ | lims reference, nabl 17025 |
| 125 | https://nabl-india.org/wp-content/uploads/2020/07/revised-list-of-documents.pdf | nabl 17025 |
| 126 | https://nabl-india.org/wp-content/uploads/2021/12/Clarification-on-Unique-Laboratory-Report-ULR-Number-for-Accreditation-Certificate-TC-XXXXX.pdf | lims reference |
| 127 | https://nabl-india.org/wp-content/uploads/2023/11/Clarification-on-Unique-Laboratory-Report-ULR-Number-for-Accreditation-Certificate-TC-XXXXX.pdf | nabl 17025 |
| 128 | https://nabl-india.org/wp-content/uploads/2023/11/Clarification-on-Unique-Laboratory-Report-ULR-Number.pdf | lims reference, nabl 17025 |
| 129 | https://nabl-india.org/wp-content/uploads/2023/11/QR-Code-on-test-report-calibration-certificate.pdf | nabl 17025 |
| 130 | https://nabl-india.org/wp-content/uploads/2026/01/NABL-160A_Issue-No.-01.pdf | nabl 17025 |
| 131 | https://nabl-india.org/wp-content/uploads/2026/06/Announcement-regarding-NABL-symbol-w.r.t-new-format-of-certificate-No.pdf | nabl 17025 |
| 132 | https://nabl-india.org/wp-content/uploads/2026/06/Clarification-on-ULR-Number-15.06.2026.pdf | nabl 17025 |
| 133 | https://nabl-india.org/wp-content/uploads/2026/07/Announcement-regarding-NABL-symbol-w.r.t-new-format-of-certificate-No.-Rev.06.07.2026.pdf | nabl 17025 |
| 134 | https://nablmelt.qci.org.in/Laboratory/new-scheme/uploads/1645874085PTILC1352.pdf | nabl 17025 |
| 135 | https://onlinesbi.sbi.bank.in/sbijava/mergerfaq/merger_collect_faq.html | india commercial |
| 136 | https://onlinetaxupdate.com/gst-on-government-services/ | india commercial |
| 137 | https://opsiocloud.com/in/knowledge-base/meity-empanelled-cloud-providers-india/ | india commercial |
| 138 | https://partners.apisetu.gov.in | india commercial |
| 139 | https://pgaa.in/Image/Presentation-%20GST%20on%20Govt%20Services.pdf | india commercial |
| 140 | https://piceapp.com/gst-number-search/central-silk-technological-research-institute-29aaalc0093m1zz/ | india commercial |
| 141 | https://play.google.com/store/apps/details?id=com.csb_silk_testing&hl=en_IN | india commercial |
| 142 | https://qbench.com/blog/how-to-integrate-lab-instruments-with-a-lims | lims reference |
| 143 | https://raw.githubusercontent.com/senaite/senaite.core/2.x/src/senaite/core/profiles/default/workflows/senaite_analysis_workflow/definition.xml | lims reference |
| 144 | https://raw.githubusercontent.com/senaite/senaite.core/2.x/src/senaite/core/profiles/default/workflows/senaite_sample_workflow/definition.xml | lims reference |
| 145 | https://rc.sunbird.org/use/integrations/digilocker-integration | india commercial |
| 146 | https://rjqualityconsulting.com/iso-17025-clause-7/ | lims reference |
| 147 | https://sbi.bank.in/web/business/sme/digital-collection-products/sb-collect | india commercial |
| 148 | https://silks.csb.gov.in/nellore/where-to-get-what/ | india commercial |
| 149 | https://smallcapcrm.com/nabl-ulr-guideline-and-impact-on-labortories-and-lims/ | lims reference |
| 150 | https://spiceroutelegal.com/publications/cloud-governance-101-public-procurement-of-cloud-service/ | india commercial |
| 151 | https://srfmtti.dacnet.nic.in/Downloads/Testing_Charges/STEPS_MAKING_PAYMENT_THROUGH_BHARATKOSH.pdf | india commercial |
| 152 | https://startupflora.com/blog/bharatkosh-payment | india commercial |
| 153 | https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf | india commercial |
| 154 | https://studycafe.in/rule-50-cgst-rules-receipt-voucher-16458.html | india commercial |
| 155 | https://support.signeasy.com/support/solutions/articles/5000756979-india-esign-pricing | india commercial |
| 156 | https://tax2win.in/guide/e-invoicing-gst | india commercial |
| 157 | https://taxguru.in/goods-and-service-tax/agricultural-produce-gst-regime.html | india commercial |
| 158 | https://taxguru.in/goods-and-service-tax/commentary-tax-invoice-number-gst.html | india commercial |
| 159 | https://taxguru.in/goods-and-service-tax/govt-depts-local-authorities-excluded-e-invoice-requirement.html | india commercial |
| 160 | https://taxguru.in/goods-and-service-tax/signed-qr-code-e-invoicing-system-gst-faqs.html | india commercial |
| 161 | https://taxguru.in/goods-and-service-tax/tax-invoice-requirements-section-31-cgst-act-gst-rule-46.html | india commercial |
| 162 | https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/rules/cgst_rules/active/chapter6/rule51_v1.00.html | india commercial |
| 163 | https://taxreply.com/gst-act-and-rules/Section-12-of-IGSTACT | india commercial |
| 164 | https://texmin.nic.in/sites/default/files/CSB-ACT-and-RULES-Book.pdf | india commercial |
| 165 | https://thehealthmaster.com/2021/05/25/nabl-mandates-qr-code-on-test-reports-of-laboratories/ | lims reference, nabl 17025 |
| 166 | https://trilegal.com/wp-content/uploads/2022/05/2022-CERT-In-Directions-on-Reporting-Cyber-Incidents-1.pdf | india commercial |
| 167 | https://uidai.gov.in/en/306-faqs/aadhaar-online-services/secure-qr-code-reader-beta/10781-what-is-uidai-secure-qr-code-how-qr-code-enhance-the-security-of-e-aadhaar.html | india commercial |
| 168 | https://uidai.gov.in/en/307-faqs/aadhaar-online-services/offline-aadhaar-data-verification-service.html | india commercial |
| 169 | https://uidai.gov.in/en/916-developer-section/data-and-downloads-section/19388-uidai-certificate-details-2.html | india commercial |
| 170 | https://vantagecare.labvantage.com/labvantagedoc/Content/concepts/concepts_modules.htm | lims reference |
| 171 | https://verify | gap analysis, india commercial |
| 172 | https://www.agaramtech.com/blog/top-5-reasons-why-many-lims-implementation-fails-and-how-to-get-yours-right | lims reference |
| 173 | https://www.ajol.info/index.php/ijest/article/download/199710/188272 | silk domain |
| 174 | https://www.amsshardul.com/insight/enforcement-of-the-dpdp-act-and-notification-of-the-dpdp-rules/ | india commercial |
| 175 | https://www.astrixinc.com/blog/key-laboratory-kpis-and-lab-metrics-tracking-made-easy-with-a-lims/ | lims reference |
| 176 | https://www.atrity.com/cert-in-incident-reporting-6-hour-rule-and-log-retention-best-practices/ | india commercial |
| 177 | https://www.azbpartners.com/bank/indias-digital-personal-data-protection-act-phased-rollout-and-key-compliance-milestones/ | india commercial |
| 178 | https://www.bikalims.org/manual/setup-and-configuration/images-id-server/id-server-settings-for-bika-senaite-open-source-lims/view | lims reference |
| 179 | https://www.bikalims.org/manual/workflow | lims reference |
| 180 | https://www.certificate.digital/articles/25112016/digital-signature-electronic-signature-under-it-act-2000/ | nabl 17025 |
| 181 | https://www.complyzero.com/blog/dpdp-act-exemptions-explained | india commercial |
| 182 | https://www.credlix.com/hsn-code/998346 | india commercial |
| 183 | https://www.csolsinc.com/resources/top-4-reasons-lims-implementations-fail | lims reference |
| 184 | https://www.cyrilshroff.com/wp-content/uploads/2025/12/FAQs-DPDPA.pdf | india commercial |
| 185 | https://www.digilocker.gov.in/ | india commercial |
| 186 | https://www.digilocker.gov.in/assets/FAQ%20DL%20EL_onboarding.pdf | india commercial |
| 187 | https://www.digitalhealthnews.com/nabl-rolls-out-qr-code-authentication-for-accredited-labs | nabl 17025 |
| 188 | https://www.dpdpa.com/dpdpa2023/chapter-2/section8.html | india commercial |
| 189 | https://www.dpdpa.com/dpdpa2023/chapter-3/section13.html | india commercial |
| 190 | https://www.dpdpa.com/dpdpa2023/chapter-4/section17.html | india commercial |
| 191 | https://www.eversign.in/price-list/ | india commercial |
| 192 | https://www.fao.org/4/x2099e/x2099e03.htm | lims reference |
| 193 | https://www.fao.org/4/x2099e/x2099e04.htm | silk domain |
| 194 | https://www.fao.org/4/x2099e/x2099e08.htm | silk domain |
| 195 | https://www.fao.org/4/x2099e/x2099e12.htm | silk domain |
| 196 | https://www.frslabs.com/frsblog/2023/10/12/digilocker-how-to-integrate-digilocker-api-into-your-web-or-mobile-app-for-kyc/ | india commercial |
| 197 | https://www.getatoz.com/sac/code/998346/technical-testing-and-analysis-services | india commercial |
| 198 | https://www.gfr.co.in/p/general-system-of-financial-management.html | india commercial |
| 199 | https://www.gimbooks.com/blog/5-crore-e-invoice-turnover-rule-2026/ | india commercial |
| 200 | https://www.gotrust.tech/blog/exemptions-and-accountability-in-india-s-data-protection-framework | india commercial |
| 201 | https://www.gst.gov.in | india commercial |
| 202 | https://www.gstn.org.in/assets/mainDashboard/Pdf/GST%20e-invoice%20System%20-%20Overview%20-%20Version%20Dt.%2029-5-2020.pdf | india commercial |
| 203 | https://www.iasonline.org/wp-content/uploads/2018/01/The-New-ISO-IEC-17025-2017.pdf | lims reference |
| 204 | https://www.indiacode.nic.in/bitstream/123456789/1474/3/A1948-61.pdf | india commercial |
| 205 | https://www.internetsociety.org/resources/doc/2022/internet-impact-brief-india-cert-in-cybersecurity-directions-2022/ | india commercial |
| 206 | https://www.isobudgets.com/statements-of-conformity-and-decision-rules/ | nabl 17025 |
| 207 | https://www.khuranaandkhurana.com/2021/03/31/validity-of-digital-signatures-in-india | nabl 17025 |
| 208 | https://www.labmanager.com/ensuring-sample-validity-a-comprehensive-guide-to-field-to-lab-chain-of-custody-34513 | lims reference |
| 209 | https://www.labmanager.com/environmental-lab-lims-chain-of-custody-automation-for-field-sample-compliance-35513 | lims reference |
| 210 | https://www.labmanager.com/lims-software-a-complete-guide-to-laboratory-information-management-systems-35427 | lims reference |
| 211 | https://www.labvantage.com/blog/turning-challenges-into-success-best-practices-for-lims-implementation/ | lims reference |
| 212 | https://www.labvantage.com/informatics/ | lims reference |
| 213 | https://www.labware.com/blog/top-lims-kpis-and-dashboards | lims reference |
| 214 | https://www.labware.com/lims | lims reference |
| 215 | https://www.labware.com/lims/integration | lims reference |
| 216 | https://www.labware.com/lims/saas/qaqc | lims reference |
| 217 | https://www.leegality.com/blog/aadhaar-esign-vs-dsc | india commercial |
| 218 | https://www.leegality.com/blog/law-around-aadhaar-esign | india commercial, nabl 17025 |
| 219 | https://www.lexology.com/library/detail.aspx?g=899f3b94-c31f-4983-868f-5ee5abbf78c8 | india commercial |
| 220 | https://www.lumiversesolutions.com/stqc-gigw-3-0-compliance-process-guide-2025/ | india commercial |
| 221 | https://www.mcrhrdi.gov.in/asodr2018/week3/1-ASO-DR-GFR2017-May2018.pdf | india commercial |
| 222 | https://www.mea.gov.in/Images/attach/e_sanad_website.pdf | india commercial |
| 223 | https://www.mynewlab.com/resources/what-is-lims/why-lims-projects-fail/ | lims reference |
| 224 | https://www.nfc.gov.in/pdf/user-guide-ntrp.pdf | india commercial |
| 225 | https://www.nrsc.gov.in/nrscnew/assets/pdf/training_outreach/2026/SOP%20for%20Training%20Charges_Fees%20using%20NTRP%20-BharatKosh.pdf | india commercial |
| 226 | https://www.paperlesslabacademy.com/wp-content/uploads/2020/11/SampleManager-LIMS-SDMS-LES-brochure.pdf | lims reference |
| 227 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2168764&reg=3&lang=2 | india commercial |
| 228 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2202897&reg=3&lang=2 | india commercial |
| 229 | https://www.pjlabs.com/downloads/LF-56-17025-2017.pdf | nabl 17025 |
| 230 | https://www.pjlabs.com/downloads/webinar_slides/10.9.2024_Reporting-Results.pdf | nabl 17025 |
| 231 | https://www.pjlabs.com/downloads/webinar_slides/11.22.2021_17025-2017-Section-7-10.pdf | lims reference |
| 232 | https://www.pjlabs.com/downloads/webinar_slides/2.22.2022_17025-Section-7-1.pdf | lims reference |
| 233 | https://www.pjlabs.com/downloads/webinar_slides/3.31.2022_Reporting-Results.pdf | nabl 17025 |
| 234 | https://www.pjlabs.com/downloads/webinar_slides/4.18.2024_Impartiality-Confidentiality.pdf | nabl 17025 |
| 235 | https://www.pjlabs.com/downloads/webinar_slides/5.22.18_Statements-Conformity.pdf | nabl 17025 |
| 236 | https://www.primebook.in/blog/what-is-digilocker-scanner | india commercial |
| 237 | https://www.qi-a.com/learning-center/how-can-a-lab-software-helps-in-sample-retention-process/ | lims reference |
| 238 | https://www.qi-a.com/learning-center/sample-labeling-and-traceability-standards-in-the-u-s/ | lims reference |
| 239 | https://www.qi-a.com/learning-center/sample-retention-and-disposal-policies-in-the-united-states/ | lims reference |
| 240 | https://www.qryptal.com/blog/how-can-labs-and-testing-organisations-implement-and-integrate-nabl-mandate-on-qr-codes/ | lims reference |
| 241 | https://www.qryptal.com/blog/why-nabl-mandated-qr-codes-for-document-security/ | lims reference, nabl 17025 |
| 242 | https://www.qse-academy.com/reporting-requirements-iso-iec-170252017/ | lims reference |
| 243 | https://www.registerkaro.in/hsn/gst-rate-hsn-code-998346 | india commercial |
| 244 | https://www.researchgate.net/publication/298263733_Influence_of_CSTRI_Denier_control_mechanism_on_quality_of_raw_silk | lims reference |
| 245 | https://www.scribd.com/document/838956970/ | india commercial |
| 246 | https://www.scribd.com/document/838956970/eMudhra-Fee-2903241073374361326806344578148647589871741750349906 | india commercial |
| 247 | https://www.senaite.com/docs/quickstart/ | lims reference |
| 248 | https://www.senaite.com/docs/sample-basics.html | lims reference |
| 249 | https://www.senaite.com/docs/sample-partitions | lims reference |
| 250 | https://www.senaite.com/features/ | lims reference |
| 251 | https://www.softcomputer.com/2024/03/18/what-are-lims-modules/ | lims reference |
| 252 | https://www.stqc.gov.in/en/website-quality-certification-0 | india commercial |
| 253 | https://www.taxmanagementindia.com/visitor/detail_article.asp?ArticleID=12509 | india commercial |
| 254 | https://www.taxwink.com/blog/refund-voucher-gst-particulars | india commercial |
| 255 | https://www.tgct.gov.in/tgportal/Docs/Notifications/TGST/Updated%20TGST%20Rates,%202017%2013-2017-CT(R | india commercial |
| 256 | https://www.thermofisher.com/us/en/home/digital-solutions/lab-informatics/lab-information-management-systems-lims/solutions/samplemanager.html | lims reference |
| 257 | https://www.wavefrontsoftware.com/lims-dashboards-and-kpis/ | lims reference |
| 258 | https://www.zendolims.com/blog/integration-measuring-devices-analysis-with-lims.html | lims reference |
| 259 | https://x.com/digilocker_ind/status/1799024651714416883 | india commercial |

