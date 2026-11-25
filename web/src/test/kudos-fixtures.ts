import type { ChangePayload, ChannelLike, RealtimeLike } from "@/lib/kudos-live/kudos-live-subscription";
import type { KudosCardView } from "@/lib/kudos-live/kudos-card-view";
import type { PersonSummary } from "@/lib/kudos/kudos-types";

export function makePerson(overrides: Partial<PersonSummary> = {}): PersonSummary {
  return {
    id: "user-recipient",
    fullName: "Tran Thi B",
    avatarUrl: null,
    departmentCode: "CEVC2",
    kudosReceivedCount: 3,
    ...overrides,
  };
}

export function makeCard(overrides: Partial<KudosCardView> = {}): KudosCardView {
  return {
    id: "kudos-1",
    createdAt: "2025-10-30T03:00:00.000Z",
    content: "Thanks for the help!",
    title: null,
    isAnonymous: false,
    anonymousName: null,
    isMine: false,
    sender: makePerson({ id: "user-sender", fullName: "Nguyen Van A", departmentCode: "CEVC1" }),
    recipient: makePerson(),
    hashtags: [],
    imagePaths: [],
    imageUrls: [],
    likeCount: 2,
    likedByMe: false,
    ...overrides,
  };
}

type Handler = (payload: ChangePayload) => void;

/** In-memory Realtime: tests emit change events and join channels by name. */
export function createFakeRealtime() {
  const channels = new Map<string, { handlers: Handler[]; onStatus?: (status: string) => void; removed: boolean }>();
  const realtime: RealtimeLike = {
    channel(name) {
      const entry = { handlers: [] as Handler[], onStatus: undefined as ((s: string) => void) | undefined, removed: false };
      channels.set(name, entry);
      const channel: ChannelLike = {
        on(_type, _filter, handler) {
          entry.handlers.push(handler);
          return channel;
        },
        subscribe(callback) {
          entry.onStatus = callback;
          return channel;
        },
      };
      return { channel, remove: () => void (entry.removed = true) };
    },
  };
  const live = (prefix: string) => [...channels.entries()].filter(([name, c]) => name.startsWith(prefix) && !c.removed);
  return {
    realtime,
    emit(prefix: string, payload: ChangePayload) {
      live(prefix).forEach(([, c]) => c.handlers.forEach((handler) => handler(payload)));
    },
    join(prefix: string) {
      live(prefix).forEach(([, c]) => c.onStatus?.("SUBSCRIBED"));
    },
    isOpen: (prefix: string) => live(prefix).length > 0,
  };
}
