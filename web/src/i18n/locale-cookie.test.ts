import { describe, expect, it } from "vitest";
import { buildLocaleCookie } from "./locale-cookie";

describe("buildLocaleCookie", () => {
  it("writes NEXT_LOCALE for the whole site with a one year lifetime", () => {
    expect(buildLocaleCookie("en")).toBe(
      "NEXT_LOCALE=en; Path=/; Max-Age=31536000; SameSite=Lax",
    );
  });

  it("writes the Vietnamese choice too", () => {
    expect(buildLocaleCookie("vi")).toContain("NEXT_LOCALE=vi;");
  });
});
