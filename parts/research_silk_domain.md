# Research Brief: Domain of a CSB Silk Conditioning & Testing House / RSTRS (Dharmavaram)
**Purpose:** raw material for a LIMS spec to sit on CloudZoo ERP. **Date of research:** 2026-08-19.

**Confidence key used throughout**
- **[F]** = verified in a cited primary/official source
- **[I]** = my inference from cited facts (defensible, but not stated anywhere)
- **[U]** = UNVERIFIED / assumption — must be confirmed with the scientist before coding

---

## 0. Sources actually used

| # | Source | What it gave |
|---|---|---|
| S1 | https://cstri.res.in/wp-content/uploads/2023/12/TestingCharges-2023.pdf | **Official rate card w.e.f. 01.12.2023**, incl. a dedicated "Proposed rates for SCTH / RSTC units Under CSTRI" section. Test names + method refs + old/revised rates |
| S2 | https://cstri.res.in/wp-content/uploads/2020/01/TestingCharges-2019.pdf | Rate card w.e.f. 15.11.2019 + **Tatkal scheme rules**, concessional rates, "advisory basis" note |
| S3 | https://cstri.res.in/wp-content/uploads/2023/08/AnnualReport_2021-22.pdf | **RSTRS Dharmavaram actual test volumes & revenue**, unit-wise test-type lists, TTL sample sources, sub-unit referral flow |
| S4 | https://archive.org/details/gov.in.is.15090.1-11.2002 (full text `is.15090.1-11.2002_djvu.txt`) | **IS 15090 Parts 1–11:2002** — definitions, sampling counts, procedures, grading tables, and the actual **proformas** for preliminary examination, conditioned mass and the Grading Certificate |
| S5 | https://www.fao.org/4/x2099e/x2099e12.htm (Ch. 12 Raw Silk Testing) | ISA method detail, conditioned-weight coefficient, winding speeds/limits, boil-off, exfoliation, ISA grade scales |
| S6 | https://www.fao.org/4/x2099e/x2099e08.htm (Ch. 8 Re-reeling & Finishing) | Skein / book / bale physical definitions and weights |
| S7 | https://www.fao.org/4/x2099e/x2099e04.htm (Ch. 4 Cocoon Quality & Classification) | Cocoon test parameters and cocoon sample sizes |
| S8 | https://csb.gov.in/sites/default/files/Service-Standards.pdf | **CSB official service standards**: testing turnaround (2–3 days), fee bands, pre-shipment inspection service, Silk Mark fees |
| S9 | https://csbsilktesting.res.in/ + `/rstrs-dharmavaram/` + `/terms-and-conditions/` + `/refund-and-return-policy/` | The live CSB online testing portal: **16-unit list, Dharmavaram's exact bookable test catalogue**, booking/payment/refund/sample-disposal rules |
| S10 | https://www.ajol.info/index.php/ijest/article/download/199710/188272 (Sargunamani, Raghu & Naik, IJEST 12(3) 2020) | **Real end-to-end workflow and throughput times of the "Limited test" at RSTRS Kancheepuram**, incl. Anna Silk Exchange auction linkage, kilcha, 20 readings/lot |
| S11 | https://cstri.res.in/?page_id=31 and `?page_id=297` | TTL division structure, test families, NABL claim |
| S12 | https://cstri.res.in/wp-content/uploads/2025/07/NABL-Certificate-2026.pdf | NABL ISO/IEC 17025:2017 cert **TC-14590**, issued 24/09/2024, valid to 23/09/2026, **scope = TTL Bengaluru only** |
| S13 | https://law.resource.org/pub/in/bis/manifest.txd.28.html | Full BIS TXD 28 (Silk & Silk Products) standards list |
| S14 | http://silks.csb.gov.in/nalgonda/where-to-get-what/ | Legacy name + address + email of the Dharmavaram unit |
| S15 | https://cstri.res.in/wp-content/uploads/2022/06/TestingChargesCollected.pdf | Monthly revenue sheet showing **PTS/PTA/CTS/CTA counts, lots, CGST 9% / SGST 9% / IGST 18%** |
| S16 | https://archive.org/details/gov.in.is.15825.1 … `.5` , https://archive.org/details/gov.in.is.17618.3.2021 / `.6` | Dupion and Tasar raw silk grading standards |

---

## 1. What the unit is, institutionally (matters for the spec's org model)

- **[F, S3]** CSTRI's sub-units are grouped as **STSC** (Silk Technical Service Centre), **RSTRS** (Regional Silk Technological Research Station), plus **TTL** (Textile Testing Laboratory) and **DCTSC** (Demonstration cum Technical Service Centre) / **STL** (Silk Testing Lab).
- **[F, S3]** RSTRS mandate, verbatim in substance: *"inculcating quality awareness amongst the manufacturers and buyers of raw silk and twisted silk"*; testing services offered to *"marketing, reelers, weavers, twisters and traders"*; *"The test reports are explained and suitable remedial measures/approaches for quality improvement are provided. The services are offered on nominal charge basis."*
- **[F, S10]** RSTRS **was formerly called "Silk Conditioning and Testing House (SCTH)"**. The paper's affiliation line reads: *RSTRS [Previously Silk Conditioning and Testing House-SCTH], CSTRI, Central Silk Board, Kancheepuram*.
- **[F, S14]** The Dharmavaram unit's legacy identity: **"Silk Conditioning and Testing house, CSTRI, Central Silk Board, Near Government cocoon market, Regatipalli, Dharmavaram – 515 671"**, phone 08559 222284, email `scth_dmm@yahoo.co.in`.
- **[F, S9]** Current portal identity: **"RSTRS-Dharmavaram"**, address *CSTRI, CSB Complex, Regatipati Road, Dharmavaram-515671, Ananthapur District, Andhra Pradesh*.
- **[F, S9]** The CSB online testing portal covers **16 units**: RSTRS-Dharmavaram, RSTRS-Kancheepuram, RSTRS-Guwahati (Khanapara), RSTRS-Varanasi, RSTRS-Malda, TTL-Madivala, STL-Okalipuram, STL-Cubbonpet, STSC-Sidlaghatta, STSC-Jammu, STSC-Cuttack, STSC-Bilaspur, STSC-Ramanagara, STSC-Bhagalpur, STSC-Dharwad, STSC-Dehradun, STSC-Salem.
- **[F, S12]** **NABL ISO/IEC 17025:2017 accreditation TC-14590 names only "TTL, CSTRI, BTM Layout, Bengaluru"** as the accredited facility. **[I]** Therefore RSTRS Dharmavaram is very likely **not** NABL-accredited in its own right. **Spec impact:** the software must NOT print NABL logos/claims on Dharmavaram reports by default; make "accredited?" a per-lab, per-test flag. **[U]** confirm with the scientist.
- **[F, S13]** The relevant BIS committee is **TXD 28 – Silk and Silk Products**. Its published standards include IS 15090-1..11:2002 (raw silk), IS 15825-1..5:2008 (Dupion raw silk), IS 15826:2008 (Tasar reeling-cum-twisting machine reeled yarn), IS 17618 (Tasar raw silk, 2021), IS 15824:2008 (marketing of textile materials made of silk), IS 1582:1968 (scouring loss in silk), IS 3561:1989 (silk fabrics — dimensional change on washing), IS 1583:1991 (handloom silk dhotis and printed saris).

---

## 2. The real service catalogue

### 2a. What Dharmavaram actually sells today — the SCTH/RSTRS rate card
**[F, S1]** From the official CSTRI charges sheet w.e.f. **01.12.2023**, section headed *"Proposed rates for SCTH / RSTC units Under CSTRI"*. This is the price list a Dharmavaram invoice would be built from.

| # | Test name as printed | Note as printed | Rate ₹ (2019 → 2023) |
|---|---|---|---|
| 1 | Denier test (bobbin) | *Sample size – minimum of 5 skeins* (2019 sheet says "minimum of 5 bobbins") | 30 → 30 |
| 2 | Denier test Skein | | 40 → 40 |
| 3 | **Limited test** | *(5 skeins – minimum)* | 50 → 50 |
| 4 | Raw silk testing & Grading – **BIS** | | 400 → 400 |
| 5 | Raw silk testing & Grading – **ISA** | *Only Indigenous ARM produced silk* | 1100 → 1100 |
| 6 | Raw silk testing & Grading – **ISA** | *Other than indigenous ARM Silk* | 2000 → 2000 |
| 7 | Fibre Identification | | 300 → 300 |
| 8 | Composition of raw silk (Blend analysis) | | 600 → 600 |
| 9 | Nature | (2019: *Nature – Yarn / fibre / sliver etc.*) | 200 → 200 |
| 10 | Seriplane tests of raw silk – BIS | | 60 → 60 |
| 11 | Serigraph test of raw silk – BIS | | 110 → 110 |
| 12 | Cohesion test of raw silk – BIS | | 60 → 60 |
| 13 | Twist (twisted silk) – single | | 55 → 55 |
| 14 | Twist (twisted silk) – composite | | 160 → 160 |
| 15 | Denier test of twisted silk | | 60 → 60 |
| 16 | Twist (twisted silk) **TN cooperative** | | 50 → 50 |
| 17 | Degumming loss of twisted silk **TN cooperative** | | 50 → 50 |
| 18 | Computerized zari testing | | 75 → 75 |
| 19 | Computerized zari testing at multiple points | | 75* → 75* (per point) |
| 20 | Zari testing chemical method (IS 9925-1981) | | 2500 → 2500 |
| 21 | Zari testing **Handloom weavers** | | 1000 → 1000 |
| 22 | Muga cocoon stifling per 1000 Nos | | 20 → 20 |
| 23 | NE warping charges per warp | | 225 → 225 |
| 24 | NE machine rent (CSTRI-MRTM) per year | | 600 → 600 |
| 25 | NE machine rent (Skeining m/c) per year | | 150 → 150 |
| 26 | Mono cocoon reeling J&K | | 60 → 60 |
| 27 | Reelability test (cocoons) | | 550 → 550 |
| 28 | Reelability test with neatness | | 750 → 750 |
| — | *"Any other test if taken up, the rate applicable to TTLs has to be referred."* | | |

**[F, S2]** The 2019 sheet additionally lists **"denier test (through Anna Exchange)"** as its own line, and splits zari chemical method into *"corporates / Producers / Traders"* vs *"Handloom Weavers"*.

**[F, S9]** The Dharmavaram page on the live booking portal exposes exactly these 28 bookable items (28 product tiles), grouped as: **Raw Silk Tests** (Winding Breaks, Tenacity & Elongation ×2 method variants, Size test, Seriplane tests (Evenness), Cohesion ×2, All testing & grading ×3 variants), **Dupion Silk Tests** (Winding breaks, Size test, Special defect test), **Yarn Tests** (Twist ×2), **Chemical** (Hardness / pH / Total dissolved solids), and the **SCTH/RSTRS block** (Denier test (bobbin), Denier test Skein, Limited test, Twist single/composite, Seriplane–BIS, Cohesion–BIS, Serigraph–BIS, Denier test of twisted silk, Raw silk testing & Grading – BIS, Raw silk testing & Grading – ISA ×2).

> **Spec impact:** the same *conceptual* test (e.g. "Cohesion") appears **twice with two different method references and two different prices** (IS 15090 Part XI at ₹60 vs ISA Chapter II Article 11 + in-house at ₹400). **A test in the catalogue is (test parameter × method reference × customer class), not just a name.**

### 2b. Full test-parameter reference table (name → what's measured → unit → method → charge → time)
**[F]** for name/method/charge from S1; **[F]** for what-is-measured/units from S4/S5/S11; turnaround column: **[F]** where cited, otherwise **[I]/[U]**.

**Raw silk (the core business)**

| Test as printed | What is measured | Unit of measure | Method ref (as printed) | ₹ (2023) | Turnaround |
|---|---|---|---|---|---|
| Winding breaks | No. of thread breaks while winding skeins onto bobbins for a fixed time at fixed speed | count of breaks per test (+ cause of each break) | ISA Ch.II Art.3 / IS 15090 (Part 4):2002 | 60 (BIS) / 250-ish ISA | **[F, S10]** machine time = 10 min preliminary + 60 min normal = **70 min** for 13–33 d |
| Size test (denier / count) | Mass of individually reeled sizing skeins → average size, size deviation (SD), maximum deviation | tex or **denier**; SD to 2 dp (denier); max deviation to 1 dp (denier) | ISA Ch.II Art.4,5,6 / IS 15090 (Parts 5 & 6):2002 | 200 | **[F, S4]** +24 h conditioning before weighing |
| Seriplane tests (Evenness) | Stripes on wound panels vs Official Standard Variation Photographs | **number of stripes per 20 panels**, split into Evenness I / II / III | IS 15090 Part 7:2002 / ISA Ch.II Art.7,8,9 | 60 (BIS) / 300 (ISA) | **[I]** ~1 h inspection |
| Cleanness | Incidence of cleanness defects on same panels | **%** = 100 − Σ penalties (super-major 1.0%, major 0.4%, minor 0.1% each) | IS 15090 Part 8:2002 / ISA Art.8 | bundled in seriplane | **[I]** ~1 h |
| Neatness & Low neatness | Small imperfections (nibs, loops, hairiness, fine corkscrews) vs Official Standard Photographs | **%**; standard photo set = 100, 90, 80, 70, 60, 50, 30, 10. **Low neatness = mean of the worst 1/5 of panels** | IS 15090 Part 9:2002 / ISA Art.9 | bundled in seriplane | **[I]** ~1 h |
| Tenacity & Elongation (Serigraph test) | Breaking load and stretch at break of a multi-strand sizing skein | **g/tex or g/denier** (tenacity); **%** (elongation) | IS 15090 Part 10:2002 / ISA Art.10 + in-house | 110 (BIS) / 400 (ISA) | **[F, S4]** 24 h conditioning + test |
| Cohesion | Strokes of friction until constituent filaments open out | **number of strokes** (integer, no decimals) | IS 15090 Part XI:2002 / ISA Art.11 + in-house | 60 (BIS) / 400 (ISA) | **[F, S4]** 24 h conditioning + test |
| Conditioned size (count) | Oven-dry mass of all sizing skeins + 11% regain → true commercial denier | tex / denier, 2 dp | IS 15090 Part 6:2002 | in grading fee | **[I]** ~1–2 h oven |
| Conditioned mass | Oven-dry mass of bale + 11% → invoice weight | **kg** (+ moisture content %) | IS 15090 Part 3:2002 | not separately priced in 2023 card **[F]** | **[I]** ~1 h oven + weighing |
| Visual & tactual examination | Uniformity, general finish, "nature" (colour, lustre, hand) | ordinal ratings: colour light/medium/deep; lustre bright/medium/dull; hand smooth/medium/rough; finish good/fair/inferior | IS 15090 Part 2:2002 | in grading fee | minutes |
| **Limited test** | *Local composite*: winding + wrap-reeling of sizing skeins + kilcha + denier/size + size deviation. **The workhorse.** | denier + deviation | in-house (5 skeins min) | **50** | **[F, S10]** **120–280 min for a day's batch of 1–30 lots** (was 350 min, reduced to 220 min for multiend; 246 → 133 min for cottage basin) |
| All testing & grading – BIS | Full 12-characteristic grading → one grade | **grade letter**: 4A, 3A, 2A, A, B, C, D, E | IS 15090:2002 | 500 non-bivoltine / **1000 bivoltine** | **[U]** ~2–3 working days incl. 24 h conditioning |
| All testing & grading – ISA | Same, ISA rules | ISA grades 4A, 3A, 2A, A, B (**[F, S5]**; Japanese variant adds 5A…D) | ISA Chapter-II | 2500 | **[U]** 2–3 days |

**Dupion silk** — **[F, S1]** Special defect test (in-house) ₹350; Winding breaks ₹250; Size test ₹250. Governed by **IS 15825 Parts 1–5:2008** (Grading / Visual examination / Determination of special defects / Winding test / Average size and **size uniformity range**) **[F, S13/S16]**.

**Twisted (thrown) silk / yarn**

| Test | Measured | Unit | Method | ₹ |
|---|---|---|---|---|
| Twist (twisted silk) – single | Turns inserted per unit length + direction | **TPM (turns per metre)**, direction **S or Z** | IS 832:1985 / ASTM D1422, D1423 | 55 (RSTRS) / 300 (TTL) |
| Twist – composite | Twist of each component + resultant | TPM per component + resultant, S/Z each | same | 160 (RSTRS) / 500 (TTL) |
| Denier test of twisted silk | Linear density of thrown yarn | denier / tex | in-house | 60 |
| Degumming loss (TN cooperative rate) | Sericin removed by boiling-off | **% loss on mass** | (in-house; cf. IS 1582:1968 scouring loss in silk) | 50 |
| Linear density (yarn) | Count | tex / denier / Nm | IS 1315:1977, IS 7703 (Pt 1):1990, ASTM D1907, D1059 | 250 (**+₹100 extra if in hank form**) |
| Moisture content & moisture regain | Water in yarn | **% content and % regain** | IS 7703 (Part 3):1991 | 350 |
| Single thread strength & elongation | Breaking force & stretch | cN/tex or g/den; % | IS 1670:1991, IS 7703 (Pt 2), ASTM D2256 | 550 |
| Loop / Knot strength | | g or cN | IS 1670:1991 | 500 |
| Lea strength | | lbs / kgf (product of count × strength = CSP) | IS 1671:1999 / ASTM D1578 | 500 |
| Identification of type of yarn | raw / thrown / dupion / spun etc. | descriptive | in-house | 400 |
| No. of filaments in yarn | filament count | count | in-house | 400 |
| Cross-sectional shape of filaments | round/triangular/serrated | descriptive | in-house | 500 |
| Yarn diameter | | µm / mm | ASTM D2130 | 500 |

**Fibre**
**[F, S1]** Fineness (ASTM D2130) ₹500; Moisture (IS 199:1989) ₹350; Fibre bundle strength (IS 3675:1966) ₹550; Single fibre strength (IS 235 / ASTM D3822) ₹1500; Fibre length (ASTM D5103) ₹600; Microscopic tests (IS 667:1981 cl.5.5) ₹450.

**Fabric (35 parameters — high-value, mostly done at TTL)**
**[F, S1]** Thickness IS 7702 ₹200 · Width/length IS 1954 / ASTM D3774 ₹150 · **Fabric mass / GSM** IS 1964:2001 / ASTM D3776 / **ISO 3801** ₹200 · Thread density IS 1963 / ASTM D3887 ₹200 · Crimp / count of yarn in fabric IS 3442 ₹200 · Cover factor ₹600 · Warp/weft twist IS 832 ₹500 · Crease recovery IS 4681 / AATCC 66 ₹500 · Stiffness IS 6490 / ASTM D1388 ₹400 · Abrasion resistance 5000 cycles IS 12673 / ASTM D4966 ₹1000 · **Tensile strength & elongation IS 1969:1985 / ASTM D5034 & D5035 ₹550** · **Tearing strength IS 6489:1993 / ASTM D1424 ₹400; ASTM D2261 ₹500** · Bursting strength (based on IS 1966) ₹500 · Identification of warp & weft ₹300 · **Percentage by weight ₹500** · Air permeability IS 11056 / ASTM D737 ₹400 · **Weave analysis (ISO 7211/1): simple ₹250 / complex ₹500** · Drape coefficient IS 8357 ₹500 · Water spray IS 390 ₹400 · Pilling IS 10971 ₹500 · Bow & skew ASTM D3882 ₹350 · Seam slippage ASTM D434 ₹500 · Seam strength ASTM D1683 ₹500 · Seam bursting ₹400 · Garment seam strength ₹500 · **Fabric defect analysis (in-house) ₹1500** · Shear & peel ASTM D5169 ₹600 · Static elongation & peel for laminates ASTM D4851 ₹600 · Stretch & stretch recovery ASTM D6614 ₹600 · Absorbency AATCC 79 ₹500 · Wicking (vertical) ₹500 · Water vapour permeability ₹1000 · **Identification of loom origin ₹1500 (handloom vs powerloom!)** · Type of woven fabric ₹500. Plus **Felt** (ASTM D461 sections) and **Coated/Laminated/Non-woven** (IS 7016 parts) blocks.

**Chemical**
**[F, S1]** Light fastness Xenon IS 2454 ₹1000 / Daylight IS 686 ₹750 · **Wash fastness IS/ISO C-10-105: Tests 1–3 ₹300, Tests 4 & 5 ₹400** · Rubbing IS 766 ₹250 · Perspiration IS 971 ₹400 · Dry-cleaning IS 4802 ₹500 · Sublimation IS 975 ₹400 · Hot pressing IS 689 ₹400 · Bleaching (hypochlorite / H₂O₂) IS 762 ₹400 · **Colour fastness to degumming IS 970 ₹400** · Hot water IS 767 / IS 4389 ₹400 · Laundering AATCC 61 (1A–5A) ₹500 · **Scouring loss of silk IS 1582:1968 ₹300** · Scouring loss of cotton IS 1383 ₹500 · **Fibre identification AATCC 20-2007 ₹350** · **Blend analysis (multi) AATCC 20A-2008 ₹600**; carpet felts/non-woven ₹1000; industrial ₹2500 · pH of aqueous extract AATCC 81 / IS 1390 ₹400 · Ether soluble matter (oil & wax %) IS 4390 ₹500 · Water soluble matter IS 3456 ₹500 · **Dimensional change: IS 2977, silk woven IS 3561:1989, wool IS 665, knits IS 4419, rayon/synthetic woven IS 1299 ₹400** · Heat shrinkage IS 11248 ₹500 · Soap analysis (full) ₹2750 and its 7 sub-parameters (pH, total fatty matter, matter insoluble in alcohol, total moisture IS 286, glycerol, rosin, unsaponified matter) · **Identification of dyes IS 4472 (Pt 1) ₹550** · **Water analysis (hardness / pH / TDS) IS 3025 ₹400** ← *this is "reeling water analysis"*.

**"Others" — descriptive one-liners, cheap, high volume [F, S1]:** Nature ₹200 · Woven/Knitted ₹200 · Colour / dyed or not ₹200 · Bleached / unbleached ₹250 · Coated / laminated / impregnated ₹200 · Tufted / non-tufted ₹200 · Cut pile / loop pile ₹200 · Upholstery or not ₹200 · PU / PVC coated ₹500 · **HSN Certificate ₹1250**.

> **[I] Spec impact:** the "Others" block + **HSN Certificate** exist because **Customs** and importers/exporters need a lab statement to classify goods under an HSN code. That is a *classification opinion document*, not a numeric test result. Model it as a report type with free-text/enumerated findings.

**Eco-parameter [F, S1]:** Banned aryl amines (azo dyes) German method ₹3000 · Pentachlorophenol ₹2500 · Pesticides ₹4000 · Free formaldehyde ISO/DIS 14184-1 ₹1000 · Heavy metals IS 1039:1989 / DIN 38405 (Pt 24) ₹550.

**Zari [F, S1]:** Estimation of gold and silver content of zari threads **IS 9925-1981** ₹2500 (chemical method) · Handloom weavers rate ₹1500 · **Computerized (XRF) zari testing ₹75 per point** · CCM (computer colour matching) results, DCI method ₹350 · FTIR ₹1200.

**Cocoon [F, S1]:** Cocoon testing ₹550 · Cocoon character analysis ₹150 · Cocoon reeling performance ₹550 · Test-dyeing charges ₹400 · Reelability test ₹550 / with neatness ₹750 · Muga cocoon stifling per 1000 nos ₹20.
**Cocoon parameters measured [F, S7]:** single cocoon weight; shell weight; **shell ratio % = (wt of 100 shells / wt of 100 cocoons) × 100** from 200 cocoons; filament length (m, e.g. 920–1480 m); filament size (denier); **reelability % = (reeled cocoon number / end-feeding number) × 100** (multi-end 39–87%, automatic 34–83%); raw silk % (2 dp); moisture; **8 defective-cocoon classes** (double, inside stained, outside stained, printed/scaffold pressed, malformed, flimsy, thin-end, pierced) counted under **500 lux**; cocoon grade A–E from combined filament-length + reelability points (A ≥90, B 88–89, C 86–87, D 84–85, E ≤83).

### 2c. What the Dharmavaram mix ACTUALLY looks like (critical for UX design)
**[F, S3]** FY 2021-22, RSTRS Dharmavaram: **11,294 silk and cocoon samples tested; revenue ₹7,56,789.** Separately a pilot study analysed **11,240 silk samples** from Multi-end and ARM units of AP & Telangana; *"majority of the silk lots fall under grade A to 3A and 2A to 4A in the case of Multi-end reeling and ARM units respectively."*

Test mix (**[F]** values; row-to-label mapping **reconstructed** from a column-shifted PDF table, but the five values sum exactly to the printed total 11,294, so the mapping is safe):

| Test | Count | Share |
|---|---|---|
| **Limited Test** | **11,071** | **98.0%** |
| All test (ISA) | 69 | 0.6% |
| Twist test | 49 | 0.4% |
| Twisted yarn denier | 51 | 0.5% |
| Water testing | 54 | 0.5% |
| **Total** | **11,294** | avg **≈ ₹67 / sample** |

Comparators **[F, S3]**: STSC Sidlaghatta 17,312 lots / ₹7,56,302 (Silk-Limited test 17,190; Size/Denier on bobbins 119; Size/Denier twisted lot 3) — *"majority of the samples tested are 18/20, 20/22 and 22/24 denier raw silk."* RSTRS Kancheepuram 13,438 lots / ₹18,83,335 with a far richer mix (Limited test, Size/Denier – raw silk / twisted lot (TCIDS), **Boil off / Degumming test**, All test (ISA), **Twist Test (Govt)**, **Zari test (PVT)**, Advisory-Zari XRF, Zari chemical, **TTL–physical**, **TTL–chemical**). RSTRS Malda 885 lots (Cocoon lots tested, Cocoon reeling performance, Raw silk-Denier test, All test (BIS)). RSTRS Varanasi 162 lots / ₹2,78,700 (Mechanical 5, Chemical 74, **Eco-parameter 83**). TTL Bengaluru 2,519 commercial samples / **₹73,02,372**.

> **Spec impact (the single most important design fact in this brief):** Dharmavaram is a **high-volume, low-unit-price, single-test-type** operation. 98% of work is one ₹50 test done in daily batches of 10–30 lots. Design for **fast batch entry of many lots of the same test**, not for a per-sample wizard. A form that takes 90 seconds per sample cannot process 11,000 samples/year.

---

## 3. "Silk conditioning" and the WEIGHT certificate

### 3.1 What conditioning is
**[F, S4, IS 15090 Part 1 cl.2.4]** **"Conditioned Mass (or Correct Invoice Mass)** — the mass of raw silk obtained by adding to its oven-dry mass, **11 percent** of its oven-dry mass."

**[F, S4, Part 3 scope]** Part 3 *"prescribes method to determine the moisture free mass of the raw silk plus 11 percent of the dry mass allowed as regain of moisture."*

- **Official regain rate for silk = 11% of oven-dry mass.** **[F, S4 and S5]** Conditioned weight = 1.11 × oven-dry mass. FAO expresses it as coefficient **(W / W′) × 1.11** where W = original weight, W′ = dry weight.
- **[F, S6]** After re-reeling, raw silk normally carries **6–8% moisture** — i.e. as-received silk is usually *drier* than the 11% commercial standard, so conditioning typically **increases** the invoice weight relative to a naive net weight. **[I]** But it can go either way; the whole point is that it is independent of the day's humidity.

### 3.2 Why a Conditioning House issues a weight certificate — the commercial purpose
**[F, S5]** Raw silk is hygroscopic and is sold by weight. Its weight swings with ambient humidity, so *"normal trade practice is to use the conditioned weight of textiles as the basis of purchase or sale"*. Historically Japan's government Silk Conditioning House (Yokohama, 1896) existed precisely so that an **independent official body** performed the "condition weighing" of raw silk for export. **[I]** The economics: on a 60 kg bale, a 3% moisture difference is ~1.8 kg of silk. At Indian raw-silk prices that is thousands of rupees per bale. Neither seller nor buyer will accept the other's scale, so a neutral government house weighs it and both settle on that number.

**[F, S5]** In China the equivalent export document is a *"certificate for raw silk classification and conditioned weight"* issued by the entry-exit inspection authority — evidence that this is a recognised international trade document type, not just an internal lab record.

### 3.3 Exact data the conditioning document carries
**[F, S4]** IS 15090 (Part 3) **Annex A — "PROFORMA FOR RECORD AND REPORT"**, headed:

> **(Name of Conditioning House)**
> **RECORD AND REPORT OF CONDITIONED MASS OF RAW SILK**
> [Conducted in accordance with IS 15090 (Part 3) Raw silk — Grading and methods of tests: Part 3 Determination of conditioned mass]

Header fields: **Mark of the lot**; **Serial No. of bales in the lot**.

Section I — Calculation of average moisture content in the bale (6 numbered lines + result):
1. Mass in g of the **first set of skeins** before drying
2. **Oven-dry mass** in g of the first set
3. **Moisture content % of the first set, m₁**
4. Mass in g of the **second set** before drying
5. Oven-dry mass in g of the second set
6. **Moisture content % of the second set, m₂**
→ **Average moisture content, percent = m**

Section II — Calculation of the conditioned weight of the bale (**tare build-up, in kg**):
1. Mass of **'shirt'** (Mₛ)
2. Mass of **wrapping papers and labels of 5 books** (M_p₅)
3. Mass of **middle cotton bands of 5 books × 3** (3M_c₅)
4. **Tare of 5 books** = (M_p₅ + 3M_c₅)
5. **Tare of one book** = (M_p₅ + 3M_c₅)/5
6. **Tare of all the books (n) in the bale** = n(M_p₅ + 3M_c₅)/5
7. **Total tare of the bale**
Then: **Gross mass of the bale (M_g)** → **Net mass of the bale (M_n)** → **Oven-dry mass D = M_n(1 − m/100)** → **Conditioned weight of the bale = 1.11 D**
Footer: **Remarks / Date / Signature of Tester**.

**[F, S4]** Tare rule: *"All materials used in packing the raw silk shall be considered as tare, except the cotton lacings in the skeins, provided these lacings do not exceed one metre per skein."*

**[F, S4]** Apparatus mandated: platform balance 100 kg capacity, least count 0.1 kg; skein balance 1 kg capacity, least count 0.1 g; conditioning oven at **140 °C** with in-chamber balance reading to 0.1 g.

### 3.4 Is it a different document from a test report? YES
**[F, S4]** IS 15090 defines **three distinct documents**, each with its own proforma:
1. **Record and Report of Preliminary Examination of Raw Silk** (Part 1, Annex C) — an accept/reject gate
2. **Record and Report of Conditioned Mass of Raw Silk** (Part 3, Annex A) — the **weight certificate**
3. **Grading Certificate of Raw Silk** (Part 1, Annex D) — the quality certificate, carrying a **Grading Certificate No.**

> **Spec impact:** three document templates, three numbering series, three different data shapes. The weight certificate is a **mass/settlement document** (kg, tare, gross/net); the grading certificate is a **quality document** (grades and classes). Do not force them into one "test report" table.

### 3.5 Honest caveat about conditioning TODAY
**[F, S1, S2, S9]** Neither the 2019 nor the 2023 CSTRI rate card contains a line item for "silk conditioning", "conditioned mass" or a weight certificate; the Dharmavaram online catalogue has no such product; and the 2021-22 annual report's Dharmavaram test list does not mention it.
**[I]** Conditioning-for-invoice appears to be **largely dormant/legacy** at these units — they kept the name but the live revenue is denier/limited testing. It may still be done occasionally on request (e.g. an export consignment or a dispute).
**[U] Must ask the scientist:** *"Do you still issue conditioned-mass / weight certificates? How many per year? Under what rate head do you bill them?"* Build the module, but do not assume it is high volume.

---

## 4. Sample types and how a lab describes them

### 4.1 The physical hierarchy of raw silk (get this right or nothing else works)
**[F, S4 & S6]**

| Level | Definition / typical size |
|---|---|
| **Filament / thread** | Raw silk = thread reeled from several cocoons, continuous from beginning to end of the skein **[F, S4 cl.2.10]** |
| **Skein (hank)** | Silk reeled and removed from the machine as an open band; one continuous thread, all breaks tied with clean knots, loose ends ≤3 mm; outer end tied round the hank; laced at equally spaced places with fine soft-twisted cotton or spun-silk yarn through ≥5 diamonds of the hank width, knot ~1 cm from the edge, loose ends ≤1 cm **[F, S4 cl.2.7]**. Grand reel circumference **150 cm**; **single skein ≈ 70 g**, **double skein 125–135 g** **[F, S6]** |
| **Book** | *"A compressed package of raw silk weighing about 5 kg and containing a suitable number of skeins"* **[F, S4 cl.2.1]**. In practice **30 single skeins (5 lines × 6 stairs)** or **20 double skeins**, tied with bleached cotton rope **[F, S6]** |
| **Bale** | **22–30 books, ≈ 60 kg** **[F, S6]**; IS also works in 30 kg bales/cartons **[F, S4]** |
| **Lot** | **Unit of grading.** Original IS 15090 cl.3.2: *"a lot of 4 bales of 30 kg each; if more than 4 bales, divide into lots of 2 bales each and part thereof"* (with a note to merge a trailing <2-bale part). **Amendment No. 1, February 2007 replaces this with: "The unit of grading shall be for one lot. The quantity of one lot shall consist of 2 to 4 cartons of 30 kg each or 1 to 2 bales of 60 kg each."** **[F, S4]** |
| **Kilcha** | Local term for the small test skein made on the wrap reel (kilcha = slight twist applied manually on a kilcha winder) **[F, S10]**. For muga, test lengths of 22.5 m or 45 m per kilcha were evaluated; **45 m** chosen **[F, S3]** |
| **Bobbin** | Winding-test output; 10 bobbins become the physical basis for size, evenness, cleanness, neatness, tenacity and cohesion **[F, S4]** |
| **Chop** | A field on the Grading Certificate proforma **[F, S4]**. **[I]** the producer's/filature's trade mark stamped on books/bales. **[U]** confirm meaning locally |

### 4.2 Attributes the lab records per sample/lot
**[F, S4, Part 1 Annex C — Record and Report of Preliminary Examination]**: **Mark of the lot** · **No. of bales** · **Serial No. of bales in the lot** · Mass of the bale · No. of books or bundles in a bale · Mass of a book or bundle · **Manner of packing of the lot** · **Skein formation** · **Skein weight (g)** · **Crossing of the skeins** · **Circumference of the skeins** · **Reeling device: Domestic basin / Cottage basin / Charkha / Multiend / Automatic** · Remarks: (1) **Admixture of commercial varieties of raw silk** (2) **Adulteration in any manner** (3) Other peculiarities · **Lot accepted / rejected for grading** · Date · Signature of Tester.

**[F, S4, Part 1 Annex D — Grading Certificate]**: **Grading Certificate No.** · Mark of the lot · Serial No. of bales in the lot · **Chop** · No. of bales in the lot · **Average conditioned size (tex)** · then the results grid.

**[F, S4, cl.3.5.1]** *"Taking the size of the silk **marked on the bale** as the basis…"* — so the **declared/marked denier** is a required input field, distinct from the measured denier.

**[F, S4, cl.3.3]** **Sorting of bales by colour**: if bales vary in colour from one another, the consignment is sorted into colour groups; all bales sorted out for grading constitute a lot; if a lot is split into groups, *"the number of sample skeins to be drawn from each group shall be proportional to the total number of books in each group."*

**[F, S3]** Denier is quoted in trade as a **range/nomenclature**, not a single number: *"18/20, 20/22 and 22/24 denier raw silk"*. **[F, S10]** Anna Silk Exchange samples were "denier range 18–22". **Spec impact: store declared size as a string/range code AND as numeric min/max.**

**[F, S3]** Sample descriptors also include the **producing technology**: *"received from charkha, domestic basin, Multiend reelers and twisters"*, and **ARM** (Automatic Reeling Machine) vs **MRM** (Multi-end Reeling Machine) — and the ISA grading price literally depends on it (*"Only Indigenous ARM produced silk"* ₹1100 vs *"Other than indigenous ARM Silk"* ₹2000) **[F, S1]**.

**[F, S8]** For pre-shipment inspection the sample is defined as *"sample swatch of 6×6″ … collected from the exporter"*.

**[I]** Consolidated minimum sample-master fields for the spec: sender/customer, sender's declaration text, sample type (raw silk / dupion / twisted silk / cocoon / fabric / saree / zari / water / dye / chemical / soap), silk variety (mulberry / tasar / muga / eri / dupion), form (skein / hank / bobbin / cone / bale / book / fabric piece / garment / loose fibre), declared denier or count (+ range), declared twist, colour, quantity + unit (kg / nos / metres), lot no., bale nos., book count, mark, chop, reeling device, ARM/MRM/charkha flag, scheme/customer class, condition on receipt, packing condition, and photograph.

---

## 5. Customers and channels

**[F, S3]** TTL Bengaluru receives samples from: *"Customs, Government departments, private organizations and individuals such as reelers, weavers, domestic fabric manufacturers, traders, importers and exporters."*
**[F, S3]** RSTRS services go to *"marketing, reelers, weavers, twisters and traders."*
**[F, S3]** Three distinct **payer/priority classes at the lab level**: (a) **commercial samples** — charged; (b) **research samples** from the institute's own divisions — *"tested on advisory basis"* (i.e. free); (c) **sub-unit samples** — *"analysed different samples received from all over India … their testing charges were collected at respective sub units"* (719 samples in 2021-22: 12 physical, 707 chemical).
**[F, S2]** *"All the In-House Research samples of CSTRI and Sub units are tested on advisory basis."*

Channel list (each with a source):

| Channel | Evidence |
|---|---|
| **Walk-in at the counter** | **[F, S8]** *"After receipt of formal application with sample from the customer at the TTL counter, the testing will be carried out and the test report issued"* |
| **Silk exchange / auction (market-linked, daily batches)** | **[F, S10]** RSTRS Kancheepuram tests multiend & cottage-basin skeins *"received from Anna Silk Exchange … to grade raw silk for auction purpose and price fixation for the customer Anna Silk Exchange, Kancheepuram, which is under Directorate of Sericulture, Salem"*, arriving *"on various days in a week"*. **[F, S2]** a dedicated rate line *"denier test (through Anna Exchange)"*. **[I]** Dharmavaram's equivalent is the adjacent **Government Cocoon Market (GCM), Regatipalli** — the unit's own address is *"near Government cocoon market"* **[F, S14]** and GCM officials attend its awareness programmes **[F, S3]**. **[U]** confirm the exact market/exchange arrangement at Dharmavaram |
| **Online booking + digital payment** | **[F, S9]** csbsilktesting.res.in is a live WooCommerce-style portal with cart, my-account, OTP login, per-unit catalogues, UPI/netbanking/cards, in-app report delivery. **[F]** A companion Android app "CSB-CSTRI Testing" exists on Google Play |
| **Courier / post** | **[F, S9]** T&C put *"timely submission and proper packaging"* on the customer and disclaim *"sample damage, loss, or degradation caused due to poor packaging, courier delays"* |
| **Other CSB units (inter-unit referral)** | **[F, S3]** sub-unit samples forwarded to TTL, **but billed at the originating sub-unit**. **[F, S3]** Kancheepuram's own test table has rows *"TTL – physical"* and *"TTL – chemical"* |
| **Government departments / State DoS / schemes** | **[F, S3]** *"Twist Test (Govt)"* vs *"Zari test (PVT)"* as separate reported categories; *"Size/Denier Test – Raw silk / Twisted lot (TCIDS)"*; CSS scheme post-dispatch inspections |
| **Customs** | **[F, S3]** listed as a sample source; **[F, S1]** the ₹1250 **HSN Certificate** line exists |
| **Exporters needing a shipment certificate** | **[F, S8]** *"Undertaking voluntary pre-shipment inspection for quality and content of silk products meant for exports"* — 2 days, at *"All Certification Centres & some of the Regional Offices of CSB"*, application in prescribed format stating scope, **with relevant invoices and packing list in duplicate**, 6×6″ swatch, **certificate issued**, fee ₹200–₹700 **based on consignment value (₹1 lakh to ₹5 lakhs and above) + GST** |
| **Silk Mark Organisation of India (SMOI)** | **[F, S8]** SMOI is a CSB body (CEO at CSB Madivala campus); membership ₹500 for handloom weavers with <5 looms, ₹5000 others; authorised-user fee ₹5000 + GST; society ₹1500; label costs ₹2/sew-in, ₹4/paper hang tag & sticker. **[U]** Whether *Dharmavaram* performs Silk Mark authentication testing and whether such tests are free-of-charge/chargeable is **not verified** — search results say chapters offer a free confirmatory purity test with certificate, but that came from non-official sites, so treat as **[U]** |
| **Court / legal / dispute referrals** | **[U] NOT VERIFIED.** No official source found. It is plausible (a neutral government lab is the obvious referee for a weight/quality dispute) but do not state it as fact. **Ask the scientist.** |
| **Students / training** | **[F, S3]** B.Sc (Sericulture) batches given practical demonstrations of raw silk testing and grading |

---

## 6. Fee structure

**[F, S1, S2]** There **is** a published, dated, approved rate schedule — reissued periodically (*w.e.f. 15.11.2019*, then *w.e.f. 01.12.2023*), printed with **"Old" and "Revised Rate"** columns side by side. Sections: A. Physical/Mechanical Testing · B. Chemical Testing · C. Eco Parameter Testing · plus a separate block *"…rates for SCTH / RSTC units Under CSTRI"* / *"…for STL division of CSTRI & RSTRS / STSC units"*.

**Charging basis — mixed, and this matters:**

| Basis | Examples |
|---|---|
| **Per test, per sample/lot** (dominant) | Nearly everything. Limited test ₹50, Denier bobbin ₹30, Denier skein ₹40 |
| **Per test with a minimum sample size** | *Denier test (bobbin) – minimum of 5 bobbins/skeins*; *Limited test (5 skeins minimum)* **[F, S1, S2]** |
| **Per measurement point** | *Computerized zari testing at multiple points* — **₹75\* per point** **[F, S1]** |
| **Per physical unit of material** | *Muga cocoon stifling **per 1000 Nos** ₹20*; *NE warping charges **per warp** ₹225* **[F, S1]** |
| **Per year (rental)** | *NE machine rent (CSTRI-MRTM) **per year** ₹600*; *Skeining m/c per year ₹150* **[F, S1]** |
| **Per consignment value band** | Pre-shipment inspection ₹200–₹700 by consignment value (₹1 L to ₹5 L and above) **[F, S8]** |
| **Form surcharge** | Yarn linear density: *"For hank form – Rs.100/- extra"* **[F, S1]** |
| **Per kg** | **No per-kg charge found anywhere.** **[U]** if the scientist mentions per-kg conditioning charges, that is a local/legacy practice to confirm |

**Concessions and customer-class pricing — REAL and must be modelled [F, S1, S2]:**
- **Handloom weavers**: Zari chemical method ₹1000–1500 vs ₹2500 for *"corporates / Producers / Traders"*
- **TN co-operative units**: Twist ₹50, Denier of twisted silk ₹50, Degumming loss ₹50 (vs ₹55/₹60/₹60 standard)
- **Indigenous ARM silk**: ISA grading ₹1100 vs ₹2000 for other silk
- **Bivoltine vs other**: BIS grading ₹1000 (bivoltine) vs ₹500 (other than bivoltine)
- **Govt vs Private**: reported as distinct categories (*Twist Test (Govt)*, *Zari test (PVT)*)
- **Scheme-linked**: *(TCIDS)* tagged tests
- **Zero-charge**: in-house research samples of CSTRI and its sub-units, *"tested on advisory basis"*
- **J&K / NE-specific rates**: *Mono cocoon reeling J&K ₹60*; NE warping/machine-rent lines

**Priority/rush pricing — "Tatkal" [F, S2], verbatim:**
> *"It is approved to charge **double amount under Tatkal scheme** for speedy testing services (**Within same day for maximum of 5 samples which are booked before 11 AM** and applicable for **those tests which could be completed within 6 hours** of duration)"*

**Tax [F, S15, S8, S1]:** **GST is extra, "applicable as per prevailing rates"**. Actuals show **CGST 9% + SGST 9%** for intra-state and **IGST 18%** for inter-state. The revenue sheet tracks both columns per month. Fee bands quoted in the citizen-facing service standards: **₹60 – ₹2000 + GST** (mechanical/chemical), **₹100 – ₹4000 + GST** (eco).

**Fallback rule [F, S1]:** *"Any other test if taken up, the rate applicable to TTLs has to be referred."* / *"For any other tests, rates approved for TTL, CSTRI, Bengaluru holds good."*

**Refund/cancellation rules [F, S9]:** cancellation only **before testing begins**; full refund only if **before the sample is processed**; no refund once processing/testing starts; approved refunds to original payment mode within **T+1 business days**; rescheduling possible subject to approval; a **designated grievance redressal officer** handles disputes; customer bears cost of collecting/returning a sample after cancellation.
**Sample disposal [F, S9]:** *"Samples not claimed within a specified period after testing may be disposed of as per laboratory protocols."*

---

## 7. Documents the unit issues, and what must appear on them

### 7.1 Document types (each needs its own template + number series)
1. **Record and Report of Preliminary Examination of Raw Silk** — accept/reject gate before grading **[F, S4]**
2. **Record and Report of Conditioned Mass of Raw Silk** — the weight certificate **[F, S4]**
3. **Grading Certificate of Raw Silk** (carries *Grading Certificate No.*) **[F, S4]**
4. **Per-test Record and Report** — IS 15090 gives a proforma for *every* part (winding, size deviation, conditioned size, evenness, cleanness, neatness, serigraph, cohesion) **[F, S4]**
5. **Test report** for TTL-style physical/chemical/eco tests **[F, S8]**
6. **Pre-shipment inspection certificate** for exporters **[F, S8]**
7. **HSN Certificate** **[F, S1]**
8. **Cocoon test / reeling-performance report** **[F, S1, S3]**
9. **Zari test report** (chemical or XRF, possibly multi-point) **[F, S1]**
10. **Water analysis report** (reeling water) **[F, S1, S8]**
11. **Tax invoice / receipt with CGST+SGST or IGST** **[F, S15]** — CloudZoo territory

### 7.2 Fields that MUST appear (by IS convention)
**[F, S4]** Every IS 15090 proforma carries, at minimum:
- **(Name of Conditioning House)** as the letterhead placeholder
- Title naming the exact document type
- A bracketed **method attribution line**: *"[Conducted in accordance with IS 15090 (Part n) Raw silk — Grading and methods of tests: Part n <part title>]"*
- **Lot identification**: Mark of the lot; Serial No. of bales in the lot; No. of bales; (Grading Certificate adds **Chop** and **Average conditioned size**)
- The **raw observations** (not just the conclusion) — e.g. both sets' pre-dry and oven-dry masses, each intermediate tare component
- **Derived results** with their formulas visible
- **Remarks** (free text) — and specific IS clauses *require* remarks: outstanding/exceptional defects *"shall be mentioned in the test certificate"*; visual ratings such as *'Fair'* *"be mentioned in the test certificate when they…"*; break causes and frequency *"in the test certificate"*
- **Date**
- **Signature of Tester**

**[F, S4]** The Grading Certificate result grid has this exact column structure:
`Characteristic | Observed Value | Corresponding Major Test Grade` and, side by side, `Characteristic | Observed Value | Corresponding Auxiliary Test Class | Required Auxiliary Test Class | Difference (in the case of deficient auxiliary test value)`
followed by the degrading sentence, e.g. *"Grade 'A' lowered by two grades = C grade"*, then **"Overall grade = C grade"**.
The illustrative row set is: **Major** — Size deviation, Evenness variation I, Evenness variation II, Cleanness, Average neatness, Low neatness. **Auxiliary** — Maximum deviation, Evenness variation III, Winding (breaks), Tenacity, Elongation, Cohesion.

**[F, S4]** Rounding rule: final observed/calculated values rounded per **IS 2:1960**, retaining the same number of significant places as the specified value. Size deviation to 3 dp in tex / **2 dp in denier**; maximum deviation to 2 dp in tex / **1 dp in denier**; cohesion strokes as **integers, no decimals**.

**[I] + [U]** ISO/IEC 17025:2017 clause 7.8 additionally requires: unique report identifier and page-of-pages, lab name and address plus location of testing, customer name and address, sample description and unique sample ID, date of receipt and date(s) of testing, method identification, results with units, decision rule if a conformity statement is made, name/function/signature of authorising person, a statement that results relate only to the items tested, and a statement that the report shall not be reproduced except in full. **This applies to TTL Bengaluru (accredited); whether Dharmavaram follows the same house style is [U].** Ask for scans of three real documents: a Limited Test report, a Grading Certificate, and one tax invoice.

---

## 8. Sampling, sub-sampling and the "many readings → one result" model

This is the section that most constrains the data model. All from **[F, S4]** unless noted.

### 8.1 Sample draw (lot → skeins)

| Test (IS 15090 part) | What is drawn |
|---|---|
| Preliminary examination (Pt 1) | Governed by Annex A requirements; net bale mass per Annex B |
| Visual & tactual (Pt 2) | **All the books (or bundles) and skeins in a lot** constitute the test sample. Inspected in a *Standard Visual Inspection Room* with a **north-facing window** (or standard artificial daylight) |
| **Conditioned mass (Pt 3)** | **6 skeins, one skein per book**, books distributed equally across the bales of the lot, drawn from different parts of the bale, each skein from a different part of the book → **split into 2 sets of 3 skeins**. Skeins drawn **at the same time as the bale net mass is determined**, weighed immediately, masses recorded **separately**. Books are then **replaced in their bales** |
| **Winding (Pt 4)** | **10 skeins** if skeins are ~70 g, **5 skeins** if ~140 g → produces **10 bobbins** which feed all downstream tests |
| **Size deviation & max deviation (Pt 5)** | The 10 bobbins. For ≤3.7 tex (33 d): **4 sizing skeins of 450 m from every bobbin = 40 sizing skeins**. For ≥3.8 tex (34 d): **8 sizing skeins of 112.5 m from every bobbin = 80 sizing skeins**. Each sizing skein **weighed individually** on a quadrant balance |
| Conditioned size (Pt 6) | **All** sizing skeins from Part 5, oven-dried at 140 °C |
| **Evenness (Pt 7)** | **20 panels from 10 bobbins, 2 panels per bobbin** |
| Cleanness (Pt 8) | **Re-uses the same 20 seriplane panels** |
| Neatness & low neatness (Pt 9) | **Re-uses the same 20 seriplane panels** |
| Tenacity & elongation (Pt 10) | One sizing skein from each of the 10 bobbins, with a **strand count that varies by denier** (e.g. **400 strands** for up to 1.4 tex / 13 d) |
| Cohesion (Pt 11) | **10 test pieces** from the 10 bobbins, from portions free of cleanness or pronounced evenness defects; the tester frictions the thread at **20 places simultaneously** under **180 g** total tension |

**FAO/ISA variant [F, S5]** (relevant if a report says "ISA method"): lot 5–10 bales of 60 kg or 20 bales of 30 kg; **50 skeins** drawn if fine (<120 g), **25 skeins** if coarse (>120 g); conditioned-weight test conditions skeins 12 h, then 20 skeins weighed individually, 2 dried at 140 °C, repeat if the two results differ by >0.5%; size deviation uses **200 skeins × 450 m** (fine) or **400 skeins × 112.5 m** (coarse), weighed in **10 separate lots**; evenness compares **100 panels** of 127 × 457 mm at 2 m viewing distance; cleanness/neatness inspected at 0.5 m.

### 8.2 Replicate / repeat / averaging rules (the actual business logic)

| Rule | Detail |
|---|---|
| **Two-set agreement then average** (conditioned mass) | m₁ and m₂ computed separately; **average m** taken; **"If the two results vary by more than 0.5 percent, the test shall be repeated."** **[F, S4]** (FAO states the same 0.5% rule **[F, S5]**) |
| **Dry-to-constant-mass loop** | Dry 15 min, weigh to 0.1 g; dry another 5 min, weigh. Second weighing is the oven-dry mass **only if** loss between first and second ≤ **0.25%** of the first weight; otherwise keep drying and weighing at **5-min intervals** until successive loss ≤0.25%. (Part 6 uses a 10-min first dry.) **[F, S4]** |
| **Many individual weights → statistics** | 40 (or 80) individual sizing-skein denier values → **average size (M)**, **standard deviation** (computed via a frequency-distribution table — IS even prints the worked example with frequency Fᵢ, deviation dᵢ, Fᵢdᵢ, Fᵢdᵢ²), and **maximum deviation** from the **4 coarsest and 4 finest** (or **8 and 8** for coarse silk) **[F, S4]** |
| **Count-based results** | Winding: total breaks + **cause of each break recorded** **[F, S4, S10]**. Cohesion: strokes at 20 friction points, averaged over 10–20 test pieces, **rounded to integer** **[F, S4, S5]** |
| **Panel-based ordinal results** | Evenness: stripe counts bucketed into **I / II / III**; Cleanness: **% = 100 − Σ(1.0% × super-major + 0.4% × major + 0.1% × minor)**; Neatness: each panel rated against photos, then **average neatness** and **low neatness = mean of the lowest-scoring one-fifth of panels** **[F, S4, S5]** |
| **The 7% re-test bomb** | *"In case the results of 'Conditioned Size Test' differ from the size marked on the bales by more than **7 percent** either way, the results of **all** the tests …, except the 'Conditioned Size Test' **shall be discarded**. Further, taking the results of the 'Conditioned Size Test' as the basis, **all tests, including the 'Conditioned Size Test', shall be repeated** and 'Grading Certificate' shall be issued on the basis of result of the repeat tests."* **[F, S4]** |
| **Grade computation is two-stage** | (1) **Major tests** set a provisional grade = the **lowest** grade among size deviation, evenness I, evenness II, cleanness, average neatness, low neatness (plus **maximum deviation** for Category III). If any result falls below a grade's limits, the lot is **degraded to the lowest grade in which that value appears**. (2) **Auxiliary tests** (max deviation, evenness III, winding, tenacity, elongation, cohesion) then **lower the provisional grade by the number of class differences**, with a cap: *"any difference of more than one class shall be deemed as one class difference"* for max deviation and evenness III (per category). **[F, S4]** |
| **Category drives which tests apply** | Category I ≤2.0 tex (18 d); Category II 2.1–3.6 tex (19–33 d); Category III ≥3.7 tex (34 d). **Cohesion is only evaluated if the marked size is ≤33 d.** Grade scale **4A, 3A, 2A, A, B, C, D, E** (4A highest). **[F, S4]** |
| **Standard atmosphere + 24 h pre-conditioning** | Winding, size, seriplane, serigraph, cohesion all require **65 ± 2% RH and 27 ± 2 °C**, with the sample conditioned to moisture equilibrium for **24 h** first. **[F, S4]** (Note: **27 °C**, the Indian variant — ISO/ASTM use 20 °C; IS 832-2:2011 explicitly says the 20 °C international figure *"is not suitable for Indian conditions"* **[F]**) |

### 8.3 Actual observed throughput (use for SLA fields and capacity planning)
**[F, S10]** RSTRS Kancheepuram Limited-test process map, in order: *Collection of silk samples from Anna Silk Exchange → Loading of silk samples into winding machine (70 min) → Wrap-reel winding of silk samples, 225 m (cottage basin) / 450 m (multiend) → **Kilcha making – manual** → Denier test using computer software → Reports print out → Submission of reports to the customer.*
Reference table (their published SLA):

| Lots in batch | Workers | Winding m/cs | Wrap reels | PCs for denier | Est. throughput (min) |
|---|---|---|---|---|---|
| 1–5 | 2 | 1 | 1 | 1 | 120 |
| 5–10 | 2 | 1 | 1 | 1 | 160 |
| 11–15 | 4 | 2 | 2 | 2 | 200 |
| 15–20 | 4 | 2 | 2 | 2 | 230 |
| 21–25 | 6 | 3 | 3–4 | 3 | 200 |
| 26–30 | 4–6 | 2–3 | 2–4 | 3 | 240–280 |

**[F, S10]** *"Twenty samples in each lot are weighed on a scale for finding out test results."* → **20 readings → 1 lot result**, done on a PC with *"inbuilt software"*.
**[F, S8]** Official CSB service standard for mechanical & chemical testing: **2–3 days**, *"depending upon no. of samples and type of tests"*. Pre-shipment inspection: **2 days**.
**[F, S2]** Tatkal: **same day**, ≤5 samples, booked before 11 AM, only tests completable in ≤6 h, **double charge**.

---

## 9. Things a naive developer would completely miss

1. **The unit result belongs to a LOT, not to a sample container.** One lot yields dozens of physical sub-items (bales → books → skeins → bobbins → sizing skeins → panels → test pieces) and each level generates its own readings. You need at least: `lot → sample_item → test_run → reading`, with reading counts of 6, 10, 20, 40 or 80. A flat "sample has result" schema will fail on day one. **[F, S4]**
2. **Downstream tests re-use the same physical sub-samples.** 10 bobbins from the winding test feed size, evenness, tenacity and cohesion. The 20 seriplane panels serve evenness, cleanness AND neatness. So a "test order" for grading is a **dependency graph with shared intermediates**, not independent line items. If the customer orders only cleanness, you still have to do winding and seriplane winding first. **[F, S4]**
3. **A result can be invalidated by another result.** The 7%-conditioned-size rule discards every other test and forces a full repeat. Your schema needs `test_run.status ∈ {valid, discarded, repeat}` plus a `superseded_by` link, and the certificate must be issued from the repeat run. **[F, S4]**
4. **Grade is computed, not entered — by a two-stage major/auxiliary algorithm with a capping rule.** Nobody types "3A". The engine reads 12 characteristics against category-specific classification tables, takes the worst major grade, then subtracts auxiliary class differences (capped at 1 for max-deviation / evenness III). Get the tables in as reference data with an effective-date, because they differ between BIS and ISA. Note also: *"the values in respect of maximum deviation for various grades are different than those specified in International Silk Association Standards"* — **BIS deliberately diverges from ISA**, based on a CSTRI study of Indian lots. **[F, S4]**
5. **Two units of measure coexist everywhere: tex and denier.** IS prints both throughout (2.0 tex or 18 denier). Trade talks denier; the standard prefers tex. Store both, or store one and always render both. Also `g/tex` vs `g/denier` for tenacity. **[F, S4]**
6. **Denier is a *range nomenclature* in trade: "18/20", "20/22", "22/24".** Not a scalar. **[F, S3]**
7. **The declared/marked size on the bale is an input that the test can contradict** — and the discrepancy has legal/commercial consequences. Same for the sender's declaration of variety and adulteration. **[F, S4]**
8. **Preliminary examination can REJECT a lot before any test happens.** *"Lot accepted/rejected for grading"* with reasons including *"Admixture of commercial varieties"* and *"Adulteration in any manner"*. A rejected lot still consumed counter time and may still be billable. **[F, S4]**
9. **"Conditioning" ≠ "conditioning".** The word means two different things in the same building: (a) commercial **conditioned mass** = oven-dry + 11%; (b) **pre-conditioning** a specimen for 24 h at 65% RH / 27 °C before a physical test. Two different concepts, two different data structures. Do not let them share a field name. **[F, S4]**
10. **The 11% regain is a constant of trade, but the oven temperature (140 °C) and the 0.25%/0.5% convergence thresholds are also standards constants.** Put all of them in configurable reference data with an effective date, not in code. **[F, S4]**
11. **Tare is itemised and computed, not weighed as a whole**: 'shirt' + wrapping papers/labels of 5 books + middle cotton bands of 5 books × 3, scaled to n books. Skein lacings are exempt from tare **if ≤1 metre per skein**. This is a small arithmetic form the software must reproduce line by line, because the customer will audit it. **[F, S4]**
12. **Price depends on WHO the customer is and WHAT MACHINE made the silk**, not just on the test: bivoltine vs other (₹1000 vs ₹500); indigenous ARM vs other (₹1100 vs ₹2000); handloom weaver vs trader (₹1000/1500 vs ₹2500); TN co-operative rates; Govt vs Private. You need a `customer_class` and a `rate_card(test, class, effective_from)` table. **[F, S1, S2]**
13. **"Tatkal" = double price, same-day, cap of 5 samples, cut-off 11:00, only for ≤6-hour tests.** A rush-order flag with hard eligibility rules. **[F, S2]**
14. **Zero-charge advisory testing is a first-class workflow**, not an edge case: in-house research samples and sub-unit samples are tested on advisory basis. They still consume capacity and still need reports and traceability — they just do not raise an invoice. **[F, S2, S3]**
15. **Inter-unit referral with split economics**: sample arrives at Dharmavaram, testing physically happens at TTL Bengaluru, **but the charge is collected at Dharmavaram**. So `receiving_unit ≠ testing_unit ≠ billing_unit`. Kancheepuram even reports "TTL–physical" and "TTL–chemical" as its own test categories. **[F, S3]**
16. **Rate cards are versioned with visible old/new columns and an effective date** (*w.e.f. 01.12.2023*). Historical invoices must reprint at the rate in force on their date. **[F, S1]**
17. **GST is dual-mode**: CGST 9% + SGST 9% intra-state, IGST 18% inter-state, and CSB actually tracks and reports these separately per month. Place of supply logic is required. **[F, S15]**
18. **Some services are priced on consignment VALUE, not on work done** (pre-shipment inspection, ₹200–₹700 by ₹1 L–₹5 L+ bands). Some are priced per measurement point (zari XRF, ₹75/point). Some are annual machine rentals. Some are per 1000 cocoons. The "test" abstraction alone cannot express the price list. **[F, S1, S8]**
19. **Report content is partly narrative and mandated**: exceptional defects, break causes and their frequency, and visual ratings like 'Fair' *must* be mentioned in the certificate. A pure numbers-only report generator is non-compliant. **[F, S4]**
20. **Sample custody and disposal are policy, not an afterthought**: unclaimed samples *"may be disposed of as per laboratory protocols"*; after cancellation the customer must arrange collection at their own cost; refunds only before processing starts, T+1 settlement. You need sample states: received → accepted/rejected → in-test → tested → retained → claimed/returned/disposed, with a retention clock. **[F, S9]**
21. **Physical vs Chemical are separate registers.** The revenue sheet counts **PTS/PTA/CTS/CTA** and **"No. of lots"** as different quantities in the same month; the rate card is split into Physical / Chemical / Eco sections; the microscopy line says *"both PT/CT sections"*. **[I]** These look like separate sample-numbering series per division (PT = Physical Testing, CT = Chemical Testing). **[U]** confirm what PTS/PTA/CTS/CTA expand to — likely Sample/Advisory per division — before designing the numbering scheme.
22. **Lots and samples are counted differently and both are reported.** Annual reports say "tested **11,294 samples**" for one unit and "tested **13,438 lots**" for another; the revenue sheet has a "No. of lots" column alongside sample counts. Statutory reporting needs BOTH counters. **[F, S3, S15]**
23. **Physical test length differs by reeling technology in local practice**: cottage-basin sizing skeins ~225 m vs multiend 450 m, whereas IS prescribes 450 m for ≤33 d. So the effective test recipe varies by sample provenance. Make the recipe parameters (length, revolutions, speed, duration) data, not constants. **[F, S10 vs S4]**
24. **"Kilcha" and other local vocabulary will appear in the UI.** Kilcha = the small test skein (manual slight-twist step, historically the throughput bottleneck; CSTRI designed an "Automatic skeining (Kilcha) machine" to cut it by 40%). Also expect: chop, mark, shirt, book, bundle, swift, wrap reel, seriplane, serigraph, Duplan, charkha, cottage basin, multiend, ARM, MRM, GCM, DOS. **[F, S10, S4, S3]**
25. **The unit is not only a lab.** The same rate card sells **machine rentals per year**, **warping charges per warp**, **cocoon stifling per 1000**, and **test-dyeing**; and the unit also runs trainings (with fees ₹500–₹15,000), demonstrations, awareness programmes, field visits, post-dispatch inspection of ARM/MRM units under central schemes, and adoption/mentoring of reeling units. If the software only models tests, it models maybe 60% of the unit's chargeable and reportable activity. **[F, S1, S3, S8]**
26. **Annual-report obligations shape the data model.** Every unit must publish a table of *test name × number* plus revenue, by financial year, plus counts of trainings/demonstrations/participants/field visits. Build these as first-class reports, or the scientist will keep a parallel Excel sheet forever. **[F, S3]**
27. **Grading results feed a price, sometimes an auction floor price the same day.** At Kancheepuram the denier test exists *for auction purpose and price fixation* for the exchange. That makes turnaround a commercial constraint, not a nicety, and it makes the report a document other parties act on financially. **[F, S10]**
28. **NABL scope is a per-lab, per-test attribute.** Only TTL Bengaluru is accredited under TC-14590. Printing an accreditation claim on a non-accredited unit's report is a compliance problem. **[F, S12] + [I]**
29. **Reference "Official Standard Photographs" are part of the method.** Evenness, cleanness and neatness are judged against photograph sets *"prepared by the Silk Conditioning Houses of Yokohama and Kobe, Japan and officially adopted in 1962 by the International Silk Association"*. The neatness set is discrete: 100, 90, 80, 70, 60, 50, 30, 10. So the neatness input control is an **enumerated picker, not a free number** — and FAO adds the rounding convention (100–50% to the nearest 5%, below 50% to the nearest 10%). **[F, S4, S5]**
30. **Water and dye/chemical testing are part of the same lab.** "Reeling water analysis" (hardness/pH/TDS, IS 3025) and soap/dye analysis sit in the same rate card and the same annual-report table as silk tests. Dharmavaram did 54 water tests in 2021-22. Non-textile sample types must exist in the model. **[F, S1, S3, S8]**

---

## 10. Gaps to close with the scientist before writing the spec

| # | Question | Why it matters |
|---|---|---|
| 1 | Scans of a real **Limited Test report**, a **Grading Certificate**, a **conditioned-mass report** and a **tax invoice** from Dharmavaram | Only way to fix exact field lists, letterhead, numbering format and signatory block |
| 2 | Do you still issue **conditioned-mass / weight certificates**? Volume? Billed under which head? | Section 3.5 — the module's priority depends entirely on this |
| 3 | What are the **document numbering series** (per year? per unit? per division PT/CT? prefix format?) and do you have a legacy series to continue? | Cannot retrofit numbering later |
| 4 | Confirm **PTS / PTA / CTS / CTA** expansions | Register design |
| 5 | Where do samples come from at Dharmavaram — **Government Cocoon Market? a silk exchange? DoS?** Is there a scheduled daily intake, and is there a per-channel rate (cf. "denier test through Anna Exchange")? | Batch-intake UX and pricing |
| 6 | Do you receive **court / legal / arbitration referrals**, and **Silk Mark** authentication samples? Chargeable? | Unverified channels |
| 7 | Is the unit **NABL-accredited**? If not, what compliance statements go on reports? | Legal exposure on printed output |
| 8 | Is **Tatkal** actually used at Dharmavaram? | Rush-order feature scope |
| 9 | What existing software/spreadsheets are in use — especially the **"inbuilt denier software"** on the test PCs, and whether it can export | Integration vs re-implementation of the size-deviation statistics |
| 10 | Current rate card **later than 01.12.2023**? | Pricing correctness on day one |
| 11 | Does the unit issue **cocoon** reports and **zari** reports locally, or refer them? | Module scope |
| 12 | Which non-testing chargeables apply here (machine rent, warping, test-dyeing, training fees)? | Whether CloudZoo's invoicing needs non-test SKUs |