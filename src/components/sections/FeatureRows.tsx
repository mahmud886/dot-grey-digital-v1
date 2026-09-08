"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { sections } from "@/data/copy";
import { cn } from "@/lib/cn";

/**
 * v1's three free-offer rows, kept as content and given scroll motion [17]: the icon tile
 * scales down as the row centres, the copy slides in from the opposite side, and the
 * orange bloom behind the tile brightens.
 */
export function FeatureRows() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { rows } = sections.featureRows;

  useGSAP(
    () => {
      const root = ref.current;
      if (reduced || !root) return;

      root.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
        const tile = row.querySelector<HTMLElement>("[data-tile]");
        const bloom = row.querySelector<HTMLElement>("[data-bloom]");
        if (!tile) return;

        gsap.fromTo(
          tile,
          { scale: 1.15, rotate: -6 },
          {
            scale: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top bottom", end: "center center", scrub: 0.5 },
          },
        );

        if (bloom) {
          gsap.fromTo(
            bloom,
            { opacity: 0.25, scale: 0.8 },
            {
              opacity: 1,
              scale: 1.1,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top bottom", end: "center center", scrub: 0.5 },
            },
          );
        }
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <Section spacing="lg">
      <Container>
        <div ref={ref} className="flex flex-col gap-24 md:gap-36">
          {rows.map((row, i) => {
            const flip = i % 2 === 1;

            return (
              <div
                key={row.title}
                data-row
                className={cn(
                  "grid items-center gap-12 lg:grid-cols-2 lg:gap-20",
                  flip && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div className="min-w-0">
                  <Reveal y={20}>
                    <Eyebrow dot={false}>{row.eyebrow}</Eyebrow>
                  </Reveal>

                  <h2 className="mt-4 font-display text-h1 text-fg">
                    <SplitText text={row.title} className="block" />{" "}
                    <SplitText text={row.accent} className="block text-accent" delay={0.15} />
                  </h2>

                  <Reveal delay={0.1}>
                    <p className="mt-6 max-w-lg text-fg-muted">{row.lead}</p>
                  </Reveal>

                  <Reveal delay={0.15}>
                    <ul className="mt-7 flex flex-col gap-3">
                      {row.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-3 text-fg">
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent">
                            <svg aria-hidden viewBox="0 0 20 20" className="size-3 text-accent-fg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m4 10.5 4 4 8-9" />
                            </svg>
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal delay={0.2} className="mt-9">
                    <Magnetic>
                      <ButtonLink href={row.cta.href}>{row.cta.label}</ButtonLink>
                    </Magnetic>
                  </Reveal>
                </div>

                <div className="relative grid min-h-[280px] place-items-center md:min-h-[380px]">
                  <span
                    data-bloom
                    aria-hidden
                    className="absolute size-[min(80%,340px)] rounded-full bg-[radial-gradient(closest-side,var(--accent),transparent_70%)] opacity-40 blur-2xl"
                  />
                  <span data-tile className="relative">
                    <AnimatedIcon
                      name={row.icon}
                      seed={i * 2 + 1}
                      size="lg"
                      variant="solid"
                      ring
                      className="size-32 rounded-[2rem] shadow-2xl shadow-accent/30 md:size-40 [&>svg]:size-14 md:[&>svg]:size-16"
                    />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
