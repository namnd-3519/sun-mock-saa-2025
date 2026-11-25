import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Cloudflare build output.
    ".open-next/**",
    ".wrangler/**",
    // Vitest coverage report (pnpm test:coverage).
    "coverage/**",
    // Playwright output and E2E dev builds (pnpm test:e2e).
    "test-results/**",
    "playwright-report/**",
    ".next-e2e*/**",
  ]),
]);

export default eslintConfig;
