import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { notificationsEn as m } from "@/i18n/notifications-messages";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications/notification-queries";
import { NOTIFICATIONS_CHANGED_EVENT } from "@/lib/notifications/notifications-changed-event";
import type { AppNotification } from "@/lib/notifications/notification-types";
import { NotificationsPanel } from "./notifications-panel";

vi.mock("@/lib/supabase/create-supabase-browser-client", () => ({ createSupabaseBrowserClient: () => ({}) }));
vi.mock("@/lib/notifications/notification-queries", () => ({
  listNotifications: vi.fn(),
  markAllNotificationsRead: vi.fn(),
  markNotificationRead: vi.fn(),
}));

const list = vi.mocked(listNotifications);
const markAll = vi.mocked(markAllNotificationsRead);
const markOne = vi.mocked(markNotificationRead);
const now = "2025-10-30T10:00:00.000Z";
const kudos: AppNotification = { id: "n1", type: "kudos_received", kudosId: "k1", senderName: "Le C", createdAt: now, isRead: false };
const heart: AppNotification = { id: "n2", type: "heart_received", kudosId: "k1", actorName: null, createdAt: now, isRead: true };
const box: AppNotification = { id: "n3", type: "secret_box_available", boxId: "b1", createdAt: now, isRead: false };

function renderPanel(items: AppNotification[], nextCursor: { createdAt: string; id: string } | null = null) {
  render(<NotificationsPanel initial={{ items, nextCursor }} now={now} locale="en" messages={m} />);
}

const unreadDots = () => screen.queryAllByRole("img", { name: m.unread });

describe("NotificationsPanel", () => {
  beforeEach(() => {
    list.mockReset();
    markAll.mockReset();
    markOne.mockReset();
  });

  it("shows the empty state with Mark all disabled", () => {
    renderPanel([]);
    expect(screen.getByText(m.empty)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: m.markAllRead })).toBeDisabled();
  });

  it("renders each type with its message and unread dots", () => {
    renderPanel([kudos, heart, box]);
    const [first, second, third] = screen.getAllByTestId("notification-item");
    expect(first).toHaveTextContent(`Le C ${m.kudosReceived}`);
    expect(second).toHaveTextContent(`${m.someone} ${m.heartReceived}`);
    expect(third).toHaveTextContent(m.secretBoxAvailable);
    expect(first).toHaveTextContent(m.justNow);
    expect(unreadDots()).toHaveLength(2);
  });

  it("marks one item read on click and tells the bell", async () => {
    markOne.mockResolvedValueOnce(true);
    const changed = vi.fn();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, changed);
    renderPanel([kudos]);
    await userEvent.click(screen.getByRole("button", { name: /Le C/ }));
    expect(markOne).toHaveBeenCalledWith(expect.anything(), "n1");
    expect(unreadDots()).toHaveLength(0);
    expect(changed).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole("button", { name: /Le C/ }));
    expect(markOne).toHaveBeenCalledOnce();
    window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, changed);
  });

  it("marks everything read", async () => {
    markAll.mockResolvedValueOnce(2);
    renderPanel([kudos, box]);
    await userEvent.click(screen.getByRole("button", { name: m.markAllRead }));
    expect(unreadDots()).toHaveLength(0);
    expect(screen.getByRole("button", { name: m.markAllRead })).toBeDisabled();
  });

  it("shows an error when marking fails and keeps the item unread", async () => {
    markAll.mockRejectedValueOnce(new Error("offline"));
    renderPanel([kudos]);
    await userEvent.click(screen.getByRole("button", { name: m.markAllRead }));
    expect(screen.getByRole("alert")).toHaveTextContent(m.error);
    expect(unreadDots()).toHaveLength(1);
  });

  it("loads more pages until there is no cursor", async () => {
    const cursor = { createdAt: now, id: "n1" };
    let finish: () => void = () => undefined;
    list.mockReturnValueOnce(new Promise((resolve) => (finish = () => resolve({ items: [box], nextCursor: null }))));
    renderPanel([kudos], cursor);
    await userEvent.click(screen.getByRole("button", { name: m.loadMore }));
    expect(screen.getByRole("button", { name: m.loadMore })).toBeDisabled();
    expect(list).toHaveBeenCalledWith(expect.anything(), { cursor });
    await act(async () => finish());
    expect(screen.getAllByTestId("notification-item")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: m.loadMore })).not.toBeInTheDocument();
  });
});
