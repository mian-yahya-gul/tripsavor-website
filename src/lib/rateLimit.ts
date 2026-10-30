import { getCloudflareContext } from "@opennextjs/cloudflare";

type LimiterName = "LEAD_LIMITER" | "UPLOAD_LIMITER";

/**
 * Per-IP rate limit using Cloudflare's Rate Limiting binding (no D1 writes, so a flood can't burn the
 * database quota). Limits are per Cloudflare location and eventually consistent — good against bursts
 * and form spam, not a hard global quota. Returns true when the request should be rejected.
 */
export async function isRateLimited(name: LimiterName, request: Request): Promise<boolean> {
  const limiter = getCloudflareContext().env[name];
  if (!limiter) {
    console.warn(`[rateLimit] binding ${name} missing — not limiting`);
    return false; // fail open: never block real customers because of a config gap
  }
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const { success } = await limiter.limit({ key: `${name}:${ip}` });
  return !success;
}

/** Browsers always send Origin on cross-site POSTs; reject those that don't match our host. */
export function isCrossSite(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false; // non-browser clients (curl, server-to-server) carry no Origin
  try {
    return new URL(origin).host !== new URL(request.url).host;
  } catch {
    return true;
  }
}
