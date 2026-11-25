import type { Database, Json } from "@/lib/supabase/database.types";
import type { Hashtag, KudosCard, PersonSummary } from "./kudos-types";

export type KudosFeedRow = Database["public"]["Views"]["kudos_feed"]["Row"];

type JsonObject = { [key: string]: Json | undefined };

function asObject(value: Json | null | undefined): JsonObject | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function asString(value: Json | undefined): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: Json | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function mapPerson(value: Json | null | undefined): PersonSummary | null {
  const person = asObject(value);
  const id = asString(person?.id);
  if (!person || !id) return null;
  return {
    id,
    fullName: asString(person.full_name),
    avatarUrl: asString(person.avatar_url),
    departmentCode: asString(person.department_code),
    kudosReceivedCount: asNumber(person.kudos_received_count),
  };
}

function mapHashtags(value: Json | null): Hashtag[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const tag = asObject(item);
    const id = asString(tag?.id);
    const name = asString(tag?.name);
    return id && name ? [{ id, name }] : [];
  });
}

/** Maps one kudos_feed view row to the card model the screens render. */
export function mapKudosRow(row: KudosFeedRow): KudosCard {
  const recipient = mapPerson(row.recipient) ?? {
    id: row.recipient_id,
    fullName: null,
    avatarUrl: null,
    departmentCode: null,
    kudosReceivedCount: 0,
  };
  return {
    id: row.id,
    createdAt: row.created_at,
    content: row.content,
    title: row.title,
    isAnonymous: row.is_anonymous,
    anonymousName: row.anonymous_name,
    isMine: row.is_mine === true,
    sender: mapPerson(row.sender),
    recipient,
    hashtags: mapHashtags(row.hashtags),
    imagePaths: row.image_paths ?? [],
    likeCount: row.like_count ?? 0,
    likedByMe: row.liked_by_me === true,
  };
}
