#!/usr/bin/env bash
# Encrypted export of the D1 database.
#   BACKUP_PASSPHRASE=... scripts/backup-d1.sh [--local] [output-dir]
# Needs: wrangler login (or CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID), openssl.
# Produces <dir>/tripsavor-db-<UTC timestamp>.sql.enc and a .sha256 of the encrypted file.
# The plaintext dump is deleted. Keep the passphrase somewhere independent of Cloudflare and GitHub.
set -euo pipefail
MODE="--remote"; [ "${1:-}" = "--local" ] && { MODE="--local"; shift; }
OUT="${1:-backups}"
: "${BACKUP_PASSPHRASE:?Set BACKUP_PASSPHRASE (min 20 chars)}"
[ "${#BACKUP_PASSPHRASE}" -ge 20 ] || { echo "BACKUP_PASSPHRASE too short" >&2; exit 1; }
mkdir -p "$OUT"
TS=$(date -u +%Y%m%dT%H%M%SZ)
PLAIN="$OUT/.tripsavor-db-$TS.sql"
ENC="$OUT/tripsavor-db-$TS.sql.enc"
trap 'rm -f "$PLAIN"' EXIT
npx wrangler d1 export tripsavor-db $MODE --output "$PLAIN" >/dev/null
[ -s "$PLAIN" ] || { echo "export produced an empty file" >&2; exit 1; }
openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt -in "$PLAIN" -out "$ENC" -pass env:BACKUP_PASSPHRASE
( cd "$OUT" && shasum -a 256 "$(basename "$ENC")" > "$(basename "$ENC").sha256" )
echo "$ENC"
