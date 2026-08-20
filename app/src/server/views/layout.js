'use strict';
/**
 * The HTML shell and the whole design system, inline — one file to open in a
 * browser on the laboratory network, no CDN, no build step (ARC-16, ARC-08).
 *
 * The visual language is the one the Unit In-Charge already approved in the
 * prototype: warm paper ground, silk-maroon accents, one typeface, generous
 * hit targets for a counter that is loud and busy. Server-rendered pages with
 * selective interactivity only where a screen earns it (ARC-09) — the readings
 * grid is the only rich screen in Phase 1.
 */

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `
:root{
  --ink:#15120f; --soft:#4d443c; --mute:#82776c;
  --bg:#f2efea; --card:#fff; --line:#ded5c8; --line2:#c8bcab;
  --silk:#8c1d2f; --silk-dk:#701626; --silk-lt:#fbeef0;
  --ok:#3f6146; --ok-lt:#eaf2ec;
  --warn:#a8801a; --warn-lt:#fdf5e3;
  --bad:#9e2b25; --bad-lt:#fceceb;
  --info:#31556e; --info-lt:#e9f1f6;
  --f:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Roboto,Arial,sans-serif;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 var(--f)}
button,input,select,textarea{font:inherit}
a{color:var(--silk)}

.top{background:var(--silk);color:#fff;padding:10px 20px;display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.top .brand{font-weight:700;font-size:15px}
.top .brand span{display:block;font-weight:400;font-size:11.5px;opacity:.78}
.top .who{margin-left:auto;font-size:13px;opacity:.9;display:flex;align-items:center;gap:12px}
.top .who form{margin:0}
.top .who button{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.35);color:#fff;
  border-radius:7px;padding:6px 13px;cursor:pointer;font-size:13px}
.top .who button:hover{background:rgba(255,255,255,.24)}

.tabs{display:flex;background:#fff;border-bottom:1px solid var(--line);padding:0 12px;gap:2px;overflow-x:auto}
.tabs a{display:block;text-decoration:none;padding:15px 20px;font-size:15px;font-weight:600;color:var(--mute);
  border-bottom:3px solid transparent;white-space:nowrap}
.tabs a:hover{color:var(--silk)}
.tabs a.on{color:var(--silk);border-bottom-color:var(--silk)}
main{max-width:1020px;margin:0 auto;padding:26px 20px 70px}

h2{font-size:23px;margin:0 0 4px}
.hint{color:var(--mute);font-size:14px;margin:0 0 20px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:22px;margin-bottom:18px}
.row{display:grid;grid-template-columns:200px 1fr;gap:14px;align-items:center;margin-bottom:14px}
.row label{font-weight:600;font-size:15px}
.row .sub{display:block;font-weight:400;font-size:12.5px;color:var(--mute)}
input,select,textarea{width:100%;padding:11px 13px;border:1.5px solid var(--line2);border-radius:8px;background:#fff}
input:focus,select:focus,textarea:focus{outline:0;border-color:var(--silk);box-shadow:0 0 0 3px var(--silk-lt)}
.inline{display:flex;gap:10px}
.inline input{min-width:0}

.btn{background:var(--silk);color:#fff;border:0;border-radius:8px;padding:13px 26px;font-weight:600;
  font-size:15.5px;cursor:pointer;text-decoration:none;display:inline-block}
.btn:hover{background:var(--silk-dk)}
.btn.ghost{background:#fff;color:var(--silk);border:1.5px solid var(--silk)}
.btn.ghost:hover{background:var(--silk-lt)}
.btn.ok{background:var(--ok)}
.btn.sm{padding:8px 16px;font-size:14px}
.btn[disabled]{opacity:.45;cursor:not-allowed}
.actions{display:flex;gap:12px;margin-top:20px;flex-wrap:wrap;align-items:center}

.flash{border-radius:10px;padding:13px 16px;margin:0 0 18px;font-size:14.5px;border:1px solid}
.flash.err{background:var(--bad-lt);border-color:#e5b5b1;color:var(--bad)}
.flash.ok{background:var(--ok-lt);border-color:#bcd4c2;color:var(--ok)}

.badge{display:inline-block;border-radius:99px;padding:3px 12px;font-size:12.5px;font-weight:700}
.b-REGISTERED{background:var(--warn-lt);color:var(--warn)}
.b-IN_TEST{background:var(--info-lt);color:var(--info)}
.b-SUBMITTED{background:#efe7fa;color:#5b3a86}
.b-VERIFIED{background:var(--ok-lt);color:var(--ok)}
.b-ISSUED{background:var(--ok);color:#fff}
.b-WITHDRAWN{background:var(--bad-lt);color:var(--bad)}

table{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden}
th{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--mute);text-align:left;
  padding:11px 14px;border-bottom:1px solid var(--line);background:#faf8f5}
td{padding:12px 14px;border-bottom:1px solid var(--line);font-size:14.5px}
tr:last-child td{border-bottom:0}
tbody tr:hover{background:#faf6f0}
td a.no{font-weight:700;color:var(--silk);text-decoration:none}
td a.no:hover{text-decoration:underline}
.scrollx{overflow-x:auto;border-radius:10px}

.allot{background:var(--ok-lt);border:1.5px solid #bcd4c2;border-radius:12px;padding:16px 22px;margin-bottom:18px}
.allot .lbl{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--ok);font-weight:700}
.allot .no{font-size:30px;font-weight:800;letter-spacing:.01em}
.allot .sub{color:var(--soft);font-size:13.5px}

.pipeline{display:flex;gap:0;margin:0 0 20px;flex-wrap:wrap}
.pipeline .step{flex:1;min-width:96px;text-align:center;padding:9px 4px;background:#fff;border:1px solid var(--line);
  font-size:12.5px;font-weight:600;color:var(--mute);position:relative}
.pipeline .step:first-child{border-radius:8px 0 0 8px}
.pipeline .step:last-child{border-radius:0 8px 8px 0}
.pipeline .step.done{background:var(--ok-lt);color:var(--ok);border-color:#bcd4c2}
.pipeline .step.now{background:var(--silk);color:#fff;border-color:var(--silk)}

.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.grid .cell{position:relative}
.grid .cell span{position:absolute;top:5px;left:9px;font-size:10.5px;color:var(--mute);font-weight:700}
.grid input{padding:20px 10px 8px;text-align:center;font-size:16.5px;font-variant-numeric:tabular-nums}
.grid input.bad{border-color:var(--bad);background:var(--bad-lt)}
.calc{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:18px}
.calc div{background:#faf8f5;border:1px solid var(--line);border-radius:9px;padding:10px 13px}
.calc .k{font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--mute);font-weight:700}
.calc .v{font-size:21px;font-weight:800;font-variant-numeric:tabular-nums}
.calc .v small{font-size:12px;color:var(--mute);font-weight:600}

.pick{display:flex;gap:26px;flex-wrap:wrap;background:#fff;border:1px solid var(--line);border-radius:10px;
  padding:13px 18px;margin-bottom:16px;align-items:center}
.pick span{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--mute);font-weight:700}
.pick b{font-size:15.5px}

.kv{display:grid;grid-template-columns:170px 1fr;gap:7px 16px;font-size:14.5px}
.kv .k{color:var(--mute);font-weight:600}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;word-break:break-all}

.slip{max-width:420px;background:#fff;border:1.5px dashed var(--line2);border-radius:10px;padding:20px 24px}
.slip h3{margin:0 0 2px;font-size:15px}.slip .te{font-size:12.5px;color:var(--soft)}
.slip .n{font-size:24px;font-weight:800;margin:8px 0}
.slip .kv{grid-template-columns:110px 1fr;font-size:13.5px}

.login-wrap{min-height:100vh;display:grid;place-items:center;padding:20px}
.login{width:min(400px,100%)}
.login .head{text-align:center;margin-bottom:22px}
.login .head .te{color:var(--soft);font-size:14px}
.login .head h1{font-size:22px;margin:6px 0 2px}
.login .roles{margin-top:16px;font-size:12.5px;color:var(--mute);line-height:1.7}

@media(max-width:760px){
  .row{grid-template-columns:1fr;gap:5px}
  .grid{grid-template-columns:repeat(4,1fr)}
  .kv{grid-template-columns:130px 1fr}
}
@media print{
  .top,.tabs,.hint,.actions,.no-print,.flash{display:none!important}
  body{background:#fff} main{padding:0;max-width:none}
  .card,.slip{border:0;padding:0}
}
`;

const TABS = [
  ['/counter', 'Register a sample', ['counter', 'signatory', 'admin']],
  ['/work', "Today's work", ['counter', 'tester', 'verifier', 'signatory', 'admin']],
];

function page({ title, user, active, flash, body }) {
  const tabs = user ? TABS
    .filter(([, , roles]) => roles.includes(user.role))
    .map(([href, label]) =>
      `<a href="${href}" class="${active === href ? 'on' : ''}">${label}</a>`).join('') : '';
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — Silk Testing Laboratory</title>
<style>${CSS}</style></head><body>
${user ? `
<div class="top">
  <div class="brand">Silk Testing Laboratory <span>RSTRS Dharmavaram · Central Silk Board · పట్టు పరీక్షా ప్రయోగశాల</span></div>
  <div class="who">Signed in as <b>&nbsp;${esc(user.fullName)}</b>
    <form method="post" action="/logout"><button>Sign out</button></form></div>
</div>
<div class="tabs">${tabs}</div>` : ''}
<main>
${flash ? `<div class="flash ${flash.kind === 'ok' ? 'ok' : 'err'}">${esc(flash.text)}</div>` : ''}
${body}
</main></body></html>`;
}

module.exports = { page, esc };
