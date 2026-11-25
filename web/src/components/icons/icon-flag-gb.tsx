import type { SVGProps } from "react";

export function IconFlagGb(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="15"
      viewBox="0 0 20 15"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect width="20" height="15" fill="#012169" />
      <path d="M0 0L20 15M20 0L0 15" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M0 0L20 15M20 0L0 15" stroke="#C8102E" strokeWidth="1.2" />
      <path d="M10 0V15M0 7.5H20" stroke="#FFFFFF" strokeWidth="5" />
      <path d="M10 0V15M0 7.5H20" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}
