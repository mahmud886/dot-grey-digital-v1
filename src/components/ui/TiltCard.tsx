"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHasFinePointer } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/** 3D tilt with a glare that tracks the pointer [28]. Fine-pointer devices only. */
export function TiltCard({
  children,
  max = 8,
  className,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useHasFinePointer();
  const active = finePointer && !reduced;

  useGSAP(
    () => {
      const el = ref.current;
      const glare = glareRef.current;
      if (!active || !el) return;

      const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        ry((px - 0.5) * max * 2);
        rx((0.5 - py) * max * 2);
        if (glare) {
          gsap.to(glare, {
            opacity: 0.18,
            duration: 0.3,
            "--glare-x": `${px * 100}%`,
            "--glare-y": `${py * 100}%`,
          });
        }
      };

      const onLeave = () => {
        rx(0);
        ry(0);
        if (glare) gsap.to(glare, { opacity: 0, duration: 0.4 });
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref, dependencies: [active, max] },
  );

  return (
    <div
      ref={ref}
      className={cn("relative [transform-style:preserve-3d] will-change-transform", className)}
    >
      {children}
      {active ? (
        <span
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0"
          style={{
            background:
              "radial-gradient(circle at var(--glare-x,50%) var(--glare-y,50%), white, transparent 55%)",
          }}
        />
      ) : null}
    </div>
  );
}
