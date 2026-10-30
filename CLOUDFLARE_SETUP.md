# One-time Cloudflare setup

Status as of the last update: D1 database `tripsavor-db` exists with migrations applied. Everything else below is **not done yet** unless ticked.

- [x] Wrangler logged in; D1 `tripsavor-db` created and migrated (`DATABASE.md`)
- [ ] 1. Confirm the domain and add it to Cloudflare (Phase 9 — needs your approval before nameservers change)
- [ ] 2. Enable R2 and create the private bucket
- [ ] 3. Set Worker secrets
- [ ] 4. Create the Access application for the admin host
- [ ] 5. Create a deploy API token and add GitHub secrets
- [ ] 6. First deploy and custom domains

## 2. R2
Dashboard → R2 → "Add R2 subscription" (free tier: 10 GB-month, 1M Class A / 10M Class B operations per month, no egress fees; Cloudflare may require a payment method on file). Then:
```bash
npx wrangler r2 bucket create tripsavor-private     # keep it private: no public domain, no r2.dev
```

## 3. Secrets
```bash
openssl rand -hex 32 | npx wrangler secret put FILE_SIGNING_SECRET
npx wrangler secret put ADMIN_EMAILS                # you@example.com,other@example.com
npx wrangler secret put RESEND_API_KEY              # optional
```
(Secrets can only be set after the Worker exists — do them right after the first `npm run deploy`, or create the Worker first with `npx wrangler deploy`.)

## 4. Access (admin login)
1. Zero Trust → Settings → create a team name (free plan: up to 50 users).
2. Access → Applications → Add → Self-hosted → hostname `admin.<your-domain>`, path `*`.
3. Policy: Action *Allow*, Include *Emails* = your staff emails. Login method: *One-time PIN*.
4. Copy the application's **Audience (AUD) tag** and your team domain into `wrangler.jsonc` `vars` (`CF_ACCESS_AUD`, `CF_ACCESS_TEAM_DOMAIN`, `ADMIN_HOSTNAME`), then deploy.
5. Test: open `https://admin.<your-domain>/admin` in a private window → must ask for an email PIN; an email not on the list must be refused.

## 5. GitHub deploy token
Cloudflare dashboard → My Profile → API Tokens → Create Token → *Custom*, scoped to this account only, with: Workers Scripts: Edit, D1: Edit, Workers R2 Storage: Edit, Account Settings: Read, and (for custom domains) Zone → Workers Routes: Edit on your zone. Exact names can differ slightly in the UI — grant only what Wrangler asks for. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets, then set the variable `DEPLOY_ENABLED=true`.

## 6. First deploy and domains
```bash
npm run db:migrate:remote
npm run deploy                                      # first deploy; prints the *.workers.dev URL
```
Check `https://<worker>.workers.dev`, then add custom domains (Workers → tripsavor → Settings → Domains & Routes) for the apex, `www` and `admin` hostnames — see Phase 9 notes in `DEPLOYMENT.md`.
