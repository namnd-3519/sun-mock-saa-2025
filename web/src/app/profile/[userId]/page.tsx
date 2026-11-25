import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { PROFILE_PATH } from "@/lib/auth/auth-paths";
import { createSupabaseServerClient } from "@/lib/supabase/create-supabase-server-client";

export const instant = false;

// Kudos cards link people to /profile/{id}. MoMorph only designs the own profile (3FoIx6ALVb),
// so the signed-in user's id redirects there and other users 404 until their screen exists.
export default async function UserProfilePage({ params }: PageProps<"/profile/[userId]">) {
  const { userId } = await params;
  await connection();
  const client = await createSupabaseServerClient();
  const { data } = await client.auth.getClaims();
  if (data?.claims.sub === userId) redirect(PROFILE_PATH);
  notFound();
}
