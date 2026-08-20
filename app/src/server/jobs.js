'use strict';
/**
 * The one scheduled entry point (per §24.4: one entry, not fifteen, so there
 * is one place to look when something did not run). Cron or launchd calls
 *
 *   node src/server/jobs.js
 *
 * once a day, and every due task runs and reports. Exit code is non-zero if
 * any task found a problem, so the scheduler's own alerting works unmodified.
 */
const crypto = require('node:crypto');
const { pool } = require('./db');

async function integrityCheck() {
  // Every issued certificate's stored bytes are re-hashed and compared with
  // the fingerprint recorded at issue — the check that turns silent bit-rot
  // or tampering into a loud, dated finding (NFR-42's job, first cut).
  // One file in memory at a time. Buffering the whole archive works in year
  // one and OOMs quietly in year five — 11,000 reports a year adds up.
  const bad = []; let checked = 0, lastId = 0;
  for (;;) {
    const { rows } = await pool.query(
      `SELECT id, report_no, pdf, pdf_sha256 FROM txn_report
        WHERE id > $1 ORDER BY id LIMIT 50`, [lastId]);
    if (!rows.length) break;
    for (const r of rows) {
      const sha = crypto.createHash('sha256').update(r.pdf).digest('hex');
      if (sha !== r.pdf_sha256) bad.push(r.report_no);
      checked += 1; lastId = Number(r.id);
    }
  }
  console.log(`integrity: ${checked} issued files checked, ${bad.length} mismatches` +
    (bad.length ? ' — ' + bad.join(', ') : ''));
  if (bad.length) {
    await pool.query(
      `INSERT INTO txn_event (action, detail) VALUES ('INTEGRITY_FAILURE', $1)`,
      [JSON.stringify({ reports: bad })]);
  }
  return bad.length === 0;
}

async function calibrationDue() {
  const { rows } = await pool.query(
    `SELECT code, name, to_char(calibrated_to,'YYYY-MM-DD') AS due FROM mst_equipment
      WHERE is_in_service AND calibrated_to < (now() + interval '30 days')::date
      ORDER BY calibrated_to`);
  for (const e of rows) {
    console.log(`calibration: ${e.code} (${e.name}) due ${e.due}`);
  }
  if (!rows.length) console.log('calibration: nothing due within 30 days');
  return true;
}

(async () => {
  let ok = true;
  for (const task of [integrityCheck, calibrationDue]) {
    try { ok = (await task()) && ok; }
    catch (e) { ok = false; console.error(`${task.name} failed:`, e.message); }
  }
  await pool.end();
  process.exit(ok ? 0 : 1);
})();
