import { describe, expect, it, vi } from "vitest";
import { startGoogleSignIn, type OAuthClient } from "./start-google-sign-in";

function fakeClient(error: unknown = null) {
  const signInWithOAuth = vi.fn().mockResolvedValue({ data: {}, error });
  return { client: { auth: { signInWithOAuth } } as OAuthClient, signInWithOAuth };
}

describe("startGoogleSignIn", () => {
  it("starts the Google flow returning to the callback route", async () => {
    const { client, signInWithOAuth } = fakeClient();
    await startGoogleSignIn({ client, origin: "http://localhost:3000" });
    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: "http://localhost:3000/auth/callback" },
    });
  });

  it("carries a safe next path through the callback", async () => {
    const { client, signInWithOAuth } = fakeClient();
    await startGoogleSignIn({ client, origin: "http://x", next: "/kudos?a=1" });
    expect(signInWithOAuth.mock.calls[0][0].options.redirectTo).toBe(
      "http://x/auth/callback?next=%2Fkudos%3Fa%3D1",
    );
  });

  it("drops an unsafe next path", async () => {
    const { client, signInWithOAuth } = fakeClient();
    await startGoogleSignIn({ client, origin: "http://x", next: "//evil.example" });
    expect(signInWithOAuth.mock.calls[0][0].options.redirectTo).toBe(
      "http://x/auth/callback",
    );
  });

  it("throws when Supabase refuses to start the flow", async () => {
    const { client } = fakeClient(new Error("provider is not enabled"));
    await expect(startGoogleSignIn({ client, origin: "http://x" })).rejects.toThrow();
  });
});
