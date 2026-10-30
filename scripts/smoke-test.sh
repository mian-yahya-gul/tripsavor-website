#!/usr/bin/env bash
# Smoke test against a running site (local preview or deployed).
#   npm run preview            # terminal 1 (serves http://localhost:8787)
#   scripts/smoke-test.sh http://localhost:8787
# Creates a few test enquiries (prefixed "SMOKE") — run against production only if you accept that.
BASE="${1:-http://localhost:8787}"
pass=0; fail=0
ok()   { pass=$((pass+1)); printf "  ok   %s\n" "$1"; }
bad()  { fail=$((fail+1)); printf "  FAIL %s\n" "$1"; }
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
expect() { local want="$1" name="$2"; shift 2; local got; got=$(code "$@"); [ "$got" = "$want" ] && ok "$name ($got)" || bad "$name (want $want, got $got)"; }

echo "Pages"
for p in / /about /contact /explore /flights /flights/karachi-to-dubai /group-tickets /umrah-calculator /faqs /login /manage-booking /privacy /terms /admin /sitemap.xml /robots.txt /manifest.webmanifest /opengraph-image /llms.txt; do
  expect 200 "GET $p" "$BASE$p"
done
expect 200 "GET /search (static shell)" "$BASE/search?from=KHI&to=DXB&depart=2026-12-10&tripType=roundtrip&cabin=Economy&adults=1&children=0&infants=0"
expect 404 "unknown page is 404" "$BASE/definitely-not-a-page"

echo "Sitemap URLs"
bad_urls=0
for u in $(curl -s "$BASE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g' | sed -E 's#https?://[^/]+##'); do
  [ "$(code "$BASE$u")" = "200" ] || { bad "sitemap path $u"; bad_urls=1; }
done
[ $bad_urls = 0 ] && ok "all sitemap paths return 200"

echo "Headers"
H=$(curl -sI "$BASE/")
for h in "strict-transport-security" "x-content-type-options: nosniff" "x-frame-options" "referrer-policy" "content-security-policy" "cross-origin-opener-policy"; do
  echo "$H" | grep -qi "$h" && ok "header $h" || bad "header $h"
done
echo "$H" | grep -qi "x-powered-by" && bad "x-powered-by is exposed" || ok "no x-powered-by"

echo "Lead API"
J='content-type: application/json'
expect 400 "invalid email rejected" -X POST "$BASE/api/lead" -H "$J" -d '{"type":"contact","name":"x","email":"nope"}'
expect 400 "invalid type rejected" -X POST "$BASE/api/lead" -H "$J" -d '{"type":"admin","name":"x","email":"a@b.co"}'
expect 400 "bad JSON rejected" -X POST "$BASE/api/lead" -H "$J" -d '{oops'
expect 403 "cross-site POST rejected" -X POST "$BASE/api/lead" -H "$J" -H 'Origin: https://evil.example' -d '{"type":"contact","name":"x","email":"a@b.co"}'
R=$(curl -s -X POST "$BASE/api/lead" -H "$J" -d '{"type":"contact","name":"SMOKE test","email":"smoke@example.com","message":"smoke"}')
echo "$R" | grep -q '"ok":true' && echo "$R" | grep -q 'ENQ-' && ok "valid lead stored (ref returned)" || bad "valid lead: $R"

echo "Uploads / files"
expect 400 "upload without fields" -X POST "$BASE/api/uploads" -F ref=x
expect 404 "file without signature" "$BASE/api/files/1"
expect 404 "file bad signature" "$BASE/api/files/1?exp=9999999999&sig=$(printf 'a%.0s' {1..64})"

echo "Admin (must be locked without Access)"
for p in /api/admin/enquiries; do
  g=$(code "$BASE$p"); case "$g" in 401|403|404|503) ok "GET $p denied ($g)";; *) bad "GET $p reachable ($g)";; esac
done
g=$(code -X PATCH "$BASE/api/admin/enquiries/1" -H "$J" -d '{"status":"won"}'); case "$g" in 401|403|404|503) ok "PATCH admin denied ($g)";; *) bad "PATCH admin reachable ($g)";; esac
g=$(code -X POST "$BASE/api/admin/files/1/link"); case "$g" in 401|403|404|503) ok "file link denied ($g)";; *) bad "file link reachable ($g)";; esac

echo; echo "passed: $pass  failed: $fail"; [ $fail = 0 ]
