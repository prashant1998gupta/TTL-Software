'use strict';
/**
 * Applies schema.sql and seeds the minimum a working day needs: users, the
 * test catalogue rows the counter sells (rates from the published CSTRI
 * schedule of 01.12.2023, every one marked by M8-72's default Non-NABL),
 * one balance, and the number series.
 *
 *   node src/server/migrate.js [--demo]
 *
 * --demo also seeds three customers and two in-flight samples so the screens
 * have something to show on first run. Never use --demo on the real database.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { pool, tx } = require('./db');
const { hashPassword } = require('./auth');
const { finYear } = require('./series');

const USERS = [
  // Seeded DEVELOPMENT credentials. Real accounts are created by the admin at
  // go-live and these rows are deactivated (go-live checklist).
  ['incharge', 'K. Ramesh, Unit In-Charge', 'కె. రమేశ్', 'signatory'],
  ['suma',     'B. Suma, Technical Officer', 'బి. సుమ',  'verifier'],
  ['ravi',     'D. Ravi, Technical Assistant', 'డి. రవి', 'tester'],
  ['lakshmi',  'S. Lakshmi, Counter Clerk', 'ఎస్. లక్ష్మి', 'counter'],
];

const TESTS = [
  ['LT5',  'Limited test (5 skein)', 'పరిమిత పరీక్ష (5 కండె)', 50, 20],
  ['DENS', 'Denier test, skein',     'డెనియర్ పరీక్ష, కండె',    40, 20],
  ['DENB', 'Denier test, bobbin',    'డెనియర్ పరీక్ష, బాబిన్',  30, 20],
  ['BIS',  'Raw silk testing & grading, BIS', 'ముడి పట్టు పరీక్ష & గ్రేడింగ్', 400, 40],
  ['TW1',  'Twist, single',          'మెలిక, ఒంటి',            55, 20],
];

async function main() {
  const demo = process.argv.includes('--demo');
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);

  await tx(async (c) => {
    if (demo) for (const [username, name, nameTe, role] of USERS) {
      const salt = crypto.randomBytes(16).toString('hex');
      await c.query(
        `INSERT INTO mst_user (username, full_name, full_name_te, role, pass_salt, pass_hash)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (username) DO NOTHING`,
        [username, name, nameTe, role, salt, hashPassword('dvm', salt)]);
    }
    for (const [code, name, nameTe, fee, n] of TESTS) {
      await c.query(
        `INSERT INTO mst_test (code, name, name_te, fee_rupees, readings_required)
         VALUES ($1,$2,$3,$4,$5) ON CONFLICT (code) DO NOTHING`,
        [code, name, nameTe, fee, n]);
    }
    await c.query(
      `INSERT INTO mst_equipment (code, name, calibrated_to) VALUES
       ('BAL-1','Analytical balance, Sartorius', (now() + interval '200 days')::date),
       ('BAL-2','Analytical balance, Shimadzu',  (now() - interval '10 days')::date)
       ON CONFLICT (code) DO NOTHING`);
    if (demo) {
      // Legacy series for the demo continue from a pretend paper register
      // (WF-112). A REAL installation sets its own opening numbers in the
      // first-run setup screen, and setup refuses to guess them.
      await c.query(
        `INSERT INTO sys_series (series_code, fin_year, next_no) VALUES
         ('SAMPLE', $1, 412), ('REPORT', $1, 312)
         ON CONFLICT (series_code, fin_year) DO NOTHING`, [finYear()]);
      await c.query(
        `INSERT INTO sys_config (key, value) VALUES ('setup_done','demo')
         ON CONFLICT (key) DO NOTHING`);
      await c.query(
        `INSERT INTO mst_customer (name, name_te, phone, place) VALUES
         ('Sri Lakshmi Silks', 'శ్రీ లక్ష్మి సిల్క్స్', '9440012345', 'Dharmavaram'),
         ('Anjaneya Silk Traders', 'అంజనేయ సిల్క్ ట్రేడర్స్', '9440054321', 'Dharmavaram'),
         ('Venkateswara Reeling Co-op', 'వేంకటేశ్వర రీలింగ్ కో-ఆప్', '9490011223', 'Regatipalli')
         ON CONFLICT DO NOTHING`);
    }
  });

  console.log(`migrated ${process.env.LIMS_DB || 'ttl_lims'}  (fy ${finYear()})` + (demo ? ' with demo data' : ''));
  if (demo) console.log('seeded users: incharge / suma / ravi / lakshmi  password: dvm  (DEVELOPMENT ONLY)');
  else console.log('no users yet — the first visit to the application runs the setup screen');
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
