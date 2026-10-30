/**
 * Diagonal arrow drawn as SVG. The ↗ character renders as a blue emoji tile on iOS and
 * some Android fonts, and its shape differs between fonts; this is the same everywhere
 * and follows the surrounding text colour and size.
 */
export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="0.78em"
      height="0.78em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: "inline-block", verticalAlign: "-0.04em", flex: "none" }}
    >
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}
