"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import s from "./lab.module.css";

/**
 * A round "Open ↗" badge that follows the pointer over prototype cards. Mouse only — touch
 * and reduced-motion visitors get the plain buttons, which are always there anyway.
 */
export function CardCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const over = (e.target as Element | null)?.closest?.("[data-cursor] a[aria-label]");
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      el.dataset.on = over ? "true" : "false";
    };
    const leave = () => (el.dataset.on = "false");
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [reduced]);

  return (
    <div ref={ref} className={s.cursor} data-on="false" aria-hidden="true">
      Open ↗
    </div>
  );
}
