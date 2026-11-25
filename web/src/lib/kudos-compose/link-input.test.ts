import { describe, expect, it } from "vitest";
import { LINK_LIMITS, insertLink, validateLinkInput, validateLinkText, validateLinkUrl } from "./link-input";

describe("validateLinkText", () => {
  it("requires non-blank text", () => {
    expect(validateLinkText("")).toBe("required");
    expect(validateLinkText("   \n ")).toBe("required");
  });

  it("accepts 1 to 100 characters after trimming", () => {
    expect(validateLinkText("a")).toBeUndefined();
    expect(validateLinkText(`  ${"x".repeat(LINK_LIMITS.textMax)}  `)).toBeUndefined();
    expect(validateLinkText("x".repeat(LINK_LIMITS.textMax + 1))).toBe("tooLong");
  });
});

describe("validateLinkUrl", () => {
  it("requires a URL", () => {
    expect(validateLinkUrl("")).toBe("required");
    expect(validateLinkUrl("  ")).toBe("required");
  });

  it("accepts trimmed http and https URLs", () => {
    expect(validateLinkUrl("https://sun-asterisk.com")).toBeUndefined();
    expect(validateLinkUrl("  http://a.io/path?q=1#x  ")).toBeUndefined();
    expect(validateLinkUrl("HTTPS://EXAMPLE.COM")).toBeUndefined();
  });

  it.each([
    "javascript:alert(1)",
    "JavaScript://%0aalert(1)",
    "data:text/html,<b>x</b>",
    "mailto:someone@example.com",
    "ftp://example.com/file",
    "example.com",
    "//example.com",
    "https://",
    "http:///path",
    "https://exa mple.com",
    "https://example.com/a b",
  ])("rejects %s", (url) => {
    expect(validateLinkUrl(url)).toBe("invalid");
  });

  it("enforces the 5 to 2048 length range", () => {
    expect(validateLinkUrl("http")).toBe("tooShort");
    const longest = `https://a.io/${"p".repeat(LINK_LIMITS.urlMax - 13)}`;
    expect(longest).toHaveLength(LINK_LIMITS.urlMax);
    expect(validateLinkUrl(longest)).toBeUndefined();
    expect(validateLinkUrl(`${longest}p`)).toBe("tooLong");
  });
});

describe("validateLinkInput", () => {
  it("returns trimmed values when both fields are valid", () => {
    expect(validateLinkInput({ text: " Docs ", url: " https://a.io " })).toEqual({ ok: true, text: "Docs", url: "https://a.io" });
  });

  it("returns every field error at once", () => {
    expect(validateLinkInput({ text: " ", url: "javascript:void(0)" })).toEqual({
      ok: false,
      errors: { text: "required", url: "invalid" },
    });
  });
});

describe("insertLink", () => {
  it("replaces the selection with a Markdown link and puts the caret after it", () => {
    expect(insertLink("see docs now", 4, 8, "Docs", "https://a.io")).toEqual({
      value: "see [Docs](https://a.io) now",
      start: 24,
      end: 24,
    });
  });

  it("inserts at the caret when nothing is selected", () => {
    expect(insertLink("", 0, 0, "x", "http://b.io")).toEqual({ value: "[x](http://b.io)", start: 16, end: 16 });
  });
});
