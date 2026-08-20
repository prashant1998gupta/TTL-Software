'use strict';
/**
 * Renders the issued certificate through the PROVEN document path — the same
 * createDocument / writeText / HarfBuzz / /CIDSet-strip sequence the PDF/UA
 * test suite validates at 106/106 rules — then signs it.
 *
 * This is the PLAIN (non-accredited) template, which M8-73 makes the primary
 * one: every item on the unit's current catalogue is Non-NABL, so no NABL
 * symbol and no ULR number appear. The accredited template is a later,
 * smaller stream behind a per-item flag.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const QRCode = require('qrcode');

const { createDocument } = require('../../documents/document');
const { writeText, writeArtifact, needsActualText } = require('../../documents/indic-text');
const { stripCidSet } = require('../../documents/cidset-workaround');
const { signPdf } = require('../../documents/sign');

const F = path.join(__dirname, '..', '..', '..', 'vendor', 'fonts');
const FONT = {
  te: path.join(F, 'NotoSansTelugu[wdth,wght].ttf'),
  dv: path.join(F, 'NotoSansDevanagari[wdth,wght].ttf'),
  latin: path.join(F, 'NotoSans[wdth,wght].ttf'),
};
// The signing credential: the real PKCS#12 via LIMS_P12 when CSB provides it,
// the development key otherwise — which is marked NOT FOR ISSUE in its own CN.
const P12_PATH = process.env.LIMS_P12 ||
  path.join(__dirname, '..', '..', '..', 'test', 'fixtures', 'dev-signing.p12');
const P12_PASSPHRASE = process.env.LIMS_P12_PASSPHRASE || 'test';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * @returns {Promise<{pdf: Buffer, sha256: string}>} the signed, frozen file
 */
async function render({ sample, computed, readings, reportNo, verifyUrl, signatory, supersedes }) {
  const { useHarfBuzz } = await import('../../documents/shaping.mjs');
  const doc = createDocument({
    title: `Test Report ${reportNo} — Silk Testing Laboratory, Dharmavaram`,
    lang: 'en-IN',
  });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((r) => doc.on('end', r));

  for (const k of Object.keys(FONT)) { doc.registerFont(k, FONT[k]); }
  doc.addPage({ size: 'A4', margin: 54 });
  for (const k of Object.keys(FONT)) { doc.font(k); useHarfBuzz(doc._font.font); }

  const root = doc.struct('Document');
  doc.addStructure(root);
  const W = doc.page.width - 108;

  // ---- letterhead --------------------------------------------------------
  doc.font('dv').fontSize(15);
  writeText(doc, root, 'केंद्रीय रेशम बोर्ड', { lang: 'hi-IN', tag: 'H1', align: 'center', width: W });
  doc.font('latin').fontSize(13).moveDown(0.1);
  writeText(doc, root, 'CENTRAL SILK BOARD — Silk Testing Laboratory', { lang: 'en-IN', align: 'center', width: W });
  doc.font('te').fontSize(10.5).moveDown(0.1);
  writeText(doc, root, 'ప్రాంతీయ పట్టు సాంకేతిక పరిశోధనా కేంద్రం, ధర్మవరం', { lang: 'te-IN', align: 'center', width: W });
  doc.font('latin').fontSize(9).fillColor('#444').moveDown(0.1);
  writeText(doc, root, 'Regional Silk Technological Research Station, Regatipalli Road, Dharmavaram, Andhra Pradesh',
    { lang: 'en-IN', align: 'center', width: W });
  doc.fillColor('black');

  writeArtifact(doc, () => {
    doc.moveTo(54, doc.y + 10).lineTo(doc.page.width - 54, doc.y + 10).lineWidth(1.2).stroke('#8c1d2f');
  });
  doc.moveDown(1.4);

  doc.font('latin').fontSize(13);
  writeText(doc, root, supersedes ? 'AMENDED TEST REPORT' : 'TEST REPORT',
    { lang: 'en-IN', tag: 'H2', align: 'center', width: W, characterSpacing: 2 });
  if (supersedes) {
    doc.font('latin').fontSize(9).fillColor('#8c1d2f').moveDown(0.2);
    writeText(doc, root,
      `This report amends and supersedes ${supersedes}, which is no longer valid.`,
      { lang: 'en-IN', align: 'center', width: W });
    doc.fillColor('black');
  }
  doc.moveDown(0.8);

  // ---- particulars -------------------------------------------------------
  const rows = [
    ['Report No.', reportNo, 'Date of issue', fmtDate(new Date())],
    ['Sample No.', sample.sample_no, 'Date of receipt', fmtDate(sample.registered_at)],
    ['Customer', sample.customer_name, 'Lot mark', sample.lot_mark],
    ['Test', sample.test_name, 'Declared denier', sample.declared_denier],
    ['Quantity', `${sample.bales} bales, ${sample.books} books` + (sample.weight_kg ? `, ${sample.weight_kg} kg` : ''),
     'Balance used', `${sample.equipment_code} (calibrated to ${fmtDate(sample.calibrated_to)})`],
  ];
  doc.font('latin').fontSize(10);
  const table = doc.struct('Table'); root.add(table);
  for (const [l1, v1, l2, v2] of rows) {
    const tr = doc.struct('TR'); table.add(tr);
    const y = doc.y;
    const cell = (tag, text, x, w, bold) => {
      // A TH without Headers/IDs must carry Scope (ISO 14289-1, 7.5): these
      // label cells head their row. Found by veraPDF on the first real issue.
      const opts = tag === 'TH' ? { scope: 'Row' } : {};
      // A customer or lot name may arrive in Telugu. Routed through the Latin
      // face it renders .notdef boxes on a signed certificate — so Indic runs
      // switch face and carry /ActualText and their language, exactly as
      // ARC-47/ARC-51 require of every issued document.
      const str = String(text);
      const indic = needsActualText(str);
      const span = indic ? { actual: str, lang: 'te-IN' } : {};
      const el = doc.struct(tag, opts, [doc.markStructureContent('Span', span)]);
      tr.add(el);
      doc.font(indic ? 'te' : 'latin').fontSize(bold ? 9 : 10)
         .fillColor(bold ? '#666' : 'black')
         .text(str, x, y, { width: w });
      doc.endMarkedContent();
    };
    cell('TH', l1, 54, 92, true);   cell('TD', v1, 150, 176);
    cell('TH', l2, 336, 100, true); cell('TD', v2, 440, 100);
    doc.y = y + Math.max(16, doc.heightOfString(String(v1), { width: 176 }) + 3);
    doc.x = 54;
  }
  doc.moveDown(0.8);

  // ---- results -----------------------------------------------------------
  doc.font('latin').fontSize(11);
  writeText(doc, root, 'RESULTS', { lang: 'en-IN', tag: 'H3' });
  doc.moveDown(0.3);
  const res = [
    ['Number of skeins tested', String(computed.n)],
    ['Average denier', String(computed.averageDenier)],
    ['Size deviation', String(computed.sizeDeviation)],
    ['Coefficient of variation', computed.cvPercent + ' %'],
    ['Finest / coarsest skein', computed.minDenier + ' / ' + computed.maxDenier + ' d'],
  ];
  const rt = doc.struct('Table'); root.add(rt);
  for (const [k, v] of res) {
    const tr = doc.struct('TR'); rt.add(tr);
    const y = doc.y;
    const th = doc.struct('TH', { scope: 'Row' }, [doc.markStructureContent('Span', {})]); tr.add(th);
    doc.font('latin').fontSize(10.5).text(k, 54, y, { width: 260 }); doc.endMarkedContent();
    const td = doc.struct('TD', [doc.markStructureContent('Span', {})]); tr.add(td);
    doc.font('latin').fontSize(10.5).text(v, 330, y, { width: 150 }); doc.endMarkedContent();
    doc.y = y + 17; doc.x = 54;
  }
  doc.moveDown(0.4);
  doc.font('latin').fontSize(8.5).fillColor('#555');
  writeText(doc, root,
    `Each of the ${computed.n} sizing skeins of ${computed.skeinMetres} m was weighed individually; ` +
    `every original reading is retained in the laboratory record. Deviation uses divisor ${computed.sdDivisor}.`,
    { lang: 'en-IN', width: W });
  doc.fillColor('black').moveDown(1);

  // ---- declarations ------------------------------------------------------
  doc.fontSize(8.5).fillColor('#555');
  writeText(doc, root,
    'This report relates only to the sample as received and identified above. It shall not be ' +
    'reproduced except in full without the written approval of the laboratory. This test is not ' +
    'covered by the laboratory’s NABL accreditation scope.',
    { lang: 'en-IN', width: W });
  doc.fillColor('black').moveDown(1.2);

  // ---- signature block + QR ---------------------------------------------
  const qrPng = await QRCode.toBuffer(verifyUrl, { errorCorrectionLevel: 'M', margin: 1, width: 220 });
  const y0 = doc.y;
  const fig = doc.struct('Figure', {
    alt: 'QR code. Scan to confirm this certificate is genuine and current.',
    bbox: [54, y0, 54 + 88, y0 + 88],
  }, [doc.markStructureContent('Figure', { alt: 'QR verification code' })]);
  root.add(fig);
  doc.image(qrPng, 54, y0, { width: 88 });
  doc.endMarkedContent();

  doc.font('latin').fontSize(7.5).fillColor('#555');
  writeText(doc, root, 'Scan to verify, or visit the address printed below.', { lang: 'en-IN', x: 54, y: y0 + 92, width: 150 });

  doc.font('latin').fontSize(10).fillColor('black');
  writeText(doc, root, 'Digitally signed by', { lang: 'en-IN', x: 360, y: y0 + 18, width: 180 });
  doc.font('latin').fontSize(11);
  writeText(doc, root, signatory.fullName, { lang: 'en-IN', x: 360, y: y0 + 34, width: 180 });
  if (signatory.fullNameTe) {
    doc.font('te').fontSize(9.5);
    writeText(doc, root, signatory.fullNameTe, { lang: 'te-IN', x: 360, y: y0 + 50, width: 180 });
  }
  doc.font('latin').fontSize(8.5).fillColor('#555');
  writeText(doc, root, 'Unit In-Charge, RSTRS Dharmavaram', { lang: 'en-IN', x: 360, y: y0 + 66, width: 180 });
  doc.fillColor('black');

  // ---- footer: verify URL + fingerprint (artifact page furniture) --------
  writeArtifact(doc, () => {
    doc.font('latin').fontSize(7).fillColor('#777')
       .text(verifyUrl, 54, 790, { width: W, align: 'left' });
  });

  root.end();
  doc.end();
  await done;

  const rendered = Buffer.concat(chunks);
  const { pdf: stripped } = stripCidSet(rendered);
  const signed = await signPdf(stripped, fs.readFileSync(P12_PATH), {
    passphrase: P12_PASSPHRASE,
    reason: `Issued test report ${reportNo}`,
    name: signatory.fullName,
  });
  const sha256 = crypto.createHash('sha256').update(signed).digest('hex');
  return { pdf: signed, sha256 };
}

module.exports = { render };
