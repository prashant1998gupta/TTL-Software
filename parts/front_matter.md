## In one paragraph

This document specifies a Laboratory Information Management System — software that runs the whole life of a test, from the moment a customer hands over silk at the counter to the moment a signed certificate is issued and can be verified by scanning a code on it. It is written for the Regional Silk Technological Research Station / Silk Conditioning and Testing House at Dharmavaram. It replaces the paper sample register, the hand-typed report, the hand-calculated conditioned weight, and the folder of calibration certificates with one system that can answer, at any moment, where a sample is, who tested it, on which balance, in what room conditions, against which version of which method, and who signed the result. It is a standalone application: it holds its own customer master, raises and numbers its own invoices and receipts, and keeps its own consumable stock and equipment records, so nothing outside it has to be in place before it can run. The unit's accounts wing keeps the general ledger as it does today; an interface to an external accounting system is specified in case one is ever adopted, but it is switched off, because the unit runs no such system.

## Where the work has reached

Work has started. Rather than beginning with the easy parts, we began with the two pieces that were genuinely in doubt — because if either had turned out to be impossible, it would have been far better to discover that now than a year from now. Both are settled.

**The certificate itself works.** A certificate can now be produced that carries Telugu, Hindi and English correctly, is digitally signed, and can be checked years afterwards. The signature is invisible on the page, as the accessibility standard requires, and the text can be searched and copied out — so a customer can find their own name in it, rather than looking at a picture of one. This is the thing the whole system exists to produce and the hardest part to change once certificates have gone out, which is why it was built first.

**Building it found a real problem.** The standard software for placing text into a certificate does not merely render Telugu badly — it stops altogether, on ordinary words, including **శ్రీ**, the honorific in a great many Indian names. A second piece of software now does that work. No amount of design would have found this; only running it did. A check now runs on every release to confirm the original defect is still present, so the workaround is removed on the day it is fixed rather than living on forever.

**The calculations are built, and are waiting on you.** The arithmetic is done: averages and deviation from the individual skein weights, maximum deviation from the coarsest and finest, low neatness from the worst fifth of the panels, conditioned size with the eleven per cent allowance, and the two-stage grade in which the major tests set the grade and an auxiliary test can pull it down by one class. But it will not yet produce a grade, and that is deliberate — the grade tables themselves, the limit values for 4A, 3A, 2A and the rest, were not available to us and we refused to invent them. A grade that looks right and is wrong is the worst thing this system could produce, because money is settled against it and nobody can tell by looking. A photocopy of the page you work from closes this.

**Everything else is specified but not yet built** — the register, the workflow, the calibration and competency checks, the billing, the portal. The order is deliberate: prove the risky parts first, then build the ordinary ones.

### One decision has changed since the first draft

The earlier draft assumed this system would sit alongside a separate business software package that would hold the customer list, raise the invoices and keep the stock. The unit runs no such package, so that assumption has been withdrawn. **This system now stands on its own.** It keeps its own customer records, raises and numbers its own invoices and receipts, and holds its own consumable stock and equipment records, so nothing else has to be bought or installed before it can run. The accounts wing keeps the general ledger exactly as it does today. If the Board ever adopts an accounting package, a connection to it is already described in this document and can be switched on then.

## The short answer to "can we do better than the first note?"

Yes — and the first note was a good start. It named ten things, and all ten are in this specification. But a discussion note describes a conversation, while a specification has to survive a developer's questions and an auditor's questions. Eight changes matter more than the rest.

**1. The order of the first two steps is reversed.** The first note began with creating a customer and raising an invoice, then receiving samples. In a testing laboratory that is backwards, for a practical reason: the charge cannot be known before the material is counted and inspected. A grading fee depends on how many bales are in the lot; a conditioning charge depends on weight. So the process now begins with a **Test Request** that the laboratory formally reviews and accepts, and the invoice follows from what was actually received. A quotation can still be given up front as an estimate, and advance payment can still be demanded where the laboratory wants it.

**2. The word "job" is retired, because it was doing two jobs.** The first note said one job per sample. That is nearly right and it was the note's sharpest instinct. But one sample commonly carries four or five different tests, performed by different people on different days on different machines. So the specification separates the **sample** (the physical silk) from the **test on that sample** (the unit of work that gets assigned to a person). Five hanks needing three tests each is five samples and fifteen assignable units of work — not five jobs, and not one.

**3. A test result is not a single number.** The first note described a "test log entry" with observations and remarks. Real silk testing produces many readings that are then averaged: six skeins for conditioned mass, ten bobbins for winding, twenty panels for evenness, forty or eighty sizing skeins for size deviation. The system must store **every original reading**, compute the average and the variation from them, and never overwrite a reading that has been submitted. A single free-text "results" box would lose exactly the data an auditor asks for.

**4. Approval is two steps, not one.** The first note had one approval. A laboratory does two different things: someone technically competent **verifies** that the numbers and the arithmetic are right, and then the authorised signatory **authorises and signs** the certificate. These are different acts by different people with different consequences. The specification also covers what happens when the signatory is on tour, because that will happen.

**5. A certificate that has been issued can never be quietly edited.** The first note did not mention what happens when a report has to change after it has gone out. This is the single most common way a laboratory loses an audit. The specification requires an **amendment** — a new, separately identified version that refers to the original, records why it changed, keeps the superseded version retrievable and marked as superseded, and updates what a person sees when they scan the code on the old copy.

**6. The public QR code should not show everything to everybody.** The first note said anyone scanning the code should be able to see the report. The intent is right — digital verification instead of telephone calls — but a test report is a commercially sensitive trade document, and a permanently public, guessable link would let anyone harvest competitors' results. The specification keeps the benefit and removes the risk: an anonymous scan confirms that the certificate is **genuine, current, and not amended or withdrawn**, and shows enough to identify it; the actual results need a one-time password or a login. If the laboratory prefers the fully open version, it is a single setting — but the safer behaviour is the default.

**7. Two modules were named in the first note but are much bigger than their names suggest.** "Equipment as an asset system" is really **calibration control**: the system must know whether a balance was within its calibration validity on the day it produced a weight, and — critically — when a machine is found out of calibration, it must be able to list every result that machine produced since its last good calibration, so the laboratory can decide whether any certificate must be recalled. "Internal stock" is really **reagent lot and expiry control**: the system must refuse to let an expired lot be used in a test and must record which lot was used for which result.

**8. A record-keeping backbone has been added underneath everything.** The first note had no audit trail, no method versions, no environmental conditions, no retention and disposal, no competency control. These are not extras. Silk testing is done in a controlled atmosphere and the conditions at the time of test are part of the result. A method has versions, and a certificate issued three years ago must be reproducible against the version in force then. Only a person authorised for a method may run it. Every change to a technical record must keep the original value visible, with who changed it, when, and why. This backbone is what turns a workflow tool into a laboratory record.

## Your ten points, and where each one now lives

| # | Point in the original note | Where it is now | What was added to it |
|---|---|---|---|
| 1 | Customer creation | M1 Master Data | **One change of premise: the original note put the customer master in CloudZoo ERP. The unit runs no such system, so this system owns the customer master itself, along with its tax invoice numbering, its receipts and its stock (ARC-14, M22-17); M22 specifies an interface to an accounting system generically and delivers it switched off.** Beyond that: customer categories that drive concession rates and the returns to headquarters; a frozen name-and-address snapshot on every issued certificate so a later edit cannot rewrite history; a path for zero-charge internal and research samples; duplicate-customer control |
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

## What we need from you before coding starts

The specification contains **111 questions marked OPEN-Q**, of which seven have since been answered, leaving **104 open**. The answered ones are marked where the question is raised, and the register shows the answer rather than a default. The rest carry a recommended default so that nothing is blocked while answers are pending. They are lettered by the part that raises them — OPEN-Q-A1 in Part A, OPEN-Q-T1 in the technical part, and so on. The full register is in Appendix B. These are the ones worth answering first, because the answers prevent the most rework.

| Question | Why it matters |
|---|---|
| **The grade tables you work to** — the limit values for 4A, 3A, 2A, A, B, C, D and E, for each characteristic, in each size category. A photocopy of the page is perfect. | The grading is built but will not produce a grade without them. We deliberately did not invent the numbers, because a grade that looks right and is wrong is settled against in money and nobody can tell by looking. This is the one place the software refuses to guess and simply stops. |
| **What are the missing items on the catalogue status list, and are any of them accredited?** (Accreditation, its scope, and the Limited Test's status are now all settled — see below.) | The list supplied by the unit runs from serial 3 to serial 30 with serials 1, 2, 16, 17 and 22 to 26 absent, and carries no fabric test anywhere, although five of the seven accredited scope entries are fabric parameters. Until the gaps are filled, every catalogue item is Non-NABL and no report carries the accreditation symbol at all. |
| How are mixed reports issued today — one report, or separate ones? | Where a sample carries both accredited and non-accredited tests, the system must issue **two separate reports**. Marking the non-accredited test with an asterisk on one report is not permitted. If that is the current practice, the software will change it. |
| How does the existing national CSB online testing portal relate to this system? | Samples may already arrive through it. It is treated here as a source of incoming requests, not as something to replace — but the two must not keep separate, disagreeing records of the same sample. |
| Are the published rate card and test list current for this unit? | Everything about charging depends on it. Please confirm or correct the catalogue and rates. |
| Every existing paper form, register and report format | The system should print what the unit already prints. Please collect one filled example of each. |
| The real daily volumes and the busiest hour | Decides the design of the batch entry screens. |
| Who signs, who verifies, and who deputises when the signatory is away | Decides the permission matrix. |
| Is a valid digital signature on the certificate enough, or does the quality system require long-term validation — a signature that can still be proved valid years after the signing certificate has expired? The Unit In-Charge has said verbally that a valid signature is what is needed; that is recorded as an assumption until the Quality Manager confirms it in writing. | Long-term validation cannot be done at the moment of issue: it needs the certifying authority's revocation service and a timestamping authority, both reached over the internet, and nothing on the report-issue path may call outside the laboratory network. So if the written answer is that long-term validation is required, it does not mean different software — it means the report is issued first and a separate timestamped copy is produced and kept afterwards, which is Phase 6 work. |
| Whether the sample is returned, retained or disposed, and for how long | Decides the storage and disposal module. |

## What it takes to build

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

## The accreditation position, now confirmed

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

## An honest word on what this will not do

It will not make a tensile test faster. It will not remove the need for discipline in recording readings — it will only make undisciplined recording visible. It will need one person to own the master data, because a test catalogue and a rate card that nobody maintains will quietly become wrong. And it will not, by itself, make the unit accredited; it will make the unit's records defensible, which is a different and necessary thing.
