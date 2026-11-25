import { describe, expect, it } from "vitest";
import {
  hasActiveFilters,
  kudosFiltersKey,
  kudosFiltersToSearch,
  parseKudosFilters,
  withHashtagFilter,
} from "./kudos-filters";

const H = "11111111-1111-4111-8111-111111111111";
const D = "22222222-2222-4222-8222-222222222222";

describe("parseKudosFilters", () => {
  it("reads hashtag and department uuids", () => {
    expect(parseKudosFilters({ hashtag: H, department: D })).toEqual({ hashtagId: H, departmentId: D });
  });

  it("ignores junk, arrays and missing values", () => {
    expect(parseKudosFilters({ hashtag: "drop table", department: [D, D] })).toEqual({});
    expect(parseKudosFilters({})).toEqual({});
  });
});

describe("filter helpers", () => {
  it("builds a search string in a stable order", () => {
    expect(kudosFiltersToSearch({ departmentId: D, hashtagId: H })).toBe(`?hashtag=${H}&department=${D}`);
    expect(kudosFiltersToSearch({})).toBe("");
  });

  it("sets the hashtag and keeps the department", () => {
    expect(withHashtagFilter({ departmentId: D }, H)).toEqual({ departmentId: D, hashtagId: H });
  });

  it("detects active filters and keys them", () => {
    expect(hasActiveFilters({})).toBe(false);
    expect(hasActiveFilters({ hashtagId: H })).toBe(true);
    expect(kudosFiltersKey({ hashtagId: H })).not.toBe(kudosFiltersKey({}));
  });
});
