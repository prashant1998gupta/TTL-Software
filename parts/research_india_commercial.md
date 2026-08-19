# India-Specific Commercial, Statutory and Security Mechanics
## Research brief for the RSTRS / Silk Conditioning & Testing House, Dharmavaram LIMS layer on CloudZoo ERP

**Date of research:** 19 August 2026
**Reading key:**
- **[VERIFIED]** — supported by a cited source that I actually read or that was directly quoted in search results.
- **[LIKELY]** — consistent across multiple secondary sources, but the primary government text was not read directly. Treat as a working assumption to be confirmed.
- **[UNVERIFIED]** — could not be confirmed. Must be checked with the unit / CSTRI HQ / a tax professional before it is written into the spec as a rule.
- **[ASSUMPTION]** — my engineering or design judgement, not a fact.

> **Standing rule for the spec document:** no tax rate, exemption, SAC code, GSTIN, or legal deadline should appear in the software as a hard-coded constant. Every one of them must be a configuration row with an effective-from date, an effective-to date, and a free-text "authority / source" field. The reason is stated plainly below in section 2.

---

# 0. Two findings that change the shape of the project

Before the nine topics, two discoveries should be put in front of the scientist and the developer immediately, because they affect scope.

### 0.1 CSB already runs a national silk-testing portal and mobile app, and Dharmavaram is listed on it

**[VERIFIED]** There is a live portal at `https://csbsilktesting.res.in/` operated under Central Silk Board. Its centre list explicitly includes **RSTRS-Dharmavaram**, alongside RSTRS-Kancheepuram, RSTRS-Guwahati, RSTRS-Varanasi, RSTRS-Malda, STSC-Sidlaghatta, STSC-Jammu, STSC-Cuttack, STSC-Bilaspur, STSC-Ramanagara, STSC-Bhagalpur, STSC-Dharwad, STSC-Dehradun, STSC-Salem, TTL-Madivala, STL-Okalipuram and STL-Cubbonpet.

**[VERIFIED]** Its Terms and Conditions page states, in its own words: bookings "must be made via the app using the available payment methods"; "Service charges are based on the type of test selected and are non-negotiable"; "Cancellation requests must be made before the testing process is initiated. If approved, refunds will be processed to the original payment method within T+1 business days"; "No refund shall be applicable once the sample has been processed or the test completed"; "Test reports will be made available through the app once the analysis is completed"; and "Samples not claimed within a specified period after testing may be disposed of as per laboratory protocols."

**[VERIFIED]** There is a matching Android app, **"CSB-CSTRI Testing"** (package `com.csb_silk_testing`), described as the official Central Silk Board application for silk testing services across India, aimed at silk producers, traders and quality assessors, with an integrated help-desk/ticketing feature. Developer address: 1st Floor, CSTRI, CSB Complex, Hosur Road, BTM Layout, Bengaluru 560068.

**Why this matters.** The commercial front door (customer books a test, pays online, receives a report) may already exist at the CSTRI/CSB national level. Three consequences:

1. **Scope question to settle with the scientist on day one:** is the new software (a) the *internal* laboratory workflow that the national portal does not do — sample login, worklists, instrument results, review/approve, certificate generation, unit-level accounts and stores — or (b) a replacement for the portal at Dharmavaram, or (c) both, with an integration to the national portal? These are three very different projects.
2. **Refund policy has already been published** by CSB ("T+1 business days", "no refund once processed"). The software's refund rules should match this published text, not invent new ones.
3. **[ASSUMPTION]** The most defensible v1 is (a): build the internal LIMS, and treat the national portal/app as an *inbound order source* — one of several ways an order can arrive. Design an `order_source` field with values like `WALK_IN`, `POST`, `CSB_PORTAL`, `EMAIL`, so that a portal integration can be added later without a schema change.

### 0.2 The published rate card already contains the pricing logic the software must model

**[VERIFIED]** CSTRI's approved testing charges document (`https://cstri.res.in/wp-content/uploads/2020/01/TestingCharges-2019.pdf`, effective 15.11.2019) contains a section headed **"Approved rates for STL division of CSTRI & RSTRS / STSC units Under CSTRI"** — i.e. a rate card that applies specifically to units of the Dharmavaram type, separate from the Bengaluru TTL rate card.

From that document, verbatim or near-verbatim:

- **"GST extra. Applicable as per prevailing rates"** — appears at the foot of both rate tables. This is the single most useful verified sentence in the whole brief: CSB charges GST *on top of* the approved test rate, and the rate card deliberately does not fix the percentage.
- **Tatkal (express) scheme:** "It is approved to charge double amount under Tatkal scheme for speedy testing services (Within same day for maximum of 5 samples which are booked before 11 AM and applicable for those tests which could be completed within 6 hours of duration)."
- **Customer-category pricing.** The RSTRS/STSC table has separate line items for the same test by customer class, e.g. "Zari Testing - Chemical method (corporates / Producers / Traders)" versus "Zari Testing - Chemical method (Handloom Weavers)", and separate lines for "[TN co-operative units]" for denier, twist and degumming-loss tests of twisted silk, and "denier test (through anna Exchange)".
- **Standard-dependent pricing.** The same physical test is priced differently depending on the standard used, e.g. raw silk testing & grading under **IS 15090** versus under **ISA**, and ISA priced differently for "Indian ARM units" versus "Imported silk".
- **Notes:** "The test method may vary according to latest standards or relevant test methods"; "All the In-House Research samples of CSTRI and Sub units are tested on advisory basis"; "For any other tests, rates approved for TTL, CSTRI, Bengaluru holds good."
- Unit-of-measure pricing exists: "Muga Cocoon stifling per 1000 Nos.", "NE Warping charges per Warp", "NE Machine Rent (CSTRI-MRTM) per Year", "Abrasion resistance for 5000 rubs / additional 5000 rubs - Rs.250", "Denier test (bobbin form) (Minimum of 5 bobbins)".

**Data-model implications (ASSUMPTION, but tightly derived from the above):**

| Requirement | Implication for the schema |
|---|---|
| Same test, different price by customer class | `price_list` keyed by (test_id, customer_category_id, effective_from) — not a single price on the test |
| Same test, different price by standard | Test catalogue entity is (test + method/standard) combination, not test alone |
| Tatkal doubles the price and imposes an 11:00 cut-off and a 5-sample/day cap | `priority` on the order with a `multiplier` and a rule engine for the cut-off and the daily quota |
| "GST extra, as per prevailing rates" | Tax is computed at invoice time from a dated tax-rate table, never stored on the rate card |
| Minimum quantities ("minimum of 5 skeins") and per-unit rates | Test has `uom`, `min_qty`, `qty_step`, and price is qty × rate |
| Advisory (free) testing for in-house research samples | `billable` flag on order; a zero-value order must still produce a report but must not produce an invoice |
| Approved rate cards are dated and approved by an authority | `rate_card` header with approval reference, approval date, effective_from — and *never* edit a historical rate card row; supersede it |

---

# 1. How a Government of India statutory body collects testing fees

## 1.1 What CSB legally is — and why it decides the payment route

**[VERIFIED]** Central Silk Board is a **statutory body** established by the Central Silk Board Act, 1948 (Act LXI of 1948), under the administrative control of the Ministry of Textiles, with headquarters at Bengaluru. The Act gives it a distinct legal personality: "The Board shall be a body corporate by the name aforesaid, having perpetual succession and a common seal, with power to acquire, hold and dispose of property, both movable and immovable, and to contract, and shall by the said name sue and be sued." The Act contains separate sections titled "Funds of the Board" and "Accounts of Board".
Sources: `https://www.indiacode.nic.in/bitstream/123456789/1474/3/A1948-61.pdf`, `https://texmin.nic.in/sites/default/files/CSB-ACT-and-RULES-Book.pdf`, `https://csb.gov.in/`

**Why this is the pivotal fact.** There are two quite different money-handling worlds in Indian government, and CSB sits in the second:

- **A Ministry / Department proper.** Its non-tax receipts are Government of India revenue, credited to the Consolidated Fund through a Pay & Accounts Office. Its natural online channel is **Bharatkosh / NTRP**.
- **A body corporate / autonomous or statutory body with its own Fund.** Receipts go into *the Board's own* bank account under its own Fund, audited under the "Accounts of Board" provisions. Its natural online channel is a **bank collection product (SBI Collect / SB Collect) or a payment gateway on its own portal**.

**[LIKELY]** CSB is in the second category, and this is corroborated by the existence of `csbsilktesting.res.in` with its own "available payment methods" and its own refund-to-original-payment-method policy — a Bharatkosh receipt cannot be refunded to the original payment method in T+1 by the lab.

**[UNVERIFIED — must be asked]** Which of these CSB actually uses for RSTRS Dharmavaram testing fees today, and whether it is a mix. I could not find a Bharatkosh "purpose" string for Central Silk Board testing charges. **Ask the scientist directly:** "When a reeler pays for a test today, where does the money physically go — a CSB bank account, or a Government of India account via a PAO?" The answer determines whether the software stores PAO/DDO/GAR-7 data at all.

**Design consequence (ASSUMPTION):** do not choose. Model payments polymorphically. One `payment` row per tender of money, with a `payment_mode` and a mode-specific reference block. The software must be able to record any of the routes in 1.2–1.6 below without a schema change.

## 1.2 Bharatkosh / NTRP — what it is and what identifiers it produces

**[VERIFIED]** The Non-Tax Receipt Portal (NTRP), branded **Bharatkosh** (`https://bharatkosh.gov.in`), is an initiative of the Office of the Controller General of Accounts, Ministry of Finance. It is built on the PFMS platform, converges the civil Ministries and Departments, and exists to let anyone deposit "any fees/fine/other money into the Government Account" 24×7. Its stated scope is the full value chain of non-tax receipts: the online user interface, payment at the Payment Gateway Aggregator, and **reconciliation and accounting of receipts by Government Departments and Ministries**. Testing charges are an explicitly listed category of non-tax receipt.
Sources: `https://cga.nic.in/Page/Bharatkosh.aspx`, `https://bharatkosh.gov.in/NTRPHome/UserGuide`

**[VERIFIED] The payer flow** (from a government institute's own published SOP, `https://www.nrsc.gov.in/nrscnew/assets/pdf/training_outreach/2026/SOP%20for%20Training%20Charges_Fees%20using%20NTRP%20-BharatKosh.pdf` — this is the closest published analogue to a lab charging testing fees):

1. Payer either registers on NTRP or pays as a **Guest User** via "Quick Payment".
2. Payer selects **Ministry / Department** (e.g. "038- SPACE"; for CSB this would be Ministry of Textiles).
3. Payer selects **Purpose** from that Ministry's list (that institute's list includes "Training Charges/Fee", "Deposit for work done for Public bodies or private individuals", "Departmental Handling Charges", "Other Miscellaneous" — note there is no generic "Testing Charges" in every Ministry's list).
4. Payer selects **Pay & Accounts Officer (PAO)** — e.g. "000996-NATIONAL REMOTE SENSING CENTRE" — and **Drawing & Disbursing Office (DDO)** — e.g. "200997-Sr. Accounts Officer, NRSC, Hyderabad".
5. Payer enters the amount **"and Remarks with user reference ID / NRSC letter number / Purpose details for reference"**.
6. Payer enters depositor details and chooses **Online payment** or **SWIFT/NEFT/RTGS**.
7. Payer pays by Net banking / Debit card / Credit card / UPI, then downloads "the final NTRP transaction receipt & challan … for reference to NRSC".

**[VERIFIED] Purpose → PAO → DDO → head of account mapping.** On selecting the Purpose, the portal retrieves and auto-fills the mapped PAO and DDO. The mapping is created by the PAO (maker) and approved by the Principal AO (checker), linking a payment type to a budgetary grant, a function head and a DDO. A "Mapping Report" in PFMS shows which head of account a purpose is linked to. If the payer picks the wrong purpose, the money reaches the wrong office and is generally not reversed.
Sources: `https://cga.nic.in/writereaddata/file/FAQsNTRPforPAOPrAO08092017.pdf`, `https://cga.nic.in/Page/Bharatkosh.aspx`

**[VERIFIED] Reconciliation and refunds.** PFMS carries an "NTRP Challan Summary" report under Bharatkosh Reports, and Bharatkosh "scroll reports" for tracking failed transactions. Refund/wrong-purpose requests must reach NTRP **within 15 days** of the transaction; the DDO acknowledges by mail, does due diligence on the evidence, and decides the claim. Same source (PAO/PrAO FAQ).

## 1.3 What a "challan" is, and the exact document identifiers

This is the vocabulary the software must use, because the scientist and the accounts staff will use it.

**A challan** is the document that evidences that money has been *credited into the Government Account* through a bank. It is not the same thing as the payer's transaction receipt. Under the Bharatkosh scheme:

| Identifier | What it is | When it exists | **[VERIFIED]** source |
|---|---|---|---|
| **Transaction Reference Number** | Bharatkosh's own transaction id. The clickable hyperlink under "Track your payment / Payment history" from which all documents are downloaded. | Immediately on submission | CGA user FAQ Q6, Q7 |
| **GAR 6** | The **transaction receipt** issued to the payer. Shown on the success page. | Immediately for successful online payment | CGA user FAQ Q3, Q7; Bharatkosh guides |
| **GAR 7** | The **challan** for that transaction. | Later — commonly described as available about two days after the transaction | CGA user FAQ Q8; Bharatkosh guides |
| **UTR Number** | The bank's Unique Transaction Reference for a NEFT/RTGS payment. The payer must **enter the UTR back into Bharatkosh** ("Enter UTR No." column on the Track-your-payment screen) before GAR 6 / GAR 7 can be produced. | On NEFT/RTGS only | CGA user FAQ Q2, Q3, Q8 |
| **PAO code** | Pay & Accounts Office code that the Purpose maps to | On the challan | NRSC SOP; PAO FAQ |
| **DDO code** | Drawing & Disbursing Officer code | On the challan | NRSC SOP; PAO FAQ |
| **Purpose (string / code)** | The receipt purpose selected, which determines the head of account | On the challan | PAO FAQ |
| **Provisional Receipt** | **Important operational nuance.** For NEFT/RTGS where the UTR has been entered and the DDO can see "UTR has been verified by the system", the CGA FAQ states the DDO "can provide the service on production of 'Provisional Receipt' by the user which envisage that the amount has been credited to the Government Account." | Interim | CGA user FAQ Q3 |
| **Form GAR 1** | Pay-in-slip used to remit money physically into the accredited bank | Cash/cheque route | GFR 2017 material below |
| **Form R.P.R.6E** | The **e-receipt** (downloadable/printable) generated by the system and issued to the payer by an office authorised to accept money online | Online route | GFR 2017 / Receipts & Payments Rules material below |

**[VERIFIED]** Form **GAR-6** is also the classic *paper* official receipt form used where officers receive money on behalf of Government and issue receipts; departmental regulations must provide for a proper account of the receipt and issue of receipt books, and the number of forms in a receipt book must be counted and recorded "in a conspicuous place in the book over the signature of the Government officer in charge of the book", with counterfoils of used books kept in his personal custody. Moneys received must "without undue delay, be paid in full into the accredited bank", using pay-in-slip **Form GAR 1**.
Sources: `https://www.mcrhrdi.gov.in/asodr2018/week3/1-ASO-DR-GFR2017-May2018.pdf`, `https://cga.gov.in/DownloadPDF.aspx?filenameid=1804`, `https://www.gfr.co.in/p/general-system-of-financial-management.html`

**[VERIFIED]** Failed-but-debited: Bharatkosh guidance is that the payer must **not** re-initiate a payment for the same purpose; the amount will be credited to the Government Account and only the status needs checking. Duplicate online payments are resolved by the payer contacting the DDO, who processes the refund after confirmation from NTRP for services not rendered.
Source: CGA user FAQ Q4; `https://startupflora.com/blog/bharatkosh-payment`

## 1.4 Demand Draft — still real, and still the default in places

**[VERIFIED]** For CSTRI training programmes, the historical instruction was a **Demand Draft drawn in favour of "Director, CSTRI"**, or a cash deposit against receipt.
Source: `https://silks.csb.gov.in/nellore/where-to-get-what/`, `https://cstri.res.in/?page_id=291`

**[ASSUMPTION]** DD and cash will remain in use at a district unit for years. The software must treat them as first-class, not as a legacy afterthought. DD fields to capture: DD number, DD date, drawee bank and branch, drawn-in-favour-of, amount, date received at the lab, date deposited, GAR 1 / bank deposit slip reference, date credited, and a **dishonour** state.

## 1.5 Bank collection product (SB Collect) — the likely route for an autonomous body

**[VERIFIED]** SBI's **SB Collect** is a "plug and play collection model for educational institutions and small/medium merchants who do not have their own web servers", covering school fees, recruitment fees, membership fees, donations, "booking charges or any other type of collections". Eligibility: firms/corporates/institutions of repute with a CINB-enabled account. Channels: SBI INB, other-bank INB, debit cards, credit cards, prepaid cards, UPI, RuPay, NEFT/RTGS, and cash/SBI cheque at SBI branches. It is described as free with no integration charges. The institution's Administrator can create unlimited categories, configure date-wise late fees and penalties (fixed, percentage or variable), and pull **category-wise MIS reports** for reconciliation. Settlement: same day for SBI INB and SBI debit cards; **T+1 or T+2 for other channels**.
Sources: `https://sbi.bank.in/web/business/sme/digital-collection-products/sb-collect`, `https://onlinesbi.sbi.bank.in/sbijava/mergerfaq/merger_collect_faq.html`

**[VERIFIED] Reconciliation warning worth designing around.** A published institutional implementation notes that where a virtual-account NEFT challan is used, "in case of a mismatch in either the amount or account number the amount will be refunded, the account number generated in the challan is for one-time use only, and for each payment the student must generate the challan every time and remit as per the account number printed on the NEFT challan."
Source: `https://erp.iitkgp.ac.in/PaymentInstructions.pdf`

**[VERIFIED]** Payer-side reference retrieval on SB Collect is by **date range or INB reference number** under State Bank Collect → Payment History.

## 1.6 Recommended payment data model

**[ASSUMPTION]** This is my design recommendation, not a fact.

```
payment
  id
  unit_id                      -- Dharmavaram
  received_on                  -- date money was tendered at the lab
  amount
  mode                         -- CASH | DD | CHEQUE | NEFT_RTGS | BHARATKOSH
                               --  | BANK_COLLECT | UPI | PG | ADJUSTMENT | WAIVER
  status                       -- TENDERED | AWAITING_CREDIT | CREDITED
                               --  | DISHONOURED | REFUNDED | REVERSED
  credited_on                  -- date confirmed in the bank / Government Account
  bank_statement_line_id       -- nullable; set at reconciliation
  our_receipt_no               -- OUR receipt series (see section 3)
  our_receipt_date
  remarks
```

```
payment_reference               -- 0..n rows per payment; this is the key idea
  payment_id
  ref_type                      -- enumerated, see below
  ref_value
  ref_date
  captured_by                   -- staff user
  captured_from                 -- MANUAL | PORTAL_CALLBACK | BANK_MIS_IMPORT
  evidence_file_id              -- scan/PDF of the GAR 6, GAR 7, DD, slip
```

`ref_type` enumeration must include, at minimum:
`BHARATKOSH_TXN_REF`, `BHARATKOSH_GAR6_NO`, `BHARATKOSH_GAR7_NO`, `BHARATKOSH_PURPOSE`, `BHARATKOSH_PAO_CODE`, `BHARATKOSH_DDO_CODE`, `UTR_NO`, `NEFT_RTGS_REF`, `DD_NO`, `CHEQUE_NO`, `BANK_DEPOSIT_SLIP_GAR1`, `SB_COLLECT_REF`, `INB_REF_NO`, `PG_ORDER_ID`, `PG_TXN_ID`, `UPI_RRN`, `EPR_R_P_R_6E_NO`, `CSB_PORTAL_BOOKING_ID`.

**The single most important reconciliation mechanic (ASSUMPTION, but directly enabled by a VERIFIED fact):** Bharatkosh's payer flow includes a free-text **Remarks** field, and the NRSC SOP explicitly instructs payers to put "user reference ID / letter number / purpose details for reference" there. So:

> **The software should print, on the fee quotation given to the customer, an instruction to enter the Lab Reference Number (e.g. `DVM/2026-27/TR/00417`) in the Bharatkosh "Remarks" field.** That is the only reliable link between a Government challan and a test order in the absence of an API. Store it as `expected_payer_remark` on the order, and match on it.

**Additional reconciliation requirements (ASSUMPTION):**
- An **"Awaiting credit"** worklist. Money tendered (DD in hand, UTR quoted, portal callback received) but not yet confirmed in the bank. Because settlement is T+1/T+2 and GAR 7 appears ~2 days later, the lab will very often begin testing before credit is confirmed. The software must let a supervisor **release a sample for testing against a provisional receipt**, and must record who authorised that release. This mirrors the CGA's own "Provisional Receipt" concept.
- A **bank statement import** (CSV/Excel) and a manual match screen, with partial matches, one-payment-to-many-orders and many-payments-to-one-order both supported. Advance deposits by regular reelers are common in this trade.
- A **customer ledger / running account** so that a twisting unit sending 40 samples a month is not forced into 40 separate payments.
- **15-day refund window awareness** for Bharatkosh. If mode = BHARATKOSH, the software should warn when a refund request is raised more than 15 days after the transaction date.

---

# 2. GST on laboratory testing services by a government lab

## 2.1 The single most important verified fact in this section

**[VERIFIED] Central Silk Board holds GST registration and CSTRI operates under it.**
GSTIN **29AAALC0093M1ZZ** — Legal name: **CENTRAL SILK BOARD**; Trade name: **CENTRAL SILK TECHNOLOGICAL RESEARCH INSTITUTE**; Constitution: **STATUTORY BODY**; registered **01 Jul 2017**; status ACTIVE; address 1st Floor, CSTRI, CSB Complex, Hosur Road, BTM Layout, Bengaluru Urban, Karnataka 560068. State code 29 = Karnataka. PAN component = **AAALC0093M**.
Source: `https://piceapp.com/gst-number-search/central-silk-technological-research-institute-29aaalc0093m1zz/`
**Caveat:** this is a third-party aggregator. **It must be re-verified on the official GST portal's "Search Taxpayer by GSTIN/UIN"** at `https://www.gst.gov.in` before it goes into the spec.

**[VERIFIED]** CSTRI's own rate card says **"GST extra. Applicable as per prevailing rates"**. So CSB *does* charge GST forward on testing, and deliberately does not fix the rate on the rate card.
Source: `https://cstri.res.in/wp-content/uploads/2020/01/TestingCharges-2019.pdf`

**Taken together, these two facts mean: the lab is a normal taxable supplier of services for this purpose. It is not a tax-exempt government office.** That resolves most of the uncertainty in the question.

## 2.2 Is testing by a "government" lab taxable? The Government vs Governmental Authority trap

This is the point most likely to be got wrong by a developer, so it is worth stating carefully.

**[VERIFIED]** CBIC's own published position is that a statutory body is **not** "Government" for GST purposes: "a statutory body, corporation or an authority as a juridical entity is separate from the State and cannot be regarded as the Central or a State Government, and also does not fall within the definition of 'local authority'. Thus, regulatory bodies and other autonomous entities would not be regarded as the government or local authorities for the purposes of the GST Acts." The reasoning is that staff of such bodies do not become officers subordinate to the President under Article 53(1) or to the Governor under Article 154(1).
Sources: `https://gstlearn.com/2021/02/23/gst-sectoral-faq-government-services/`, `https://pgaa.in/Image/Presentation-%20GST%20on%20Govt%20Services.pdf`, `https://onlinetaxupdate.com/gst-on-government-services/`

Consequences, all **[LIKELY]** rather than [VERIFIED] because I did not read the notification text directly:

- **Entry 6 of Notification 12/2017-Central Tax (Rate)** exempts services *by* the Central Government / State Government / UT / local authority. A statutory body such as CSB generally **cannot** rely on it.
- **Entry 5 of Notification 13/2017-Central Tax (Rate)** puts services supplied by Central Government / State Government / UT / local authority to a business entity under **reverse charge** (the business-entity recipient pays). Because CSB is not "Government" for this purpose, **RCM entry 5 most likely does not apply**, and CSB charges GST forward on its own invoice. This is consistent with "GST extra" on the rate card.
Sources: `https://www.tgct.gov.in/tgportal/Docs/Notifications/TGST/Updated%20TGST%20Rates,%202017%2013-2017-CT(R).pdf`, `https://gstcouncil.gov.in/sites/default/files/e-version-gst-flyers/Reverse%20charge%20Mechanism.pdf`, `https://cbic-gst.gov.in/hindi/pdf/central-tax-rate/Notification12-CGST.pdf`

**[LIKELY]** Where a *government* supplier is involved, Notification 12/2017 also exempts government services where the consideration does not exceed **₹5,000**, plus certain registration/licensing functions. Given that a great many tests on the RSTRS rate card cost ₹30–₹600, this threshold would be highly relevant *if* the entity were held to be "Government". Since it most likely is not, it should not be relied upon — but a tax adviser should confirm, because it would change the arithmetic on nearly every small-value denier test.

**Design consequence (ASSUMPTION):** the tax engine must support, per (test × customer-category × date), the outcomes: **TAXABLE_FORWARD**, **EXEMPT**, **NIL_RATED**, **RCM_RECIPIENT_LIABLE**, **NON_GST**. Not just a rate. And a customer must carry a flag for whether they are a registered business entity, because that flag drives place of supply and could drive RCM if a future clarification changes the position.

## 2.3 SAC code

**[LIKELY]** **SAC 998346 — "Technical testing and analysis services"**, within group 99834 ("Scientific and other technical services"), under heading 9983 ("Other professional, technical and business services"). Scope described as testing and analysis of chemical and biological properties of materials, and testing and analysis in related sciences.
Sources: `https://busy.in/sac-code-998346/`, `https://www.credlix.com/hsn-code/998346`, `https://findgst.in/saclist/9983/sac-998346`, `https://www.getatoz.com/sac/code/998346/technical-testing-and-analysis-services`

**[UNVERIFIED / important]** Several items on the RSTRS rate card are **not** testing at all and would carry different SACs: "NE Machine Rent (CSTRI-MRTM) per Year" and "NE Machine Rent (Skeining machine) per year" are renting of machinery; "Muga Cocoon stifling per 1000 Nos.", "NE Warping charges per Warp", "Test - Dyeing charges" and "Electrospinning charges" look like job-work or manufacturing services on another person's goods, which sit under a different heading. **The spec must therefore put SAC on the test/service master row, not globally on the invoice.**

## 2.4 Rate — and why this must not be stated as fact

**[LIKELY, NOT VERIFIED]** The commonly stated rate for SAC 998346 is **18% (CGST 9% + SGST 9%, or IGST 18%)**. Sources are consistent on this, and describe testing and analysis (labs, QA, certification-related testing) as sitting in the standard 18% slab, with the position continuing after the September 2025 GST revision.
Sources: `https://busy.in/sac-code-998346/`, `https://gstverify.co.in/gst/hsn/998346/`, `https://www.credlix.com/hsn-code/998346`

**Contradictory source, flagged deliberately:** `https://www.registerkaro.in/hsn/gst-rate-hsn-code-998346` states **28%** for 998346. This contradicts every other source and appears to be an error (28% is a goods slab), and that page itself cites October 2020 data. This is exactly why the rate must be configuration, not code.

**[UNVERIFIED — a genuine live risk for this specific lab] Sericulture / agricultural-produce exemption.**
This is not a theoretical concern for a silk lab. **[LIKELY]** Entry 54 of Notification 12/2017-CT(R), read with heading 9986 (support services to agriculture), exempts certain services in respect of "agricultural produce", where "agricultural produce" is defined in Explanation 2(d) as produce of cultivation or rearing on which either no further processing is done, or only such processing as is usually done by a cultivator that does not alter essential characteristics and only makes it marketable for the primary market. Sericulture and silk cocoons appear within the broad agricultural-produce concept. Advance rulings have applied a strict three-condition test to Entry 54(c) — the process must be carried out **at an agricultural farm**, must not alter essential characteristics, and must make the produce marketable for the primary market — and have denied exemption where processing happened in a factory away from the farm.
Sources: `https://www.taxmanagementindia.com/visitor/detail_article.asp?ArticleID=12509`, `https://taxguru.in/goods-and-service-tax/agricultural-produce-gst-regime.html`, `https://gstcouncil.gov.in/sites/default/files/AAR/guj-2017-18-1_dt_13-12-17_guru_cold_0.pdf`, `https://cbic-gst.gov.in/pdf/circular-consolidated.pdf`

Practical reading, all **[UNVERIFIED]**: cocoon-related tests (cocoon character analysis, reelability, cocoon reeling performance, muga cocoon stifling) sit closer to the agricultural-produce boundary than raw-silk, twisted-silk, zari, yarn or fabric tests do — reeling is a specialised process not usually done by a cultivator. But testing performed at a laboratory in Dharmavaram is not performed "at an agricultural farm", which weighs against exemption. **This is a question for a tax adviser, not for the developer.** The software must simply be able to mark a specific test line as EXEMPT with a reason code and a notification reference.

## 2.5 Mandatory invoice fields

**[VERIFIED] Rule 46 of the CGST Rules, 2017** prescribes tax-invoice particulars. Clause (b) is quoted verbatim in the sources as: **"a consecutive serial number not exceeding sixteen characters, in one or multiple series, containing alphabets or numerals or special characters- hyphen or dash and slash symbolised as '-' and '/' respectively, and any combination thereof, unique for a financial year"**.
Sources: `https://fintaxblog.com/rule-46-of-cgst-rules-2017-tax-invoice/`, `https://gstlearn.com/2024/01/24/tax-invoice-cgst-rule-46/`, `https://taxguru.in/goods-and-service-tax/tax-invoice-requirements-section-31-cgst-act-gst-rule-46.html`

**[LIKELY]** The field set the invoice template must carry (Rule 46, commonly enumerated as 16 fields):

1. Supplier name, address, GSTIN
2. Invoice number (per clause (b) above) and date
3. Recipient name, address, and GSTIN/UIN if registered
4. For an unregistered recipient where taxable value is ₹50,000 or more: recipient name and address, **address of delivery, and name of State and State code**
5. **HSN / SAC code**
6. Description of service
7. Quantity / unit of measure (where applicable)
8. Total value of supply
9. **Taxable value** after any discount or abatement
10. **Rate of tax** — separately for central tax, State/UT tax, integrated tax, cess
11. **Amount of tax charged** — separately CGST / SGST / UTGST / IGST / cess
12. **Place of supply along with the name of the State**, in the case of an inter-State supply
13. Address of delivery where it differs from the place of supply
14. Whether the tax is payable on **reverse charge** basis
15. Signature or digital signature of the supplier or his authorised representative
16. Where Rule 48(4) e-invoicing applies, the declaration required by clause (s)

Amounts should be shown in words as well as figures, and a rounding-off line is normal practice.

**[VERIFIED] Place of supply for services — Section 12(2), IGST Act, 2017.** For services not covered by sub-sections (3) to (14): (a) supply to a **registered person** → place of supply is **the location of that person**; (b) supply to a person **other than a registered person** → the location of the recipient where the **address on record exists**, otherwise the **location of the supplier**. "Location of supplier" (s.2(15)) is the registered place of business or fixed establishment from which the service is provided; "location of recipient" (s.2(14)) is the registered business location or fixed establishment where the service is received.
Sources: `https://taxreply.com/gst-act-and-rules/Section-12-of-IGSTACT`, `https://fintaxblog.com/section-12-of-igst-act-2017-place-of-supply-of-services-supplier-recipient-located-in-india/`, `https://cleartax.in/v/gst/gst-acts/igst-section-12-place-of-supply-of-services-where-location-of-supplier-and-recipient-is-in-india`

**[ASSUMPTION but structurally critical] The two-GSTIN problem for Dharmavaram.** The GSTIN found is **29** (Karnataka). Dharmavaram is in **Andhra Pradesh** (State code **37**). I could **not** verify a `37AAALC0093M…` registration for CSB.

The software's tax outcome flips entirely on which GSTIN issues the invoice:

| Scenario | Supplier location | AP customer | Karnataka customer | Tamil Nadu customer |
|---|---|---|---|---|
| Dharmavaram invoices under an **AP (37)** CSB GSTIN | Andhra Pradesh | intra-State → **CGST + SGST** | inter-State → **IGST** | inter-State → **IGST** |
| Dharmavaram invoices under the **Karnataka (29)** CSTRI GSTIN | Karnataka | inter-State → **IGST** | intra-State → **CGST + SGST** | inter-State → **IGST** |

**Action for the scientist:** obtain from CSTRI/CSB accounts (a) the exact GSTIN under which RSTRS Dharmavaram raises invoices, (b) the registered address printed on that invoice, and (c) a sample of a real recent GST invoice from the unit. Everything about the invoice module depends on this. Do not guess.

**Design consequence (ASSUMPTION):** model a `legal_entity_registration` table — one row per GSTIN, with state, state code, registered address, effective dates — and link each `unit` to the registration it bills under. Compute CGST/SGST vs IGST from `supplier_registration.state_code` vs `place_of_supply_state_code`, never from a checkbox a clerk ticks.

## 2.6 Advance receipts — a requirement the developer will otherwise miss

**[VERIFIED]** A laboratory is paid **before** it tests. Under GST, for **services**, tax is payable on receipt of an advance, and the prescribed document is a **Receipt Voucher** under **Section 31(3)(d)** and **Rule 50**. Rule 50 particulars include supplier name/address/GSTIN; **"a consecutive serial number not exceeding sixteen characters, in one or multiple series, containing alphabets, numerals or the special characters hyphen/dash and slash, unique for a financial year"**; recipient name/address/GSTIN/UIN if registered; date of issue; description; **amount of advance received**; rate of tax; amount of tax (CGST/SGST/IGST/UTGST/cess); place of supply with State name and code for inter-State; whether tax is payable on reverse charge; and signature. A proviso allows that **where the rate or place of supply is not ascertainable at the time of receipt, the rate may be taken as 18% and the supply treated as inter-State**. Advances for **goods** were relieved by Notification 66/2017-Central Tax; the advance-tax rule bites on services.
Sources: `https://gstzen.in/a/receipt-voucher-cgst-rule-50.html`, `https://studycafe.in/rule-50-cgst-rules-receipt-voucher-16458.html`, `https://gstgyaan.com/rule-50-of-the-cgst-rules-receipt-voucher`

**[VERIFIED]** If the advance is taken and the supply is not made, a **Refund Voucher** under **Section 31(3)(e)** and **Rule 51** is required, and it must reference "number and date of receipt voucher issued in accordance with rule 50". Refund vouchers are reported in **GSTR-1 Table 11 Part II**; advances in **Table 11A** with adjustments in **Table 11B**.
Sources: `https://gstzen.in/a/refund-voucher-cgst-rule-51.html`, `https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/rules/cgst_rules/active/chapter6/rule51_v1.00.html`, `https://www.taxwink.com/blog/refund-voucher-gst-particulars`

**Design consequence (ASSUMPTION):** the software needs **four** GST document types, not one, each with its own FY series:
`RECEIPT_VOUCHER` (advance taken) → `TAX_INVOICE` (test completed) → `CREDIT_NOTE` / `DEBIT_NOTE` (adjustment) → `REFUND_VOUCHER` (advance returned). Plus `BILL_OF_SUPPLY` for exempt/nil supplies. The link `refund_voucher.receipt_voucher_id` is a hard requirement of Rule 51, so make it a foreign key, not a text note. And the lab's own **GAR-6-style money receipt** is a *fifth*, separate, non-GST document — do not conflate "we received your money" with "here is your tax invoice".

## 2.7 E-invoicing (IRN / IRP) — needs a decision, and there is a trap

**[LIKELY]** E-invoicing under Rule 48(4) is mandatory where **aggregate turnover exceeded ₹5 crore in any financial year from FY 2017-18 onwards** (Notification No. 10/2023-Central Tax, effective 01.08.2023). Turnover is tested **PAN-wise**, aggregating all GSTINs under the same PAN, and once crossed in any year since 2017-18 the obligation continues even if turnover later falls. It applies to B2B, B2G, exports and supplies to SEZ; not to pure B2C.
Sources: `https://tax2win.in/guide/e-invoicing-gst`, `https://www.gimbooks.com/blog/5-crore-e-invoice-turnover-rule-2026/`, `https://clearlycomply.org/blog/gst-e-invoicing-india-guide/`

**[VERIFIED] The relevant exemption.** **Notification No. 23/2021 – Central Tax, dated 1 June 2021** (43rd GST Council meeting; F. No. CBIC-20001/5/2021) amended Notification No. 13/2020 – Central Tax so that in the first paragraph, after the words "notifies registered person, other than", the words **"a government department, a local authority,"** were inserted. Effect: government departments and local authorities are excluded from e-invoicing even above the threshold.
Sources: `https://gstpress.com/notifications/ckpecyfmb7wnq0874rn9nznm6/amends-notification-no-13-2020-central-tax-to-exclude-government-departments-and-local-authorities-from-the-requirement-of-issuance-of-e-invoice`, `https://taxguru.in/goods-and-service-tax/govt-depts-local-authorities-excluded-e-invoice-requirement.html`, `https://finodha.in/notification-no-23-2021-central-tax-gst/`

**The trap, stated plainly.** Section 2.2 establishes that CBIC treats a **statutory body as NOT being "Government"**. Notification 23/2021 exempts a **"government department"**. A statutory body registered as constitution-type "STATUTORY BODY" is arguably **not a government department**. If that reading is right, and CSB's PAN-level turnover has ever exceeded ₹5 crore since FY 2017-18 (which for a 39-member national statutory board with 17 testing centres, R&D institutes and a seed-production network is **[ASSUMPTION]** very likely), then **CSB may be inside the e-invoicing mandate**, and every B2B invoice would need an IRN from the Invoice Registration Portal.

**[VERIFIED] Consequence of getting it wrong:** where Rule 48(4) applies and the invoice is not issued in that manner, sub-rule (5) provides that "such invoice shall not be treated as a valid invoice", meaning the customer is denied input tax credit. For a lab whose customers are twisters, weavers, traders and exporters who *do* claim ITC, this is a commercially serious failure, not a technicality.

**[LIKELY]** Two mitigations exist: the GST portal has an "**E-invoice Exemption Declaration**" functionality for exempt businesses to avoid automated notices; and for AATO ≥ ₹10 crore there is a **30-day limit** for reporting invoices/credit notes/debit notes to the IRP (effective 1 April 2025).

**Recommendation (ASSUMPTION):**
- **Ask CSB accounts / their GST consultant a direct written question:** "Is Central Silk Board (PAN AAALC0093M) within the e-invoicing mandate, or has it filed an e-invoice exemption declaration?" Put the answer in the spec as a decision record.
- **Build the invoice module e-invoice-ready regardless.** That means: capture every field the IRP schema needs at invoice time (SAC to 6 digits, unit codes, state codes, full addresses, PIN codes), and give the invoice table nullable columns `irn`, `ack_no`, `ack_dt`, `signed_invoice_jws`, `signed_qr_jws`, `irp_status`, `irp_cancelled_on`. Then IRP integration becomes a background job, not a re-architecture.
- **[LIKELY]** Turnover above ₹5 crore requires **6-digit** SAC on invoices; exporters use 8-digit. So store SAC as a 6-digit string minimum.

---

# 3. Government invoice / receipt numbering

## 3.1 Verified rules

**[VERIFIED]** Rule 46(b) (quoted in full in 2.5) requires the invoice number to be **consecutive**, **maximum 16 characters**, composed only of **letters, digits, hyphen `-` and slash `/`**, in **one or multiple series**, and **unique for a financial year**.

**[VERIFIED]** GSTN issued an advisory on **4 April 2019** confirming that this implies taxpayers should **start a new invoice series, unique for the financial year, at the start of each financial year (w.e.f. 01/04)**. A parallel provision exists in **Rule 49** for a **Bill of Supply** (composition scheme / exempted supplies). The same 16-character, FY-unique, consecutive-series wording appears in Rule 50 (receipt voucher) and Rule 51 (refund voucher).
Sources: `https://irisgst.com/effective-1st-april-2019-reset-the-invoice-number-series-gst-advisory/`, `https://taxguru.in/goods-and-service-tax/commentary-tax-invoice-number-gst.html`

**[VERIFIED]** Multiple series are explicitly permitted, including branch-specific prefixes, provided each series stays sequential. A mid-year format change that breaks the sequence is inadvisable. Non-adherence is not merely a paperwork issue — it can cause problems generating E-way Bills, and wrong or missing invoice details can result in **ITC denial to the buyer** and penalty **up to ₹25,000 under Section 122**.

**[VERIFIED]** In **GSTR-1**, the supplier reports serial numbers of tax invoices issued in the tax period, **including cancelled invoices, which are separately reported**. This is the statutory basis for "cancel, never delete".

**[VERIFIED]** On the *receipts* side, GFR/Receipts-and-Payments practice requires, before a receipt book is used, that the number of forms it contains be counted and recorded "in a conspicuous place in the book over the signature of the Government officer in charge of the book", with counterfoils of used receipt books kept in his personal custody, and departmental regulations providing "for maintenance of a proper account of the receipt and issue of receipt books, the number of receipt books to be issued at a time to each officer, and a check with the officer's accounts of the used books when returned."
Source: `https://www.mcrhrdi.gov.in/asodr2018/week3/1-ASO-DR-GFR2017-May2018.pdf`

That paper-era rule translates cleanly into a software requirement: **numbers are a controlled stock, allotted to a named officer, fully accounted for, with no unexplained gaps.**

## 3.2 Recommended numbering design (ASSUMPTION)

**Financial year in India runs 1 April to 31 March.** FY label format: `2026-27`.

Series definition table:

```
document_series
  id
  unit_id                 -- DVM
  doc_type                -- TAX_INVOICE | BILL_OF_SUPPLY | RECEIPT_VOUCHER
                          --  | REFUND_VOUCHER | CREDIT_NOTE | DEBIT_NOTE
                          --  | MONEY_RECEIPT | TEST_REPORT | SAMPLE_ID | QUOTATION
  fy                      -- 2026-27
  prefix                  -- e.g. 'DVM/INV/'
  width                   -- 5
  next_number             -- 1
  max_len_check           -- 16 for GST doc types
  reset_policy            -- FY
  status                  -- OPEN | CLOSED
  UNIQUE (unit_id, doc_type, fy)
```

Worked examples, all within 16 characters:

| Document | Pattern | Example | Length |
|---|---|---|---|
| Tax invoice | `DVM/INV/{FY2}/{5}` | `DVM/INV/2627/00417` | 18 — **too long** |
| Tax invoice (corrected) | `DVM/{FY2}/{5}` | `DVM/2627/00417` | 14 ✓ |
| Bill of supply | `DVB/{FY2}/{5}` | `DVB/2627/00042` | 14 ✓ |
| Receipt voucher | `DVR/{FY2}/{5}` | `DVR/2627/01203` | 14 ✓ |
| Refund voucher | `DVF/{FY2}/{4}` | `DVF/2627/0009` | 13 ✓ |
| Credit note | `DVC/{FY2}/{4}` | `DVC/2627/0011` | 13 ✓ |

**Note the 16-character trap:** `DVM/INV/2026-27/00417` is 21 characters and would be non-compliant. Compress the FY to 4 digits (`2627`) and keep the prefix to 3–4 characters. **The software must validate length at series-creation time and refuse to save a series that can overflow 16 characters at its maximum number.** Test report numbers and sample IDs are *not* GST documents and are free of the 16-character limit — do not apply it to them.

**Gapless allocation (ASSUMPTION):**
- Allocate the number **at the moment of issue**, inside the same database transaction that commits the document — never in the UI when a user opens a "new invoice" form. Otherwise abandoned drafts eat numbers.
- Use a row-locked counter (`SELECT ... FOR UPDATE` on `document_series`), not a database sequence, because sequences leak numbers on rollback and cannot be reset per financial year in a controlled way.
- Never allocate a number to an unsaved draft. Drafts get a temporary UUID and show "Not yet numbered".

**Cancellation vs deletion (ASSUMPTION, grounded in the VERIFIED GSTR-1 point):**
- **No delete. Ever.** No hard delete on any numbered document, and no `DELETE` permission granted to the application database user for those tables.
- A numbered document has `status ∈ {ISSUED, CANCELLED}`. Cancellation requires `cancelled_on`, `cancelled_by`, `cancellation_reason` (from a controlled list) and, for GST documents, `cancelled_in_return_period`.
- **A cancelled number is retired, not reused.** Reusing it would create two documents with the same number in the same FY.
- Cancellation is only permitted **before** the document has been reported in a GST return. After that, the correction instrument is a **Credit Note** (Section 34 / Rule 53) that references the original invoice number and date, not a cancellation. The software should enforce this by comparing the invoice date against a `return_filed_upto` date held per GSTIN per period.
- Provide a **Series Register / gap report**: for each series, list every number from 1 to `next_number - 1` and its state — ISSUED, CANCELLED, or **MISSING**. Any MISSING row is a bug or a data-integrity incident and should raise an alert. This is the digital equivalent of the GFR counterfoil check.
- Every numbered document must be stored as a **frozen rendered artefact** (the exact PDF bytes that were issued) plus a SHA-256 hash, not merely as data that is re-rendered on demand from a template that may later change.

**Test reports specifically (ASSUMPTION, aligned with ISO/IEC 17025 practice):** a report is never edited after issue. Corrections are issued as an **amended report** carrying its own new number, a unique identification, and an explicit reference to the original report it supersedes. Both remain retrievable, and the superseded one must be visibly marked as superseded — including on any public verification page (see section 5). I could not retrieve the verbatim ISO/IEC 17025:2017 clause on amended reports; **[UNVERIFIED]** — the developer should be given the actual standard text by the scientist, who will have it as an accredited lab.

---

# 4. Digital signing of certificates in India

## 4.1 Legal foundation

**[VERIFIED]** The IT (Amendment) Act, 2008, effective **27 October 2009**, inserted **Section 3A ("Electronic signature")** into the IT Act, 2000, making the law technology-neutral by recognising any reliable technique listed in the **Second Schedule**. An electronic signature is reliable if it is unique to the signatory, capable of identifying them, and created under their sole control. **Section 5** gives legal recognition to electronic signatures. eSigned documents are admissible under **Section 65B of the Indian Evidence Act / Section 63 of the Bharatiya Sakshya Adhiniyam, 2023**.
Sources: `https://www.leegality.com/blog/law-around-aadhaar-esign`, `https://bhattandjoshiassociates.com/digital-signature-laws-in-india/`, `https://documentesign.com/blog/esignature-laws-in-india`

**[VERIFIED]** Aadhaar eSign's validity rests on **Gazette Notification GSR 61(E) of 28 January 2015** — the "Electronic Signature or Electronic Authentication Technique and Procedure Rules, 2015" — issued under Section 3A. The **Controller of Certifying Authorities (CCA)**, under MeitY, is the apex regulator and codified the framework in the **e-Authentication Guidelines dated 3 May 2019** (`https://cca.gov.in/sites/files/pdf/esign/CCA-EAUTH.pdf`). Only a small number of licensed **eSign Service Providers (ESPs)** — around seven — are authorised.

**[VERIFIED]** First Schedule exclusions still apply: wills, trusts, negotiable instruments (except cheques), powers of attorney, and registration of sale deeds cannot be electronically signed. **A laboratory test report is not in that list**, so electronic signature is legally available here.

## 4.2 The three options compared

**[VERIFIED] Class 2 is dead.** CCA guidelines to CAs dated **26 November 2020** discontinued Class 2 DSC from **1 January 2021**; CAs were directed to issue Class 3 as a combination of Class 2 and Class 3. Already-issued Class 2 certificates remained usable until expiry. Class 3 is now standard for income-tax, MCA, GST and e-tender filings, and government e-procurement portals (GeM, CPPP, state PWD) mandate Class 3 with no alternative.
Sources: `https://cleartax.in/s/no-class-2-digital-signature-2021`, `https://cca.gov.in/dsc_organisational.html`, `https://www.leegality.com/blog/aadhaar-esign-vs-dsc`

**[VERIFIED] The critical HSM rule that determines cost.** CCA's FAQ position is that users of an organisation **cannot** store the signature-creation key of Class 2 / Class 3 DSCs in an HSM; those keys must **mandatorily** be stored in a **FIPS 140-2 Level 2 validated crypto token in the subscriber's custody**. Separately, **Organizational Document Signer Certificates** — described in CCA's Interoperability Guidelines as certificates "issued to organizational software applications that operate automatically to authenticate documents attributed to the organization", whose "main purpose is automated signing and reflecting organizational accountability" — carry an additional Certificate Policies OID **2.16.356.100.2.2** and may be issued for 1, 2 or 3 years. **Class 2 Document Signer could be issued as a P12/PFX file, but Class 3 Document Signer can be downloaded on HSM only.** An undertaking is required confirming the key pair was generated on an HSM under the organisation's administrative and physical custody, with signing-key activation controls held only by it. CCA explicitly clarifies that a Document Signer Certificate is "for use with an organisation's software for automated authenticated response and is **not a replacement for the signature of the organisation's authorised signatory**."
Sources: `https://cca.gov.in/faq.html`, `https://cca.gov.in/sites/files/pdf/guidelines/CCA-IOG.pdf`, `https://cca.gov.in/sites/files/pdf/guidelines/CCA-IVG.pdf`

### Comparison table

| Dimension | **A. Class 3 individual DSC on USB token** | **B. eSign (Aadhaar-based, via ESP)** | **C. Organizational Document Signer certificate, server-side** |
|---|---|---|---|
| Legal basis | IT Act s.3, "digital signature" via licensed CA | IT Act s.3A + GSR 61(E) 2015 + CCA e-Auth Guidelines | IT Act s.3, licensed CA, CCA-IOG Document Signer profile |
| Who it identifies | **The individual scientist**, by name, with organisational attributes | **The individual**, via UIDAI eKYC | **The organisation** (CSB / RSTRS Dharmavaram), by legal name |
| Key storage | **[VERIFIED]** Must be FIPS 140-2 Level 2 crypto token in the subscriber's custody. HSM **not** permitted. | Key created and destroyed per transaction by the ESP; nothing to hold | **[VERIFIED]** Class 3 DS: **HSM only**. Class 2 DS was P12/PFX (legacy). |
| Bulk / automated signing | **Poor.** Token must be physically present; one PIN entry per signature (some middleware allows a session, but it is fragile and arguably weakens sole control) | **Poor for bulk.** Each signature is a separate OTP/biometric authentication by the individual | **Excellent.** This is precisely its designed purpose — **[VERIFIED]** typical use cases listed include bulk signing of GST invoices, claims, agreements, contract notes, and server-side signing of insurance policies |
| Works when internet is down | **Yes** — fully offline | **No** — requires UIDAI/ESP round trip | **Yes** if HSM/key is on-premise |
| Cost signal | **[LIKELY]** Class 3 DSC street price from roughly ₹826, combo (sign+encrypt) from roughly ₹1,652, plus GST at 18%, plus token; rises with validity | **[UNVERIFIED]** per-transaction, contract-negotiated by volume tier; no reliable public rate found | **[LIKELY]** certificate priced well above individual DSCs (eMudhra's CCA-filed **ceiling** is ₹25,000/yr for most classes — a ceiling, not a street price) **plus** a FIPS 140-2 L2/L3 HSM as a separate hardware cost |
| Sources | `https://www.eversign.in/price-list/`, `https://cca.gov.in/faq.html` | `https://cca.gov.in/eSign.html`, `https://support.signeasy.com/support/solutions/articles/5000756979-india-esign-pricing` | `https://cca.gov.in/sites/files/pdf/guidelines/CCA-IOG.pdf`, `https://www.scribd.com/document/838956970/...` (eMudhra fee schedule), `https://digitalsignature.net.in/document-signer/` |

**[VERIFIED but important] eMudhra's published fee schedule figures are CCA-filed *maximum chargeable* amounts** ("All fees are in INR and represent maximum chargeable amounts, excluding additional service costs"), with most classes at ₹25,000 for one-year validity. Reseller street pricing is an order of magnitude lower. **Do not put ₹25,000 in a budget as if it were the price** — get written quotes from two or three CCA-licensed CAs or their RAs.

## 4.3 The plain "self-signed PKCS#12" option — and why it must be named honestly

A developer can generate a PKCS#12 (`.p12` / `.pfx`) keypair locally and sign PDFs with it using an open-source library. It is free, works offline, and is technically indistinguishable in mechanics from option C.

**But:** a self-signed certificate is **not** issued by a CCA-licensed Certifying Authority. **[ASSUMPTION]** Therefore:
- Adobe Reader and other viewers will show "**At least one signature has problems / The signer's identity is unknown**" unless the verifier manually installs and trusts the certificate. To an external buyer, an exporter's bank, or an auditor, that visual warning reads as *forged*, which is worse than no signature at all.
- The claim to be a "digital signature" under Section 3 of the IT Act rests on a certificate issued by a licensed CA. A self-signed key does not have that. It may still be an "electronic signature" under Section 3A if a notified reliable technique is used, but self-signed PKCS#12 is not one of the notified techniques.

**Verdict (ASSUMPTION):** self-signed PKCS#12 is acceptable **only** as the internal integrity mechanism during development and for the internal tamper-evidence chain. It should **never** be presented to a customer as a legal signature, and the spec should say so in exactly those words so the developer does not quietly ship it as the real thing.

## 4.4 Recommendation

**v1 — build the signing *seam*, use the cheapest legally-honest option, and rely on the QR for public trust.**

1. **Separate three concepts in the data model.** They are routinely confused and the confusion causes real problems:
   - **Approval** — the *scientist's* act of authorising the result. An authenticated, MFA-protected, fully audited in-application action by a named user who is on the NABL-declared list of signatories. **This is the act that carries scientific and administrative accountability.** **[VERIFIED]** NABL 151 requires labs to declare "Proposed personnel declared to report, review and authorization of results (Signing of test reports)" with name, designation, qualification, experience, the specific area of testing authorised, and specimen signature — so the software must model **signatory authorisation scoped to a test discipline**, and must refuse to let a chemistry-authorised officer approve a physical-testing report. Source: `https://nabl-india.org/nabl/file_download1.php?filename=202307131055-NABL-151-doc.doc`
   - **Cryptographic sealing** — the machine act of signing the PDF bytes so tampering is detectable.
   - **Public verification** — the QR / verification page (section 5).
2. **Implement sealing behind an interface**, e.g. `PdfSigner.sign(bytes, signerProfile) -> signedBytes`, with implementations `LocalP12Signer`, `HsmDocumentSignerSigner`, `EsignEspSigner`. Swapping later is then a configuration change.
3. **Use PAdES with a document timestamp** from an RFC 3161 timestamp authority, and enable **LTV** (long-term validation) by embedding the OCSP/CRL responses. Without a timestamp, signatures "expire" when the certificate does — a real problem for reports an exporter may need to produce three years later.
4. **Print the approving scientist's name, designation and the approval timestamp as visible text on the report**, plus the scanned specimen signature image if the lab's quality manual permits it, plus the QR. Do not rely on an invisible cryptographic signature for human trust.
5. **[ASSUMPTION] Do not attempt bulk USB-token signing in v1.** It is the single most common source of failure in Indian government signing projects: token drivers, 32-bit Java middleware, browser plugin deprecation, PIN lockouts, and one physical token that has to be in one machine at one time. If a token-based signature is contractually required, do it as a **deliberate, low-volume, end-of-day batch** on one designated workstation, with an explicit queue and retry, and never on the request path of a web page.

**v2 — the durable answer: a Class 3 Organizational Document Signer certificate on an HSM.**

**[VERIFIED]** This is the CCA-recognised instrument for exactly this use case (automated organisational signing, bulk signing of invoices and documents), it is issued in the organisation's legal name, and it carries the Document Signer OID. It is offline-capable, gives unlimited throughput, and needs no per-signature human interaction. Its costs are the certificate plus an HSM (a network HSM appliance, or a cheaper USB-form FIPS-validated HSM — **[UNVERIFIED]** whether CCA-licensed CAs will issue a Class 3 Document Signer onto a low-cost USB HSM for this lab; ask the CA directly).

**[VERIFIED] And the honest caveat to hand to the scientist:** CCA states a Document Signer Certificate "is not a replacement for the signature of the organisation's authorised signatory". So v2 does not remove the need for the named scientist's recorded approval; it only automates the sealing. That is why they must be separate concepts in the model.

**Where eSign fits (ASSUMPTION):** eSign is attractive for the *customer's* side — a reeler electronically signing the test requisition form, an undertaking, or a sample-submission declaration — because it needs no hardware from them. It is a poor fit for the lab issuing 40 reports a day, because each signature needs the officer's own OTP or biometric. **And it fails entirely when the internet is down**, which for Dharmavaram (section 9) is disqualifying for the core report-issue path.

---

# 5. Tamper-evident public verification of a certificate

## 5.1 How Indian government systems actually do it — four patterns worth copying

**Pattern 1 — GST e-invoice: signed QR as a JWS.** **[VERIFIED]** The Signed QR Code is returned by the IRP in the IRN response in Base64-encoded form and is "in the form of a JWT with three parts — signature parameters (header), data (payload), and signature — separated by dots", signed with **SHA256withRSA**. The QR payload carries a **small subset** of invoice data, not the whole invoice: supplier GSTIN, recipient GSTIN, document number, document date, total invoice value including tax, number of line items, HSN of the main item, and the **64-character IRN hash**. IRN itself is a hash of ⟨Supplier GSTIN⟩⟨Financial Year⟩⟨Doc Type⟩⟨Doc Number⟩ — the published worked example being that the hash of `01AAAAB1234C1Z02019-20INVAB1234` is `35054cc24d97033afc24f49ec4444dbab81f542c555f9d30359dc75794e06bbe`. To verify offline, "the public key of the certificate used to sign is required"; NIC's verifier app "decodes the JWT and validates the signature against the NIC public key offline — no internet is needed for the signature check itself, only for the cancellation lookup". The portal offers "Verify QR Code" under Help → Tools and "Verify Signed Invoice" for uploading the signed JSON.
Sources: `https://einvoice1.gst.gov.in/Documents/IRN_QR_FAQS.pdf`, `https://taxguru.in/goods-and-service-tax/signed-qr-code-e-invoicing-system-gst-faqs.html`, `https://cleartax.in/s/gst-e-invoice-qr-code-generation`, `https://www.gstn.org.in/assets/mainDashboard/Pdf/GST%20e-invoice%20System%20-%20Overview%20-%20Version%20Dt.%2029-5-2020.pdf`

**Pattern 2 — Aadhaar Secure QR: signed payload with an embedded photo, fully offline.** **[VERIFIED]** The Aadhaar QR code is "digitally signed by UIDAI and used for offline verification of identity", present on e-Aadhaar, the Aadhaar letter, the PVC card and mAadhaar. It contains digitally signed data — last 4 digits of the Aadhaar number, name, address, gender, date of birth, the holder's photograph, and masked mobile and email — signed with UIDAI's digital signature. UIDAI **publishes the public key certificate** for validation (e.g. `uidai_offline_publickey_26022019.cer`), with a separate staging certificate for pre-production. UIDAI-approved QR reader apps "work in offline mode and do not require internet for scanning… the signature check is done locally against the embedded UIDAI public key", and if the signature fails the reader displays "**QR Code not verified**". In the related Paperless Offline eKYC, mobile and email are stored as **repeated SHA-256 hashes** (e.g. `Sha256(Sha256(mobile + ShareCode))` repeated 4 times) rather than in clear.
Sources: `https://uidai.gov.in/en/916-developer-section/data-and-downloads-section/19388-uidai-certificate-details-2.html`, `https://mndc.uidai.gov.in/en/ecosystem/authentication-devices-documents/qr-code-reader.html`, `https://uidai.gov.in/en/306-faqs/aadhaar-online-services/secure-qr-code-reader-beta/10781-what-is-uidai-secure-qr-code-how-qr-code-enhance-the-security-of-e-aadhaar.html`, `https://uidai.gov.in/en/307-faqs/aadhaar-online-services/offline-aadhaar-data-verification-service.html`

**Pattern 3 — DigiLocker / Parivahan: signed PDF plus QR, legally equated to the original.** **[VERIFIED]** DigiLocker documents "are issued directly by government departments and institutions and are therefore authentic; users cannot make changes to them", and "Under the Information Technology Act, 2000, these certificates/documents are deemed at par with original physical documents". **MoRTH notification RT-11036/64/2017-MV** specifies that driving licences, RCs and other documents pulled into DigiLocker or mParivahan are legally recognised on par with originals under the IT Act, 2000. Two verification routes exist: **validating the digital signature on the PDF**, or **scanning the QR code** with the DigiLocker app's Scanner, which "returns the original issuer record" and displays the issuing authority, the credentials, and a "Verified" status with a digital timestamp. A published employer-verification guide notes the practical caution that documents should be kept as PDFs with the signature intact, since "screenshots or edited versions may not be accepted".
Sources: `https://www.digilocker.gov.in/`, `https://developers.digitallocker.gov.in/faq.php`, `https://iimbg.ac.in/wp-content/uploads/2026/05/Employer_Verification_Guide_DigiLocker.pdf`, `https://www.primebook.in/blog/what-is-digilocker-scanner`

**Pattern 4 — e-Sanad: an issuer-verified depository plus a public e-Register.** **[VERIFIED]** MEA's e-Sanad (`https://esanad.nic.in/`), launched 24 May 2017 with the CBSE depository, provides "contactless, faceless, cashless and paperless document verification/attestation/apostille". The primary requirement is that the document be available in a digital depository; a "Document Issuing Authority" (DIA) verifies it, then MEA attests/apostilles digitally within 7 working days. Critically for our design: it "allows foreign departments and authorities to cross-verify the authenticity of digitally attested or apostilled documents via a link", and an **e-Register of Apostilles** on the portal records the date and number of every apostille issued along with information on the person or authority that signed the underlying document, which recipients can query.
Sources: `https://www.pib.gov.in/PressReleasePage.aspx?PRID=2168764&reg=3&lang=2`, `https://www.mea.gov.in/Images/attach/e_sanad_website.pdf`, `https://esanad.nic.in/`

## 5.2 The signed-QR pattern, explained for a non-programmer

The idea in one paragraph, for the scientist:

> The lab keeps one secret key. Nobody else has it. When a report is approved, the software takes a handful of the report's key facts — report number, date, sample identity, and a fingerprint of the full PDF — writes them into a tiny message, and uses the secret key to produce a **seal** over that message. Message plus seal are printed on the report as a QR code. The lab publishes the matching **public key** on its website. Anyone can now check the seal using the public key. If even one character of the message has been altered, the seal no longer matches and the check fails. This works **without any internet connection**, because the checking maths only needs the public key, which the scanner app already holds. The internet is needed only for the *extra* question "has this report since been cancelled or superseded?" — which a signature can never answer, because a signature is a statement about the past.

That last sentence is the crucial design insight, and it is exactly the distinction the GST FAQ makes: "the signature check alone proves the payload was IRP-stamped, but not that it's still live — cancellation status requires a network lookup."

## 5.3 Recommended QR payload

**[ASSUMPTION]** — this is my concrete design proposal.

**Format: JWS compact serialisation** (`base64url(header).base64url(payload).base64url(signature)`), same shape as the GST signed QR, so any developer who has worked on GST e-invoicing recognises it immediately. Use **ES256** (ECDSA over P-256) rather than RS256 — an ECDSA signature is 64 bytes versus 256 for RSA-2048, which matters a great deal when the whole thing has to fit in a QR code that a cheap phone can read off a printed page.

**Header:**
```json
{ "alg": "ES256", "typ": "JWT", "kid": "csb-dvm-2026-01" }
```
`kid` is the key id. It lets the lab rotate keys without invalidating three years of already-issued reports — the verifier looks up the right public key by `kid`. **Do not omit this.** Key rotation without a `kid` means reprinting history.

**Payload — keep it small, and keep personal data out of it:**
```json
{
  "v":  1,
  "iss":"CSB-RSTRS-DVM",
  "rno":"DVM/2627/TR/00417",
  "rdt":"2026-08-19",
  "sid":"DVM/2627/S/01188",
  "smk":"Raw silk, 20/22D, 5 skeins",
  "tst":"IS15090:P1-XI",
  "res":"3A",
  "cid":"a1b2c3d4",
  "dgs":"9f86d081884c7d65...",
  "ver":"https://<host>/v/",
  "iat":1786924800
}
```

| Key | Meaning | Why |
|---|---|---|
| `v` | Payload schema version | Lets you change the payload in 2028 without breaking 2026 scanners |
| `iss` | Issuing unit code | A verifier must know *which* CSB unit issued this |
| `rno` | Report number | The human-facing identifier |
| `rdt` | Report date | |
| `sid` | Internal sample id | Links back to the lab's chain of custody |
| `smk` | Very short sample description | So a scanner sees *what* was tested, not just a number |
| `tst` | Test / standard code | E.g. IS 15090 Parts I–XI, or ISA |
| `res` | Headline result, e.g. a grade | **Optional — see the caution below** |
| `cid` | **Opaque short customer token** — an 8-hex-char HMAC of the customer id under a server-side secret. **Not the name, not the phone number, not the GSTIN.** | DPDP (section 7). A QR on a document that travels through traders' hands must not leak a reeler's identity to every scanner |
| `dgs` | SHA-256 of the issued PDF bytes | This is what makes the *document*, not just the metadata, tamper-evident |
| `ver` | Verification page base URL | So a generic QR scanner that does not understand JWS still lands the user somewhere useful |
| `iat` | Issued-at, Unix seconds | |

**Size budget:** the above payload is roughly 300–380 bytes of JSON; base64url-encoded with an ES256 signature the whole JWS lands around **480–560 characters**. That is comfortably a QR **version 11–14 at error-correction level M**, printable at about 30 mm square at 300 dpi and scannable by an ordinary phone. **Test this on real printed output on the lab's actual printer before finalising.** If it does not scan reliably, the levers in order are: drop `smk`, shorten `dgs` to the first 16 bytes (still 128 bits of collision resistance, which is ample here), and shorten `tst`.

**Caution on `res` (the headline result).** **[ASSUMPTION]** Putting the grade in the QR is genuinely useful — a buyer at the cocoon market can scan and instantly see "3A" without internet. But it also means a lower grade is instantly visible to anyone who picks up the paper. That is a commercial-sensitivity decision for the scientist, not the developer. **Recommendation: make it a per-unit configuration flag, default OFF, and ask.**

**Making the QR readable by dumb scanners too.** **[ASSUMPTION]** Most people will scan with the default camera app, which expects a URL. So encode a **URL that carries the JWS as a fragment**:

```
https://verify.<host>/v#<jws>
```

Using the **fragment** (`#`) rather than a query string is deliberate and matters: fragments are **not sent to the server** and **not written into server access logs or proxy logs**. A plain camera app opens the page; the page's JavaScript reads the fragment and can verify the signature entirely in the browser. A purpose-built offline verifier app ignores the URL wrapper and verifies the JWS directly. And **[VERIFIED privacy rule]** this satisfies the standing instruction never to place personal or sensitive data in URL parameters or query strings.

## 5.4 Verification page design: anonymous vs authenticated

**[ASSUMPTION]** This two-tier design is my recommendation, and its shape is driven by DPDP (section 7) and by the Aadhaar precedent of masking.

### Tier 1 — anonymous scanner (no login, works offline in-browser)

Shows a large, unambiguous status banner and a minimal field set:

**GENUINE — issued by this laboratory**
| | |
|---|---|
| Issuing laboratory | Regional Silk Technological Research Station / Silk Conditioning & Testing House, CSTRI, Central Silk Board, Dharmavaram, Andhra Pradesh |
| Report number | DVM/2627/TR/00417 |
| Report date | 19 August 2026 |
| Sample | Raw silk, 20/22D, 5 skeins |
| Test / standard | IS 15090 Parts I–XI |
| Result | 3A *(if enabled)* |
| Issued to | **A***** T******* S**** M**** — masked *(pattern borrowed from Aadhaar's masked mobile/email)* |
| Document fingerprint | `9f86d081…` — with a "check my PDF" file picker that hashes the user's copy locally in the browser and compares |
| Live status | ✔ Valid · or ⚠ **SUPERSEDED by DVM/2627/TR/00623** · or ✖ **CANCELLED on 02 Sep 2026** *(requires internet; if offline, say so honestly: "Signature verified offline. Cancellation status could not be checked — no internet connection.")* |

Four failure states, each with distinct, plain wording:
- **"Signature verified"** — seal matches.
- **"NOT GENUINE — the seal does not match. This document may have been altered."** — signature invalid.
- **"Unknown issuer key"** — `kid` not recognised. Do not say "not genuine"; say the scanner needs updating.
- **"This is not a report QR code."** — malformed payload.

And one more that matters practically: **"Signature verified, but the PDF you uploaded does not match this QR."** That is the case where someone photographs a genuine QR and pastes it onto a forged report — the single most likely real-world attack, and the reason `dgs` is in the payload.

**Deliberately NOT shown to an anonymous scanner:** full customer name, address, phone number, GSTIN, the number of samples the customer has ever submitted, individual measured values, or anything that lets a competitor at the Dharmavaram cocoon market profile a reeler's quality history by scanning their paperwork.

### Tier 2 — authenticated verifier (logged-in customer, or lab staff)

After login, additionally: the full customer name and address, the complete measured values table, the sample chain of custody, the invoice/receipt reference, the download of the original signed PDF, the amendment history chain, and the identity of the approving scientist.

**Plus, for the customer's own reports (ASSUMPTION):** a "share for verification" link with a **short expiry** and an **access log** — mirroring DigiLocker's consented-share model, which is the pattern Indian users already understand. A buyer or bank gets a link; the reeler can see who opened it and when.

**Rate limiting and anti-enumeration (ASSUMPTION):** report numbers are sequential and therefore guessable. The verification endpoint must be rate-limited per IP, must not accept a bare report number as a lookup key without the signed payload (or a captcha), and must never respond differently to "report does not exist" versus "report exists but you may not see it" in a way that lets an attacker enumerate the lab's customer base.

## 5.5 Key management — the part that gets skipped and then hurts

**[ASSUMPTION]**
- Two keypairs from day one: **`kid: csb-dvm-test-01`** and **`kid: csb-dvm-2026-01`**. Never let a test key sign production, and never let production data be verifiable by a test key. Aadhaar does exactly this with a separate staging certificate.
- Publish public keys as a **JWKS document** at a stable HTTPS URL, plus a printable PDF fingerprint sheet for offline scanner apps to embed. Follow UIDAI's example: publish the key openly, with its issue date in the filename.
- The private key must **never** be in the source repository, in a config file committed to version control, in an environment variable dump, or in a database backup. On-premise: OS keystore or a USB HSM. Cloud: a managed KMS or HSM.
- Write down, in the spec, the **key compromise procedure**: revoke the `kid`, stand up a new one, and — this is the bit everyone forgets — **the verification page must be able to say "reports signed with key X between date A and date B require manual confirmation with the laboratory"** rather than silently failing thousands of legitimate reports.

---

# 6. DigiLocker issuer integration

## 6.1 Can a body like CSB push issued certificates to a citizen's DigiLocker?

**Short answer: [LIKELY] yes in principle, [ASSUMPTION] no in practice for v1 or v2 of this project.**

**[VERIFIED] Who can be an issuer.** The updated onboarding process requires that eligible organisations be **registered, authorised to issue documents, have a functional website, digital signatures, and official domain email IDs**, with registration via the **APISetu partner portal at `partners.apisetu.gov.in`**. Issuer types explicitly include "universities, insurance companies, government departments, or licensing authorities issuing verified digital documents". DigiLocker's own onboarding FAQ says an aspiring issuer must submit a request with a **detailed use case**, and that the process involves approval by the relevant team or administrators.
Sources: `https://apisetu.gov.in/digilocker`, `https://www.digilocker.gov.in/assets/FAQ%20DL%20EL_onboarding.pdf`, `https://developers.digitallocker.gov.in/assets/img/onboarding-issuers-&-requesters.pdf`, `https://x.com/digilocker_ind/status/1799024651714416883`

CSB meets the surface criteria on paper: it is a statutory body, it is authorised to issue test reports, it has a functional website (`csb.gov.in`, `cstri.res.in`), it has digital signature capability, and it has `nic.in` email domains (`cstriban.csb@nic.in` is verified from CSTRI's own material).

**[VERIFIED] The technical model — and note the terminology, because it is counter-intuitive.** The current specification is the **DigiLocker Issuer API Specification v1.13 (May 2024)**, at `https://cf-media.api-setu.in/resources/DigiLocker-Issuer-APISpecification-v1-13.pdf`.

- The **Pull model** "enables a DigiLocker user to search a document/certificate from the issuer repository and fetch (pull) it into DigiLocker". Issuer departments use these APIs for documents that are **not Aadhaar-seeded**; for Aadhaar-seeded documents the **Dedicated Repository API Specification** applies instead.
- **The issuer must implement and host REST APIs**, not merely call one:
  - **Pull URI Request API** — lets a locker owner query the issuer's repository by Aadhaar number **or another identifier applicable to the issuer** (the documented examples are roll number + year + class, or a driving licence number). Custom parameters are passed in **UDF elements** and configured in the DigiLocker Partner Portal.
  - **Pull Doc Request API** — returns the actual document for a URI.
  - **PUSH URI to Digital Locker** — for pushing a URI into a user's locker.
- **Document URI format is mandated as `IssuerId-DocType-DocId`**, where IssuerId is a unique nationwide issuer entity ID. Example success response: `{"uri": "in.gov.cbse-HSCER-201412345678"}`.
- **Consent is mandatory:** the partner application must capture a "Y"/"N" consent indicator and the pull request is processed only when it is "Y".
- Error states include `pull_response_pending` (details do not exactly match; request forwarded to the issuer department for verification), `uri_exists[400]`, `record_not_found[404]`.
- **[VERIFIED and operationally alarming] There is no sandbox:** "DigiLocker does not currently offer a sandbox environment, so testing must be performed on the production account — be careful before making changes in the partner portal."
Sources as above, plus `https://rc.sunbird.org/use/integrations/digilocker-integration`, `https://www.frslabs.com/frsblog/2023/10/12/digilocker-how-to-integrate-digilocker-api-into-your-web-or-mobile-app-for-kyc/`

## 6.2 Is it realistic here? An honest assessment

**[ASSUMPTION]** No, not for this project's first two releases. Six reasons, in descending order of weight:

1. **It is an organisation-level decision, not a unit-level one.** The IssuerId would be issued to **Central Silk Board** (something like `in.gov.csb`), not to RSTRS Dharmavaram. One district unit cannot onboard itself. This needs CSB HQ / CSTRI Bengaluru / Ministry of Textiles sponsorship, an MoU, and a documented use case. That is a months-long institutional process entirely outside a solo developer's control.
2. **DigiLocker is fundamentally citizen-centric, and this lab's customers are mostly businesses.** A DigiLocker account is keyed to an individual's Aadhaar. A reeling unit, a twisting firm, a handloom co-operative or an exporter is an *entity*. A test report on 5 skeins of raw silk belongs commercially to the firm. Fitting business documents into a citizen locker is an awkward match. **[UNVERIFIED]** whether DigiLocker's Entity Locker (the business-facing counterpart) would accept CSB test reports — this is worth a separate enquiry if the scientist is keen.
3. **The issuer must host always-available public APIs.** Section 9 argues that Dharmavaram's connectivity does not support this. The APIs would have to live on a central CSB-hosted service, which brings us back to point 1.
4. **No sandbox** means the first integration test happens in production against real citizen lockers. That is not a reasonable place for a solo developer to learn an unfamiliar API.
5. **The pull model needs a lookup key the citizen actually knows.** For CBSE it is roll number + year. For a test report it would be report number + something. If a reeler has the report number, they already have the report — the marginal value of pulling it into DigiLocker is low.
6. **The QR verification page (section 5) delivers most of the benefit at a fraction of the cost**, under the lab's own control, works offline, and needs nobody's permission.

**Recommendation:** Put DigiLocker in the spec as a clearly-labelled **v3 / future** item with a short design note and the links above, so the scientist sees it has been considered and can raise it with CSB HQ if there is appetite. Design the report so it *could* be pulled later: give every report a stable immutable `DocId`, store the issued PDF as an immutable blob, and produce a **machine-readable XML representation** of each report alongside the PDF. **[VERIFIED]** DigiLocker's requester-side APIs return "machine-readable XML certificate data for a URI, usable only for issued documents", and "XML may not be available for all documents" — so having the XML from day one is what would make a later DigiLocker onboarding a configuration exercise rather than a rebuild. That XML is cheap to produce now and useful anyway (for the customer's own ERP, and for any future e-Sanad-style depository).

---

# 7. Data-protection obligations (DPDP Act 2023)

## 7.1 Does it apply? Yes.

**[VERIFIED]** The DPDP Act, 2023 received presidential assent on **11 August 2023**. The **DPDP Rules, 2025** were notified on **13 November 2025** via gazette notification **G.S.R. 846(E)**, with the Act's commencement notification **G.S.R. 843(E)** issued the same day, setting which sections take effect immediately, at 12 months, and at 18 months.
Sources: `https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf`, `https://www.amsshardul.com/insight/enforcement-of-the-dpdp-act-and-notification-of-the-dpdp-rules/`, `https://www.azbpartners.com/bank/indias-digital-personal-data-protection-act-phased-rollout-and-key-compliance-milestones/`

**[VERIFIED] It applies to the State and its instrumentalities as Data Fiduciaries**, with certain relaxations. So CSB is a **Data Fiduciary** for the customer contact data it holds.
Source: `https://corporate.cyrilamarchandblogs.com/2025/03/role-of-state-governments-in-indias-data-protection-regime/`

**[VERIFIED] Timeline:**
| From | What becomes live |
|---|---|
| 13 Nov 2025 | Definitions apply; Data Protection Board of India constituted (Rules 1, 2, 17–21) |
| 13 Nov 2026 | Board can inquire and levy penalties; Consent Manager registration opens (Rule 4) |
| **13 May 2027** | **Rules 3, 5–16, 22, 23 become effective — notice, consent, data-principal rights, retention, transfers and breach obligations apply in full to every Data Fiduciary** |

Note the date discrepancy in the sources: gazette dates are given as **13** November 2025 / **13** May 2027, while some law-firm analyses say 14 November 2025 / 14 November 2026 / 14 May 2027. **[UNVERIFIED]** which is operative to the day; it does not matter for design.

**[UNVERIFIED]** A MeitY stakeholder consultation on **23 January 2026** reportedly proposed accelerating the deadline from 18 months to 12 months, but this has not been confirmed by gazette notification. **Treat May 2027 as the planning date and design for it now** — retrofitting consent and retention into a live system is far more expensive than building it in.

**[VERIFIED] Section 17(4) relaxation for the State.** For processing by the State or an instrumentality of the State, **section 8(7)** and **section 12(3)** do not apply, and where the processing is for a purpose that does not include making a decision that affects the Data Principal, **section 12(2)** also does not apply. In practical terms this switches off data-erasure duties and certain correction/access rights for State processing. **[VERIFIED]** But a government agency processing under the §17(1)(b) exemption **cannot** claim exemption from penalties for security failures under **§8(5)** — accountability for security survives even where other exemptions apply.
Sources: `https://www.dpdpa.com/dpdpa2023/chapter-4/section17.html`, `https://www.gotrust.tech/blog/exemptions-and-accountability-in-india-s-data-protection-framework`, `https://www.complyzero.com/blog/dpdp-act-exemptions-explained`

**[VERIFIED] Section 17(5)** lets the Central Government, before the expiry of five years from commencement (i.e. **until August 2028**), notify that any provision shall not apply to a Data Fiduciary or class of Data Fiduciaries. As of February 2026 no notification had been issued under it.

**[UNVERIFIED]** Whether CSB, as a statutory body rather than a Ministry, gets the full §17(4) State relaxation, and whether commercial testing for a fee counts as "processing by the State" at all. My reading **[ASSUMPTION]**: charging a private trader a fee for a service is closer to commercial activity than to sovereign function, so **do not design on the assumption that the relaxations apply**. Build to the full obligation. If a relaxation turns out to be available, the lab is simply doing better than the minimum — which for a government body is the right posture anyway.

## 7.2 What the software should actually do — practical checklist

**[ASSUMPTION]** Every item below is a build item, not a policy document.

**Notice and consent**
- **[VERIFIED requirement:]** notices "must be presented independently (not buried inside a long Terms of Service PDF)" and use "clear, plain language".
- One short, standalone privacy notice on the sample-submission form: what is collected (name, firm, address, phone, email, GSTIN, sample details), why (to test the sample, issue the report, raise the invoice, meet accreditation record-keeping), how long it is kept, and who to contact.
- Consent captured as a distinct database record with timestamp, version of the notice text shown, and the channel — not a boolean on the customer row. **Version the notice text**, because the record must show *what* the person agreed to.
- Separate, unticked-by-default consent for anything beyond the core service: WhatsApp/SMS status updates, marketing, inclusion in a published list of tested units.
- **[VERIFIED]** English is not enough: **Telugu** must be available for a customer-facing form in Dharmavaram — and GIGW (section 8) reinforces this. **[ASSUMPTION]** Build i18n in from the start; retrofitting it is painful.

**Purpose limitation and minimisation**
- Do not collect what is not needed. **[ASSUMPTION]** In particular: **do not collect Aadhaar numbers.** There is no lawful need for a silk test, and holding Aadhaar numbers imports a whole additional regulatory regime (Aadhaar Act s.29, and the Aadhaar (Authentication and Offline Verification) Regulations, 2021, whose penalties are noted in the UIDAI material above). If an identifier is needed for a business customer, use the **GSTIN** — it is a business identifier, not personal data.
- Tag each personal-data field in the schema with its purpose. This makes retention automatable rather than a manual annual clean-up that never happens.

**Retention**
- **[VERIFIED]** The 2025 Rules include a **minimum 1-year data-retention mandate** (3 years for Schedule 3 entities). Note the direction: this is a *floor*, not a ceiling — DPDP also requires erasure once the purpose is served.
- **The retention conflict the developer must be told about explicitly.** Three regimes pull in different directions:
  - **DPDP:** erase personal data when the purpose is served.
  - **GST:** books and records must be retained for a statutory period (commonly cited as 72 months from the due date of the annual return — **[UNVERIFIED]**, confirm the current period).
  - **NABL / ISO/IEC 17025:** technical records and reports must be retained for the period set in the lab's quality manual — **[UNVERIFIED]**, ask the scientist for the actual figure from their manual.
  - **[VERIFIED] CERT-In:** ICT system logs for a rolling 180 days (section 8).
- **[ASSUMPTION] Design answer:** separate **technical records** (sample, measurements, report — retained per NABL, and largely not personal data) from **personal contact data** (name, phone, email, address of the individual submitting). Build a per-field retention clock. Support **pseudonymisation** rather than deletion: after the retention period, replace the personal fields with the opaque `cid` token that is already in the QR payload, so the technical and accounting record survives intact while the person becomes non-identifiable. This resolves the conflict cleanly and is worth writing into the spec as an explicit design decision with its rationale.

**Data-principal rights**
- Self-service screens for: view my data, request correction, request erasure, withdraw consent, view consent history.
- **Withdrawal of consent must be as easy as giving it** and must not break an in-flight test order. If someone withdraws marketing consent, the software stops sending marketing; it does not cancel their test.

**Grievance redressal**
- **[VERIFIED]** Section 13 gives the Data Principal a right to readily available grievance redressal, and the Data Principal must exhaust this remedy before approaching the Board. **Rule 14** sets the response period at "a reasonable timeframe not exceeding **90 days**", and **grievance redressal timelines must be published on the organisation's website or app**. Every Data Fiduciary must appoint a **Grievance Officer** — who "may be any competent person within the organisation".
Sources: `https://www.dpdpa.com/dpdpa2023/chapter-3/section13.html`, `https://ksandk.com/data-protection-and-data-privacy/grievance-officers-under-indias-dpdp-act-and-2025-rules/`, `https://indiadpdpa.com/india-dpdpa-article-13-right-of-grievance-redressal/`
- **Build item:** a grievance ticket entity with an SLA clock, an assigned Grievance Officer, and an escalation alert well before 90 days. Publish the officer's designation and contact on the public footer. Note there is already a help-desk/ticketing concept in the CSB app, so this is consistent with existing practice.

**Breach notification**
- **[VERIFIED]** After notifying the Board, affected Data Principals must be notified **within 72 hours**, including a plain-language description of the breach, what data was exposed, protective measures available, and the Data Fiduciary's contact details.
- **Build item:** an incident register, and — critically — the ability to answer "**which** data principals were affected?" in minutes rather than weeks. That requires access logs at row level for personal data, not just application logs. This is the single most under-built breach requirement.
- **[VERIFIED] and separate:** CERT-In requires reporting cyber incidents **within six hours** of noticing (section 8). **Two clocks, two recipients, two formats.** The spec must say so, because a developer who reads only one of the two will build the wrong thing.

**Security**
- **[VERIFIED]** Maximum penalty is **₹250 crore** per instance for failure to take reasonable security safeguards; up to **₹50 crore** for breach of other provisions including the §8(10) grievance duty. And §8(5) security liability is **not** exempted for State processing.
- Baseline build items: MFA for approvers and admins; role-based access; encryption at rest for personal data columns; TLS everywhere; no personal data in application logs, URLs or error messages; audited access to customer records; least-privilege database accounts; and no production data in development or test environments.

**Children**
- **[VERIFIED]** Section 9 and Rule 10 require **verifiable parental consent** for under-18s and for persons with disabilities with a lawful guardian.
- **[ASSUMPTION]** Practically irrelevant here — customers are commercial units — but if the lab ever runs a student training programme or school outreach with online registration, this bites hard. Note it as a constraint; do not build for it now.

---

# 8. Government IT procurement, hosting and accessibility constraints

## 8.1 Cloud: allowed, but only from an empanelled provider, and only in India

**[VERIFIED]** MeitY empanels cloud service *offerings* of CSPs under **GI Cloud (MeghRaj)**, comprising compliance with empanelment requirements plus an audit by the **STQC** directorate against **ISO 27001, ISO 27017, ISO 27018 and ISO 20000**. Empanelment applications are handled through **AMBUD** (`https://ambud.meity.gov.in/`). Deployment models covered include public cloud (multi-tenant), virtual private cloud (logically isolated, for sensitive workloads), and **government community cloud** (physically and logically isolated, dedicated to government use). As of the cited PIB release, **26 CSPs** were empanelled and **2,170 Ministries/Departments** had cloud-based applications on MeghRaj, which NIC offers to Ministries/Departments.
Sources: `https://www.pib.gov.in/PressReleasePage.aspx?PRID=2202897&reg=3&lang=2`, `https://ambud.meity.gov.in/`, `https://opsiocloud.com/in/knowledge-base/meity-empanelled-cloud-providers-india/`

**[VERIFIED] Data localisation for government workloads:** MeitY empanelment requires that cloud services be **hosted within India** and that **data is limited within the boundaries of India**; GI Cloud (MeghRaj) guidelines mandate that providers "guarantee that all services provided, including data, will reside in India", and CSPs must meet IT Act 2000 security requirements and comply with STQC audit criteria.
Sources: `https://aws.amazon.com/compliance/MeitY/`, `https://learn.microsoft.com/en-us/compliance/regulatory/offering-meity-india`, `https://cloud.google.com/security/compliance/meity-india`

**[VERIFIED] Procurement rule:** government departments may procure cloud services directly from MeitY-empanelled CSPs, or via managed service providers / systems integrators; **General Financial Rules, 2017** clarify that departments may only procure from **empanelled CSPs registered on GeM**, while MSPs and SIs need not themselves be empanelled.
Source: `https://spiceroutelegal.com/publications/cloud-governance-101-public-procurement-of-cloud-service/`

**[VERIFIED] Empanelment is narrower than it sounds:** "A provider may be empanelled for VMs but not for a specific managed database or AI service; empanelment may cover certain Indian regions and not others; and empanelments expire."

**Practical consequences for the tech stack (ASSUMPTION, but tightly derived):**

| Constraint | What it rules out | What it permits |
|---|---|---|
| Data must reside in India | Any US/EU-region managed service; Vercel/Netlify edge with global data; a US-region Supabase/Firebase/PlanetScale project; a US-region S3 bucket for report PDFs | AWS ap-south-1 (Mumbai) / ap-south-2 (Hyderabad), Azure India, GCP asia-south1/asia-south2, IBM Chennai, Tata Communications, Pi Datacenters, NIC/NICSI |
| Must be MeitY-empanelled *and on GeM* if procured as a government cloud purchase | Most managed-PaaS conveniences | Empanelled IaaS + self-managed PostgreSQL, or NIC hosting |
| Empanelment is per-service, not per-provider | Assuming "AWS is empanelled" covers every AWS service used | Plain compute, block storage, object storage — verify each on the MeitY list |
| Foreign SaaS dependencies | Third-party email/SMS/analytics that store personal data abroad; a US e-signature SaaS; Google Analytics on the public page | Indian SMS gateways; self-hosted analytics; CCA-licensed Indian CAs and ESPs |

**[ASSUMPTION] Concrete stack advice for the developer:** favour a **boring, portable, self-hostable stack** — PostgreSQL, a single server-rendered application, files on the local filesystem or S3-compatible object storage, background jobs in-process or via a simple queue. Avoid any architecture that only works on one vendor's proprietary managed services. The reason is not ideology; it is that this application may have to move from a laptop to a unit server to NIC to an empanelled cloud, possibly more than once, driven by decisions made above the scientist's head.

## 8.2 GIGW 3.0 — applies to the public-facing verification page

**[VERIFIED]** GIGW recommends policies and guidelines "for Indian Government websites and applications at any organisational level, belonging to both Central Government as well as State Governments (including district administrations and local governments)". It is issued by MeitY, produced through NIC, and the current release **GIGW 3.0 (2023)** is harmonised with **WCAG 2.1 Level AA** (up from WCAG 2.0 in GIGW 2.0, adding 17 new success criteria). It was developed collaboratively by NIC, STQC and CERT-In, and is organised around four focus areas — **Quality, Accessibility, Cybersecurity, and Lifecycle management** — plus annexures with a conformity matrix and policy templates. The cybersecurity chapter was contributed by CERT-In. The lifecycle chapter stresses a designated **Web Information Manager**, a senior departmental official heading the website management team. Earlier versions were adopted by DARPG into the **Central Secretariat Manual of Office Procedure (CSMOP)**, with guidelines categorised as **Mandatory (MUST), Advisory (SHOULD) and Voluntary (MAY)**. It aligns with the **Rights of Persons with Disabilities Act 2016** and the Harmonized Guidelines on Accessibility.
Sources: `https://guidelines.india.gov.in/introduction/`, `https://guidelines.india.gov.in/scope-and-objective/`, `https://guidelines.india.gov.in/new-features-of-gigw-3-0/`

**[VERIFIED] Downloadable documents are in scope:** "tagged PDF structure, reading order, text searchability and form-field labelling are testable requirements, and **scanned image PDFs without text layers are explicitly non-conformant**."

**This is a direct, concrete requirement on the report generator, and it is the GIGW item most likely to be missed.** **[ASSUMPTION]** The test report PDF must be generated as a **tagged PDF with a real text layer, a logical reading order, and labelled table structure** — not as an image, and not as a scan of a printed page. That means using a PDF library that supports PDF/UA tagging, not rendering HTML to a bitmap. Decide this at the start; changing PDF generators late is expensive.

**[VERIFIED] Certification.** STQC's Website Quality Certification scheme, **Certified Quality Website (CQW)**, validates GIGW 3.0 compliance as adopted by DARPG. The process: self-assessment via checklists, gap remediation, preparation of a **Website Quality Manual (WQM)** covering processes, security reports and back-end audits, submitted with forms from `stqc.gov.in`; an assessment team evaluates the site with tools and manually and also assesses back-end processes; a security audit may be conducted by STQC, an STQC-empanelled lab (SETL), NIC, or a **CERT-In empanelled auditor**; then STQC issues the Certificate of Registration and Certification Mark. **Validity: three years, with annual surveillance and surprise surveillance audits.** Organisations must also obtain a "**safe to host**" certificate from CERT-In/STQC-empanelled auditors or STQC/NIC auditors. STQC has issued a notice making an **IAAP Certified Auditor Review Report** a pre-requisite for GIGW evaluation under the scheme.
Sources: `https://www.stqc.gov.in/en/website-quality-certification-0`, `https://www.lumiversesolutions.com/stqc-gigw-3-0-compliance-process-guide-2025/`, `https://blog.certcube.com/gigw-3-0-certification-complete-compliance-guide/`

**[UNVERIFIED / flagged]** The claim that GIGW compliance and STQC certification are *mandatory* for all central/state ministries, departments and PSU portals, and a precondition for NIC hosting, comes mainly from **audit-vendor pages** rather than from an official circular I read. `https://guidelines.india.gov.in/` and the applicable DARPG/MeitY circulars are the authorities. **[VERIFIED]** what is certain: **"safe to host" from a CERT-In empanelled auditor is standard practice before a government-domain site goes live**, and that is a real gate with a real cost and lead time.

**[ASSUMPTION] Does the verification page need to follow GIGW? Practical answer: yes, and it is cheap if done from the start.**
- If the page is served from a `gov.in` / `nic.in` / `res.in` domain, or is linked from a CSB page, or is described as a Central Silk Board service, it will be treated as a government web page. Assume GIGW applies.
- **But keep the *public* surface tiny.** A single-page verification view with a status banner and a small table is very easy to make WCAG 2.1 AA conformant. The internal LIMS — worklists, instrument entry, approvals — used only by lab staff behind a login, is much harder to make fully conformant and is a weaker candidate for GIGW scrutiny. **Recommendation: split the deployment.** A small, hardened, GIGW-conformant public verification page; a separate internal application. This also happens to be the right security architecture.
- Build the public page to WCAG 2.1 AA from day one: semantic HTML, proper heading order, visible focus indicators, 4.5:1 text contrast, real labels on the one file-upload control, keyboard operability, no colour-only signalling (the GENUINE / NOT GENUINE banner must carry an icon and text, not just green/red), a language attribute, and Telugu/Hindi/English language options. **[VERIFIED]** BIS **IS 17802** is the Indian ICT-accessibility standard referenced in public-sector procurement and maps in practice to WCAG 2.1 AA.

## 8.3 CERT-In directions — a hard, dated, verifiable obligation

**[VERIFIED]** CERT-In directive **No. 20(3)/2022-CERT-In** dated **28 April 2022**, issued under **section 70B(6) of the IT Act, 2000**, effective **28 June 2022** (60 days from issue). Its scope expressly includes **"government organisations"** alongside service providers, intermediaries, data centres and bodies corporate. Requirements:

- **Report cyber incidents to CERT-In within six hours of noticing.** The reportable incident types expanded from 10 (2013 Rules) to **20**.
- **Enable logs of all ICT systems and maintain them securely for a rolling 180 days within Indian jurisdiction**, to be provided to CERT-In when reporting an incident or on direction.
- **Synchronise all ICT system clocks to the NTP server of NIC or NPL**, or servers traceable to them.
- Non-compliance may invite punitive action under **section 70B(7)** of the IT Act.
Sources: `https://trilegal.com/wp-content/uploads/2022/05/2022-CERT-In-Directions-on-Reporting-Cyber-Incidents-1.pdf`, `https://www.lexology.com/library/detail.aspx?g=899f3b94-c31f-4983-868f-5ee5abbf78c8`, `https://www.internetsociety.org/resources/doc/2022/internet-impact-brief-india-cert-in-cybersecurity-directions-2022/`, `https://www.atrity.com/cert-in-incident-reporting-6-hour-rule-and-log-retention-best-practices/`

**Build items (ASSUMPTION):**
- **NTP to `time.nic.in` / NPL**, configured on every server and every lab workstation. This is a one-line configuration item that is almost always forgotten, and it is genuinely load-bearing here: signature timestamps, invoice timestamps and audit trails are all worthless if clocks drift. Put it in the deployment checklist.
- **180-day log retention, stored in India.** Design log volume and disk accordingly — on a modest on-premise box, 180 days of verbose application logs will fill the disk. Plan rotation and compression, and separate audit logs (which must survive) from debug logs (which need not).
- **[VERIFIED] and worth heeding:** the Internet Society's criticism that blanket 180-day retention of all ICT logs "creates significant vulnerability and privacy risks" and conflicts with data minimisation, "effectively creating a honeypot of log information". **Design response:** retain what the direction requires, but **scrub personal data out of application logs** so the mandated log store is not itself a personal-data breach waiting to happen. This is the point where CERT-In and DPDP pull against each other, and the resolution is: keep the logs, but do not put names, phone numbers or addresses in them.

## 8.4 Is on-premise likely to be mandated?

**[UNVERIFIED]** I found no CSB-specific policy either way.

**[ASSUMPTION] My assessment: on-premise or a hybrid is the likely outcome at v1, for three non-technical reasons.**
1. **Procurement friction.** A cloud subscription is recurring expenditure needing a GeM purchase from an empanelled CSP and a budget line. A server in the unit is a one-time capital purchase a unit head can more plausibly get sanctioned. **[ASSUMPTION]** but a well-founded one for a district-level government unit.
2. **The connectivity reality of section 9** makes a cloud-only design operationally unacceptable regardless of policy.
3. **Institutional comfort.** A lab that has just started using a national portal is more likely to accept "a computer in the lab that keeps working" than "our data is in Mumbai".

**[ASSUMPTION] Therefore the architectural instruction for the spec, stated as a hard requirement:**

> **The application must run, completely and correctly, on a single ordinary server inside the laboratory, with no internet connection, for at least a full working week.** Every cloud-dependent feature — online payment reconciliation, the public verification page, DigiLocker, IRP e-invoicing, SMS notification — must be an **optional, queued, retryable outbound integration**, never a synchronous dependency on the path a scientist takes to log a sample or issue a report.

Practically that means: no cloud-only authentication provider on the critical path; no cloud-only database; no serverless-function-only business logic; no build step that requires the internet at run time; and a documented one-file backup/restore.

---

# 9. Connectivity and hardware reality at a district-level unit

## 9.1 What is verified about the site

**[VERIFIED]** The unit's own published address and phone: "**Silk Conditioning and Testing house, CSTRI, Central Silk Board, Near Government cocoon market, Regatipalli, Dharmavaram – 515 671**", phone **08559 222284**.
Source: `https://silks.csb.gov.in/nellore/where-to-get-what/`

The detail "**Near Government cocoon market**" is genuinely informative for design: the lab sits beside a physical market. **[ASSUMPTION]** That implies walk-in customers, same-day expectations, cash payments, results wanted while the trade is happening, and paper carried away by hand. It also explains why the Tatkal same-day scheme exists with an 11:00 cut-off. This is a counter-service operation as much as a laboratory.

**[VERIFIED]** The unit appears as **RSTRS-Dharmavaram** on the national portal, which means it is already expected to operate an internet-connected workflow at least intermittently.

**[UNVERIFIED]** Actual bandwidth, uptime, power stability, current hardware, whether there is a LAN, whether staff have desktops or share one machine, and whether instruments have digital outputs. **None of this is knowable from the web. It must be a site survey.**

## 9.2 The site survey the developer must insist on before writing code

**[ASSUMPTION]** A short checklist to hand to the scientist. Answering it will change the design more than any amount of further research:

1. How many staff will use the software at the same time? How many computers exist? What operating system and roughly what age?
2. Is there a LAN? Wired, Wi-Fi, or none?
3. What is the internet connection — BSNL broadband, fibre, a 4G dongle, a mobile hotspot? Roughly what speed, and how many hours a day does it fail?
4. Is there a UPS? Does it cover the server, or just one desktop? How many power cuts a week, and how long?
5. Which instruments produce a digital output — serial, USB, a file on a PC, a printout? Which are read by eye off a dial?
6. How are results recorded **today** — a register, an Excel file, a Word template, the national portal?
7. How many samples a day, in peak season and off season? How many reports a day?
8. What printer is in the lab? Is there a pre-printed letterhead? Does the report have to go on a specific stationery?
9. Who signs reports? How many people are on the NABL declared-signatories list, and for which disciplines?
10. Does the report get handed over the counter, posted, emailed, or all three?

## 9.3 Design implications

**[ASSUMPTION] — architecture**

**Recommended shape: local-first server in the lab, with optional cloud sync.**

```
┌─ Laboratory, Dharmavaram ───────────────────────────┐
│  Small server (or a good mini-PC) on a UPS          │
│    · the whole application                          │
│    · PostgreSQL                                     │
│    · report PDFs on local disk                      │
│    · signing key (OS keystore / USB HSM)            │
│    · label printer + A4 printer on the LAN          │
│  Staff use browsers on the LAN — works with the     │
│  internet completely down                           │
│                                                     │
│  Outbound queue (drains whenever internet returns): │
│    → publish verification records                   │
│    → pull bank / portal payment MIS                 │
│    → push IRN requests to the IRP (if applicable)   │
│    → SMS / email notifications                      │
│    → encrypted offsite backup                       │
└─────────────────────────────────────────────────────┘
```

Why not offline-first-with-sync in the full CRDT sense: **[ASSUMPTION]** true multi-master offline sync with conflict resolution is one of the hardest things in software, and it is unnecessary here. There is exactly **one** authoritative site. Everyone who enters data is physically in the same building on the same LAN. So the answer is a **local server**, not offline-capable clients. That is dramatically simpler, and simplicity is the single most valuable property in a system a solo developer must maintain.

The one genuine exception: **[ASSUMPTION]** if a scientist needs to record readings on a tablet while standing at an instrument on a flaky Wi-Fi link, use a small offline-capable PWA form that queues locally and posts to the local server — a single-writer append-only queue, with no merge logic. Do not generalise this to the whole application.

**[ASSUMPTION] — the sequence number problem that offline creates.** If any part of the system can create documents while disconnected, **gapless FY-based numbering (section 3) breaks.** The rule must be: **numbers are allotted only by the local server, never by a client.** A queued offline entry gets its number at the moment the server accepts it. This is another reason to prefer local-server over offline-clients.

**[ASSUMPTION] — hardware recommendations**

| Item | Recommendation | Reasoning |
|---|---|---|
| Server | A mini-PC or small tower: 4+ cores, 16 GB RAM, **2× SSD in a mirror**, on a **UPS with at least 30 minutes** | The mirror is not optional. A single SSD failure in a district office with no IT support means the lab's records are gone. Power cuts corrupt databases; the UPS is cheaper than the recovery |
| Backup | **Two** targets: an external USB disk swapped weekly and kept off-site, **plus** an encrypted upload when the internet is up. Automated. And an **automated monthly restore test** | An untested backup is not a backup. Government offices are full of them |
| Sample labels | **Direct-thermal desktop label printer, 4-inch**, e.g. TSC / Zebra / Godex class, with **QR-code** labels, driven by **ZPL/EPL or raw ESC commands over the network** — not by a Windows print driver | Sample labels must survive being handled, and sometimes damp. QR beats 1-D barcodes for density and for damage tolerance. Driving the printer with raw commands avoids the entire class of Windows-driver problems that make label printing the most common failure point in a small LIMS. **Direct thermal** avoids consumable ribbons; **[ASSUMPTION]** if labels must survive months of storage or any solvent, thermal-transfer with a resin ribbon instead |
| Scanner | A **2-D imaging** barcode scanner (USB HID keyboard-wedge) at each work station, plus one **cordless** one for the counter | HID keyboard-wedge means zero drivers and zero integration — the scanner just types. 2-D is required to read QR. Budget for the fact that phone cameras are a poor substitute in a busy lab |
| Report printing | An ordinary **mono laser** A4 printer. **Not** inkjet | Thermal/inkjet output smudges and fades; a test report may be presented to a bank a year later. Laser is also cheaper per page at volume |
| Instrument interfacing | **Do not attempt in v1.** Design a clean manual-entry screen with strong validation, and put a `raw_capture` text/blob column on every measurement row for a future parser | **[ASSUMPTION]** Instrument integration is where LIMS projects die. Many silk-testing instruments (seriplane boards, serigraph, twist testers) involve visual assessment against a standard anyway, so manual entry is not a workaround — it is the correct model for a good share of the work |
| Network | Wired Ethernet to the server and the label printer. Wi-Fi only for tablets | Cheap, and removes a whole category of intermittent faults |

**[ASSUMPTION] — software behaviours that connectivity forces**

- **Every outbound integration is a queued job with retries and a visible queue.** A staff member must be able to see "3 payment confirmations waiting to send" and not worry about it.
- **Never block a scientist on a network call.** Approving a report must not wait on an IRP round trip, an SMS gateway, or a timestamp authority. If a document timestamp cannot be obtained now, sign now, and add the timestamp when the network returns — the PAdES/LTV design in section 4 accommodates exactly this.
- **The report must be printable and handable-over with no internet.** The QR verifies offline (section 5). That is the whole point of choosing a signed QR over a database-lookup QR, and it is the design decision that most directly serves this site's reality.
- **SMS over email.** **[ASSUMPTION]** A reeler in Dharmavaram is far more likely to read an SMS than an email. Use an Indian SMS gateway (data stays in India), respect DLT template registration requirements, and keep the message content free of personal data beyond what the recipient already knows.
- **Bandwidth-frugal UI.** Server-rendered pages, no large JavaScript bundles, no web fonts fetched from a CDN, images optimised. This helps GIGW conformance too.
- **Telugu in the interface and on customer-facing documents.** Which means a font that renders Telugu correctly **in the PDF** — a real and frequently-missed engineering task. Test it early with actual Telugu names and addresses, not with Lorem Ipsum.

---

# 10. Consolidated verification ledger

Things to confirm before the spec is finalised, in priority order. Each of these changes the software if the answer is unexpected.

| # | Question | Ask whom | Impact if unresolved |
|---|---|---|---|
| 1 | **Exact GSTIN** under which RSTRS Dharmavaram raises invoices, and the registered address on it. Is it `29…` (Karnataka) or a `37…` (Andhra Pradesh) registration? | CSTRI / CSB accounts. Verify on `gst.gov.in` Search Taxpayer | CGST+SGST vs IGST is wrong on **every** invoice |
| 2 | Where does test-fee money physically go today — a CSB bank account or the Government Account via a PAO? Which channels are live: cash, DD, Bharatkosh, SB Collect, the app's gateway? | Unit accounts staff | Whole payment and reconciliation module |
| 3 | **Is CSB inside the GST e-invoicing (IRN) mandate**, given that Notification 23/2021 exempts a "government department" but CBIC treats a statutory body as not being "Government"? Has an e-invoice exemption declaration been filed? | CSB's GST consultant, in writing | Customers denied ITC; invalid invoices under Rule 48(5) |
| 4 | **GST treatment per test:** taxable at 18% under SAC 998346, or exempt for any cocoon/agricultural-produce test? What SAC applies to machine rent, stifling, warping, dyeing and electrospinning charges? | Tax adviser | Wrong tax on every line |
| 5 | Is there a **current approved rate card later than 15.11.2019**? Are the RSTRS/STSC rates still live? | Unit / CSTRI | Wrong prices |
| 6 | **Project scope:** internal LIMS only, or replace/integrate with `csbsilktesting.res.in`? | Scientist, with CSTRI HQ | Wrong project |
| 7 | NABL declared signatories, their authorised test disciplines, and the quality manual's rules on **amended reports** and **record retention periods** | Scientist (has the documents) | Approval model and retention engine |
| 8 | Signing decision: is a CCA-licensed certificate budgeted for v1? Class 3 Document Signer on HSM, or interim? Get two written CA quotes | Unit head; CCA-licensed CAs | Legal weight of every report |
| 9 | Is on-premise mandated, permitted, or discouraged? Is NIC/NICSI hosting available to CSB units? | CSB IT / CSTRI | Hosting and stack |
| 10 | Will the public verification page sit on a `gov.in`/`res.in` domain, and is STQC CQW / "safe to host" required before go-live? | CSB IT | Go-live gate, lead time, cost |
| 11 | Site survey — the ten questions in 9.2 | Scientist | Architecture and hardware budget |
| 12 | Who is the named **Grievance Officer** under DPDP, and what response SLA will be published? | Unit head | DPDP build item |

---

# 11. Sources

**Bharatkosh / NTRP / government receipts**
- Bharatkosh portal — https://bharatkosh.gov.in
- CGA, Bharatkosh — https://cga.nic.in/Page/Bharatkosh.aspx
- CGA, FAQs on Helpdesk of Bharatkosh (users) — https://cga.nic.in/writereaddata/file/FAQsNTRPforUser08092017.pdf
- CGA, FAQs on NTRP for PAO / Pr.AO — https://cga.nic.in/writereaddata/file/FAQsNTRPforPAOPrAO08092017.pdf
- NRSC, SOP for Training Charges/Fees using NTRP-BharatKosh (model challan document) — https://www.nrsc.gov.in/nrscnew/assets/pdf/training_outreach/2026/SOP%20for%20Training%20Charges_Fees%20using%20NTRP%20-BharatKosh.pdf
- Bharatkosh User Guide — https://bharatkosh.gov.in/pdf/UserGuideBharatkosh.pdf ; https://www.nfc.gov.in/pdf/user-guide-ntrp.pdf
- SRFMTTI, Steps for making payment through Bharatkosh (testing charges) — https://srfmtti.dacnet.nic.in/Downloads/Testing_Charges/STEPS_MAKING_PAYMENT_THROUGH_BHARATKOSH.pdf
- General Financial Rules 2017 material (GAR-6, GAR-1, receipt books, R.P.R.6E) — https://www.mcrhrdi.gov.in/asodr2018/week3/1-ASO-DR-GFR2017-May2018.pdf ; https://cga.gov.in/DownloadPDF.aspx?filenameid=1804 ; https://www.gfr.co.in/p/general-system-of-financial-management.html
- SBI SB Collect — https://sbi.bank.in/web/business/sme/digital-collection-products/sb-collect ; https://onlinesbi.sbi.bank.in/sbijava/mergerfaq/merger_collect_faq.html
- IIT Kharagpur payment instructions (virtual-account challan pitfalls) — https://erp.iitkgp.ac.in/PaymentInstructions.pdf
- Bharatkosh practical guide — https://startupflora.com/blog/bharatkosh-payment

**CSB / CSTRI / the lab itself**
- CSB — https://csb.gov.in/
- CSTRI — https://cstri.res.in/ ; Testing — https://cstri.res.in/?page_id=297 ; Training — https://cstri.res.in/?page_id=291
- **CSTRI approved testing charges, w.e.f. 15.11.2019 (includes the RSTRS/STSC rate card, Tatkal scheme, and "GST extra")** — https://cstri.res.in/wp-content/uploads/2020/01/TestingCharges-2019.pdf
- **CSB Silk Testing portal (lists RSTRS-Dharmavaram)** — https://csbsilktesting.res.in/ ; Terms & Conditions — https://csbsilktesting.res.in/terms-and-conditions/
- CSB-CSTRI Testing app — https://play.google.com/store/apps/details?id=com.csb_silk_testing&hl=en_IN
- SILKS, Where To Get What (Dharmavaram address) — https://silks.csb.gov.in/nellore/where-to-get-what/
- Central Silk Board Act, 1948 — https://www.indiacode.nic.in/bitstream/123456789/1474/3/A1948-61.pdf ; https://texmin.nic.in/sites/default/files/CSB-ACT-and-RULES-Book.pdf
- CSTRI GSTIN record (third-party, **must be re-verified on gst.gov.in**) — https://piceapp.com/gst-number-search/central-silk-technological-research-institute-29aaalc0093m1zz/

**GST**
- Notification 12/2017-Central Tax (Rate) — https://cbic-gst.gov.in/hindi/pdf/central-tax-rate/Notification12-CGST.pdf
- Notification 13/2017 (RCM), consolidated — https://www.tgct.gov.in/tgportal/Docs/Notifications/TGST/Updated%20TGST%20Rates,%202017%2013-2017-CT(R).pdf
- GST Council, Reverse Charge Mechanism flyer — https://gstcouncil.gov.in/sites/default/files/e-version-gst-flyers/Reverse%20charge%20Mechanism.pdf
- Government vs Governmental Authority — https://gstlearn.com/2021/02/23/gst-sectoral-faq-government-services/ ; https://pgaa.in/Image/Presentation-%20GST%20on%20Govt%20Services.pdf ; https://onlinetaxupdate.com/gst-on-government-services/
- SAC 998346 — https://busy.in/sac-code-998346/ ; https://www.credlix.com/hsn-code/998346 ; https://findgst.in/saclist/9983/sac-998346 ; https://gstverify.co.in/gst/hsn/998346/ (conflicting/erroneous 28% claim: https://www.registerkaro.in/hsn/gst-rate-hsn-code-998346)
- Agricultural produce / Entry 54 — https://www.taxmanagementindia.com/visitor/detail_article.asp?ArticleID=12509 ; https://taxguru.in/goods-and-service-tax/agricultural-produce-gst-regime.html ; https://gstcouncil.gov.in/sites/default/files/AAR/guj-2017-18-1_dt_13-12-17_guru_cold_0.pdf ; https://cbic-gst.gov.in/pdf/circular-consolidated.pdf
- Rule 46 — https://fintaxblog.com/rule-46-of-cgst-rules-2017-tax-invoice/ ; https://gstlearn.com/2024/01/24/tax-invoice-cgst-rule-46/ ; https://taxguru.in/goods-and-service-tax/tax-invoice-requirements-section-31-cgst-act-gst-rule-46.html
- FY series reset (GSTN advisory 04.04.2019) — https://irisgst.com/effective-1st-april-2019-reset-the-invoice-number-series-gst-advisory/ ; https://taxguru.in/goods-and-service-tax/commentary-tax-invoice-number-gst.html
- Rule 50 receipt voucher — https://gstzen.in/a/receipt-voucher-cgst-rule-50.html ; https://studycafe.in/rule-50-cgst-rules-receipt-voucher-16458.html ; https://gstgyaan.com/rule-50-of-the-cgst-rules-receipt-voucher
- Rule 51 refund voucher — https://gstzen.in/a/refund-voucher-cgst-rule-51.html ; https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/rules/cgst_rules/active/chapter6/rule51_v1.00.html ; https://www.taxwink.com/blog/refund-voucher-gst-particulars
- Place of supply, s.12 IGST — https://taxreply.com/gst-act-and-rules/Section-12-of-IGSTACT ; https://fintaxblog.com/section-12-of-igst-act-2017-place-of-supply-of-services-supplier-recipient-located-in-india/
- E-invoicing threshold — https://tax2win.in/guide/e-invoicing-gst ; https://www.gimbooks.com/blog/5-crore-e-invoice-turnover-rule-2026/ ; https://clearlycomply.org/blog/gst-e-invoicing-india-guide/
- **Notification 23/2021-Central Tax (govt dept / local authority e-invoice exclusion)** — https://gstpress.com/notifications/ckpecyfmb7wnq0874rn9nznm6/amends-notification-no-13-2020-central-tax-to-exclude-government-departments-and-local-authorities-from-the-requirement-of-issuance-of-e-invoice ; https://taxguru.in/goods-and-service-tax/govt-depts-local-authorities-excluded-e-invoice-requirement.html ; https://finodha.in/notification-no-23-2021-central-tax-gst/

**Digital signature / eSign**
- CCA — https://cca.gov.in/ ; FAQ (HSM rule) — https://cca.gov.in/faq.html ; DSC for organisational person — https://cca.gov.in/dsc_organisational.html ; eSign — https://cca.gov.in/eSign.html
- CCA Interoperability Guidelines (Document Signer, OID 2.16.356.100.2.2) — https://cca.gov.in/sites/files/pdf/guidelines/CCA-IOG.pdf
- CCA Identity Verification Guidelines — https://cca.gov.in/sites/files/pdf/guidelines/CCA-IVG.pdf
- CCA e-Authentication Guidelines for eSign — https://cca.gov.in/sites/files/pdf/esign/CCA-EAUTH.pdf
- Class 2 discontinued from 01.01.2021 — https://cleartax.in/s/no-class-2-digital-signature-2021
- Aadhaar eSign legal basis (s.3A, GSR 61(E) 2015) — https://www.leegality.com/blog/law-around-aadhaar-esign ; eSign vs DSC — https://www.leegality.com/blog/aadhaar-esign-vs-dsc
- IT Act digital signature overview — https://bhattandjoshiassociates.com/digital-signature-laws-in-india/ ; https://documentesign.com/blog/esignature-laws-in-india
- Document Signer pricing/street pricing — https://www.eversign.in/price-list/ ; https://digitalsignature.net.in/document-signer/ ; eMudhra CCA-filed fee schedule — https://www.scribd.com/document/838956970/eMudhra-Fee-2903241073374361326806344578148647589871741750349906

**Signed QR / verification portals**
- **GST e-invoice signed QR FAQ (JWS/JWT, SHA256RSA, payload fields, offline verification)** — https://einvoice1.gst.gov.in/Documents/IRN_QR_FAQS.pdf
- https://taxguru.in/goods-and-service-tax/signed-qr-code-e-invoicing-system-gst-faqs.html ; https://cleartax.in/s/gst-e-invoice-qr-code-generation ; https://cleartax.in/s/e-invoice-api-faqs
- GSTN e-invoice system overview — https://www.gstn.org.in/assets/mainDashboard/Pdf/GST%20e-invoice%20System%20-%20Overview%20-%20Version%20Dt.%2029-5-2020.pdf
- **UIDAI Secure QR / offline eKYC** — https://uidai.gov.in/en/916-developer-section/data-and-downloads-section/19388-uidai-certificate-details-2.html ; https://mndc.uidai.gov.in/en/ecosystem/authentication-devices-documents/qr-code-reader.html ; https://uidai.gov.in/en/306-faqs/aadhaar-online-services/secure-qr-code-reader-beta/10781-what-is-uidai-secure-qr-code-how-qr-code-enhance-the-security-of-e-aadhaar.html ; https://uidai.gov.in/en/307-faqs/aadhaar-online-services/offline-aadhaar-data-verification-service.html
- DigiLocker — https://www.digilocker.gov.in/ ; developer FAQ — https://developers.digitallocker.gov.in/faq.php ; employer verification guide — https://iimbg.ac.in/wp-content/uploads/2026/05/Employer_Verification_Guide_DigiLocker.pdf ; scanner — https://www.primebook.in/blog/what-is-digilocker-scanner
- e-Sanad — https://esanad.nic.in/ ; PIB launch release — https://www.pib.gov.in/PressReleasePage.aspx?PRID=2168764&reg=3&lang=2 ; MEA website content — https://www.mea.gov.in/Images/attach/e_sanad_website.pdf

**DigiLocker issuer integration**
- **Issuer API Specification v1.13 (May 2024)** — https://cf-media.api-setu.in/resources/DigiLocker-Issuer-APISpecification-v1-13.pdf
- Issuer API Specification v1.12 — https://img1.digitallocker.gov.in/assets/img/issuer_api/Digital%20Locker%20Issuer%20API%20Specification%20v1.12.pdf
- Authorized Partner API Specification v1.11 — https://img1.digitallocker.gov.in/assets/img/Digital%20Locker%20Authorized%20Partner%20API%20Specification%20v1.11.pdf
- APISetu DigiLocker hub — https://apisetu.gov.in/digilocker ; partner portal — https://partners.apisetu.gov.in
- Onboarding FAQ — https://www.digilocker.gov.in/assets/FAQ%20DL%20EL_onboarding.pdf ; Onboarding Issuers & Requesters — https://developers.digitallocker.gov.in/assets/img/onboarding-issuers-&-requesters.pdf
- Integration walkthroughs — https://rc.sunbird.org/use/integrations/digilocker-integration ; https://www.frslabs.com/frsblog/2023/10/12/digilocker-how-to-integrate-digilocker-api-into-your-web-or-mobile-app-for-kyc/

**DPDP**
- PIB, DPDP Rules 2025 Notified — https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf
- Shardul Amarchand Mangaldas — https://www.amsshardul.com/insight/enforcement-of-the-dpdp-act-and-notification-of-the-dpdp-rules/
- AZB, phased rollout — https://www.azbpartners.com/bank/indias-digital-personal-data-protection-act-phased-rollout-and-key-compliance-milestones/
- Section 17 — https://www.dpdpa.com/dpdpa2023/chapter-4/section17.html ; Section 13 — https://www.dpdpa.com/dpdpa2023/chapter-3/section13.html ; Section 8 — https://www.dpdpa.com/dpdpa2023/chapter-2/section8.html
- State as Data Fiduciary — https://corporate.cyrilamarchandblogs.com/2025/03/role-of-state-governments-in-indias-data-protection-regime/
- Exemptions — https://www.gotrust.tech/blog/exemptions-and-accountability-in-india-s-data-protection-framework ; https://www.complyzero.com/blog/dpdp-act-exemptions-explained
- Grievance Officer / Rule 14 — https://ksandk.com/data-protection-and-data-privacy/grievance-officers-under-indias-dpdp-act-and-2025-rules/ ; https://indiadpdpa.com/india-dpdpa-article-13-right-of-grievance-redressal/
- Cyril Amarchand DPDPA FAQs — https://www.cyrilshroff.com/wp-content/uploads/2025/12/FAQs-DPDPA.pdf

**Hosting / GIGW / CERT-In**
- PIB, secure scalable AI-ready cloud for digital governance (26 CSPs, 2,170 departments) — https://www.pib.gov.in/PressReleasePage.aspx?PRID=2202897&reg=3&lang=2
- MeitY AMBUD — https://ambud.meity.gov.in/
- AWS MeitY empanelment — https://aws.amazon.com/compliance/MeitY/ ; Microsoft — https://learn.microsoft.com/en-us/compliance/regulatory/offering-meity-india ; Google Cloud — https://cloud.google.com/security/compliance/meity-india
- Cloud procurement under GFR 2017 — https://spiceroutelegal.com/publications/cloud-governance-101-public-procurement-of-cloud-service/
- **GIGW official portal** — https://guidelines.india.gov.in/introduction/ ; https://guidelines.india.gov.in/scope-and-objective/ ; https://guidelines.india.gov.in/new-features-of-gigw-3-0/
- STQC Website Quality Certification — https://www.stqc.gov.in/en/website-quality-certification-0
- GIGW audit process (vendor commentary) — https://www.lumiversesolutions.com/stqc-gigw-3-0-compliance-process-guide-2025/ ; https://blog.certcube.com/gigw-3-0-certification-complete-compliance-guide/
- CERT-In Directions 2022 — https://trilegal.com/wp-content/uploads/2022/05/2022-CERT-In-Directions-on-Reporting-Cyber-Incidents-1.pdf ; https://www.lexology.com/library/detail.aspx?g=899f3b94-c31f-4983-868f-5ee5abbf78c8 ; https://www.internetsociety.org/resources/doc/2022/internet-impact-brief-india-cert-in-cybersecurity-directions-2022/ ; https://www.atrity.com/cert-in-incident-reporting-6-hour-rule-and-log-retention-best-practices/

**NABL / accreditation**
- NABL 151 Application Form for Testing Laboratories (declared signatories) — https://nabl-india.org/nabl/file_download1.php?filename=202307131055-NABL-151-doc.doc
- NABL 127 (regulatory-body-specific requirements, digitally signed report distribution control) — https://nabl-india.org/nabl/file_download1.php?filename=202401230945-NABL-127-doc.pdf
- ISO/IEC 17025:2017 reference — https://nabl-india.org/nabl/file_download1.php?filename=202404020602-CC-3373-doc.pdf

---

## Files written to disk during this research

Downloaded PDFs cached locally at `C:\Users\XRIG\.claude\projects\D--Prashant-WorkSpace-TTL-Software\02130bad-9323-4c28-8c15-7cb8073947b2\tool-results\` — notably `webfetch-1787123667084-737bac.pdf` (the CSTRI approved testing charges document, which contains the RSTRS/STSC rate card, the Tatkal scheme text and the "GST extra" clause) and `webfetch-1787123558985-gbmxkf.pdf` (the CGA Bharatkosh user FAQ, source of the GAR 6 / GAR 7 / UTR / Provisional Receipt mechanics). Both are worth attaching to the spec as annexures.