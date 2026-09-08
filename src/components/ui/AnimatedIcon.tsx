"use client";

import type { CSSProperties } from "react";
import { Icon } from "./Icon";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * An icon tile that quietly breathes: a pulsing glow behind it, a slow float, a rotating
 * dashed ring, and an occasional blink [46]. Each instance takes a `seed` so a grid of
 * them drifts out of phase rather than pulsing in unison, which reads as a glitch.
 *
 * Everything here is CSS animation, so the global reduced-motion guard already stops it;
 * the hook additionally drops the decorative ring and glow entirely.
 */
export function AnimatedIcon({
  name,
  seed = 0,
  size = "md",
  variant = "tint",
  ring = false,
  className,
}: {
  name: string;
  seed?: number;
  size?: "sm" | "md" | "lg";
  variant?: "tint" | "solid";
  ring?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const box = {
    sm: "size-12 rounded-2xl",
    md: "size-14 rounded-2xl",
    lg: "size-20 rounded-3xl",
  }[size];

  const glyph = { sm: "size-6", md: "size-7", lg: "size-10" }[size];

  // Offsets keep neighbouring icons out of step.
  const style = reduced
    ? undefined
    : ({
        "--d1": `${-(seed % 5) * 0.7}s`,
        "--d2": `${-(seed % 3) * 1.3}s`,
        "--d3": `${-(seed % 7) * 0.9}s`,
      } as CSSProperties);

  return (
    <span
      style={style}
      className={cn(
        "relative inline-grid shrink-0 place-items-center",
        box,
        variant === "solid"
          ? "bg-gradient-to-br from-accent to-accent-strong text-accent-fg"
          : "bg-accent-dim text-accent",
        !reduced && "animate-[icon-float_6s_ease-in-out_infinite] [animation-delay:var(--d3)]",
        className,
      )}
    >
      {!reduced ? (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-[inherit] bg-accent/40 blur-lg animate-[icon-glow_4.5s_ease-in-out_infinite] [animation-delay:var(--d1)]"
        />
      ) : null}

      {ring && !reduced ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-1.5 rounded-[inherit] border border-dashed border-accent/40 animate-[ring-spin_18s_linear_infinite] [animation-delay:var(--d2)]"
        />
      ) : null}

      <Icon
        name={name}
        className={cn(
          glyph,
          !reduced &&
            "animate-[icon-pulse_3.5s_ease-in-out_infinite] [animation-delay:var(--d1)] motion-safe:[&]:will-change-transform",
        )}
      />

      {!reduced ? (
        <span
          aria-hidden
          className="absolute top-1.5 right-1.5 size-1 rounded-full bg-current animate-[icon-blink_5s_steps(1,end)_infinite] [animation-delay:var(--d2)]"
        />
      ) : null}
    </span>
  );
}
