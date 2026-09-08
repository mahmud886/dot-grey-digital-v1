"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Infinite horizontal strip [22]. The track is duplicated and translated -50%, so the loop
 * is seamless regardless of content width.
 */
export function Marquee({
  items,
  /** Purely decorative rows opt out of the accessibility tree entirely. */
  decorative = false,
  speed = 35,
  direction = "left",
  outlined = false,
  pauseOnHover = true,
  separator = "✦",
  className,
  itemClassName,
}: {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  outlined?: boolean;
  pauseOnHover?: boolean;
  decorative?: boolean;
  separator?: string;
  className?: string;
  itemClassName?: string;
}) {
  const reduced = useReducedMotion();

  const track = (key: string) => (
    <div
      key={key}
      aria-hidden
      className="flex shrink-0 items-center gap-8 pr-8 md:gap-14 md:pr-14"
    >
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={cn("flex items-center gap-8 md:gap-14", itemClassName)}
        >
          <span className={cn("whitespace-nowrap", outlined && "text-outline")}>{item}</span>
          <span className="text-accent">{separator}</span>
        </span>
      ))}
    </div>
  );

  if (reduced) {
    return (
      <div aria-hidden={decorative || undefined} className={cn("flex overflow-hidden", className)}>
        {decorative ? null : <span className="sr-only">{items.join(", ")}</span>}
        {track("static")}
      </div>
    );
  }

  return (
    <div aria-hidden={decorative || undefined} className={cn("group flex overflow-hidden", className)}>
      {decorative ? null : <span className="sr-only">{items.join(", ")}</span>}
      <div
        className={cn(
          "flex will-change-transform",
          direction === "left"
            ? "animate-[marquee-x_var(--marquee-speed)_linear_infinite]"
            : "animate-[marquee-x-reverse_var(--marquee-speed)_linear_infinite]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ "--marquee-speed": `${speed}s` } as CSSProperties}
      >
        {track("a")}
        {track("b")}
      </div>
    </div>
  );
}
