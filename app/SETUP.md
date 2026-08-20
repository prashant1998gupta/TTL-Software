# Setting up the laboratory server

Everything you do to take this from a repository to a working laboratory, in order.
Nothing here needs psql, and nothing is edited in a file — the application asks for
what it needs on first run.

## 1. What the machine needs

- Linux (Debian/Ubuntu) or macOS. One machine; it is the laboratory's record.
- **Node.js 20 or later**, **PostgreSQL 16**, **git**.
- No internet is needed to run. `npm install` needs it once (or use a vendored
  `node_modules` copied from the build machine, per ARC-16).

Debian/Ubuntu:

```bash
sudo apt install nodejs npm postgresql-16
sudo -u postgres createuser --createdb $USER
```

macOS (development):

```bash
brew install node postgresql@16
LC_ALL=en_US.UTF-8 /opt/homebrew/opt/postgresql@16/bin/pg_ctl -D /opt/homebrew/var/postgresql@16 start
```

## 2. Install

```bash
git clone https://github.com/prashant1998gupta/TTL-Software.git
cd TTL-Software/app
npm install
createdb ttl_lims
node src/server/migrate.js        # NO --demo on the real server
```

## 3. Start it

```bash
node src/server/index.js          # internal app   http://<server>:8787
node verify-server.js             # public verify  port 8788
```

For unattended running, `deploy/lims.service` and `deploy/lims-verify.service` are
systemd units — copy to `/etc/systemd/system/`, then
`systemctl enable --now lims lims-verify`.

## 4. First run — the setup screen

Open the application. It shows ONE screen and will not proceed past it:

1. **The Unit In-Charge's account** — username, name (and Telugu name, which appears
   on certificates), password.
2. **The cut-over numbers** — open the paper intake register and the report-issue
   register and copy the LAST number used in each. The system continues from the
   next number. These are asked, not guessed, because a collision between a system
   number and a hand-written one is a records incident that cannot be undone.

Then sign in and, under **Administration**, create the real accounts for the counter
clerk, the testers and the verifier, add the balances with their calibration dates,
and check the fee against the approved rate card.

## 5. The two scheduled lines

One cron entry for the daily checks, one for the nightly backup
(see `deploy/lims-jobs.timer.example`):

```
0 6   * * *  cd /opt/lims/app && node src/server/jobs.js
30 21 * * *  LIMS_BACKUP_DIR=/backup /opt/lims/app/deploy/backup.sh
```

`jobs.js` re-hashes every issued certificate against its recorded fingerprint and
lists calibrations falling due; a failure exits non-zero and writes an
INTEGRITY_FAILURE event. `backup.sh` keeps 30 daily dumps. **Drill the restore
once** (`deploy/restore.sh <dump>` restores into a separate database) — a backup
that has never been restored is a hope, not a backup.

## 6. The signing key

Certificates are signed with the PKCS#12 at `test/fixtures/dev-signing.p12` until a
real credential is configured. That key is marked NOT FOR ISSUE. When the Central
Silk Board provides the laboratory's Document Signer credential, place it on the
server and set, before starting:

```bash
export LIMS_P12=/path/to/credential.p12
export LIMS_P12_PASSPHRASE='...'
```

**Do not issue real certificates to customers before this is done.**

## 7. Configuration reference

| Variable | Default | Meaning |
|---|---|---|
| `LIMS_DB` | `ttl_lims` | database name |
| `PGHOST` | `/tmp` | PostgreSQL socket directory |
| `LIMS_PORT` | `8787` | internal app port (binds 127.0.0.1 only) |
| `VERIFY_PORT` | `8788` | public verification port |
| `LIMS_VERIFY_BASE` | `http://localhost:8788` | the URL printed inside the QR — set to the public address |
| `LIMS_P12`, `LIMS_P12_PASSPHRASE` | dev key | the signing credential |
| `LIMS_BACKUP_DIR` | `~/lims-backups` | where nightly dumps land |
