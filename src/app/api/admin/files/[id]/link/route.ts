import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminAuth";
import { getDb } from "@/lib/db";
import { isCrossSite } from "@/lib/rateLimit";
import { signFileUrl } from "@/lib/storage";

/** Issues a 5-minute signed download link for a private file. Admin only; every issue is logged. */
export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (isCrossSite(request)) return new Response("Forbidden", { status: 403 });
  const guard = await adminGuard(request);
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;
  const fileId = /^\d{1,12}$/.test(id) ? Number(id) : NaN;
  const exists = Number.isInteger(fileId)
    ? await getDb().prepare("SELECT 1 AS ok FROM files WHERE id = ?1").bind(fileId).first()
    : null;
  if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });

  console.log("[admin] file link issued", { fileId, by: guard.email });
  return NextResponse.json({ url: await signFileUrl(fileId, 300) }, { headers: { "Cache-Control": "no-store" } });
}
