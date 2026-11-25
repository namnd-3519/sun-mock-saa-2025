import { describe, expect, it } from "vitest";
import { badgeLabel, formatHeartCount, formatKudosTime } from "./kudos-format";

describe("formatKudosTime", () => {
  it("formats as HH:mm - MM/DD/YYYY in Vietnam time", () => {
    expect(formatKudosTime("2025-10-30T03:00:00Z")).toBe("10:00 - 10/30/2025");
    expect(formatKudosTime("2025-12-31T17:05:00Z")).toBe("00:05 - 01/01/2026");
    expect(formatKudosTime("not a date")).toBe("");
  });
});

describe("formatHeartCount", () => {
  it("groups thousands with dots like the design (1.000)", () => {
    expect(formatHeartCount(1000)).toBe("1.000");
    expect(formatHeartCount(10)).toBe("10");
  });
});

describe("badgeLabel", () => {
  it("turns the enum into a display name", () => {
    expect(badgeLabel("stay_gold")).toBe("Stay Gold");
    expect(badgeLabel("flow_to_horizon")).toBe("Flow to Horizon");
    expect(badgeLabel("touch_of_light")).toBe("Touch of Light");
  });
});
