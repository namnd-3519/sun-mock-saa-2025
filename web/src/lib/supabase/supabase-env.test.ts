import { describe, expect, it } from "vitest";
import { readSupabaseEnv } from "./supabase-env";

const LOCAL_URL = "http://127.0.0.1:54321";
const KEY = "sb_publishable_test";

describe("readSupabaseEnv", () => {
  it("returns the url and publishable key when both are set", () => {
    expect(readSupabaseEnv({ url: LOCAL_URL, publishableKey: KEY })).toEqual({
      url: LOCAL_URL,
      publishableKey: KEY,
    });
  });

  it("trims surrounding whitespace from both values", () => {
    expect(
      readSupabaseEnv({ url: ` ${LOCAL_URL}\n`, publishableKey: ` ${KEY} ` }),
    ).toEqual({ url: LOCAL_URL, publishableKey: KEY });
  });

  it("names the missing url variable", () => {
    expect(() => readSupabaseEnv({ publishableKey: KEY })).toThrow(
      "NEXT_PUBLIC_SUPABASE_URL",
    );
  });

  it("treats a blank url as missing", () => {
    expect(() => readSupabaseEnv({ url: "   ", publishableKey: KEY })).toThrow(
      "NEXT_PUBLIC_SUPABASE_URL",
    );
  });

  it("names the missing publishable key variable", () => {
    expect(() => readSupabaseEnv({ url: LOCAL_URL, publishableKey: "" })).toThrow(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  });

  it("rejects a url that is not http or https", () => {
    expect(() =>
      readSupabaseEnv({ url: "localhost:54321", publishableKey: KEY }),
    ).toThrow("NEXT_PUBLIC_SUPABASE_URL");
    expect(() =>
      readSupabaseEnv({ url: "ftp://127.0.0.1", publishableKey: KEY }),
    ).toThrow("NEXT_PUBLIC_SUPABASE_URL");
  });

  it("never echoes the configured values in its error", () => {
    const secretUrl = "postgres://user:sb_secret_leak@db";
    let message = "";
    try {
      readSupabaseEnv({ url: secretUrl, publishableKey: "sb_secret_key" });
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toContain("NEXT_PUBLIC_SUPABASE_URL");
    expect(message).not.toContain("sb_secret_leak");
    expect(message).not.toContain("sb_secret_key");
  });
});
