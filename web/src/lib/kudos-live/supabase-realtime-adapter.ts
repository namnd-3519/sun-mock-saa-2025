import type { KudosClient } from "@/lib/kudos/kudos-types";
import type { ChannelLike, RealtimeLike } from "./kudos-live-subscription";

/** Adapts a Supabase client to the minimal Realtime surface the Live board subscriptions use. */
export function realtimeOf(client: KudosClient): RealtimeLike {
  return {
    channel(name) {
      const channel = client.channel(name);
      // RealtimeChannel's overloaded `on` is wider than ChannelLike; only postgres_changes is used.
      return { channel: channel as unknown as ChannelLike, remove: () => void client.removeChannel(channel) };
    },
  };
}

/** Realtime must run as the signed-in user so RLS applies to change events. */
export async function authorizeRealtime(client: KudosClient): Promise<void> {
  const { data } = await client.auth.getSession();
  if (data.session) await client.realtime.setAuth(data.session.access_token);
}
