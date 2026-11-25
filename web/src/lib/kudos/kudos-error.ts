export type KudosErrorCode =
  | "not_authenticated"
  | "invalid_recipient"
  | "invalid_content"
  | "invalid_hashtags"
  | "invalid_images"
  | "invalid_anonymous_name"
  | "invalid_title"
  | "invalid_search"
  | "already_liked"
  | "forbidden"
  | "no_unopened_box"
  | "unknown";

const MESSAGE_CODES: Record<string, KudosErrorCode> = {
  "kudos.not_authenticated": "not_authenticated",
  "kudos.invalid_recipient": "invalid_recipient",
  "kudos.invalid_content": "invalid_content",
  "kudos.invalid_hashtags": "invalid_hashtags",
  "kudos.invalid_images": "invalid_images",
  "kudos.invalid_anonymous_name": "invalid_anonymous_name",
  "kudos.invalid_title": "invalid_title",
  "secret_box.not_authenticated": "not_authenticated",
  "secret_box.none_unopened": "no_unopened_box",
};

export class KudosDataError extends Error {
  readonly code: KudosErrorCode;

  constructor(code: KudosErrorCode, message?: string) {
    super(message ?? code);
    this.name = "KudosDataError";
    this.code = code;
  }
}

type PostgrestLikeError = { code?: string; message?: string };

/** Maps a PostgREST/Postgres error to a typed KudosDataError. */
export function toKudosDataError(error: PostgrestLikeError): KudosDataError {
  const message = error.message ?? "";
  const mapped = MESSAGE_CODES[message];
  if (mapped) return new KudosDataError(mapped, message);
  if (error.code === "23505") return new KudosDataError("already_liked", message);
  if (error.code === "42501") return new KudosDataError("forbidden", message);
  return new KudosDataError("unknown", message || "Unknown data error");
}

/** Throws a KudosDataError when a Supabase response carries an error. */
export function throwIfError(error: PostgrestLikeError | null): void {
  if (error) throw toKudosDataError(error);
}
