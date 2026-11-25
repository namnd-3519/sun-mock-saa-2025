type KudosAvatarProps = { src: string | null; name: string | null; size?: number };

function initials(name: string | null): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return words.length ? (words.at(-1)?.[0] ?? "").toUpperCase() : "?";
}

/** MM_MEDIA_Avatar: Gmail avatar in a white ring; initials when there is no photo. */
export function KudosAvatar({ src, name, size = 64 }: KudosAvatarProps) {
  const style = { width: size, height: size };
  const ring = "shrink-0 rounded-full border-[1.869px] border-white bg-[#eee] object-cover";
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
