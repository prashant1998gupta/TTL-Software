'use strict';
/**
 * Indic-safe text for tagged PDFs.
 *
 * pdfkit builds its ToUnicode map from glyphs AFTER shaping, so Telugu and Devanagari
 * extract from the finished PDF in visual order rather than logical order. Measured:
 * `बोर्ड` comes back as `बोरड` — the virama is dropped outright. The certificate is then
 * unsearchable and a screen reader reads the wrong characters, which is the substance of
 * NFR-70, not a cosmetic detail.
 *
 * The remedy is /ActualText on the marked-content span: a conforming reader takes the
 * logical string from there and ignores the glyph order. pdfkit encodes it as UTF-16BE
 * with a byte-order mark, which is what the PDF specification requires.
 *
 * Every piece of Indic text on an issued document must go through here. A plain
 * doc.text() call with a Telugu string is a defect, and `npm test` is what catches it.
 */

// Telugu, Devanagari, and the generic Indic combining ranges. Deliberately broad: marking
// a Latin run with ActualText is harmless, while missing an Indic run is not.
const INDIC = /[ऀ-ॿఀ-౿‌‍]/;

function needsActualText(s) {
  return INDIC.test(String(s));
}

/**
 * Write text, tagging it so the logical string survives into the text layer.
 *
 * @param {PDFDocument} doc      a pdfkit document created with { tagged: true }
 * @param {object} parent        the structure element this text belongs under
 * @param {string} text          the logical string, exactly as a human typed it
 * @param {object} [opts]        { x, y, tag, lang, ...pdfkit text options }
 * @returns {object} the structure element added, so callers can nest further
 */
function writeText(doc, parent, text, opts = {}) {
  const { x, y, tag = 'P', lang, ...textOptions } = opts;
  const str = String(text);

  // Only Indic runs need ActualText. Latin text already round-trips, and adding the
  // override everywhere would hide a future regression behind a hardcoded answer.
  const indic = needsActualText(str);
  const markOptions = indic ? { actual: str } : {};

  // PDF/UA requires the natural language of page content to be determinable (7.2 t34), and
  // separately the language of an ActualText span (7.2 t30). A certificate here carries
  // English, Telugu and Devanagari on one page, so the document-level /Lang cannot answer
  // for all of it — each run declares its own. veraPDF fails the file without this.
  if (lang) markOptions.lang = lang;
  else if (indic) {
    throw new Error(
      `Indic text needs an explicit lang for PDF/UA (7.2 t30/t34): ${str.slice(0, 20)}`
    );
  }

  const element = doc.struct(tag, [doc.markStructureContent('Span', markOptions)]);
  parent.add(element);

  if (typeof x === 'number' && typeof y === 'number') {
    doc.text(str, x, y, textOptions);
  } else {
    doc.text(str, textOptions);
  }
  doc.endMarkedContent();

  return element;
}

/**
 * Page furniture — headers, footers, rules, the decorative parts of a letterhead.
 * PDF/UA requires it be marked as an artifact rather than left as untagged content,
 * which fails rule 7.1-3.
 */
function writeArtifact(doc, draw) {
  doc.markContent('Artifact');
  draw();
  doc.endMarkedContent();
}

module.exports = { writeText, writeArtifact, needsActualText, INDIC };
