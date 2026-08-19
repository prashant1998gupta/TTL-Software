## Executive Summary — Read This First

### In one paragraph

This document specifies a Laboratory Information Management System — software that runs the whole life of a test, from the moment a customer hands over silk at the counter to the moment a signed certificate is issued and can be verified by scanning a code on it. It is written for the Regional Silk Technological Research Station / Silk Conditioning and Testing House at Dharmavaram. It replaces the paper sample register, the hand-typed report, the hand-calculated conditioned weight, and the folder of calibration certificates with one system that can answer, at any moment, where a sample is, who tested it, on which balance, in what room conditions, against which version of which method, and who signed the result. It is a standalone application: it holds its own customer master, raises and numbers its own invoices and receipts, and keeps its own consumable stock and equipment records, so nothing outside it has to be in place before it can run. The unit's accounts wing keeps the general ledger as it does today; an interface to an external accounting system is specified in case one is ever adopted, but it is switched off, because the unit runs no such system.

### The short answer to "can we do better than the first note?"

Yes — and the first note was a good start. It named ten things, and all ten are in this specification. But a discussion note describes a conversation, while a specification has to survive a developer's questions and an auditor's questions. Eight changes matter more than the rest.

**1. The order of the first two steps is reversed.** The first note began with creating a customer and raising an invoice, then receiving samples. In a testing laboratory that is backwards, for a practical reason: the charge cannot be known before the material is counted and inspected. A grading fee depends on how many bales are in the lot; a conditioning charge depends on weight. So the process now begins with a **Test Request** that the laboratory formally reviews and accepts, and the invoice follows from what was actually received. A quotation can still be given up front as an estimate, and advance payment can still be demanded where the laboratory wants it.

**2. The word "job" is retired, because it was doing two jobs.** The first note said one job per sample. That is nearly right and it was the note's sharpest instinct. But one sample commonly carries four or five different tests, performed by different people on different days on different machines. So the specification separates the **sample** (the physical silk) from the **test on that sample** (the unit of work that gets assigned to a person). Five hanks needing three tests each is five samples and fifteen assignable units of work — not five jobs, and not one.

**3. A test result is not a single number.** The first note described a "test log entry" with observations and remarks. Real silk testing produces many readings that are then averaged: six skeins for conditioned mass, ten bobbins for winding, twenty panels for evenness, forty or eighty sizing skeins for size deviation. The system must store **every original reading**, compute the average and the variation from them, and never overwrite a reading that has been submitted. A single free-text "results" box would lose exactly the data an auditor asks for.

**4. Approval is two steps, not one.** The first note had one approval. A laboratory does two different things: someone technically competent **verifies** that the numbers and the arithmetic are right, and then the authorised signatory **authorises and signs** the certificate. These are different acts by different people with different consequences. The specification also covers what happens when the signatory is on tour, because that will happen.

**5. A certificate that has been issued can never be quietly edited.** The first note did not mention what happens when a report has to change after it has gone out. This is the single most common way a laboratory loses an audit. The specification requires an **amendment** — a new, separately identified version that refers to the original, records why it changed, keeps the superseded version retrievable and marked as superseded, and updates what a person sees when they scan the code on the old copy.

**6. The public QR code should not show everything to everybody.** The first note said anyone scanning the code should be able to see the report. The intent is right — digital verification instead of telephone calls — but a test report is a commercially sensitive trade document, and a permanently public, guessable link would let anyone harvest competitors' results. The specification keeps the benefit and removes the risk: an anonymous scan confirms that the certificate is **genuine, current, and not amended or withdrawn**, and shows enough to identify it; the actual results need a one-time password or a login. If the laboratory prefers the fully open version, it is a single setting — but the safer behaviour is the default.

**7. Two modules were named in the first note but are much bigger than their names suggest.** "Equipment as an asset system" is really **calibration control**: the system must know whether a balance was within its calibration validity on the day it produced a weight, and — critically — when a machine is found out of calibration, it must be able to list every result that machine produced since its last good calibration, so the laboratory can decide whether any certificate must be recalled. "Internal stock" is really **reagent lot and expiry control**: the system must refuse to let an expired lot be used in a test and must record which lot was used for which result.

**8. A record-keeping backbone has been added underneath everything.** The first note had no audit trail, no method versions, no environmental conditions, no retention and disposal, no competency control. These are not extras. Silk testing is done in a controlled atmosphere and the conditions at the time of test are part of the result. A method has versions, and a certificate issued three years ago must be reproducible against the version in force then. Only a person authorised for a method may run it. Every change to a technical record must keep the original value visible, with who changed it, when, and why. This backbone is what turns a workflow tool into a laboratory record.

### Your ten points, and where each one now lives

| # | Point in the original note | Where it is now | What was added to it |
|---|---|---|---|
| 1 | Customer creation | M1 Master Data | Customer categories that drive concession rates and the returns to headquarters; a frozen name-and-address snapshot on every issued certificate so a later edit cannot rewrite history; a path for zero-charge internal and research samples; duplicate-customer control |
| 2 | Invoice with multiple tests | M2 Enquiry & Quotation, M17 Billing | Formal review and acceptance of the request before work starts; rate card with effective dates and concessions; quotation as an estimate; charge computed from what was actually received; government receipt and challan handling; gap-free financial-year invoice numbering |
| 3 | Sample-based job creation | M3 Test Request & Sample Registration | The physical hierarchy of lot, bale, book, skein and specimen; the split of sample from assignable test; acceptance and rejection at receipt with recorded condition; a printed acknowledgement for the customer; label printing; due dates from a working-day calendar |
| 4 | Job assignment, tester must not see customer | M5 Work Allocation | A competency gate so only an authorised person can be assigned a method; a calibration check on the equipment at the moment of assignment; a workload view; an honest account of where blinding cannot work, because the customer's own marks are physically on the silk |
| 5 | Test log entry by tester | M6 Result Entry | Many readings per parameter with the required count enforced; automatic averages and variation; capture of which machine and which reagent lot were used; room temperature and humidity at test time; fast keyboard-only batch entry, because roughly ninety-eight per cent of this unit's work is one high-volume test |
| 6 | Test log approval | M7 Verification & Approval | The split into technical verification and authorised signing; send-back with a reason; a verification checklist; delegation while the signatory is away; a stated decision rule for a result sitting right on a specification limit |
| 7 | Test report generation | M8 Report & Certificate Generation | The full mandatory content required of an accredited laboratory's report; amendment and withdrawal control; draft versus final; a dispatch register; storage of the exact issued file, not just the data it was made from |
| 8 | QR code online report access | M9 Public Verification by Code | Tiered disclosure; a signed code so a forged one can be detected; non-guessable links; rate limiting; correct behaviour for an amended or withdrawn certificate; a log of every verification attempt |
| 9 | Equipment calibration as asset system | M11 Equipment & Calibration | Calibration validity and due alerts; intermediate checks; out-of-service blocking; and the impact analysis that lists every result produced by a machine later found out of calibration |
| 10 | Internal stock for testing | M12 Consumables & Reagent Stock | Lot numbers, expiry and shelf life after opening; a hard block on using an expired lot; consumption traced to the individual result; reorder alerts; disposal records |

Eleven further modules were added that the original note did not mention: sample handling and chain of custody (M4), personnel competency (M13), method and document control (M14), the quality system (M15), environment monitoring (M16), the customer portal (M18), notifications (M19), registers and dashboards (M20), administration and audit (M21), Interface to an External Accounting System (M22), and — the one most specific to this unit — the **weight and conditioning certificate** (M10), which is a different document from a test report and is the highest-consequence calculation the unit performs, because money changes hands on the final kilogram figure.

### What we need from you before coding starts

The specification contains **111 questions marked OPEN-Q**, of which seven have since been answered, leaving **104 open**. The answered ones are marked where the question is raised, and the register shows the answer rather than a default. The rest carry a recommended default so that nothing is blocked while answers are pending. They are lettered by the part that raises them — OPEN-Q-A1 in Part A, OPEN-Q-T1 in the technical part, and so on. The full register is in Appendix B. These are the ones worth answering first, because the answers prevent the most rework.

| Question | Why it matters |
|---|---|
| **What are the missing items on the catalogue status list, and are any of them accredited?** (Accreditation, its scope, and the Limited Test's status are now all settled — see below.) | The list supplied by the unit runs from serial 3 to serial 30 with serials 1, 2, 16, 17 and 22 to 26 absent, and carries no fabric test anywhere, although five of the seven accredited scope entries are fabric parameters. Until the gaps are filled, every catalogue item is Non-NABL and no report carries the accreditation symbol at all. |
| How are mixed reports issued today — one report, or separate ones? | Where a sample carries both accredited and non-accredited tests, the system must issue **two separate reports**. Marking the non-accredited test with an asterisk on one report is not permitted. If that is the current practice, the software will change it. |
| How does the existing national CSB online testing portal relate to this system? | Samples may already arrive through it. It is treated here as a source of incoming requests, not as something to replace — but the two must not keep separate, disagreeing records of the same sample. |
| Are the published rate card and test list current for this unit? | Everything about charging depends on it. Please confirm or correct the catalogue and rates. |
| Every existing paper form, register and report format | The system should print what the unit already prints. Please collect one filled example of each. |
| The real daily volumes and the busiest hour | Decides the design of the batch entry screens. |
| Who signs, who verifies, and who deputises when the signatory is away | Decides the permission matrix. |
| Is a valid digital signature on the certificate enough, or does the quality system require long-term validation — a signature that can still be proved valid years after the signing certificate has expired? The Unit In-Charge has said verbally that a valid signature is what is needed; that is recorded as an assumption until the Quality Manager confirms it in writing. | Long-term validation cannot be done at the moment of issue: it needs the certifying authority's revocation service and a timestamping authority, both reached over the internet, and nothing on the report-issue path may call outside the laboratory network. So if the written answer is that long-term validation is required, it does not mean different software — it means the report is issued first and a separate timestamped copy is produced and kept afterwards, which is Phase 6 work. |
| Whether the sample is returned, retained or disposed, and for how long | Decides the storage and disposal module. |

### What it takes to build

One developer, full time. **Section 26.1 is the authoritative estimate** and carries the reasoning, the exclusions and the schedule risks; the summary below is only an orientation. If the two ever disagree, Section 26 is right.

| Phase | What the laboratory gets | Developer-weeks |
|---|---|---|
| 0 | Two weeks sitting in the laboratory watching the real process, collecting every form, and settling the open questions | 2 |
| 1 | **The paper sample register is replaced**, end to end: reviewed test request, registration, allocation, result entry with its equipment, reagent-lot, competency and environment gates, verification, signed certificate with a verification code, the conditioned-mass certificate, and report amendment and withdrawal | 32–38 |
| 2 | Money: rate cards, enquiry and quotation, invoices, receipts, payment holds, statutory returns | 7–9 |
| 3 | Equipment lifecycle and stock economics: the calibration programme, the traceability chain, the stock ledger, training records, and the out-of-calibration impact analysis | 4–6 |
| 4 | Quality system: complaints, nonconforming work, corrective action, quality control, proficiency testing, decision rules, document control | 7–9 |
| 5 | Outward-facing: customer portal, notifications, dashboards | 6–8 |
| 6 | Depth: instrument file import, stronger signing, subcontracting, readiness for a second unit | 5–7 |

The complete system is roughly **fifteen to eighteen months** of one person's full time, with the paper sample register replaced somewhere in **month eight or nine**.

A word on why Phase 1 is large. An earlier draft of this plan put Phase 1 at twelve weeks by leaving the test request review, the equipment and reagent-lot capture, the competency check and report amendment to later phases. That was wrong, and reviewing the plan against the requirements showed why: Phase 1 is the release that goes live and starts issuing signed certificates, so everything a certificate depends on has to be inside it. A certificate issued in month nine without a record of which balance produced the weight, whether that balance was in calibration, and who was authorised to sign, cannot be defended afterwards — and there would have been no way to amend it except by re-typing it, which is the practice this system exists to end. Phase 1 is delivered in internal increments, but it has one go-live.

Phase 0 is not optional. Two weeks of watching the real work will change more of this document than two months of guessing.

### The accreditation position, now confirmed

The laboratory holds accreditation **in its own right**, separate from the reference laboratory at Bengaluru. Confirmed from the certificate itself:

| | |
|---|---|
| Legal entity | Central Silk Board |
| Accredited facility | Textile Testing Laboratory, Regional Silk Technological Research Station, Central Silk Technological Research Institute |
| Address on the certificate | D. No. 25-650, Parthasaradhi Nagar, Regetipalli Road, Dharmavaram, Sri Sathya Sai, Andhra Pradesh, India |
| Standard | ISO/IEC 17025:2017 |
| Field | Testing |
| Certificate number | **NABLT0726AD18713** |
| Issued | 17 July 2026 |
| Valid until | 16 July 2030 |

Three consequences that change how the software must be built, not merely what it prints:

**The compliance requirements in this document are obligations, not good practice.** The audit trail that keeps original readings visible, the calibration validity check before a result is accepted, the block on an expired reagent lot, the competency gate, the method version recorded against every result, and amendment control on issued reports are the things an assessor will ask to see. They belong in the first release, which is why Phase 1 is as large as it is.

**The certificate number is in the current 2026 format, so the report number format follows from it.** The Unique Laboratory Report number is the 26-character form: the certificate number, then the two-digit report year, then an eight-digit running number restarted each calendar year — for example `NABLT0726AD18713` `26` `00000001` for the first report of 2026. The unit never needs the older shorter forms. The system still builds this from configuration rather than fixed text, so a re-issued certificate in any future format costs no programming.

**The accredited scope is small, and this changes the design.** The scope annexure has been obtained. It lists **seven** accredited entries, all under *Mechanical — Textile Materials*:

| Material or product | Parameter | Method |
|---|---|---|
| Fabric | Length | IS 1954 |
| Fabric | Mass | IS 1964 |
| Fabric | Number of Threads Per Unit Length | IS 1963 |
| Fabric | Percentage by Weight of Warp and Weft Yarn | IS 17208 |
| Fabric | Width | IS 1954 |
| **Raw Silk Yarn** | **Count** | **IS 15090 (Part 5)** |
| Woven Fabric | Linear Density of Yarn Removed from Fabric | IS 3442 |

The Unit In-Charge's own remark — that a good deal of the unit's testing is done outside NABL — is confirmed by this annexure, and it matters more than it first appears. Raw silk grading (BIS and ISA), evenness, neatness, cleanness, cohesion, twist, boil-off, winding breaks, tenacity, fibre identification, blend composition, cocoon work, and the whole of conditioning and weight certification are **not** in the accredited scope. Five of the seven entries are fabric tests, while the unit's recorded revenue is overwhelmingly raw silk work.

So the software must treat non-accredited work as the **normal** case: the plain report is the document staff will see most days, the accredited report is the smaller stream, and where one sample carries both kinds the system issues **two separate reports** rather than one report with a footnote. Marking a non-accredited test with an asterisk on an accredited report is not permitted, which may differ from current practice and is worth checking.

The most valuable question that remained — whether the Limited Test falls under *Raw Silk Yarn / Count / IS 15090 (Part 5)* — is now settled, and the answer is **no**. The Unit In-Charge has confirmed it directly, and has supplied a status list marking the Limited Test and twenty other catalogue items **Non-NABL**. None of those twenty-one maps to any of the seven accredited entries, so on the present catalogue the accreditation symbol and the Unique Laboratory Report number would appear on **no report at all**. An earlier draft of this summary assumed the opposite — that *Count* was inside scope, and that the Limited Test report would therefore split into two documents — and that assumption is **withdrawn**. The accredited machinery is still built and tested, but it waits behind a per-item flag, and the plain certificate is the primary template. What remains open is narrower, and is recorded as OPEN-Q-C15 to OPEN-Q-C17: the gaps in the supplied list, whether the unit sells the seven accredited parameters at all, and the rates themselves — the supplied file is titled *Proposed testing charges* but carries no charges.

### An honest word on what this will not do

It will not make a tensile test faster. It will not remove the need for discipline in recording readings — it will only make undisciplined recording visible. It will need one person to own the master data, because a test catalogue and a rate card that nobody maintains will quietly become wrong. And it will not, by itself, make the unit accredited; it will make the unit's records defensible, which is a different and necessary thing.

<<<PAGEBREAK>>>

## Part A — Purpose, People and Scope

### 1. Purpose of this document

This document is the build specification for a Laboratory Information Management System (LIMS) for the Regional Silk Technological Research Station (RSTRS) / Silk Conditioning and Testing House at Dharmavaram, Andhra Pradesh, a unit of the Central Silk Technological Research Institute (CSTRI) under the Central Silk Board (CSB). "Laboratory Information Management System" means the software that records who sent a sample, what tests were asked for, what the testers measured, who checked it, what certificate was issued, and what happened to the sample afterwards. The system is a standalone application. It owns its own customer master, its own tax-invoice numbering, its own consumable stock records and its own equipment register, and it needs no other business software to run a day's work. The unit operates no external accounting system, so there is nothing for a laboratory layer to sit on top of. If one is ever adopted, the machinery for exchanging customers, invoices and stock movements with it is specified in M22 and delivered switched off. This document defines the whole application.

The document is written to be read by two different people at the same time. **The scientist and Unit Incharge** should read Sections 1 to 6 (purpose, background, goals, roles, glossary, scope) and then the specific module sections that describe his own work — sample registration, result entry, approval, certificates, and the registers and returns the unit must produce. He should treat every item marked **OPEN-Q** as a question addressed directly to him: nothing in this document invents a fact about the lab that has not been confirmed. **The implementing developer** should read every section, and should treat the numbered requirements as the work list, the tables as the data definitions, and the acceptance checks as the tests to write. Where the document says [MUST], the system is not finished without it. Where it says [SHOULD], it is needed but can follow shortly. Where it says [LATER], it is deliberately deferred to a later phase and must not consume phase-1 effort.

#### What the first note got right

The original ten-point discussion note written by the scientist is the foundation of this document, and its instincts were sound. It was right that everything begins with a properly maintained customer master, and that the same customer record must feed both the invoice and the certificate — that single decision prevents a great deal of duplicate typing and mismatched names. It was right that a sample must generate its own trackable unit of work with its own unique number, so that five samples do not become one undifferentiated pile. It was right, and unusually thoughtful, to insist that the tester should not see the customer's identity — that is a genuine impartiality control that many accredited laboratories do not implement, and it is retained and strengthened here. It was right that no report may be generated until an authorised person has verified and approved the test log. It was right that each certificate should carry a QR code so that a customer, a buyer, an auditor or a bank can check the document digitally instead of telephoning the lab. And it was right to name equipment calibration and internal testing stock as modules in their own right rather than afterthoughts, because both of them decide whether a test result can be defended a year later.

This document extends that note; it does not replace it. Three things are changed rather than added, and the reasons are given plainly in the sections that follow. First, the order of the first two steps is reversed: the process starts with a **test request** that the lab reviews and accepts, and the invoice follows from it, because the charge for a silk lot cannot be known before the material is counted and inspected. Second, the word "job" is retired as the name of a record type, because in the original note it stood for four different things: they are named separately here as the **test request** (what the customer asked for), the **sample** (the physical material), the **allocation** (one test on one sample — the assignable unit of work) and the **worksheet** (one person's bench session covering many allocations). One sample commonly carries four or five different tests that different people perform on different days, so the sample cannot be the unit of work. Third, a record-keeping backbone is added underneath everything (audit trail, method versions, equipment status, environmental conditions, retention and disposal) because that backbone is what turns a workflow tool into a laboratory record that survives an audit, a dispute, or a change of staff.

---

### 2. Background and current situation

#### 2.1 What the laboratory is

RSTRS Dharmavaram is a government silk and textile testing laboratory. It sits under CSTRI, Bengaluru, which in turn sits under the Central Silk Board — a statutory body established by the Central Silk Board Act, 1948, under the Ministry of Textiles, Government of India. The unit was formerly named "Silk Conditioning and Testing House (SCTH)" and both names are still in use locally. Its published address places it near the Government Cocoon Market at Regatipalli, Dharmavaram, Ananthapur District, Andhra Pradesh.

The unit does two kinds of work. The larger part is **commercial testing for outside parties**: silk reelers, twisters, weavers, traders, handloom units, co-operative societies, exporters, other government departments, and occasionally Customs. The smaller part is **internal work**: research samples from CSTRI's own divisions and from other CSB units, which are tested free of charge on an advisory basis but still need full records and a report. The unit also runs training, demonstrations, awareness programmes and field visits, and its published rate card includes non-testing charges such as machine rent per year, warping charges per warp and cocoon stifling per thousand cocoons. A system that models only tests would miss a real share of what the unit charges for and reports on.

Two facts about the workload shape the entire design and must be kept in view throughout this document.

**Fact one: the volume is high and the price per test is low.** For the financial year 2021-22, the unit's published figures were 11,294 silk and cocoon samples tested for total revenue of ₹7,56,789 — an average of roughly ₹67 per sample. Of those, approximately 11,071 (about 98 per cent) were a single test type, the "Limited test", priced at ₹50, performed in daily batches of ten to thirty lots. The remainder was a small number of full ISA gradings, twist tests, twisted-yarn denier tests and water tests. The practical consequence: a screen that takes ninety seconds per sample cannot process eleven thousand samples a year. Fast batch entry of many lots of the same test is the primary user-interface requirement, not a per-sample wizard.

**Fact two: one test result belongs to a lot, and a lot contains many physical pieces.** For raw silk the physical hierarchy runs: filament → skein (hank) → book (about 5 kg) → bale (about 60 kg) → lot (the unit of grading). One lot yields several bales, each bale several books, each book several skeins; from the skeins the lab winds bobbins; from the bobbins it reels sizing skeins and prepares inspection panels; and each of those levels produces its own readings — 6 skeins for conditioned mass, 10 bobbins for winding, 20 panels for evenness, 40 or 80 sizing skeins for size deviation. A single "the sample has a result" table cannot hold this.

#### 2.2 How the work is most likely done today — assumption to be confirmed

> **This whole sub-section is an assumption.** It is reconstructed from what is publicly documented about CSB testing units and from how comparable government laboratories in India operate. It has **not** been confirmed with the Dharmavaram unit. It is written down here so that the scientist can read it and correct it in one sitting. Every sentence in it should be treated as a question, not a finding. See **OPEN-Q-A1** to **OPEN-Q-A4** below.

A customer arrives at the counter — often on foot, since the unit is beside the Government Cocoon Market — carrying skeins, cones, a bale sample or a fabric piece. A staff member writes the customer's name, the material, the number of pieces and the tests wanted into a **bound paper register**, allots the next serial number by hand, writes that number on a paper tag tied to the sample, and issues a hand-written receipt for the money taken. The sample is carried to the testing room and left on a bench or a rack.

The tester picks up the sample, performs the test, and writes the readings on a **loose worksheet or directly into the register** — for a Limited test, twenty individual skein weights, from which the average denier and the deviation are computed. Some of that arithmetic is done on a calculator and some by an existing piece of "inbuilt denier software" on a test-room PC. The Unit Incharge looks at the worksheet, agrees or disagrees, and then a report is **typed into a Word template or an Excel sheet**, with the customer's name, the sample particulars and the results copied across by hand. It is printed on the unit's letterhead, signed with a pen, stamped, and handed over or posted. A copy goes into a paper file. Separately, someone maintains **Excel sheets** for the monthly and annual return to CSTRI/CSB headquarters: number of samples by test type, revenue collected, pending work, staff strength.

Equipment calibration certificates are kept in a **physical folder**. Calibration due dates live in somebody's memory or on a wall chart. Chemicals and consumables are recorded in a **stock register**, with lot numbers and expiry dates written down if at all. The record of which balance was used for which test does not exist in writing.

#### 2.3 The concrete pain this causes

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

#### 2.4 Open questions on the current situation

**OPEN-Q-A1:** Which paper registers exist today, exactly what columns does each have, and which of them must the software replace versus continue to exist on paper alongside it? — *Recommended default:* assume a sample-intake register, a report-issue register, a fee-receipt register, an equipment calibration folder and a consumable stock register; the software replaces the first three and mirrors the last two; nothing is switched off until the scientist confirms in writing that the printed equivalent from the software is acceptable to internal audit.

**OPEN-Q-A2:** What software and spreadsheets are in use today, and in particular what is the "inbuilt denier software" on the test-room PCs — can it export a file, and if so in what format? — *Recommended default:* assume it cannot export, and that the LIMS must re-implement the size and deviation statistics itself; treat any export capability as a bonus that removes typing rather than as a dependency.

**OPEN-Q-A3:** How many staff will use the system at once, how many computers exist in the unit, is there a local network, and what is the internet and power situation? — *Recommended default:* assume three to six concurrent users, two to four computers, a wired local network to be installed if absent, unreliable internet and frequent power interruptions; therefore assume the system must run on a single server inside the laboratory and must keep working with the internet down.

**OPEN-Q-A4:** What is the exact current format of the monthly and annual return sent to CSTRI/CSB headquarters? — *Recommended default:* obtain a copy of the last twelve months' returns as the very first requirement-gathering artefact; the software must produce that exact format without manual Excel work, because the return is the one report the unit is judged on, and a system that cannot produce it will be bypassed.

---

### 3. Goals, non-goals and success measures

#### 3.1 Goals

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

#### 3.2 Non-goals

The following are deliberately **not** part of this project. They are listed so that they cannot creep in.

| # | Not doing | Why not |
|---|---|---|
| N1 | Payroll, salary, leave, attendance, service records, pension | Handled by departmental systems. No overlap with laboratory work. |
| N2 | General financial accounting — ledgers, budgets, grants, expenditure heads, trial balance | The unit's accounts wing owns this, on whatever books it already keeps. The LIMS raises test invoices and records receipts; it does not keep the books. |
| N3 | Procurement workflow — indent, sanction, tender, GeM purchase, purchase order approval | Existing government process. The LIMS records what stock arrived and what it was used for. |
| N4 | Fixed-asset accounting, depreciation, condemnation committees, annual physical verification of assets | The LIMS holds the **metrological** equipment register — calibration, checks, status — and a working record of each instrument's purchase, cost and expected life, which calibration and traceability need. Fixed-asset accounting itself — capitalisation, depreciation, condemnation — belongs to the parent institute and the unit's accounts wing. Both records exist; they are not the same register. |
| N5 | Research data analysis, statistical modelling, publication figures | Scientists use their own tools. The LIMS holds records; it is not an analysis package. |
| N6 | Direct control of instruments — starting a test, setting a machine, driving a motor | Out of scope entirely and permanently. |
| N7 | Automatic reading capture from instruments in phase 1 | Deferred. Manual entry, hardened with validation and printout attachment, is the phase-1 answer. File import is a later phase. See M6. |
| N8 | Replacing the national CSB online booking portal (csbsilktesting.res.in) or its mobile app | That portal is a CSB-level system. This project treats it as one possible **inbound source** of test requests, not as something to replace. See **OPEN-Q-A5**. |
| N9 | Rolling out to other CSB units in phase 1 | The design must not *prevent* it (unit codes and per-unit configuration are built in), but no second unit is deployed in this phase. |
| N10 | Pushing certificates into DigiLocker | Requires CSB headquarters sponsorship and a nationwide issuer identity. Later phase. |
| N11 | Trainings, demonstrations, awareness programmes, field visits as full workflow modules | Recorded as simple counts for the headquarters return only. Full workflow deferred. |
| N12 | Non-testing chargeables (machine rent, warping, stifling, test-dyeing, training fees) as their own modules | Priced and invoiced as catalogue lines through M17. No separate workflow. |
| N13 | Multi-language user interface in phase 1 | English interface. Customer-facing documents and messages must support Telugu; the internal screens need not. See M8 and M19. |

**OPEN-Q-A5:** Is the intended scope (a) the internal laboratory workflow only, with the national CSB portal continuing as an outside booking channel, (b) a replacement for the portal at Dharmavaram, or (c) both, with an integration between them? — *Recommended default:* (a). Build the internal LIMS, and give every order an `order_source` field with values such as WALK_IN, POST, COURIER, CSB_PORTAL, EMAIL, INTER_UNIT, so that a portal integration can be added later without changing the data structure.

#### 3.3 Success measures

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
| S11 | Paper registers still being maintained in parallel | Physical count during a walk-round | All of them | Registers named in OPEN-Q-A1 as replaceable are no longer written in |
| S12 | Successful restore of a backup onto a clean machine | Documented drill | Unknown; likely never tested | Passed at least once before go-live, then once a quarter, each drill logged |

---

### 4. Who uses the system (roles and their day)

#### 4.1 Role table

The word **role** means a named set of permissions. A person is given one or more roles. In a small unit one person will hold several roles — that is expected and permitted, but the system must **record** the overlap (for example, that the same person performed and approved a test) so the lab can justify it and monitor how often it happens.

Two things are enforced separately and must not be confused:

- **Role permission** — which screens and actions a person can reach at all.
- **Technical authorisation** — whether that specific person is authorised for that specific method and that specific activity on that specific date. A person may hold the Tester role and still be refused entry of a result for a method they are not authorised for. This is covered in module M13.

One role, several names — the synonyms used elsewhere in this document are recorded here so that no reader has to guess: the **Front Desk / Receipt Clerk** below is the **Sample Receipt Clerk** of Part B's step list; the **Store Keeper** below is the **Store Keeper / Equipment Custodian** of Part D; and the **Approving Authority** is referred to by post as the **Unit Incharge**, the officer in charge of the Dharmavaram unit. Part B §8.4 retires the older label "Lab In-Charge", because it was used for two different offices — the officer who signs reports (the Approving Authority) and the sectional supervisor (the Section Head).

| Role | What they do in the system | What they must never be able to do |
|---|---|---|
| **Front Desk / Receipt Clerk** | Create and edit walk-in customer records; record enquiries; raise a test request (TRF); record sample receipt with condition, quantity, packing state and photographs; print sample labels; print the numbered acknowledgement slip; record cash, demand draft or online payment references; issue the money receipt; answer status enquiries; record customer telephone and counter conversations against the Test Request or complaint (M19-14); record sample return or handover to the customer with the receiver's name. | Enter or change a test reading. Approve or verify a result. Sign or issue a certificate. Change a price on a rate card. Waive a charge. Delete any record. Change another user's permissions. |
| **Approving Authority (Scientist, e.g. Scientist-D; the Unit Incharge at Dharmavaram)** | Review and accept or decline a test request (the recorded capability check); accept a sample with a recorded deviation after consulting the customer; reject a sample with a coded reason; allocate and re-allocate tests; approve or send back a submitted result; authorise and sign the certificate; authorise an amendment or withdrawal of an issued certificate; authorise disposal of retained samples; authorise a break-glass override (expired calibration, expired reagent, unauthorised analyst) with a mandatory reason; unmask a customer identity for a tester on request; raise and close non-conformances; approve a waiver or concession within his delegated limit; view everything. | Alter a raw reading recorded by a tester — he may only approve it or send it back for correction. Delete any record. Edit an already-issued certificate (only amend or replace it). Sign for a test parameter he is not an authorised signatory for. Change the audit trail. |
| **Section Head (sectional supervisor)** | Review and accept, decline or send back for clarification a test request, alongside the Approving Authority (Part B §7.2 step 5); assign and re-assign each allocation to a tester who is authorised for that method and against an instrument that is within calibration validity, and set or adjust its due date (Part B §7.2 step 11); move a sample out of Accepted or Conditioning; put a sample or an allocation on hold with a coded reason and release it; retract a submitted result to the tester with a recorded reason; watch the section's queue, its overdue list and its workload. *In a small unit this is usually the same person as the Approving Authority; the roles are kept separate so the record shows in which capacity the person was acting. See OPEN-Q-A6.* | Enter or change a raw reading. Sign or issue a certificate unless separately authorised as a signatory. Verify or authorise a result they performed themselves without the system recording the overlap. Delete any record. Change the audit trail. |
| **Technical Manager** | Own the method master: create and version methods, record method verification and validation, activate and supersede method versions, define parameters, formulae, rounding rules, replicate counts and specification/grade tables; approve method deviations; define which instruments and consumables a method requires; second-level technical review where the lab uses two levels. *In a small unit this is usually the same person as the Approving Authority; the roles are kept separate so the record shows which capacity the person was acting in.* | Enter a test reading and then approve their own result without the system recording the overlap. Change an issued certificate. Change financial data. |
| **Quality Manager** | Own the quality registers: non-conformances, corrective and preventive actions, customer complaints, internal audits, management review inputs, risk register, quality control plans and control charts, proficiency-testing and inter-laboratory comparison records; run the document control register for standard operating procedures and forms; review the audit trail and the override log; review the customer-unmasking log; own the personnel competence and authorisation matrix records. | Approve a technical result or sign a certificate (unless separately authorised as a signatory). Close a complaint about work they themselves performed — the system must block this. Alter a reading or an issued certificate. |
| **Tester / Analyst** | See only their own allocated work queue; open a test by scanning the sample label; record sub-sample preparation and conditioning; enter raw readings; attach the instrument printout or a photograph; select the instrument and consumable lot actually used; record room temperature and humidity where the method requires it; add remarks and defect narratives; submit the result for verification; request unmasking of the customer identity with a reason. | See the customer name, address, contact details, GSTIN or the invoice value. See the price of the test. Approve or verify any result, including their own. Edit a reading after submitting it (they must ask for it to be sent back). Enter a result against an instrument that is out of calibration or a consumable lot that has expired, unless the Approving Authority records an override. Export customer data. |
| **Verifier (technical checker)** | Pick up a submitted result and check the readings, the arithmetic, the instrument and reagent status, the environmental conditions and the plausibility of the result (Part B §7.2 step 16); record the outcome as **Verified** or **Sent back with a coded reason and an explanation**; sign the verification record electronically. *Wherever staffing allows this is somebody other than the tester who did the work.* | Change a reading or a computed result — the only two permitted actions are verify and send back. Authorise or sign the report: verification and authorisation are separate acts (WF-11, M7-01). Verify their own work unless the overlap is permitted and recorded by the exception route in OPEN-Q-A7. Delete any record. |
| **Report Writer** | Compile the draft report from the verified allocations of a sample, choose the report type and template, check the printed particulars against the sample record, and pass the draft to the Approving Authority for authorisation (Part B §7.2 step 17); move a sample out of Testing Complete. All printed values are frozen into the draft at this point. *In a small unit this is usually the Approving Authority or the Front Desk clerk; see OPEN-Q-A6.* | Change a reading, a computed result or a grade. Authorise, sign or issue the report. Allot the report number — it is allotted on authorisation (Part B §7.2 step 18). Compile a report from an allocation that is not Verified. Delete any record. |
| **Store Keeper** | Receive consumables and reference materials; record lot number, quantity, expiry, storage conditions and the certificate of analysis; move a lot from quarantine to approved; record issue of a lot; record stock on hand and physical verification; manage retention storage locations; record sample movement into and out of the retention store; record disposal after the Approving Authority authorises it; record return of samples to customers. | Approve a lot for use without the defined acceptance record. Authorise disposal on their own. Enter or approve a test result. See customer identity beyond what is needed for a physical handover (name of the person collecting, which is recorded at handover). |
| **Accounts / Cashier** | Raise and issue invoices, bills of supply, receipt vouchers, credit and debit notes and refund vouchers; record receipts by cash, demand draft, cheque, NEFT/RTGS, challan, online gateway or bank collection; reconcile bank statement lines against receipts; maintain the customer running account; place work on payment hold with the reason recorded, and release it; produce the daily collection and remittance reconciliation, the receivables ageing and the revenue statements. | Change a test result, a grade or a certificate. Approve or issue a certificate. Suppress a technical release decision — a payment hold must be an explicit, logged, separate state, never a silent block on the science. Delete an issued invoice (only cancel it, before it is reported in a tax return). |
| **System Administrator** | Create and deactivate user accounts; assign roles; configure numbering series, working calendar, notification templates, report templates, tax configuration and system settings; run and verify backups and restore drills; maintain the system incident log; apply software updates under change control. | Enter, change or approve a test result. Sign a certificate. Change or delete any row in the audit trail or the state-transition log. View masked customer identity data unless separately granted the customer-identity permission. Grant themselves an approval or signatory authorisation. |
| **Customer (external, self-service)** | Log in with their own account; see the status of their own samples and test requests; download their own issued certificates and invoices; see the history of their own past reports; generate a time-limited share link so a buyer or bank can verify a specific certificate; raise and track a complaint or grievance; update their own contact details; give or withdraw consent for notifications. | See any other customer's data. See internal remarks, non-conformance records, the tester's identity, or the raw audit trail. Change any test data. See a draft or unapproved result. |
| **Public Verifier (anonymous, no login)** | Scan the QR code on a printed certificate, or type a certificate number into the published verification page, and see: whether the document is genuine, its number and date, the issuing laboratory, a short sample description, the certificate's live status (valid, superseded, withdrawn) and a document fingerprint they can check against their own copy. Optionally, if the lab enables it, the headline result. | See the customer's full name, address, contact number or GSTIN. See the detailed measured values. Enumerate or browse other certificates. See any internal record. Retrieve anything by guessing a serial number without the signed code or an additional check. |
| **Auditor (read-only — escorted access, no separate login in phase 1)** | Read everything, including the full audit trail, state-transition history, override log, unmasking log, all registers, all frozen certificate files, calibration and competence records, and the quality registers; export any register to a readable file. Used by internal audit, NABL assessors, CAG audit and RTI response. *Phase 1 builds no separate Auditor login. The need is served under escort, on a staff member's session, by the M20-37 audit-trail extract, the M21-13 printable permission matrix and the NFR-120 application-independent export, against a recorded confidentiality undertaking (M21-81). See OPEN-Q-A8.* | Change, add or delete anything at all. |
| **CSB HQ / CSTRI (consolidated view — no HQ login in phase 1)** | See consolidated, unit-level statistics: samples received and tested by material and test type, revenue by head, pending workload, turnaround performance, equipment status, staff strength, training counts — that is, everything the monthly and annual return contains, plus the ability to see the submitted return snapshots. *Phase 1 builds no HQ login. Headquarters receives the monthly return (M20-38), the annual return (M20-42) and the stored submitted-return snapshots (M20-40) as transmitted files; see non-goal N9 and OPEN-Q-T28.* | See individual customers' identities or their individual results, unless the customer has been informed in advance that such data may be used, per the confidentiality rules in M21. Change any unit-level record. Approve or sign anything on the unit's behalf. |

**OPEN-Q-A6:** Which named people at the unit hold which roles today, and specifically who other than the Unit Incharge may approve a result or sign a certificate? For each such person, which test disciplines are they authorised for? And is each of the Section Head, Verifier, Report Writer and Technical Manager roles above a separate post held by a separate person, or are they all held by the Unit Incharge himself — that is, is this one office or several? — *Recommended default:* configure the Unit Incharge as the only signatory at go-live, with one named alternate for periods of tour or leave, and add others only against a written competence record. Obtain the unit's declared-signatory list if the lab holds accreditation. Assume the Unit Incharge also holds the Section Head, Technical Manager and Report Writer roles, and that the Verifier is a different person wherever staffing allows (Part B §7.2 step 16); where staffing does not allow it, the overlap is permitted and recorded by the route in OPEN-Q-A7 rather than hidden. The roles stay separate rows in §4.1 even when one person holds them all, because the record must show in which capacity the person acted.

**OPEN-Q-A7:** Where the same person must both perform and approve a test (very likely in a three-person unit), does the lab want the system to (a) block it, (b) permit it and record the overlap on the allocation, or (c) permit it only with a second person's countersignature? — *Recommended default:* (a), with a recorded, dated exception — not (b). The system enforces segregation by default: performer ≠ checker, checker ≠ authoriser, and at minimum performer ≠ authoriser (M13-10, WF-12, WF-76, M7-04). Work is never blocked outright, but the permission is always someone's named, dated decision rather than a silent allowance — by the Approving Authority's justified per-action override (M13-10), by single-analyst mode configured per section (WF-12), or by the Unit Incharge's small-laboratory exception for a named method and a stated period (M7-05). Every occurrence is recorded on the allocation and on the report (M5-12) and counted in the monthly override and exception report (M20-35), so the lab can still state honestly how often it happens and why. See also OPEN-Q-B2 in Part B, which asks the same staffing question for the tester-and-verifier pair; verification and authorisation are separate acts (WF-11, M7-01).

**OPEN-Q-A8:** Does any assessor or auditor require a login of their own, rather than escorted read-only access on a staff member's session — and if so, does internal audit, a NABL assessor or CAG audit ask for the read-only property to be enforced below the application rather than in the interface? — *Recommended default:* no separate Auditor or CSB HQ login in phase 1. Serve an assessor under escort with the M20-37 audit-trail extract, the M21-13 printable permission matrix and the NFR-120 export, and serve headquarters with the transmitted returns and snapshots. If an assessor or auditor asks in writing for their own login, add it as a named, time-boxed, read-and-print-only role in a later phase, together with the confidentiality undertaking; do not promise an enforcement level below the application until the lab has asked for it.

#### 4.2 A day in the life

**Front Desk / Receipt Clerk.** The morning is busy because the cocoon market is busy. A reeler arrives with five bundles of skeins and wants Limited tests. The clerk finds the reeler in the customer list by mobile number — no re-typing a name that is already there in three spellings — confirms the declared denier as 20/22, and raises one test request for five samples. She scans nothing yet; the samples do not officially exist until they are checked in. She counts the pieces, notes that one bundle's packing is torn and photographs it on the tablet, and marks that sample as accepted with a recorded deviation after the Approving Authority nods. She presses one button and five labels print, each with the sample number, material, piece count, due date, test short-codes and a QR code — and, deliberately, no customer name. She ties the labels on, prints the numbered acknowledgement slip listing the five sample numbers, the tests, the expected date and the charge, takes ₹250 in cash, issues the money receipt from the system, and puts the samples in the intake tray. When the same reeler telephones at four o'clock, she types the sample number, sees "in test, allocated to Tester 2, due tomorrow 11:00", and says so — in about eight seconds.

**Tester / Analyst.** He logs in and his queue shows fourteen tests allocated to him, sorted by due time, each identified by a sample number and a description — Raw silk, 5 skeins, 20/22 D declared — and nothing about who sent it. He scans the label of the first lot; the correct result-entry sheet opens directly, already showing the method and version, the twenty reading slots the method requires, and the balance he is expected to use. The system will not let him proceed with the balance he first selects, because its calibration expired on the fourteenth; he picks the other balance, and a note appears on the record that the first was unavailable. He weighs, and types twenty values; the average denier, the deviation and the coefficient of variation appear as he goes, and one reading that is far outside the plausible range is highlighted in amber for him to re-check rather than silently accepted. He photographs the printout from the denier PC and attaches it. He types a remark about two breaks and their cause, because the method requires break causes to be reported. He submits. The row leaves his queue and appears on the verifier's, and then on the Approving Authority's. He no longer has the ability to change the numbers, which is the point.

**Approving Authority (the Scientist, as Unit Incharge).** He opens the system at nine and the first screen tells him what he actually needs: eleven samples in the building, twenty-six tests not yet started, nine results waiting for his approval, two tests already overdue, one balance due for calibration in six days, and one consumable lot expiring this month. He accepts three new test requests, each of which records that he confirmed the lab has the method, an authorised person and a calibrated instrument for every test asked for. He works through the approval queue: seven he approves, and for one he presses "send back", picks the reason "calculation to be re-checked" from the list, and types a line of explanation — the tester will see it, the original submitted values are kept, and the send-back is counted against the first-time-right measure rather than quietly forgotten. He then generates and signs eight certificates in one batch; each is frozen as a file with a fingerprint, given its number and its QR code, and the sample moves to the retention shelf with a retention date. At noon a trader disputes a conditioned-mass figure from three weeks ago; he opens that certificate, sees every tare component, both moisture sets, the oven-dry mass and the 11 per cent addition line by line, together with which balance and which oven were used and who checked the arithmetic, and settles the argument in four minutes with the screen turned towards the trader. At the end of the month he presses one button and the return to headquarters is produced in the format headquarters wants, and a frozen copy of exactly what was sent is kept.

---

### 5. Glossary

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

### 6. Scope: what we are building, in one page

#### 6.1 In scope — the twenty-two modules detailed in this document

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

#### 6.2 Out of scope for phase 1

- **Automatic capture of readings from instruments.** Manual entry with strong validation and an attached instrument printout is the phase-1 answer. File import from a watched folder and serial capture from balances are later phases.
- **Two-way integration with the national CSB online testing portal.** Test requests arriving from it are recorded with a source flag; no live interface is built.
- **A live interface to an external accounting system.** The LIMS owns its customers, its tax invoices and its stock outright. M22 specifies the interface generically and it is delivered switched off, because there is no such system here to connect to.
- **DigiLocker issuance of certificates.** Requires CSB headquarters sponsorship. The design keeps a stable document identifier and a machine-readable copy of each report so that it becomes configuration work later.
- **Deployment at other CSB units.** Unit codes and per-unit configuration are built in so it is possible, but only Dharmavaram goes live.
- **Multi-language user interface.** English internal screens. Telugu is required for customer-facing documents and messages only.
- **Full workflow for trainings, demonstrations, awareness programmes and field visits.** Counts recorded for the headquarters return; no workflow.
- **Payroll, leave, attendance and service records.**
- **General financial accounting beyond test invoicing and receipts** — ledgers, budgets, expenditure heads and the trial balance stay with the unit's accounts wing.
- **Procurement workflow** — indent, sanction, tender, purchase order approval.
- **Fixed-asset financial accounting, depreciation and condemnation.** The metrological equipment register is in scope, together with the working record of what each instrument cost, because calibration and traceability need it. The financial asset register, with its capitalisation and depreciation, belongs to the parent institute and the accounts wing.
- **Research data analysis and statistical modelling for publications.**
- **Any form of instrument control.**
- **Mobile applications.** A browser interface that works acceptably on a tablet is sufficient; a native application is not built.

<<<PAGEBREAK>>>

## Part B — How the Laboratory Will Work

### 7. The corrected end-to-end workflow

#### 7.1 What the draft note proposed

The discussion note written in the unit proposed this sequence, quoted in its own words:

> Customer Creation → Invoice Creation with Multiple Tests → Sample Received Entry → Auto Job Creation for Each Sample → Job Assignment to Testing Team → Tester Log Entry → Test Log Approval → Test Report Generation with Sample Image → QR Code-Based Online Report View

That is a good and honest summary of a conversation. It is not yet a workflow that a laboratory can be audited against, and three parts of it will break in normal daily use. This section sets out the corrected flow and states plainly what changed and why.

#### 7.2 The corrected flow, as a numbered step list

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

#### 7.3 What changed, and why

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

#### 7.4 The corrected flow as a diagram

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

#### 7.5 The one-line version (for the front of the document)

```
Customer -> Enquiry -> Quotation -> Test Request (reviewed, capability confirmed)
-> Sample received and accepted -> Sub-samples and conditioning
-> Test Allocations, one per sample x test -> Readings -> Result
-> Technical Verification -> Report authorised and signed -> Invoice
-> Report issued with QR -> Sample retained / returned / disposed
     (with a formal Amendment path if an error is found after issue)
```

#### 7.6 Workflow rules for the overall flow

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

**OPEN-Q-B1:** Does the unit currently require payment before testing, before report release, or neither, and does the answer differ by customer class (for example advance from traders, none from government departments)? — *Recommended default:* payment required before **report release**, not before testing, with the order-type value on for Commercial and off for Internal R&D, Inter-unit referral and Statutory / scheme, and per-customer-category overrides seeded to *Not required* for Government Department, CSB Internal Unit and CSB Internal R&D so that a government department placing a Commercial order is not held.

**OPEN-Q-B2:** With three or four technical staff, is a verifier who is different from the tester achievable for every test, or only for some? — *Recommended default:* enforce tester ≠ verifier as the rule, permit a recorded override, and review the override count monthly. State the position honestly in the quality manual rather than claiming a separation that cannot be kept.

**OPEN-Q-B3:** Should one report be allowed to cover several samples (for example one certificate for a 20-bale conditioning lot), or is it strictly one report per sample? — *Recommended default:* allow one report to cover many samples of the same order, controlled by a per-report-type setting, because the conditioning and grading customers expect a single certificate.

**OPEN-Q-B4:** Is the Tatkal same-day scheme (double charge, maximum 5 samples, booked before 11:00, only tests completable within 6 hours) actually used at Dharmavaram? — *Recommended default:* build the priority flag and the eligibility rules, leave the scheme disabled in configuration until the unit confirms.

---

### 8. Core things the system keeps track of

This section is the vocabulary of the whole project. Once these words are agreed, the screens, the database tables and every future meeting should use exactly these words and no others.

#### 8.1 The entities, in plain language

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
*It is NOT a Sub-sample and NOT a Test Allocation.* Deciding what counts as one sample is a decision the lab must make per sample type, and it is recorded in the Sample Type master — see OPEN-Q-B5.

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

#### 8.2 How they relate

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

#### 8.3 Settled vocabulary — use exactly these words

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

#### 8.4 Words we will stop using

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

**OPEN-Q-B5:** For each sample type, what counts as **one sample**? Specifically: for conditioning, is one bale one sample with the lot as a grouping, or is the lot one sample with per-bale readings? For a multi-cone twisted-silk submission, is each cone a sample? — *Recommended default:* the **grading or settlement unit** is the Sample, and the physical bales, books, cones or skeins inside it are Sub-samples. For conditioning that means the **lot** is the sample and each bale contributes readings. Confirm per sample type before any code is written; this decision cannot be changed later without re-registering history.

**OPEN-Q-B6:** Does the unit still issue conditioned-mass / weight certificates, how many a year, and under which rate head are they billed? — *Recommended default:* build the Conditioning Certificate as a report type with its own number series and its own tare build-up form, but schedule it after the high-volume Limited Test path, and do not assume volume.

---

### 9. Sample and test allocation lifecycle

Two state machines, coupled. The **Sample** state describes where the physical silk is and what may be done to it. The **Allocation** state describes the progress of one test. The Sample state is largely **derived** from its allocations and is written by one service function only, never by scattered screen code.

#### 9.1 Table A — Sample states

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

#### 9.2 Table B — Test Allocation states

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

#### 9.3 Every unhappy path, and where it lives

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

#### 9.4 Transition rules

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

**OPEN-Q-B7:** What retention period applies to each sample type, and what is the default disposition — return to customer, retain then dispose, or dispose immediately? — *Recommended default:* raw silk and twisted silk retained 3 months then disposed; cocoons disposed immediately after test (perishable); fabric and zari retained 6 months; water and chemical samples disposed after test. Confirm against the unit's quality manual and against any scheme-specific requirement before go-live.

**OPEN-Q-B8:** Which abort and rejection reasons are chargeable to the customer, and which are not? — *Recommended default:* material-related causes (insufficient quantity, sample not conforming to declaration, sample unusable as submitted) are chargeable at a handling fee if the sample was already registered; laboratory-caused failures are not chargeable. A waiver above a configured amount requires the Unit Incharge's recorded approval.

**OPEN-Q-B9:** Is the daily cut-off time for starting the turnaround clock the same as the Tatkal 11:00 booking cut-off, or different? — *Recommended default:* two separate configured times — a turnaround cut-off (suggest 16:00) and the Tatkal booking cut-off (11:00).

---

### 10. Numbering schemes

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

#### 10.1 The series

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

#### 10.2 The ULR format in detail

The Unique Laboratory Report number is **in addition to** the laboratory's own report number, not a replacement for it. Both print on the report. The format depends on the format of the laboratory's NABL accreditation certificate number. All three forms below must be supported, because the accreditation system is mid-transition.

| Certificate format held | ULR structure | Total length | Worked example |
|---|---|---|---|
| **New format** `NABLFMMYYSCXXXXX` | `NABL` + field letter + month of grant (MM) + year of grant (YY) + two-letter State code + 5-digit certificate serial + **year of this report (YY)** + **8-digit running number** | 26 characters | Certificate `NABLT0626MP20001`, first report of 2026 → `NABLT0626MP200012600000001` |
| **Legacy 5-digit** `TC-XXXXX` | `TC` + 5-digit serial (hyphen dropped) + year of report (YY) + 8-digit running number | 17 characters | Certificate `TC-11516`, report 42 of 2026 → `TC115162600000042` |
| **Legacy 4-digit** `TC-XXXX` / `CC-XXXX` / `RC-XXXX` | First letter (`T`, `C` or `R`) + `C` + 4-digit serial + year of report (YY) + 8-digit running number | 16 characters | Certificate `TC-4779`, report 42 of 2026 → `TC47792600000042` |

In the field-letter position of the new format: `T` = Testing, `C` = Calibration, `M` = Medical, `P` = Proficiency Testing Provider, `R` = Reference Material Producer, `B` = Biobank. The two-letter State code is `AP` for Andhra Pradesh.

Two things that older guidance contains and the current format does **not**: there is **no location digit**, and there is **no trailing `F`** flag. Any implementation copied from a pre-2026 article will be wrong.

#### 10.3 Numbering rules

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

**OPEN-Q-B10:** Does the unit maintain **separate registers and separate number series for Physical Testing and Chemical Testing** — the monthly revenue sheets count PTS, PTA, CTS and CTA separately — and if so what do those four abbreviations stand for? — *Recommended default:* build the sample series with an optional division component (`PT` / `CT`) that is switched off until confirmed, because retro-fitting a division into an existing number series is not possible. Ask the unit before the first sample is registered.

**OPEN-Q-B11:** Are there **existing legacy number series** in the paper registers that must be continued rather than restarted — for report numbers, money receipts and conditioning certificates in particular? What is the last number used in each? — *Recommended default:* continue every existing series from its last used number, recorded under WF-112, and start no series at 1 without written confirmation.

**OPEN-Q-B12 — ANSWERED.** *Question was:* is the unit itself NABL-accredited, and if so what is its accreditation certificate number and format? **Answer, confirmed against the certificate itself:** yes. The unit holds accreditation in its own right, separate from the Bengaluru laboratory. The certificate reads: legal entity **Central Silk Board**; accredited facility **Textile Testing Laboratory, Regional Silk Technological Research Station, Central Silk Technological Research Institute**, at **D. No. 25-650, Parthasaradhi Nagar, Regetipalli Road, Dharmavaram, Sri Sathya Sai, Andhra Pradesh, India**; field **Testing**; standard **ISO/IEC 17025:2017**; certificate number **NABLT0726AD18713**; issued **17/07/2026**; valid until **16/07/2030**.

Consequences, all of which are now settled rather than assumed:

- The certificate number is in the **current (2026) format**, `NABLFMMYYSCXXXXX`, not the legacy `TC-XXXXX` form. Therefore the Unique Laboratory Report number is built by **format (a) and is 26 characters**: the 16-character certificate number, then the two-digit year of the report, then an eight-digit running number restarted each calendar year. For the first report of 2026 that is `NABLT0726AD18713` + `26` + `00000001` = `NABLT0726AD187132600000001`. The unit never needs the legacy 16- or 17-character forms, though WF-107 keeps the builder configuration-driven so a future re-issue in another form costs no code change.
- Decoding the certificate number for the configuration record: `NABL` literal, `T` = Testing, `07` = month granted, `26` = year granted, `AD` = the two-letter State code as printed on this certificate, `18713` = the five-digit serial. **Note the State code is `AD`, not the `AP` that might be expected for Andhra Pradesh — take it verbatim from the certificate and never derive it.**
- The accreditation symbol and the ULR are **switched on** for this unit, subject to the per-test scope rule below.
- The **validity dates are configuration**, not constants: the symbol and ULR suppress automatically after 16/07/2030 unless renewed (M8-35).

**OPEN-Q-B12a — ANSWERED:** which tests are inside the accredited scope? The scope annexure to certificate `NABLT0726AD18713` has been obtained and lists **exactly seven accredited entries**, all in the discipline and group *MECHANICAL — TEXTILE MATERIALS* and all under *Permanent Testing*: Fabric / Length / IS 1954; Fabric / Mass / IS 1964; Fabric / Number of Threads Per Unit Length / IS 1963; Fabric / Percentage by Weight of Warp and Weft Yarn / IS 17208; Fabric / Width / IS 1954; **Raw Silk Yarn / Count / IS 15090 (Part 5)**; Woven Fabric / Linear Density of Yarn Removed from Fabric / IS 3442. The full table, with the rules that follow from it, is the seed data in **§M8.5** of Part C. The scope key is the **triple (material, parameter, method)** — never the test name and never the parameter alone.

Two consequences run through the whole design and are not merely reporting details. First, **most of what the unit sells is outside this scope** — grading, evenness, cohesion, twist, boil-off, tenacity, fibre identification, cocoon work and all conditioning and weight certification are absent from the annexure — so the accredited-plus-non-accredited split of M8-32 is the ordinary daily case and the non-accredited report is the common document, not the exception. Second, the one question that decides the scale of this is whether the workhorse *Limited Test* falls under scope row 6; that is now **ANSWERED**: the Unit In-Charge has confirmed the Limited Test is **Non-NABL**, and has supplied a status list marking twenty-one catalogue items — the entire current charge list — outside the accredited scope. He also confirmed that accredited and non-accredited work must go on **separate reports**. The consequence is that on the present catalogue no report carries the symbol or the Unique Laboratory Report number at all, so the plain certificate is the primary template and the accredited one is the exception path. The seeded status list and the questions it raises are in §M8.6 of Part C.

**OPEN-Q-B13:** Which unit code should be used in every number — `DVM`, or a code already used in CSTRI correspondence? — *Recommended default:* `DVM`, with the code held in configuration so a CSTRI-wide standard can be adopted later without changing program code.

**OPEN-Q-B14:** Under which GST registration does the unit raise invoices, and what is the registered address printed on them? This decides whether an Andhra Pradesh customer is an intra-State or an inter-State supply, and therefore the tax split on every invoice. — *Recommended default:* do not guess. Obtain a copy of a recent real invoice from the unit before the invoice module is built, and hold the registration as configuration with its State code, so the tax split is computed rather than ticked by a clerk.

<<<PAGEBREAK>>>

## What This Buys the Laboratory

### 29. What this buys the lab (benefits, in the scientist's terms)

| # | Today | With the system |
|---|---|---|
| 1 | A sample is written into a bound register by hand; the same customer's name is written again on the worksheet, again on the report, and again on the bill. | The sample is entered once at the counter, and every later document draws on that one entry, so a mistake cannot be introduced by copying. |
| 2 | Finding last year's report for a customer who has lost his copy means going through the register and the file cabinet. | Any report from the last seven years is found by typing the report number, the customer's name, the bale mark, or a date range, and reprinted marked "duplicate copy". |
| 3 | If a tester is on leave, only he knows how far his samples have got. | Every sample's exact stage, its tester, and whether it is late is on one screen that the Unit Incharge can see at any time. |
| 4 | Twenty skein weights are written on a slip of paper, the average and deviation are worked out by hand or on a calculator, and the slip is filed. | The twenty readings are typed straight in, the average, deviation and grade are computed the same way every time, and the readings themselves are kept for ever and can be shown to anyone who questions the result. |
| 5 | A customer asking "is my report ready?" is answered by walking to the bench. | The customer can see the stage himself, and is sent a message when the report is issued. |
| 6 | The monthly return to CSTRI headquarters is typed out from the registers, taking most of a day, and the figures depend on who added them up. | The monthly return is produced in one action, from the same records the work was done in, and a copy of exactly what was sent is kept so a later correction cannot quietly change it. |
| 7 | A buyer in the market has no way to tell a genuine certificate from a photocopy with the numbers changed. | The buyer scans the code on the certificate with an ordinary phone and is told, on the laboratory's own page, whether that report is genuine, and whether it has since been amended or cancelled. |
| 8 | If a report has to be corrected, the practical choices are to re-type it with the same number, or to write a letter. | A correction is issued as a proper amended or replacement report, stating what changed and why, referring to the original, and the original stays on record marked as superseded — including on the verification page. |
| 9 | A balance found out of calibration means someone must guess which results were affected, from memory and the register. | The system lists every test, every sample and every issued report that used that balance since its last good check, in one action, and records what was decided about each. |
| 10 | An expired reagent or an out-of-calibration instrument can be used by accident, and nobody knows until much later. | The system refuses to accept the result, names the reason, and if an authorised person overrides it, records who did so and why. |
| 11 | Who is competent to run which method lives in a file and in the Unit Incharge's head. | The system will not let a result be entered, checked, verified or signed by someone who is not authorised for that method on that date, and can answer "who was authorised in March last year?" |
| 12 | The tester who is testing a well-known trader's silk knows whose it is. | The tester sees the sample number, the material, the declared denier and the test — and not the customer's name, address or price; if he needs to know, he asks, and that request is recorded. |
| 13 | Whether the unit met its two-to-three-day service standard is a matter of impression. | The system reports, for each test, how long it actually took, how much of that was waiting for a payment or a clarification, and which stage the days were spent in. |
| 14 | Which tests earn money and which consume time for thirty rupees is not known in any usable form. | Revenue per test, per customer and per month comes out of the same records, which is the evidence needed when asking headquarters to revise a rate or buy an instrument. |
| 15 | Five years of denier and grade results sit in registers where nobody can look at them together. | Grade distribution by district, by reeling technology and by season becomes a report — which is research output the unit is already expected to produce and currently cannot. |
| 16 | An assessor's questions are answered by fetching files, and some answers take a day. | Most assessor questions — the calibration status on a given date, who signed what, what changed and why, the complete history of one sample — are answered from the screen while he watches. |

#### What this system will **not** fix

It will not make a tensile test faster. The oven still takes its time, the twenty-four-hour conditioning is still twenty-four hours, and a seriplane panel still has to be looked at by a person against the standard photographs. The gains are in the time around the testing — the writing, the copying, the searching, the totalling and the explaining — not in the testing itself.

It will not remove the need for discipline. If a reading is written down wrongly, the system will faithfully compute the wrong average; if a reason for a change is typed as "correction", the audit trail will say "correction" and mean nothing. The system makes carelessness visible and traceable, which is genuinely valuable, but it does not make it harmless.

It will not run itself. It needs **one named person in the unit who owns the master data** — the test catalogue, the methods, the parameters, the grade tables, the rate card, the holiday list — and who keeps them right. That person does not need to be a programmer, but they do need to care, and they need a trained deputy for when they are transferred. A laboratory system whose reference data has gone stale is worse than a register, because a register never pretends to be current.

<<<PAGEBREAK>>>

## Appendices

### Appendix A — The original discussion note, as written

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

### Appendix B — Open question register

Every question in the document that only the laboratory can answer, in one place. Each has a recommended default, so work is never blocked waiting for an answer — but a default that goes unchallenged becomes a decision by accident, so please read them. The identifier letter shows which part raises the question.


#### Part A — Purpose, People and Scope

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

#### Part B — How the Laboratory Will Work

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

#### Part C — The Testing Modules (M1–M10)

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

#### Part D — The Supporting Modules (M11–M22)

| ID | Question | Recommended default, or the answer where one is now known |
|---|---|---|
| **OPEN-Q-D1** | Which instruments at Dharmavaram are calibrated externally, by which agencies, and are those agencies accredited for the specific parameter and range? — | build the register with all three traceability tiers available and no assumption about the current position; ask the Unit In-Charge for the last three calibration certificates for the balance, the oven and the tensile tester, and load them as the first records. |
| **OPEN-Q-D2** | Does the laboratory currently perform daily or weekly intermediate checks on the balances and the oven, and if so against what standard and what acceptance criterion? — | configure a daily single-point balance check against a certified standard weight with an acceptance criterion of the balance's least count × 2, and an oven temperature check per working day; make the frequency and criterion configuration, not code, so the laboratory can change them without a developer. |
| **OPEN-Q-D3** | Does the parent institute's asset register need to be fed from this system, or does it already exist independently, on paper or in the accounts wing's own records? — | hold the asset fields in the LIMS as the laboratory's own working record, because there is no external accounting system to hand them to, and print an asset card the accounts wing can use. Capitalised cost, depreciation and the financial asset register stay with the accounts wing and the parent institute, which is where they have always been. If an accounting system is ever adopted, export the fields to it under M22. |
| **OPEN-Q-D4** | Which chemicals and reference materials does the laboratory actually consume, and does it hold any certified reference material at present? — | build for the general case; load the register initially with the reagents used for degumming loss, scouring loss and fibre identification, plus the standard photograph sets, grey scales and standard weights, and leave certified reference material support unused until needed. |
| **OPEN-Q-D5** | Does the laboratory prepare working solutions in-house, and does it standardise them? — | build the Prepared Solution Register (M12-23) as specified; if the laboratory does not prepare solutions, the register simply stays empty and costs nothing. |
| **OPEN-Q-D6** | Does any consumables inventory exist outside this system — in the accounts wing's records or on paper — and does it track lot and expiry? — | the LIMS holds the register in full, including lot, expiry, certificate and fitness-for-use; if an external accounting system is ever adopted, send it only quantity and value movements and do not attempt to store expiry there. |
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
| **OPEN-Q-D35** | Will the parent body ever mandate an accounting system for this unit, and if so what is its integration surface — a documented web interface, direct database access, file import and export, or nothing? What authentication does it use? — | assume none is coming, build and run standalone under M22-17, and answer the rest of this question only when a system is actually named. **Nothing in M22 beyond M22-17, M22-18 and M22-20 is to be built before that answer exists.** |
| **OPEN-Q-D36** — **ANSWERED** | *Question was:* which system will master the tax invoice number series? The LIMS does, because it is the only system there is, and its series must therefore satisfy the consecutive, sixteen-character, financial-year-unique rule of M17-28 in its own right. The question reopens only if an accounting system is one day adopted. — | keep the series in the LIMS. Should such a system arrive, let it master the number if its own series is already compliant, because the accounting document belongs there, and otherwise let it record the LIMS's number as supplied. Decide once. Never split. |
| **OPEN-Q-D37** | Could a future accounting system hold custom fields or an external reference against customer, item, invoice and asset records? — | assume not, and design the mapping to live inside the LIMS with the reconciliation report as the control. This costs nothing today, because the mapping table is empty. |
| **OPEN-Q-D38** — **ANSWERED** | *Question was:* is the LIMS to be a module inside another package, or a separate application? It is a separate, standalone application. There is no package for it to sit inside, and the reasons would hold even if there were: the offline requirement, the immutable audit trail, the frozen report files and the enforcement gates are all easier to guarantee in software the laboratory controls, and standalone keeps the LIMS alive whatever the parent body's accounting arrangements turn out to be. — | build standalone, as ARC-14 requires, and treat any later proposal to fold the LIMS into a package as a change governed by M22-16. |
| **OPEN-Q-D39** | Does any consumables inventory or fixed-asset register exist for this unit outside this system — in the accounts wing's records, or on paper? — | assume paper at most; load the LIMS registers from scratch and treat them as the working record. If an accounting system later arrives holding either, agree the ownership table with whoever maintains it before pushing anything across. |
| **OPEN-Q-D40** | If an accounting system is ever named, who maintains it, and will they commit to a stable interface and to notifying this project before an upgrade? — | the LIMS runs with the integration switched off (M22-17), so nothing is blocked on this. Should the day come, obtain a named contact and a written note of the interface version in use before integration work starts, and treat the integration as its own phase with its own approval. |

#### Part E — Build, Test and Roll Out (technical)

| ID | Question | Recommended default, or the answer where one is now known |
|---|---|---|
| **OPEN-Q-T1** | Are the assumed volumes in §23.0 correct — samples per year, peak day, tests per sample, readings per test, users? Is there an existing monthly figure reported to headquarters we can size against? | Proceed with §23.0 and re-measure after three months live. |
| **OPEN-Q-T2** | How many invoices, receipts and challans does the unit raise per month, and how many samples does a typical invoice cover? | One invoice may cover up to 50 samples; size for 500 invoices a month. |
| **OPEN-Q-T3** | Will the public verification page sit on a Government domain, and is STQC website certification plus a CERT-In empanelled auditor's "safe to host" certificate required before it goes live? | Assume "safe to host" is required; build to the Government website guidelines from day one; **do not let this block the internal system going live.** |
| **OPEN-Q-T4** | What printers exist today (make, model, laser, inkjet or dot-matrix)? Is there pre-printed letterhead stationery? Are any multi-part carbon forms in use? | Budget one new monochrome laser printer and one thermal label printer. Support plain-paper letterhead in Phase 1; add pre-printed alignment in Phase 2. Assume no dot-matrix. |
| **OPEN-Q-T5** | Must a test report or tax invoice from this unit be bilingual in Hindi and English under the Official Languages Act, section 3(3)? | Build the bilingual capability into the template engine; issue English-only in Phase 1. |
| **OPEN-Q-T6** | What retention periods does the quality manual set for technical records, issued reports, calibration certificates and retained samples, and what do Central Silk Board's departmental record rules require? | The retention periods set out in the table at M21.12; no periods are restated here. No automatic deletion, and a review-and-authorise step for every disposal. NFR-118's seven years is a floor for keeping records online and searchable, not a retention period. See also OPEN-Q-D30. |
| **OPEN-Q-T7** | Does the laboratory layer have to be built **inside** an existing accounting package — sharing its database, login and deployment — or is it a separate application that exchanges data with one? The unit runs no such package, so the laboratory layer is a **separate, standalone application** that owns its own customer master, numbering, invoices, receipts and stock records (ARC-14, M22-17). Before Phase 1 coding begins, get that confirmed in writing by the Unit Incharge (PLN-07). | Build standalone, with the M22 interface specified and switched off, so that a later departmental mandate is a connector and a configuration change rather than a rewrite. |
| **OPEN-Q-T8** | Which system is the system of record for each of the customer master, tax registration, invoice, receipt, tax codes, asset register and consumable item master? Settled for the build: the laboratory system, for all of them, because there is no other system (ARC-14). What stays open is the split that would apply if an external accounting system were ever introduced. | The laboratory system is the system of record for every field listed, with one limit: the asset record it keeps is the working one used for calibration and traceability, not the financial fixed-asset register, which stays with the unit's accounts wing. If an external system does arrive, it takes customer identity, invoice, receipt, tax and asset value, and the laboratory system keeps customer category, blinding token, rate application, calibration status and lot fitness-for-use. |
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
| **OPEN-Q-T31** | Does NABL, or the Quality Manager answering for it, require only a **valid digital signature** on an issued report, or **long-term validation** (PAdES B-LT or B-LTA) — a signature carrying the certificate revocation data and a trusted timestamp inside the file, so that it can still be proved valid years after the signing certificate has expired? The Unit Incharge has answered verbally that a valid signature is what is needed. That answer is **recorded here as an assumption, not as a fact**, because it has not been … | Build **PAdES B-B** only, per the Unit Incharge's verbal answer; sign invisibly and draw the visible signature block as ordinary tagged page content; and keep the document component replaceable (ARC-17) so that a long-term-validation step can be added later as an off-path batch job over the already-issued file, written as a separate derived attachment with the frozen original untouched (NFR-121). |

<<<PAGEBREAK>>>
