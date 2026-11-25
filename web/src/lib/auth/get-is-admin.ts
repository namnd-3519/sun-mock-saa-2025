import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/create-supabase-server-client";
import { isAdmin } from "./is-admin";

/** Reads the verified JWT claims of the current request's user (server only). */
export async function getIsAdmin(): Promise<boolean> {
  // getClaims reads the clock to check expiry, so render this at request time.
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  return isAdmin(data?.claims);
}
