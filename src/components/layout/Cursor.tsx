"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHasFinePointer } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/**
 * Dot plus trailing ring [25]. Elements opt into a state by setting `data-cursor="VIEW"`
 * (or DRAG / OPEN), which swells the ring and labels it [26].
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const finePointer = useHasFinePointer();
  const active = finePointer && !reduced;

  useGSAP(
    () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!active || !dot || !ring) return;

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);

        const target = (e.target as Element | null)?.closest?.("[data-cursor]");
        setLabel(target?.getAttribute("data-cursor") ?? null);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { dependencies: [active] },
  );

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-100 hidden lg:block">
      <div ref={dotRef} className="absolute size-1.5 rounded-full bg-accent" />
      <div
        ref={ringRef}
        className={cn(
          "absolute grid place-items-center rounded-full border border-accent font-display text-[0.625rem] font-semibold tracking-[0.12em] uppercase text-accent transition-[width,height,background-color] duration-300",
          label ? "size-16 bg-accent/10" : "size-8",
        )}
      >
        {label}
      </div>
    </div>
  );
}
