import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminAuth";
import { getDb } from "@/lib/db";
import { isCrossSite } from "@/lib/rateLimit";
import type { EnquiryStatus } from "@/lib/db/types";

const STATUSES: EnquiryStatus[] = ["new", "in_progress", "quoted", "won", "lost", "spam"];
const NO_STORE = { "Cache-Control": "no-store" };

/** Change an enquiry's status; the previous status is recorded in enquiry_events (atomic batch). */
export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (isCrossSite(request)) return new Response("Forbidden", { status: 403 });
  const guard = await adminGuard(request);
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;
  const enquiryId = /^\d{1,12}$/.test(id) ? Number(id) : NaN;
  const body = (await request.json().catch(() => null)) as { status?: string; note?: string } | null;
  if (!Number.isInteger(enquiryId) || !body || !STATUSES.includes(body.status as EnquiryStatus)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: NO_STORE });
  }
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 500) || null : null;

  const db = getDb();
  const current = await db.prepare("SELECT status FROM enquiries WHERE id = ?1").bind(enquiryId).first<{ status: string }>();
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404, headers: NO_STORE });
  if (current.status === body.status) return NextResponse.json({ ok: true, unchanged: true }, { headers: NO_STORE });

  await db.batch([
    db
      .prepare("INSERT INTO enquiry_events (enquiry_id, from_status, to_status, note, actor) VALUES (?1, ?2, ?3, ?4, ?5)")
      .bind(enquiryId, current.status, body.status, note, guard.email),
    db
      .prepare("UPDATE enquiries SET status = ?2, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?1")
      .bind(enquiryId, body.status),
  ]);
  console.log("[admin] enquiry status", { enquiryId, to: body.status, by: guard.email });
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}
