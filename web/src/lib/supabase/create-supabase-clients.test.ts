import { beforeEach, describe, expect, it, vi } from "vitest";

const ssr = vi.hoisted(() => ({
  createBrowserClient: vi.fn(() => "browser-client"),
  createServerClient: vi.fn(() => "server-client"),
}));
const cookieStore = vi.hoisted(() => ({ getAll: vi.fn(() => [{ name: "a", value: "1" }]), set: vi.fn() }));

vi.mock("@supabase/ssr", () => ssr);
vi.mock("next/headers", () => ({ cookies: vi.fn(async () => cookieStore) }));

const env = { NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "pk" };

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
});

describe("createSupabaseBrowserClient", () => {
  it("creates a browser client from the public env", async () => {
    const { createSupabaseBrowserClient } = await import("./create-supabase-browser-client");
    expect(createSupabaseBrowserClient()).toBe("browser-client");
    expect(ssr.createBrowserClient).toHaveBeenCalledWith("http://localhost:54321", "pk");
  });

  it("throws before creating a client when the env is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    const { createSupabaseBrowserClient } = await import("./create-supabase-browser-client");
    expect(() => createSupabaseBrowserClient()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    expect(ssr.createBrowserClient).not.toHaveBeenCalled();
  });
});

describe("createSupabaseServerClient", () => {
  it("wires the request cookie store into the server client", async () => {
    const { createSupabaseServerClient } = await import("./create-supabase-server-client");
    await expect(createSupabaseServerClient()).resolves.toBe("server-client");
    const [url, key, options] = ssr.createServerClient.mock.calls[0] as unknown as [
      string,
      string,
      { cookies: { getAll(): unknown; setAll(c: unknown[]): void } },
    ];
    expect([url, key]).toEqual(["http://localhost:54321", "pk"]);
    expect(options.cookies.getAll()).toEqual([{ name: "a", value: "1" }]);
    options.cookies.setAll([{ name: "sb", value: "v", options: { path: "/" } }]);
    expect(cookieStore.set).toHaveBeenCalledWith("sb", "v", { path: "/" });
  });
});
