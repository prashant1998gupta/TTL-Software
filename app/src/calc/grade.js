'use strict';
/**
 * The raw silk grading engine.
 *
 * Two stages, as the domain research records them:
 *   1. The MAJOR tests set a provisional grade — the lowest grade among them.
 *   2. An AUXILIARY test below the provisional grade's requirement pulls the
 *      grade down, but by at most one class, and only for the characteristics
 *      the cap list names.
 *
 * Three rules exist here because getting them wrong produces a grade that looks
 * entirely plausible and is wrong:
 *
 *   - The size category is resolved from the size MARKED on the bales, never
 *     from the measured size.
 *   - maximumDeviation is MAJOR in Category III and AUXILIARY in I and II, so
 *     the classification is read per category from the authoritative store, and
 *     never from the report-ordering booleans on the parameter master.
 *   - Cohesion applies only to silk marked 33 denier or finer.
 *
 * The engine refuses to grade rather than guess. Every refusal names what is
 * missing, because a wrong certificate is worse than a late one.
 */

/** Thrown when the engine will not produce a grade. Carries a machine-readable reason. */
class GradingRefused extends Error {
  constructor(reason, detail) {
    super(detail);
    this.name = 'GradingRefused';
    this.reason = reason;
  }
}

/** Every config row that still carries confirmed:false, by dotted path. */
function unconfirmedRows(config, path = '', found = []) {
  if (config && typeof config === 'object' && !Array.isArray(config)) {
    if (config.confirmed === false) found.push(path || '(root)');
    for (const [k, v] of Object.entries(config)) {
      if (k === '$comment' || k === 'confirmed') continue;
      unconfirmedRows(v, path ? path + '.' + k : k, found);
    }
  }
  return found;
}

/** Resolve the size category from the marked size. Never from the measured size. */
function resolveCategory(config, marked) {
  const cfg = config.sizeCategories;
  if (cfg.resolveFrom !== 'markedSize') {
    throw new GradingRefused('bad-config',
      'sizeCategories.resolveFrom must be "markedSize"; the measured size must never ' +
      'resolve the category. Found: ' + cfg.resolveFrom);
  }
  const { tex, denier } = marked || {};
  const useTex = typeof tex === 'number' && Number.isFinite(tex);
  const useDenier = typeof denier === 'number' && Number.isFinite(denier);
  if (!useTex && !useDenier) {
    throw new GradingRefused('missing-marked-size',
      'the size marked or declared on the bales is required to resolve the size category; ' +
      'pass { marked: { tex } } or { marked: { denier } }');
  }

  for (const band of cfg.bands) {
    const min = useTex ? band.minTex : band.minDenier;
    const max = useTex ? band.maxTex : band.maxDenier;
    const value = useTex ? tex : denier;
    const aboveMin = min === null || min === undefined || value >= min;
    const belowMax = max === null || max === undefined || value <= max;
    if (aboveMin && belowMax) return band.category;
  }
  throw new GradingRefused('no-category',
    'no size category configured for a marked size of ' +
    (useTex ? tex + ' tex' : denier + ' denier'));
}

/** Is this characteristic applicable at all, at this marked size? */
function isApplicable(config, characteristic, marked) {
  const rules = config.applicability || {};
  const rule = rules[characteristic];
  if (!rule) return true;
  if ('appliesWhenMarkedDenierAtMost' in rule) {
    const d = marked && marked.denier;
    if (typeof d !== 'number' || !Number.isFinite(d)) {
      throw new GradingRefused('missing-marked-size',
        characteristic + ' has an applicability rule in denier, so the marked denier ' +
        'is required to decide whether it applies at all');
    }
    return d <= rule.appliesWhenMarkedDenierAtMost;
  }
  return true;
}

/** Look up the grade a single result earns for one characteristic. */
function gradeForResult(config, category, characteristic, value) {
  const record = (config.gradeTable.records || []).find(
    r => r.category === category && r.characteristic === characteristic);
  if (!record) {
    throw new GradingRefused('no-grade-table',
      'no grade table for characteristic "' + characteristic + '" in category ' + category +
      '. The per-grade limits were not available to this project and were deliberately not ' +
      'invented — populate gradeTable.records from the laboratory\'s own tables.');
  }
  const order = config.grades.order;
  // Limits are listed best grade first. 'max' means a lower value is better;
  // 'min' means a higher value is better (neatness, tenacity, cohesion).
  for (const limit of record.limits) {
    if ('max' in limit && value <= limit.max) return limit.grade;
    if ('min' in limit && value >= limit.min) return limit.grade;
  }
  return order[order.length - 1];   // worse than every band
}

/** Index in the grade order. Larger index = worse grade. */
function gradeIndex(config, grade) {
  const i = config.grades.order.indexOf(grade);
  if (i < 0) {
    throw new GradingRefused('unknown-grade',
      'grade "' + grade + '" is not in grades.order: ' + config.grades.order.join(', '));
  }
  return i;
}

/**
 * Grade a lot.
 *
 * @param {object} config   a specification-set config (see config/is15090-bis.json)
 * @param {object} input
 *   input.marked   { tex?, denier? }   size marked on the bales — governs the category
 *   input.results  { characteristic: value }  computed, rounded results
 *   input.mode     'draft' | 'live'
 *
 * In 'live' mode the engine refuses while any config row is unconfirmed, which
 * is the recommended default of OPEN-Q-C13. In 'draft' mode it proceeds and
 * returns the same list under `warnings`, so the behaviour can be exercised
 * before sign-off without pretending the data is confirmed.
 */
function gradeLot(config, input) {
  const { marked, results, mode } = input || {};
  if (mode !== 'draft' && mode !== 'live') {
    throw new GradingRefused('bad-mode',
      "mode must be 'draft' or 'live'; there is no default, because the difference is " +
      'whether an unconfirmed grade table may be used');
  }
  if (!results || typeof results !== 'object') {
    throw new GradingRefused('no-results', 'input.results is required');
  }

  const unconfirmed = unconfirmedRows(config);
  if (mode === 'live' && unconfirmed.length) {
    throw new GradingRefused('unconfirmed-config',
      'refusing to grade in live mode while ' + unconfirmed.length + ' configuration row(s) ' +
      'remain unconfirmed: ' + unconfirmed.join(', ') +
      '. Confirm them against a real grading worksheet first (OPEN-Q-C13).');
  }

  const category = resolveCategory(config, marked);
  const sets = config.characteristics.byCategory[category];
  if (!sets) {
    throw new GradingRefused('no-characteristic-set',
      'no major/auxiliary classification configured for category ' + category);
  }

  // ---- stage 1: the major tests set a provisional grade
  const majorGrades = [];
  const skipped = [];
  const missing = [];
  for (const ch of sets.major) {
    if (!isApplicable(config, ch, marked)) { skipped.push(ch); continue; }
    if (!(ch in results)) { missing.push(ch); continue; }
    majorGrades.push({ characteristic: ch, grade: gradeForResult(config, category, ch, results[ch]) });
  }
  if (missing.length) {
    throw new GradingRefused('missing-major-result',
      'cannot grade: no result for major characteristic(s) ' + missing.join(', ') +
      ' in category ' + category + '. A major test cannot be skipped.');
  }
  if (!majorGrades.length) {
    throw new GradingRefused('no-major-results', 'no applicable major characteristics');
  }

  let worst = majorGrades[0];
  for (const g of majorGrades) {
    if (gradeIndex(config, g.grade) > gradeIndex(config, worst.grade)) worst = g;
  }
  const provisional = worst.grade;

  // ---- stage 2: auxiliary tests may pull it down, by at most one class
  const capCfg = config.oneClassCap;
  const cappable = new Set((capCfg.appliesTo && capCfg.appliesTo[category]) || []);
  const auxiliaryFindings = [];
  let drop = 0;

  for (const ch of sets.auxiliary) {
    if (!isApplicable(config, ch, marked)) { skipped.push(ch); continue; }
    if (!(ch in results)) continue;                  // auxiliary results are optional
    if (!cappable.has(ch)) {
      auxiliaryFindings.push({ characteristic: ch, belowProvisional: null, capped: false,
        note: 'not in the cap list for category ' + category + ', so it cannot move the grade' });
      continue;
    }
    const earned = gradeForResult(config, category, ch, results[ch]);
    const below = gradeIndex(config, earned) > gradeIndex(config, provisional);
    auxiliaryFindings.push({ characteristic: ch, earned, belowProvisional: below, capped: below });
    if (below) drop = Math.min(capCfg.maxClassesDropped, drop + 1);
  }

  const order = config.grades.order;
  const finalIndex = Math.min(gradeIndex(config, provisional) + drop, order.length - 1);

  return {
    category,
    provisionalGrade: provisional,
    finalGrade: order[finalIndex],
    determinedBy: worst.characteristic,
    majorGrades,
    auxiliaryFindings,
    classesDropped: finalIndex - gradeIndex(config, provisional),
    notApplicable: skipped,
    warnings: unconfirmed.length
      ? ['configuration rows still unconfirmed: ' + unconfirmed.join(', ')]
      : [],
  };
}

module.exports = { gradeLot, resolveCategory, isApplicable, gradeForResult, unconfirmedRows, GradingRefused };
