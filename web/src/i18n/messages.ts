import type { Locale } from "./config";

const vi = {
  login: {
    subtitle: "Bắt đầu hành trình của bạn cùng SAA 2025.",
    tagline: "Đăng nhập để khám phá!",
    button: "LOGIN With Google",
    loading: "Đang đăng nhập...",
    error: "Đăng nhập không thành công. Vui lòng thử lại.",
  },
  footer: { copyright: "Bản quyền thuộc về Sun* © 2025" },
  auth: { signOut: "Đăng xuất" },
  language: { label: "Chọn ngôn ngữ", vi: "Tiếng Việt", en: "English" },
  countdown: {
    title: "Sự kiện sẽ bắt đầu sau",
    days: "NGÀY",
    hours: "GIỜ",
    minutes: "PHÚT",
  },
};

export type Messages = typeof vi;

const en: Messages = {
  login: {
    subtitle: "Start your journey with SAA 2025.",
    tagline: "Log in to explore!",
    button: "LOGIN With Google",
    loading: "Signing in...",
    error: "Login failed. Please try again.",
  },
  footer: { copyright: "Copyright belongs to Sun* © 2025" },
  auth: { signOut: "Sign out" },
  language: { label: "Select language", vi: "Tiếng Việt", en: "English" },
  countdown: {
    title: "Event starts in",
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINUTES",
  },
};

const MESSAGES: Record<Locale, Messages> = { vi, en };

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale];
}
