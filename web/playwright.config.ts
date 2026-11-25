import { defineConfig, devices } from "@playwright/test";
import { storageStatePath } from "./e2e/support/e2e-users";
import { LAUNCHED_AT, PRELAUNCH_AT } from "./e2e/support/launch-times";

// E2E against the shared local Supabase (`supabase start` in backend/). See backend/README.md.
const PORT = Number(process.env.E2E_PORT ?? 3001);
const PRELAUNCH_PORT = Number(process.env.E2E_PRELAUNCH_PORT ?? 3101);

const baseURL = `http://localhost:${PORT}`;
const prelaunchURL = `http://localhost:${PRELAUNCH_PORT}`;
// MoMorph desktop frame size.
const viewport = { width: 1440, height: 1024 };

function devServer(port: number, distDir: string, launchAt: string) {
  return {
    command: `pnpm exec next dev --port ${port}`,
    url: `http://localhost:${port}/login`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: { NEXT_DIST_DIR: distDir, SAA_LAUNCH_AT: launchAt },
  };
}

export default defineConfig({
  testDir: "e2e",
  outputDir: "test-results",
  globalTeardown: "./e2e/global-teardown.ts",
  // One shared database and realtime channel: run serially.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: { baseURL, viewport, trace: "retain-on-failure" },
  webServer: [
    devServer(PORT, ".next-e2e", LAUNCHED_AT),
    devServer(PRELAUNCH_PORT, ".next-e2e-prelaunch", PRELAUNCH_AT),
  ],
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      testIgnore: /prelaunch\/.*/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], viewport, storageState: storageStatePath("sender") },
    },
    {
      name: "prelaunch",
      testMatch: /prelaunch\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport, baseURL: prelaunchURL },
    },
  ],
});
