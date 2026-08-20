'use strict';
/**
 * The sample's life, and the ONE function that moves it (ARC-12).
 *
 * REGISTERED -> IN_TEST -> SUBMITTED -> VERIFIED -> ISSUED
 *                  ^           |
 *                  +-- send-back with a recorded reason (M7)
 *
 * Every transition re-checks role, current state and segregation of duties on
 * the server (ARC-11, M13-10): the person who entered the readings may not
 * verify them, and only a signatory may issue.
 */
const { tx, pool } = require('../db');
const { allot, sampleNo } = require('../series');
const audit = require('../audit');

const TRANSITIONS = {
  // START_TEST is also legal FROM IN_TEST: it re-allocates to a different
  // balance. Without that, a balance whose calibration lapsed mid-test left
  // the sample wedged in IN_TEST with no exit — found by adversarial review.
  START_TEST: { from: ['REGISTERED', 'IN_TEST'], to: 'IN_TEST', roles: ['tester'] },
  SUBMIT:     { from: 'IN_TEST',    to: 'SUBMITTED', roles: ['tester'] },
  SEND_BACK:  { from: 'SUBMITTED',  to: 'IN_TEST', roles: ['verifier', 'signatory'] },
  VERIFY:     { from: 'SUBMITTED',  to: 'VERIFIED', roles: ['verifier', 'signatory'] },
  ISSUE:      { from: 'VERIFIED',   to: 'ISSUED', roles: ['signatory'] },
  WITHDRAW:   { from: 'ISSUED',     to: 'WITHDRAWN', roles: ['signatory'] },
};

class Refused extends Error {}

/** The one place a status ever changes. Everything else calls this. */
async function transition(client, { sampleId, action, user, detail }) {
  const rule = TRANSITIONS[action];
  if (!rule) throw new Refused(`unknown action ${action}`);
  if (!rule.roles.includes(user.role) && user.role !== 'admin') {
    throw new Refused(`${action} is not permitted for the ${user.role} role`);
  }
  const { rows } = await client.query(
    `SELECT * FROM txn_sample WHERE id=$1 FOR UPDATE`, [sampleId]);
  if (!rows.length) throw new Refused('no such sample');
  const s = rows[0];
  const allowed = Array.isArray(rule.from) ? rule.from : [rule.from];
  if (!allowed.includes(s.status)) {
    throw new Refused(
      `${action} needs the sample to be ${allowed.join(' or ')}; it is ${s.status}`);
  }
  // Segregation of duties (M13-10 default (a)): performer may not check their
  // own work. Refused with the reason named, not silently allowed.
  if ((action === 'VERIFY') && Number(s.tester_id) === user.userId) {
    throw new Refused('the person who performed the test may not verify it (M13-10)');
  }
  const sets = { VERIFY: ', verified_by=$3, verified_at=now(), sendback_reason=NULL' }[action] || '';
  const args = [rule.to, sampleId]; if (sets) args.push(user.userId);
  if (action === 'SEND_BACK') {
    await client.query(
      `UPDATE txn_sample SET status=$1, sendback_reason=$3 WHERE id=$2`,
      [rule.to, sampleId, (detail && detail.reason) || 'no reason recorded']);
  } else if (action === 'START_TEST') {
    // The calibration gate, server-side (ARC-11). The disabled option in the
    // screen is convenience; a raw POST with an out-of-calibration balance was
    // accepted before this check existed, wedging the sample.
    const eq = (await client.query(
      `SELECT * FROM mst_equipment WHERE id=$1`, [detail.equipmentId])).rows[0];
    if (!eq || !eq.is_in_service || require('./results').dateOnly(eq.calibrated_to) < require('./results').todayStr()) {
      throw new Refused(
        `balance ${eq ? eq.code : String(detail.equipmentId)} is out of calibration or out of service (M11)`);
    }
    await client.query(
      `UPDATE txn_sample SET status=$1, tester_id=$3, equipment_id=$4 WHERE id=$2`,
      [rule.to, sampleId, user.userId, detail.equipmentId]);
  } else {
    await client.query(`UPDATE txn_sample SET status=$1 ${sets} WHERE id=$2`, args);
  }
  await audit.record(client, { actorId: user.userId, sampleId, action, detail });
  return { ...s, status: rule.to };
}

/**
 * The walk-in path (WF-31): the request is taken, reviewed and the sample
 * registered in one act at the counter. The review is the capability check —
 * the test exists, is active, and its fee is on the card — recorded in the
 * audit trail rather than merely displayed.
 */
async function register({ user, customerName, customerPhone, broughtBy, lotMark,
                          declaredDenier, bales, books, weightKg, testId }) {
  // Validate BEFORE the transaction: a refused registration must not have
  // touched the gap-free series. Empty fields were burning numbers.
  const bad = [];
  if (!customerName) bad.push('customer name');
  if (!lotMark) bad.push('lot mark');
  if (!declaredDenier) bad.push('declared denier');
  if ([bales, books].some((v) => v < 0) || (weightKg != null && weightKg < 0)) {
    bad.push('quantities cannot be negative');
  }
  if (bad.length) throw new Refused('missing or invalid: ' + bad.join(', '));

  return tx(async (c) => {
    const t = (await c.query(
      `SELECT * FROM mst_test WHERE id=$1 AND is_active`, [testId])).rows[0];
    if (!t) throw new Refused('that test is not on the catalogue — request review failed');

    // Find-or-create the customer; the sample carries a frozen name snapshot.
    // Race-safe: two counters registering the same new customer at once both
    // reach the INSERT, and ON CONFLICT turns the loser into the winner's row
    // instead of aborting the loser's whole registration. Same name with a
    // DIFFERENT phone is a different customer — Dharmavaram has more than one
    // trader named for the same deity (M1 duplicate control, first cut).
    let cust = (await c.query(
      `SELECT * FROM mst_customer
        WHERE name=$1 AND phone IS NOT DISTINCT FROM $2 LIMIT 1`,
      [customerName, customerPhone || null])).rows[0];
    if (!cust) {
      cust = (await c.query(
        `INSERT INTO mst_customer (name, phone) VALUES ($1,$2)
         ON CONFLICT (name, phone) DO UPDATE SET name = EXCLUDED.name
         RETURNING *`,
        [customerName, customerPhone || null])).rows[0];
    }

    const no = sampleNo(await allot(c, 'SAMPLE'));
    const s = (await c.query(
      `INSERT INTO txn_sample
         (sample_no, customer_id, customer_name, brought_by, lot_mark, declared_denier,
          bales, books, weight_kg, test_id, test_name, fee_rupees, readings_required, registered_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [no, cust.id, cust.name, broughtBy || null, lotMark, declaredDenier,
       bales || 0, books || 0, weightKg || null, t.id, t.name, t.fee_rupees,
       t.readings_required, user.userId])).rows[0];

    await audit.record(client_or(c), { actorId: user.userId, sampleId: s.id,
      action: 'REGISTER', detail: { sample_no: no, test: t.code, review: 'capability check passed' } });
    return s;
  });
}
// audit.record takes the client directly; tiny alias to keep the call site tidy.
function client_or(c) { return c; }

async function worklist(q) {
  const where = q
    ? `WHERE s.sample_no ILIKE $1 OR s.customer_name ILIKE $1 OR s.lot_mark ILIKE $1`
    : '';
  const args = q ? [`%${q}%`] : [];
  const { rows } = await pool.query(
    `SELECT s.*, r.report_no, r.verify_token, r.status AS report_status
       FROM txn_sample s LEFT JOIN txn_report r ON r.sample_id = s.id
       ${where} ORDER BY s.id DESC LIMIT 200`, args);
  return rows;
}

async function get(id) {
  const { rows } = await pool.query(
    `SELECT s.*, r.report_no, r.verify_token, r.pdf_sha256, r.status AS report_status,
            u.full_name AS tester_name, v.full_name AS verifier_name,
            e.name AS equipment_name, e.code AS equipment_code, e.calibrated_to
       FROM txn_sample s
       LEFT JOIN txn_report r ON r.sample_id = s.id
       LEFT JOIN mst_user u ON u.id = s.tester_id
       LEFT JOIN mst_user v ON v.id = s.verified_by
       LEFT JOIN mst_equipment e ON e.id = s.equipment_id
      WHERE s.id=$1`, [id]);
  return rows[0] || null;
}

module.exports = { register, worklist, get, transition, Refused, TRANSITIONS };
