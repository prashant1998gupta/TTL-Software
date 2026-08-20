# Trying the system out — a guide for the laboratory

Written for a person, not a programmer. If you can use WhatsApp, you can do everything
on this page. Set aside about **30 minutes**.

## What this is, in one paragraph

This is the software that replaces the laboratory's paper sample register. A sample is
received at the counter and gets its number from the system, so two people can never give
out the same number. The tester types the twenty weights straight from the balance — no
calculator, the arithmetic is done for them. A second person checks. The In-Charge signs.
The certificate that comes out is a computer-signed document with a QR code on it, and
**anyone who scans that code sees at once whether the certificate is genuine** — no
phone calls, no doubt.

## Before you start

One thing is technical and is **not your job**: preparing the computer (about 15 minutes,
done once). Prashant does that part. When it is done, he will give you:

- an address to open (like an internet page), and
- four practice sign-ins: **lakshmi** (counter), **ravi** (tester), **suma** (checker),
  **incharge** (In-Charge) — password **dvm** for all four.

These four are pretend staff for practice. The real accounts are made later, by you,
inside the system.

---

## The test — one sample's whole journey

You will play all four people, one after another. Sign out (top-right) and sign back in
as the next person each time.

### 1. At the counter — as **lakshmi**

1. Open **Register a sample**.
2. Fill it like a real walk-in: customer name (try any name — even a Telugu one),
   lot mark (whatever is marked on the bales, e.g. `TEST-1`), declared denier `20/22`,
   2 bales, 47 books, and the test **Limited test (5 skein)**.
3. Press **Register**.

**What you should see:** a green box with a number like `DVM/26-27/00417`, and below it
an acknowledgement slip with a small QR square — the slip the customer takes home.
Press **Print slip** if a printer is attached.

### 2. At the bench — as **ravi**

1. Open **Today's work** — your sample is there. Click its number.
2. Choose the balance. **Notice BAL-2 cannot be chosen** — its calibration has expired.
   That is not a fault; that is the system protecting you. Choose BAL-1 and press
   **Start test**.
3. Type these twenty weights, pressing **Enter** after each one:

   | | | | | |
   |---|---|---|---|---|
   | 1.048 | 1.052 | 1.041 | 1.061 | 1.055 |
   | 1.049 | 1.038 | 1.057 | 1.044 | 1.050 |
   | 1.046 | 1.059 | 1.043 | 1.054 | 1.051 |
   | 1.047 | 1.056 | 1.042 | 1.053 | 1.045 |

**What you should see:** as you type, the average denier and the deviation appear by
themselves — around **20.99** and **0.12**. No calculator anywhere. Press **Save
readings and submit for verification**.

### 3. The second pair of eyes — as **suma**

Open the sample from **Today's work**. The numbers are shown for checking. Press
**Verify — the numbers are right**.

*(If you are curious: sign in as ravi instead and try to verify. The system refuses —
the person who did the test is never allowed to pass their own work.)*

### 4. The signature — as **incharge**

Open the sample and press **Sign and issue**.

**What you should see:** a report number like `DVM/R/26-27/00315`, a button to download
the certificate, and a verify link. Open the certificate — the heading, the Telugu, the
results, the QR code at the bottom left.

### 5. The customer's check — your own phone

Point your phone's camera at the QR code on the certificate (on screen is fine).

**What you should see:** a page saying **GENUINE — CURRENT**, with the report number,
the customer, the lot — but **not the results**. The results belong to the customer who
paid; the page only proves the paper is real.

### 6. The mistake — the most important test of all

Suppose a weight was typed wrong and the certificate has already gone out. On paper this
is where trouble starts. Here:

1. As **incharge**, open the sample and press **Amend — back to the bench**, and give the
   reason (e.g. *skein 5 was mistyped*). The reason is compulsory — the system will not
   take an amendment without one.
2. As **ravi**, re-enter the weights (change one — try `1.062` for skein 5) and submit.
3. As **suma**, verify. As **incharge**, sign and issue again.
4. Now scan the QR on the **old** certificate.

**What you should see:** **GENUINE — SUPERSEDED**, and the page itself tells you the
number of the certificate that replaced it. The old paper can never quietly circulate
as if it were still good — and the new certificate says on its face what it replaced
and why.

### 7. The books

Open **Sample register** — the month's intake, exactly like the paper book, with a
**Download CSV** button that opens in Excel for the monthly return. Open **Day sheet** —
today's samples, today's fees, what is still on the bench.

---

## Things to try to break (please do)

- Enter only 19 weights — it refuses, and says why.
- Try to verify your own work — refused.
- Try to pick the expired balance — it cannot be picked.
- Close the browser in the middle of anything — nothing is lost; sign back in.
- Type a customer name in Telugu — it appears correctly everywhere, including on the
  signed certificate.

If anything behaves differently from what this page says, write down what you did and
what you saw, and tell Prashant. That is exactly what testing is.

## When this becomes real — three things only the laboratory can supply

1. **The last numbers in the paper registers** — the last sample number and the last
   report number actually used. The system asks for them on its very first screen and
   continues the series; it refuses to guess.
2. **One filled copy of every paper form and register** in use today, and about twenty
   completed old worksheets with their hand-calculations — the system's arithmetic is
   tested against them.
3. **The laboratory's signing certificate from the Central Silk Board** — until it is
   installed, the system signs with a practice key marked NOT FOR ISSUE, and no real
   certificate should be given to a customer.
