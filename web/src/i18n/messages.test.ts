import { describe, expect, it } from "vitest";
import { LOCALES } from "./config";
import { getMessages } from "./messages";

describe("getMessages", () => {
  it("returns the Vietnamese login copy from the spec", () => {
    const m = getMessages("vi");
    expect(m.login.subtitle).toBe("Bắt đầu hành trình của bạn cùng SAA 2025.");
    expect(m.login.tagline).toBe("Đăng nhập để khám phá!");
    expect(m.login.error).toBe("Đăng nhập không thành công. Vui lòng thử lại.");
    expect(m.footer.copyright).toBe("Bản quyền thuộc về Sun* © 2025");
  });

  it("returns the English copy", () => {
    const m = getMessages("en");
    expect(m.login.subtitle).toBe("Start your journey with SAA 2025.");
    expect(m.login.tagline).toBe("Log in to explore!");
    expect(m.login.error).toBe("Login failed. Please try again.");
    expect(m.footer.copyright).toBe("Copyright belongs to Sun* © 2025");
  });

  it("returns the countdown title from the spec in both languages", () => {
    expect(getMessages("vi").countdown.title).toBe("Sự kiện sẽ bắt đầu sau");
    expect(getMessages("en").countdown.title).toBe("Event starts in");
    expect(getMessages("en").countdown.days).toBe("DAYS");
  });

  it("keeps the brand button label identical in every language", () => {
    for (const locale of LOCALES) {
      expect(getMessages(locale).login.button).toBe("LOGIN With Google");
    }
  });

  it("has the same keys in every language and no empty text", () => {
    const flatten = (o: object, prefix = ""): [string, string][] =>
      Object.entries(o).flatMap(([k, v]) =>
        typeof v === "string"
          ? [[`${prefix}${k}`, v] as [string, string]]
          : flatten(v, `${prefix}${k}.`),
      );
    const [first, ...rest] = LOCALES.map((l) => flatten(getMessages(l)));
    for (const other of rest) {
      expect(other.map(([k]) => k)).toEqual(first.map(([k]) => k));
    }
    for (const entries of [first, ...rest]) {
      for (const [key, value] of entries) {
        expect(value.trim(), key).not.toBe("");
      }
    }
  });
});
