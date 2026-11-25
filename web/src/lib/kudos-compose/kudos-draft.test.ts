import { describe, expect, it } from "vitest";
import { draftToInput, emptyKudosDraft, isDraftComplete, validateKudosDraft, type KudosDraft } from "./kudos-draft";

const sender = "me";
const valid: KudosDraft = {
  ...emptyKudosDraft(),
  recipient: { id: "u2", fullName: "An", avatarUrl: null, departmentId: null },
  title: "Người truyền động lực",
  content: "Cảm ơn bạn!",
  hashtags: [{ id: "h1", name: "teamwork" }],
};

describe("validateKudosDraft", () => {
  it("accepts a complete draft", () => {
    expect(validateKudosDraft(valid, sender)).toEqual({});
  });

  it("requires recipient, title, content and a hashtag", () => {
    expect(validateKudosDraft(emptyKudosDraft(), sender)).toEqual({
      recipient: "required",
      title: "required",
      content: "required",
      hashtags: "required",
    });
  });

  it("treats whitespace-only title and content as empty", () => {
    const errors = validateKudosDraft({ ...valid, title: "   ", content: "\n " }, sender);
    expect(errors).toEqual({ title: "required", content: "required" });
  });

  it("rejects sending kudos to yourself", () => {
    const self = { ...valid, recipient: { ...valid.recipient!, id: sender } };
    expect(validateKudosDraft(self, sender)).toEqual({ recipient: "self" });
  });

  it("enforces the length limits of the RPC", () => {
    const errors = validateKudosDraft(
      { ...valid, title: "t".repeat(101), content: "c".repeat(5001), isAnonymous: true, anonymousName: "a".repeat(51) },
      sender,
    );
    expect(errors).toEqual({ title: "tooLong", content: "tooLong", anonymousName: "tooLong" });
  });

  it("accepts the exact maximum lengths", () => {
    const draft = { ...valid, title: "t".repeat(100), content: "c".repeat(5000), isAnonymous: true, anonymousName: "a".repeat(50) };
    expect(validateKudosDraft(draft, sender)).toEqual({});
  });

  it("allows at most 5 hashtags", () => {
    const hashtags = Array.from({ length: 6 }, (_, i) => ({ id: `h${i}`, name: `t${i}` }));
    expect(validateKudosDraft({ ...valid, hashtags }, sender)).toEqual({ hashtags: "tooMany" });
  });

  it("ignores the anonymous name when not sending anonymously", () => {
    expect(validateKudosDraft({ ...valid, anonymousName: "a".repeat(80) }, sender)).toEqual({});
  });
});

describe("isDraftComplete", () => {
  it("is false until every required field is filled", () => {
    expect(isDraftComplete(emptyKudosDraft())).toBe(false);
    expect(isDraftComplete({ ...valid, hashtags: [] })).toBe(false);
    expect(isDraftComplete({ ...valid, title: " " })).toBe(false);
    expect(isDraftComplete(valid)).toBe(true);
  });
});

describe("draftToInput", () => {
  it("maps the draft to the create_kudos input", () => {
    expect(draftToInput({ ...valid, title: "  Hero  ", anonymousName: "Fan" }, ["me/a.png"])).toEqual({
      recipientId: "u2",
      title: "Hero",
      content: "Cảm ơn bạn!",
      hashtagIds: ["h1"],
      imagePaths: ["me/a.png"],
      isAnonymous: false,
      anonymousName: null,
    });
  });

  it("keeps the trimmed anonymous name only when anonymous", () => {
    const input = draftToInput({ ...valid, isAnonymous: true, anonymousName: "  Fan " }, []);
    expect(input).toMatchObject({ isAnonymous: true, anonymousName: "Fan" });
  });
});
