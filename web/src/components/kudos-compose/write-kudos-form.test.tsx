import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { writeKudosEn as m } from "@/i18n/write-kudos-messages";
import { KudosDataError } from "@/lib/kudos/kudos-error";
import { searchProfiles } from "@/lib/kudos/reference-data";
import { submitKudosDraft } from "@/lib/kudos-compose/submit-kudos-draft";
import { WriteKudosForm } from "./write-kudos-form";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/supabase/create-supabase-browser-client", () => ({ createSupabaseBrowserClient: () => ({}) }));
vi.mock("@/lib/kudos/reference-data", () => ({ searchProfiles: vi.fn() }));
vi.mock("@/lib/kudos-compose/submit-kudos-draft", () => ({ submitKudosDraft: vi.fn() }));

const search = vi.mocked(searchProfiles);
const submitDraft = vi.mocked(submitKudosDraft);
const hashtags = [
  { id: "h1", name: "teamwork" },
  { id: "h2", name: "kindness" },
];
const recipient = { id: "u2", fullName: "Tran Thi B", avatarUrl: null, departmentId: null };

function renderForm() {
  render(<WriteKudosForm senderId="u1" hashtags={hashtags} messages={m} />);
  return screen.getByRole("button", { name: m.submit });
}

async function pickRecipient(user = userEvent.setup()) {
  await user.type(screen.getByRole("combobox"), "Tran");
  await user.click(await screen.findByRole("option", { name: "Tran Thi B" }));
}

async function fillRequired() {
  const user = userEvent.setup();
  await pickRecipient(user);
  await user.type(screen.getByPlaceholderText(m.titlePlaceholder), "Motivator");
  await user.type(screen.getByRole("textbox", { name: m.messageLabel }), "Thank you!");
  await user.click(screen.getByRole("button", { name: /^Hashtag/ }));
  await user.click(screen.getByRole("option", { name: "#teamwork" }));
}

describe("WriteKudosForm", () => {
  beforeEach(() => {
    push.mockReset();
    submitDraft.mockReset();
    search.mockReset();
    search.mockResolvedValue([recipient, { id: "u1", fullName: "Me", avatarUrl: null, departmentId: null }]);
  });

  it("keeps Send disabled until every required field has a value", async () => {
    const send = renderForm();
    expect(send).toBeDisabled();
    await fillRequired();
    expect(send).toBeEnabled();
  });

  it("searches recipients without the sender and shows an empty result", async () => {
    renderForm();
    await userEvent.type(screen.getByRole("combobox"), "Tran");
    expect(await screen.findByRole("option", { name: "Tran Thi B" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await userEvent.click(screen.getByRole("option", { name: "Tran Thi B" }));
    expect(screen.getByRole("combobox")).toHaveValue("Tran Thi B");
    expect(search).toHaveBeenCalledWith(expect.anything(), "Tran");
    search.mockResolvedValueOnce([]);
    await userEvent.type(screen.getByRole("combobox"), "x");
    expect(await screen.findByText(m.recipientEmpty)).toBeInTheDocument();
  });

  it("shows field errors once a required field is left empty", async () => {
    renderForm();
    const title = screen.getByPlaceholderText(m.titlePlaceholder);
    fireEvent.blur(title);
    expect(title).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText(m.fieldErrors.required)).toBeInTheDocument();
    await userEvent.type(title, "Hi");
    expect(title).toHaveAttribute("aria-invalid", "false");
  });

  it("sends the draft and returns to the board", async () => {
    let finish: () => void = () => undefined;
    submitDraft.mockReturnValueOnce(new Promise<string>((resolve) => (finish = () => resolve("k1"))) as never);
    const send = renderForm();
    await fillRequired();
    await userEvent.click(send);
    expect(screen.getByRole("button", { name: m.submitting })).toBeDisabled();
    expect(submitDraft).toHaveBeenCalledWith(
      expect.anything(),
      "u1",
      expect.objectContaining({ recipient, title: "Motivator", content: "Thank you!", hashtags: [hashtags[0]] }),
      [],
    );
    await act(async () => finish());
    expect(push).toHaveBeenCalledWith("/kudos");
  });

  it("shows the server error and lets the user send again", async () => {
    submitDraft.mockRejectedValueOnce(new KudosDataError("invalid_recipient"));
    const send = renderForm();
    await fillRequired();
    await userEvent.click(send);
    expect(await screen.findByRole("alert")).toHaveTextContent(m.submitErrors.invalid_recipient);
    expect(send).toBeEnabled();
    expect(push).not.toHaveBeenCalled();
  });

  it("asks for an optional display name when sending anonymously", async () => {
    renderForm();
    expect(screen.queryByRole("textbox", { name: m.anonymousName })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: m.anonymous }));
    expect(screen.getByRole("textbox", { name: m.anonymousName })).toBeInTheDocument();
  });

  it("adds and removes hashtag chips and hides the trigger at five", async () => {
    const many = Array.from({ length: 6 }, (_, n) => ({ id: `t${n}`, name: `tag${n}` }));
    render(<WriteKudosForm senderId="u1" hashtags={many} messages={m} />);
    await userEvent.click(screen.getByRole("button", { name: /^Hashtag/ }));
    const list = screen.getByRole("listbox", { name: m.hashtag });
    for (const n of [0, 1, 2, 3, 4]) await userEvent.click(within(list).getByRole("option", { name: `#tag${n}` }));
    expect(within(list).getByRole("option", { name: "#tag5" })).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(document.body);
    expect(screen.queryByRole("button", { name: /^Hashtag/ })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: `${m.removeHashtag} #tag0` }));
    expect(screen.getByRole("button", { name: /^Hashtag/ })).toBeInTheDocument();
  });
});
