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

    // Landing on a deep link (/#faq) puts the page mid-document before Lenis has ticked,
    // so triggers would still hold their scroll-0 state and the content would sit
    // invisible until the first scroll. Refresh once the jump has settled, and again on
    // any later hash change.
    const refresh = () => ScrollTrigger.refresh();
    const settle = setTimeout(refresh, 120);
    window.addEventListener("hashchange", refresh);
    window.addEventListener("load", refresh);

    return () => {
      clearTimeout(settle);
      window.removeEventListener("hashchange", refresh);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [reduced]);

  return <>{children}</>;
}
