'use strict';
/**
 * The method-specific computed values M6-06 lists: size deviation, maximum
 * deviation from the coarsest and finest specimens, average and low neatness,
 * and conditioned size.
 *
 * Each is a named formula in a registry. A method master names the formula it
 * uses; the engine looks it up. NFR-109 requires that a non-programmer can
 * author a calculation, and a registry of named formulas taking their constants
 * from configuration is the shape that allows it — the alternative, a formula
 * expression language, is a much larger thing to build and to validate, and is
 * not needed while the set of formulas is this small and this stable.
 *
 * Every formula takes (readings, context) and returns a raw number. Rounding is
 * applied afterwards, per M6-09.
 */

const stats = require('./stats');

/** Pick the rule whose coarseness band contains the marked size, in tex. */
function ruleForMarkedTex(rules, markedTex, label) {
  if (typeof markedTex !== 'number' || !Number.isFinite(markedTex)) {
    throw new TypeError(
      label + ' needs the size marked on the bales, in tex; received ' +
      JSON.stringify(markedTex));
  }
  for (const rule of rules) {
    if ('appliesWhenMarkedTexAtMost' in rule && markedTex <= rule.appliesWhenMarkedTexAtMost) {
      return rule;
    }
    if ('appliesWhenMarkedTexAbove' in rule && markedTex > rule.appliesWhenMarkedTexAbove) {
      return rule;
    }
  }
  throw new Error(label + ': no rule configured for a marked size of ' + markedTex + ' tex');
}

/**
 * Size deviation — the standard deviation of the individually weighed sizing
 * skeins. The divisor comes from configuration because no source read for this
 * project settled whether it is n or n-1.
 */
function sizeDeviation(readings, ctx) {
  requireConfig(ctx, 'sizeDeviation');
  return stats.standardDeviation(readings, ctx.config.statistics.standardDeviationDivisor);
}

/**
 * Maximum deviation — computed from the coarsest and the finest specimens only,
 * not from the whole set. Four and four for finer silk, eight and eight for
 * coarse, per configuration.
 *
 * Defined here as the difference between the mean of the coarsest group and the
 * mean of the finest group. THIS DEFINITION IS UNCONFIRMED: the sources read
 * for this project establish *which specimens* enter the calculation but not
 * the arithmetic applied to them. The function therefore reports its own
 * definition alongside the value, so a reviewer comparing against a worksheet
 * can see what was assumed rather than having to infer it.
 */
function maximumDeviation(readings, ctx) {
  requireConfig(ctx, 'maximumDeviation');
  const rule = ruleForMarkedTex(
    ctx.config.maximumDeviation.rules, ctx.markedTex, 'maximumDeviation');

  const needed = rule.coarsest + rule.finest;
  if (readings.length < needed) {
    throw new RangeError(
      'maximumDeviation needs at least ' + needed + ' readings (' + rule.coarsest +
      ' coarsest + ' + rule.finest + ' finest) but received ' + readings.length);
  }

  const sorted = [...readings].sort((a, b) => a - b);
  const finest = sorted.slice(0, rule.finest);              // lightest = finest
  const coarsest = sorted.slice(sorted.length - rule.coarsest);
  return stats.mean(coarsest) - stats.mean(finest);
}

/** Average neatness — the mean of the panel ratings. */
function averageNeatness(readings, ctx) {
  requireConfig(ctx, 'averageNeatness');
  return stats.mean(readings);
}

/**
 * Low neatness — the mean of the worst one-fifth of panels. Twenty panels means
 * the worst four. "Worst" is the LOWEST rating, because a higher neatness
 * rating is better.
 */
function lowNeatness(readings, ctx) {
  requireConfig(ctx, 'lowNeatness');
  const fraction = ctx.config.lowNeatness.worstFraction;
  if (typeof fraction !== 'number' || fraction <= 0 || fraction > 1) {
    throw new Error('lowNeatness.worstFraction must be between 0 and 1, got ' + fraction);
  }
  const count = Math.round(readings.length * fraction);
  if (count < 1) {
    throw new RangeError(
      'lowNeatness over ' + readings.length + ' panels at a worst-fraction of ' +
      fraction + ' selects no panels at all');
  }
  const sorted = [...readings].sort((a, b) => a - b);   // lowest rating = worst
  return stats.mean(sorted.slice(0, count));
}

/**
 * Conditioned size — oven-dry mass plus the official commercial allowance for
 * silk. The 11 per cent regain is a constant of trade; the oven temperature and
 * the convergence thresholds live beside it in configuration.
 *
 * Money changes hands on this figure, so it takes the oven-dry mass explicitly
 * rather than deriving it from readings: the caller must have done the drying.
 */
function conditionedSize(readings, ctx) {
  requireConfig(ctx, 'conditionedSize');
  const { ovenDryMass, lengthMetres } = ctx;
  const regain = ctx.config.conditionedSize.regainPercent;
  if (typeof ovenDryMass !== 'number' || !(ovenDryMass > 0)) {
    throw new TypeError('conditionedSize needs a positive ovenDryMass, received ' +
      JSON.stringify(ovenDryMass));
  }
  if (typeof lengthMetres !== 'number' || !(lengthMetres > 0)) {
    throw new TypeError('conditionedSize needs a positive lengthMetres, received ' +
      JSON.stringify(lengthMetres));
  }
  const conditionedMass = ovenDryMass * (1 + regain / 100);
  // Size in denier is grams per 9000 m; in tex, grams per 1000 m.
  const per = ctx.unit === 'tex' ? 1000 : 9000;
  return (conditionedMass / lengthMetres) * per;
}

function requireConfig(ctx, who) {
  if (!ctx || !ctx.config) {
    throw new Error(who + ' needs a context carrying { config }');
  }
}

const REGISTRY = {
  sizeDeviation,
  maximumDeviation,
  averageNeatness,
  lowNeatness,
  conditionedSize,
};

/** Definitions this project could not verify, surfaced so they can be checked. */
const UNCONFIRMED_DEFINITIONS = {
  sizeDeviation:
    'The divisor for the standard deviation (n or n-1) was not settled by any source read. ' +
    'Recompute a real worksheet both ways to settle it.',
  maximumDeviation:
    'Taken as (mean of the coarsest group) - (mean of the finest group). The sources establish ' +
    'which specimens enter the calculation, not the arithmetic applied to them.',
};

function compute(name, readings, ctx) {
  const fn = REGISTRY[name];
  if (!fn) {
    throw new Error(
      'no formula named "' + name + '". Available: ' + Object.keys(REGISTRY).join(', '));
  }
  return fn(readings, ctx);
}

module.exports = {
  compute,
  REGISTRY,
  UNCONFIRMED_DEFINITIONS,
  ruleForMarkedTex,
  sizeDeviation,
  maximumDeviation,
  averageNeatness,
  lowNeatness,
  conditionedSize,
};
