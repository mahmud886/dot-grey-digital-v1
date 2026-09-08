"use client";

import { Fragment, useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Splits into words (default) or explicit lines and slides each up out of a mask [3, 5, 12].
 * The gap between words is a real space rather than a margin, so the heading still reads
 * and copies as normal text — the mask spans are inline-block, and a margin would leave the
 * words run together in the DOM.
 */
export function SplitText({
  text,
  as: Tag = "span",
  by = "word",
  delay = 0,
  stagger = 0.045,
  trigger = "scroll",
  className,
  lineClassName,
}: {
  text: string | string[];
  as?: ElementType;
  by?: "word" | "line";
  delay?: number;
  stagger?: number;
  /** "scroll" animates on entering the viewport; "mount" animates immediately. */
  trigger?: "scroll" | "mount";
  className?: string;
  lineClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const parts = Array.isArray(text) ? text : by === "line" ? [text] : text.split(" ");
  const label = Array.isArray(text) ? text.join(" ") : text;

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;
      const targets = el.querySelectorAll<HTMLElement>("[data-split-inner]");
      if (!targets.length) return;

      gsap.from(targets, {
        yPercent: 110,
        duration: 0.9,
        delay,
        ease: "expo.out",
        stagger,
        ...(trigger === "scroll"
          ? { scrollTrigger: { trigger: el, start: "top 85%", once: true } }
          : {}),
      });
    },
    { scope: ref, dependencies: [reduced, delay, stagger, trigger, label] },
  );

  return (
    <Tag ref={ref} className={className} aria-label={label}>
      {parts.map((part, i) => (
        <Fragment key={`${part}-${i}`}>
          <span
            aria-hidden
            className={cn(
              "mask-line",
              by === "word" ? "inline-block align-bottom" : "block",
              lineClassName,
            )}
          >
            <span data-split-inner className="inline-block will-change-transform">
              {part}
            </span>
          </span>
          {by === "word" && i < parts.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
