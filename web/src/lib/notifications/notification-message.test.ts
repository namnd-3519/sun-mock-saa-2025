import { describe, expect, it } from "vitest";
import { getMessages } from "@/i18n/messages";
import { formatBellLabel, formatNotificationMessage } from "./notification-message";
import type { AppNotification } from "./notification-types";

const vi = getMessages("vi").notifications;
const en = getMessages("en").notifications;
const base = { id: "n1", createdAt: "2026-11-25T10:00:00Z", isRead: false };

describe("formatNotificationMessage", () => {
  it("renders kudos_received with the bold sender name (spec vi template)", () => {
    const item: AppNotification = { ...base, type: "kudos_received", kudosId: "k1", senderName: "An" };
    expect(formatNotificationMessage(item, vi)).toEqual({ strong: "An", text: "đã gửi Kudos cho bạn" });
    expect(formatNotificationMessage(item, en)).toEqual({ strong: "An", text: "sent you a Kudos" });
  });

  it("falls back to an anonymous label when an anonymous kudos has no nickname", () => {
    const item: AppNotification = { ...base, type: "kudos_received", kudosId: "k1", senderName: null };
    expect(formatNotificationMessage(item, vi).strong).toBe("Một Sunner ẩn danh");
  });

  it("renders heart_received with the actor name", () => {
    const item: AppNotification = { ...base, type: "heart_received", kudosId: "k1", actorName: "Binh" };
    expect(formatNotificationMessage(item, vi)).toEqual({
      strong: "Binh",
      text: "đã thả tim Kudos của bạn",
    });
    const unnamed: AppNotification = { ...item, actorName: null };
    expect(formatNotificationMessage(unnamed, en).strong).toBe("A Sunner");
  });

  it("renders secret_box_available as plain text", () => {
    const item: AppNotification = { ...base, type: "secret_box_available", boxId: "b1" };
    expect(formatNotificationMessage(item, vi)).toEqual({
      strong: null,
      text: "Bạn có một Hộp bí mật mới, mở ngay nhé!",
    });
  });
});

describe("formatBellLabel", () => {
  it("names the unread count, or just the bell when nothing is unread", () => {
    expect(formatBellLabel("Thông báo", vi, 0)).toBe("Thông báo");
    expect(formatBellLabel("Thông báo", vi, 3)).toBe("Thông báo, 3 thông báo chưa đọc");
  });
});
