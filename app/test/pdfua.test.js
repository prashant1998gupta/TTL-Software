'use strict';
/**
 * PLN-28's last requirement: veraPDF -f ua1 passes.
 *
 * This test is the reason the others can be trusted. Tagging, ActualText and correct shaping
 * are all necessary and NONE of them is sufficient: the first document this suite produced had
 * a complete structure tree, correct ActualText and byte-perfect shaping, and still failed
 * PDF/UA-1 on four rules and twenty-five checks — missing XMP metadata, no DisplayDocTitle, and
 * no determinable natural language for either page content or the ActualText spans.
 *
 * None of that is visible without a validator. That is the whole argument for this test.
 *
 * veraPDF is a Java tool and is NOT vendored — the laboratory server never runs it; only the
 * build machine does. Point VERAPDF at the executable, or the test skips. Skipping is loud
 * on purpose: a silent skip here would let a non-conforming certificate ship.
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const VERAPDF = process.env.VERAPDF;
const V = path.join(__dirname, '..', 'vendor', 'fonts');
const TE = path.join(V, 'NotoSansTelugu[wdth,wght].ttf');
const DV = path.join(V, 'NotoSansDevanagari[wdth,wght].ttf');
const LATIN = path.join(V, 'NotoSans[wdth,wght].ttf');
const OUT = path.join(__dirname, 'out-pdfua.pdf');

async function build() {
  const { createDocument } = require('../src/documents/document.js');
  const { writeText, writeArtifact } = require('../src/documents/indic-text.js');
  const { useHarfBuzz } = await import('../src/documents/shaping.mjs');

  const doc = createDocument({ title: 'Silk Test Report — Specimen', lang: 'en-IN' });
  const stream = fs.createWriteStream(OUT);
  doc.pipe(stream);
  doc.registerFont('te', TE);
  doc.registerFont('dv', DV);
  // A standard-14 font cannot be embedded, and PDF/UA requires every font program to be
  // embedded (7.21.4.1). Helvetica therefore fails validation; vendored Noto Sans does not.
  doc.registerFont('latin', LATIN);
  doc.addPage();
  for (const f of ['te', 'dv']) { doc.font(f); useHarfBuzz(doc._font.font); }

  const root = doc.struct('Document');
  doc.addStructure(root);

  doc.font('dv').fontSize(16);
  writeText(doc, root, 'केंद्रीय रेशम बोर्ड', { lang: 'hi-IN', tag: 'H1' });
  doc.font('te').fontSize(12);
  writeText(doc, root, 'ప్రయోగశాల ప్రతివేదన', { lang: 'te-IN' });
  writeText(doc, root, 'శ్రీ ధర్మవరం', { lang: 'te-IN' });
  writeText(doc, root, 'పట్టు', { lang: 'te-IN' });
  doc.font('latin').fontSize(10);
  writeText(doc, root, 'Report No. NABLT0726AD18713-26-00000001', { lang: 'en-IN' });

  // Page furniture must be an artifact or it fails 7.1 t3 as untagged real content.
  writeArtifact(doc, () => {
    doc.font('latin').fontSize(8).text('Page 1', 60, 760);
  });

  root.end();
  doc.end();
  await new Promise((r) => stream.on('finish', r));

  // ARC-49: pdfkit writes a /CIDSet that PDF/UA does not require and that disagrees with the
  // embedded subset. Strip it in place; byte offsets are preserved so the xref stays valid.
  const { stripCidSet } = require('../src/documents/cidset-workaround.js');
  const { pdf, removed } = stripCidSet(fs.readFileSync(OUT));
  fs.writeFileSync(OUT, pdf);
  return removed;
}

test('the rendered certificate passes veraPDF PDF/UA-1', async (t) => {
  if (!fs.existsSync(TE) || !fs.existsSync(DV)) t.skip('fonts not vendored');
  if (!VERAPDF || !fs.existsSync(VERAPDF)) {
    t.skip('VERAPDF not set — set VERAPDF=/path/to/verapdf to run conformance. ' +
           'Until this runs, PDF/UA conformance is UNVERIFIED.');
    return;
  }

  await build();

  let xml;
  try {
    xml = execFileSync(VERAPDF, ['-f', 'ua1', OUT], { encoding: 'utf8', maxBuffer: 32e6 });
  } catch (err) {
    // veraPDF exits non-zero when a file is non-compliant; the report is still on stdout.
    xml = err.stdout || '';
  }

  const failed = [...xml.matchAll(/clause="([^"]+)" testNumber="(\d+)"[^>]*status="failed"[^>]*failedChecks="(\d+)"/g)]
    .map((m) => `ISO 14289-1 clause ${m[1]} test ${m[2]} (${m[3]} checks)`);

  assert.match(xml, /isCompliant="true"/,
    'The certificate does not conform to PDF/UA-1. Failed rules:\n  ' +
    (failed.join('\n  ') || '(none parsed — check the raw report)') +
    '\nThis is the accessibility conformance NFR-70 requires, and no other test detects it.');
});

test('the SIGNED certificate still passes veraPDF PDF/UA-1', async (t) => {
  if (!fs.existsSync(TE) || !fs.existsSync(DV)) t.skip('fonts not vendored');
  if (!VERAPDF || !fs.existsSync(VERAPDF)) {
    t.skip('VERAPDF not set — signed-file conformance is UNVERIFIED');
    return;
  }

  // This is the assertion that matters most, because the SIGNED file is what the laboratory
  // issues. Signing is an incremental update, so conformance before signing proves nothing
  // about the document a customer actually receives.
  const { signPdf } = require('../src/documents/sign.js');
  await build();
  const signed = await signPdf(
    fs.readFileSync(OUT),
    fs.readFileSync(path.join(__dirname, 'fixtures', 'dev-signing.p12')),
    { passphrase: 'test', reason: 'Issued test report' }
  );
  const signedPath = path.join(__dirname, 'out-pdfua-signed.pdf');
  fs.writeFileSync(signedPath, signed);

  let xml;
  try {
    xml = execFileSync(VERAPDF, ['-f', 'ua1', signedPath], { encoding: 'utf8', maxBuffer: 32e6 });
  } catch (err) {
    xml = err.stdout || '';
  }
  const failed = [...xml.matchAll(/clause="([^"]+)" testNumber="(\d+)"[^>]*status="failed"/g)]
    .map((m) => `clause ${m[1]} test ${m[2]}`);

  assert.match(xml, /isCompliant="true"/,
    'The SIGNED certificate does not conform to PDF/UA-1, though the unsigned one does.\n' +
    'Signing has damaged the document. Failed rules:\n  ' + (failed.join('\n  ') || '(none parsed)'));
});
