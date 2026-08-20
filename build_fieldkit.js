/*
 * build_fieldkit.js — renders the Phase 0 field kit.
 *
 * Usage: node build_fieldkit.js fieldkit_content.json "Phase 0 Field Kit.html"
 *
 * This one is built to be PRINTED and carried on a clipboard for two days in a
 * laboratory, so it is designed print-first: tick boxes big enough for a pen,
 * ruled write-in space, black on white, no background fills that drink ink, and
 * page breaks that keep a section whole. It reads fine on screen; it works on
 * paper.
 */

const fs = require('fs');

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const rich = s => esc(s)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>');

const CSS = `
:root{
  --ink:#16120f; --soft:#463c34; --muted:#6f645a;
  --line:#c9bfb2; --rule:#e2d9cc; --silk:#7d1828; --tint:#f7f2ea;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
  --serif:Georgia,"Times New Roman",serif;
}
*{box-sizing:border-box}
body{margin:0;background:#e9e4db;color:var(--ink);font:15px/1.55 var(--sans)}
.sheet{max-width:830px;margin:0 auto;background:#fff;padding:44px 52px 64px;
       box-shadow:0 2px 20px rgba(0,0,0,.08)}
h1,h2,h3{font-family:var(--serif);font-weight:600;line-height:1.2;margin:0}
p{margin:0 0 .85em}

.head{border-bottom:3px solid var(--silk);padding-bottom:16px;margin-bottom:8px}
.head .kicker{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--silk)}
.head h1{font-size:33px;margin:8px 0 6px}
.head .sub{font-size:15.5px;color:var(--soft);max-width:64ch}
.meta{display:flex;flex-wrap:wrap;gap:8px 28px;margin-top:14px;font-size:12.5px;color:var(--muted)}
.meta b{color:var(--ink)}

.fill{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:20px 0 4px}
.fill div{border-bottom:1px solid var(--line);padding-bottom:3px;font-size:11px;
          text-transform:uppercase;letter-spacing:.07em;color:var(--muted);padding-top:22px}

section{margin-top:34px;page-break-inside:auto}
section > h2{font-size:22px;color:var(--silk);border-bottom:1px solid var(--rule);
             padding-bottom:7px;margin-bottom:5px}
section > .note{font-size:14px;color:var(--soft);margin:9px 0 16px;max-width:70ch}

.item{display:grid;grid-template-columns:30px 1fr;gap:11px;padding:11px 0;
      border-bottom:1px solid var(--rule);page-break-inside:avoid}
.item:last-child{border-bottom:0}
.box{width:19px;height:19px;border:1.6px solid var(--ink);border-radius:3px;margin-top:3px}
.item h3{font-size:16px;margin-bottom:4px}
.item .l{font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
         color:var(--muted);margin:7px 0 2px}
.item .t{font-size:14px;color:var(--soft)}
.item .t.warn{color:var(--silk)}
.tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
     background:var(--silk);color:#fff;padding:2px 7px;border-radius:10px;margin-left:7px;vertical-align:2px}
.tag.grey{background:var(--muted)}

.rule{border-bottom:1px solid var(--line);height:20px;margin-top:6px}
.rule.short{max-width:220px}

table{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:6px}
th{text-align:left;border-bottom:1.6px solid var(--ink);padding:6px 8px;font-size:11px;
   letter-spacing:.06em;text-transform:uppercase}
td{border-bottom:1px solid var(--rule);padding:8px;vertical-align:top}
td.ans{width:170px;border-left:1px solid var(--rule);background:var(--tint)}

.q{padding:13px 0;border-bottom:1px solid var(--rule);page-break-inside:avoid}
.q .id{font:11px ui-monospace,Menlo,monospace;color:var(--muted)}
.q .ask{font-size:16px;font-weight:600;margin:4px 0 6px;line-height:1.4}
.q .why{font-size:13px;color:var(--muted)}
.q .why b{color:var(--soft)}
.q .ans{margin-top:9px}
.q .ans .lbl{font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--silk)}

.day{border:1.4px solid var(--line);border-radius:8px;padding:16px 18px;margin-bottom:14px;page-break-inside:avoid}
.day h3{font-size:17px;margin-bottom:3px}
.day .focus{font-size:13.5px;color:var(--muted);margin-bottom:10px}
.day ol{margin:0;padding-left:19px;font-size:14px}
.day li{margin-bottom:5px}

.sign{margin-top:34px;padding-top:18px;border-top:2px solid var(--ink);
      display:grid;grid-template-columns:1fr 1fr;gap:34px;page-break-inside:avoid}
.sign div{padding-top:34px;border-bottom:1px solid var(--ink);font-size:11px;
          text-transform:uppercase;letter-spacing:.07em;color:var(--muted)}

@page{margin:14mm}
@media print{
  body{background:#fff;font-size:10.5pt}
  .sheet{box-shadow:none;max-width:none;padding:0}
  section{page-break-before:auto}
  section.newpage{page-break-before:always}
  .item,.q,.day,.sign{page-break-inside:avoid}
  h2,h3{page-break-after:avoid}
  td.ans{background:#fff}
}
`;

function build(c, meta) {
  const item = (title, tag, rows) => `
    <div class="item">
      <div class="box"></div>
      <div>
        <h3>${rich(title)}${tag || ''}</h3>
        ${rows.map(r => `<div class="l">${r[0]}</div><div class="t${r[2] ? ' ' + r[2] : ''}">${rich(r[1])}</div>`).join('')}
      </div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(meta.title)}</title><style>${CSS}</style></head>
<body><div class="sheet">

<div class="head">
  <div class="kicker">${esc(meta.kicker)}</div>
  <h1>${esc(meta.title)}</h1>
  <div class="sub">${rich(meta.sub)}</div>
  <div class="meta">${meta.meta.map(m => `<span><b>${esc(m[0])}</b> ${esc(m[1])}</span>`).join('')}</div>
</div>

<div class="fill"><div>Visit dates</div><div>Observer</div><div>Countersigned by</div></div>

${c.intro ? `<section><h2>Why these two days decide the rest</h2><div class="note">${rich(c.intro)}</div></section>` : ''}

<section class="newpage">
  <h2>1 &nbsp;Watch it happen</h2>
  <div class="note">In the order of a working day. Tick when seen. The single most important one is a
  Limited Test batch start to finish &mdash; it is roughly 98 per cent of the unit's work and the whole
  high-volume design rests on how it actually runs.</div>
  ${c.observe.map(o => item(o.what, '', [
    ['What will surprise you', o.watchFor, 'warn'],
    ['Write down', o.writeDown],
  ]) + '<div class="rule"></div><div class="rule"></div>').join('')}
</section>

<section class="newpage">
  <h2>2 &nbsp;Bring it back</h2>
  <div class="note">One example of each. A blank form shows the fields; a <strong>filled</strong> one shows
  what people actually write, which is different and far more useful.</div>
  ${c.collect.map(x => item(
      x.item,
      x.filled ? '<span class="tag">Filled, not blank</span>' : '<span class="tag grey">Blank is fine</span>',
      [['Decides', x.whyItMatters]])).join('')}
</section>

<section class="newpage">
  <h2>3 &nbsp;Count it</h2>
  <div class="note">Each number is paired with what the specification currently <em>assumes</em>, so a
  mismatch is visible here on the page rather than discovered a year into the build.</div>
  <table>
    <tr><th>Measure</th><th>Why</th><th>Specification assumes</th><th>Actual</th></tr>
    ${c.measure.map(m => `<tr>
      <td><strong>${rich(m.quantity)}</strong></td>
      <td>${rich(m.whyItMatters)}</td>
      <td>${rich(m.currentAssumption)}</td>
      <td class="ans"></td></tr>`).join('')}
  </table>
</section>

<section class="newpage">
  <h2>4 &nbsp;Answer sheet</h2>
  <div class="note">These are the questions that stop work. Each has a default the build will assume if
  it goes unanswered &mdash; but an unchallenged default becomes a decision by accident, so please read
  them rather than letting them pass.</div>
  ${c.questions.map(q => `
    <div class="q">
      <div class="id">${esc(q.id)}</div>
      <div class="ask">${rich(q.ask)}</div>
      <div class="why"><b>Blocks:</b> ${rich(q.whyBlocking)}<br>
        <b>Assumed if unanswered:</b> ${rich(q.defaultIfSilent)}</div>
      <div class="ans"><span class="lbl">Answer</span><div class="rule"></div><div class="rule"></div></div>
    </div>`).join('')}
</section>

${c.dayPlan && c.dayPlan.length ? `
<section class="newpage">
  <h2>5 &nbsp;A rough plan</h2>
  <div class="note">A plan, not a schedule. If a grading lot arrives on day two, follow the silk and
  abandon the plan &mdash; that is the more valuable use of the time.</div>
  ${c.dayPlan.map(d => `
    <div class="day">
      <h3>${esc(d.day)}</h3>
      <div class="focus">${rich(d.focus)}</div>
      <ol>${d.slots.map(s => `<li>${rich(s)}</li>`).join('')}</ol>
    </div>`).join('')}
</section>` : ''}

<div class="sign"><div>Observer</div><div>Unit In-Charge</div></div>

</div></body></html>`;
}

function main() {
  const [contentPath, outPath] = process.argv.slice(2);
  const c = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  const meta = {
    kicker: 'Central Silk Board · CSTRI · RSTRS Dharmavaram · Phase 0',
    title: 'Two Days in the Laboratory',
    sub: 'The field kit for Phase 0. Watch the real work, collect the real paper, count the real numbers, '
       + 'and settle the questions only the Unit In-Charge can answer. Print this and carry it.',
    meta: [
      ['Companion', 'TTL-SRS-v1.0, the full specification'],
      ['Purpose', 'Correct the specification against reality before any code is written'],
      ['Rule', 'Two days of watching beats two months of guessing'],
    ],
  };
  const html = build(c, meta);
  fs.writeFileSync(outPath, html);
  console.log('wrote %s (%d KB)', outPath, Math.round(html.length / 1024));
  console.log('  observe %d | collect %d | measure %d | questions %d',
    c.observe.length, c.collect.length, c.measure.length, c.questions.length);
}

if (require.main === module) main();
module.exports = { build };
