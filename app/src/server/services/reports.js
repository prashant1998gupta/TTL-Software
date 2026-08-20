'use strict';
/**
 * Issuing, and what issuing means: the number is allotted, the file is
 * rendered, signed, hashed and FROZEN in the same transaction that moves the
 * sample to ISSUED, and the public verification row is published from the
 * frozen file's own fingerprint. A crash anywhere rolls back everything —
 * no burnt report number, no certificate without a record, no record without
 * a certificate.
 */
const crypto = require('node:crypto');
const { tx, pool } = require('../db');
const { allot, reportNo } = require('../series');
const samples = require('./samples');
const results = require('./results');
const certificate = require('./certificate');
const audit = require('../audit');

const VERIFY_BASE = process.env.LIMS_VERIFY_BASE || 'http://localhost:8788';

async function issue({ user, sampleId }) {
  return tx(async (c) => {
    const s = (await c.query(
      `SELECT s.*, e.code AS equipment_code, e.calibrated_to
         FROM txn_sample s LEFT JOIN mst_equipment e ON e.id=s.equipment_id
        WHERE s.id=$1 FOR UPDATE OF s`, [sampleId])).rows[0];
    if (!s) throw new samples.Refused('no such sample');
    if (s.status !== 'VERIFIED') throw new samples.Refused(`only a VERIFIED sample can be issued; this one is ${s.status}`);

    const readings = await results.current(c, sampleId);
    const computed = results.compute(readings);

    const no = reportNo(await allot(c, 'REPORT'));
    const token = crypto.randomBytes(32).toString('base64url');
    const verifyUrl = `${VERIFY_BASE}/v/${token}`;

    // Re-issue after an amendment: the report this one replaces, if any.
    const prior = (await c.query(
      `SELECT id, report_no, verify_token FROM txn_report
        WHERE sample_id=$1 AND status='CURRENT' FOR UPDATE`, [sampleId])).rows[0];

    const signatory = (await c.query(`SELECT * FROM mst_user WHERE id=$1`, [user.userId])).rows[0];
    const { pdf, sha256 } = await certificate.render({
      sample: s, computed, readings, reportNo: no, verifyUrl,
      supersedes: prior ? prior.report_no : null,
      signatory: { fullName: signatory.full_name, fullNameTe: signatory.full_name_te },
    });

    const r = (await c.query(
      `INSERT INTO txn_report (report_no, sample_id, issued_by, pdf, pdf_sha256, computed,
                               verify_token, supersedes_id, amend_reason)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [no, sampleId, user.userId, pdf, sha256, JSON.stringify(computed), token,
       prior ? prior.id : null, prior ? s.amend_reason : null])).rows[0];

    if (prior) {
      // The old certificate is not destroyed and not hidden: it is marked
      // superseded, and anyone scanning ITS code is told, and told by what.
      // EVERY earlier superseded version for this sample points at the newest
      // report, so a twice-amended certificate's first QR names the one that
      // is actually current, not a middle link that is itself superseded.
      await c.query(`UPDATE txn_report SET status='SUPERSEDED' WHERE id=$1`, [prior.id]);
      await c.query(
        `UPDATE sys_published_verification SET status='SUPERSEDED', replaced_by=$2
          WHERE (sample_no=$1 AND status='SUPERSEDED') OR verify_token=$3`,
        [s.sample_no, no, prior.verify_token]);
      await c.query(`UPDATE txn_sample SET amend_reason=NULL WHERE id=$1`, [sampleId]);
    }

    await c.query(
      `INSERT INTO sys_published_verification
         (verify_token, report_no, sample_no, lot_mark, customer_name, test_name, issued_on, pdf_sha256)
       VALUES ($1,$2,$3,$4,$5,$6, CURRENT_DATE, $7)`,
      [token, no, s.sample_no, s.lot_mark, s.customer_name, s.test_name, sha256]);

    await samples.transition(c, { sampleId, action: 'ISSUE', user, detail: { report_no: no, sha256 } });
    return { reportId: Number(r.id), reportNo: no, token, sha256, verifyUrl };
  });
}

async function withdraw({ user, sampleId, reason }) {
  return tx(async (c) => {
    await samples.transition(c, { sampleId, action: 'WITHDRAW', user, detail: { reason } });
    const r = (await c.query(
      `UPDATE txn_report SET status='WITHDRAWN', withdrawn_reason=$2, withdrawn_at=now()
        WHERE sample_id=$1 AND status='CURRENT' RETURNING verify_token`, [sampleId, reason])).rows[0];
    if (r) {
      await c.query(
        `UPDATE sys_published_verification SET status='WITHDRAWN' WHERE verify_token=$1`,
        [r.verify_token]);
    }
  });
}

async function pdfFor(reportNoOrToken) {
  const { rows } = await pool.query(
    `SELECT report_no, pdf, pdf_sha256 FROM txn_report WHERE report_no=$1 OR verify_token=$1`,
    [reportNoOrToken]);
  return rows[0] || null;
}

/** Begin an amendment: back to the bench with the reason on record. */
async function amend({ user, sampleId, reason }) {
  return tx(async (c) => {
    await samples.transition(c, { sampleId, action: 'AMEND', user, detail: { reason } });
    // The reason rides in its OWN column to the re-issue. It was first parked
    // in sendback_reason — which the VERIFY step clears, so the reason arrived
    // at the certificate as NULL every single time. Confirmed by review; the
    // regression test now reads it back off the issued report row.
    await c.query(`UPDATE txn_sample SET amend_reason=$2 WHERE id=$1`, [sampleId, reason]);
  });
}

module.exports = { issue, withdraw, amend, pdfFor, VERIFY_BASE };
