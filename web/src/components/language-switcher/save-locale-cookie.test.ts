import { afterEach, describe, expect, it, vi } from "vitest";
import { saveLocaleCookie } from "./save-locale-cookie";

describe("saveLocaleCookie", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("writes the NEXT_LOCALE cookie for the chosen locale", () => {
    const fakeDocument = { cookie: "" };
    vi.stubGlobal("document", fakeDocument);
    saveLocaleCookie("en");
    expect(fakeDocument.cookie).toBe(
      "NEXT_LOCALE=en; Path=/; Max-Age=31536000; SameSite=Lax",
    );
  });
});
