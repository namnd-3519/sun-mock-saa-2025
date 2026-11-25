import { createBrowserClient } from "@supabase/ssr";
import { readSupabaseEnv } from "./supabase-env";

export function createSupabaseBrowserClient() {
  const { url, publishableKey } = readSupabaseEnv();
  return createBrowserClient(url, publishableKey);
}
