import { randomUUID } from "node:crypto";
import { adminClient, userIdOf } from "./admin";
import type { E2EUserKey } from "./e2e-users";

/** Unique text so a spec finds exactly its own kudos on a shared board. */
export function runMarker(label: string): string {
  return `e2e ${label} ${randomUUID().slice(0, 8)}`;
}

export async function hashtagByIndex(index: number): Promise<{ id: string; name: string }> {
  const { data, error } = await adminClient().from("hashtags").select("id, name").order("name");
  if (error || !data?.[index]) throw new Error(`hashtag #${index}: ${error?.message ?? "missing"}`);
  return data[index];
}

/** Inserts a kudos directly (service role); cleanup removes it with the e2e users' data. */
export async function seedKudos(opts: {
  from: E2EUserKey;
  to: E2EUserKey;
  content: string;
  hashtagId: string;
}): Promise<string> {
  const admin = adminClient();
  const { data, error } = await admin
    .from("kudos")
    .insert({
      sender_id: await userIdOf(opts.from),
      recipient_id: await userIdOf(opts.to),
      content: opts.content,
      title: "E2E",
    })
    .select("id")
    .single();
  if (error) throw new Error(`seed kudos: ${error.message}`);
  const link = await admin.from("kudos_hashtags").insert({ kudos_id: data.id, hashtag_id: opts.hashtagId });
  if (link.error) throw new Error(`seed kudos hashtag: ${link.error.message}`);
  return data.id;
}
