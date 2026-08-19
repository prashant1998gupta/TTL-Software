/**
 * Produces a sample certificate you can open and check by hand.
 * Run: node demo.mjs   ->   demo-certificate.pdf
 *
 * This is a DEMONSTRATION of the text path, not a real report template. It exists so the
 * Telugu handling can be judged by a person rather than only by an assertion.
 */
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { useHarfBuzz } from './src/documents/shaping.mjs';

const TE = 'vendor/fonts/NotoSansTelugu[wdth,wght].ttf';
const DV = 'vendor/fonts/NotoSansDevanagari[wdth,wght].ttf';

const doc = new PDFDocument({ autoFirstPage: false, tagged: true, margin: 50 });
const out = fs.createWriteStream('demo-certificate.pdf');
doc.pipe(out);
doc.registerFont('te', TE);
doc.registerFont('dv', DV);
doc.addPage();

// Route both fonts through HarfBuzz before anything is drawn. Without this the next
// doc.text() call with Telugu throws outright.
for (const f of ['te', 'dv']) { doc.font(f); useHarfBuzz(doc._font.font); }

const root = doc.struct('Document');
doc.addStructure(root);

const line = (font, size, text, gap = 8) => {
  const el = doc.struct('P', [doc.markStructureContent('Span', { actual: text })]);
  root.add(el);
  doc.font(font).fontSize(size).text(text);
  doc.endMarkedContent();
  doc.moveDown(gap / 10);
};

line('dv', 16, 'केंद्रीय रेशम बोर्ड');
line('te', 14, 'ప్రయోగశాల ప్రతివేదన');
doc.moveDown(0.5);
line('te', 11, 'శ్రీ ధర్మవరం');
line('te', 11, 'నమూనా: పట్టు');
line('te', 11, 'పరీక్షకుడు: మూర్తి');
line('te', 11, 'తనిఖీ: కీర్తి');
doc.moveDown(0.5);
line('dv', 11, 'प्रतिवेदन — बोर्ड');
doc.moveDown(1);

// Latin content deliberately mixed in: it must keep working alongside the Indic path.
const el = doc.struct('P', [doc.markStructureContent('Span', {})]);
root.add(el);
doc.font('Helvetica').fontSize(10)
   .text('Sample: Raw Silk Yarn  |  Report: NABLT0726AD18713-26-00000001');
doc.endMarkedContent();

root.end();
doc.end();
await new Promise((r) => out.on('finish', r));
console.log('wrote demo-certificate.pdf');
