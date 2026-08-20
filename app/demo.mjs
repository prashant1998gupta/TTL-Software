/**
 * Produces a sample certificate you can open and check by hand.
 *   node demo.mjs   ->   demo-certificate.pdf
 *
 * This is a DEMONSTRATION of the document path, not a real report template. It exists so the
 * Telugu can be judged by a person: no assertion in the test suite can tell you whether the
 * conjuncts look right to a Telugu reader.
 *
 * It goes through the same conforming path the tests do — createDocument for the catalog-level
 * PDF/UA requirements, HarfBuzz for shaping, writeText for /ActualText and per-run language,
 * the /CIDSet workaround, then the signature. If this file were built any other way it would
 * demonstrate something the system does not actually produce.
 */
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { createDocument } = require('./src/documents/document.js');
const { writeText, writeArtifact } = require('./src/documents/indic-text.js');
const { stripCidSet } = require('./src/documents/cidset-workaround.js');
const { signPdf } = require('./src/documents/sign.js');
const { useHarfBuzz } = await import('./src/documents/shaping.mjs');

const F = 'vendor/fonts/';
const doc = createDocument({ title: 'Silk Test Report — Specimen', lang: 'en-IN' });
const out = fs.createWriteStream('demo-certificate.pdf');
doc.pipe(out);
doc.registerFont('te', F + 'NotoSansTelugu[wdth,wght].ttf');
doc.registerFont('dv', F + 'NotoSansDevanagari[wdth,wght].ttf');
doc.registerFont('latin', F + 'NotoSans[wdth,wght].ttf');
doc.addPage();
for (const f of ['te', 'dv', 'latin']) { doc.font(f); useHarfBuzz(doc._font.font); }

const root = doc.struct('Document');
doc.addStructure(root);

doc.font('dv').fontSize(16);
writeText(doc, root, 'केंद्रीय रेशम बोर्ड', { lang: 'hi-IN', tag: 'H1' });
doc.font('te').fontSize(13);
writeText(doc, root, 'ప్రయోగశాల ప్రతివేదన', { lang: 'te-IN' });
doc.moveDown(0.5);
doc.fontSize(11);
for (const line of ['శ్రీ ధర్మవరం', 'నమూనా: పట్టు', 'పరీక్షకుడు: మూర్తి', 'తనిఖీ: కీర్తి']) {
  writeText(doc, root, line, { lang: 'te-IN' });
}
doc.moveDown(0.5);
doc.font('dv').fontSize(11);
writeText(doc, root, 'प्रतिवेदन — बोर्ड', { lang: 'hi-IN' });
doc.moveDown(1);
doc.font('latin').fontSize(10);
writeText(doc, root, 'Sample: Raw Silk Yarn   |   Report No. NABLT0726AD18713-26-00000001', { lang: 'en-IN' });

// The visible "digitally signed" block is ordinary tagged content. The signature itself is
// invisible: a visible widget fails PDF/UA on two counts and nothing in Node fixes that.
doc.moveDown(1.5);
doc.fontSize(9);
writeText(doc, root, 'Digitally signed by the Authorised Signatory', { lang: 'en-IN' });

writeArtifact(doc, () => { doc.font('latin').fontSize(8).text('Page 1', 60, 780); });

root.end();
doc.end();
await new Promise((r) => out.on('finish', r));

const { pdf, removed } = stripCidSet(fs.readFileSync('demo-certificate.pdf'));
const signed = await signPdf(pdf, fs.readFileSync('test/fixtures/dev-signing.p12'), {
  passphrase: 'test',
  reason: 'Specimen — not an issued report',
});
fs.writeFileSync('demo-certificate.pdf', signed);
console.log(`wrote demo-certificate.pdf (signed, ${removed} /CIDSet stripped)`);
