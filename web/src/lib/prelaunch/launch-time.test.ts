import { describe, expect, it } from "vitest";
import { parseLaunchAt } from "./launch-time";

describe("parseLaunchAt", () => {
  it("parses an ISO-8601 datetime with a +07:00 offset", () => {
    expect(parseLaunchAt("2025-12-26T18:30:00+07:00")?.toISOString()).toBe(
      "2025-12-26T11:30:00.000Z",
    );
  });

  it("treats a missing or blank value as no launch gate", () => {
    expect(parseLaunchAt(undefined)).toBeNull();
    expect(parseLaunchAt("  ")).toBeNull();
  });

  it("treats an unparseable value as no launch gate", () => {
    expect(parseLaunchAt("next friday")).toBeNull();
  });

  it("rejects a value without an explicit offset", () => {
    expect(parseLaunchAt("2025-12-26T18:30:00")).toBeNull();
  });
});
