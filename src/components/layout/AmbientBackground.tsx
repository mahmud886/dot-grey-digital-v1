"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * v1's signature warm wash, moved into tokens and given motion: three ellipses drifting on
 * independent cycles [6], the whole layer parallaxing on scroll [7], with a grain overlay.
 * One fixed layer for the entire site rather than a per-page background.
 */
export function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.to(ref.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--amb-base)]" />

      <div ref={ref} className="absolute inset-[-15%]">
        <div className="absolute top-[8%] left-[55%] h-[70%] w-[80%] animate-[amb-drift-1_22s_ease-in-out_infinite_alternate] rounded-full bg-[radial-gradient(closest-side,var(--amb-1),transparent_70%)] blur-3xl" />
        <div className="absolute top-[35%] left-[-10%] h-[80%] w-[90%] animate-[amb-drift-2_26s_ease-in-out_infinite_alternate] rounded-full bg-[radial-gradient(closest-side,var(--amb-2),transparent_70%)] blur-3xl" />
        <div className="absolute top-[60%] left-[20%] h-[65%] w-[75%] animate-[amb-drift-3_18s_ease-in-out_infinite_alternate] rounded-full bg-[radial-gradient(closest-side,var(--amb-3),transparent_70%)] blur-3xl" />
      </div>

      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          opacity: "var(--grain-opacity)",
          backgroundImage: "url('/img/grain.svg')",
          backgroundSize: "180px 180px",
        }}
      />
    </div>
  );
}
