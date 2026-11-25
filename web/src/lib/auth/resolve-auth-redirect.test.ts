import { describe, expect, it } from "vitest";
import { resolveAuthRedirect } from "./resolve-auth-redirect";

describe("resolveAuthRedirect", () => {
  it("sends a signed-out visitor of a protected page to login with next", () => {
    expect(
      resolveAuthRedirect({ pathname: "/todo", search: "?a=1", isSignedIn: false }),
    ).toBe("/login?next=%2Ftodo%3Fa%3D1");
  });

  it("omits next for the site root", () => {
    expect(
      resolveAuthRedirect({ pathname: "/", search: "", isSignedIn: false }),
    ).toBe("/login");
  });

  it("lets a signed-out visitor see the login page", () => {
    expect(
      resolveAuthRedirect({ pathname: "/login", search: "", isSignedIn: false }),
    ).toBeNull();
  });

  it("sends a signed-in visitor of login to the after-login page", () => {
    expect(
      resolveAuthRedirect({ pathname: "/login", search: "", isSignedIn: true }),
    ).toBe("/todo");
  });

  it("sends a signed-in visitor of login to a safe next path", () => {
    expect(
      resolveAuthRedirect({
        pathname: "/login",
        search: "?next=%2Fkudos",
        isSignedIn: true,
      }),
    ).toBe("/kudos");
    expect(
      resolveAuthRedirect({
        pathname: "/login",
        search: "?next=https%3A%2F%2Fevil.example",
        isSignedIn: true,
      }),
    ).toBe("/todo");
  });

  it("never redirects auth routes", () => {
    for (const isSignedIn of [true, false]) {
      expect(
        resolveAuthRedirect({ pathname: "/auth/callback", search: "?code=x", isSignedIn }),
      ).toBeNull();
    }
  });

  it("lets a signed-in visitor through to protected pages", () => {
    expect(
      resolveAuthRedirect({ pathname: "/todo", search: "", isSignedIn: true }),
    ).toBeNull();
  });
});
