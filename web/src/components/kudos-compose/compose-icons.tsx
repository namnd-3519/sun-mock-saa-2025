// MM_MEDIA_* icons of the Write Kudo form, rebuilt as SVG (MoMorph holds no icon files).
type IconProps = { className?: string };

function Svg({ className = "size-6", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}><path d="M7 10l5 5 5-5z" fill="currentColor" stroke="none" /></Svg>
);
export const BoldIcon = (p: IconProps) => (
  <Svg {...p}><path d="M7 5h6a3.5 3.5 0 010 7H7zM7 12h7a3.5 3.5 0 010 7H7z" strokeWidth={2.5} /></Svg>
);
export const ItalicIcon = (p: IconProps) => (
  <Svg {...p}><path d="M10 5h8M6 19h8M15 5l-6 14" strokeWidth={2.5} /></Svg>
);
export const StrikeIcon = (p: IconProps) => (
  <Svg {...p}><path d="M4 12h16M16.5 7.5C16 6 14.3 5 12 5c-2.8 0-4.5 1.4-4.5 3.3 0 1.2.6 2.1 1.8 2.7M8 16.5c.6 1.6 2.3 2.5 4.5 2.5 2.8 0 4.5-1.4 4.5-3.4 0-.6-.1-1.1-.4-1.6" /></Svg>
);
export const NumberedListIcon = (p: IconProps) => (
  <Svg {...p}><path d="M10 6h11M10 12h11M10 18h11M4 4.5h1V9M3.5 9h2.5M3.5 13.5c.4-.6 2.5-.8 2.5.6 0 1.2-2.5 1.5-2.5 3.4H6" strokeWidth={1.6} /></Svg>
);
export const LinkIcon = (p: IconProps) => (
  <Svg {...p}><path d="M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1 1M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1-1" /></Svg>
);
export const QuoteIcon = (p: IconProps) => (
  <Svg {...p}><path d="M4 7h6v5c0 3-1.5 5-4 5.5M14 7h6v5c0 3-1.5 5-4 5.5" strokeWidth={2.5} /></Svg>
);
export const PlusIcon = (p: IconProps) => (
  <Svg {...p}><path d="M12 5v14M5 12h14" strokeWidth={1.5} /></Svg>
);
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>
);
export const SendIcon = (p: IconProps) => (
  <Svg {...p}><path d="M4 5l16 7-16 7 3-7zM7 12h13" /></Svg>
);
