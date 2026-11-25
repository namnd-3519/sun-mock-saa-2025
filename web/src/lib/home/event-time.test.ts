import { describe, expect, it } from "vitest";
import { DEFAULT_EVENT_AT, resolveEventAt } from "./event-time";

describe("resolveEventAt", () => {
  it("reads an ISO-8601 time with offset from the env value", () => {
    expect(resolveEventAt("2026-12-26T18:30:00+07:00").toISOString()).toBe(
      "2026-12-26T11:30:00.000Z",
    );
  });

  it("falls back to the ceremony time on the design when unset or invalid", () => {
    const fallback = new Date(DEFAULT_EVENT_AT).getTime();
    expect(resolveEventAt(undefined).getTime()).toBe(fallback);
    expect(resolveEventAt("").getTime()).toBe(fallback);
    expect(resolveEventAt("26/12/2025 18:30").getTime()).toBe(fallback);
    expect(fallback).toBe(Date.UTC(2025, 11, 26, 11, 30));
  });
});
