import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createServerCookieAdapter } from "./server-cookie-adapter";
import { readSupabaseEnv } from "./supabase-env";
import type { Database } from "./database.types";

export async function createSupabaseServerClient() {
  const { url, publishableKey } = readSupabaseEnv();
  const cookieStore = await cookies();
  return createServerClient<Database>(url, publishableKey, {
    cookies: createServerCookieAdapter(cookieStore),
  });
}
