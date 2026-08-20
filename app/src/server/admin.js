'use strict';
/**
 * Administration: users, equipment, the test catalogue. Signatory/admin only.
 *
 * These screens exist so that go-live and every day after it need NO psql:
 * real accounts are created here (and the seeded development ones deactivated),
 * a new balance is added here, a calibration is recorded here, a rate is
 * changed here — each with the audit trail carrying who and when.
 */
const express = require('express');
const crypto = require('node:crypto');
const { pool, tx } = require('./db');
const { requireUser, hashPassword } = require('./auth');
const audit = require('./audit');
const { page, esc } = require('./views/layout');

const router = express.Router();
router.use(requireUser('signatory'));
// Every :id below is a bigint column; garbage must 404, not stack-trace.
router.param('id', (req, res, next, id) => /^\d+$/.test(id) ? next() : res.status(404).send('Not found'));

const ROLES = ['counter', 'tester', 'verifier', 'signatory'];
// 'admin' is deliberately NOT mintable from this screen: a signatory creating
// accounts must not be able to hand out a role above their own.

const dt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

router.get('/', async (req, res) => {
  const users = (await pool.query(`SELECT * FROM mst_user ORDER BY id`)).rows;
  const eqs = (await pool.query(
    `SELECT *, to_char(calibrated_to,'YYYY-MM-DD') AS cal_str FROM mst_equipment ORDER BY code`)).rows;
  const tests = (await pool.query(`SELECT * FROM mst_test ORDER BY id`)).rows;
  const today = new Date().toISOString().slice(0, 10);

  const userRows = users.map((u) => `
<tr><td><b>${esc(u.username)}</b></td><td>${esc(u.full_name)}${u.full_name_te ? `<div style="font-size:12px;color:var(--mute)">${esc(u.full_name_te)}</div>` : ''}</td>
<td>${esc(u.role)}</td>
<td>${u.is_active ? '<span class="badge b-VERIFIED">active</span>' : '<span class="badge b-WITHDRAWN">inactive</span>'}</td>
<td><form method="post" action="/admin/user/${u.id}/toggle" style="display:inline">
  <button class="btn ghost sm">${u.is_active ? 'Deactivate' : 'Reactivate'}</button></form>
<form method="post" action="/admin/user/${u.id}/reset" style="display:inline;margin-left:6px">
  <button class="btn ghost sm">Reset password</button></form></td></tr>`).join('');

  const eqRows = eqs.map((e) => {
    // pg returns DATE as a JS Date; comparing String(Date) against ISO text
    // showed every expired balance as valid. to_char in the query instead.
    const ok = e.is_in_service && e.cal_str >= today;
    return `
<tr><td><b>${esc(e.code)}</b></td><td>${esc(e.name)}</td>
<td>${dt(e.calibrated_to)} ${ok ? '<span class="badge b-VERIFIED">valid</span>' : '<span class="badge b-WITHDRAWN">expired</span>'}</td>
<td><form method="post" action="/admin/equipment/${e.id}/calibrate" class="inline">
  <input type="date" name="calibrated_to" required style="max-width:170px">
  <button class="btn ghost sm">Record calibration</button></form></td></tr>`;
  }).join('');

  const testRows = tests.map((t) => `
<tr><td><b>${esc(t.code)}</b></td><td>${esc(t.name)}</td>
<td><form method="post" action="/admin/test/${t.id}/fee" class="inline">
  <input name="fee" value="${Number(t.fee_rupees)}" inputmode="decimal" style="max-width:90px">
  <button class="btn ghost sm">Set fee</button></form></td>
<td>${t.readings_required}</td>
<td>${t.is_accredited ? 'Accredited' : 'Non-NABL'}</td>
<td><form method="post" action="/admin/test/${t.id}/toggle" style="display:inline">
  <button class="btn ghost sm">${t.is_active ? 'Retire' : 'Restore'}</button></form></td></tr>`).join('');

  res.send(page({ title: 'Administration', user: req.user, active: '/admin', body: `
<h2>Administration</h2>
<p class="hint">Accounts, balances and the catalogue — the master data one person must own.
Every change here lands in the audit trail.</p>

<div class="card"><b>People</b>
<div class="scrollx" style="margin-top:12px"><table>
<thead><tr><th>Username</th><th>Name</th><th>Role</th><th>Status</th><th></th></tr></thead>
<tbody>${userRows}</tbody></table></div>
<details style="margin-top:14px"><summary style="cursor:pointer">Add a person</summary>
<form method="post" action="/admin/user" style="margin-top:12px">
  <div class="row"><label>Username</label><input name="username" required></div>
  <div class="row"><label>Full name</label><input name="full_name" required></div>
  <div class="row"><label>Name in Telugu<span class="sub">Optional; appears on certificates they sign</span></label><input name="full_name_te"></div>
  <div class="row"><label>Role</label><select name="role">
    <option value="counter">counter</option><option value="tester">tester</option>
    <option value="verifier">verifier</option><option value="signatory">signatory</option></select></div>
  <div class="actions"><button class="btn sm">Add — a first password is generated and shown once</button></div>
</form></details></div>

<div class="card"><b>Balances</b>
<div class="scrollx" style="margin-top:12px"><table>
<thead><tr><th>Code</th><th>Name</th><th>Calibrated to</th><th></th></tr></thead>
<tbody>${eqRows}</tbody></table></div>
<details style="margin-top:14px"><summary style="cursor:pointer">Add a balance</summary>
<form method="post" action="/admin/equipment" style="margin-top:12px">
  <div class="row"><label>Code</label><input name="code" required placeholder="BAL-3"></div>
  <div class="row"><label>Name</label><input name="name" required></div>
  <div class="row"><label>Calibrated to</label><input type="date" name="calibrated_to" required></div>
  <div class="actions"><button class="btn sm">Add</button></div>
</form></details></div>

<div class="card"><b>Test catalogue</b>
<p class="hint" style="margin-bottom:0">A new item is Non-NABL until the Quality Manager maps it
to a scope annexure row (M8-72) — there is deliberately no switch for that here.</p>
<div class="scrollx" style="margin-top:12px"><table>
<thead><tr><th>Code</th><th>Test</th><th>Fee ₹</th><th>Readings</th><th>Scope</th><th></th></tr></thead>
<tbody>${testRows}</tbody></table></div></div>`}));
});

router.post('/user', async (req, res) => {
  const pw = crypto.randomBytes(6).toString('base64url');
  const salt = crypto.randomBytes(16).toString('hex');
  await tx(async (c) => {
    const role = String(req.body.role);
    if (!ROLES.includes(role)) throw new Error('role not permitted');
    await c.query(
      `INSERT INTO mst_user (username, full_name, full_name_te, role, pass_salt, pass_hash)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [String(req.body.username).trim(), String(req.body.full_name).trim(),
       String(req.body.full_name_te || '').trim() || null,
       role, salt, hashPassword(pw, salt)]);
    await audit.record(c, { actorId: req.user.userId, action: 'USER_CREATED',
      detail: { username: req.body.username, role: req.body.role } });
  });
  res.send(page({ title: 'Password', user: req.user, body: `
<h2>Account created</h2>
<div class="card"><p><b>${esc(req.body.username)}</b> can now sign in with this one-time password:</p>
<div class="allot"><div class="no">${esc(pw)}</div>
<div class="sub">Write it on a slip and hand it over. It is shown ONCE and stored only as a hash.</div></div>
<div class="actions"><a class="btn" href="/admin">Back to administration</a></div></div>`}));
});

router.post('/user/:id/toggle', async (req, res) => {
  await tx(async (c) => {
    const u = (await c.query(
      `UPDATE mst_user SET is_active = NOT is_active WHERE id=$1 RETURNING username, is_active`,
      [req.params.id])).rows[0];
    await audit.record(c, { actorId: req.user.userId,
      action: u.is_active ? 'USER_REACTIVATED' : 'USER_DEACTIVATED', detail: { username: u.username } });
  });
  res.redirect('/admin');
});

router.post('/user/:id/reset', async (req, res) => {
  const pw = crypto.randomBytes(6).toString('base64url');
  const salt = crypto.randomBytes(16).toString('hex');
  const u = (await pool.query(
    `UPDATE mst_user SET pass_salt=$2, pass_hash=$3 WHERE id=$1 RETURNING username`,
    [req.params.id, salt, hashPassword(pw, salt)])).rows[0];
  await tx((c) => audit.record(c, { actorId: req.user.userId, action: 'PASSWORD_RESET',
    detail: { username: u.username } }));
  res.send(page({ title: 'Password', user: req.user, body: `
<h2>Password reset</h2>
<div class="card"><p>New one-time password for <b>${esc(u.username)}</b>:</p>
<div class="allot"><div class="no">${esc(pw)}</div></div>
<div class="actions"><a class="btn" href="/admin">Back</a></div></div>`}));
});

router.post('/equipment', async (req, res) => {
  await tx(async (c) => {
    await c.query(
      `INSERT INTO mst_equipment (code, name, calibrated_to) VALUES ($1,$2,$3)`,
      [String(req.body.code).trim(), String(req.body.name).trim(), req.body.calibrated_to]);
    await audit.record(c, { actorId: req.user.userId, action: 'EQUIPMENT_ADDED',
      detail: { code: req.body.code } });
  });
  res.redirect('/admin');
});

router.post('/equipment/:id/calibrate', async (req, res) => {
  // A calibration recorded with a validity date already in the past is a
  // data-entry slip, and accepting it silently just re-blocks the balance.
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(req.body.calibrated_to)) ||
      String(req.body.calibrated_to) < localToday) {
    return res.status(400).send('The calibration validity date must be today or later. Go back and re-enter it.');
  }
  await tx(async (c) => {
    const e = (await c.query(
      `UPDATE mst_equipment SET calibrated_to=$2, is_in_service=true WHERE id=$1 RETURNING code`,
      [req.params.id, req.body.calibrated_to])).rows[0];
    await audit.record(c, { actorId: req.user.userId, action: 'CALIBRATION_RECORDED',
      detail: { code: e.code, calibrated_to: req.body.calibrated_to } });
  });
  res.redirect('/admin');
});

router.post('/test/:id/fee', async (req, res) => {
  const fee = parseFloat(req.body.fee);
  if (Number.isFinite(fee) && fee >= 0) {
    await tx(async (c) => {
      const t = (await c.query(
        `UPDATE mst_test SET fee_rupees=$2 WHERE id=$1 RETURNING code, fee_rupees`,
        [req.params.id, fee])).rows[0];
      await audit.record(c, { actorId: req.user.userId, action: 'FEE_CHANGED',
        detail: { code: t.code, fee } });
    });
  }
  res.redirect('/admin');
});

router.post('/test/:id/toggle', async (req, res) => {
  await tx(async (c) => {
    const t = (await c.query(
      `UPDATE mst_test SET is_active = NOT is_active WHERE id=$1 RETURNING code, is_active`,
      [req.params.id])).rows[0];
    await audit.record(c, { actorId: req.user.userId,
      action: t.is_active ? 'TEST_RESTORED' : 'TEST_RETIRED', detail: { code: t.code } });
  });
  res.redirect('/admin');
});

module.exports = router;
