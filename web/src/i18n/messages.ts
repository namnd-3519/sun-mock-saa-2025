import type { Locale } from "./config";
import { homeEn, homeVi } from "./home-messages";

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
  nav: {
    about: "About SAA 2025",
    awards: "Awards Information",
    kudos: "Sun* Kudos",
    standards: "Tiêu chuẩn chung",
    home: "Về trang chủ SAA 2025",
    main: "Điều hướng chính",
    footer: "Liên kết chân trang",
    notifications: "Thông báo",
    account: "Tài khoản",
  },
  fab: {
    open: "Mở hành động nhanh: Viết KUDOS hoặc Thể lệ",
    actions: "Hành động nhanh",
    rules: "Thể lệ",
    writeKudos: "Viết KUDOS",
    close: "Đóng hành động nhanh",
  },
  home: homeVi,
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
  nav: {
    about: "About SAA 2025",
    awards: "Awards Information",
    kudos: "Sun* Kudos",
    standards: "General standards",
    home: "Go to the SAA 2025 homepage",
    main: "Main navigation",
    footer: "Footer links",
    notifications: "Notifications",
    account: "Account",
  },
  fab: {
    open: "Open quick actions: Write KUDOS or Rules",
    actions: "Quick actions",
    rules: "Rules",
    writeKudos: "Write KUDOS",
    close: "Close quick actions",
  },
  home: homeEn,
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
