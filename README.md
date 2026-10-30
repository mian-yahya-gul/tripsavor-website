# TripSavor Travels website

Flight-booking website for TripSavor (Pakistan): Next.js 16 (App Router, Tailwind 4) running on Cloudflare Workers through OpenNext, with Cloudflare D1 (database), R2 (private files) and Access (admin login).

| Doc | What it covers |
|---|---|
| `CLOUDFLARE_MIGRATION_AUDIT.md` | How the original app was assessed for Cloudflare |
| `CLOUDFLARE_SETUP.md` | One-time account setup (token, R2, Access, secrets, domain) |
| `DEPLOYMENT.md` | Day-to-day workflow, deploy, rollback, backups, free-tier limits |
| `ENVIRONMENT_VARIABLES.md` | Every variable, secret and binding |
| `DATABASE.md`, `STORAGE.md`, `ADMIN.md` | D1 schema, private files, admin security |
| `TESTING.md` | What has and has not been tested |

## Requirements
Node 22+ (`.nvmrc`; use `nvm use`), npm 10+. Wrangler is installed as a dev dependency.

## Local development
```bash
npm ci
cp .dev.vars.example .dev.vars      # then fill in local values (git-ignored)
npm run db:migrate:local            # local D1 (.wrangler/state)
npm run dev                         # http://localhost:3000 with local D1/R2 bindings
```

## Useful commands
| Command | Purpose |
|---|---|
| `npm run lint` / `npm run typecheck` | Static checks |
| `npm run preview` | Build for Workers and run it locally in the Workers runtime (http://localhost:8787) |
| `npm run smoke -- http://localhost:8787` | 40-check smoke test against a running site |
| `npm run deploy` | Build and deploy to Cloudflare (needs login/token — see DEPLOYMENT.md) |
| `npm run db:migrate:local` / `db:migrate:remote` | Apply `migrations/` |
| `npm run backup` | Encrypted D1 export (needs `BACKUP_PASSPHRASE`) |
| `npm run cf-typegen` | Regenerate `cloudflare-env.d.ts` after changing `wrangler.jsonc` |

## Layout
`src/app` pages and API routes · `src/components` UI · `src/lib` server/client helpers (`db/`, `storage.ts`, `adminAuth.ts`, `rateLimit.ts`) · `src/data` static content · `migrations/` D1 SQL · `scripts/` smoke test and backup tools · `.github/workflows` CI, deploy, backup.

## Status
Fares are indicative estimates (no live provider yet) and there is no payment gateway; "Confirm on WhatsApp" is the booking path. Contact details in `src/data/site.ts` are placeholders.
