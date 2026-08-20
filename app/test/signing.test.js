'use strict';
/**
 * PLN-28's second half: the signature is applied, and applying it does not damage the document.
 *
 * The specific risk is that signing is an INCREMENTAL UPDATE — it appends a revision rather than
 * rewriting the file. If the structure tree, the tagging or the accessibility metadata did not
 * survive that append, the certificate would validate before signing and fail after it, and the
 * only place that shows up is a check like this one.
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const PDFDocument = require('pdfkit');
const { signPdf } = require('../src/documents/sign.js');

const P12 = path.join(__dirname, 'fixtures', 'dev-signing.p12');
const V = path.join(__dirname, '..', 'vendor', 'fonts');
const TELUGU = path.join(V, 'NotoSansTelugu[wdth,wght].ttf');

async function renderTagged() {
  const { useHarfBuzz } = await import('../src/documents/shaping.mjs');
  const doc = new PDFDocument({ autoFirstPage: false, tagged: true });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((r) => doc.on('end', r));
  doc.registerFont('te', TELUGU);
  doc.addPage();
  doc.font('te');
  useHarfBuzz(doc._font.font);
  const root = doc.struct('Document');
  doc.addStructure(root);
  const el = doc.struct('P', [doc.markStructureContent('Span', { actual: 'పట్టు పరీక్ష' })]);
  root.add(el);
  doc.fontSize(16).text('పట్టు పరీక్ష', 60, 60);
  doc.endMarkedContent();
  root.end();
  doc.end();
  await done;
  return Buffer.concat(chunks);
}

test('signing produces a signature and leaves the tagged structure intact', async (t) => {
  if (!fs.existsSync(TELUGU)) t.skip('fonts not vendored');
  if (!fs.existsSync(P12)) t.skip('development signing key not present');

  const unsigned = await renderTagged();
  const signed = await signPdf(unsigned, fs.readFileSync(P12), {
    passphrase: 'test',
    reason: 'Issued test report',
  });
  const s = signed.toString('latin1');

  assert.match(s, /\/ByteRange/, 'no ByteRange — the file carries no signature');
  assert.match(s, /\/SubFilter\s*\/adbe\.pkcs7\.detached/, 'unexpected signature subfilter');

  // The claim is that signing PRESERVES the tagging — so compare before against after.
  // Merely asserting the markers exist in the signed file is not the same thing: an
  // untagged document that was never tagged also "has" whatever markers the renderer
  // happened to emit, and the assertion passes while testing nothing.
  const before = unsigned.toString('latin1');
  const markers = ['StructTreeRoot', 'MarkInfo', 'StructParents'];
  for (const marker of markers) {
    const b = (before.match(new RegExp(marker, 'g')) || []).length;
    const a = (s.match(new RegExp(marker, 'g')) || []).length;
    assert.ok(b > 0, `the unsigned document has no ${marker} — the fixture is not tagged, ` +
      'so this test would prove nothing about signing');
    assert.ok(a >= b,
      `${marker} count fell from ${b} to ${a} across signing: the incremental update ` +
      'damaged the structure tree. The document would validate before signing and fail after.');
  }

  // Signing appends a revision; it must not rewrite the original.
  const revisions = (s.match(/startxref/g) || []).length;
  assert.ok(revisions >= 2,
    `expected an incremental update (2+ revisions), found ${revisions}. ` +
    'Rewriting the file rather than appending would invalidate any earlier signature.');

  assert.ok(signed.length > unsigned.length, 'the signed file is not larger than the original');
});

test('the signature is invisible, as PDF/UA requires', async (t) => {
  if (!fs.existsSync(TELUGU) || !fs.existsSync(P12)) t.skip('fixtures not present');

  const signed = await signPdf(await renderTagged(), fs.readFileSync(P12), { passphrase: 'test' });
  const s = signed.toString('latin1');

  // A visible signature widget fails PDF/UA twice over: the widget is not nested in a Form
  // structure element, and it carries no /TU. The human-readable "Digitally signed by ..."
  // block belongs on the page as ordinary tagged content, drawn before signing.
  const rects = [...s.matchAll(/\/Rect\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/g)];
  const visible = rects.filter(([, x1, y1, x2, y2]) =>
    Math.abs(+x2 - +x1) > 1 && Math.abs(+y2 - +y1) > 1);
  assert.deepEqual(visible.map((m) => m[0]), [],
    'A signature widget has a non-zero rectangle, so it is visible. That fails PDF/UA.\n' +
    'Sign invisibly and draw the visible signature block as tagged page content instead.');
});
