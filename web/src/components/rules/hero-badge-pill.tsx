type HeroBadgePillProps = { name: string; legend?: boolean };

// MM_MEDIA_* Hero pill (126x22, 0.58px #FFEA9E border, fully rounded). MoMorph holds no image,
// so the artwork is a CSS fallback: dark teal wash rgba(9,36,50,.5) over a warm gradient.
// Slot: swap the gradient for the exported pill image once the asset is available.
export function HeroBadgePill({ name, legend = false }: HeroBadgePillProps) {
  return (
    <span
      className={`inline-flex h-[22px] w-[126px] shrink-0 items-center justify-center rounded-full border-[0.58px] border-brand-accent text-[13px] leading-[19px] font-bold tracking-[0.09px] text-white ${
        legend
          ? "bg-[linear-gradient(90deg,#3b2a0a,#8a6a1f_50%,#3b2a0a)] [text-shadow:0_0_1.5px_#fff]"
          : "bg-[linear-gradient(0deg,rgb(9_36_50/0.5),rgb(9_36_50/0.5)),linear-gradient(90deg,#fff3c6,#998c5f)] [text-shadow:0_0.45px_1.8px_#000]"
      }`}
    >
      {name}
    </span>
  );
}
