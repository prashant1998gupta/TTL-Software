'use strict';
/**
 * PLN-28's golden-file requirement: the glyph identifiers and advances written into the page
 * must be exactly what harfbuzzjs returns for the same string in the same font.
 *
 * Every other test here checks a PROPERTY — does it extract, is it tagged, is it signed. Those
 * all still pass if shaping quietly changes. This one is the only check that would notice a
 * harfbuzzjs upgrade, a font revision, or a change to cluster attribution altering what a
 * certificate actually says.
 *
 * A FAILURE HERE IS NOT AUTOMATICALLY A BUG. It means something moved and a person must look.
 * Regenerate with:  UPDATE_GOLDEN=1 npm test
 * Do that only after deciding the new output is correct — never to make the suite go green.
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const V = path.join(__dirname, '..', 'vendor', 'fonts');
const TE = path.join(V, 'NotoSansTelugu[wdth,wght].ttf');
const DV = path.join(V, 'NotoSansDevanagari[wdth,wght].ttf');
const GOLDEN = path.join(__dirname, 'fixtures', 'shaping-golden.json');

// Each entry earned its place by breaking something during investigation.
const CASES = [
  ['te-laboratory', TE, 'ప్రయోగశాల'],
  ['te-silk', TE, 'పట్టు'],
  ['te-town', TE, 'శ్రీ ధర్మవరం'],
  ['te-surname-murthy', TE, 'మూర్తి'],
  ['te-surname-keerthi', TE, 'కీర్తి'],
  ['te-conjunct-pru', TE, 'ప్రు'],
  ['dv-board', DV, 'बोर्ड'],
  ['dv-report', DV, 'प्रतिवेदन'],
  ['dv-csb', DV, 'केंद्रीय रेशम बोर्ड'],
];

test('shaped output matches the golden file', async (t) => {
  if (!fs.existsSync(TE) || !fs.existsSync(DV)) t.skip('fonts not vendored');

  const { captureAll } = await import('../src/documents/golden.mjs');
  const actual = captureAll(CASES);

  if (process.env.UPDATE_GOLDEN === '1' || !fs.existsSync(GOLDEN)) {
    fs.writeFileSync(GOLDEN, JSON.stringify(actual, null, 2) + '\n');
    if (process.env.UPDATE_GOLDEN !== '1') {
      t.diagnostic(`No golden file existed; wrote ${path.basename(GOLDEN)}. Commit it.`);
      return;
    }
    t.diagnostic('Golden file regenerated on request. Review the diff before committing.');
    return;
  }

  const expected = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));

  // Compare per string, so a failure names the word rather than dumping the whole corpus.
  for (const [label] of CASES) {
    assert.deepEqual(
      actual[label], expected[label],
      `Shaping changed for "${label}" (${actual[label]?.text}).\n` +
      'Something moved: harfbuzzjs, the font file, or cluster attribution in shaping.mjs.\n' +
      'Decide whether the NEW output is correct before regenerating — a golden file updated\n' +
      'to silence a failure is worse than no golden file at all.\n' +
      'Regenerate deliberately with: UPDATE_GOLDEN=1 npm test'
    );
  }

  // A golden file that has drifted out of step with the corpus stops covering the new cases.
  assert.deepEqual(
    Object.keys(actual).sort(), Object.keys(expected).sort(),
    'The golden file and the test corpus no longer cover the same strings.'
  );
});
