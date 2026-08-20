'use strict';
/**
 * Readings in, computed values out — through the real calculation engine, not
 * a re-implementation. The browser shows a live preview for typing comfort,
 * but the numbers on the certificate come from HERE, server-side, from the
 * stored readings (ARC-11: a rule enforced only in the screen is not a rule).
 */
const path = require('node:path');
const { tx } = require('../db');
const samples = require('./samples');
const audit = require('../audit');
const stats = require('../../calc/stats');
const { roundHalfUp } = require('../../calc/rounding');

const CONFIG = require(path.join('..', '..', 'calc', 'config', 'is15090-bis.json'));
const DIVISOR = CONFIG.statistics.standardDeviationDivisor;

// pg hands a DATE column back as a JS Date at local midnight; normalise both
// sides to a plain YYYY-MM-DD before comparing, or the string compare is junk.
const dateOnly = (v) => v instanceof Date
  ? `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, '0')}-${String(v.getDate()).padStart(2, '0')}`
  : String(v).slice(0, 10);
const todayStr = () => dateOnly(new Date());

const SKEIN_METRES = 450;                    // the sizing skein the unit winds
const toDenier = (grams) => (grams / SKEIN_METRES) * 9000;

/** The computed block for a set of skein weights, in grams. */
function compute(readingsGrams) {
  const deniers = readingsGrams.map(toDenier);
  const avg = stats.mean(deniers);
  const sd = stats.standardDeviation(deniers, DIVISOR);
  return {
    n: readingsGrams.length,
    averageDenier: roundHalfUp(avg, 2),
    sizeDeviation: roundHalfUp(sd, 2),
    cvPercent: roundHalfUp((sd / avg) * 100, 2),
    minDenier: roundHalfUp(Math.min(...deniers), 2),
    maxDenier: roundHalfUp(Math.max(...deniers), 2),
    skeinMetres: SKEIN_METRES,
    sdDivisor: DIVISOR,
  };
}

/**
 * Save a full set of readings and submit. Requires the sample to be IN_TEST,
 * the count to match the method (M6-02: required count enforced), the balance
 * to be within calibration on the day (M11), and the tester to be the person
 * who started the test.
 */
async function saveAndSubmit({ user, sampleId, grams }) {
  return tx(async (c) => {
    const s = (await c.query(`SELECT * FROM txn_sample WHERE id=$1 FOR UPDATE`, [sampleId])).rows[0];
    if (!s) throw new samples.Refused('no such sample');
    if (s.status !== 'IN_TEST') throw new samples.Refused(`readings can only be entered while IN_TEST; sample is ${s.status}`);
    if (Number(s.tester_id) !== user.userId && user.role !== 'admin') {
      throw new samples.Refused('only the tester this sample is allocated to may enter its readings');
    }
    if (grams.length !== s.readings_required) {
      throw new samples.Refused(`this method needs exactly ${s.readings_required} readings; received ${grams.length}`);
    }
    // The calibration gate, at the moment the result is accepted (M11-14).
    const eq = (await c.query(`SELECT * FROM mst_equipment WHERE id=$1`, [s.equipment_id])).rows[0];
    // Date-only comparison: a balance "calibrated to 20 Aug" is valid THROUGH
    // 20 Aug. Comparing timestamps refused it for the whole of its last day.
    if (!eq || !eq.is_in_service || dateOnly(eq.calibrated_to) < todayStr()) {
      throw new samples.Refused(
        `balance ${eq ? eq.code : '?'} is out of calibration or out of service — the result is refused (M11)`);
    }

    // Supersede, never overwrite (M6-04): earlier rows stay; new rows revise them.
    // The set being revised is the CURRENT one — the rows nothing else revises —
    // not the first generation. Selecting revises_id IS NULL here looked right
    // and survived one send-back, then broke on the second: generation 3 revised
    // generation 1 again, generation 2 was never revised, and current() returned
    // forty blended readings for a twenty-reading method — which issue() would
    // have signed. Found by adversarial review, pinned by a regression test.
    const prior = (await c.query(
      `SELECT r.id, r.position FROM txn_reading r
        WHERE r.sample_id=$1
          AND NOT EXISTS (SELECT 1 FROM txn_reading n WHERE n.revises_id = r.id)
        ORDER BY r.position`,
      [sampleId])).rows;
    for (let i = 0; i < grams.length; i++) {
      const revises = prior.find((p) => p.position === i + 1);
      await c.query(
        `INSERT INTO txn_reading (sample_id, position, grams, entered_by, revises_id)
         VALUES ($1,$2,$3,$4,$5)`,
        [sampleId, i + 1, grams[i], user.userId, revises ? revises.id : null]);
      if (revises) {
        // Mark the old row as revised by pointing THE NEW row at it; the old row
        // itself is never touched (UPDATE is revoked on txn_reading).
      }
    }
    const computed = compute(grams);
    await audit.record(c, { actorId: user.userId, sampleId, action: 'READINGS_SAVED',
      detail: { n: grams.length, computed } });
    await samples.transition(c, { sampleId, action: 'SUBMIT', user, detail: { computed } });
    return computed;
  });
}

/** Current (latest, unrevised) readings for a sample, in position order. */
async function current(client, sampleId) {
  const { rows } = await client.query(
    `SELECT r.position, r.grams FROM txn_reading r
      WHERE r.sample_id=$1
        AND NOT EXISTS (SELECT 1 FROM txn_reading n WHERE n.revises_id = r.id)
      ORDER BY r.position`, [sampleId]);
  return rows.map((r) => Number(r.grams));
}

module.exports = { compute, saveAndSubmit, current, SKEIN_METRES, dateOnly, todayStr };
