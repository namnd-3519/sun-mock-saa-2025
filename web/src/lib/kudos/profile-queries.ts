import { throwIfError } from "./kudos-error";
import { cursorFilter, toKudosPage } from "./kudos-queries";
import { mapKudosRow } from "./map-kudos-row";
import type { KudosClient, KudosCursor, KudosPage } from "./kudos-types";

/** Profile "KUDOS" dropdown (C.3): kudos the owner received or sent. */
export type ProfileKudosBox = "received" | "sent";

export const PROFILE_KUDOS_BOXES: readonly ProfileKudosBox[] = ["received", "sent"];

export type ProfileSummary = {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  departmentCode: string | null;
};

/** Profile owner block (A): name, avatar and department code; null when there is no profile. */
export async function getProfileSummary(
  client: KudosClient,
  userId: string,
): Promise<ProfileSummary | null> {
  const { data, error } = await client
    .from("profiles")
    .select("id, full_name, avatar_url, department:departments(code)")
    .eq("id", userId)
    .maybeSingle();
  throwIfError(error);
  if (!data) return null;
  return {
    id: data.id,
    fullName: data.full_name,
    avatarUrl: data.avatar_url,
    departmentCode: data.department?.code ?? null,
  };
}

/**
 * Kudos a Sunner received or sent, newest first, keyset paginated.
 * Reads the masking `kudos_feed` view: `sender_id` is null on anonymous kudos unless the viewer
 * sent them, so "sent" lists anonymous kudos only to their sender and "received" never
 * reveals who sent an anonymous kudos.
 */
export async function listProfileKudos(
  client: KudosClient,
  options: { userId: string; box: ProfileKudosBox; cursor?: KudosCursor | null; limit?: number },
): Promise<KudosPage> {
  const limit = options.limit ?? 10;
  const column = options.box === "sent" ? "sender_id" : "recipient_id";
  let query = client.from("kudos_feed").select("*").eq(column, options.userId);
  if (options.cursor) query = query.or(cursorFilter(options.cursor));
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit);
  throwIfError(error);
  return toKudosPage((data ?? []).map(mapKudosRow), limit);
}
