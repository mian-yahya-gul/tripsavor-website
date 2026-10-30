# Database (Cloudflare D1)

Binding `DB`, database name `tripsavor-db`, declared in `wrangler.jsonc`. Server-side only (`src/lib/db`).

## Layout
- `migrations/0001_init.sql` — destinations, travel_packages, customers, enquiries, enquiry_events, bookings, passengers, payments, booking_events.
- `src/lib/db/index.ts` (`getDb()`), `types.ts` (row types), `enquiries.ts` (`createEnquiry`, `markEnquiryEmailed`).
- `src/lib/leadValidation.ts` — server-side validation/sanitising of public forms.
- Money = integer minor units + ISO currency code. Timestamps = ISO-8601 UTC text.
- Not stored in D1 by design: card data, CVVs, passport numbers, passport/visa scans (scans go to private R2 in Phase 5).
- Only `enquiries`, `customers` and `enquiry_events` are written by the app today. The booking/payment tables exist for later phases.

## Local development
```bash
npm run db:migrate:local      # creates/updates the local D1 in .wrangler/state (git-ignored)
npm run dev                   # next dev uses the same local D1 through the DB binding
npx wrangler d1 execute tripsavor-db --local --command "SELECT * FROM enquiries"
```

## Production
Created 2026-10-30 in the Cloudflare account of the logged-in Wrangler user (database_id is in `wrangler.jsonc`; an ID is not a secret).
Migration `0001_init.sql` is applied remotely. To apply later migrations:
```bash
npm run db:migrate:remote
```
Add new schema changes as `migrations/0002_*.sql` etc.; never edit an applied migration.

## Backup
`npm run db:export -- backup.sql` exports the remote DB (tested: the export contains all tables). The encrypted off-site backup routine is set up in Phase 8/10 and is **not implemented yet**.
