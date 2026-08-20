'use strict';
/**
 * Applying the digital signature to an issued document.
 *
 * SCOPE, and why it is this narrow. Under OPEN-Q-T31 the laboratory needs a VALID SIGNATURE,
 * not long-term validation. That answer was given verbally and is recorded in the specification
 * as an assumption, not a fact — so this module reaches PAdES B-B and deliberately no further.
 *
 * B-T and above are not reachable in Node at all: node-forge's attribute encoder handles three
 * OIDs and emits a malformed structure WITHOUT THROWING for a fourth, and unsigned attributes —
 * where a signature timestamp lives — are hardcoded empty with no public API. A signature that
 * looks valid today and fails in 2032, after certificates are in customers' hands, is the worst
 * defect this system could ship. So we do not approach that edge.
 *
 * If OPEN-Q-T31 comes back the other way, the escape hatch is pyHanko invoked as a command line
 * OFF the report-issue path (ARC-17 keeps this component replaceable). Long-term validation can
 * never sit on the issue path in any language: it needs a revocation check and an RFC 3161
 * round trip, and M8-46 and NFR-32 forbid calls outside the laboratory network there.
 *
 * TWO THINGS THAT LOOK LIKE DETAILS AND ARE NOT:
 *
 *   1. placeholder-plain, never placeholder-pdfkit. The latter pins a peer dependency to
 *      pdfkit ^0.11 and, against a current pdfkit, FAILS SILENTLY — emitting no output at all
 *      rather than an error.
 *
 *   2. The signature is INVISIBLE. A visible signature widget fails PDF/UA on two counts: the
 *      widget is not nested in a Form structure element, and it carries no /TU. Nothing in Node
 *      fixes that for you. The human-readable "Digitally signed by ..." block belongs on the
 *      page as ordinary TAGGED CONTENT, drawn by the renderer before this module runs.
 */
const { SignPdf } = require('@signpdf/signpdf');
const { P12Signer } = require('@signpdf/signer-p12');
const { plainAddPlaceholder } = require('@signpdf/placeholder-plain');

/**
 * Sign a rendered PDF.
 *
 * @param {Buffer} pdf            the rendered document, tagged and complete
 * @param {Buffer} p12            PKCS#12 holding the signing key and certificate
 * @param {object} opts
 * @param {string} opts.passphrase
 * @param {string} [opts.reason]      why the document is signed
 * @param {string} [opts.name]        the signatory, as it should appear to a reader
 * @param {string} [opts.location]
 * @returns {Promise<Buffer>} the signed document
 */
async function signPdf(pdf, p12, opts = {}) {
  const { passphrase, reason = 'Issued test report', name, location } = opts;

  // The placeholder reserves the byte range the signature is written into. Its size has to
  // be generous enough for the CMS blob; too small fails at signing time, not at render time.
  const withPlaceholder = plainAddPlaceholder({
    pdfBuffer: pdf,
    reason,
    ...(name ? { name } : {}),
    ...(location ? { location } : {}),
    signatureLength: 8192,
  });

  return new SignPdf().sign(withPlaceholder, new P12Signer(p12, { passphrase }));
}

module.exports = { signPdf };
