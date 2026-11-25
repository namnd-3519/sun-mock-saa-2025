import { throwIfError } from "./kudos-error";
import { mapKudosRow } from "./map-kudos-row";
import type { KudosCard, KudosClient, KudosCursor, KudosFilters, KudosPage } from "./kudos-types";

const FEED = "kudos_feed";

type FilterableQuery<Q> = {
  contains(column: string, value: string[]): Q;
  eq(column: string, value: string): Q;
};

/** Applies the Live board filters: hashtag, and the recipient's department. */
export function applyKudosFilters<Q extends FilterableQuery<Q>>(query: Q, filters: KudosFilters): Q {
  let next = query;
  if (filters.hashtagId) next = next.contains("hashtag_ids", [filters.hashtagId]);
  if (filters.departmentId) next = next.eq("recipient_department_id", filters.departmentId);
  return next;
}

/** PostgREST `or` filter for keyset pagination on (created_at desc, id desc). */
export function cursorFilter(cursor: KudosCursor): string {
  const at = JSON.stringify(cursor.createdAt);
  const id = JSON.stringify(cursor.id);
  return `created_at.lt.${at},and(created_at.eq.${at},id.lt.${id})`;
}

/** All Kudos feed, newest first, for infinite scroll. */
export async function listKudosFeed(
  client: KudosClient,
  options: { filters?: KudosFilters; cursor?: KudosCursor | null; limit?: number } = {},
): Promise<KudosPage> {
  const limit = options.limit ?? 20;
  let query = applyKudosFilters(client.from(FEED).select("*"), options.filters ?? {});
  if (options.cursor) query = query.or(cursorFilter(options.cursor));
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit);
  throwIfError(error);
  return toKudosPage((data ?? []).map(mapKudosRow), limit);
}

/** A page of cards with the keyset cursor of its last item; null once a page comes back short. */
export function toKudosPage(items: KudosCard[], limit: number): KudosPage {
  const last = items.at(-1);
  const nextCursor =
    items.length === limit && last ? { createdAt: last.createdAt, id: last.id } : null;
  return { items, nextCursor };
}

/** Highlight carousel: the most liked kudos (top 5 by default). */
export async function listHighlightKudos(
  client: KudosClient,
  filters: KudosFilters = {},
  limit = 5,
): Promise<KudosCard[]> {
  const { data, error } = await applyKudosFilters(client.from(FEED).select("*"), filters)
    .order("like_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  throwIfError(error);
  return (data ?? []).map(mapKudosRow);
}

/** Total kudos (Spotlight "388 KUDOS"). */
export async function countKudos(client: KudosClient, filters: KudosFilters = {}): Promise<number> {
  const { count, error } = await applyKudosFilters(
    client.from(FEED).select("id", { count: "exact", head: true }),
    filters,
  );
  throwIfError(error);
  return count ?? 0;
}

/** One kudos through the masking feed; with filters, null when it does not match them. */
export async function getKudosById(
  client: KudosClient,
  id: string,
  filters: KudosFilters = {},
): Promise<KudosCard | null> {
  const { data, error } = await applyKudosFilters(client.from(FEED).select("*"), filters)
    .eq("id", id)
    .maybeSingle();
  throwIfError(error);
  return data ? mapKudosRow(data) : null;
}

/** Current like count and the viewer's like, refetched when a Realtime like event arrives. */
export async function getKudosLikeState(
  client: KudosClient,
  id: string,
): Promise<Pick<KudosCard, "likeCount" | "likedByMe"> | null> {
  const { data, error } = await client
    .from(FEED)
    .select("like_count, liked_by_me")
    .eq("id", id)
    .maybeSingle();
  throwIfError(error);
  return data ? { likeCount: data.like_count ?? 0, likedByMe: data.liked_by_me === true } : null;
}
