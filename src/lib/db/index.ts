import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * The D1 database (binding `DB`, see wrangler.jsonc). Server-side only — never import this from a
 * client component. Always use parameterized statements: `db.prepare("... ?").bind(value)`.
 */
export function getDb(): D1Database {
  const { env } = getCloudflareContext();
  if (!env.DB) throw new Error("D1 binding `DB` is not configured");
  return env.DB;
}

/** ISO-8601 UTC timestamp, same shape as the schema defaults. */
export function nowIso(): string {
  return new Date().toISOString();
}
