import { describe, expect, it } from "vitest";
import { isAdmin } from "./is-admin";

describe("isAdmin", () => {
  it("accepts the admin role in app_metadata", () => {
    expect(isAdmin({ app_metadata: { role: "admin" } })).toBe(true);
  });

  it("rejects other roles, missing claims and non-string values", () => {
    expect(isAdmin({ app_metadata: { role: "user" } })).toBe(false);
    expect(isAdmin({ app_metadata: { role: "Admin" } })).toBe(false);
    expect(isAdmin({ app_metadata: { role: ["admin"] } })).toBe(false);
    expect(isAdmin({ app_metadata: {} })).toBe(false);
    expect(isAdmin({ app_metadata: null })).toBe(false);
    expect(isAdmin({})).toBe(false);
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });

  it("ignores a role the user set in user_metadata", () => {
    const claims = { app_metadata: {}, user_metadata: { role: "admin" } };
    expect(isAdmin(claims)).toBe(false);
  });
});
