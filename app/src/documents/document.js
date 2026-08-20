'use strict';
/**
 * Creating a document that can actually pass PDF/UA-1.
 *
 * This exists because tagging is necessary but nowhere near sufficient. A document with a
 * complete structure tree, correct ActualText and perfect shaping still FAILS validation on
 * four separate counts if these catalog-level details are missing — and each one is invisible
 * until a validator is run:
 *
 *   ISO 14289-1 7.1 t8   the catalog needs an XMP metadata stream declaring pdfuaid:part
 *   ISO 14289-1 7.1 t10  ViewerPreferences needs DisplayDocTitle true
 *   ISO 14289-1 7.2 t34  natural language for page content must be determinable
 *   ISO 14289-1 7.2 t30  natural language for ActualText in a Span must be determinable
 *
 * We know they are required because veraPDF said so about OUR file, not because a library's
 * documentation claimed conformance. See test/pdfua.test.js.
 *
 * The language rules are the ones most easily got wrong on this project: a certificate carries
 * English, Telugu and Devanagari on one page, so a single document-level /Lang is not enough.
 * Each run declares its own.
 */
const PDFDocument = require('pdfkit');

/**
 * @param {object} opts
 * @param {string} opts.title       shown in the reader's title bar; REQUIRED for PDF/UA
 * @param {string} [opts.lang]      the document's predominant language (BCP 47)
 * @param {object} [opts.info]      further document information
 */
function createDocument(opts = {}) {
  const { title, lang = 'en-IN', info = {}, ...rest } = opts;
  if (!title) {
    // Not defensive noise: without a title, DisplayDocTitle has nothing to display and the
    // document fails 7.1 test 10. Better to stop here than to emit an invalid certificate.
    throw new Error('a document title is required for PDF/UA conformance (ISO 14289-1, 7.1)');
  }

  const doc = new PDFDocument({
    autoFirstPage: false,
    tagged: true,
    displayTitle: true,       // ViewerPreferences /DisplayDocTitle true  — 7.1 t10
    lang,                     // catalog /Lang                            — 7.2 t34
    pdfVersion: '1.7',
    // Emits the XMP PDF/UA Identification schema (ISO 14289-1 clause 5). Without it the
    // file cannot declare its own conformance and veraPDF rejects it, however correct the
    // rest is. Note this also triggers the /CIDSet defect recorded as ARC-49.
    subset: 'PDF/UA',
    info: { Title: title, ...info },
    ...rest,
  });

  return doc;
}

module.exports = { createDocument };
