# Local test run — Phase 7 (2026-10-30)

Environment: production build (`opennextjs-cloudflare build`) served by `opennextjs-cloudflare preview` (Workers runtime, local D1/R2/rate-limit bindings), Next.js 16.4.3, with the local admin bypass **removed** from `.dev.vars` to mimic production.

## Automated: `scripts/smoke-test.sh http://localhost:8787` → 40 passed, 0 failed
Pages (19 routes + search shell + 404), all sitemap URLs, security headers (HSTS, nosniff, X-Frame-Options, Referrer-Policy, CSP, COOP, no X-Powered-By), lead validation/cross-site rejection/valid lead stored, upload/file endpoint rejections, admin endpoints locked (503 when Access isn't configured).

## Manual, in a real browser (production build)
- Contact form: submitted via the UI → "Message received", row in D1 with correct fields.
- Group-ticket form: submitted via the UI → row with all details (route, dates, passengers, organisation).
- Uploads: PNG and PDF accepted; HTML renamed to .png rejected (400); signed download returned identical bytes; tampered expiry → 404.
- Search results (single and multi-city) render from the static shell; Explore, Umrah calculator and Search checked in Urdu (RTL) — previously unverified.
- Admin page renders and lists enquiries when authorised (verified earlier in Phase 6 with the dev bypass); locked without it.
- No Content-Security-Policy violations or console errors were reported on the pages visited (home, contact, group tickets, explore, umrah, search, admin).

## Not covered / limits
- Workers Free 10 ms CPU limit cannot be enforced locally; pages are static and /search runs in the browser, but real-world CPU time must be checked after deploy (watch for Error 1102).
- Real Cloudflare Access login, real R2 bucket, real email delivery (no Resend key) and the multi-location behaviour of rate limiting are untested.
- A narrow (phone) viewport was not re-checked this round (the browser window resize did not change the viewport); phone layout was checked in an earlier session.
- Not every page was checked with every cookie-banner state, and Urdu strings for dynamic text (dates, some search labels) are still English.
- Not tested: legal pages and flight-route pages in Urdu.
