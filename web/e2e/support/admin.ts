import { randomBytes } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { E2E_USERS, RECEIVER_DEPARTMENT, type E2EUserKey } from "./e2e-users";
import { readLocalSupabaseEnv } from "./local-supabase-env";

export function adminClient(): SupabaseClient {
  const { url, serviceRoleKey } = readLocalSupabaseEnv();
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function fail(what: string, error: { message: string } | null): void {
  if (error) throw new Error(`${what}: ${error.message}`);
}

/** Fails fast when local Auth cannot do email/password sign-in (never edits config.toml). */
export async function assertEmailProviderEnabled(): Promise<void> {
  const { url, publishableKey } = readLocalSupabaseEnv();
  const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: publishableKey } });
  const settings = (await res.json()) as { external?: { email?: boolean } };
  if (!settings.external?.email) {
    throw new Error("Local Supabase Auth has the email provider disabled ([auth.email] enabled)");
  }
}

async function findUserId(admin: SupabaseClient, email: string): Promise<string | undefined> {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  fail("listUsers", error);
  return data.users.find((u) => u.email === email)?.id;
}

/** Creates or updates the user with a fresh random password; returns id and password. */
export async function upsertUser(key: E2EUserKey): Promise<{ id: string; password: string }> {
  const admin = adminClient();
  const { email, fullName } = E2E_USERS[key];
  const password = randomBytes(18).toString("base64url");
  const attrs = { password, email_confirm: true, user_metadata: { full_name: fullName } };
  let id = await findUserId(admin, email);
  if (id) {
    fail(`update ${key}`, (await admin.auth.admin.updateUserById(id, attrs)).error);
  } else {
    const created = await admin.auth.admin.createUser({ email, ...attrs });
    fail(`create ${key}`, created.error);
    id = created.data.user!.id;
  }
  let departmentId: string | null = null;
  if (key === "receiver") {
    const dept = await admin.from("departments").select("id").eq("code", RECEIVER_DEPARTMENT).single();
    fail("department", dept.error);
    departmentId = dept.data!.id as string;
  }
  const profile = { id, email, full_name: fullName, department_id: departmentId };
  fail(`profile ${key}`, (await admin.from("profiles").upsert(profile)).error);
  return { id, password };
}

/** Removes everything the suite wrote: kudos (likes/hashtags cascade), notifications, boxes. */
export async function cleanupE2EData(): Promise<void> {
  const admin = adminClient();
  const ids: string[] = [];
  for (const user of Object.values(E2E_USERS)) {
    const id = await findUserId(admin, user.email);
    if (id) ids.push(id);
  }
  if (ids.length === 0) return;
  const list = `(${ids.join(",")})`;
  const byUser = `sender_id.in.${list},recipient_id.in.${list}`;
  fail("kudos", (await admin.from("kudos").delete().or(byUser)).error);
  fail("likes", (await admin.from("kudos_likes").delete().in("user_id", ids)).error);
  fail("notifications", (await admin.from("notifications").delete().in("recipient_id", ids)).error);
  fail("secret boxes", (await admin.from("secret_boxes").delete().in("owner_id", ids)).error);
}

export async function userIdOf(key: E2EUserKey): Promise<string> {
  const id = await findUserId(adminClient(), E2E_USERS[key].email);
  if (!id) throw new Error(`E2E user ${key} missing; run the setup project`);
  return id;
}
