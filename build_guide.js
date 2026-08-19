/*
 * build_guide.js — renders the visual guide from the distilled content.
 *
 * Usage: node build_guide.js guide_content.json "Visual Guide.html"
 *
 * Produces ONE self-contained HTML file: no external fonts, scripts, or
 * images, so it opens offline, survives being emailed, and prints to PDF
 * from the browser. The reader is a laboratory scientist, not a programmer,
 * so the page is built for skimming: a fixed contents rail, one idea per
 * card, and every claim tied to something concrete from his own laboratory.
 */

const fs = require('fs');

// --------------------------------------------------------------- escaping
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/** Minimal inline markup: **bold** and *italic*, after escaping. */
const rich = s => esc(s)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>');

// --------------------------------------------------------------- styles
const CSS = `
:root{
  --ink:#1d1815; --ink-soft:#4a4038; --muted:#7a6f66;
  --paper:#fbf8f3; --paper-2:#f4efe6; --card:#ffffff;
  --silk:#8c1d2f; --silk-dk:#6b1523; --silk-lt:#f5e6e8;
  --gold:#a8801a; --gold-lt:#fdf4e0;
  --sage:#3f6146; --sage-lt:#eaf2ec;
  --line:#e6ddd0; --line-2:#d3c7b6;
  --shadow:0 1px 2px rgba(60,40,20,.05),0 8px 24px rgba(60,40,20,.06);
  --radius:14px;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  --serif:Georgia,"Iowan Old Style","Times New Roman",serif;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0; background:var(--paper); color:var(--ink);
  font:16.5px/1.65 var(--sans); -webkit-font-smoothing:antialiased;
}
h1,h2,h3,h4{font-family:var(--serif); font-weight:600; line-height:1.22; margin:0}
p{margin:0 0 1em}
strong{font-weight:650}
a{color:var(--silk)}

/* ---------- layout ---------- */
.wrap{display:grid; grid-template-columns:250px minmax(0,1fr); gap:0; max-width:1400px; margin:0 auto}
.rail{
  position:sticky; top:0; align-self:start; height:100vh; overflow-y:auto;
  padding:32px 20px 40px; border-right:1px solid var(--line); background:var(--paper-2);
}
.rail .brand{font-family:var(--serif); font-size:15px; color:var(--silk); font-weight:600; line-height:1.3}
.rail .brand small{display:block; font-family:var(--sans); font-size:11.5px; color:var(--muted); font-weight:400; margin-top:6px; letter-spacing:.02em}
.rail nav{margin-top:26px; display:flex; flex-direction:column; gap:1px}
.rail a{
  display:flex; gap:9px; align-items:baseline; padding:7px 10px; border-radius:8px;
  font-size:13.5px; color:var(--ink-soft); text-decoration:none; transition:.12s;
}
.rail a .num{font-size:11px; color:var(--muted); min-width:14px; font-variant-numeric:tabular-nums}
.rail a:hover{background:#fff; color:var(--silk)}
.rail a.on{background:var(--silk); color:#fff}
.rail a.on .num{color:rgba(255,255,255,.6)}
main{min-width:0; padding:0 0 100px}
section{padding:64px 56px; border-bottom:1px solid var(--line); scroll-margin-top:0}
section:nth-of-type(even){background:var(--paper-2)}
.inner{max-width:940px}
.wide{max-width:1120px}

/* ---------- section heads ---------- */
.eyebrow{
  display:inline-block; font-size:11.5px; font-weight:700; letter-spacing:.13em;
  text-transform:uppercase; color:var(--silk); margin-bottom:12px;
}
h2{font-size:34px; letter-spacing:-.015em; margin-bottom:14px}
.lede{font-size:19px; line-height:1.6; color:var(--ink-soft); max-width:70ch; margin-bottom:34px}
h3{font-size:21px; margin:36px 0 12px}

/* ---------- hero ---------- */
.hero{background:linear-gradient(160deg,#7d1828 0%,#5d1220 55%,#3f0d17 100%); color:#fff; border:0; padding:76px 56px 64px}
.hero .eyebrow{color:#e9b9a6}
.hero h1{font-size:52px; letter-spacing:-.025em; margin-bottom:18px; max-width:20ch}
.hero .sub{font-size:20px; line-height:1.55; color:rgba(255,255,255,.86); max-width:62ch; margin-bottom:34px}
.hero .meta{display:flex; flex-wrap:wrap; gap:10px 26px; padding-top:26px; border-top:1px solid rgba(255,255,255,.18); font-size:13.5px; color:rgba(255,255,255,.72)}
.hero .meta b{color:#fff; font-weight:600}
.readfirst{
  margin-top:30px; background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.16);
  border-radius:var(--radius); padding:20px 22px; max-width:72ch;
}
.readfirst h4{font-size:15px; color:#fff; margin-bottom:8px; font-family:var(--sans); font-weight:650}
.readfirst p{color:rgba(255,255,255,.82); font-size:14.5px; margin:0}

/* ---------- stat strip ---------- */
.stats{display:grid; grid-template-columns:repeat(auto-fit,minmax(178px,1fr)); gap:14px; margin:8px 0 6px}
.stat{background:var(--card); border:1px solid var(--line); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow)}
.stat .v{font-family:var(--serif); font-size:34px; color:var(--silk); line-height:1; letter-spacing:-.02em}
.stat .l{font-size:12.5px; font-weight:650; text-transform:uppercase; letter-spacing:.05em; color:var(--ink-soft); margin:9px 0 7px}
.stat .n{font-size:13px; color:var(--muted); line-height:1.5}

/* ---------- generic cards ---------- */
.card{background:var(--card); border:1px solid var(--line); border-radius:var(--radius); padding:24px; box-shadow:var(--shadow)}
.grid2{display:grid; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); gap:16px}
.grid3{display:grid; grid-template-columns:repeat(auto-fit,minmax(255px,1fr)); gap:14px}

/* ---------- callouts ---------- */
.note{border-left:3px solid var(--gold); background:var(--gold-lt); padding:16px 20px; border-radius:0 10px 10px 0; margin:22px 0; font-size:15px}
.note.silk{border-color:var(--silk); background:var(--silk-lt)}
.note.sage{border-color:var(--sage); background:var(--sage-lt)}
.note b{display:block; margin-bottom:5px; font-size:13px; text-transform:uppercase; letter-spacing:.06em; color:var(--silk)}
.note.sage b{color:var(--sage)} .note b.g{color:var(--gold)}

/* ---------- journey ---------- */
.journey{position:relative; margin-top:10px}
.journey::before{content:""; position:absolute; left:19px; top:14px; bottom:14px; width:2px; background:linear-gradient(var(--silk),var(--gold))}
.step{position:relative; padding:0 0 26px 58px}
.step .dot{
  position:absolute; left:0; top:0; width:40px; height:40px; border-radius:50%;
  background:var(--silk); color:#fff; display:grid; place-items:center;
  font-family:var(--serif); font-size:17px; box-shadow:0 0 0 5px var(--paper)
}
section:nth-of-type(even) .step .dot{box-shadow:0 0 0 5px var(--paper-2)}
.step h4{font-size:19px; margin-bottom:6px}
.step .who{
  display:inline-block; font-size:11.5px; font-weight:650; letter-spacing:.04em; text-transform:uppercase;
  color:var(--silk); background:var(--silk-lt); padding:3px 9px; border-radius:20px; margin-bottom:10px;
}
.step .mins{font-size:11.5px; color:var(--muted); margin-left:8px}
.step p{margin-bottom:10px; color:var(--ink-soft)}
.chip{display:block; font-size:14px; padding:11px 14px; border-radius:9px; margin-top:8px; line-height:1.55}
.chip.sys{background:#eef3f7; border-left:3px solid #4a6b86}
.chip.guard{background:var(--sage-lt); border-left:3px solid var(--sage)}
.chip .k{font-weight:650; font-size:11.5px; text-transform:uppercase; letter-spacing:.06em; display:block; margin-bottom:3px}
.chip.sys .k{color:#3d5a73} .chip.guard .k{color:var(--sage)}

/* ---------- change cards ---------- */
.chg{background:var(--card); border:1px solid var(--line); border-radius:var(--radius); overflow:hidden; box-shadow:var(--shadow)}
.chg .hd{padding:18px 22px 14px; border-bottom:1px solid var(--line)}
.chg .hd h4{font-size:19px}
.chg .bd{padding:6px 22px 20px}
.chg .row{padding:13px 0; border-bottom:1px dashed var(--line)}
.chg .row:last-child{border:0}
.chg .row .k{font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); display:block; margin-bottom:4px}
.chg .row.was .k{color:var(--muted)}
.chg .row.now .k{color:var(--silk)}
.chg .row.why .k{color:var(--gold)}
.chg .row.eg{background:var(--paper-2); margin:10px -22px -20px; padding:14px 22px 18px; border:0}
.chg .row.eg .k{color:var(--sage)}

/* ---------- roles ---------- */
.role{background:var(--card); border:1px solid var(--line); border-radius:var(--radius); padding:18px 20px; box-shadow:var(--shadow)}
.role.key{border-color:var(--silk); border-width:1.5px}
.role h4{font-size:16.5px; margin-bottom:8px; display:flex; align-items:center; gap:8px}
.role .star{font-size:10px; background:var(--silk); color:#fff; padding:2px 7px; border-radius:20px; letter-spacing:.05em; font-family:var(--sans); font-weight:700}
.role p{font-size:14.5px; margin-bottom:9px; color:var(--ink-soft)}
.role .kv{font-size:13.5px; padding-top:9px; border-top:1px solid var(--line); color:var(--muted)}
.role .kv b{color:var(--ink-soft)}
.role .kv .no{color:var(--silk)}

/* ---------- scope ---------- */
table{width:100%; border-collapse:collapse; font-size:14.5px; background:var(--card); border-radius:10px; overflow:hidden; box-shadow:var(--shadow)}
th{background:var(--silk); color:#fff; text-align:left; padding:11px 14px; font-size:12.5px; letter-spacing:.05em; text-transform:uppercase; font-weight:650}
td{padding:11px 14px; border-top:1px solid var(--line); vertical-align:top}
tr.hl td{background:var(--gold-lt); font-weight:600}
.scopebar{display:flex; height:44px; border-radius:10px; overflow:hidden; margin:22px 0 10px; box-shadow:var(--shadow); font-size:12.5px; font-weight:650}
.scopebar div{display:grid; place-items:center; color:#fff; text-align:center; padding:0 8px}
.scopebar .in{background:var(--sage); flex:7}
.scopebar .out{background:var(--silk); flex:93}

/* ---------- decisions ---------- */
.toolbar{display:flex; gap:10px; align-items:center; margin-bottom:20px; flex-wrap:wrap}
.btn{
  font:inherit; font-size:13.5px; font-weight:600; padding:8px 16px; border-radius:20px; cursor:pointer;
  border:1px solid var(--line-2); background:var(--card); color:var(--ink-soft); transition:.15s;
}
.btn:hover{border-color:var(--silk); color:var(--silk)}
.btn.on{background:var(--silk); border-color:var(--silk); color:#fff}
.qgroup{margin-bottom:26px}
.qgroup > h3{display:flex; align-items:center; gap:10px; margin:0 0 12px}
.qgroup > h3 .cnt{font-family:var(--sans); font-size:12px; font-weight:650; color:var(--muted); background:var(--paper-2); border:1px solid var(--line); padding:2px 9px; border-radius:20px}
.q{background:var(--card); border:1px solid var(--line); border-radius:11px; padding:16px 18px; margin-bottom:9px; box-shadow:var(--shadow)}
.q.urgent{border-left:4px solid var(--silk)}
.q .top{display:flex; gap:9px; align-items:baseline; flex-wrap:wrap; margin-bottom:7px}
.q .id{font-size:11px; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; color:var(--muted); background:var(--paper-2); padding:2px 7px; border-radius:5px}
.q .flag{font-size:10.5px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#fff; background:var(--silk); padding:2px 8px; border-radius:20px}
.q .ask{font-size:16.5px; font-weight:600; line-height:1.45; margin-bottom:9px}
.q .meta{font-size:13.5px; color:var(--muted); line-height:1.55}
.q .meta div{margin-top:5px}
.q .meta b{color:var(--ink-soft); font-weight:650}

/* ---------- phases ---------- */
.ph{display:grid; grid-template-columns:52px 1fr 108px; gap:16px; align-items:start; padding:16px 0; border-bottom:1px solid var(--line)}
.ph:last-child{border:0}
.ph .n{width:44px; height:44px; border-radius:11px; background:var(--paper-2); border:1px solid var(--line-2); display:grid; place-items:center; font-family:var(--serif); font-size:19px; color:var(--ink-soft)}
.ph.live .n{background:var(--silk); border-color:var(--silk); color:#fff}
.ph h4{font-size:17px; margin-bottom:5px}
.ph.live h4::after{content:"GOES LIVE HERE"; font-family:var(--sans); font-size:10px; font-weight:700; letter-spacing:.07em; background:var(--gold); color:#fff; padding:2px 8px; border-radius:20px; margin-left:9px; vertical-align:2px}
.ph p{font-size:14.5px; color:var(--ink-soft); margin:0}
.ph .w{text-align:right; font-size:13.5px; color:var(--muted); white-space:nowrap; padding-top:3px}
.ph .w b{display:block; font-family:var(--serif); font-size:21px; color:var(--silk); line-height:1.1}

/* ---------- before/after ---------- */
.ba{display:grid; grid-template-columns:1fr 34px 1fr; gap:0; align-items:stretch; margin-bottom:9px}
.ba .t,.ba .a{padding:14px 16px; font-size:14.5px; line-height:1.55}
.ba .t{background:#fff; border:1px solid var(--line); border-right:0; border-radius:10px 0 0 10px; color:var(--muted)}
.ba .arrow{display:grid; place-items:center; background:var(--paper-2); border-top:1px solid var(--line); border-bottom:1px solid var(--line); color:var(--silk); font-size:15px}
.ba .a{background:var(--sage-lt); border:1px solid var(--line); border-left:0; border-radius:0 10px 10px 0; color:var(--ink)}
.balabel{display:grid; grid-template-columns:1fr 34px 1fr; margin-bottom:8px; font-size:11.5px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--muted)}
.balabel span:last-child{color:var(--sage)}

/* ---------- footer ---------- */
footer{padding:44px 56px; background:#2a211c; color:rgba(255,255,255,.68); font-size:14px}
footer h4{color:#fff; font-size:17px; margin-bottom:10px}
footer a{color:#e9b9a6}
footer .cols{display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:26px; max-width:1000px}

/* ---------- responsive ---------- */
@media (max-width:1000px){
  .wrap{grid-template-columns:1fr}
  .rail{position:static; height:auto; border-right:0; border-bottom:1px solid var(--line)}
  .rail nav{flex-direction:row; flex-wrap:wrap; gap:6px}
  .rail a{font-size:12.5px; padding:5px 11px; background:#fff; border:1px solid var(--line)}
  section,.hero,footer{padding-left:24px; padding-right:24px}
  .hero h1{font-size:36px}
  h2{font-size:27px}
  .ba,.balabel{grid-template-columns:1fr}
  .ba .t{border-radius:10px 10px 0 0; border-right:1px solid var(--line); border-bottom:0}
  .ba .a{border-radius:0 0 10px 10px; border-left:1px solid var(--line); border-top:0}
  .ba .arrow{border-left:1px solid var(--line); border-right:1px solid var(--line); padding:2px}
  .balabel{display:none}
}

/* ---------- print ---------- */
@media print{
  .rail,.toolbar,.noprint{display:none}
  .wrap{display:block; max-width:none}
  body{background:#fff; font-size:10.5pt}
  section{padding:16pt 0; page-break-inside:auto; border-bottom:1px solid #ccc; background:#fff!important}
  .hero{background:#fff!important; color:#000; padding:0 0 16pt}
  .hero h1{color:var(--silk); font-size:26pt} .hero .sub,.hero .meta{color:#333}
  .hero .meta{border-color:#ccc} .hero .meta b{color:#000}
  .readfirst{background:#f4f4f4; border:1px solid #ccc} .readfirst h4,.readfirst p{color:#000}
  .card,.chg,.role,.q,.stat{box-shadow:none; break-inside:avoid}
  .step,.ph,.ba,.q{break-inside:avoid}
  h2,h3,h4{break-after:avoid}
  footer{background:#fff; color:#333; border-top:2px solid var(--silk)}
  footer h4{color:#000} footer a{color:var(--silk)}
}
`;

// --------------------------------------------------------------- sections
function heroSection(meta) {
  return `
<header class="hero" id="top">
  <div class="inner">
    <div class="eyebrow">${esc(meta.org)}</div>
    <h1>${esc(meta.title)}</h1>
    <p class="sub">${esc(meta.sub)}</p>
    <div class="readfirst">
      <h4>How to read this</h4>
      <p>${rich(meta.howto)}</p>
    </div>
    <div class="meta">
      ${meta.facts.map(f => `<span><b>${esc(f[0])}</b> &nbsp;${esc(f[1])}</span>`).join('')}
    </div>
  </div>
</header>`;
}

function statsSection(stats) {
  return section('facts', 'By the numbers', 'The figures that shaped every design decision',
    `Nothing here is invented. Each number comes from the laboratory's own published figures or from the
     standards its work is governed by, and each one changed something about how the system is built.`,
    `<div class="stats">${stats.map(s => `
      <div class="stat">
        <div class="v">${esc(s.value)}</div>
        <div class="l">${esc(s.label)}</div>
        <div class="n">${rich(s.note)}</div>
      </div>`).join('')}</div>`, true);
}

function journeySection(j) {
  return section('journey', 'Follow one lot', 'From the counter to a signed certificate',
    j.intro,
    `${j.consignment ? `<div class="note silk"><b>The consignment in this example</b>${rich(j.consignment)}</div>` : ''}
     <div class="journey">
       ${j.steps.map(s => `
       <div class="step">
         <div class="dot">${esc(String(s.n))}</div>
         <h4>${esc(s.title)}</h4>
         <div><span class="who">${esc(s.who)}</span>${s.minutes ? `<span class="mins">${esc(s.minutes)}</span>` : ''}</div>
         <p>${rich(s.what)}</p>
         ${s.systemDoes ? `<div class="chip sys"><span class="k">What the system does</span>${rich(s.systemDoes)}</div>` : ''}
         ${s.guard ? `<div class="chip guard"><span class="k">The mistake it prevents</span>${rich(s.guard)}</div>` : ''}
       </div>`).join('')}
     </div>
     ${j.ending ? `<div class="note sage"><b>And afterwards</b>${rich(j.ending)}</div>` : ''}`);
}

function changesSection(c) {
  return section('changes', 'What changed', 'Your ten points, and the six things we had to rethink',
    c.creditWhereDue,
    `<div class="grid2">${c.changes.map(ch => `
      <div class="chg">
        <div class="hd"><h4>${esc(ch.title)}</h4></div>
        <div class="bd">
          <div class="row was"><span class="k">The note said</span>${rich(ch.noteSaid)}</div>
          <div class="row now"><span class="k">What we do instead</span>${rich(ch.insteadWeDo)}</div>
          <div class="row why"><span class="k">Why it matters</span>${rich(ch.whyItMatters)}</div>
          <div class="row eg"><span class="k">For example</span>${rich(ch.example)}</div>
        </div>
      </div>`).join('')}</div>`, true);
}

function rolesSection(r) {
  return section('roles', 'Who uses it', 'Every person, and exactly what they see',
    `The system shows each person only what their job needs. That is not merely tidy — it is the
     impartiality control your own note asked for, written into the software rather than left to habit.`,
    `<div class="grid3">${r.roles.map(x => `
      <div class="role${x.isKey ? ' key' : ''}">
        <h4>${esc(x.name)}${x.isKey ? '<span class="star">DAILY</span>' : ''}</h4>
        <p>${rich(x.oneLine)}</p>
        <div class="kv"><b>Sees:</b> ${rich(x.sees)}<br><span class="no"><b>Cannot:</b> ${rich(x.cannot)}</span></div>
      </div>`).join('')}</div>
     ${r.blinding ? `
     <h3>Blinding the tester &mdash; your idea, and its honest limits</h3>
     <div class="grid2">
       <div class="card"><p>${rich(r.blinding.whatItIs)}</p><p>${rich(r.blinding.howItWorks)}</p></div>
       <div class="card" style="border-color:var(--gold)"><p><strong>Where it cannot be absolute</strong></p><p>${rich(r.blinding.honestLimit)}</p></div>
     </div>` : ''}`, true);
}

function scopeSection(scope) {
  return section('scope', 'The accredited scope', 'Seven entries &mdash; and why that changes everything',
    `You told us that a good deal of the unit's testing is done outside NABL. The scope annexure to
     certificate <strong>NABLT0726AD18713</strong> confirms it, and it turned out to be the single most
     important thing anyone told us about this system.`,
    `<table>
      <tr><th>Material or product</th><th>Parameter</th><th>Method</th></tr>
      ${scope.map(s => `<tr${s[0].includes('Raw Silk') ? ' class="hl"' : ''}><td>${esc(s[0])}</td><td>${esc(s[1])}</td><td>${esc(s[2])}</td></tr>`).join('')}
    </table>
    <div class="scopebar">
      <div class="in">Inside scope</div>
      <div class="out">Outside the accredited scope &mdash; grading, evenness, cohesion, twist, boil-off, tenacity, conditioning &amp; weight certificates</div>
    </div>
    <p style="font-size:13.5px;color:var(--muted);margin-top:0">Proportions above are illustrative of the
    <em>work mix</em>, not of the annexure: five of the seven accredited entries are fabric tests, while the
    unit's recorded revenue is overwhelmingly raw silk.</p>
    <div class="note"><b class="g">What this means for the software</b>
      The plain, non-accredited certificate is the <strong>everyday</strong> document, not the exception.
      Where one sample carries both accredited and non-accredited tests, the system issues
      <strong>two separate certificates</strong> &mdash; marking a non-accredited test with an asterisk on an
      accredited report is not permitted. If that differs from current practice, the software will change it.
    </div>
    <div class="note silk"><b>The one question that decides the scale of this</b>
      Does the <strong>Limited Test</strong> &mdash; about 98% of your samples &mdash; fall under
      <em>Raw Silk Yarn / Count / IS 15090 (Part 5)</em>? It produces both a count and a size deviation, and
      the annexure names only <em>Count</em>. This single answer decides whether the accreditation appears on
      nearly every certificate you issue, or almost none of them.
    </div>`);
}

function decisionsSection(d) {
  const total = d.groups.reduce((n, g) => n + g.questions.length, 0);
  const urgent = d.groups.reduce((n, g) => n + g.questions.filter(q => q.urgent).length, 0);
  return section('decisions', 'Over to you', `${total} decisions only you can make`,
    d.intro || '',
    `<div class="toolbar noprint">
       <button class="btn on" data-filter="all">Show all ${total}</button>
       <button class="btn" data-filter="urgent">Only the ${urgent} urgent ones</button>
       <button class="btn" onclick="window.print()">Print / save as PDF</button>
     </div>
     ${d.groups.map(g => `
       <div class="qgroup" data-group>
         <h3>${esc(g.theme)}<span class="cnt">${g.questions.length}</span></h3>
         ${g.questions.map(q => `
           <div class="q${q.urgent ? ' urgent' : ''}" data-urgent="${q.urgent ? '1' : '0'}">
             <div class="top">
               <span class="id">${esc(q.id)}</span>
               ${q.urgent ? '<span class="flag">Needed before we start</span>' : ''}
             </div>
             <div class="ask">${rich(q.ask)}</div>
             <div class="meta">
               <div><b>Why it matters:</b> ${rich(q.whyItMatters)}</div>
               <div><b>If you don't answer, we will assume:</b> ${rich(q.ourGuess)}</div>
             </div>
           </div>`).join('')}
       </div>`).join('')}`, true);
}

function planSection(phases) {
  return section('plan', 'The plan', 'Seven phases, one developer',
    `Each phase ends with something you can actually use. The estimates are ranges, not promises, and they
     exclude leave, holidays and the laboratory's own master-data work.`,
    `<div class="card">${phases.map(p => `
      <div class="ph${p.isLive ? ' live' : ''}">
        <div class="n">${esc(p.n)}</div>
        <div><h4>${esc(p.name)}</h4><p>${rich(p.gets)}</p></div>
        <div class="w"><b>${esc(p.weeks)}</b>weeks</div>
      </div>`).join('')}</div>
      <div class="note"><b class="g">Phase 0 is not optional</b>
        Two weeks spent sitting in the laboratory watching the real work &mdash; and collecting one filled
        copy of every form and register you use &mdash; will change more of this design than two months of
        guessing at a desk.
      </div>`);
}

function benefitsSection(b, notFixed) {
  return section('benefits', 'Before and after', 'What actually changes on the bench',
    `Not promises about efficiency &mdash; just the specific things that are hard today and stop being hard.`,
    `<div class="balabel"><span>Today</span><span></span><span>With the system</span></div>
     ${b.map(x => `
       <div class="ba">
         <div class="t">${rich(x.today)}</div>
         <div class="arrow">&#8594;</div>
         <div class="a">${rich(x.after)}</div>
       </div>`).join('')}
     ${notFixed ? `<div class="note"><b class="g">And what it will not fix</b>${rich(notFixed)}</div>` : ''}`, true);
}

function section(id, eyebrow, title, lede, body, wide) {
  return `
<section id="${id}">
  <div class="inner${wide ? ' wide' : ''}">
    <div class="eyebrow">${eyebrow}</div>
    <h2>${title}</h2>
    ${lede ? `<p class="lede">${rich(lede)}</p>` : ''}
    ${body}
  </div>
</section>`;
}

// --------------------------------------------------------------- assemble
function build(content, meta) {
  const NAV = [
    ['top', 'Start here'], ['facts', 'By the numbers'], ['journey', 'Follow one lot'],
    ['changes', 'What changed'], ['roles', 'Who uses it'], ['scope', 'Accredited scope'],
    ['benefits', 'Before &amp; after'], ['plan', 'The plan'], ['decisions', 'Over to you'],
  ];

  const SCOPE = [
    ['Fabric', 'Length', 'IS 1954'],
    ['Fabric', 'Mass', 'IS 1964'],
    ['Fabric', 'Number of Threads Per Unit Length', 'IS 1963'],
    ['Fabric', 'Percentage by Weight of Warp and Weft Yarn', 'IS 17208'],
    ['Fabric', 'Width', 'IS 1954'],
    ['Raw Silk Yarn', 'Count', 'IS 15090 (Part 5)'],
    ['Woven Fabric', 'Linear Density of Yarn Removed from Fabric', 'IS 3442'],
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(meta.title)}</title>
<style>${CSS}</style>
</head>
<body>
<div class="wrap">
  <aside class="rail noprint">
    <div class="brand">${esc(meta.title)}<small>${esc(meta.railSub)}</small></div>
    <nav>${NAV.map((n, i) => `<a href="#${n[0]}"><span class="num">${i === 0 ? '&#9679;' : i}</span>${n[1]}</a>`).join('')}</nav>
  </aside>
  <main>
    ${heroSection(meta)}
    ${content.facts ? statsSection(content.facts.stats) : ''}
    ${content.journey ? journeySection(content.journey) : ''}
    ${content.changes ? changesSection(content.changes) : ''}
    ${content.roles ? rolesSection(content.roles) : ''}
    ${scopeSection(SCOPE)}
    ${content.facts ? benefitsSection(content.facts.benefits, content.facts.notFixed) : ''}
    ${content.facts ? planSection(content.facts.phases) : ''}
    ${content.decisions ? decisionsSection(content.decisions) : ''}
    <footer>
      <div class="cols">
        <div>
          <h4>This is the short version</h4>
          <p>The full Software Requirements Specification carries every detail: ${esc(meta.reqCount)} numbered
          requirements, the complete data design, and ${esc(meta.acCount)} acceptance tests. This guide is a
          strict subset of it, so the two cannot disagree.</p>
        </div>
        <div>
          <h4>The companion documents</h4>
          <p>Silk Testing Laboratory System &mdash; Full Specification (TTL&#8209;SRS&#8209;v1.0)<br>
          Silk Testing Laboratory System &mdash; Overview for the Lab (TTL&#8209;BRIEF&#8209;v1.0)</p>
        </div>
        <div>
          <h4>Next step</h4>
          <p>Phase 0 &mdash; two days at the counter and the bench, and one filled copy of every form and
          register in use. Then the questions in <a href="#decisions">Over to you</a>.</p>
        </div>
      </div>
    </footer>
  </main>
</div>
<script>
(function(){
  // Contents rail follows the reader.
  var links = [].slice.call(document.querySelectorAll('.rail a'));
  var secs  = links.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  function spy(){
    var best = 0;
    secs.forEach(function(s,i){ if(s && s.getBoundingClientRect().top <= 140) best = i; });
    links.forEach(function(a,i){ a.classList.toggle('on', i === best); });
  }
  addEventListener('scroll', spy, {passive:true}); spy();

  // Urgent-only filter on the decisions list.
  var btns = [].slice.call(document.querySelectorAll('[data-filter]'));
  btns.forEach(function(b){
    b.addEventListener('click', function(){
      btns.forEach(function(x){ x.classList.toggle('on', x === b); });
      var only = b.getAttribute('data-filter') === 'urgent';
      [].forEach.call(document.querySelectorAll('.q'), function(q){
        q.style.display = (only && q.getAttribute('data-urgent') !== '1') ? 'none' : '';
      });
      [].forEach.call(document.querySelectorAll('[data-group]'), function(g){
        var vis = g.querySelectorAll('.q:not([style*="none"])').length;
        g.style.display = vis ? '' : 'none';
      });
    });
  });
})();
</script>
</body>
</html>`;
}

// --------------------------------------------------------------- entry
function main() {
  const [contentPath, outPath, metaPath] = process.argv.slice(2);
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  const meta = JSON.parse(fs.readFileSync(metaPath || 'guide_meta.json', 'utf8'));
  const html = build(content, meta);
  fs.writeFileSync(outPath, html);
  console.log('wrote %s (%d KB)', outPath, Math.round(html.length / 1024));
  const missing = ['facts', 'journey', 'changes', 'roles', 'decisions'].filter(k => !content[k]);
  if (missing.length) console.log('WARNING missing content blocks: %s', missing.join(', '));
}

if (require.main === module) main();
module.exports = { build };
