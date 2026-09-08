"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Scroll entrance [10]. Renders in its final state under reduced motion. */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  y = 40,
  className,
  children,
}: {
  as?: ElementType;
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration: 0.8,
        delay,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    },
    { scope: ref, dependencies: [reduced, delay, y] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Staggers direct children instead of moving the block as one [11]. */
export function RevealGroup({
  as: Tag = "div",
  stagger = 0.08,
  y = 40,
  className,
  children,
}: {
  as?: ElementType;
  stagger?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el || el.children.length === 0) return;
      gsap.from(Array.from(el.children), {
        opacity: 0,
        y,
        duration: 0.9,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    },
    { scope: ref, dependencies: [reduced, stagger, y] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
