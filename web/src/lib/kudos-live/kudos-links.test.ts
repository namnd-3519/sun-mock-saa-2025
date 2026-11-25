import { describe, expect, it } from "vitest";
import { kudosAnchorId, kudosDetailHref, kudosShareUrl } from "./kudos-links";

describe("kudos links", () => {
  it("anchors a card on the Live board", () => {
    expect(kudosAnchorId("k1")).toBe("kudos-k1");
    expect(kudosDetailHref("k1")).toBe("/kudos#kudos-k1");
  });

  it("builds an absolute share URL", () => {
    expect(kudosShareUrl("https://saa.example", "k1")).toBe("https://saa.example/kudos#kudos-k1");
  });
});
