import { describe, expect, it } from "vitest";
import { canGoNext, canGoPrev, clampSlide, slideLabel } from "./highlight-carousel";

describe("highlight carousel", () => {
  it("clamps the slide index into range", () => {
    expect(clampSlide(-1, 5)).toBe(0);
    expect(clampSlide(9, 5)).toBe(4);
    expect(clampSlide(3, 0)).toBe(0);
  });

  it("disables prev on the first slide and next on the last", () => {
    expect(canGoPrev(0)).toBe(false);
    expect(canGoNext(0, 5)).toBe(true);
    expect(canGoNext(4, 5)).toBe(false);
    expect(canGoPrev(4)).toBe(true);
  });

  it("labels the page as n/total", () => {
    expect(slideLabel(1, 5)).toBe("2/5");
    expect(slideLabel(0, 0)).toBe("0/0");
  });
});
