'use strict';
/**
 * Workaround for the pdfkit /CIDSet defect recorded as ARC-49.
 *
 * THE DEFECT. Asking pdfkit for the PDF/UA subset sets an internal flag its font code reads as
 * "PDF/A-1", so it emits a /CIDSet built only from the glyphs actually drawn, while the
 * subsetter writes the further glyphs those glyphs depend on. The two disagree and veraPDF
 * fails ISO 14289-1 clause 7.21.4.2 test 2.
 *
 * /CIDSet is NOT required by PDF/UA at all — only by the archival profile that flag belongs to.
 * Removing it is therefore correct, not a fudge: we are deleting an entry that should never
 * have been written for this conformance level.
 *
 * THE APPROACH. Blank the /CIDSet reference in the font descriptor, padding with spaces so
 * every byte offset in the file is preserved. Rewriting the file would invalidate the
 * cross-reference table; padding in place cannot. This also means the workaround is safe to
 * apply before signing, since it does not move anything the ByteRange depends on.
 *
 * WHEN THIS CAN GO. The defect is unreported upstream, so no fixed release may be assumed.
 * The signal that it is fixed is test/pdfua.test.js passing with this step removed — which is
 * why that test exists and why this function is applied in one place rather than inlined.
 */

// "/CIDSet 12 0 R" in a font descriptor. Deliberately narrow: only an indirect reference,
// only where the key is exactly /CIDSet.
const CIDSET = /\/CIDSet\s+\d+\s+\d+\s+R/g;

/**
 * @param {Buffer} pdf  a rendered PDF
 * @returns {{pdf: Buffer, removed: number}}
 */
function stripCidSet(pdf) {
  const latin = pdf.toString('latin1');
  let removed = 0;
  const out = latin.replace(CIDSET, (match) => {
    removed += 1;
    return ' '.repeat(match.length); // same length, so no byte offset moves
  });
  return { pdf: Buffer.from(out, 'latin1'), removed };
}

module.exports = { stripCidSet };
