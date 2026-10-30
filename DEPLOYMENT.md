# Deployment

Flow: **local development → GitHub (pull request, CI) → Cloudflare Workers**.

## Branching
- Work on a branch, open a pull request → `ci.yml` runs type-check, lint and the Workers build.
- Merging to `main` triggers `deploy.yml` (only when repository variable `DEPLOY_ENABLED=true`; protect the `production` environment with a required reviewer if you want an approval gate).
- The currently prepared work is on branch `cloudflare-migration` (not pushed yet). `origin/main` is an ancestor of local `main`, so pushing is a fast-forward — nothing on GitHub is overwritten.

## Manual deploy (from your computer)
```bash
npx wrangler login                    # once
npm run db:migrate:remote             # apply new migrations first (they are incremental)
npm run deploy                        # opennextjs-cloudflare build + deploy
npm run smoke -- https://<your-url>   # verify (creates a few "SMOKE" test enquiries)
```

## Environments
- **Local**: `npm run dev` (Next dev server + local D1/R2 bindings) or `npm run preview` (real Workers runtime, local bindings).
- **Production**: the single Worker `tripsavor`. A separate staging Worker can be added later as a `[env.staging]` section with its own D1/R2 names; it is not set up.

## Rollback
- Code: `npx wrangler rollback` (or Dashboard → Workers → tripsavor → Deployments → roll back to a previous version).
- Database: migrations are forward-only; to undo, ship a new migration. For data recovery use D1 Time Travel (restores in place — destructive; 7 days on the free plan) or restore from an encrypted backup (below).

## Backups
- Script: `scripts/backup-d1.sh` → encrypted `.sql.enc` + checksum; `scripts/restore-d1.sh` decrypts. Round-trip tested locally on a scratch database (encrypt, decrypt, import, wrong passphrase rejected).
- Schedule: `.github/workflows/backup.yml` (daily, artifact kept 30 days) — **not active and not yet run** until you set `BACKUP_ENABLED=true`, `BACKUP_PASSPHRASE`, and the Cloudflare secrets. GitHub artifacts are not a long-term archive: periodically download one to storage you control. Keep `BACKUP_PASSPHRASE` offline as well.
- Do a restore drill into a fresh database before relying on it.

## Free-tier limits that matter (checked 2026-10-30 against Cloudflare docs)
| Service | Free limit | Consequence |
|---|---|---|
| Workers | 100,000 requests/day, **10 ms CPU per request**, 50 subrequests | Over the daily limit visitors see Cloudflare Error 1027; heavy server rendering can fail with 1102. Pages are static and `/search` runs in the browser to stay under this |
| D1 | 5M rows read/day, 100k rows written/day, 5 GB total; Time Travel 7 days | Writes fail until 00:00 UTC if exceeded |
| R2 | 10 GB-month, 1M Class A, 10M Class B ops/month, no egress fee | Not enabled yet |
| Access | up to 50 users, one-time PIN | — |
| Rate limiting binding | per-location, eventually consistent | Stops bursts/spam, not a hard global quota |
| SLA | none on free plans | No contractual uptime or support guarantee — not a business-critical SLA |

## Terms to be aware of (read the originals; not legal advice)
Cloudflare's Self-Serve Subscription Agreement (cloudflare.com/terms) says Free Services can be terminated at Cloudflare's discretion with no liability, offers no uptime commitment, and forbids circumventing usage limits. **§2.2.1(h): you may not collect credit-card information on a web property that receives Free Services** — when a payment gateway is added, use a hosted/redirect checkout so card data never touches this site (this would also keep card data out of scope for PCI). The agreement incorporates Service-Specific Terms for Workers, D1 and R2 that were not reviewed here. If TripSavor becomes business-critical, plan on Workers Paid ($5/month) and a paid plan with support.

## Custom domain and DNS (Phase 9 — requires your explicit approval; nothing changed yet)
Before any nameserver change: export the current Namecheap DNS records; keep MX/SPF/DKIM/DMARC records identical in Cloudflare; Namecheap stays the registrar and only the nameservers change (to the two Cloudflare-assigned ones shown after adding the site); if DNSSEC is on at Namecheap, disable it before the switch and re-enable via Cloudflare afterwards. Hostnames: apex (canonical), `www` (redirect to apex), `admin`. Update `siteConfig.url` (`src/data/site.ts`) and `public/llms.txt` from the Vercel URL to the real domain at go-live.
