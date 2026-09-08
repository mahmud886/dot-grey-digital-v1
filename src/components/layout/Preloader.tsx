"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

const SESSION_KEY = "dotgrey-preloader-seen";
// Kept short: while this sheet is up it is the largest painted element, so every
// millisecond here is added directly to LCP.
const DURATION = 900;

/**
 * Shown once per session [1, 2]. Never renders under reduced motion, and never on small
 * screens — a full-screen sheet is the largest contentful paint while it is up, and phones
 * are where that costs the most.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (reduced || !isDesktop) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage blocked — still fine to show it once for this render */
    }
    setActive(true);
  }, [reduced, isDesktop]);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min((now - start) / DURATION, 1);
      setProgress(Math.round(t * 100));
      if (t < 1) frame = requestAnimationFrame(step);
      else setLeaving(true);
    });
    // Background tabs pause rAF, so the counter would never reach 100 and this sheet would
    // sit over the page blocking every click. A timer is not throttled the same way, so it
    // always dismisses even if the visitor opened us in a tab they never looked at.
    const failsafe = setTimeout(() => {
      setProgress(100);
      setLeaving(true);
    }, DURATION + 100);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(failsafe);
    };
  }, [active]);

  useEffect(() => {
    if (!leaving) return;
    const id = setTimeout(() => setActive(false), 900);
    return () => clearTimeout(id);
  }, [leaving]);

  if (!active) return null;

  return (
    <div aria-hidden className="fixed inset-0 z-100">
      {/* Orange sheet trailing the main panel as it wipes away. */}
      <div
        className={cn(
          "absolute inset-0 bg-accent transition-[clip-path] delay-100 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          leaving ? "[clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0_0_0_0)]",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 grid place-items-center bg-bg transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          leaving ? "[clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0_0_0_0)]",
        )}
      >
        <div className="flex flex-col items-center gap-6">
          <span className="font-display text-display-2 tabular-nums text-fg">
            {String(progress).padStart(3, "0")}
          </span>
          <span className="block h-px w-40 overflow-hidden bg-line md:w-56">
            <span
              className="block h-full origin-left bg-accent"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
