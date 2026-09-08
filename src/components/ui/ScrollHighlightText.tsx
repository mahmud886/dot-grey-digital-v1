"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/** Words fade from subtle to full colour as the block scrolls through the viewport [13]. */
export function ScrollHighlightText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;
      gsap.fromTo(
        el.querySelectorAll("[data-hl]"),
        { color: "var(--fg-subtle)" },
        {
          color: "var(--fg)",
          ease: "none",
          stagger: 0.4,
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: 0.4 },
        },
      );
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <p ref={ref} className={cn("text-fg", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} data-hl className="text-fg-subtle">
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
