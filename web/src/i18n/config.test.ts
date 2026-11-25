import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_LABELS,
  resolveLocale,
} from "./config";

describe("locale config", () => {
  it("supports Vietnamese and English with Vietnamese as default", () => {
    expect([...LOCALES]).toEqual(["vi", "en"]);
    expect(DEFAULT_LOCALE).toBe("vi");
  });

  it("stores the choice in the NEXT_LOCALE cookie", () => {
    expect(LOCALE_COOKIE).toBe("NEXT_LOCALE");
  });

  it("labels locales with the codes shown in the language picker", () => {
    expect(LOCALE_LABELS).toEqual({ vi: "VN", en: "EN" });
  });

  it.each(["vi", "en"] as const)("keeps the supported locale %s", (locale) => {
    expect(resolveLocale(locale)).toBe(locale);
  });

  it.each([undefined, "", "fr", "EN", "vi-VN", "<script>"])(
    "falls back to the default for %j",
    (value) => {
      expect(resolveLocale(value)).toBe("vi");
    },
  );
});
