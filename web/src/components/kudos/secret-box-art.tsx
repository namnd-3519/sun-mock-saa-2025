/**
 * C "MM_MEDIA_box quà chưa mở" + "hiệu ứng box quà": MoMorph holds no media, so the closed gift box
 * is drawn as SVG (brand colors) with a soft glow. Swap in the real file here once it exists.
 */
export function SecretBoxArt({ dimmed }: { dimmed: boolean }) {
  return (
    <div className={`relative size-full ${dimmed ? "opacity-40 grayscale" : ""}`} aria-hidden="true">
      <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgb(255_234_158/0.35)_0%,rgb(255_234_158/0)_70%)]" />
      <svg viewBox="0 0 200 200" className="relative size-full">
        <rect x="42" y="92" width="116" height="78" rx="6" fill="#998c5f" />
        <rect x="34" y="70" width="132" height="28" rx="6" fill="#ffea9e" />
        <rect x="92" y="70" width="16" height="100" fill="#00101a" opacity="0.85" />
        <path
          d="M100 70c-10-22-38-30-42-14-3 12 22 15 42 14Zm0 0c10-22 38-30 42-14 3 12-22 15-42 14Z"
          fill="none"
          stroke="#ffea9e"
          strokeWidth="7"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
