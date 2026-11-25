import type { SVGProps } from "react";

export function IconFlagVn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="15"
      viewBox="0 0 20 15"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect width="20" height="15" fill="#DA251D" />
      <polygon
        fill="#FFFF00"
        points="10,3.5 11.06,6.54 14.28,6.61 11.71,8.56 12.65,11.64 10,9.8 7.35,11.64 8.29,8.56 5.72,6.61 8.94,6.54"
      />
    </svg>
  );
}
