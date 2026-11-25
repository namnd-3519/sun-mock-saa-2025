import type { SVGProps } from "react";

// Path from the MoMorph frame (MM_MEDIA_Noti), redrawn on a 24px grid.
export function IconBell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M21 19V20H3V19L5 17V11C5 7.9 7.03 5.17 10 4.29V4C10 3.47 10.21 2.96 10.59 2.59C10.96 2.21 11.47 2 12 2C12.53 2 13.04 2.21 13.41 2.59C13.79 2.96 14 3.47 14 4V4.29C16.97 5.17 19 7.9 19 11V17L21 19ZM14 21C14 21.53 13.79 22.04 13.41 22.41C13.04 22.79 12.53 23 12 23C11.47 23 10.96 22.79 10.59 22.41C10.21 22.04 10 21.53 10 21" />
    </svg>
  );
}
