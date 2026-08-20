'use strict';
/**
 * The registers — what the laboratory is judged on. The sample register
 * replaces the intake book; the day sheet is the daily collection register.
 * Both print, and both export as CSV for the monthly return to headquarters,
 * because a register that needs re-typing into Excel will be bypassed.
 */
const express = require('express');
const { pool } = require('./db');
const { requireUser } = require('./auth');
const { page, esc } = require('./views/layout');

const router = express.Router();

// Server-LOCAL dates. toISOString() is UTC, which after 05:30 IST is
// yesterday — the day sheet would open on the wrong day every morning.
const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const monthOf = (q) => /^\d{4}-\d{2}$/.test(String(q)) ? String(q) : localDate().slice(0, 7);

async function registerRows(month) {
  const { rows } = await pool.query(
    `SELECT s.sample_no, to_char(s.registered_at,'YYYY-MM-DD') AS d, s.customer_name, s.lot_mark,
            s.declared_denier, s.test_name, s.fee_rupees, s.status,
            r.report_no, to_char(r.issued_at,'YYYY-MM-DD') AS issued
       FROM txn_sample s LEFT JOIN txn_report r
         ON r.sample_id = s.id AND r.status IN ('CURRENT','WITHDRAWN')
      WHERE to_char(s.registered_at, 'YYYY-MM') = $1
      ORDER BY s.sample_no`, [month]);
  return rows;
}

router.get('/register', requireUser(), async (req, res) => {
  const month = monthOf(req.query.m);
  const rows = await registerRows(month);
  const fees = rows.reduce((n, r) => n + Number(r.fee_rupees), 0);
  const trs = rows.map((r) => `
<tr><td>${esc(r.sample_no)}</td><td>${esc(r.d)}</td>
<td>${esc(r.customer_name)}</td><td>${esc(r.lot_mark)}</td><td>${esc(r.test_name)}</td>
<td style="text-align:right">${Number(r.fee_rupees)}</td>
<td>${esc(r.status)}</td><td>${esc(r.report_no || '—')}</td></tr>`).join('');
  res.send(page({ title: 'Sample register', user: req.user, active: '/register', body: `
<h2>Sample register — ${esc(month)}</h2>
<p class="hint">The intake register, as the paper book kept it: every sample of the month in
number order, with its fee and the report that answered it.</p>
<div class="actions no-print" style="margin-top:0">
  <form method="get" action="/register" class="inline">
    <input type="month" name="m" value="${esc(month)}"><button class="btn ghost sm">Show</button></form>
  <a class="btn ghost sm" href="/register.csv?m=${esc(month)}">Download CSV</a>
  <button class="btn ghost sm" onclick="window.print()">Print</button>
</div>
<div class="scrollx"><table>
<thead><tr><th>Number</th><th>Date</th><th>Customer</th><th>Lot</th><th>Test</th>
<th style="text-align:right">Fee ₹</th><th>Status</th><th>Report</th></tr></thead>
<tbody>${trs || '<tr><td colspan="8" style="color:var(--mute)">No samples this month.</td></tr>'}</tbody>
<tfoot><tr><td colspan="5" style="text-align:right"><b>Total fees</b></td>
<td style="text-align:right"><b>${fees}</b></td><td colspan="2">${rows.length} samples</td></tr></tfoot>
</table></div>`}));
});

// Quoting alone does not stop a spreadsheet evaluating a cell that BEGINS
// with = + - @ — a walk-in customer's "name" of =HYPERLINK(...) would run at
// headquarters when the monthly CSV is opened. A leading apostrophe makes
// Excel treat it as text; honest data never starts with those characters.
// Module-scope and exported, so the test exercises THIS function and not a
// re-implementation of it.
function csvField(v) {
  let t = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(t)) t = "'" + t;
  return `"${t.replace(/"/g, '""')}"`;
}

router.get('/register.csv', requireUser(), async (req, res) => {
  const month = monthOf(req.query.m);
  const rows = await registerRows(month);
  const q = csvField;
  const csv = ['sample_no,date,customer,lot_mark,declared_denier,test,fee_rupees,status,report_no,issued']
    .concat(rows.map((r) => [r.sample_no, r.d, r.customer_name, r.lot_mark,
      r.declared_denier, r.test_name, r.fee_rupees, r.status, r.report_no || '',
      r.issued || ''].map(q).join(',')))
    .join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="sample-register-${month}.csv"`);
  res.send('﻿' + csv); // BOM so Excel opens the Telugu correctly
});

router.get('/day', requireUser(), async (req, res) => {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(String(req.query.d)) ? String(req.query.d)
    : localDate();
  const reg = (await pool.query(
    `SELECT count(*)::int AS n, coalesce(sum(fee_rupees),0)::numeric AS fees
       FROM txn_sample WHERE registered_at::date = $1`, [d])).rows[0];
  const iss = (await pool.query(
    `SELECT count(*)::int AS n FROM txn_report WHERE issued_at::date = $1`, [d])).rows[0];
  const pend = (await pool.query(
    `SELECT status, count(*)::int AS n FROM txn_sample
      WHERE status NOT IN ('ISSUED','WITHDRAWN') GROUP BY status ORDER BY status`)).rows;
  res.send(page({ title: 'Day sheet', user: req.user, active: '/day', body: `
<h2>Day sheet — ${esc(d)}</h2>
<p class="hint">The daily collection register, and what is still on the bench.</p>
<div class="actions no-print" style="margin-top:0">
  <form method="get" action="/day" class="inline">
    <input type="date" name="d" value="${esc(d)}"><button class="btn ghost sm">Show</button></form>
  <button class="btn ghost sm" onclick="window.print()">Print</button>
</div>
<div class="calc" style="margin-bottom:18px">
  <div><div class="k">Samples received</div><div class="v">${reg.n}</div></div>
  <div><div class="k">Fees for the day</div><div class="v">₹${Number(reg.fees)}</div></div>
  <div><div class="k">Reports issued</div><div class="v">${iss.n}</div></div>
</div>
<div class="card"><b>Still open</b>
<div class="scrollx" style="margin-top:10px"><table>
<thead><tr><th>Status</th><th>Samples</th></tr></thead>
<tbody>${pend.map((p) => `<tr><td>${esc(p.status)}</td><td>${p.n}</td></tr>`).join('')
  || '<tr><td colspan="2" style="color:var(--mute)">Nothing pending — the bench is clear.</td></tr>'}</tbody>
</table></div></div>`}));
});

module.exports = router;
module.exports.csvField = csvField;
