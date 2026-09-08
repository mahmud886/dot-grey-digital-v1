"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Below this, the route arrived fast enough that a cover would only add delay. */
const SLOW_NAVIGATION_MS = 150;
/** Nothing should be able to leave the sheet covering the page. */
const SAFETY_MS = 2500;

/**
 * Route transition [44].
 *
 * The incoming page always rises into place. The accent sheet only appears when a
 * navigation is actually slow: every route here is prerendered, so a click usually lands
 * in well under a frame, and covering the screen for 900ms each time would be
 * manufacturing delay to show off an animation. Measured before deciding — the first
 * version wiped on every click and the cover was still on screen at 220ms while the new
 * route had already rendered.
 *
 * The phase is derived from the pathname rather than stored, so the only state is which
 * path we left from — set from a click, cleared when the reveal ends.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [leavingFrom, setLeavingFrom] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // The enter animation must not run on the first load. It starts the whole page at
  // opacity 0, and an element at opacity 0 is not a Largest Contentful Paint candidate —
  // the first version of this made Lighthouse report NO_LCP on mobile, i.e. it could not
  // find a contentful paint at all. It only earns its place between routes.
  // State rather than a ref: this is read during render, and a ref is not reactive.
  const [hasNavigated, setHasNavigated] = useState(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const navigated = leavingFrom !== null && pathname !== leavingFrom;
  const phase = navigated ? "revealing" : leavingFrom !== null ? "covering" : "idle";

  useEffect(() => {
    if (reduced) return;

    const onClick = (e: MouseEvent) => {
      // Let modified clicks open a new tab as usual.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // In-page anchors and links to the current route are not navigations.
      if (url.pathname === window.location.pathname) return;
      // The CMS is a separate app; let it load normally.
      if (url.pathname.startsWith("/keystatic")) return;

      const from = window.location.pathname;
      setHasNavigated(true);
      clearTimers();

      // Only cover if we are still here after the grace period.
      timers.current.push(
        setTimeout(() => {
          if (window.location.pathname === from) setLeavingFrom(from);
        }, SLOW_NAVIGATION_MS),
        setTimeout(() => setLeavingFrom(null), SAFETY_MS),
      );
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, [reduced, clearTimers]);

  if (reduced) return <>{children}</>;

  return (
    <>
      <div
        aria-hidden
        className="page-sheet"
        data-state={phase}
        onAnimationEnd={() => {
          if (!navigated) return;
          clearTimers();
          setLeavingFrom(null);
        }}
      />
      <div key={pathname} className={hasNavigated ? "page-enter" : undefined}>
        {children}
      </div>
    </>
  );
}
