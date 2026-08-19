/**
 * HarfBuzz shaping for pdfkit.
 *
 * WHY THIS EXISTS. pdfkit shapes text with fontkit, whose Indic engine was last
 * functionally touched in 2017. Against the vendored Noto fonts it does not merely
 * mis-shape Telugu — it throws:
 *
 *   TypeError: Cannot read properties of null (reading 'xCoordinate')
 *
 * on ప్రయోగశాల ("laboratory"), on శ్రీ (an honorific in a large share of Indian names),
 * and on శ్రీ ధర్మవరం (the unit's own town). An uncaught exception on the report path.
 *
 * The crash is FONT-DEPENDENT: the same strings shape without complaint against the macOS
 * system Telugu fonts, which is why it is easy to miss until the production font is used.
 *
 * This module replaces the shaping engine with HarfBuzz itself — the reference
 * implementation, pure WASM, no native build step, so it vendors offline (ARC-16).
 *
 * It also fixes the text layer at its source. fontkit's crash is one problem; the other is
 * that pdfkit derives its ToUnicode map from POST-shaping glyphs, so extracted Indic text
 * comes back in visual order (बोर्ड → बोरड, losing the virama). Here every output glyph
 * carries the codepoints of the cluster it came from, so the map is built from logical
 * order instead.
 */
import * as hb from 'harfbuzzjs';

const faces = new WeakMap();

function hbFontFor(font) {
  let cached = faces.get(font);
  if (!cached) {
    const src = font.stream?.buffer ?? font._src ?? font.src;
    if (!src) throw new Error('cannot reach the raw font bytes to hand to HarfBuzz');
    const bytes = Buffer.isBuffer(src) ? src : Buffer.from(src);
    cached = new hb.Font(new hb.Face(new hb.Blob(bytes)));
    // Scale to the font's own units so HarfBuzz reports positions in exactly the units
    // fontkit does, and pdfkit's own scaling keeps working untouched.
    cached.setScale(font.unitsPerEm, font.unitsPerEm);
    faces.set(font, cached);
  }
  return cached;
}

/**
 * Shape a string, returning an object shaped like fontkit's GlyphRun so pdfkit can
 * consume it unchanged.
 */
export function shape(font, string) {
  const hbFont = hbFontFor(font);
  const buf = new hb.Buffer();
  buf.addText(string);
  buf.guessSegmentProperties();
  hb.shape(hbFont, buf);

  const infos = buf.getGlyphInfos();
  const posns = buf.getGlyphPositions();

  // HarfBuzz reports, per glyph, the cluster it belongs to — an index into the input
  // string. Several glyphs may share a cluster (a conjunct), and one glyph may span
  // several input characters. Grouping by cluster is what lets each output glyph carry
  // the ORIGINAL codepoints, which is what makes the text layer extractable.
  const starts = [...new Set(infos.map((g) => g.cluster))].sort((a, b) => a - b);
  const clusterText = new Map();
  starts.forEach((start, i) => {
    const end = i + 1 < starts.length ? starts[i + 1] : string.length;
    clusterText.set(start, [...string.slice(start, end)].map((c) => c.codePointAt(0)));
  });

  const seen = new Set();
  const glyphs = infos.map((info) => {
    // Attribute a cluster's codepoints to its FIRST glyph only. Repeating them on every
    // glyph of a conjunct would duplicate characters when the text is extracted.
    const first = !seen.has(info.cluster);
    seen.add(info.cluster);
    const codePoints = first ? (clusterText.get(info.cluster) ?? []) : [];
    // fontkit caches Glyph instances by id, so passing codePoints to getGlyph is not
    // reliable: the same glyph reused later in the document would still carry whichever
    // codepoints it was first created with, and the text layer would silently pick up
    // characters from an unrelated string. Take a per-occurrence view over the cached
    // glyph instead, so the prototype keeps the metrics and only codePoints is ours.
    const glyph = font.getGlyph(info.codepoint);
    return Object.create(glyph, { codePoints: { value: codePoints, enumerable: true } });
  });

  const positions = posns.map((p) => ({
    xAdvance: p.xAdvance,
    yAdvance: p.yAdvance,
    xOffset: p.xOffset,
    yOffset: p.yOffset,
  }));

  return {
    glyphs,
    positions,
    advanceWidth: positions.reduce((n, p) => n + p.xAdvance, 0),
    script: 'DFLT',
    language: undefined,
    direction: 'ltr',
    features: {},
  };
}

/**
 * Point a fontkit font at HarfBuzz. Call once per font, before any text is drawn.
 * Idempotent.
 */
export function useHarfBuzz(font) {
  if (font.__harfbuzz) return font;
  const original = font.layout.bind(font);
  font.layout = (string, ...rest) => {
    try {
      return shape(font, string);
    } catch (err) {
      // Never make matters worse than fontkit already was: if HarfBuzz cannot handle
      // something, fall back rather than failing the render outright.
      if (process.env.LIMS_STRICT_SHAPING) throw err;
      return original(string, ...rest);
    }
  };
  font.__harfbuzz = true;
  return font;
}
