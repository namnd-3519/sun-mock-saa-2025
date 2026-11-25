import { describe, expect, it } from "vitest";
import type { KudosErrorCode } from "./kudos-error";
import type { CreateKudosInput } from "./kudos-types";
import { validateKudosInput } from "./validate-kudos-input";

const sender = "sender-1";
const valid: CreateKudosInput = {
  recipientId: "recipient-1",
  content: "Thank you!",
  hashtagIds: ["h1"],
  imagePaths: [`${sender}/a.png`],
};

describe("validateKudosInput", () => {
  it("accepts a valid kudos", () => {
    expect(validateKudosInput(valid, sender)).toBeNull();
  });

  const cases: [string, Partial<CreateKudosInput>, KudosErrorCode][] = [
    ["missing recipient", { recipientId: "" }, "invalid_recipient"],
    ["self kudos", { recipientId: sender }, "invalid_recipient"],
    ["blank content", { content: "   " }, "invalid_content"],
    ["content too long", { content: "x".repeat(5001) }, "invalid_content"],
    ["no hashtag", { hashtagIds: [] }, "invalid_hashtags"],
    ["six hashtags", { hashtagIds: ["1", "2", "3", "4", "5", "6"] }, "invalid_hashtags"],
    ["six images", { imagePaths: Array.from({ length: 6 }, (_, i) => `${sender}/${i}.png`) }, "invalid_images"],
    ["foreign image folder", { imagePaths: ["someone-else/a.png"] }, "invalid_images"],
    ["bare folder path", { imagePaths: [`${sender}/`] }, "invalid_images"],
    ["anonymous name without flag", { anonymousName: "Fan" }, "invalid_anonymous_name"],
    ["anonymous name too long", { isAnonymous: true, anonymousName: "x".repeat(51) }, "invalid_anonymous_name"],
    ["title too long", { title: "x".repeat(101) }, "invalid_title"],
  ];

  it.each(cases)("rejects %s", (_label, patch, code) => {
    expect(validateKudosInput({ ...valid, ...patch }, sender)).toBe(code);
  });

  it("counts duplicate hashtags once", () => {
    expect(validateKudosInput({ ...valid, hashtagIds: ["1", "1", "2", "3", "4", "5"] }, sender)).toBeNull();
  });

  it("accepts an anonymous kudos with a name", () => {
    expect(validateKudosInput({ ...valid, isAnonymous: true, anonymousName: "A fan" }, sender)).toBeNull();
  });
});
