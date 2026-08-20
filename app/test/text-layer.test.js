'use strict';
/**
 * The acceptance test the specification's Phase 0 requires before the document
 * component is written.
 *
 * It exists because the defect it guards is INVISIBLE to every automated PDF validator:
 * veraPDF passes a certificate whose Telugu is unreadable. Without this test the failure
 * surfaces when a customer cannot find their own name in a certificate — or, worse, does
 * not surface at all, because nobody at the counter reads the PDF's text layer.
 *
 * Run: npm test
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const PDFDocument = require('pdfkit');
const { writeText, needsActualText } = require('../src/documents/indic-text.js');

// The vendored Noto fonts — the ones the laboratory will actually ship. Every finding in
// README.md is font-dependent, and all of them came out DIFFERENTLY against the macOS system
// fonts this test first used. Do not point these paths at a system font to make the suite go
// green; that is precisely how the shaping crash stayed hidden.
const path_ = require('node:path');
const V = path_.join(__dirname, '..', 'vendor', 'fonts');
const FONTS = {
  telugu: [path_.join(V, 'NotoSansTelugu[wdth,wght].ttf'), null],
  devanagari: [path_.join(V, 'NotoSansDevanagari[wdth,wght].ttf'), null],
};

// Words chosen because each one broke something during investigation.
const LANG = { telugu: 'te-IN', devanagari: 'hi-IN' };
const CASES = [
  ['telugu', 'ప్రయోగశాల'],      // "laboratory"
  ['telugu', 'పట్టు'],           // "silk" — extracted as పటు్ట, reordered
  ['telugu', 'శ్రీ ధర్మవరం'],     // the unit's own town
  ['telugu', 'మూర్తి'],          // a common surname — extracted as మూరి్త
  ['telugu', 'కీర్తి'],
  ['devanagari', 'बोर्ड'],       // extracted as बोरड — virama dropped entirely
  ['devanagari', 'प्रतिवेदन'],     // "report" — conjunct lost
  ['devanagari', 'केंद्रीय रेशम बोर्ड'], // "Central Silk Board"
];

function missingFonts() {
  return Object.values(FONTS).filter(([p]) => !fs.existsSync(p)).map(([p]) => p);
}

async function buildPdf(outPath) {
  // shaping.mjs is ESM (harfbuzzjs is ESM-only), so it is pulled in dynamically.
  // Without it this function THROWS rather than producing a bad PDF — fontkit cannot
  // render Telugu against the vendored fonts at all.
  const { useHarfBuzz } = await import('../src/documents/shaping.mjs');
  const doc = new PDFDocument({ autoFirstPage: false, tagged: true });
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);
  const root = doc.struct('Document');
  doc.addStructure(root);
  doc.addPage();

  // Route every font through HarfBuzz before a single glyph is drawn.
  for (const [file] of Object.values(FONTS)) {
    doc.font(file);
    useHarfBuzz(doc._font.font);
  }

  let y = 60;
  for (const [script, str] of CASES) {
    const [file] = FONTS[script];
    doc.font(file).fontSize(18);
    writeText(doc, root, str, { x: 60, y, lang: LANG[script] });
    y += 40;
  }
  root.end();
  doc.end();
  return new Promise((resolve) => stream.on('finish', resolve));
}

/** Inflate every content stream and return the concatenated text. */
function inflateStreams(pdfPath) {
  const buf = fs.readFileSync(pdfPath);
  const latin = buf.toString('latin1');
  let out = '';
  const re = /stream\r?\n/g;
  let m;
  while ((m = re.exec(latin))) {
    const start = m.index + m[0].length;
    const end = latin.indexOf('endstream', start);
    if (end < 0) continue;
    try {
      out += zlib.inflateSync(buf.subarray(start, end)).toString('latin1');
    } catch {
      /* not a Flate stream; ignore */
    }
  }
  return out;
}

/** Decode pdfkit's UTF-16BE-with-BOM literal string back to JS. */
function decodeActualText(literal) {
  const bytes = [];
  for (let i = 0; i < literal.length; i++) {
    const ch = literal[i];
    if (ch === '\\') {
      const next = literal[i + 1];
      const octal = literal.slice(i + 1, i + 4);
      if (/^[0-7]{3}$/.test(octal)) { bytes.push(parseInt(octal, 8)); i += 3; continue; }
      const esc = { n: 10, r: 13, t: 9, b: 8, f: 12, '(': 40, ')': 41, '\\': 92 }[next];
      if (esc !== undefined) { bytes.push(esc); i += 1; continue; }
      continue;
    }
    bytes.push(ch.charCodeAt(0) & 0xff);
  }
  const b = Buffer.from(bytes);
  assert.equal(b[0], 0xfe, 'ActualText must start with a UTF-16BE byte-order mark');
  assert.equal(b[1], 0xff, 'ActualText must start with a UTF-16BE byte-order mark');
  return b.subarray(2).swap16().toString('utf16le');
}

const OUT = path.join(__dirname, 'out-text-layer.pdf');

test('every Indic string is recoverable from the PDF text layer', async (t) => {
  const missing = missingFonts();
  if (missing.length) t.skip(`fonts not on this machine: ${missing.join(', ')}`);

  await buildPdf(OUT);
  const content = inflateStreams(OUT);

  const found = [...content.matchAll(/\/ActualText\s*\(((?:[^()\\]|\\.)*)\)/g)]
    .map((m) => decodeActualText(m[1]));

  const expected = CASES.map(([, s]) => s);
  assert.deepEqual(
    found, expected,
    'Each Indic run must carry /ActualText holding the LOGICAL string.\n' +
    'A mismatch means the certificate cannot be searched or read aloud correctly —\n' +
    'note that veraPDF passes this defect, which is why this assertion exists.'
  );
});

/**
 * The second half of the fix. ActualText tells a CONFORMING reader what the characters are;
 * ToUnicode is what everything else falls back on, including plain text search and copy-paste
 * in simpler viewers. Both must be right, and they are produced by different mechanisms:
 * ActualText by indic-text.js, ToUnicode by the shaping bridge attributing each cluster's
 * original codepoints to its first glyph.
 *
 * Without the bridge this map is built from post-shaping glyphs and records visual order —
 * `बोर्ड` becomes `बोरड`, losing the virama outright.
 */
test('the ToUnicode map records logical order, not visual order', async (t) => {
  const missing = missingFonts();
  if (missing.length) t.skip(`fonts not vendored: ${missing.join(', ')}`);

  await buildPdf(OUT);
  const content = inflateStreams(OUT);

  // Destinations appear as <hhhh> for one character or [<hhhh> <hhhh…> …] for a range.
  const hexToStr = (h) => {
    let out = '';
    for (let i = 0; i + 3 < h.length; i += 4) out += String.fromCharCode(parseInt(h.slice(i, i + 4), 16));
    return out;
  };
  // Destinations separate their code units with spaces — <092c 094b> — so whitespace has to
  // be allowed in the match and stripped before decoding. Requiring contiguous hex silently
  // matches only the single-character entries and makes this test pass for the wrong reason.
  // Scope to the bfchar/bfrange sections. Page content streams also carry <hex> strings —
  // the glyph sequence itself — and matching those makes these assertions pass regardless of
  // what the ToUnicode map says, which is exactly the trap this test exists to avoid.
  const cmapSections = [...content.matchAll(/begin(?:bfchar|bfrange)([\s\S]*?)end(?:bfchar|bfrange)/g)]
    .map((m) => m[1])
    .join('');
  const mapped = [...cmapSections.matchAll(/<([0-9a-fA-F][0-9a-fA-F\s]*)>/g)]
    .map((m) => hexToStr(m[1].replace(/\s+/g, '')))
    .join('');

  // The CMap array is indexed by glyph id, not by position in the text, so the map cannot be
  // concatenated back into the original string. What it CAN prove is that no character was
  // lost in shaping — which is exactly the defect that turns बोर्ड into बोरड — and that
  // clusters are mapped as units rather than one glyph at a time.
  // ToUnicode maps GLYPH -> string, so one glyph id can carry only one mapping. Where the
  // same glyph begins two different clusters — ర starts both ర్మ and రం in శ్రీ ధర్మవరం — only
  // one of them can be recorded, and a character is unavoidably lost from this map. That is a
  // structural limit of ToUnicode, not a defect in the shaping bridge, and it is exactly why
  // /ActualText is the authoritative mechanism and is asserted separately above.
  //
  // So the guarantee tested here is the COMBINED one: every character is recoverable from
  // ActualText or ToUnicode. What must never happen is a character present in neither.
  const actualText = [...content.matchAll(/\/ActualText\s*\(((?:[^()\\]|\\.)*)\)/g)]
    .map((m) => decodeActualText(m[1]))
    .join('');
  const recoverable = new Set([...mapped, ...actualText]);

  const dropped = [];
  for (const [, str] of CASES) {
    for (const ch of str) {
      if (ch.trim() && !recoverable.has(ch)) {
        dropped.push(`${ch} (U+${ch.codePointAt(0).toString(16).toUpperCase()}) from ${str}`);
      }
    }
  }
  assert.deepEqual(
    dropped, [],
    'These characters are recoverable from neither ActualText nor ToUnicode, so the text is\n' +
    'genuinely lost — the defect that turns बोर्ड into बोरड, where the virama vanishes.'
  );

  // ToUnicode must carry the viramas ON ITS OWN. Checking the combined set here would let
  // ActualText mask a shaping regression: remove cluster attribution and the combined test
  // still passes, because ActualText covers every character by itself.
  const inToUnicode = new Set([...mapped]);
  for (const virama of ['\u0C4D', '\u094D']) {
    assert.ok(inToUnicode.has(virama),
      `The virama U+${virama.codePointAt(0).toString(16).toUpperCase()} is absent from the\n` +
      `ToUnicode map. This is the बोर्ड -> बोरड defect. Check cluster attribution in shaping.mjs.`);
  }

  // A per-glyph map would hold only single characters. Multi-codepoint destinations are the
  // signature of cluster-level attribution, which is what preserves logical order.
  const clusters = [...cmapSections.matchAll(/<([0-9a-fA-F][0-9a-fA-F\s]*)>/g)]
    .filter((m) => m[1].replace(/\s+/g, '').length >= 8);
  assert.ok(
    clusters.length > 0,
    'No multi-codepoint mappings found. The map looks per-glyph, which means the shaping\n' +
    'bridge is not attributing whole clusters and logical order is not preserved.'
  );
});

test('Latin text is not given a redundant ActualText override', () => {
  assert.equal(needsActualText('Raw Silk Yarn / Count'), false);
  assert.equal(needsActualText('NABLT0726AD18713'), false);
  // Marking everything would hide a future shaping regression behind a hardcoded answer.
});

test('fontkit still crashes on Telugu, so the HarfBuzz bridge is still required', (t) => {
  const missing = missingFonts();
  if (missing.length) t.skip(`fonts not vendored: ${missing.join(', ')}`);

  // This asserts a DEFECT, deliberately. fontkit 2.0.4 throws
  //   TypeError: Cannot read properties of null (reading 'xCoordinate')
  // on these strings against the vendored Noto fonts — an uncaught exception on the report
  // path, not merely bad shaping. src/documents/shaping.mjs exists to route around it.
  //
  // If this test ever FAILS, that is good news: fontkit has been fixed, and the bridge can
  // be reconsidered. Do not delete this test — it is what tells you that day has come.
  const fontkit = require('fontkit');
  const font = fontkit.openSync(FONTS.telugu[0]);
  const crashers = ['ప్రయోగశాల', 'శ్రీ', 'ప్రు', 'శ్రీ ధర్మవరం'];
  const stillCrashes = crashers.filter((s) => {
    try { font.layout(s); return false; } catch { return true; }
  });
  assert.deepEqual(
    stillCrashes, crashers,
    'fontkit no longer crashes on some of these. Re-evaluate whether shaping.mjs is needed,\n' +
    'and re-run the extraction checks in README.md before removing anything.'
  );
});
