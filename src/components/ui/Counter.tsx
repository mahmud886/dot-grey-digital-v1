"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Counts up once when it enters the viewport [20]. */
export function Counter({
  to,
  suffix = "",
  duration = 2,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);

  useGSAP(
    () => {
      if (reduced || !ref.current) {
        setValue(to);
        return;
      }
      const box = { n: 0 };
      gsap.to(box, {
        n: to,
        duration,
        ease: "expo.out",
        onUpdate: () => setValue(Math.round(box.n)),
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { scope: ref, dependencies: [to, duration, reduced] },
  );

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
