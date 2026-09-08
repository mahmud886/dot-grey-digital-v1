import Link from "next/link";
import { LogoMark } from "./LogoMark";
import { cn } from "@/lib/cn";

/**
 * The real DotGrey wordmark, traced from public/logo.png into vector paths
 * (scripts/trace-logo.mjs) and inlined so it can be themed.
 *
 * v1 shipped the PNG, whose neutral half is #444 — nearly invisible on the dark site and
 * wrong again on the light one. Here that half is currentColor, so it follows the theme,
 * and the warm half uses the brand token. It is also crisp at any size and does not wait
 * for a webfont, which the previous type-set version did.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center", className)}>
      <LogoMark className="h-7 w-auto text-fg transition-opacity duration-300 group-hover:opacity-80 md:h-8" />
    </Link>
  );
}
