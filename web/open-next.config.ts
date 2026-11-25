// OpenNext adapter config for Cloudflare Workers. See docs/deploy-cloudflare.md.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The app uses no "use cache", revalidate or cache tags, so the read-only
// static-assets cache (build-time prerenders served from Workers assets) is
// enough and needs no R2/KV binding.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
