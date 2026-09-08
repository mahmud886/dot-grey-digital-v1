import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/data/site";

/**
 * Set as type rather than v1's logo.png: the PNG is white artwork on transparent, so it
 * disappears on a light background. This themes correctly and stays crisp at any size.
 * Swap for an SVG when the real mark is available.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <span
        aria-hidden
        className="size-2 rounded-full bg-accent transition-transform duration-400 group-hover:scale-125"
      />
      <span className="font-display text-[1.375rem] leading-none font-extrabold tracking-[-0.02em] uppercase">
        <span className="text-accent">Dot</span>
        <span className="text-fg">Grey</span>
        <span className="ml-1.5 align-top text-[0.5rem] font-semibold tracking-[0.28em] text-fg-subtle">
          Digital
        </span>
      </span>
    </Link>
  );
}
