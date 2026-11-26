import { describe, expect, it } from "vitest";
import { DEFAULT_EVENT_AT, formatEventDate, resolveEventAt } from "./event-time";

describe("resolveEventAt", () => {
  it("reads an ISO-8601 time with offset from the env value", () => {
    expect(resolveEventAt("2026-12-26T18:30:00+07:00", undefined).toISOString()).toBe(
      "2026-12-26T11:30:00.000Z",
    );
  });

  it("prefers SAA_EVENT_AT over SAA_LAUNCH_AT when both are valid", () => {
    expect(
      resolveEventAt("2026-12-26T18:30:00+07:00", "2026-12-20T09:00:00+07:00").toISOString(),
    ).toBe("2026-12-26T11:30:00.000Z");
  });

  it("falls back to the launch time so both countdowns share one target", () => {
    const launch = "2026-12-26T18:00:00+07:00";
    expect(resolveEventAt(undefined, launch).toISOString()).toBe("2026-12-26T11:00:00.000Z");
    expect(resolveEventAt("", launch).toISOString()).toBe("2026-12-26T11:00:00.000Z");
    expect(resolveEventAt("26/12/2026", launch).toISOString()).toBe("2026-12-26T11:00:00.000Z");
  });

  it("falls back to the ceremony time on the design when neither is valid", () => {
    const fallback = new Date(DEFAULT_EVENT_AT).getTime();
    expect(resolveEventAt(undefined, undefined).getTime()).toBe(fallback);
    expect(resolveEventAt("", "").getTime()).toBe(fallback);
    expect(resolveEventAt("26/12/2025 18:30", "bad").getTime()).toBe(fallback);
    expect(fallback).toBe(Date.UTC(2025, 11, 26, 11, 30));
  });
});

describe("formatEventDate", () => {
  it("formats DD/MM/YYYY in Asia/Ho_Chi_Minh", () => {
    expect(formatEventDate(new Date("2026-12-26T18:00:00+07:00"))).toBe("26/12/2026");
  });

  it("uses the Vietnam calendar day, not UTC, near midnight", () => {
    expect(formatEventDate(new Date("2026-12-25T18:30:00Z"))).toBe("26/12/2026");
  });
});
