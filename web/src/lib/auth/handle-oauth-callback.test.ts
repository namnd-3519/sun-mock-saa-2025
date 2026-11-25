import { describe, expect, it, vi } from "vitest";
import { handleOAuthCallback, LOGIN_ERROR_PATH } from "./handle-oauth-callback";

const url = (query: string) => new URL(`http://localhost:3000/auth/callback${query}`);

describe("handleOAuthCallback", () => {
  it("exchanges the code and goes to the after-login page", async () => {
    const exchange = vi.fn().mockResolvedValue({ error: null });
    await expect(handleOAuthCallback(url("?code=abc"), exchange)).resolves.toBe("/todo");
    expect(exchange).toHaveBeenCalledWith("abc");
  });

  it("goes to a safe next path after a successful exchange", async () => {
    const exchange = vi.fn().mockResolvedValue({ error: null });
    await expect(
      handleOAuthCallback(url("?code=abc&next=%2Fkudos"), exchange),
    ).resolves.toBe("/kudos");
    await expect(
      handleOAuthCallback(url("?code=abc&next=%2F%2Fevil.example"), exchange),
    ).resolves.toBe("/todo");
  });

  it("returns to login with an error when the user cancelled", async () => {
    const exchange = vi.fn();
    await expect(
      handleOAuthCallback(
        url("?error=access_denied&error_description=cancelled"),
        exchange,
      ),
    ).resolves.toBe(LOGIN_ERROR_PATH);
    expect(exchange).not.toHaveBeenCalled();
  });

  it("returns to login with an error when the code is missing", async () => {
    const exchange = vi.fn();
    await expect(handleOAuthCallback(url(""), exchange)).resolves.toBe(LOGIN_ERROR_PATH);
    expect(exchange).not.toHaveBeenCalled();
  });

  it("returns to login with an error when the exchange fails", async () => {
    const failing = vi.fn().mockResolvedValue({ error: new Error("bad code") });
    await expect(handleOAuthCallback(url("?code=x"), failing)).resolves.toBe(
      LOGIN_ERROR_PATH,
    );
    const throwing = vi.fn().mockRejectedValue(new Error("network"));
    await expect(handleOAuthCallback(url("?code=x"), throwing)).resolves.toBe(
      LOGIN_ERROR_PATH,
    );
  });

  it("points the error path at the login page", () => {
    expect(LOGIN_ERROR_PATH).toBe("/login?error=oauth");
  });
});
