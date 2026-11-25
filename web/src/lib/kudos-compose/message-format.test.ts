import { describe, expect, it } from "vitest";
import { applyMessageFormat } from "./message-format";

describe("applyMessageFormat", () => {
  it("wraps the selection with inline markers", () => {
    expect(applyMessageFormat("hello world", 6, 11, "bold")).toEqual({ value: "hello **world**", start: 8, end: 13 });
    expect(applyMessageFormat("hi", 0, 2, "italic")).toEqual({ value: "_hi_", start: 1, end: 3 });
    expect(applyMessageFormat("hi", 0, 2, "strike")).toEqual({ value: "~~hi~~", start: 2, end: 4 });
  });

  it("inserts empty markers and puts the caret between them", () => {
    expect(applyMessageFormat("ab", 1, 1, "bold")).toEqual({ value: "a****b", start: 3, end: 3 });
  });

  it("prefixes every selected line for lists and quotes", () => {
    expect(applyMessageFormat("one\ntwo", 0, 7, "numbered")).toEqual({ value: "1. one\n2. two", start: 0, end: 13 });
    expect(applyMessageFormat("say\nthis", 5, 6, "quote")).toEqual({ value: "say\n> this", start: 4, end: 10 });
  });

  it("wraps the selection as a link template", () => {
    expect(applyMessageFormat("see docs", 4, 8, "link")).toEqual({ value: "see [docs](https://)", start: 11, end: 19 });
  });
});
