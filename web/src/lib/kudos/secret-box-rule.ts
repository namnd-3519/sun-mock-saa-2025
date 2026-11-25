import type { KudosErrorCode } from "./kudos-error";
import type { SecretBadge } from "./kudos-types";

/**
 * Client-side mirror of the `open_secret_box()` RPC rule (Open secret box J3-4YFIpMM): a box can be
 * opened while the user has unopened boxes. The server stays the authority; this only drives the UI.
 */
export type SecretBoxState = {
  unopened: number;
  phase: "idle" | "opening" | "opened" | "error";
  badge: SecretBadge | null;
  error: KudosErrorCode | null;
};

export type SecretBoxAction =
  | { type: "start" }
  | { type: "success"; badge: SecretBadge }
  | { type: "failure"; code: KudosErrorCode };

export function initialSecretBoxState(unopened: number | null | undefined): SecretBoxState {
  return { unopened: Math.max(0, unopened ?? 0), phase: "idle", badge: null, error: null };
}

export function canOpenSecretBox(state: SecretBoxState): boolean {
  return state.phase !== "opening" && state.unopened > 0;
}

export function secretBoxReducer(state: SecretBoxState, action: SecretBoxAction): SecretBoxState {
  switch (action.type) {
    case "start":
      return { ...state, phase: "opening", badge: null, error: null };
    case "success":
      return { unopened: Math.max(0, state.unopened - 1), phase: "opened", badge: action.badge, error: null };
    case "failure":
      // `secret_box.none_unopened`: the last box was opened elsewhere (another tab); none left here.
      return {
        unopened: action.code === "no_unopened_box" ? 0 : state.unopened,
        phase: "error",
        badge: null,
        error: action.code,
      };
  }
}

/** D "số box chưa mở": two digits as in the design ("05"). */
export function formatUnopenedCount(count: number): string {
  return String(Math.max(0, count)).padStart(2, "0");
}
