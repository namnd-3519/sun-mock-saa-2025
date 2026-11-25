// Test double for KudosClient: records every builder call and resolves with a canned result.
// Used only by *.test.ts files.
import type { KudosClient } from "./kudos-types";

export type RecordedCall = { method: string; args: unknown[] };

type CannedResult = { data?: unknown; error?: unknown; count?: number | null };

export function createFakeKudosClient(result: CannedResult = {}) {
  const calls: RecordedCall[] = [];
  const settled = { data: result.data ?? null, error: result.error ?? null, count: result.count ?? null };

  const builder: object = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "then") {
          return (resolve: (value: unknown) => void) => resolve(settled);
        }
        return (...args: unknown[]) => {
          calls.push({ method: String(prop), args });
          return builder;
        };
      },
    },
  );

  const client = {
    from: (table: string) => {
      calls.push({ method: "from", args: [table] });
      return builder;
    },
    rpc: (fn: string, args?: unknown) => {
      calls.push({ method: "rpc", args: args === undefined ? [fn] : [fn, args] });
      return builder;
    },
    storage: {
      from: (bucket: string) => ({
        createSignedUrls: async (paths: string[], expiresIn: number) => {
          calls.push({ method: "createSignedUrls", args: [bucket, paths, expiresIn] });
          return settled;
        },
      }),
    },
  };

  return { client: client as unknown as KudosClient, calls };
}

export function methodsOf(calls: RecordedCall[]): string[] {
  return calls.map((call) => call.method);
}
