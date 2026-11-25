import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { notificationsEn as m } from "@/i18n/notifications-messages";
import { countUnreadNotifications } from "@/lib/notifications/notification-queries";
import { announceNotificationsChanged } from "@/lib/notifications/notifications-changed-event";
import { NotificationBell } from "./notification-bell";

let onChange: () => void = () => undefined;
const removeChannel = vi.fn();
const channel = {
  on: (_type: string, _filter: object, handler: () => void) => {
    onChange = handler;
    return channel;
  },
  subscribe: () => channel,
};
const client = {
  auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) },
  channel: vi.fn(() => channel),
  removeChannel,
};
vi.mock("@/lib/supabase/create-supabase-browser-client", () => ({ createSupabaseBrowserClient: () => client }));
vi.mock("@/lib/notifications/notification-queries", () => ({ countUnreadNotifications: vi.fn() }));

const count = vi.mocked(countUnreadNotifications);

async function renderBell() {
  const view = render(<NotificationBell label="Notifications" messages={m} className="" />);
  await act(async () => undefined);
  return view;
}

describe("NotificationBell", () => {
  beforeEach(() => {
    count.mockReset();
    removeChannel.mockReset();
  });

  it("shows no badge without unread notifications", async () => {
    count.mockResolvedValue(0);
    await renderBell();
    expect(screen.getByRole("link", { name: "Notifications" })).toHaveAttribute("href", "/notifications");
    expect(screen.queryByTestId("notification-badge")).not.toBeInTheDocument();
  });

  it("shows the server unread count, capped at 99+", async () => {
    count.mockResolvedValue(120);
    await renderBell();
    expect(screen.getByRole("link", { name: "Notifications, 120 unread notifications" })).toBeInTheDocument();
    expect(screen.getByTestId("notification-badge")).toHaveTextContent("99+");
  });

  it("refetches on Realtime changes, focus and same-tab mark-read", async () => {
    count.mockResolvedValueOnce(1).mockResolvedValueOnce(2).mockResolvedValueOnce(3).mockResolvedValueOnce(0);
    const { unmount } = await renderBell();
    expect(client.channel).toHaveBeenCalledWith("notifications-u1");
    expect(screen.getByTestId("notification-badge")).toHaveTextContent("1");
    await act(async () => onChange());
    expect(screen.getByTestId("notification-badge")).toHaveTextContent("2");
    await act(async () => void window.dispatchEvent(new Event("focus")));
    expect(screen.getByTestId("notification-badge")).toHaveTextContent("3");
    await act(async () => announceNotificationsChanged());
    expect(screen.queryByTestId("notification-badge")).not.toBeInTheDocument();
    unmount();
    expect(removeChannel).toHaveBeenCalledOnce();
  });

  it("falls back to no badge when the count fails", async () => {
    count.mockRejectedValue(new Error("offline"));
    await renderBell();
    expect(screen.queryByTestId("notification-badge")).not.toBeInTheDocument();
  });
});
