import { describe, expect, it } from "vitest";
import { isHoverPointer, nextHoverCardOpen } from "./person-hover-card-state";

describe("nextHoverCardOpen", () => {
  it("shows the card on hover and on keyboard focus", () => {
    expect(nextHoverCardOpen(false, "pointer-enter")).toBe(true);
    expect(nextHoverCardOpen(false, "focus")).toBe(true);
  });

  it("hides the card when the pointer leaves, focus leaves, Escape or a press outside", () => {
    for (const event of ["pointer-leave", "blur", "escape", "outside-press"] as const) {
      expect(nextHoverCardOpen(true, event)).toBe(false);
    }
  });

  it("toggles the card on a tap", () => {
    expect(nextHoverCardOpen(false, "tap")).toBe(true);
    expect(nextHoverCardOpen(true, "tap")).toBe(false);
  });

  it("keeps the card open on repeated enter/focus", () => {
    expect(nextHoverCardOpen(true, "pointer-enter")).toBe(true);
    expect(nextHoverCardOpen(true, "focus")).toBe(true);
  });
});

describe("isHoverPointer", () => {
  it("treats mouse and pen as hover pointers, touch as tap", () => {
    expect(isHoverPointer("mouse")).toBe(true);
    expect(isHoverPointer("pen")).toBe(true);
    expect(isHoverPointer("touch")).toBe(false);
  });
});
