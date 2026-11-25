import { describe, expect, it } from "vitest";
import { DEPARTMENT_PARAM, HASHTAG_PARAM, parseKudosFilters, withFilterParam } from "./kudos-filters";

const H = "11111111-1111-4111-8111-111111111111";
const H2 = "33333333-3333-4333-8333-333333333333";
const D = "22222222-2222-4222-8222-222222222222";

describe("withFilterParam (hashtag dropdown → feed query)", () => {
  it("adds the hashtag to an empty search", () => {
    expect(withFilterParam("", HASHTAG_PARAM, H)).toBe(`?hashtag=${H}`);
  });

  it("replaces the hashtag and keeps the department and unrelated params", () => {
    const next = withFilterParam(`?department=${D}&hashtag=${H}&utm=x`, HASHTAG_PARAM, H2);
    const params = new URLSearchParams(next);
    expect(params.get(HASHTAG_PARAM)).toBe(H2);
    expect(params.get(DEPARTMENT_PARAM)).toBe(D);
    expect(params.get("utm")).toBe("x");
  });

  it("removes only the hashtag when cleared", () => {
    expect(withFilterParam(`?hashtag=${H}&department=${D}`, HASHTAG_PARAM, null)).toBe(`?department=${D}`);
    expect(withFilterParam(`?hashtag=${H}`, HASHTAG_PARAM, null)).toBe("");
  });

  it("produces a search the board parses back into feed filters", () => {
    const search = withFilterParam(`?department=${D}`, HASHTAG_PARAM, H);
    expect(parseKudosFilters(Object.fromEntries(new URLSearchParams(search)))).toEqual({
      hashtagId: H,
      departmentId: D,
    });
  });
});

describe("withFilterParam (department dropdown → feed query)", () => {
  it("adds the department and keeps the hashtag and unrelated params", () => {
    const params = new URLSearchParams(withFilterParam(`?hashtag=${H}&utm=x`, DEPARTMENT_PARAM, D));
    expect(params.get(DEPARTMENT_PARAM)).toBe(D);
    expect(params.get(HASHTAG_PARAM)).toBe(H);
    expect(params.get("utm")).toBe("x");
  });

  it("replaces a previously picked department", () => {
    const D2 = "44444444-4444-4444-8444-444444444444";
    expect(withFilterParam(`?department=${D}`, DEPARTMENT_PARAM, D2)).toBe(`?department=${D2}`);
  });

  it("removes only the department when the active option is clicked again", () => {
    expect(withFilterParam(`?hashtag=${H}&department=${D}`, DEPARTMENT_PARAM, null)).toBe(`?hashtag=${H}`);
    expect(withFilterParam(`?department=${D}`, DEPARTMENT_PARAM, null)).toBe("");
  });

  it("produces a search the board parses into a recipient-department filter", () => {
    const search = withFilterParam("", DEPARTMENT_PARAM, D);
    expect(parseKudosFilters(Object.fromEntries(new URLSearchParams(search)))).toEqual({ departmentId: D });
  });
});
