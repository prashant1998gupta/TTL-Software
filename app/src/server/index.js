'use strict';
/**
 * The internal application. One Express app, server-rendered, LAN only
 * (ARC-01, ARC-08). Every mutating route re-checks role and state in the
 * services layer — the screens are convenience, not enforcement (ARC-11).
 */
const express = require('express');
const { pool } = require('./db');
const auth = require('./auth');
const samples = require('./services/samples');
const results = require('./services/results');
const reports = require('./services/reports');
const pages = require('./views/pages');

const app = express();
app.use(express.urlencoded({ extended: false }));

// One tiny flash message via cookie, cleared on read.
function setFlash(res, kind, text) {
  res.setHeader('Set-Cookie',
    `flash=${encodeURIComponent(kind + ':' + text)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=15`);
}
function takeFlash(req, res) {
  const m = /(?:^|;\s*)flash=([^;]+)/.exec(req.headers.cookie || '');
  if (!m) return null;
  res.setHeader('Set-Cookie', 'flash=; Path=/; Max-Age=0');
  try {
    const s = decodeURIComponent(m[1]);
    const i = s.indexOf(':');
    return { kind: s.slice(0, i), text: s.slice(i + 1) };
  } catch { return null; } // a hand-crafted cookie must not 500 every page
}

// Form fields arrive as string, array (duplicate names) or undefined. One
// coercion, used everywhere, so no handler trips on the array case.
const one = (v) => Array.isArray(v) ? String(v[0] ?? '') : String(v ?? '');

// A route :id must be a plain integer BEFORE it reaches a bigint column;
// otherwise pg throws and the user sees a stack trace.
function intParam(req, res, next) {
  if (!/^\d+$/.test(req.params.id)) return res.status(404).send('No such sample');
  next();
}

app.get('/login', (req, res) => res.send(pages.login({})));
app.post('/login', async (req, res) => {
  const sid = await auth.login(one(req.body.username), one(req.body.password));
  if (!sid) return res.status(401).send(pages.login({ error: 'Wrong username or password.' }));
  res.setHeader('Set-Cookie', `sid=${sid}; Path=/; HttpOnly; SameSite=Strict`);
  res.redirect('/work');
});
app.post('/logout', (req, res) => {
  const m = /(?:^|;\s*)sid=([A-Za-z0-9_-]+)/.exec(req.headers.cookie || '');
  if (m) auth.logout(m[1]);
  res.setHeader('Set-Cookie', 'sid=; Path=/; Max-Age=0');
  res.redirect('/login');
});

app.get('/', auth.requireUser(), (req, res) => res.redirect('/work'));

// ---- counter -------------------------------------------------------------
app.get('/counter', auth.requireUser('counter', 'signatory'), async (req, res) => {
  const tests = (await pool.query(`SELECT * FROM mst_test WHERE is_active ORDER BY id`)).rows;
  const customers = (await pool.query(`SELECT name FROM mst_customer ORDER BY name LIMIT 500`)).rows;
  let registered = null;
  if (/^\d+$/.test(one(req.query.done))) {
    registered = (await pool.query(`SELECT * FROM txn_sample WHERE id=$1`, [one(req.query.done)])).rows[0];
  }
  res.send(pages.counter({ user: req.user, flash: takeFlash(req, res), tests, customers, registered }));
});
app.post('/counter', auth.requireUser('counter', 'signatory'), async (req, res) => {
  try {
    const s = await samples.register({
      user: req.user,
      customerName: one(req.body.customerName).trim(),
      customerPhone: one(req.body.customerPhone).trim(),
      broughtBy: one(req.body.broughtBy).trim(),
      lotMark: one(req.body.lotMark).trim(),
      declaredDenier: one(req.body.declaredDenier).trim(),
      bales: Math.max(0, parseInt(one(req.body.bales), 10) || 0),
      books: Math.max(0, parseInt(one(req.body.books), 10) || 0),
      weightKg: (() => { const w = parseFloat(one(req.body.weightKg)); return Number.isFinite(w) && w >= 0 ? w : null; })(),
      testId: parseInt(one(req.body.testId), 10),
    });
    res.redirect(`/counter?done=${s.id}`);
  } catch (e) {
    // A Refused carries a message written for the counter; anything else is an
    // internal error and its text belongs in the log, not on the screen.
    const soft = e instanceof samples.Refused;
    if (!soft) console.error(e);
    setFlash(res, 'err', soft ? e.message : 'Something went wrong; nothing was saved.');
    res.redirect('/counter');
  }
});

// ---- worklist and sample -------------------------------------------------
app.get('/work', auth.requireUser(), async (req, res) => {
  const q = one(req.query.q).trim();
  const rows = await samples.worklist(q);
  res.send(pages.worklist({ user: req.user, flash: takeFlash(req, res), rows, q }));
});

app.get('/sample/:id', auth.requireUser(), intParam, async (req, res) => {
  const s = await samples.get(req.params.id);
  if (!s) return res.status(404).send('No such sample');
  const readings = await results.current(pool, s.id);
  const computed = readings.length ? results.compute(readings) : null;
  const equipment = (await pool.query(`SELECT * FROM mst_equipment ORDER BY code`)).rows;
  res.send(pages.sample({ user: req.user, flash: takeFlash(req, res), s, readings, computed,
    equipment, verifyBase: reports.VERIFY_BASE }));
});

function act(fn) {
  return async (req, res) => {
    try { await fn(req); }
    catch (e) {
      const soft = e instanceof samples.Refused;
      if (!soft) console.error(e);
      setFlash(res, 'err', soft ? e.message : 'Something went wrong; nothing was saved.');
    }
    res.redirect(`/sample/${req.params.id}`);
  };
}
const { tx } = require('./db');
app.post('/sample/:id/start', intParam, auth.requireUser('tester'), act(async (req) => {
  await tx((c) => samples.transition(c, { sampleId: req.params.id, action: 'START_TEST',
    user: req.user, detail: { equipmentId: parseInt(one(req.body.equipmentId), 10) } }));
}));
app.post('/sample/:id/readings', intParam, auth.requireUser('tester'), act(async (req) => {
  const s = await samples.get(req.params.id);
  const grams = [];
  for (let i = 1; i <= s.readings_required; i++) {
    const v = parseFloat(req.body['g' + i]);
    if (!Number.isFinite(v) || v <= 0) throw new samples.Refused(`skein ${i}: not a valid weight`);
    grams.push(v);
  }
  await results.saveAndSubmit({ user: req.user, sampleId: s.id, grams });
}));
app.post('/sample/:id/verify', intParam, auth.requireUser('verifier', 'signatory'), act(async (req) => {
  await tx((c) => samples.transition(c, { sampleId: req.params.id, action: 'VERIFY', user: req.user }));
}));
app.post('/sample/:id/sendback', intParam, auth.requireUser('verifier', 'signatory'), act(async (req) => {
  await tx((c) => samples.transition(c, { sampleId: req.params.id, action: 'SEND_BACK',
    user: req.user, detail: { reason: (req.body.reason || '').trim() } }));
}));
app.post('/sample/:id/issue', intParam, auth.requireUser('signatory'), act(async (req) => {
  await reports.issue({ user: req.user, sampleId: Number(req.params.id) });
}));
app.post('/sample/:id/withdraw', intParam, auth.requireUser('signatory'), act(async (req) => {
  await reports.withdraw({ user: req.user, sampleId: Number(req.params.id),
    reason: one(req.body.reason).trim() });
}));

// ---- the frozen file -----------------------------------------------------
app.get('/report/:no.pdf', auth.requireUser(), async (req, res) => {
  const r = await reports.pdfFor(req.params.no.replace(/_/g, '/'));
  if (!r) return res.status(404).send('No such report');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${r.report_no.replace(/\//g, '-')}.pdf"`);
  res.send(r.pdf);
});

const PORT = process.env.LIMS_PORT || 8787;
app.listen(PORT, '127.0.0.1', () =>
  console.log(`LIMS internal: http://localhost:${PORT}  (login: lakshmi/ravi/suma/incharge, password dvm)`));
