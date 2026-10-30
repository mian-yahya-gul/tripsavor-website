# Admin area and security (Phase 6)

## How admin access works
- Pages: `/admin` (static shell, no data). Data/actions: `/api/admin/*` (list enquiries, change status, issue signed file links).
- Every admin API call runs `adminGuard()` (`src/lib/adminAuth.ts`), which **verifies the Cloudflare Access JWT** (`Cf-Access-Jwt-Assertion`): RS256 signature against your team's JWKS, issuer, audience (`CF_ACCESS_AUD`), expiry, **and** that the email is in `ADMIN_EMAILS`. Hiding the URL is not relied on.
- Fails closed: missing config → 503, no/invalid token → 401, email not allowed → 403, wrong hostname → 404. Customer pages and `/api/lead` are unaffected.
- Status changes are written atomically with a history row in `enquiry_events` (actor = staff email). File links expire after 5 minutes; every issue is logged.
- `ADMIN_DEV_EMAIL` is a local-only bypass: it works only on `localhost` **and** when `NEXTJS_ENV=development`. It lives in `.dev.vars` (never deployed). Do not set it in Cloudflare.

## Config to fill in before go-live (empty = admin locked). `ADMIN_EMAILS` is a secret (`wrangler secret put ADMIN_EMAILS`); the rest are `vars` in `wrangler.jsonc`
| Var | Meaning |
|---|---|
| `ADMIN_HOSTNAME` | e.g. `admin.<your-domain>` (admin answers only on this host) |
| `CF_ACCESS_TEAM_DOMAIN` | e.g. `yourteam.cloudflareaccess.com` |
| `CF_ACCESS_AUD` | Application Audience (AUD) tag of the Access app |
| `ADMIN_EMAILS` | comma-separated staff emails |

## Cloudflare Access setup (dashboard — not done yet, needs you)
1. Zero Trust → create a team name (free plan, up to 50 users).
2. Access → Applications → Self-hosted: hostname `admin.<your-domain>`, path `*`.
3. Policy: Allow → Emails → your staff emails. Login method: One-time PIN.
4. Copy the app's AUD tag and team domain into the vars above.
5. Add the custom domain `admin.<your-domain>` to the Worker (Phase 9).

## Public endpoint protection
- `/api/lead`: 5 requests/min per IP; `/api/uploads`: 10/min per IP (Cloudflare Rate Limiting binding; per-location and eventually consistent — stops bursts and form spam, not a hard global quota). 429 + `Retry-After`.
- Cross-site POSTs (browser `Origin` ≠ our host) are rejected with 403.
- Server-side validation and length limits on all inputs; parameterized SQL only.
- Logs record references and staff emails, never customer names/emails/phones.

## Headers
Existing (nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS) plus, in production builds: Content-Security-Policy (all `'self'`, inline scripts/styles allowed because Next.js needs them; no third-party hosts), Cross-Origin-Opener-Policy.
