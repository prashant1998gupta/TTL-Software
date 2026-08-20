#!/usr/bin/env bash
# Nightly backup: one compressed dump per day, 30 kept, written to a directory
# that ARC's storage plan puts on the separate backup disk. Run from cron or
# launchd. Restore drill: deploy/restore.sh <dumpfile> — and actually drill it.
set -euo pipefail
DIR="${LIMS_BACKUP_DIR:-$HOME/lims-backups}"
DB="${LIMS_DB:-ttl_lims}"
PGBIN="${PGBIN:-/opt/homebrew/opt/postgresql@16/bin}"
mkdir -p "$DIR"
STAMP="$(date +%Y-%m-%d)"
OUT="$DIR/lims-$STAMP.dump"
"$PGBIN/pg_dump" -Fc -d "$DB" -f "$OUT"
echo "backup written: $OUT ($(du -h "$OUT" | cut -f1))"
ls -1t "$DIR"/lims-*.dump | tail -n +31 | xargs -r rm --
