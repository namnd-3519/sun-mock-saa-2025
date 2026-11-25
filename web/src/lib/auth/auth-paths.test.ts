import { describe, expect, it } from "vitest";
import { AFTER_LOGIN_PATH, isPublicPath, sanitizeNextPath } from "./auth-paths";

describe("isPublicPath", () => {
  it("treats the login page and auth routes as public", () => {
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/auth/callback")).toBe(true);
    expect(isPublicPath("/auth/sign-out")).toBe(true);
  });

  it("treats every other page as protected", () => {
    expect(isPublicPath("/")).toBe(false);
    expect(isPublicPath("/todo")).toBe(false);
    expect(isPublicPath("/login-help")).toBe(false);
    expect(isPublicPath("/authors")).toBe(false);
  });
});

describe("sanitizeNextPath", () => {
  it("keeps a same-origin relative path with its query", () => {
    expect(sanitizeNextPath("/kudos?tab=all")).toBe("/kudos?tab=all");
  });

  it("falls back to the after-login page for missing or empty values", () => {
    expect(sanitizeNextPath(null)).toBe(AFTER_LOGIN_PATH);
    expect(sanitizeNextPath(undefined)).toBe(AFTER_LOGIN_PATH);
    expect(sanitizeNextPath("")).toBe(AFTER_LOGIN_PATH);
  });

  it("rejects values that could leave the site", () => {
    for (const raw of [
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "evil.example",
      "javascript:alert(1)",
    ]) {
      expect(sanitizeNextPath(raw)).toBe(AFTER_LOGIN_PATH);
    }
  });

  it("never sends a signed-in user back to the login page or auth routes", () => {
    expect(sanitizeNextPath("/login")).toBe(AFTER_LOGIN_PATH);
    expect(sanitizeNextPath("/auth/callback?code=x")).toBe(AFTER_LOGIN_PATH);
  });
});
