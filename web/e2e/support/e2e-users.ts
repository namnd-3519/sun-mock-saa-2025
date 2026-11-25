import path from "node:path";

export type E2EUserKey = "sender" | "receiver" | "signout";

export type E2EUser = { key: E2EUserKey; email: string; fullName: string };

// Reserved test-only domain (RFC 2606); these accounts exist only in local Supabase.
export const E2E_USERS: Record<E2EUserKey, E2EUser> = {
  sender: { key: "sender", email: "e2e-sender@example.test", fullName: "E2E Sender" },
  receiver: { key: "receiver", email: "e2e-receiver@example.test", fullName: "E2E Receiver" },
  signout: { key: "signout", email: "e2e-signout@example.test", fullName: "E2E Signout" },
};

// Department given to the receiver so the board's department filter has a known match.
export const RECEIVER_DEPARTMENT = "CTO";

export function storageStatePath(key: E2EUserKey): string {
  return path.resolve(__dirname, "../.auth", `${key}.json`);
}
