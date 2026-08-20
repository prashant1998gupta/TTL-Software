'use strict';
/**
 * The standard computed values M6-06 requires of every numeric parameter:
 * number of readings, mean, standard deviation, coefficient of variation as a
 * percentage, minimum, maximum, range.
 *
 * Nothing here knows a constant of the standard. The divisor for the standard
 * deviation is passed in, because no source read for this project settled
 * whether it is n or n-1 — see `statistics` in config/is15090-bis.json.
 *
 * Silk testing is not one number per test. A single size test weighs forty
 * individual sizing skeins; an evenness test compares twenty panels. Every
 * original reading is kept, and these functions only ever read them.
 */

/** Reject anything that is not a finite number, loudly and by position. */
function assertReadings(readings, minimum = 1) {
  if (!Array.isArray(readings)) {
    throw new TypeError('readings must be an array, received ' + typeof readings);
  }
  if (readings.length < minimum) {
    throw new RangeError(
      'need at least ' + minimum + ' reading(s), received ' + readings.length);
  }
  readings.forEach((r, i) => {
    if (typeof r !== 'number' || !Number.isFinite(r)) {
      throw new TypeError(
        'reading ' + (i + 1) + ' is not a finite number: ' + JSON.stringify(r));
    }
  });
}

function mean(readings) {
  assertReadings(readings);
  let total = 0;
  for (const r of readings) total += r;
  return total / readings.length;
}

/**
 * Standard deviation with an explicit divisor.
 *
 * divisor 'n'   — divide by n
 * divisor 'n-1' — divide by n-1 (Bessel's correction); needs at least 2 readings
 *
 * There is deliberately no default. A silent default here would bake an
 * unverified choice into every grade the laboratory ever issues.
 */
function standardDeviation(readings, divisor) {
  if (divisor !== 'n' && divisor !== 'n-1') {
    throw new Error(
      "standardDeviation needs an explicit divisor of 'n' or 'n-1'; " +
      'the basis is unconfirmed for this laboratory, so it is configuration ' +
      '(see statistics.standardDeviationDivisor). Received: ' + JSON.stringify(divisor));
  }
  assertReadings(readings, divisor === 'n-1' ? 2 : 1);
  const m = mean(readings);
  let sumSq = 0;
  for (const r of readings) sumSq += (r - m) * (r - m);
  const denom = divisor === 'n' ? readings.length : readings.length - 1;
  return Math.sqrt(sumSq / denom);
}

/** Coefficient of variation as a percentage of the mean. */
function coefficientOfVariation(readings, divisor) {
  const m = mean(readings);
  if (m === 0) {
    throw new RangeError(
      'coefficient of variation is undefined when the mean is zero');
  }
  return (standardDeviation(readings, divisor) / m) * 100;
}

/**
 * The full standard set for one parameter. Returns raw, unrounded values;
 * rounding is a separate, per-parameter concern (see rounding.js), because the
 * standard prescribes different precision in tex and in denier.
 */
function summarise(readings, divisor) {
  assertReadings(readings);
  const sorted = [...readings].sort((a, b) => a - b);
  return {
    n: readings.length,
    mean: mean(readings),
    standardDeviation: standardDeviation(readings, divisor),
    coefficientOfVariation: coefficientOfVariation(readings, divisor),
    minimum: sorted[0],
    maximum: sorted[sorted.length - 1],
    range: sorted[sorted.length - 1] - sorted[0],
  };
}

/**
 * The frequency-distribution form IS 15090 prints its worked example in:
 * frequency Fi, deviation di from an assumed mean, Fi*di and Fi*di^2.
 *
 * The result is arithmetically identical to `summarise` for the same divisor —
 * the assumed mean cancels out. It is provided because the laboratory's own
 * worksheets are laid out this way, so a tester checking the software against a
 * worksheet can compare the intermediate columns, not just the final answer.
 * A number that matches but cannot be traced is not much use at an assessment.
 */
function frequencyDistribution(readings, divisor, assumedMean) {
  assertReadings(readings, divisor === 'n-1' ? 2 : 1);
  const buckets = new Map();
  for (const r of readings) buckets.set(r, (buckets.get(r) || 0) + 1);

  const A = typeof assumedMean === 'number' ? assumedMean : mean(readings);
  const rows = [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([value, frequency]) => {
      const d = value - A;
      return {
        value,
        frequency,
        deviation: d,
        fd: frequency * d,
        fd2: frequency * d * d,
      };
    });

  const n = readings.length;
  const sumF = rows.reduce((t, r) => t + r.frequency, 0);
  const sumFd = rows.reduce((t, r) => t + r.fd, 0);
  const sumFd2 = rows.reduce((t, r) => t + r.fd2, 0);
  const denom = divisor === 'n' ? n : n - 1;
  // Variance about the true mean, from moments about the assumed mean.
  const variance = (sumFd2 - (sumFd * sumFd) / n) / denom;

  return {
    assumedMean: A,
    rows,
    totals: { sumF, sumFd, sumFd2 },
    mean: A + sumFd / n,
    standardDeviation: Math.sqrt(Math.max(variance, 0)),
  };
}

module.exports = {
  assertReadings,
  mean,
  standardDeviation,
  coefficientOfVariation,
  summarise,
  frequencyDistribution,
};
