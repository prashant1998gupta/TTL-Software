'use strict';
/** Every screen. Server-rendered HTML from data; no client framework. */
const { page, esc } = require('./layout');

const badge = (s) => `<span class="badge b-${esc(s)}">${esc(s.replace('_', ' '))}</span>`;
const dt = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ---------------------------------------------------------------- login
function login({ error }) {
  return page({ title: 'Sign in', user: null, body: `
<div class="login-wrap"><div class="login">
  <div class="head">
    <div class="te">కేంద్రీయ పట్టు మండలి · పట్టు పరీక్షా ప్రయోగశాల</div>
    <h1>Silk Testing Laboratory</h1>
    <div class="te">RSTRS Dharmavaram — Central Silk Board</div>
  </div>
  ${error ? `<div class="flash err">${esc(error)}</div>` : ''}
  <div class="card">
    <form method="post" action="/login">
      <div class="row"><label for="u">Username</label><input id="u" name="username" autofocus autocomplete="username"></div>
      <div class="row"><label for="p">Password</label><input id="p" name="password" type="password" autocomplete="current-password"></div>
      <div class="actions"><button class="btn" style="width:100%">Sign in</button></div>
    </form>
    <div class="roles">Development sign-ins — <b>lakshmi</b> counter · <b>ravi</b> tester ·
      <b>suma</b> verifier · <b>incharge</b> signatory · password <b>dvm</b></div>
  </div>
</div></div>`});
}

// ---------------------------------------------------------------- counter
function counter({ user, flash, tests, customers, registered }) {
  const opts = tests.map((t) =>
    `<option value="${t.id}">${esc(t.name)} — ₹${Number(t.fee_rupees)}</option>`).join('');
  const dl = customers.map((c) => `<option>${esc(c.name)}</option>`).join('');
  return page({ title: 'Register a sample', user, active: '/counter', flash, body: `
<h2>Register a sample</h2>
<p class="hint">Replaces the intake register. The number is allotted by the system inside one
transaction, so two people at the counter can never give out the same one.</p>
${registered ? `
<div class="allot">
  <div class="lbl">Registered · నమోదు అయింది</div>
  <div class="no">${esc(registered.sample_no)}</div>
  <div class="sub">${esc(registered.customer_name)} · lot ${esc(registered.lot_mark)} ·
    ${esc(registered.test_name)} · fee ₹${Number(registered.fee_rupees)}</div>
</div>
<div class="card no-print" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
  <b>Acknowledgement slip</b><span class="hint" style="margin:0">— hand the printed half to the customer</span>
  <button class="btn ghost sm" onclick="window.print()">Print slip</button>
</div>
<div class="slip">
  <h3>Silk Testing Laboratory, Dharmavaram</h3>
  <div class="te">పట్టు పరీక్షా ప్రయోగశాల — నమూనా రసీదు</div>
  <div style="display:flex;align-items:center;gap:14px">
    <div class="n">${esc(registered.sample_no)}</div>
    <img src="/slip-qr/${registered.id}.png" width="64" height="64"
         alt="QR of the sample number, for scanning at the bench">
  </div>
  <div class="kv">
    <div class="k">Customer</div><div>${esc(registered.customer_name)}</div>
    <div class="k">Lot mark</div><div>${esc(registered.lot_mark)}</div>
    <div class="k">Test</div><div>${esc(registered.test_name)}</div>
    <div class="k">Fee</div><div>₹${Number(registered.fee_rupees)}</div>
    <div class="k">Received</div><div>${dt(registered.registered_at)}</div>
  </div>
  <p style="font-size:11.5px;color:var(--mute);margin:12px 0 0">Bring this slip (or the number above)
  to collect the report. Report is released on payment of the fee.</p>
</div>
<div class="actions no-print"><a class="btn" href="/counter">Register the next sample</a>
  <a class="btn ghost" href="/work">Today's work</a></div>` : `
<div class="card">
  <form method="post" action="/counter">
    <div class="row"><label>Customer<span class="sub">Type to search; a new name is added</span></label>
      <input name="customerName" list="dl-cust" required autofocus placeholder="Sri Lakshmi Silks">
      <datalist id="dl-cust">${dl}</datalist></div>
    <div class="row"><label>Phone<span class="sub">Only for a new customer</span></label>
      <input name="customerPhone" placeholder="94400 12345"></div>
    <div class="row"><label>Brought by<span class="sub">If different from the customer</span></label>
      <input name="broughtBy" placeholder="Sri M. Naidu (broker)"></div>
    <div class="row"><label>Lot mark<span class="sub">As marked on the bales</span></label>
      <input name="lotMark" required placeholder="SLS-118"></div>
    <div class="row"><label>Declared denier</label>
      <input name="declaredDenier" required placeholder="20/22" style="max-width:140px"></div>
    <div class="row"><label>Quantity</label>
      <div class="inline">
        <input name="bales" type="number" min="0" placeholder="Bales" style="max-width:110px">
        <input name="books" type="number" min="0" placeholder="Books" style="max-width:110px">
        <input name="weightKg" type="number" step="0.1" min="0" placeholder="kg" style="max-width:110px">
      </div></div>
    <div class="row"><label>Test</label><select name="testId">${opts}</select></div>
    <div class="actions"><button class="btn">Register</button></div>
  </form>
  <script>
  // A double-click at a busy counter burned two gap-free numbers for one lot.
  document.currentScript.previousElementSibling.addEventListener('submit', function (e) {
    var b = e.target.querySelector('button.btn'); if (b.disabled) { e.preventDefault(); return; }
    b.disabled = true; b.textContent = 'Registering…';
  });
  </script>
</div>`}`});
}

// ---------------------------------------------------------------- worklist
function worklist({ user, flash, rows, q }) {
  const trs = rows.map((s) => `
<tr>
  <td><a class="no" href="/sample/${s.id}">${esc(s.sample_no)}</a></td>
  <td>${esc(s.customer_name)}</td>
  <td>${esc(s.lot_mark)}</td>
  <td>${esc(s.test_name)}</td>
  <td>${badge(s.status)}${s.report_no ? `<div style="font-size:12px;color:var(--mute)">${esc(s.report_no)}</div>` : ''}</td>
</tr>`).join('');
  return page({ title: "Today's work", user, active: '/work', flash, body: `
<h2>Today's work</h2>
<p class="hint">Answers “where is that sample?” without walking to the bench. Click a number to act on it.</p>
<form method="get" action="/work" class="inline" style="margin-bottom:16px">
  <input name="q" value="${esc(q || '')}" placeholder="Search by number, customer or lot mark">
  <button class="btn ghost sm">Search</button>
  ${q ? '<a class="btn ghost sm" href="/work">Show all</a>' : ''}
</form>
<div class="scrollx"><table>
  <thead><tr><th>Number</th><th>Customer</th><th>Lot</th><th>Test</th><th>Status</th></tr></thead>
  <tbody>${trs || '<tr><td colspan="5" style="color:var(--mute)">Nothing yet — register a sample at the counter.</td></tr>'}</tbody>
</table></div>`});
}

// ---------------------------------------------------------------- sample detail
const STEPS = ['REGISTERED', 'IN_TEST', 'SUBMITTED', 'VERIFIED', 'ISSUED'];
function pipeline(status) {
  if (status === 'WITHDRAWN') {
    return `<div class="pipeline">${STEPS.map((x) => `<div class="step done">${x.replace('_', ' ')}</div>`).join('')}
      <div class="step now" style="background:var(--bad);border-color:var(--bad)">WITHDRAWN</div></div>`;
  }
  const i = STEPS.indexOf(status);
  return `<div class="pipeline">${STEPS.map((x, j) =>
    `<div class="step ${j < i ? 'done' : j === i ? 'now' : ''}">${x.replace('_', ' ')}</div>`).join('')}</div>`;
}

function sample({ user, flash, s, readings, computed, equipment, verifyBase }) {
  const kv = `
<div class="kv">
  <div class="k">Customer</div><div>${esc(s.customer_name)}${s.brought_by ? ` <span style="color:var(--mute)">(brought by ${esc(s.brought_by)})</span>` : ''}</div>
  <div class="k">Lot / declared</div><div>${esc(s.lot_mark)} · ${esc(s.declared_denier)} denier</div>
  <div class="k">Quantity</div><div>${s.bales} bales, ${s.books} books${s.weight_kg ? `, ${s.weight_kg} kg` : ''}</div>
  <div class="k">Test / fee</div><div>${esc(s.test_name)} · ₹${Number(s.fee_rupees)}</div>
  <div class="k">Registered</div><div>${dt(s.registered_at)}</div>
  ${s.tester_name ? `<div class="k">Tester</div><div>${esc(s.tester_name)}${s.equipment_code ? ` · balance ${esc(s.equipment_code)}` : ''}</div>` : ''}
  ${s.verifier_name ? `<div class="k">Verified by</div><div>${esc(s.verifier_name)}</div>` : ''}
  ${s.sendback_reason ? `<div class="k" style="color:var(--bad)">Sent back</div><div style="color:var(--bad)">${esc(s.sendback_reason)}</div>` : ''}
</div>`;

  let action = '';
  if (s.status === 'REGISTERED' && ['tester', 'admin'].includes(user.role)) {
    const eqs = equipment.map((e) => {
      const ok = e.is_in_service && new Date(e.calibrated_to) >= new Date();
      return `<option value="${e.id}" ${ok ? '' : 'disabled'}>${esc(e.code)} — ${esc(e.name)}${ok ? '' : ' (OUT OF CALIBRATION)'}</option>`;
    }).join('');
    action = `<div class="card"><b>Start testing</b>
<p class="hint">Choosing the balance is the calibration gate: one that is out of calibration cannot be picked, and the check runs again when the readings are saved.</p>
<form method="post" action="/sample/${s.id}/start">
  <div class="row"><label>Balance</label><select name="equipmentId">${eqs}</select></div>
  <div class="actions"><button class="btn">Start test — take it to the bench</button></div>
</form></div>`;
  }
  if (s.status === 'IN_TEST' && ['tester', 'admin'].includes(user.role)) {
    action = readingsGrid(s, readings);
  }
  if (s.status === 'SUBMITTED' && ['verifier', 'signatory', 'admin'].includes(user.role)) {
    action = `<div class="card"><b>Verification</b>
<p class="hint">A second pair of eyes on the numbers (the person who tested cannot verify — the system refuses it).</p>
${computedPanel(computed)}
${readingsTable(readings)}
<form method="post" action="/sample/${s.id}/verify" style="margin-top:16px">
  <div class="actions">
    <button class="btn ok">Verify — the numbers are right</button>
  </div>
</form>
<form method="post" action="/sample/${s.id}/sendback" style="margin-top:10px">
  <div class="inline"><input name="reason" placeholder="Reason for sending back (recorded)" required>
  <button class="btn ghost sm">Send back</button></div>
</form></div>`;
  }
  if (s.status === 'VERIFIED' && ['signatory', 'admin'].includes(user.role)) {
    action = `<div class="card"><b>Issue the certificate</b>
<p class="hint">Allots the report number, renders the certificate as tagged PDF, signs it digitally,
freezes the file and publishes the QR verification record — one transaction, or none of it.</p>
${computedPanel(computed)}
<form method="post" action="/sample/${s.id}/issue">
  <div class="actions"><button class="btn">Sign and issue</button></div>
</form></div>`;
  }
  if (s.status === 'ISSUED') {
    action = `<div class="card"><b>Issued — ${esc(s.report_no)}</b>
<div class="kv" style="margin-top:10px">
  <div class="k">Certificate</div><div><a class="btn sm" href="/report/${esc(s.report_no).replace(/\//g, '_')}.pdf">Download the signed PDF</a></div>
  <div class="k">Verify link</div><div><a href="${esc(verifyBase)}/v/${esc(s.verify_token)}" target="_blank">${esc(verifyBase)}/v/${esc(s.verify_token).slice(0, 12)}…</a></div>
  <div class="k">Fingerprint</div><div class="mono">${esc(s.pdf_sha256)}</div>
</div>
${['signatory', 'admin'].includes(user.role) ? `
<form method="post" action="/sample/${s.id}/amend" style="margin-top:16px">
  <div class="inline"><input name="reason" placeholder="Reason for amendment (recorded, printed on the new certificate)" required>
  <button class="btn ghost sm">Amend — back to the bench</button></div>
  <p class="hint" style="margin:6px 0 0">The corrected certificate is a new report; this one stays
  retrievable, marked superseded, and its QR names the replacement.</p>
</form>
<form method="post" action="/sample/${s.id}/withdraw" style="margin-top:12px">
  <div class="inline"><input name="reason" placeholder="Reason for withdrawal (recorded, shown on the QR page)" required>
  <button class="btn ghost sm" style="color:var(--bad);border-color:var(--bad)">Withdraw outright</button></div>
</form>` : ''}</div>`;
  }
  if (s.status === 'WITHDRAWN') {
    action = `<div class="flash err">This certificate was withdrawn. Anyone scanning its QR code is told so.</div>`;
  }
  if (!action && s.status !== 'WITHDRAWN') {
    action = `<div class="card" style="color:var(--mute)">Waiting for the ${
      { REGISTERED: 'tester to start the test', IN_TEST: 'tester to enter the readings',
        SUBMITTED: 'verifier to check the numbers', VERIFIED: 'Unit In-Charge to sign and issue' }[s.status]
    }. Your role: ${esc(user.role)}.</div>`;
  }

  return page({ title: s.sample_no, user, active: '/work', flash, body: `
<h2>${esc(s.sample_no)} ${badge(s.status)}</h2>
<p class="hint">${esc(s.test_name)} for ${esc(s.customer_name)}</p>
${pipeline(s.status)}
<div class="card">${kv}</div>
${action}`});
}

// ---------------------------------------------------------------- readings grid
function readingsGrid(s, readings) {
  const n = s.readings_required;
  const cells = Array.from({ length: n }, (_, i) => `
<div class="cell"><span>${i + 1}</span>
<input inputmode="decimal" name="g${i + 1}" id="g${i + 1}" value="${readings[i] ?? ''}"
  autocomplete="off"></div>`).join('');
  return `<div class="card"><b>Enter the ${n} skein weights</b>
<p class="hint">Grams, as the balance shows. <b>Enter</b> moves to the next skein; arrows move around.
Denier and deviation are worked out as you type — the certificate’s numbers are recomputed on the
server from what is saved, never taken from the screen.</p>
<form method="post" action="/sample/${s.id}/readings" id="rform">
  <div class="grid" id="grid">${cells}</div>
  <div class="calc" id="calc"></div>
  <div class="actions">
    <button class="btn" id="save" disabled>Save readings and submit for verification</button>
    <span class="hint" style="margin:0">Sizing skeins of 450 m · declared ${esc(s.declared_denier)}</span>
  </div>
</form></div>
<script>
'use strict';
(function () {
  var n = ${n};
  var inputs = [];
  for (var i = 1; i <= n; i++) inputs.push(document.getElementById('g' + i));
  var calc = document.getElementById('calc');
  var save = document.getElementById('save');

  // Live preview only. Mirrors src/calc (divisor n); the authoritative numbers
  // are recomputed on the server from the stored readings.
  function mean(a){var t=0;a.forEach(function(x){t+=x});return t/a.length}
  function sd(a){var m=mean(a),s=0;a.forEach(function(x){s+=(x-m)*(x-m)});return Math.sqrt(s/a.length)}
  function f2(v){return (Math.round(v*100)/100).toFixed(2)}

  function refresh(){
    var vals=[],bad=0;
    inputs.forEach(function(el){
      var v=parseFloat(el.value);
      var isBad = el.value.trim()!=='' && (!isFinite(v)||v<=0);
      el.classList.toggle('bad', isBad);
      if(isBad) bad++;
      if(isFinite(v)&&v>0) vals.push(v*20); // 450 m skein -> denier = g*20
    });
    var done = vals.length===n && !bad;
    save.disabled = !done;
    if(!vals.length){calc.innerHTML='';return}
    var m=mean(vals), d=vals.length>1?sd(vals):0;
    calc.innerHTML =
      '<div><div class="k">Entered</div><div class="v">'+vals.length+'<small>/'+n+'</small></div></div>'+
      '<div><div class="k">Average denier</div><div class="v">'+f2(m)+'</div></div>'+
      '<div><div class="k">Size deviation</div><div class="v">'+f2(d)+'</div></div>'+
      '<div><div class="k">CV %</div><div class="v">'+f2(m?d/m*100:0)+'</div></div>';
  }

  inputs.forEach(function(el, i){
    el.addEventListener('input', refresh);
    el.addEventListener('keydown', function(e){
      var go=null, cols=5;
      if(e.key==='Enter'){e.preventDefault();go=i+1}
      else if(e.key==='ArrowRight'&&el.selectionStart===el.value.length)go=i+1;
      else if(e.key==='ArrowLeft'&&el.selectionStart===0)go=i-1;
      else if(e.key==='ArrowDown')go=i+cols;
      else if(e.key==='ArrowUp')go=i-cols;
      if(go!==null&&go>=0&&go<n){e.preventDefault&&e.preventDefault();inputs[go].focus();inputs[go].select()}
      if(e.key==='Enter'&&i===n-1&&!save.disabled)save.focus();
    });
  });
  inputs[0].focus();
  refresh();
})();
</script>`;
}

function computedPanel(c) {
  if (!c) return '';
  return `<div class="calc">
  <div><div class="k">Skeins</div><div class="v">${c.n}</div></div>
  <div><div class="k">Average denier</div><div class="v">${c.averageDenier}</div></div>
  <div><div class="k">Size deviation</div><div class="v">${c.sizeDeviation}</div></div>
  <div><div class="k">CV %</div><div class="v">${c.cvPercent}</div></div>
  <div><div class="k">Finest / coarsest</div><div class="v" style="font-size:15px">${c.minDenier} / ${c.maxDenier}</div></div>
</div>`;
}

function readingsTable(readings) {
  if (!readings || !readings.length) return '';
  const tds = readings.map((g, i) =>
    `<div class="cell"><span>${i + 1}</span><input value="${g}" disabled></div>`).join('');
  return `<details style="margin-top:14px"><summary style="cursor:pointer;font-size:14px">
  The ${readings.length} readings as entered (g)</summary>
  <div class="grid" style="margin-top:12px">${tds}</div></details>`;
}

// ---------------------------------------------------------------- first-run setup
function setup({ error, values = {} }) {
  const v = (k) => esc(values[k] || '');
  return page({ title: 'First-run setup', user: null, body: `
<div class="login-wrap"><div class="login" style="width:min(560px,100%)">
  <div class="head">
    <div class="te">మొదటి అమరిక</div>
    <h1>Set up this installation</h1>
    <div class="te">Runs once. Creates the Unit In-Charge's account and continues the paper registers' numbering.</div>
  </div>
  ${error ? `<div class="flash err">${esc(error)}</div>` : ''}
  <div class="card">
    <form method="post" action="/setup">
      <div class="row"><label>Username</label><input name="username" value="${v('username')}" required autofocus></div>
      <div class="row"><label>Full name<span class="sub">As it will appear on certificates</span></label>
        <input name="fullName" value="${v('fullName')}" required></div>
      <div class="row"><label>Name in Telugu<span class="sub">Optional</span></label>
        <input name="fullNameTe" value="${v('fullNameTe')}"></div>
      <div class="row"><label>Password<span class="sub">At least 8 characters</span></label>
        <input name="password" type="password" required minlength="8"></div>
      <hr style="border:0;border-top:1px solid var(--line);margin:18px 0">
      <p class="hint" style="margin-bottom:14px"><b>The cut-over numbers.</b> Open the paper
      registers and copy the LAST number used in each. The system continues from the next number —
      a collision between a system number and a hand-written one is a records incident that cannot
      be undone, so these are asked, not guessed.</p>
      <div class="row"><label>Last sample number used<span class="sub">From the intake register; 0 for a brand-new series</span></label>
        <input name="lastSample" value="${v('lastSample')}" inputmode="numeric" required></div>
      <div class="row"><label>Last report number used<span class="sub">From the report-issue register</span></label>
        <input name="lastReport" value="${v('lastReport')}" inputmode="numeric" required></div>
      <div class="actions"><button class="btn" style="width:100%">Complete setup</button></div>
    </form>
  </div>
</div></div>`});
}

module.exports = { login, counter, worklist, sample, setup };
