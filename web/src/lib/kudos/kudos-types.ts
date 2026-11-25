import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type KudosClient = SupabaseClient<Database>;

export type SecretBadge = Database["public"]["Enums"]["secret_badge"];

export type Department = { id: string; code: string };

export type Hashtag = { id: string; name: string };

export type PersonSummary = {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  departmentCode: string | null;
  kudosReceivedCount: number;
};

export type KudosCard = {
  id: string;
  createdAt: string;
  content: string;
  title: string | null;
  isAnonymous: boolean;
  anonymousName: string | null;
  /** True when the signed-in user sent this kudos (they cannot like it). */
  isMine: boolean;
  /** Null when the kudos is anonymous and the viewer is not the sender. */
  sender: PersonSummary | null;
  recipient: PersonSummary;
  hashtags: Hashtag[];
  imagePaths: string[];
  likeCount: number;
  likedByMe: boolean;
};

export type KudosFilters = { hashtagId?: string; departmentId?: string };

export type KudosCursor = { createdAt: string; id: string };

export type KudosPage = { items: KudosCard[]; nextCursor: KudosCursor | null };

export type CreateKudosInput = {
  recipientId: string;
  content: string;
  hashtagIds: string[];
  imagePaths?: string[];
  isAnonymous?: boolean;
  anonymousName?: string | null;
  title?: string | null;
};

export type KudosStats = {
  kudosReceived: number;
  kudosSent: number;
  heartsReceived: number;
  boxesOpened: number;
  boxesUnopened: number;
};

export type ProfileSearchResult = {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  departmentId: string | null;
};

export type OpenedBox = { boxId: string; badge: SecretBadge };

export type GiftReceiver = {
  boxId: string;
  badge: SecretBadge;
  openedAt: string;
  owner: { id: string; fullName: string | null; avatarUrl: string | null } | null;
};
