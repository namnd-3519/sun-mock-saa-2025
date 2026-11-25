// Same-tab signal from the notifications page to the header bell after a mark-read, so the
// badge refetches the server count right away (Realtime UPDATE events may lag).
export const NOTIFICATIONS_CHANGED_EVENT = "saa:notifications-changed";

export function announceNotificationsChanged(): void {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}
