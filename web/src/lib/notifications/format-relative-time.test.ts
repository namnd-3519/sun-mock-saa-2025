import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./format-relative-time";

const now = new Date("2026-11-25T12:00:00Z");
const ago = (seconds: number) => new Date(now.getTime() - seconds * 1000).toISOString();

describe("formatRelativeTime", () => {
  it("says just now under a minute (and for clock skew into the future)", () => {
    expect(formatRelativeTime(ago(30), "vi", now, "Vừa xong")).toBe("Vừa xong");
    expect(formatRelativeTime(ago(-20), "en", now, "Just now")).toBe("Just now");
  });

  it("uses minutes, hours and days", () => {
    expect(formatRelativeTime(ago(5 * 60), "en", now, "Just now")).toBe("5 minutes ago");
    expect(formatRelativeTime(ago(3 * 3600), "en", now, "Just now")).toBe("3 hours ago");
    expect(formatRelativeTime(ago(2 * 86400), "en", now, "Just now")).toBe("2 days ago");
    expect(formatRelativeTime(ago(5 * 60), "vi", now, "Vừa xong")).toBe("5 phút trước");
  });

  it("shows the date after a week", () => {
    expect(formatRelativeTime("2026-11-01T12:00:00Z", "vi", now, "Vừa xong")).toBe("01/11/2026");
    expect(formatRelativeTime("2026-11-01T12:00:00Z", "en", now, "Just now")).toBe("11/01/2026");
  });
});
