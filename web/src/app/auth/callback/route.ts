import { NextResponse, type NextRequest } from "next/server";
import { handleOAuthCallback } from "@/lib/auth/handle-oauth-callback";
import { createSupabaseServerClient } from "@/lib/supabase/create-supabase-server-client";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const target = await handleOAuthCallback(request.nextUrl, (code) =>
    supabase.auth.exchangeCodeForSession(code),
  );
  return NextResponse.redirect(new URL(target, request.url));
}
