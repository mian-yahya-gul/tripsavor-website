import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isCrossSite, isRateLimited } from "@/lib/rateLimit";
import {
  MAX_FILES_PER_ENQUIRY,
  MAX_UPLOAD_BYTES,
  getBucket,
  inspectUpload,
  newObjectKey,
  safeDisplayName,
} from "@/lib/storage";

/**
 * Customer document upload (visa / travel documents), attached to an existing enquiry.
 * The caller must know both the enquiry reference and the email used on it.
 * Files go to the private R2 bucket; metadata goes to D1. Per-IP rate limited.
 */
export async function POST(request: Request) {
  if (isCrossSite(request)) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  if (await isRateLimited("UPLOAD_LIMITER", request)) {
    return NextResponse.json({ ok: false, error: "Too many uploads, please try again in a minute" }, { status: 429, headers: { "Retry-After": "60" } });
  }

  // Cheap early rejection before buffering the body.
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_UPLOAD_BYTES + 64 * 1024) {
    return NextResponse.json({ ok: false, error: "File is larger than 5 MB" }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const ref = String(form.get("ref") ?? "").trim().toUpperCase();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const file = form.get("file");
  if (!/^ENQ-[A-Z2-9]{6}$/.test(ref) || !email || !(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "ref, email and file are required" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = inspectUpload(bytes);
  if (!check.ok) return NextResponse.json({ ok: false, error: check.error }, { status: 400 });

  try {
    const db = getDb();
    const enquiry = await db
      .prepare("SELECT id FROM enquiries WHERE public_ref = ?1 AND email = ?2 COLLATE NOCASE")
      .bind(ref, email)
      .first<{ id: number }>();
    // Same message for "no such ref" and "wrong email" so refs can't be probed.
    if (!enquiry) return NextResponse.json({ ok: false, error: "Enquiry not found" }, { status: 404 });

    const count = await db
      .prepare("SELECT count(*) AS n FROM files WHERE owner_type = 'enquiry' AND owner_id = ?1")
      .bind(enquiry.id)
      .first<{ n: number }>();
    if ((count?.n ?? 0) >= MAX_FILES_PER_ENQUIRY) {
      return NextResponse.json({ ok: false, error: "Upload limit reached for this enquiry" }, { status: 429 });
    }

    const key = newObjectKey(ref, check.ext);
    await getBucket().put(key, bytes, {
      httpMetadata: { contentType: check.type },
      customMetadata: { enquiry: ref },
    });
    try {
      await db
        .prepare(
          "INSERT INTO files (r2_key, owner_type, owner_id, original_name, content_type, size_bytes) VALUES (?1, 'enquiry', ?2, ?3, ?4, ?5)"
        )
        .bind(key, enquiry.id, safeDisplayName(file.name), check.type, bytes.byteLength)
        .run();
    } catch (err) {
      await getBucket().delete(key).catch(() => {}); // don't leave an unreferenced object behind
      throw err;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/uploads] failed", { ref, error: err instanceof Error ? err.message : "unknown" });
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
