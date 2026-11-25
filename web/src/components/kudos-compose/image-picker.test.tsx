import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { writeKudosEn as m } from "@/i18n/write-kudos-messages";
import { WriteKudosForm } from "./write-kudos-form";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/lib/supabase/create-supabase-browser-client", () => ({ createSupabaseBrowserClient: () => ({}) }));

const png = (name: string) => new File(["x"], name, { type: "image/png" });

function renderForm() {
  const { container } = render(<WriteKudosForm senderId="u1" hashtags={[]} messages={m} />);
  return container.querySelector('input[type="file"]') as HTMLInputElement;
}

describe("Write Kudos image picker", () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn((file: Blob) => `blob:${(file as File).name}`);
    URL.revokeObjectURL = vi.fn();
  });

  it("previews picked images and removes them", async () => {
    const input = renderForm();
    await userEvent.upload(input, [png("a.png"), png("b.png")]);
    expect(screen.getByRole("img", { name: "a.png" })).toHaveAttribute("src", "blob:a.png");
    await userEvent.click(screen.getByRole("button", { name: `${m.removeImage} a.png` }));
    expect(screen.queryByRole("img", { name: "a.png" })).not.toBeInTheDocument();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:a.png");
  });

  it("rejects unsupported files and hides + Image at five images", async () => {
    const input = renderForm();
    await userEvent.upload(input, [new File(["x"], "doc.pdf", { type: "application/pdf" })], { applyAccept: false });
    expect(screen.getByText(m.imageErrors.type)).toBeInTheDocument();
    await userEvent.upload(input, ["1", "2", "3", "4", "5"].map((n) => png(`${n}.png`)));
    expect(screen.getAllByRole("img")).toHaveLength(5);
    expect(screen.queryByRole("button", { name: /^Image/ })).not.toBeInTheDocument();
  });
});
