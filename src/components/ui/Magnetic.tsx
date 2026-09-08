"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHasFinePointer } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/**
 * Pulls its child toward the pointer within a radius [27]. Mouse and trackpad only — touch
 * devices and reduced-motion users get a plain wrapper.
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 90,
  max = 14,
  className,
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useHasFinePointer();
  const active = finePointer && !reduced;

  useGSAP(
    () => {
      const el = ref.current;
      if (!active || !el) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        if (Math.hypot(dx, dy) > radius + Math.max(rect.width, rect.height) / 2) {
          xTo(0);
          yTo(0);
          return;
        }
        xTo(gsap.utils.clamp(-max, max, dx * strength));
        yTo(gsap.utils.clamp(-max, max, dy * strength));
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref, dependencies: [active, strength, radius, max] },
  );

  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}
