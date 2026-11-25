import type { KudosFilters } from "@/lib/kudos/kudos-types";

// Live board filters live in the URL: /kudos?hashtag=<uuid>&department=<uuid>.
// The Hashtag (#13) and Phòng ban (#14) dropdowns only need to push these params.
export const HASHTAG_PARAM = "hashtag";
export const DEPARTMENT_PARAM = "department";

type SearchParams = Record<string, string | string[] | undefined>;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function uuidParam(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && UUID.test(value) ? value : undefined;
}

export function parseKudosFilters(params: SearchParams): KudosFilters {
  const filters: KudosFilters = {};
  const hashtagId = uuidParam(params[HASHTAG_PARAM]);
  const departmentId = uuidParam(params[DEPARTMENT_PARAM]);
  if (hashtagId) filters.hashtagId = hashtagId;
  if (departmentId) filters.departmentId = departmentId;
  return filters;
}

export function kudosFiltersToSearch(filters: KudosFilters): string {
  const params = new URLSearchParams();
  if (filters.hashtagId) params.set(HASHTAG_PARAM, filters.hashtagId);
  if (filters.departmentId) params.set(DEPARTMENT_PARAM, filters.departmentId);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function withHashtagFilter(filters: KudosFilters, hashtagId: string): KudosFilters {
  return { ...filters, hashtagId };
}

export function hasActiveFilters(filters: KudosFilters): boolean {
  return Boolean(filters.hashtagId || filters.departmentId);
}

/** Stable key for effects and React keys that must reset when the filters change. */
export function kudosFiltersKey(filters: KudosFilters): string {
  return `${filters.hashtagId ?? ""}|${filters.departmentId ?? ""}`;
}
