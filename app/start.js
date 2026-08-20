'use strict';
/**
 * The one command: checks everything, fixes what it can, says in plain words
 * what it cannot, then starts the system. Run it every time — first time and
 * every day after:
 *
 *     node start.js
 *
 * (or double-click Start-LIMS.bat on Windows, Start-LIMS.command on a Mac.)
 *
 * Written for a non-technical operator: every failure prints WHAT to do, not
 * a stack trace. Uses nothing but Node built-ins until it has made sure the
 * packages are installed, because before that moment require('pg') would
 * itself be the crash.
 */
const { execSync, spawnSync, spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const APP = __dirname;
process.chdir(APP);
const CHECK_ONLY = process.argv.includes('--check');
const SAVED = path.join(APP, '.lims-db.json'); // the connection that worked last time

const say = (s) => console.log(s);
const fail = (lines) => { say('\n' + lines.join('\n')); process.exit(1); };

function ask(question, fallback) {
  if (process.env.LIMS_NONINTERACTIVE) return Promise.resolve(fallback);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((r) => rl.question(question, (a) => { rl.close(); r(a.trim() || fallback); }));
}

async function main() {
  say('');
  say('  Silk Testing Laboratory — starting up');
  say('  पट्टू परीक्षा प्रयोगशाला — शुरू हो रहा है');
  say('  ------------------------------------------');

  // 1. Node itself. If this script is running, Node exists; only warn if old.
  const major = parseInt(process.versions.node, 10);
  if (major < 20) {
    fail([
      'STEP NEEDED: your Node.js is version ' + process.versions.node + ', which is too old.',
      'Go to  https://nodejs.org  , download the LTS version, install it (Next, Next, Finish),',
      'then run this again.',
    ]);
  }
  say('  [ok] Node.js ' + process.versions.node);

  // 2. Packages. First run on a fresh copy: install them, visibly.
  if (!fs.existsSync(path.join(APP, 'node_modules'))) {
    say('  [..] First run — downloading the packages (one time, needs internet, ~2 minutes)');
    const r = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm',
      ['install', '--no-audit', '--no-fund'], { stdio: 'inherit', shell: process.platform === 'win32' });
    if (r.status !== 0) {
      fail([
        'The package download failed. Check the internet connection and run this again.',
        'If it keeps failing, send a photo of this window to Prashant.',
      ]);
    }
  }
  say('  [ok] packages installed');

  // 3. PostgreSQL — the database. Try, in order: what worked last time, the
  //    local socket (Mac/Linux), then localhost (how Windows installs run).
  const { Pool } = require('pg');
  const candidates = [];
  if (fs.existsSync(SAVED)) {
    try { candidates.push(JSON.parse(fs.readFileSync(SAVED, 'utf8'))); } catch {}
  }
  candidates.push({ host: '/tmp' }, { host: 'localhost' },
    { host: 'localhost', user: 'postgres' });

  let conn = null;
  for (const c of candidates) {
    if (await canConnect(Pool, c)) { conn = c; break; }
  }
  if (!conn) {
    // One more try: Windows installs set a password during Next-Next-Finish.
    const pw = await ask(
      '\n  PostgreSQL ka password likhiye (jo install karte time choose kiya tha),\n' +
      '  ya khali chhod kar Enter dabaiye agar install hi nahin kiya:  ', '');
    if (pw) {
      const c = { host: 'localhost', user: 'postgres', password: pw };
      if (await canConnect(Pool, c)) conn = c;
    }
  }
  if (!conn) {
    fail([
      'STEP NEEDED: the database program (PostgreSQL) is not running on this computer.',
      '',
      'Windows:  https://www.enterprisedb.com/downloads/postgres-postgresql-downloads',
      '          Download version 16 for Windows, run it, press Next on everything.',
      '          It will ask you to CHOOSE A PASSWORD — write it on paper. Finish.',
      'Mac:      https://postgresapp.com  — download, open, press "Initialize".',
      '',
      'Then run this again. It will ask for that password once and remember the rest.',
    ]);
  }
  fs.writeFileSync(SAVED, JSON.stringify(conn));
  if (conn.password) {
    say('  [ok] database connected  (note: the password is kept in app/.lims-db.json on this');
    say('       computer so you are not asked daily — fine for a demo laptop, and the real');
    say('       laboratory server uses passwordless local login per SETUP.md)');
  } else say('  [ok] database connected');

  // 4. The application database. Create it if this is the first time.
  const admin = new Pool({ ...conn, database: conn.maintenance || 'postgres' });
  const dbName = process.env.LIMS_DB || 'ttl_lims';
  const exists = await admin.query(`SELECT 1 FROM pg_database WHERE datname=$1`, [dbName]);
  if (!exists.rows.length) {
    await admin.query(`CREATE DATABASE ` + dbName.replace(/[^a-z0-9_]/g, ''));
    say('  [ok] created the application database');
  } else say('  [ok] application database present');
  await admin.end();

  // 5. Tables and, on the very first run, whether practice data is wanted.
  const env = { ...process.env, LIMS_DB: dbName, PGHOST: conn.host };
  if (conn.user) env.PGUSER = conn.user;
  if (conn.password) env.PGPASSWORD = conn.password;

  const appDb = new Pool({ ...conn, database: dbName });
  const fresh = !(await appDb.query(
    `SELECT 1 FROM information_schema.tables WHERE table_name='mst_user'`)).rows.length;
  let demo = false;
  if (fresh) {
    const a = await ask(
      '\n  Practice (demo) data chahiye? Seekhne ke liye "y", asli kaam ke liye "n"  [y/n]: ', 'y');
    demo = /^y/i.test(a);
  }
  await appDb.end();
  const m = spawnSync(process.execPath,
    ['src/server/migrate.js', ...(demo ? ['--demo'] : [])], { stdio: 'pipe', env });
  if (m.status !== 0) {
    fail(['Preparing the tables failed:', String(m.stderr), 'Send a photo of this to Prashant.']);
  }
  say('  [ok] tables ready' + (demo ? ' (practice data loaded)' : ''));

  if (CHECK_ONLY) { say('\n  --check: everything is ready. Run without --check to start.'); return; }

  // 6. Start both parts and stay in the foreground: closing this window is
  //    how the operator stops the system, which is the least surprising rule.
  say('');
  say('  ------------------------------------------');
  say('  AB KHOLIYE:   http://localhost:8787');
  if (demo) say('  Sign-in: lakshmi / ravi / suma / incharge   password: dvm');
  else say('  (first visit par system In-Charge ka account banwayega)');
  say('');
  say('  Is window ko band karna = system band karna. Chalne dijiye.');
  say('  ------------------------------------------\n');

  const opts = { stdio: 'inherit', env };
  const a = spawn(process.execPath, ['src/server/index.js'], opts);
  const b = spawn(process.execPath, ['verify-server.js'], opts);
  const stop = () => { a.kill(); b.kill(); process.exit(0); };
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
  a.on('exit', stop); b.on('exit', stop);
}

async function canConnect(Pool, c) {
  const p = new Pool({ ...c, database: 'postgres', connectionTimeoutMillis: 2500 });
  try { await p.query('SELECT 1'); await p.end(); return true; }
  catch { try { await p.end(); } catch {} return false; }
}

main().catch((e) => fail(['Something unexpected went wrong:', e.message,
  'Send a photo of this window to Prashant.']));
