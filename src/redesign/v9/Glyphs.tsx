/**
 * Pictograms set inline with the type, sized to the cap height so they read as part of a
 * word: "DotGrey ✳ Digital", "◇ Dhaka ↗ Remote". Decorative — the text around them carries
 * the meaning — so they are hidden from assistive tech.
 */
export type GlyphName = "asterisk" | "diamond" | "arrow" | "dot" | "wave" | "ring" | "plus" | "flower" | "slash";

const PATHS: Record<GlyphName, React.ReactNode> = {
  asterisk: (
    <g fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="square">
      <path d="M12 1v22M2.5 6.5l19 11M2.5 17.5l19-11" />
    </g>
  ),
  diamond: <path d="M12 1.5 22.5 12 12 22.5 1.5 12Z" fill="none" stroke="currentColor" strokeWidth={2.6} />,
  arrow: (
    <g fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="square">
      <path d="M4 20 20 4M7 4h13v13" />
    </g>
  ),
  dot: <circle cx={12} cy={12} r={9} fill="currentColor" />,
  wave: <path d="M1 15c3.7 0 3.7-6 7.3-6s3.7 6 7.4 6S19.4 9 23 9" fill="none" stroke="currentColor" strokeWidth={2.6} />,
  ring: <circle cx={12} cy={12} r={9.7} fill="none" stroke="currentColor" strokeWidth={2.6} />,
  plus: <path d="M12 2v20M2 12h20" fill="none" stroke="currentColor" strokeWidth={2.6} />,
  flower: (
    <g fill="currentColor">
      <circle cx={12} cy={6} r={5} />
      <circle cx={12} cy={18} r={5} />
      <circle cx={6} cy={12} r={5} />
      <circle cx={18} cy={12} r={5} />
    </g>
  ),
  slash: <path d="M17 1 7 23" fill="none" stroke="currentColor" strokeWidth={2.6} />,
};

export function G({ name, className }: { name: GlyphName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} data-glyph={name}>
      {PATHS[name]}
    </svg>
  );
}
