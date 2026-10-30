import Link from "next/link";
import type { CSSProperties } from "react";
import { LogoMark } from "@/components/layout/LogoMark";

/**
 * The DotGrey wordmark recoloured per template: the neutral half takes `ink`, the warm
 * half takes `accent`. Same artwork in every version, different colours.
 */
export function BrandMark({
  href,
  ink,
  accent,
  className,
  compact,
}: {
  href: string;
  ink: string;
  accent: string;
  className?: string;
  compact?: boolean;
}) {
  const style = { color: ink, "--accent": accent } as CSSProperties;
  return (
    <Link href={href} aria-label="DotGrey Digital — home" style={style} className={className}>
      <LogoMark compact={compact} className="block h-full w-auto" />
    </Link>
  );
}
