import { createBrowserClient } from "@supabase/ssr";
import { readSupabaseEnv } from "./supabase-env";
import type { Database } from "./database.types";

export function createSupabaseBrowserClient() {
  const { url, publishableKey } = readSupabaseEnv();
  return createBrowserClient<Database>(url, publishableKey);
}
