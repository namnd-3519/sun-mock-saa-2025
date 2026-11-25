import { describe, expect, it } from "vitest";
import { fabReducer, type FabEvent } from "./fab-state";

describe("fabReducer (open/close of the floating action button)", () => {
  it("opens from collapsed when the pill is toggled", () => {
    expect(fabReducer(false, "toggle")).toBe(true);
  });

  it("closes when toggled again", () => {
    expect(fabReducer(true, "toggle")).toBe(false);
  });

  it.each<FabEvent>(["cancel", "escape", "outside", "navigate"])(
    "closes on %s while expanded",
    (event) => {
      expect(fabReducer(true, event)).toBe(false);
    },
  );

  it.each<FabEvent>(["cancel", "escape", "outside", "navigate"])(
    "stays collapsed on %s while collapsed",
    (event) => {
      expect(fabReducer(false, event)).toBe(false);
    },
  );
});
