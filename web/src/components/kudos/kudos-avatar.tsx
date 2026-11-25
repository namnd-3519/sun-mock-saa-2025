type KudosAvatarProps = {
  src: string | null;
  name: string | null;
  size?: number;
  /** Always show the hover ring (#FFEA9E) instead of the default white one. */
  highlighted?: boolean;
};

function initials(name: string | null): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return words.length ? (words.at(-1)?.[0] ?? "").toUpperCase() : "?";
}

/**
 * MM_MEDIA_Avatar: Gmail avatar in a white ring; initials when there is no photo. Inside an
 * open person hover card (`group/person` with `data-open`) the ring turns #FFEA9E (Bf5XiTE7AO B).
 */
export function KudosAvatar({ src, name, size = 64, highlighted = false }: KudosAvatarProps) {
  const style = { width: size, height: size };
  const border = highlighted
    ? "border-brand-accent"
    : "border-white transition-colors group-data-[open=true]/person:border-brand-accent";
  const ring = `shrink-0 rounded-full border-[1.869px] ${border} bg-[#eee] object-cover`;
  if (!src) {
    return (
      <span
        aria-hidden="true"
        style={style}
        className={`${ring} flex items-center justify-center text-xl font-bold text-brand-bg`}
      >
        {initials(name)}
      </span>
    );
  }
  // Avatars come from Google and Supabase hosts that next/image is not configured for.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" style={style} className={ring} referrerPolicy="no-referrer" />;
}
