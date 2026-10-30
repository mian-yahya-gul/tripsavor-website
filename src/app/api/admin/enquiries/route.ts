import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminAuth";
import { getDb } from "@/lib/db";
import type { EnquiryRow, EnquiryStatus } from "@/lib/db/types";

const STATUSES: EnquiryStatus[] = ["new", "in_progress", "quoted", "won", "lost", "spam"];
const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const guard = await adminGuard(request);
  if (guard instanceof Response) return guard;

  const status = new URL(request.url).searchParams.get("status");
  if (status && !STATUSES.includes(status as EnquiryStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400, headers: NO_STORE });
  }

  const db = getDb();
  const { results: enquiries } = await db
    .prepare(
      `SELECT id, public_ref, type, status, name, email, phone, message, details_json, created_at
       FROM enquiries WHERE (?1 IS NULL OR status = ?1) ORDER BY created_at DESC LIMIT 100`
    )
    .bind(status)
    .all<Omit<EnquiryRow, "customer_id" | "email_sent" | "updated_at">>();

  const ids = enquiries.map((e) => e.id);
  const files = ids.length
    ? (
        await db
          .prepare(
            `SELECT id, owner_id, original_name, content_type, size_bytes, created_at FROM files
             WHERE owner_type = 'enquiry' AND owner_id IN (${ids.map(() => "?").join(",")}) ORDER BY id`
          )
          .bind(...ids)
          .all<{ id: number; owner_id: number; original_name: string; content_type: string; size_bytes: number; created_at: string }>()
      ).results
    : [];

  return NextResponse.json(
    {
      enquiries: enquiries.map((e) => ({ ...e, files: files.filter((f) => f.owner_id === e.id) })),
    },
    { headers: NO_STORE }
  );
}
