import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

type CookieMethods = {
  getAll(): { name: string; value: string }[];
  setAll(cookies: { name: string; value: string; options?: object }[], headers?: Record<string, string>): void;
};

const session = vi.hoisted(() => ({
  sub: undefined as string | undefined,
  refresh: null as null | ((cookies: CookieMethods) => void),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: (_url: string, _key: string, { cookies }: { cookies: CookieMethods }) => ({
    auth: {
      getClaims: async () => {
        session.refresh?.(cookies);
        return { data: session.sub ? { claims: { sub: session.sub } } : null };
      },
    },
  }),
}));

const request = (path: string) => new NextRequest(new URL(path, "http://localhost:3000"));

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:54321");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "pk");
  session.sub = undefined;
  session.refresh = null;
});

async function run(path: string) {
  vi.resetModules();
  const { updateSession } = await import("./update-session");
  return updateSession(request(path));
}

describe("updateSession", () => {
  it("lets a signed-in user through", async () => {
    session.sub = "user-1";
    const response = await run("/kudos");
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("sends a signed-out user to login with the original path as next", async () => {
    const response = await run("/kudos?tab=all");
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?next=%2Fkudos%3Ftab%3Dall",
    );
  });

  it("sends a signed-in user away from login to the safe next path", async () => {
    session.sub = "user-1";
    const response = await run("/login?next=%2F%2Fevil.example");
    expect(response.headers.get("location")).toBe("http://localhost:3000/");
  });

  it("treats claims without a subject as signed out", async () => {
    session.refresh = () => undefined;
    const response = await run("/");
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("writes refreshed cookies and cache headers to the pass-through response", async () => {
    session.sub = "user-1";
    session.refresh = (cookies) => {
      expect(cookies.getAll()).toEqual([]);
      cookies.setAll([{ name: "sb-token", value: "new", options: { path: "/" } }], {
        "Cache-Control": "private, no-store",
      });
    };
    const response = await run("/kudos");
    expect(response.cookies.get("sb-token")?.value).toBe("new");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("keeps refreshed cookies on a redirect", async () => {
    session.refresh = (cookies) => cookies.setAll([{ name: "sb-token", value: "" }]);
    const response = await run("/profile");
    expect(response.headers.get("location")).toContain("/login?next=%2Fprofile");
    expect(response.cookies.get("sb-token")?.value).toBe("");
  });
});
