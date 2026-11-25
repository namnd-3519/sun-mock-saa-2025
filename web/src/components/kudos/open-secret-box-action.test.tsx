import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { kudosEn } from "@/i18n/kudos-messages";
import { KudosDataError } from "@/lib/kudos/kudos-error";
import { openSecretBox } from "@/lib/kudos/secret-box";
import type { KudosStats } from "@/lib/kudos/kudos-types";
import { KudosSidebar } from "./kudos-sidebar";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("@/lib/supabase/create-supabase-browser-client", () => ({ createSupabaseBrowserClient: () => ({}) }));
vi.mock("@/lib/kudos/secret-box", () => ({ openSecretBox: vi.fn() }));

const openBox = vi.mocked(openSecretBox);
const m = kudosEn.secretBox;
const stats = (boxesUnopened: number): KudosStats => ({
  kudosReceived: 5,
  kudosSent: 3,
  heartsReceived: 9,
  boxesOpened: 1,
  boxesUnopened,
});

function renderSidebar(unopened: number) {
  render(<KudosSidebar stats={stats(unopened)} giftReceivers={[]} messages={kudosEn} />);
  return screen.getByRole("button", { name: kudosEn.openGift });
}

async function openDialog(unopened = 2) {
  await userEvent.click(renderSidebar(unopened));
  return screen.getByRole("dialog", { name: m.title });
}

describe("Open Secret Box", () => {
  beforeEach(() => {
    openBox.mockReset();
    refresh.mockReset();
  });

  it("disables Open gift without unopened boxes", () => {
    expect(renderSidebar(0)).toBeDisabled();
  });

  it("opens a box, shows the badge and refreshes the board", async () => {
    let finish: (box: { boxId: string; badge: "stay_gold" }) => void = () => undefined;
    openBox.mockReturnValueOnce(new Promise((resolve) => (finish = resolve)));
    const dialog = await openDialog(2);
    expect(within(dialog).getByText("02")).toBeInTheDocument();
    expect(within(dialog).getByText(m.hint)).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole("button", { name: m.openBox }));
    const busy = within(dialog).getByRole("button", { name: m.opening });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute("aria-busy", "true");
    await act(async () => finish({ boxId: "b1", badge: "stay_gold" }));
    expect(within(dialog).getByRole("status")).toHaveTextContent("You received the Stay Gold badge!");
    expect(within(dialog).getByText("01")).toBeInTheDocument();
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("explains when the last box was already opened elsewhere", async () => {
    openBox.mockRejectedValueOnce(new KudosDataError("no_unopened_box"));
    const dialog = await openDialog(1);
    await userEvent.click(within(dialog).getByRole("button", { name: m.openBox }));
    expect(within(dialog).getByRole("alert")).toHaveTextContent(m.errors.no_unopened_box);
    expect(within(dialog).getByText("00")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: m.openBox })).toBeDisabled();
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("shows a generic error and lets the user try again", async () => {
    openBox.mockRejectedValueOnce(new Error("network"));
    const dialog = await openDialog(1);
    await userEvent.click(within(dialog).getByRole("button", { name: m.openBox }));
    expect(within(dialog).getByRole("alert")).toHaveTextContent(m.errors.unknown);
    expect(within(dialog).getByRole("button", { name: m.openBox })).toBeEnabled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("closes from the close button, Escape and the backdrop", async () => {
    let dialog = await openDialog();
    await userEvent.click(within(dialog).getByRole("button", { name: m.close }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: kudosEn.openGift }));
    dialog = screen.getByRole("dialog");
    act(() => void dialog.dispatchEvent(new Event("cancel", { cancelable: true })));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: kudosEn.openGift }));
    await userEvent.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("KudosSidebar gift receivers", () => {
  it("shows an empty state and the latest receivers", () => {
    render(<KudosSidebar stats={null} giftReceivers={[]} messages={kudosEn} />);
    expect(screen.getByText(kudosEn.noData)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: kudosEn.openGift })).toBeDisabled();
  });

  it("lists receivers with a link to their profile", () => {
    const gift = { boxId: "b1", badge: "stay_gold" as const, openedAt: "2025-10-30T00:00:00Z", owner: { id: "u1", fullName: "Le C", avatarUrl: null } };
    render(<KudosSidebar stats={stats(0)} giftReceivers={[gift]} messages={kudosEn} />);
    expect(screen.getByRole("link", { name: "Le C" })).toHaveAttribute("href", "/profile/u1");
    expect(screen.getByText("Received 1 Stay Gold")).toBeInTheDocument();
  });
});
