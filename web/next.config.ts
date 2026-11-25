import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only the Playwright E2E servers set NEXT_DIST_DIR (two dev servers side by side);
  // every other build, OpenNext included, keeps the default .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
