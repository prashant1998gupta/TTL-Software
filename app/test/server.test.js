'use strict';
/**
 * The workflow, tested where it can lie: the state machine, segregation of
 * duties, the calibration gate, gap-free numbering under concurrency, the
 * revision chain, and the tamper triggers.
 *
 * Runs against a THROWAWAY database (ttl_lims_test), recreated each run.
 * Needs PostgreSQL on the local socket; skips loudly without it.
 */
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('node:child_process');

process.env.LIMS_DB = 'ttl_lims_test';

let pool, tx, samples, results, reports, available = true;
const G = [1.048, 1.052, 1.041, 1.061, 1.055, 1.049, 1.038, 1.057, 1.044, 1.050,
           1.046, 1.059, 1.043, 1.054, 1.051, 1.047, 1.056, 1.042, 1.053, 1.045];
const U = {
  counter: { userId: 4, role: 'counter' }, tester: { userId: 3, role: 'tester' },
  tester2: { userId: 2, role: 'tester' },   // suma, wearing a tester hat for one test
  verifier: { userId: 2, role: 'verifier' }, sign: { userId: 1, role: 'signatory' },
};

before(async () => {
  try {
    const psql = '/opt/homebrew/opt/postgresql@16/bin/psql';
    execSync(`${psql} -d postgres -c "DROP DATABASE IF EXISTS ttl_lims_test WITH (FORCE)"`, { stdio: 'pipe' });
    execSync(`${psql} -d postgres -c "CREATE DATABASE ttl_lims_test"`, { stdio: 'pipe' });
    execSync('node src/server/migrate.js --demo', { stdio: 'pipe', env: { ...process.env } });
  } catch (e) { available = false; return; }
  ({ pool, tx } = require('../src/server/db'));
  samples = require('../src/server/services/samples');
  results = require('../src/server/services/results');
  reports = require('../src/server/services/reports');
});
after(async () => { if (pool) await pool.end(); });

function register(lot = 'T-' + Math.random().toString(36).slice(2, 7)) {
  return samples.register({ user: U.counter, customerName: 'Test Trader', lotMark: lot,
    declaredDenier: '20/22', bales: 1, books: 10, testId: 1 });
}
async function toSubmitted(s) {
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'START_TEST',
    user: U.tester, detail: { equipmentId: 1 } }));
  await results.saveAndSubmit({ user: U.tester, sampleId: s.id, grams: G });
}

test('two concurrent registrations never share a number, and numbers are consecutive', async (t) => {
  if (!available) return t.skip('postgres not available');
  const [a, b] = await Promise.all([register(), register()]);
  assert.notEqual(a.sample_no, b.sample_no);
  const ns = [a, b].map((x) => parseInt(x.sample_no.split('/')[2], 10)).sort((p, q) => p - q);
  assert.equal(ns[1] - ns[0], 1, `expected consecutive numbers, got ${ns}`);
});

test('the state machine refuses a skipped step and the wrong role', async (t) => {
  if (!available) return t.skip('postgres not available');
  const s = await register();
  // Cannot issue a sample that was never tested, even as the signatory.
  await assert.rejects(
    () => reports.issue({ user: U.sign, sampleId: Number(s.id) }), samples.Refused);
  // A counter clerk cannot start a test.
  await assert.rejects(
    () => tx((c) => samples.transition(c, { sampleId: s.id, action: 'START_TEST',
      user: U.counter, detail: { equipmentId: 1 } })), samples.Refused);
});

test('the tester cannot verify their own work (M13-10)', async (t) => {
  if (!available) return t.skip('postgres not available');
  const s = await register();
  await toSubmitted(s);
  await assert.rejects(
    () => tx((c) => samples.transition(c, { sampleId: s.id, action: 'VERIFY',
      user: { userId: U.tester.userId, role: 'verifier' } })),
    /performed the test may not verify/);
  // A different person may.
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'VERIFY', user: U.verifier }));
});

test('a calibration lapsing MID-TEST refuses the result at save (M11)', async (t) => {
  if (!available) return t.skip('postgres not available');
  // The start gate refuses BAL-2 outright now, so the save-time gate is tested
  // the way it really happens: the balance was fine at allocation and its
  // calibration expired while the sample sat on the bench.
  const s = await register();
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'START_TEST',
    user: U.tester, detail: { equipmentId: 1 } }));
  await pool.query(`UPDATE mst_equipment SET calibrated_to = (now() - interval '1 day')::date WHERE id=1`);
  await assert.rejects(
    () => results.saveAndSubmit({ user: U.tester, sampleId: s.id, grams: G }),
    /out of calibration/);
  await pool.query(`UPDATE mst_equipment SET calibrated_to = (now() + interval '200 days')::date WHERE id=1`);
  // And the unwedge path works: re-pick the (now recalibrated) balance and save.
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'START_TEST',
    user: U.tester, detail: { equipmentId: 1 } }));
  await results.saveAndSubmit({ user: U.tester, sampleId: s.id, grams: G });
});

test('wrong reading count is refused; a send-back re-entry revises, never overwrites', async (t) => {
  if (!available) return t.skip('postgres not available');
  const s = await register();
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'START_TEST',
    user: U.tester, detail: { equipmentId: 1 } }));
  await assert.rejects(
    () => results.saveAndSubmit({ user: U.tester, sampleId: s.id, grams: G.slice(0, 19) }),
    /exactly 20 readings/);
  await results.saveAndSubmit({ user: U.tester, sampleId: s.id, grams: G });
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'SEND_BACK',
    user: U.verifier, detail: { reason: 'skein 3 looks transposed' } }));
  const G2 = [...G]; G2[2] = 1.031;
  await results.saveAndSubmit({ user: U.tester, sampleId: s.id, grams: G2 });
  const current = await results.current(pool, s.id);
  assert.equal(current[2], 1.031, 'the revised value is current');
  const { rows } = await pool.query(
    `SELECT count(*)::int AS n FROM txn_reading WHERE sample_id=$1`, [s.id]);
  assert.equal(rows[0].n, 40, 'both generations are retained — nothing was overwritten');
});

test('issue freezes the file: stored sha256 matches the stored bytes', async (t) => {
  if (!available) return t.skip('postgres not available');
  const s = await register();
  await toSubmitted(s);
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'VERIFY', user: U.verifier }));
  const r = await reports.issue({ user: U.sign, sampleId: Number(s.id) });
  const { rows } = await pool.query(`SELECT pdf, pdf_sha256 FROM txn_report WHERE report_no=$1`, [r.reportNo]);
  const sha = require('node:crypto').createHash('sha256').update(rows[0].pdf).digest('hex');
  assert.equal(sha, rows[0].pdf_sha256);
  // And the published row shows CURRENT with the same fingerprint.
  const pub = (await pool.query(
    `SELECT * FROM sys_published_verification WHERE verify_token=$1`, [r.token])).rows[0];
  assert.equal(pub.status, 'CURRENT');
  assert.equal(pub.pdf_sha256, sha);
});

test('withdrawal flips the published row; a second withdrawal is refused', async (t) => {
  if (!available) return t.skip('postgres not available');
  const s = await register();
  await toSubmitted(s);
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'VERIFY', user: U.verifier }));
  const r = await reports.issue({ user: U.sign, sampleId: Number(s.id) });
  await reports.withdraw({ user: U.sign, sampleId: Number(s.id), reason: 'test' });
  const pub = (await pool.query(
    `SELECT status FROM sys_published_verification WHERE verify_token=$1`, [r.token])).rows[0];
  assert.equal(pub.status, 'WITHDRAWN');
  await assert.rejects(
    () => reports.withdraw({ user: U.sign, sampleId: Number(s.id), reason: 'again' }),
    samples.Refused);
});

test('the audit trail and readings cannot be rewritten, even by the table owner', async (t) => {
  if (!available) return t.skip('postgres not available');
  await assert.rejects(() => pool.query(`UPDATE txn_event SET action='X' WHERE id=1`), /append-only/);
  await assert.rejects(() => pool.query(`DELETE FROM txn_reading WHERE id=1`), /append-only/);
});

test('a SECOND send-back still yields exactly 20 current readings (the doubled-certificate defect)', async (t) => {
  if (!available) return t.skip('postgres not available');
  // Adversarial review found this: the revision query matched only first-
  // generation rows, so generation 3 revised generation 1 again, generation 2
  // was never revised, and a certificate would have been SIGNED over 40
  // blended readings. This test walks the exact scenario.
  const s = await register();
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'START_TEST',
    user: U.tester, detail: { equipmentId: 1 } }));
  await results.saveAndSubmit({ user: U.tester, sampleId: s.id, grams: G });
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'SEND_BACK',
    user: U.verifier, detail: { reason: 'first' } }));
  const G2 = [...G]; G2[0] = 1.100;
  await results.saveAndSubmit({ user: U.tester, sampleId: s.id, grams: G2 });
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'SEND_BACK',
    user: U.verifier, detail: { reason: 'second' } }));
  const G3 = [...G]; G3[0] = 1.200;
  await results.saveAndSubmit({ user: U.tester, sampleId: s.id, grams: G3 });

  const current = await results.current(pool, s.id);
  assert.equal(current.length, 20,
    `current() must return exactly 20 readings, got ${current.length} — ` +
    'superseded generations are leaking into the certificate');
  assert.equal(current[0], 1.2, 'the third-generation value is the current one');
});

test('a raw START_TEST with an out-of-calibration balance is refused server-side', async (t) => {
  if (!available) return t.skip('postgres not available');
  // The screen disables the option; this proves the SERVER refuses it too
  // (ARC-11) — before the fix, a crafted POST wedged the sample in IN_TEST.
  const s = await register();
  await assert.rejects(
    () => tx((c) => samples.transition(c, { sampleId: s.id, action: 'START_TEST',
      user: U.tester, detail: { equipmentId: 2 } })),
    /out of calibration/);
  // And a wedge, if one ever happens, has an exit: re-pick from IN_TEST.
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'START_TEST',
    user: U.tester, detail: { equipmentId: 1 } }));
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'START_TEST',
    user: U.tester, detail: { equipmentId: 1 } })); // legal from IN_TEST too
});

test('same customer name with a different phone is a different customer', async (t) => {
  if (!available) return t.skip('postgres not available');
  const a = await samples.register({ user: U.counter, customerName: 'Sri Venkateswara Silks',
    customerPhone: '9000000001', lotMark: 'V-1', declaredDenier: '20/22', testId: 1 });
  const b = await samples.register({ user: U.counter, customerName: 'Sri Venkateswara Silks',
    customerPhone: '9000000002', lotMark: 'V-2', declaredDenier: '20/22', testId: 1 });
  assert.notEqual(a.customer_id, b.customer_id,
    'two traders sharing a name must not be silently merged');
});

test('registration with an empty lot mark is refused BEFORE a number is consumed', async (t) => {
  if (!available) return t.skip('postgres not available');
  const before = (await pool.query(
    `SELECT next_no FROM sys_series WHERE series_code='SAMPLE'`)).rows[0].next_no;
  await assert.rejects(
    () => samples.register({ user: U.counter, customerName: 'X', lotMark: '',
      declaredDenier: '20/22', testId: 1 }), /lot mark/);
  const after = (await pool.query(
    `SELECT next_no FROM sys_series WHERE series_code='SAMPLE'`)).rows[0].next_no;
  assert.equal(before, after, 'a refused registration must not burn a gap-free number');
});

test('amendment: the corrected certificate supersedes; the old QR names its replacement', async (t) => {
  if (!available) return t.skip('postgres not available');
  // The audit-critical path (M8-50s): a wrong certificate is never edited —
  // it is superseded by a new one, with the reason on record and the old QR
  // telling anyone who scans it what replaced it.
  const s = await register();
  await toSubmitted(s);
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'VERIFY', user: U.verifier }));
  const first = await reports.issue({ user: U.sign, sampleId: Number(s.id) });

  await reports.amend({ user: U.sign, sampleId: Number(s.id),
    reason: 'transcription error in skein 5' });
  const G2 = [...G]; G2[4] = 1.062;
  await results.saveAndSubmit({ user: U.tester, sampleId: s.id, grams: G2 });
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'VERIFY', user: U.verifier }));
  const second = await reports.issue({ user: U.sign, sampleId: Number(s.id) });

  assert.notEqual(second.reportNo, first.reportNo, 'the amendment is a NEW report number');

  const oldR = (await pool.query(
    `SELECT status FROM txn_report WHERE report_no=$1`, [first.reportNo])).rows[0];
  assert.equal(oldR.status, 'SUPERSEDED', 'the original is marked superseded, not deleted');

  const newR = (await pool.query(
    `SELECT r.supersedes_id, o.report_no AS old_no FROM txn_report r
      JOIN txn_report o ON o.id = r.supersedes_id WHERE r.report_no=$1`, [second.reportNo])).rows[0];
  assert.equal(newR.old_no, first.reportNo, 'the lineage names exactly what was replaced');

  const oldPub = (await pool.query(
    `SELECT status, replaced_by FROM sys_published_verification WHERE verify_token=$1`,
    [first.token])).rows[0];
  assert.equal(oldPub.status, 'SUPERSEDED');
  assert.equal(oldPub.replaced_by, second.reportNo,
    'scanning the OLD certificate must name the replacement');

  const newPub = (await pool.query(
    `SELECT status FROM sys_published_verification WHERE verify_token=$1`, [second.token])).rows[0];
  assert.equal(newPub.status, 'CURRENT');

  // And the corrected value is what the new certificate was computed from.
  const cur = await results.current(pool, s.id);
  assert.equal(cur[4], 1.062);

  // The reason must ARRIVE on the issued report. It was first parked in
  // sendback_reason, which VERIFY clears — so it reached the certificate as
  // NULL every time. Review-confirmed; this pins the fix.
  const reason = (await pool.query(
    `SELECT amend_reason FROM txn_report WHERE report_no=$1`, [second.reportNo])).rows[0];
  assert.equal(reason.amend_reason, 'transcription error in skein 5');

  // And the sample page's own query must surface the NEW report, not whichever
  // row the join happened to return — the superseded certificate was being
  // shown as current.
  const page = await samples.get(s.id);
  assert.equal(page.report_no, second.reportNo,
    'get() must join only the live report row');
});

test('CSV export neutralises a cell that begins like a formula', async (t) => {
  if (!available) return t.skip('postgres not available');
  // A walk-in "customer" named =HYPERLINK(...) must not execute at
  // headquarters when the monthly register is opened in Excel.
  await samples.register({ user: U.counter,
    customerName: '=HYPERLINK("http://evil/x","open")', customerPhone: '9111111111',
    lotMark: 'INJ-1', declaredDenier: '20/22', testId: 1 });
  const { csvField } = require('../src/server/registers');
  // The defence is at export: the emitted cell must open with an apostrophe
  // so a spreadsheet reads text, not a formula.
  assert.equal(csvField('=HYPERLINK("http://evil/x","open")'),
    `"'=HYPERLINK(""http://evil/x"",""open"")"`);
  assert.equal(csvField('+91 9440012345'), `"'+91 9440012345"`);
  assert.equal(csvField('Sri Lakshmi Silks'), '"Sri Lakshmi Silks"',
    'honest text must pass through unmarked');
});

test('an amendment without a reason is refused', async (t) => {
  if (!available) return t.skip('postgres not available');
  const s = await register();
  await toSubmitted(s);
  await tx((c) => samples.transition(c, { sampleId: s.id, action: 'VERIFY', user: U.verifier }));
  await reports.issue({ user: U.sign, sampleId: Number(s.id) });
  await assert.rejects(
    () => reports.amend({ user: U.sign, sampleId: Number(s.id), reason: '' }),
    /must record its reason/);
});
