import { describe, expect, it } from "vitest";
import { getRemainingTime, isPrelaunch, padTwoDigits } from "./countdown";

const LAUNCH = new Date("2025-12-26T18:30:00+07:00");
const at = (ms: number) => new Date(LAUNCH.getTime() + ms);
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe("getRemainingTime", () => {
  it("splits the remaining time into days, hours and minutes", () => {
    expect(getRemainingTime(at(-(2 * DAY + 3 * HOUR + 4 * MIN)), LAUNCH)).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      totalMs: 2 * DAY + 3 * HOUR + 4 * MIN,
    });
  });

  it("floors partial minutes", () => {
    const r = getRemainingTime(at(-(5 * MIN + 59_999)), LAUNCH);
    expect([r.days, r.hours, r.minutes]).toEqual([0, 0, 5]);
  });

  it("shows zeros under one minute while still counting", () => {
    expect(getRemainingTime(at(-30_000), LAUNCH)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      totalMs: 30_000,
    });
  });

  it("returns zero at and after launch", () => {
    const zero = { days: 0, hours: 0, minutes: 0, totalMs: 0 };
    expect(getRemainingTime(LAUNCH, LAUNCH)).toEqual(zero);
    expect(getRemainingTime(at(DAY), LAUNCH)).toEqual(zero);
  });

  it("clamps days to 99", () => {
    const r = getRemainingTime(at(-(150 * DAY + HOUR)), LAUNCH);
    expect([r.days, r.hours, r.minutes]).toEqual([99, 23, 59]);
  });
});

describe("isPrelaunch", () => {
  it("is true before launch", () => {
    expect(isPrelaunch(at(-1), LAUNCH)).toBe(true);
  });

  it("is false at launch", () => {
    expect(isPrelaunch(LAUNCH, LAUNCH)).toBe(false);
  });

  it("is false after launch", () => {
    expect(isPrelaunch(at(1), LAUNCH)).toBe(false);
  });

  it("is false when no launch time is configured", () => {
    expect(isPrelaunch(at(-DAY), null)).toBe(false);
  });
});

describe("padTwoDigits", () => {
  it("zero-pads single digits", () => {
    expect(padTwoDigits(0)).toBe("00");
    expect(padTwoDigits(7)).toBe("07");
    expect(padTwoDigits(42)).toBe("42");
  });
});
