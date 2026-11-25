import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.d.ts"],
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "coverage",
      thresholds: {
        // Global floor at the measured baseline (2026-11-25: 38.6% lines, 45.4%
        // branches); raise it as tasks 27 and 28 add component and app tests.
        lines: 38,
        branches: 45,
        "src/lib/**": { lines: 80, branches: 80 },
        "src/i18n/**": { lines: 80, branches: 80 },
      },
    },
  },
});
