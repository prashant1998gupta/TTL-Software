'use strict';
/**
 * The PUBLIC verification service — deliberately its own process (ARC-03):
 * it reads ONLY sys_published_verification, holds no results, no customer
 * addresses and no files, and shares nothing with the internal app but the
 * database row that was published at issue. In production it runs on the small
 * internet host; the internal server never accepts a connection from outside.
 *
 * An anonymous scan answers one question — is this certificate genuine and
 * current? — and shows only what identifies the certificate (M9 tiered
 * disclosure). The results themselves are not here to leak.
 */
const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({ host: process.env.PGHOST || '/tmp', database: process.env.LIMS_DB || 'ttl_lims' });
const app = express();

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function shell(body) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Certificate verification — Silk Testing Laboratory, Dharmavaram</title>
<style>
body{margin:0;background:#f2efea;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#15120f}
.wrap{max-width:560px;margin:0 auto;padding:34px 20px}
.head{text-align:center;margin-bottom:20px}
.head .te{color:#4d443c;font-size:13.5px}
.head h1{font-size:19px;margin:4px 0 0}
.card{background:#fff;border:1px solid #ded5c8;border-radius:14px;padding:26px;text-align:center}
.v{font-size:21px;font-weight:800;border-radius:12px;padding:16px;margin-bottom:20px}
.v.ok{background:#eaf2ec;color:#3f6146}
.v.bad{background:#fceceb;color:#9e2b25}
.v small{display:block;font-weight:500;font-size:13px;margin-top:4px}
.kv{display:grid;grid-template-columns:130px 1fr;gap:8px 14px;text-align:left;font-size:14.5px}
.kv .k{color:#82776c;font-weight:600}
.mono{font-family:ui-monospace,Menlo,monospace;font-size:11px;word-break:break-all;color:#82776c;margin-top:18px;text-align:left}
.note{font-size:12.5px;color:#82776c;margin-top:18px}
</style></head><body><div class="wrap">
<div class="head"><div class="te">కేంద్రీయ పట్టు మండలి · Central Silk Board</div>
<h1>Silk Testing Laboratory, Dharmavaram — certificate check</h1></div>${body}</div></body></html>`;
}

app.get('/v/:token', async (req, res) => {
  let rows;
  try {
    ({ rows } = await pool.query(
      `SELECT * FROM sys_published_verification WHERE verify_token=$1`, [req.params.token]));
  } catch (err) {
    // The public page never explains itself. A database fault is logged for the
    // laboratory and the visitor is asked to try again — no stack, no detail.
    console.error('verify lookup failed:', err.message);
    return res.status(503).send(shell(`<div class="card">
<div class="v bad">TEMPORARILY UNAVAILABLE<small>The check could not be completed. Please try
again in a few minutes, or contact the laboratory.</small></div></div>`));
  }
  if (!rows.length) {
    return res.status(404).send(shell(`<div class="card">
<div class="v bad">NOT RECOGNISED<small>No certificate matches this code. Treat the document with suspicion
and contact the laboratory.</small></div></div>`));
  }
  const r = rows[0];
  const ok = r.status === 'CURRENT';
  res.send(shell(`<div class="card">
<div class="v ${ok ? 'ok' : 'bad'}">${ok ? 'GENUINE — CURRENT' : 'GENUINE — WITHDRAWN'}
<small>${ok
    ? 'This certificate was issued by the laboratory and has not been amended or withdrawn.'
    : 'This certificate WAS issued by the laboratory but has since been WITHDRAWN. Do not rely on it; contact the laboratory.'}</small></div>
<div class="kv">
  <div class="k">Report No.</div><div>${esc(r.report_no)}</div>
  <div class="k">Sample No.</div><div>${esc(r.sample_no)}</div>
  <div class="k">Lot mark</div><div>${esc(r.lot_mark)}</div>
  <div class="k">Customer</div><div>${esc(r.customer_name)}</div>
  <div class="k">Test</div><div>${esc(r.test_name)}</div>
  <div class="k">Issued on</div><div>${new Date(r.issued_on).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
</div>
<div class="mono">Document fingerprint (SHA-256): ${esc(r.pdf_sha256)}<br>
Compare with the fingerprint printed on the certificate; they must match exactly.</div>
<div class="note">The test results themselves are not shown here. The customer holds the certificate;
this page only confirms it is real. — ఫలితాలు ఇక్కడ చూపబడవు; ఈ పేజీ ధృవపత్రం నిజమైనదని మాత్రమే నిర్ధారిస్తుంది.</div>
</div>`));
});

const PORT = process.env.VERIFY_PORT || 8788;
app.listen(PORT, () => console.log(`Public verification: http://localhost:${PORT}`));
