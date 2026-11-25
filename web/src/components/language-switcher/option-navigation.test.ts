import { describe, expect, it } from "vitest";
import { getOptionAction } from "./option-navigation";

describe("getOptionAction", () => {
  it.each([
    ["ArrowDown", 0, { type: "focus", index: 1 }],
    ["ArrowDown", 1, { type: "focus", index: 1 }],
    ["ArrowUp", 1, { type: "focus", index: 0 }],
    ["ArrowUp", 0, { type: "focus", index: 0 }],
    ["Home", 1, { type: "focus", index: 0 }],
    ["End", 0, { type: "focus", index: 1 }],
    ["Enter", 1, { type: "select", index: 1 }],
    [" ", 0, { type: "select", index: 0 }],
    ["Escape", 0, { type: "close" }],
    ["Tab", 1, { type: "dismiss" }],
  ] as const)("maps %j on option %i to %j", (key, index, action) => {
    expect(getOptionAction(key, index, 2)).toEqual(action);
  });

  it("ignores other keys", () => {
    expect(getOptionAction("a", 0, 2)).toBeNull();
  });
});
