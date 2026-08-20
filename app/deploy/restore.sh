#!/usr/bin/env bash
# Restore into a NEW database first and look at it; only then point the app at
# it. Restoring over the live database is how one incident becomes two.
set -euo pipefail
[ $# -eq 1 ] || { echo "usage: restore.sh <dumpfile>"; exit 1; }
PGBIN="${PGBIN:-/opt/homebrew/opt/postgresql@16/bin}"
TARGET="${LIMS_RESTORE_DB:-ttl_lims_restored}"
"$PGBIN/createdb" "$TARGET" 2>/dev/null || true
"$PGBIN/pg_restore" --clean --if-exists -d "$TARGET" "$1"
echo "restored into database '$TARGET'. Inspect it, then repoint LIMS_DB when satisfied."
