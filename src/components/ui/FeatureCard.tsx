"use client";

import { AnimatedIcon } from "./AnimatedIcon";
import { TiltCard } from "./TiltCard";
import type { Feature } from "@/data/services";

/**
 * Feature card with the tilt-and-glare treatment used on the works grid, plus a sweep of
 * accent light across the surface on hover [32].
 */
export function FeatureCard({ feature, seed = 0 }: { feature: Feature; seed?: number }) {
  return (
    <TiltCard className="h-full rounded-3xl" max={6}>
      <article className="card-glass group relative h-full overflow-hidden rounded-3xl p-8 transition-colors duration-400 hover:border-accent">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/10 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full"
        />
        <AnimatedIcon name={feature.icon} seed={seed} ring />
        <h3 className="mt-6 font-display text-h3 text-fg transition-colors duration-300 group-hover:text-accent">
          {feature.title}
        </h3>
        <p className="mt-3 text-fg-muted">{feature.description}</p>
      </article>
    </TiltCard>
  );
}
