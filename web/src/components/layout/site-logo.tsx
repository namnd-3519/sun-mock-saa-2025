import Image from "next/image";
import Link from "next/link";
import { HOME_PATH } from "@/lib/navigation/site-nav";

type SiteLogoProps = { label: string; size: "header" | "footer" };

// A1.1 is 52x48, 7.1 is 69x64 (same artwork).
const SIZES = {
  header: { width: 52, height: 48 },
  footer: { width: 69, height: 64 },
};

/** Sun* Annual Awards 2025 logo linking to the top of the homepage. */
export function SiteLogo({ label, size }: SiteLogoProps) {
  const { width, height } = SIZES[size];
  return (
    <Link
      href={HOME_PATH}
      aria-label={label}
      className="shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
    >
      <Image
        src="/images/home/saa-logo.png"
        alt="Sun* Annual Awards 2025"
        width={width}
        height={height}
        priority={size === "header"}
      />
    </Link>
  );
}
