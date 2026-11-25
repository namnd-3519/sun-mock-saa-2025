import type { SVGProps } from "react";

// Path from the MoMorph frame (MM_MEDIA_User Profile), redrawn on a 24px grid.
export function IconUser(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 4C13.06 4 14.08 4.42 14.83 5.17C15.58 5.92 16 6.94 16 8C16 9.06 15.58 10.08 14.83 10.83C14.08 11.58 13.06 12 12 12C10.94 12 9.92 11.58 9.17 10.83C8.42 10.08 8 9.06 8 8C8 6.94 8.42 5.92 9.17 5.17C9.92 4.42 10.94 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z" />
    </svg>
  );
}
