import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GoogleLoginButton } from "./google-login-button";
import { startGoogleSignIn } from "./start-google-sign-in";

vi.mock("./start-google-sign-in", () => ({ startGoogleSignIn: vi.fn() }));

const signIn = vi.mocked(startGoogleSignIn);
const props = { label: "LOGIN With Google", loadingLabel: "Signing in...", errorMessage: "Login failed" };

describe("GoogleLoginButton", () => {
  beforeEach(() => {
    signIn.mockReset();
  });

  it("starts Google sign-in with the next path and stays busy while leaving", async () => {
    signIn.mockReturnValue(new Promise(() => undefined));
    render(<GoogleLoginButton {...props} next="/kudos" />);
    await userEvent.click(screen.getByRole("button", { name: props.label }));
    const button = screen.getByRole("button", { name: props.loadingLabel });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(signIn).toHaveBeenCalledWith({ next: "/kudos" });
    expect(screen.getByRole("alert")).toBeEmptyDOMElement();
  });

  it("shows the error and re-enables the button when sign-in fails", async () => {
    signIn.mockRejectedValueOnce(new Error("refused"));
    render(<GoogleLoginButton {...props} />);
    await userEvent.click(screen.getByRole("button", { name: props.label }));
    expect(await screen.findByText(props.errorMessage)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: props.label })).toBeEnabled();
  });

  it("shows the error from the callback on first render", () => {
    render(<GoogleLoginButton {...props} initialError />);
    expect(screen.getByRole("alert")).toHaveTextContent(props.errorMessage);
  });
});
