# TripSavor — Cloudflare Migration Audit (Phase 1 + Phase 2 plan)

Date: 2026-10-30. Scope: read-only inspection. **No infrastructure, config, dependency or DNS change has been made.**
Items marked **[VERIFY]** are claims from vendor documentation that must be proven in Phase 3/7 by an actual build and test, not assumed.

---

## 1. Current architecture

| Area | Finding |
|---|---|
| Framework | Next.js **16.3.2**, **App Router** only (`src/app`), React 19.2.8, TypeScript 5, Tailwind CSS 4 |
| Runtime deps | Only `lucide-react`. No ORM, no auth library, no UI kit |
| Scripts | `dev`, `build`, `start`, `lint` (unchanged defaults) |
| `next.config.ts` | `poweredByHeader:false` + `headers()` adding 5 security headers (nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS). No CSP |
| Middleware / `proxy.ts` | **None** |
| API routes | **One**: `POST /api/lead` (`src/app/api/lead/route.ts`) |
| Database | **None.** All content lives in TS files under `src/data` (airports, destinations, routes, group fares, FAQs, Urdu strings, etc.) |
| Auth | **None real.** `/login`, `/manage-booking` and `AccountPanel` are front-end only |
| File storage | None. Public assets only: `public/` ≈ 5.7 MB (destinations 2.2 MB, heroes 2.9 MB, airline logos 176 KB, logo 452 KB) |
| Client persistence | `localStorage`: language, currency, consent, price watch, recent searches, origin preference, saved **contact profile and travellers (incl. passport number, DOB, passport expiry)** |
| Env vars | `RESEND_API_KEY`, `LEAD_TO_EMAIL` (both optional; documented in `.env.example`). `FARE_PROVIDER` is only a code comment. `.env*` is git-ignored |
| Fonts / images | `next/font/google` (Inter, Poppins, Noto Nastaliq Urdu; fetched at build), `next/image` used in ~30 components, `ImageResponse` for the OG image |
| Deployment today | None configured. `siteConfig.url` and `public/llms.txt` still point to `tripsavor-website.vercel.app` |
| Git | 22 commits on `main`; `origin` = `github.com/mian-yahya-gul/tripsavor-website` (**confirm this is the repo you want to use**) |

### Route rendering (from a real `next build`, which passes)
- Static (○): `/`, `/about`, `/contact`, `/explore`, `/faqs`, `/flights`, `/group-tickets`, `/login`, `/manage-booking`, `/privacy`, `/terms`, `/umrah-calculator`, `robots.txt`, `sitemap.xml`, manifest, icon, OG image.
- SSG with ISR (●): `/flights/[slug]` — 37 pages, `revalidate = 86400`.
- **Dynamic (ƒ): `/search`** (reads `searchParams`, generates fares server-side) and **`/api/lead`**.

## 2. Existing functionality

Working (front end): hero search, flight results with fare families, compare tray, price watch, budget planner, destination/deal feeds, explore map-by-budget, group tickets explorer + quote form, Umrah calculator, FAQs, Urdu (RTL), SEO/JSON-LD/sitemap/llms.txt, cookie consent, support launcher.

Placeholder / unfinished: fares come from `dummyProvider` (indicative, not live); no payments; no real bookings (“Confirm on WhatsApp” is the booking path); login/manage-booking are mock UIs; phone, WhatsApp, address, social links in `siteConfig` are placeholders; leads are **emailed only** (Resend) — not stored.

## 3. Compatibility assessment for Cloudflare Workers

| # | Issue | Severity | Detail / mitigation |
|---|---|---|---|
| 1 | **Workers Free = 10 ms CPU per request** | **High** | Cloudflare’s limits page lists 10 ms CPU/request on Free (100k requests/day, 50 subrequests). Next SSR through OpenNext, `/search` fare generation and ISR regeneration of `/flights/*` may exceed this (Error 1102). Network wait does not count. **Must be measured in Phase 7.** Mitigations in order: keep pages static; move `/search` fare generation to the client or precompute; only if still failing, Workers Paid ($5/mo) — this would break the $0 goal, so it is your decision |
| 2 | `node:fs` in `AirlineMarquee.tsx` | Medium | Reads `public/airlines` with `fs.existsSync` at render time. Works today only because the home page is prerendered at build. On Workers there is no filesystem at runtime. Fix: replace with the existing static `airlineLogo()` map in `src/data/airlineLogos.ts` (small, no UI change) |
| 3 | `next/image` optimizer | Medium | Needs a Cloudflare Images binding (or equivalent) under OpenNext. Options: configure Images binding; or serve pre-sized files with `images.unoptimized` / custom loader. Free allowance and cost of Images transformations is **[VERIFY]** |
| 4 | ISR for `/flights/[slug]` | Medium | OpenNext needs an incremental-cache binding (R2 or KV). Use a **separate** R2 bucket for cache, never the private uploads bucket |
| 5 | Node middleware / `proxy.ts` | Info | OpenNext docs: standard middleware supported, **Node middleware not yet supported**. We have none. Rule for the plan: do **not** add `proxy.ts`; do admin checks inside route handlers / server code |
| 6 | Bundle size | Unclear | OpenNext docs say 3 MiB compressed (Free); Cloudflare’s limits page says no compressed limit, 64 MiB uncompressed. Docs conflict — **[VERIFY]** with `wrangler` output at build |
| 7 | Local Node version | Medium | This machine runs Node **v26.5.1** (current, non-LTS). Wrangler/OpenNext officially target LTS releases **[VERIFY]**. Plan: build with Node 22 or 24 LTS (nvm/`.nvmrc`) |
| 8 | `next/font/google` | Low | Downloaded at build time and self-hosted; no runtime fetch. Fine |
| 9 | `ImageResponse` OG image | Low | Statically generated at build; keep it static |
| 10 | `headers()` in `next.config.ts` | Low | Supported by OpenNext; will be re-tested. CSP to be added in Phase 6 |
| 11 | Everything else (client components, localStorage stores, i18n translator, CSS) | None | Browser-only; unaffected |

## 4. Adapter decision

- **Recommend `@opennextjs/cloudflare` (OpenNext).** Docs state support for all Next.js 16 minors/patches, Node runtime (not Edge), ISR/SSG/`use cache`.
- **vinext: not recommended now.** Cloudflare labels it experimental; it reimplements Next on Vite, has no build-time static prerendering (ISR only), and only partial image optimization. Our site is mostly static with SEO-critical prerendered pages — moving to a rewritten framework adds risk with no material benefit.
- The Next 16.3 docs in `node_modules` note Cloudflare is working on a verified adapter on Next’s Adapter API; revisit later, not now.

## 5. Findings that affect the plan (decisions needed)

1. **Passport data in the browser.** `src/lib/profiles.ts` stores traveller passport numbers/DOB in `localStorage` (plaintext, per device). Not a Cloudflare issue, but you said sensitive documents must not go into D1. Recommend: keep this device-local, do **not** sync passport numbers to D1 in the first release; store only name/contact on enquiries.
2. **Leads are not persisted.** `/api/lead` only emails via Resend; with no key it just logs and the lead is lost. D1 `enquiries` fixes this and is the highest-value first table. Also: no rate limiting, no length/email validation, `details` is an unbounded object.
3. **Resend sandbox sender** (`onboarding@resend.dev`) can only deliver to the Resend account owner’s address; a verified sending domain is needed for real use (Resend free tier is 100 emails/day [VERIFY]).
4. **Admin has nothing to administer yet.** No bookings or payments exist, so `bookings`, `passengers`, `payments`, `booking_events` tables would be unused. Proposal: create the full migration set (as you specified) but only wire up `enquiries` + `customers` + status history in the first release.
5. **Admin hosting.** A separate `admin.tripsavor.com` is feasible with **one Worker** serving several custom domains; the app checks the host, so admin routes respond only on the admin host. Zero Trust Access (free plan, OTP) sits in front of that hostname; the app must still validate the `Cf-Access-Jwt-Assertion` JWT (team domain JWKS + application AUD). Simpler alternative if you prefer: `tripsavor.com/admin` protected by an Access path policy. **Recommendation: use admin.tripsavor.com** (cleaner policy, no public-site cookie overlap).
6. **Domain name.** `support@tripsavor.com` is in code but I have not verified that `tripsavor.com` is the Namecheap domain you own. Please confirm.
7. **Canonical/URLs.** `siteConfig.url`, `llms.txt`, sitemap/robots/OG all derive from the Vercel URL; they must switch to `https://tripsavor.com` at go-live (single constant + one text file).
8. **Uncommitted work.** 20 files from today’s design polish and image removal are uncommitted and awaiting your approval. Migration work should start from a clean, committed `main` on a new branch.

## 6. Required dependencies (to be added only after approval)

`@opennextjs/cloudflare`, `wrangler` (dev), optionally `jose` (JWT verification for Access) — no ORM; plain parameterized D1 SQL. Config files to add: `wrangler.jsonc`, `open-next.config.ts`, `.dev.vars` (git-ignored), `migrations/*.sql`, `.nvmrc`.

## 7. Proposed phased plan

| Phase | Output | Manual action from you |
|---|---|---|
| 3 | OpenNext + Wrangler configured; `npm run preview` runs the site in the Workers runtime locally; fix `AirlineMarquee` fs use; measure CPU of `/search`, `/flights/*` | None (Node LTS install if needed) |
| 4 | `migrations/0001_init.sql` (all 8 tables, FKs, indexes, integer minor units, ISO timestamps), typed DB helper, local D1; `/api/lead` writes to D1 **and** still emails | Create D1 in your Cloudflare account (`wrangler login`) — I will guide you |
| 5 | Private R2 bucket + validated upload / signed-retrieval route (type + size allow-list, server-only) | Create bucket |
| 6 | Host-aware admin area, Access JWT validation, rate limiting, CSP and headers | Create Access application + staff email policy |
| 7 | Full local test run (build, lint, forms, uploads, admin 401/403 tests) | None |
| 8 | GitHub workflow + docs (`README`, `DEPLOYMENT`, `CLOUDFLARE_SETUP`, `ENVIRONMENT_VARIABLES`) | Confirm target repo; set secrets in Cloudflare |
| 9 | DNS plan: export existing Namecheap records first (MX/SPF/DKIM/DMARC, DNSSEC) | **Your explicit approval before any nameserver change** |
| 10 | Production verification | Approve production deploy |

## 8. Potential breaking changes

- Image delivery path changes if the Next optimizer is replaced (visual output should be identical; will be compared).
- `AirlineMarquee` data source change (same output).
- Canonical host change from vercel.app to the real domain (intended).
- If the 10 ms CPU limit is exceeded, `/search` architecture must change (explained and approved before doing it).

## 9. Estimated infrastructure cost

| Item | Plan | Monthly | Notes |
|---|---|---|---|
| Workers | Free | $0 | 100,000 requests/day, 10 ms CPU, 50 subrequests (**CPU limit is the real risk**) |
| D1 | Free | $0 | 5M rows read/day, 100k rows written/day, 5 GB total |
| R2 | Free | $0 | 10 GB-month, 1M Class A, 10M Class B ops/month, no egress fee. Whether a payment method is required to enable R2 is **not confirmed** |
| DNS / SSL | Free | $0 | Registrar stays Namecheap (renewal cost unchanged) |
| Zero Trust Access | Free | $0 | Up to 50 users with email OTP per Cloudflare plan pages |
| GitHub | Free | $0 | |
| Resend (existing, optional) | Free | $0 | Already in code; free alternative: none equal for outbound mail on Workers |
| **Total** | | **$0** | Possible fallback: Workers Paid $5/mo only if CPU limit proves unworkable |

Not verified: Cloudflare’s exact commercial-use terms for each free product. The terms were **not** read in this phase; I will not state they permit commercial use until you or I have read the current Self-Serve Subscription Agreement and product pages.

Free-tier limitations to document in `DEPLOYMENT.md`: no uptime SLA, hard daily request cap (site returns Error 1027 when exceeded unless fail-open), D1 daily read/write caps, 10 ms CPU, no business support.

## 10. Sources (checked 2026-10-30)
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- D1 pricing: https://developers.cloudflare.com/d1/platform/pricing/
- R2 pricing: https://developers.cloudflare.com/r2/pricing/
- OpenNext Cloudflare: https://opennext.js.org/cloudflare
- Cloudflare Next.js / vinext guide: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- Next.js 16.3 docs bundled in `node_modules/next/dist/docs` (deploying, adapters)
