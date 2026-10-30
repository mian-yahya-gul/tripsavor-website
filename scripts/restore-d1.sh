#!/usr/bin/env bash
# Decrypt a backup made by backup-d1.sh and print the SQL path (does NOT touch any database).
#   BACKUP_PASSPHRASE=... scripts/restore-d1.sh backups/tripsavor-db-XXXX.sql.enc out.sql
# Then, to restore into an EMPTY database:  npx wrangler d1 execute tripsavor-db --remote --file out.sql
# (Restoring over existing tables fails on purpose; restore into a fresh database or use D1 Time Travel.)
set -euo pipefail
IN="${1:?encrypted file}"; OUT="${2:?output .sql file}"
: "${BACKUP_PASSPHRASE:?Set BACKUP_PASSPHRASE}"
[ -f "$IN.sha256" ] && ( cd "$(dirname "$IN")" && shasum -a 256 -c "$(basename "$IN").sha256" )
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -in "$IN" -out "$OUT" -pass env:BACKUP_PASSPHRASE
echo "$OUT"
