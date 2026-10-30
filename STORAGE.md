# Private file storage (Cloudflare R2)

Bucket `tripsavor-private`, binding `UPLOADS` (declared in `wrangler.jsonc`). **No public access, no public domain.**

## Design
- Customers upload visa/travel documents to `POST /api/uploads` (multipart: `ref`, `email`, `file`). The enquiry reference **and** the email used on it must match (same 404 for either mismatch).
- Validation (`src/lib/storage.ts`): max 5 MB, max 10 files per enquiry, type decided from the file's **magic bytes** (PDF/JPG/PNG/WEBP only); client-sent type and filename are ignored. Keys are server-generated (`enquiries/<ref>/<uuid>.<ext>`).
- Metadata lives in D1 table `files` (migration `0002_files.sql`); the bytes never go to D1.
- Reading: `GET /api/files/<id>?exp=&sig=` works only with an HMAC-SHA256 link signed with `FILE_SIGNING_SECRET`, valid 5 minutes (`signFileUrl`). Anything else is a uniform 404. Responses are `attachment`, `nosniff`, `private, no-store`, sandbox CSP.
- R2 credentials are never sent to the browser; all access is through the Worker binding.
- Issuing signed links to staff is added with the admin area (Phase 6). Upload rate limiting is also Phase 6.

## Secrets
- Local: `FILE_SIGNING_SECRET` in `.dev.vars` (git-ignored).
- Production: `npx wrangler secret put FILE_SIGNING_SECRET` (use `openssl rand -hex 32`).

## Production setup (blocked — needs you)
R2 must be enabled on the Cloudflare account first (Dashboard → R2 → "Add R2 subscription"; Cloudflare may require a payment method on file even though the free tier is $0). Then:
```bash
npx wrangler r2 bucket create tripsavor-private
```
Free tier: 10 GB-month storage, 1M Class A and 10M Class B operations per month, no egress fees. Deploys fail until the bucket exists because the binding is declared.
