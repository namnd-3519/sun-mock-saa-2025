import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const resolve = {
  alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
};

export default defineConfig({
  resolve,
  test: {
    // Logic tests (*.test.ts) stay on node; component tests (*.test.tsx)
    // render in jsdom with jest-dom matchers.
    projects: [
      {
        resolve,
        test: { name: "node", environment: "node", include: ["src/**/*.test.ts"] },
      },
      {
        resolve,
        test: {
          name: "dom",
          environment: "jsdom",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["src/test/setup-dom.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.d.ts", "src/test/**"],
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "coverage",
      thresholds: {
        // Global floor just under the measured level (2026-11-25, after task 27's
        // component tests: 81.4% lines, 80.1% branches; components 81.1% / 74.4%).
        lines: 80,
        branches: 78,
        "src/components/**": { lines: 70, branches: 70 },
        "src/lib/**": { lines: 80, branches: 80 },
        "src/i18n/**": { lines: 80, branches: 80 },
      },
    },
  },
});
