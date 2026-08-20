'use strict';
/**
 * Gap-free number allocation (WF-112, DB-13).
 *
 * The row is locked with SELECT ... FOR UPDATE inside the SAME transaction that
 * writes the record consuming the number. Two counters asking at once serialise
 * on the row lock; a crash before COMMIT rolls the counter back with everything
 * else. This is the concurrent-write behaviour the spec rejected SQLite over.
 */

/** Indian financial year: April to March, as '26-27'. */
function finYear(d = new Date()) {
  const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${String(y).slice(2)}-${String(y + 1).slice(2)}`;
}

/** Allocate the next number in a series. MUST be called inside tx(). */
async function allot(client, seriesCode, fy = finYear()) {
  // The row may not exist yet (first allocation of a new financial year), and
  // SELECT FOR UPDATE cannot lock a row that is not there — two April-the-first
  // transactions would both take the insert path and one would fail on the
  // unique key. ON CONFLICT DO NOTHING first makes the row's existence certain,
  // then the FOR UPDATE serialises everybody. A new series starts at 1; a
  // legacy series' opening value is seeded by migrate (WF-112).
  await client.query(
    `INSERT INTO sys_series (series_code, fin_year, next_no) VALUES ($1,$2,1)
     ON CONFLICT (series_code, fin_year) DO NOTHING`, [seriesCode, fy]);
  const { rows } = await client.query(
    `SELECT id, next_no FROM sys_series WHERE series_code=$1 AND fin_year=$2 FOR UPDATE`,
    [seriesCode, fy]);
  await client.query(`UPDATE sys_series SET next_no = next_no + 1 WHERE id=$1`, [rows[0].id]);
  return { fy, serial: Number(rows[0].next_no) };
}

const UNIT = 'DVM'; // configurable per OPEN-Q-B13; held in one place

function sampleNo({ fy, serial }) { return `${UNIT}/${fy}/${String(serial).padStart(5, '0')}`; }
function reportNo({ fy, serial }) { return `${UNIT}/R/${fy}/${String(serial).padStart(5, '0')}`; }

module.exports = { finYear, allot, sampleNo, reportNo, UNIT };
