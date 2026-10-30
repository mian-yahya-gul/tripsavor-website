import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Private document storage (R2 bucket `tripsavor-private`, binding `UPLOADS`).
 * Server-side only. The bucket has no public access; files are only readable through
 * short-lived signed links (see signFileUrl) issued by server code.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_FILES_PER_ENQUIRY = 10;

const SIGNATURES: { type: string; ext: string; test: (b: Uint8Array) => boolean }[] = [
  { type: "application/pdf", ext: "pdf", test: (b) => startsWith(b, [0x25, 0x50, 0x44, 0x46, 0x2d]) },
  { type: "image/jpeg", ext: "jpg", test: (b) => startsWith(b, [0xff, 0xd8, 0xff]) },
  { type: "image/png", ext: "png", test: (b) => startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
  {
    type: "image/webp",
    ext: "webp",
    test: (b) => startsWith(b, [0x52, 0x49, 0x46, 0x46]) && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
];

function startsWith(b: Uint8Array, sig: number[]) {
  return b.length >= sig.length && sig.every((v, i) => b[i] === v);
}

export function getBucket(): R2Bucket {
  const { env } = getCloudflareContext();
  if (!env.UPLOADS) throw new Error("R2 binding `UPLOADS` is not configured");
  return env.UPLOADS;
}

/** Checks size and the file's real contents (magic bytes) — the client-sent type/extension is ignored. */
export function inspectUpload(bytes: Uint8Array): { ok: true; type: string; ext: string } | { ok: false; error: string } {
  if (bytes.byteLength === 0) return { ok: false, error: "File is empty" };
  if (bytes.byteLength > MAX_UPLOAD_BYTES) return { ok: false, error: "File is larger than 5 MB" };
  const hit = SIGNATURES.find((s) => s.test(bytes));
  if (!hit) return { ok: false, error: "Only PDF, JPG, PNG or WEBP files are allowed" };
  return { ok: true, type: hit.type, ext: hit.ext };
}

/** Display-only name: strips paths and control/markup characters. Never used to build the storage key. */
export function safeDisplayName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  return base.replace(/[^\w.\- ()]/g, "_").slice(0, 100) || "file";
}

export function newObjectKey(ownerRef: string, ext: string): string {
  return `enquiries/${ownerRef}/${crypto.randomUUID()}.${ext}`;
}

// ---- short-lived signed download links (HMAC-SHA256) ----

const enc = new TextEncoder();

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function secret(): string {
  const s = getCloudflareContext().env.FILE_SIGNING_SECRET;
  if (!s || s.length < 32) throw new Error("FILE_SIGNING_SECRET is missing or too short (min 32 chars)");
  return s;
}

/** Path + query for a download link valid for `ttlSeconds` (default 5 minutes). Call only from trusted server code. */
export async function signFileUrl(fileId: number, ttlSeconds = 300): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const sig = await hmac(secret(), `${fileId}.${exp}`);
  return `/api/files/${fileId}?exp=${exp}&sig=${sig}`;
}

export async function verifyFileSignature(fileId: number, exp: string | null, sig: string | null): Promise<boolean> {
  if (!exp || !sig || !/^\d{1,12}$/.test(exp) || !/^[0-9a-f]{64}$/.test(sig)) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmac(secret(), `${fileId}.${exp}`);
  // constant-time compare
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}
