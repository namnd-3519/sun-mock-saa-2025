import type { SVGProps } from "react";

// Path from the MoMorph frame (MM_MEDIA_Up), redrawn on a 24px grid.
export function IconArrowUpRight(props: SVGProps<SVGSVGElement>) {
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
      <path d="M8.5 18.23L5.69 15.42L12.06 9.04H7.11V5.61H18.31V16.81H14.89V11.86L8.5 18.23Z" />
    </svg>
  );
}
