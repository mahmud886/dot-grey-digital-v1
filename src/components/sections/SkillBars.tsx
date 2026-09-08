"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Skill } from "@/data/team";

export function SkillBars({ skills }: { skills: Skill[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;
      gsap.from(el.querySelectorAll("[data-bar]"), {
        scaleX: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <div ref={ref} className="flex flex-col gap-6">
      {skills.map((skill) => (
        <div key={skill.label}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-fg">{skill.label}</span>
            <span className="text-sm text-fg-muted tabular-nums">{skill.value}%</span>
          </div>
          <div
            role="meter"
            aria-valuenow={skill.value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={skill.label}
            className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line"
          >
            <span
              data-bar
              className="block h-full origin-left rounded-full bg-accent"
              style={{ width: `${skill.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
