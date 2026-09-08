"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

let lenisInstance: Lenis | null = null;

/** Exposed so overlays (mobile menu, lightbox) can freeze the page. */
export function setScrollLocked(locked: boolean) {
  if (!lenisInstance) return;
  if (locked) lenisInstance.stop();
  else lenisInstance.start();
}

/** Drives the marquee speed reaction in docs/04-motion.md [23]. */
export function getScrollVelocity() {
  return lenisInstance?.velocity ?? 0;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    // Reduced motion gets plain native scrolling — no Lenis at all.
    if (reduced) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Font swap changes layout, which moves every trigger start and end.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [reduced]);

  return <>{children}</>;
}
