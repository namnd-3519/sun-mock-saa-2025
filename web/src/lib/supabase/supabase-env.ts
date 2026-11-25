export type SupabaseEnv = { url: string; publishableKey: string };

type RawSupabaseEnv = { url?: string; publishableKey?: string };

// NEXT_PUBLIC_* values are inlined at build time only when referenced literally.
const processEnv: RawSupabaseEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export function readSupabaseEnv(raw: RawSupabaseEnv = processEnv): SupabaseEnv {
  const url = raw.url?.trim() ?? "";
  const publishableKey = raw.publishableKey?.trim() ?? "";

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL (see web/.env.example)");
  }
  if (!isHttpUrl(url)) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be an http(s) URL");
  }
  if (!publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see web/.env.example)",
    );
  }
  return { url, publishableKey };
}
