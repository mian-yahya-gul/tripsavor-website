import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The site is prerendered at build time, so the read-only static-assets cache is enough
// (no R2/KV needed, $0). Pages refresh on each deploy instead of on a revalidate timer.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
