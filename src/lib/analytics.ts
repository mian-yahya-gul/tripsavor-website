type Payload = Record<string, string | number | boolean | undefined>;

/**
 * Lightweight event tracker. Pushes to `window.dataLayer` (GTM-style) if present,
 * otherwise no-ops in prod and logs in dev. Swap the sink for a real endpoint later.
 */
export function track(event: string, payload: Payload = {}) {
  if (typeof window === "undefined") return;
  const entry = { event, ...payload, ts: Date.now() };
  const w = window as unknown as { dataLayer?: unknown[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push(entry);
  } else if (process.env.NODE_ENV !== "production") {
    console.debug("[track]", entry);
  }
}
