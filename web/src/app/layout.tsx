import type { Metadata } from "next";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { Montserrat, Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import { CountdownView } from "@/components/countdown/countdown-view";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { isPrelaunch } from "@/lib/prelaunch/countdown";
import { getLaunchAt } from "@/lib/prelaunch/launch-time";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700"],
});

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alternates",
  subsets: ["latin", "vietnamese"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "SAA 2025",
  description: "Sun* Annual Awards 2025",
};

export const instant = false;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  // Prelaunch gate: before launch every page renders the countdown instead.
  const launchAt = getLaunchAt();
  await connection();
  const now = new Date();
  const content =
    launchAt && isPrelaunch(now, launchAt) ? (
      <CountdownView now={now} launchAt={launchAt} messages={getMessages(locale).countdown} />
    ) : (
      children
    );
  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${montserratAlternates.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{content}</body>
    </html>
  );
}
