# Environment variables, secrets and bindings

Never commit real values. Local values live in `.dev.vars` (git-ignored); production secrets are set with `wrangler secret put <NAME>` (or the dashboard); production plain config goes in `wrangler.jsonc` `vars`.

## Runtime (the Worker)
| Name | Kind | Where | Required | Purpose |
|---|---|---|---|---|
| `FILE_SIGNING_SECRET` | secret | `.dev.vars` / `wrangler secret put` | yes (for file links) | HMAC key for 5-minute private-file links. ≥32 random chars: `openssl rand -hex 32`. Use a different value in production |
| `ADMIN_EMAILS` | secret | `.dev.vars` / `wrangler secret put` | yes (admin) | Comma-separated staff emails allowed into `/admin`. Empty = admin locked |
| `CF_ACCESS_TEAM_DOMAIN` | var | `wrangler.jsonc` | yes (admin) | e.g. `yourteam.cloudflareaccess.com` |
| `CF_ACCESS_AUD` | var | `wrangler.jsonc` | yes (admin) | Audience tag of the Access application |
| `ADMIN_HOSTNAME` | var | `wrangler.jsonc` | recommended | e.g. `admin.<your-domain>`; admin answers only on this host |
| `RESEND_API_KEY` | secret | `.dev.vars` / `wrangler secret put` | optional | Sends enquiry emails. Without it enquiries are still saved to D1 |
| `LEAD_TO_EMAIL` | secret/var | same | optional | Inbox for enquiry emails (default: `siteConfig.email`) |
| `NEXTJS_ENV` | local only | `.dev.vars` | local only | `development` locally; leave unset in production |
| `ADMIN_DEV_EMAIL` | local only | `.dev.vars` | **never in production** | Local admin bypass (localhost + `NEXTJS_ENV=development` only) |

## Bindings (declared in `wrangler.jsonc`, no secret values)
`DB` (D1 `tripsavor-db`) · `UPLOADS` (R2 `tripsavor-private`) · `ASSETS` (static files) · `WORKER_SELF_REFERENCE` (OpenNext) · `LEAD_LIMITER`, `UPLOAD_LIMITER` (rate limits).

## GitHub Actions
| Name | Kind | Used by |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | secret | deploy, backup |
| `CLOUDFLARE_ACCOUNT_ID` | secret | deploy, backup |
| `BACKUP_PASSPHRASE` | secret | backup (also store it offline, independent of GitHub and Cloudflare) |
| `DEPLOY_ENABLED` = `true` | repository variable | turns on `deploy.yml` |
| `BACKUP_ENABLED` = `true` | repository variable | turns on `backup.yml` |

## Notes
- `database_id` in `wrangler.jsonc` is an identifier, not a secret, and is committed.
- Public (browser) code uses no secrets: nothing is exposed through `NEXT_PUBLIC_*`.
