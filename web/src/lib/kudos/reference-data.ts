import { KudosDataError, throwIfError } from "./kudos-error";
import { KUDOS_LIMITS } from "./kudos-limits";
import type { Department, Hashtag, KudosClient, ProfileSearchResult } from "./kudos-types";

export async function listHashtags(client: KudosClient): Promise<Hashtag[]> {
  const { data, error } = await client.from("hashtags").select("id, name").order("name");
  throwIfError(error);
  return data ?? [];
}

export async function listDepartments(client: KudosClient): Promise<Department[]> {
  const { data, error } = await client.from("departments").select("id, code").order("code");
  throwIfError(error);
  return data ?? [];
}

/** Escapes LIKE wildcards so user input matches literally. */
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

/** Sunner search by name (recipient picker, Spotlight search). Never selects email. */
export async function searchProfiles(
  client: KudosClient,
  query: string,
  limit = 10,
): Promise<ProfileSearchResult[]> {
  const term = query.trim();
  if (term.length > KUDOS_LIMITS.profileSearchMax) throw new KudosDataError("invalid_search");
  if (!term) return [];
  const { data, error } = await client
    .from("profiles")
    .select("id, full_name, avatar_url, department_id")
    .ilike("full_name", `%${escapeLikePattern(term)}%`)
    .order("full_name")
    .limit(limit);
  throwIfError(error);
  return (data ?? []).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    departmentId: row.department_id,
  }));
}
