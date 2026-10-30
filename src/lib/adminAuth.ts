import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Admin authentication at the server boundary. The admin hostname sits behind Cloudflare Access
 * (email one-time PIN); Access adds a signed JWT in `Cf-Access-Jwt-Assertion`. We do NOT trust that
 * the request "came through Access" — we verify the JWT signature, issuer, audience, expiry and
 * that the email is on our allow-list. Everything fails closed when configuration is missing.
 */

export type AdminAuth =
  | { ok: true; email: string }
  | { ok: false; status: 401 | 403 | 404 | 503; reason: string };

const jwksByTeam = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function jwksFor(teamDomain: string) {
  let jwks = jwksByTeam.get(teamDomain);
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`https://${teamDomain}/cdn-cgi/access/certs`));
    jwksByTeam.set(teamDomain, jwks);
  }
  return jwks;
}

const csv = (v: string | undefined) =>
  (v ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export async function authenticateAdmin(request: Request): Promise<AdminAuth> {
  const env = getCloudflareContext().env;
  const allowed = csv(env.ADMIN_EMAILS);
  if (allowed.length === 0) return { ok: false, status: 503, reason: "ADMIN_EMAILS not configured" };

  const url = new URL(request.url);

  // Local development only: needs BOTH the dev flag and a localhost host. Never set in production.
  if (env.ADMIN_DEV_EMAIL && env.NEXTJS_ENV === "development" && ["localhost", "127.0.0.1"].includes(url.hostname)) {
    const dev = env.ADMIN_DEV_EMAIL.toLowerCase();
    return allowed.includes(dev) ? { ok: true, email: dev } : { ok: false, status: 403, reason: "dev email not allowed" };
  }

  // Admin routes answer only on the admin hostname (when one is configured).
  if (env.ADMIN_HOSTNAME && url.hostname !== env.ADMIN_HOSTNAME) {
    return { ok: false, status: 404, reason: "not the admin host" };
  }

  const team = env.CF_ACCESS_TEAM_DOMAIN;
  const aud = env.CF_ACCESS_AUD;
  if (!team || !aud) return { ok: false, status: 503, reason: "Cloudflare Access not configured" };

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return { ok: false, status: 401, reason: "missing Access token" };

  try {
    const { payload } = await jwtVerify(token, jwksFor(team), {
      issuer: `https://${team}`,
      audience: aud,
      algorithms: ["RS256"],
    });
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : "";
    if (!email || !allowed.includes(email)) return { ok: false, status: 403, reason: "email not allowed" };
    return { ok: true, email };
  } catch {
    return { ok: false, status: 401, reason: "invalid Access token" };
  }
}

/** For route handlers: returns the admin's email, or a ready-made error Response. */
export async function adminGuard(request: Request): Promise<{ email: string } | Response> {
  const auth = await authenticateAdmin(request);
  if (auth.ok) return { email: auth.email };
  if (auth.status === 503) console.error("[admin] auth misconfigured:", auth.reason);
  const body = auth.status === 404 ? "Not found" : auth.status === 503 ? "Unavailable" : "Unauthorized";
  return new Response(body, { status: auth.status, headers: { "Cache-Control": "no-store" } });
}
