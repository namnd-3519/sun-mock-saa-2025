// Limits shared with the create_kudos RPC (backend/supabase/migrations/*_create_kudos_rpc.sql).
export const KUDOS_LIMITS = {
  contentMax: 5000,
  hashtagsMin: 1,
  hashtagsMax: 5,
  imagesMax: 5,
  anonymousNameMax: 50,
  titleMax: 100,
  profileSearchMax: 100,
} as const;

export const KUDOS_IMAGES_BUCKET = "kudos-images";
