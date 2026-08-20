'use strict';
/**
 * Tests for the calculation and grading engine.
 *
 * The engine's job is to be RIGHT or to REFUSE. A grade that looks plausible
 * and is wrong is the worst outcome available to this system, because a buyer
 * settles money against it and nobody can tell by looking. So roughly half of
 * these tests assert that the engine refuses, and name what it refuses over.
 *
 * Run: npm test
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const stats = require('../src/calc/stats');
const rounding = require('../src/calc/rounding');
const formulas = require('../src/calc/formulas');
const { gradeLot, resolveCategory, isApplicable, GradingRefused, unconfirmedRows } = require('../src/calc/grade');

const CONFIG_PATH = path.join(__dirname, '..', 'src', 'calc', 'config', 'is15090-bis.json');
const baseConfig = () => JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

/** A config with every row confirmed and a small grade table, for grading tests. */
function confirmedConfig() {
  const c = baseConfig();
  const confirmAll = node => {
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      if ('confirmed' in node) node.confirmed = true;
      for (const [k, v] of Object.entries(node)) if (k !== '$comment') confirmAll(v);
    }
  };
  confirmAll(c);
  // Illustrative limits ONLY — invented for the test, never for the product.
  // Lower size deviation is better; higher neatness is better.
  const band = (ch, kind, values) => ({
    category: 'II', characteristic: ch,
    limits: c.grades.order.map((g, i) => ({ grade: g, [kind]: values[i] })),
  });
  c.gradeTable.records = [
    band('sizeDeviation',    'max', [0.5, 0.8, 1.1, 1.4, 1.7, 2.0, 2.3, 2.6]),
    band('evennessI',        'max', [1, 2, 3, 4, 5, 6, 7, 8]),
    band('evennessII',       'max', [1, 2, 3, 4, 5, 6, 7, 8]),
    band('cleanness',        'min', [99, 98, 97, 96, 95, 94, 93, 92]),
    band('averageNeatness',  'min', [95, 90, 85, 80, 75, 70, 65, 60]),
    band('lowNeatness',      'min', [90, 85, 80, 75, 70, 65, 60, 55]),
    band('maximumDeviation', 'max', [0.5, 0.8, 1.1, 1.4, 1.7, 2.0, 2.3, 2.6]),
    band('evennessIII',      'max', [1, 2, 3, 4, 5, 6, 7, 8]),
  ];
  return c;
}

const goodMajors = {
  sizeDeviation: 0.4, evennessI: 1, evennessII: 1,
  cleanness: 99, averageNeatness: 95, lowNeatness: 90,
};

// ---------------------------------------------------------------- statistics

test('the standard deviation divisor must be stated, never defaulted', () => {
  assert.throws(() => stats.standardDeviation([1, 2, 3]),
    /explicit divisor/,
    'a silent default would bake an unverified choice into every grade issued');
  assert.throws(() => stats.standardDeviation([1, 2, 3], 'sample'), /explicit divisor/);
});

test('both divisors compute correctly and differ as expected', () => {
  const r = [2, 4, 4, 4, 5, 5, 7, 9];          // textbook set, population sd = 2
  assert.equal(stats.standardDeviation(r, 'n'), 2);
  assert.ok(stats.standardDeviation(r, 'n-1') > 2);
  assert.equal(stats.mean(r), 5);
  assert.equal(stats.coefficientOfVariation(r, 'n'), 40);
});

test('a non-numeric reading is rejected by position, not silently coerced', () => {
  assert.throws(() => stats.mean([1, '2', 3]), /reading 2 is not a finite number/);
  assert.throws(() => stats.mean([1, NaN]), /reading 2 is not a finite number/);
});

test('the frequency-distribution form matches the direct computation', () => {
  // The laboratory's worksheets are laid out as Fi / di / Fi*di / Fi*di^2, so a
  // tester must be able to check the intermediate columns, not just the answer.
  const readings = [20, 21, 21, 22, 22, 22, 23, 23, 24];
  for (const divisor of ['n', 'n-1']) {
    const direct = stats.standardDeviation(readings, divisor);
    const viaTable = stats.frequencyDistribution(readings, divisor, 22).standardDeviation;
    assert.ok(Math.abs(direct - viaTable) < 1e-12,
      divisor + ': table form gave ' + viaTable + ', direct gave ' + direct);
  }
  const table = stats.frequencyDistribution(readings, 'n', 22);
  assert.equal(table.totals.sumF, 9);
  assert.ok(Math.abs(table.mean - stats.mean(readings)) < 1e-12);
});

// ---------------------------------------------------------------- rounding

test('rounding is half-up even where toFixed is not', () => {
  // (1.005).toFixed(2) is "1.00" because 1.005 is stored just below the decimal.
  assert.equal(rounding.roundHalfUp(1.005, 2), 1.01);
  assert.equal(rounding.roundHalfUp(2.675, 2), 2.68);
  assert.equal(rounding.roundHalfUp(-1.005, 2), -1.01, 'half away from zero, both signs');
  assert.equal(rounding.roundHalfUp(2.4, 0), 2);
  assert.equal(rounding.roundHalfUp(2.5, 0), 3);
});

test('precision comes from config per characteristic AND unit', () => {
  const c = baseConfig();
  assert.equal(rounding.placesFor(c, 'sizeDeviation', 'tex'), 3);
  assert.equal(rounding.placesFor(c, 'sizeDeviation', 'denier'), 2);
  assert.equal(rounding.placesFor(c, 'maximumDeviation', 'tex'), 2);
  assert.equal(rounding.placesFor(c, 'maximumDeviation', 'denier'), 1);
  assert.equal(rounding.placesFor(c, 'cohesion', 'strokes'), 0);
});

test('an unconfigured precision throws rather than assuming two decimal places', () => {
  const c = baseConfig();
  assert.throws(() => rounding.placesFor(c, 'sizeDeviation', 'grains'), /no rounding precision/);
  assert.throws(() => rounding.placesFor(c, 'boilOff', 'percent'), /no rounding precision/);
});

test('a trailing zero is kept when formatting, because it states the precision', () => {
  const c = baseConfig();
  assert.equal(rounding.formatForReport(c, 'sizeDeviation', 'denier', 2.1), '2.10');
  assert.equal(rounding.formatForReport(c, 'maximumDeviation', 'denier', 3), '3.0');
});

// ---------------------------------------------------------------- formulas

test('maximum deviation uses only the coarsest and finest, and needs enough of them', () => {
  const ctx = { config: baseConfig(), markedTex: 2.4 };   // 4 coarsest + 4 finest
  const readings = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  // finest 4 = 10,11,12,13 (mean 11.5); coarsest 4 = 16,17,18,19 (mean 17.5)
  assert.equal(formulas.maximumDeviation(readings, ctx), 6);

  assert.throws(() => formulas.maximumDeviation([1, 2, 3], ctx),
    /needs at least 8 readings/);
});

test('the coarseness band selects 8-and-8 for coarse silk', () => {
  const ctx = { config: baseConfig(), markedTex: 4.0 };
  const readings = Array.from({ length: 16 }, (_, i) => i + 1);
  // finest 8 = 1..8 (mean 4.5); coarsest 8 = 9..16 (mean 12.5)
  assert.equal(formulas.maximumDeviation(readings, ctx), 8);
  assert.throws(() => formulas.maximumDeviation(readings.slice(0, 10), ctx),
    /needs at least 16 readings/);
});

test('low neatness averages the worst fifth — 4 of 20 — and worst means lowest', () => {
  const ctx = { config: baseConfig() };
  const readings = [
    50, 60, 70, 80, 90, 90, 90, 90, 90, 90,
    95, 95, 95, 95, 95, 95, 100, 100, 100, 100,
  ];
  assert.equal(formulas.lowNeatness(readings, ctx), (50 + 60 + 70 + 80) / 4);
  assert.equal(formulas.averageNeatness(readings, ctx), stats.mean(readings));
});

test('conditioned size applies the 11 per cent regain from config, in the right unit', () => {
  const ctx = { config: baseConfig(), ovenDryMass: 100, lengthMetres: 45000, unit: 'denier' };
  // 100 g oven-dry -> 111 g conditioned; 111 g / 45000 m * 9000 = 22.2 denier
  assert.ok(Math.abs(formulas.conditionedSize([], ctx) - 22.2) < 1e-9);

  const texCtx = { ...ctx, unit: 'tex' };
  assert.ok(Math.abs(formulas.conditionedSize([], texCtx) - (111 / 45000) * 1000) < 1e-9);

  assert.throws(() => formulas.conditionedSize([], { ...ctx, ovenDryMass: 0 }),
    /positive ovenDryMass/);
});

test('an unknown formula name lists what is available rather than failing obscurely', () => {
  assert.throws(() => formulas.compute('boilOffLoss', [1], { config: baseConfig() }),
    /no formula named "boilOffLoss". Available: /);
});

// ---------------------------------------------------------------- category

test('the size category comes from the MARKED size, never the measured size', () => {
  const c = baseConfig();
  // The specification's own worked case: marked 33 den (Category II) may measure
  // 34.5 den, which would be Category III if the measured size were used.
  assert.equal(resolveCategory(c, { denier: 33 }), 'II');
  assert.equal(resolveCategory(c, { denier: 34.5 }), 'III');
  assert.equal(resolveCategory(c, { denier: 18 }), 'I');
  assert.equal(resolveCategory(c, { tex: 2.0 }), 'I');
  assert.equal(resolveCategory(c, { tex: 3.7 }), 'III');
});

test('grading refuses without the marked size rather than falling back to measured', () => {
  const c = confirmedConfig();
  assert.throws(
    () => gradeLot(c, { marked: {}, results: goodMajors, mode: 'draft' }),
    e => e instanceof GradingRefused && e.reason === 'missing-marked-size');
});

test('a config that resolves the category from the measured size is rejected', () => {
  const c = confirmedConfig();
  c.sizeCategories.resolveFrom = 'measuredSize';
  assert.throws(() => gradeLot(c, { marked: { denier: 22 }, results: goodMajors, mode: 'draft' }),
    /must never resolve the category/);
});

// ---------------------------------------------------------------- refusals

test('live grading is refused while any configuration row is unconfirmed', () => {
  const c = baseConfig();                       // shipped state: nothing confirmed
  assert.ok(unconfirmedRows(c).length > 0, 'the shipped config must start unconfirmed');
  assert.throws(
    () => gradeLot(c, { marked: { denier: 22 }, results: goodMajors, mode: 'live' }),
    e => e instanceof GradingRefused && e.reason === 'unconfirmed-config');
});

test('grading is refused outright when the grade table is empty', () => {
  const c = baseConfig();
  assert.deepEqual(c.gradeTable.records, [],
    'the per-grade limits were deliberately never invented');
  assert.throws(
    () => gradeLot(c, { marked: { denier: 22 }, results: goodMajors, mode: 'draft' }),
    e => e instanceof GradingRefused && e.reason === 'no-grade-table');
});

test('mode must be stated; there is no default', () => {
  assert.throws(() => gradeLot(confirmedConfig(), { marked: { denier: 22 }, results: goodMajors }),
    e => e instanceof GradingRefused && e.reason === 'bad-mode');
});

test('a missing MAJOR result refuses; a missing auxiliary result does not', () => {
  const c = confirmedConfig();
  const { cleanness, ...withoutMajor } = goodMajors;
  assert.throws(
    () => gradeLot(c, { marked: { denier: 22 }, results: withoutMajor, mode: 'live' }),
    e => e instanceof GradingRefused && e.reason === 'missing-major-result');

  const ok = gradeLot(c, { marked: { denier: 22 }, results: goodMajors, mode: 'live' });
  assert.equal(ok.finalGrade, '4A');
});

// ---------------------------------------------------------------- grading

test('the provisional grade is the LOWEST among the major tests, and names its cause', () => {
  const c = confirmedConfig();
  const out = gradeLot(c, {
    marked: { denier: 22 },
    results: { ...goodMajors, cleanness: 95 },     // 95 earns B
    mode: 'live',
  });
  assert.equal(out.category, 'II');
  assert.equal(out.provisionalGrade, 'B');
  assert.equal(out.determinedBy, 'cleanness');
  assert.equal(out.finalGrade, 'B');
});

test('an auxiliary failure drops the grade by at most one class', () => {
  const c = confirmedConfig();
  const out = gradeLot(c, {
    marked: { denier: 22 },
    results: { ...goodMajors, evennessIII: 8, maximumDeviation: 2.6 },  // both far below
    mode: 'live',
  });
  assert.equal(out.provisionalGrade, '4A');
  assert.equal(out.classesDropped, 1, 'two auxiliary failures still drop only one class');
  assert.equal(out.finalGrade, '3A');
});

test('maximumDeviation is auxiliary in Category II but MAJOR in Category III', () => {
  const c = confirmedConfig();
  // Give Category III the same table rows so the only difference is classification.
  for (const r of [...c.gradeTable.records]) {
    c.gradeTable.records.push({ ...r, category: 'III' });
  }

  // Category II: a terrible maximum deviation is auxiliary, so it caps at one class.
  const catII = gradeLot(c, {
    marked: { denier: 22 }, mode: 'live',
    results: { ...goodMajors, maximumDeviation: 2.6 },
  });
  assert.equal(catII.finalGrade, '3A', 'auxiliary: capped to a one-class drop');

  // Category III: the same value is a MAJOR test, so it sets the grade outright.
  const catIII = gradeLot(c, {
    marked: { denier: 40 }, mode: 'live',
    results: { ...goodMajors, maximumDeviation: 2.6 },
  });
  assert.equal(catIII.category, 'III');
  assert.equal(catIII.provisionalGrade, 'E', 'major: sets the grade, uncapped');
  assert.equal(catIII.determinedBy, 'maximumDeviation');
});

test('the engine never reads the report-ordering booleans on the parameter master', () => {
  // M1-51: is_major_characteristic / is_auxiliary_characteristic cannot express
  // maximumDeviation being major in III and auxiliary in I and II, so they are
  // non-authoritative and the grade engine must never read them.
  const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'calc', 'grade.js'), 'utf8');
  const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');   // strip comments
  assert.ok(!/is_major_characteristic|is_auxiliary_characteristic|isMajorCharacteristic/.test(code),
    'grade.js must read the classification from characteristics.byCategory only');
});

test('cohesion is gated twice, and the two gates agree', () => {
  // The 33-denier cohesion cut-off coincides exactly with the upper bound of
  // Category II, so the rule is belt and braces: the category classification
  // already omits cohesion from Category III. Both gates are asserted, because
  // if either is edited in isolation the other still holds the line.
  const c = confirmedConfig();

  // Gate 1 — the classification. Cohesion is auxiliary in I and II, absent in III.
  assert.ok(c.characteristics.byCategory.II.auxiliary.includes('cohesion'));
  assert.ok(!c.characteristics.byCategory.III.auxiliary.includes('cohesion'),
    'Category III is 34 denier and above, so cohesion is not among its characteristics');
  assert.ok(!c.characteristics.byCategory.III.major.includes('cohesion'));

  // Gate 2 — the applicability rule, independent of the classification.
  assert.equal(isApplicable(c, 'cohesion', { denier: 22 }), true);
  assert.equal(isApplicable(c, 'cohesion', { denier: 33 }), true, 'the boundary is inclusive');
  assert.equal(isApplicable(c, 'cohesion', { denier: 34 }), false,
    'must not be applied to coarse silk — it produces a wrong grade that looks plausible');

  // And the rule needs the marked denier; it will not silently pass.
  assert.throws(() => isApplicable(c, 'cohesion', { tex: 2.4 }),
    e => e instanceof GradingRefused && e.reason === 'missing-marked-size');
});

test('in Category III a missing maximumDeviation refuses, because there it is major', () => {
  const c = confirmedConfig();
  for (const r of [...c.gradeTable.records]) c.gradeTable.records.push({ ...r, category: 'III' });

  assert.throws(
    () => gradeLot(c, { marked: { denier: 40 }, results: goodMajors, mode: 'live' }),
    e => e instanceof GradingRefused && e.reason === 'missing-major-result',
    'the same omission is harmless in Category II and fatal in Category III');

  const ok = gradeLot(c, {
    marked: { denier: 40 }, mode: 'live',
    results: { ...goodMajors, maximumDeviation: 0.4 },
  });
  assert.equal(ok.category, 'III');
  assert.equal(ok.finalGrade, '4A');
});

test('the WF-74 seven per cent repeat gate is configuration, not a literal', () => {
  const c = baseConfig();
  const rule = c.repeatRules.conditionedSizeVsDeclared;
  assert.equal(rule.tolerancePercent, 7);
  assert.equal(rule.direction, 'either');
  const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'calc', 'grade.js'), 'utf8');
  assert.ok(!/\b7\b\s*(?:\/|\*|%)|percent\s*7/.test(source.replace(/\/\*[\s\S]*?\*\//g, '')),
    'the tolerance must not appear as a literal in the engine');
});

test('the shipped config declares what this project could not verify', () => {
  const c = baseConfig();
  assert.equal(c.confirmed, false, 'the whole set ships unconfirmed');
  assert.equal(c.statistics.confirmed, false, 'the n vs n-1 basis was never settled');
  assert.ok(String(c.readingCounts.$comment).includes('CONFLICTING SOURCES'),
    'the 40/80 versus 200/400 conflict must stay visible, not be quietly resolved');
  assert.ok(formulas.UNCONFIRMED_DEFINITIONS.maximumDeviation.length > 0,
    'the maximum-deviation arithmetic is an assumption and must say so');
});
