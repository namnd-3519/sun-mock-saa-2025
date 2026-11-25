import { describe, expect, it } from "vitest";
import { KudosDataError, throwIfError, toKudosDataError } from "./kudos-error";
import { starsForReceivedCount } from "./kudos-stars";

describe("toKudosDataError", () => {
  it("maps RPC messages to codes", () => {
    expect(toKudosDataError({ code: "22023", message: "kudos.invalid_hashtags" }).code).toBe("invalid_hashtags");
    expect(toKudosDataError({ code: "P0002", message: "secret_box.none_unopened" }).code).toBe("no_unopened_box");
  });

  it("maps unique violations and permission errors", () => {
    expect(toKudosDataError({ code: "23505", message: "duplicate key" }).code).toBe("already_liked");
    expect(toKudosDataError({ code: "42501", message: "new row violates row-level security" }).code).toBe("forbidden");
  });

  it("falls back to unknown", () => {
    const error = toKudosDataError({});
    expect(error).toBeInstanceOf(KudosDataError);
    expect(error.code).toBe("unknown");
  });

  it("throwIfError only throws on an error", () => {
    expect(() => throwIfError(null)).not.toThrow();
    expect(() => throwIfError({ message: "kudos.invalid_content" })).toThrow(KudosDataError);
  });
});

describe("starsForReceivedCount", () => {
  it.each([
    [0, 0],
    [9, 0],
    [10, 1],
    [19, 1],
    [20, 2],
    [49, 2],
    [50, 3],
    [500, 3],
  ])("%i received kudos -> %i stars", (received, stars) => {
    expect(starsForReceivedCount(received)).toBe(stars);
  });
});
