import type { SVGProps } from "react";

// Secret box notification (simple redraw).
export function IconGift(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v8h14v-8M12 8v12" />
      <path d="M12 8S10.5 3.5 8 4.2C6 4.8 7 8 12 8zM12 8s1.5-4.5 4-3.8C18 4.8 17 8 12 8z" />
    </svg>
  );
}
