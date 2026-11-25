import { describe, expect, it } from "vitest";
import {
  canOpenSecretBox,
  formatUnopenedCount,
  initialSecretBoxState,
  secretBoxReducer,
} from "./secret-box-rule";

describe("canOpenSecretBox", () => {
  it("is eligible while unopened boxes remain and nothing is in flight", () => {
    expect(canOpenSecretBox(initialSecretBoxState(2))).toBe(true);
  });

  it("is not eligible without unopened boxes or with unknown stats", () => {
    expect(canOpenSecretBox(initialSecretBoxState(0))).toBe(false);
    expect(canOpenSecretBox(initialSecretBoxState(null))).toBe(false);
    expect(canOpenSecretBox(initialSecretBoxState(-1))).toBe(false);
  });

  it("is not eligible while an open request is in flight", () => {
    const opening = secretBoxReducer(initialSecretBoxState(3), { type: "start" });
    expect(opening.phase).toBe("opening");
    expect(canOpenSecretBox(opening)).toBe(false);
  });
});

describe("secretBoxReducer", () => {
  it("records the badge and decrements the count on success", () => {
    const opening = secretBoxReducer(initialSecretBoxState(2), { type: "start" });
    const opened = secretBoxReducer(opening, { type: "success", badge: "stay_gold" });
    expect(opened).toEqual({ unopened: 1, phase: "opened", badge: "stay_gold", error: null });
    expect(canOpenSecretBox(opened)).toBe(true);
  });

  it("stops at zero after the last box is opened", () => {
    const opened = secretBoxReducer(initialSecretBoxState(1), { type: "success", badge: "revival" });
    expect(opened.unopened).toBe(0);
    expect(canOpenSecretBox(opened)).toBe(false);
  });

  it("treats a box already opened elsewhere as none left", () => {
    const state = secretBoxReducer(initialSecretBoxState(1), { type: "failure", code: "no_unopened_box" });
    expect(state).toEqual({ unopened: 0, phase: "error", badge: null, error: "no_unopened_box" });
    expect(canOpenSecretBox(state)).toBe(false);
  });

  it("keeps the count on other errors so the user can retry", () => {
    const state = secretBoxReducer(initialSecretBoxState(3), { type: "failure", code: "unknown" });
    expect(state.unopened).toBe(3);
    expect(state.error).toBe("unknown");
    expect(canOpenSecretBox(state)).toBe(true);
  });

  it("clears the previous badge and error when a new open starts", () => {
    const opened = secretBoxReducer(initialSecretBoxState(2), { type: "success", badge: "root_further" });
    expect(secretBoxReducer(opened, { type: "start" })).toEqual({
      unopened: 1,
      phase: "opening",
      badge: null,
      error: null,
    });
  });
});

describe("formatUnopenedCount", () => {
  it("pads to two digits like the design's 05", () => {
    expect(formatUnopenedCount(5)).toBe("05");
    expect(formatUnopenedCount(0)).toBe("00");
    expect(formatUnopenedCount(12)).toBe("12");
  });
});
