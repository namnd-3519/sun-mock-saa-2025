import { describe, expect, it } from "vitest";
import { KUDOS_LIMITS } from "@/lib/kudos/kudos-limits";
import { isHashtagOptionDisabled, isHashtagSelectionFull, toggleHashtag } from "./hashtag-selection";

const tag = (n: number) => ({ id: `h${n}`, name: `tag${n}` });
const five = [1, 2, 3, 4, 5].map(tag);

describe("toggleHashtag", () => {
  it("adds an unselected tag at the end", () => {
    expect(toggleHashtag([tag(1)], tag(2))).toEqual([tag(1), tag(2)]);
  });

  it("removes a selected tag", () => {
    expect(toggleHashtag([tag(1), tag(2)], tag(1))).toEqual([tag(2)]);
  });

  it("refuses a sixth tag", () => {
    expect(KUDOS_LIMITS.hashtagsMax).toBe(5);
    expect(toggleHashtag(five, tag(6))).toBe(five);
  });

  it("still removes a tag when the selection is full", () => {
    expect(toggleHashtag(five, tag(3))).toHaveLength(4);
  });
});

describe("isHashtagOptionDisabled", () => {
  it("enables every option below the max", () => {
    expect(isHashtagSelectionFull(five.slice(0, 4))).toBe(false);
    expect(isHashtagOptionDisabled(five.slice(0, 4), tag(6))).toBe(false);
  });

  it("disables only unselected options at the max", () => {
    expect(isHashtagSelectionFull(five)).toBe(true);
    expect(isHashtagOptionDisabled(five, tag(6))).toBe(true);
    expect(isHashtagOptionDisabled(five, tag(2))).toBe(false);
  });
});
