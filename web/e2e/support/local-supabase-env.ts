import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

// Test-only: the E2E suite talks to the shared LOCAL Supabase only. It never runs
// inside the app; nothing under src/ imports this folder.
export type LocalSupabaseEnv = { url: string; publishableKey: string; serviceRoleKey: string };

const WEB_DIR = path.resolve(__dirname, "../..");
const BACKEND_DIR = path.resolve(WEB_DIR, "../backend");
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function assertLocalUrl(url: string): void {
  const { hostname } = new URL(url);
  if (!LOCAL_HOSTS.has(hostname)) {
    throw new Error(`E2E refuses non-local Supabase URL (${hostname}); run against supabase start`);
  }
}

function readSupabaseStatus(): Record<string, string> {
  const out = execFileSync("supabase", ["status", "-o", "env"], {
    cwd: BACKEND_DIR,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  const entries = out
    .split("\n")
    .map((line) => line.match(/^([A-Z_]+)="?(.*?)"?$/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => [m[1], m[2]] as const);
  return Object.fromEntries(entries);
}

let cached: LocalSupabaseEnv | undefined;

/** App URL/key from web/.env.local; service role key from env or `supabase status`. */
export function readLocalSupabaseEnv(): LocalSupabaseEnv {
  if (cached) return cached;
  const envFile = path.join(WEB_DIR, ".env.local");
  // loadEnvFile keeps variables already set in the environment.
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
  if (!url || !publishableKey) {
    throw new Error("E2E needs NEXT_PUBLIC_SUPABASE_URL/_PUBLISHABLE_KEY in web/.env.local");
  }
  assertLocalUrl(url);
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || readSupabaseStatus().SERVICE_ROLE_KEY || "";
  if (!serviceRoleKey) {
    throw new Error("No service role key: is `supabase start` running in backend/?");
  }
  cached = { url, publishableKey, serviceRoleKey };
  return cached;
}
