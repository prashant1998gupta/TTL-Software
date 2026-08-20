/**
 * Capturing the shaped output of a string, for comparison against a stored golden file.
 *
 * WHY. Shaping is the step where a dependency upgrade can silently change what a certificate
 * looks like. A new harfbuzzjs, a new font revision, or a change in how the bridge attributes
 * clusters would all still produce a valid-looking PDF — just a subtly different one. Nothing
 * else in the suite would notice, because every other assertion checks properties (does it
 * extract, is it tagged, is it signed) rather than exact output.
 *
 * PLN-28 requires the glyph identifiers and advances be held as a golden file "so that a change
 * in shaping is visible rather than silent". This is that capture.
 *
 * A failing golden comparison is NOT automatically a bug — it means something changed and a
 * person must look. Regenerate deliberately, never to make the suite go green.
 */
import * as fontkit from 'fontkit';
import { shape } from './shaping.mjs';

/**
 * Shape one string and reduce it to the values that must not drift.
 * Deliberately excludes anything derived (total width), so a failure points at one glyph.
 */
export function capture(fontPath, text) {
  const font = fontkit.openSync(fontPath);
  const run = shape(font, text);
  return {
    text,
    glyphs: run.glyphs.map((g, i) => ({
      id: g.id,
      // The codepoints attributed to this glyph are what the ToUnicode map is built from,
      // so a change here is a change to the extractable text, not merely to the picture.
      codePoints: g.codePoints,
      xAdvance: Math.round(run.positions[i].xAdvance),
      xOffset: Math.round(run.positions[i].xOffset),
      yOffset: Math.round(run.positions[i].yOffset),
    })),
  };
}

/** Capture a whole corpus, keyed so a diff names the string that moved. */
export function captureAll(cases) {
  const out = {};
  for (const [label, fontPath, text] of cases) out[label] = capture(fontPath, text);
  return out;
}
