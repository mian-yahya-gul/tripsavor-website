import { getDb } from "@/lib/db";
import { getBucket, verifyFileSignature } from "@/lib/storage";

/**
 * Private file download. Works only with a short-lived signed link created by server code
 * (signFileUrl); there is no way to list or fetch files without one. Admin UI that issues links
 * is added in Phase 6 behind Cloudflare Access.
 */
export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const url = new URL(request.url);
  const fileId = /^\d{1,12}$/.test(id) ? Number(id) : NaN;

  const notFound = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  if (!Number.isInteger(fileId)) return notFound();

  let valid = false;
  try {
    valid = await verifyFileSignature(fileId, url.searchParams.get("exp"), url.searchParams.get("sig"));
  } catch (err) {
    console.error("[api/files] signing misconfigured", err instanceof Error ? err.message : "unknown");
  }
  if (!valid) return notFound(); // same response for bad/expired/missing signature

  const row = await getDb()
    .prepare("SELECT r2_key, original_name, content_type FROM files WHERE id = ?1")
    .bind(fileId)
    .first<{ r2_key: string; original_name: string; content_type: string }>();
  if (!row) return notFound();

  const object = await getBucket().get(row.r2_key);
  if (!object) return notFound();

  return new Response(object.body, {
    headers: {
      "Content-Type": row.content_type,
      "Content-Disposition": `attachment; filename="${row.original_name.replace(/"/g, "")}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
