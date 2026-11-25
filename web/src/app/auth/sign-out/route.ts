import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_PATH } from "@/lib/auth/auth-paths";
import { createSupabaseServerClient } from "@/lib/supabase/create-supabase-server-client";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  // Clears the session cookies even when the token is already invalid.
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL(LOGIN_PATH, request.url), 303);
}
