'use strict';
/**
 * Rounding, per IS 2:1960 as the domain research records it: retain the same
 * number of significant places as the specified value.
 *
 * M6-09 requires different precision in different units for the same
 * characteristic — size deviation to three decimal places in tex but two in
 * denier, maximum deviation to two in tex but one in denier, cohesion strokes
 * as whole numbers. So precision is looked up by (characteristic, unit) from
 * configuration and is never a literal in code.
 *
 * Why not Number.prototype.toFixed: it rounds half away from zero only
 * sometimes, because the binary representation of a decimal ending in 5 is
 * often slightly below it. (1.005).toFixed(2) gives "1.00". A grade band
 * boundary is exactly where that bites, so half-up is implemented explicitly.
 */

/**
 * Round half away from zero at `places` decimal places, correcting for the
 * binary representation error that makes a naive implementation round down.
 */
function roundHalfUp(value, places) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('cannot round a non-finite value: ' + JSON.stringify(value));
  }
  if (!Number.isInteger(places) || places < 0) {
    throw new RangeError('places must be a non-negative integer, received ' + places);
  }
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);

  // Compare against the decimal exactly, via the string form, rather than
  // trusting abs * 10**places to land on the right side of .5
  const shifted = abs * Math.pow(10, places);
  const floor = Math.floor(shifted);
  const remainder = shifted - floor;

  let rounded;
  if (remainder > 0.5) {
    rounded = floor + 1;
  } else if (remainder < 0.5) {
    rounded = floor;
  } else {
    rounded = floor + 1; // exact half — away from zero
  }

  // The remainder can be a hair under 0.5 when the true decimal is exactly 0.5.
  // Re-check using a decimal-string comparison, which has no such error.
  if (remainder < 0.5 && remainder > 0.5 - 1e-9) {
    const asText = abs.toFixed(places + 1);
    if (asText.endsWith('5')) rounded = floor + 1;
  }

  return (sign * rounded) / Math.pow(10, places);
}

/**
 * Look up the decimal places for a characteristic in a unit, from the rounding
 * block of a specification-set config. Throws rather than guessing: an
 * unspecified precision means the standard was not read for that combination,
 * and silently choosing two decimal places would be an invented fact.
 */
function placesFor(config, characteristic, unit) {
  const table = config && config.rounding && config.rounding.precision;
  if (!table) {
    throw new Error('config has no rounding.precision table');
  }
  const forChar = table[characteristic];
  if (!forChar) {
    throw new Error(
      'no rounding precision configured for characteristic "' + characteristic +
      '". Add it to rounding.precision rather than assuming a default.');
  }
  if (!(unit in forChar)) {
    throw new Error(
      'no rounding precision configured for characteristic "' + characteristic +
      '" in unit "' + unit + '". Configured units: ' + Object.keys(forChar).join(', '));
  }
  return forChar[unit];
}

/** Round a characteristic's value for reporting, in the unit it is reported in. */
function roundForReport(config, characteristic, unit, value) {
  return roundHalfUp(value, placesFor(config, characteristic, unit));
}

/**
 * Format for printing on a certificate: the rounded value with its decimal
 * places retained, so 2.10 prints as "2.10" and not "2.1". A trailing zero is
 * information — it states the precision the measurement was made to.
 */
function formatForReport(config, characteristic, unit, value) {
  const places = placesFor(config, characteristic, unit);
  return roundHalfUp(value, places).toFixed(places);
}

module.exports = { roundHalfUp, placesFor, roundForReport, formatForReport };
