"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { services, type Service } from "@/data/services";
import { cn } from "@/lib/cn";

/**
 * v1's Embla carousel, rebuilt as a scroll-scrubbed 3D stack [15].
 *
 * The active card sits upright and forward; its neighbours rotate away and drop back in Z.
 * Scroll position drives which card is active, so the hero animates as you enter the page
 * rather than waiting for a click. Dots still allow direct selection.
 *
 * Below `lg`, and under reduced motion, the same cards lay out as a plain grid — pinning a
 * hero on a small screen fights the user for their scroll. The markup does not change
 * between the two, only classes and whether the timeline exists, so a resize never asks
 * React to reconcile a tree GSAP has been transforming.
 */
export function HeroCardStack({ items = services }: { items?: Service[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [stacked, setStacked] = useState(false);

  useGSAP(
    () => {
      const el = wrapRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        setStacked(true);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            // The hero is at the top of the page, so anchor to the stack's own top edge —
            // "top 70%" is already satisfied at scrollY 0 and would start mid-sequence.
            start: "top top",
            end: `+=${items.length * 220}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setIndex(Math.min(items.length - 1, Math.floor(self.progress * items.length * 0.999)));
            },
          },
        });

        return () => {
          setStacked(false);
          setIndex(0);
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [items.length] },
  );

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2",
          stacked &&
            "relative mx-auto flex h-[420px] w-full max-w-lg items-center justify-center gap-0 sm:grid-cols-none",
        )}
        style={stacked ? { perspective: "1200px" } : undefined}
      >
        {items.map((service, i) => {
          if (!stacked) {
            // Only the first four make sense as a static grid beside the headline.
            if (i > 3) return null;
            return <StaticCard key={service.slug} service={service} />;
          }

          const offset = i - index;
          const abs = Math.abs(offset);

          return (
            <div
              key={service.slug}
              aria-hidden={offset !== 0}
              className="absolute inset-0 transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translateX(${offset * 27}%) translateZ(${-abs * 140}px) rotateY(${offset * -14}deg) scale(${1 - abs * 0.06})`,
                opacity: abs > 2 ? 0 : abs === 2 ? 0.55 : 1,
                filter: abs === 0 ? "none" : `blur(${abs * 1.2}px)`,
                zIndex: items.length - abs,
                pointerEvents: offset === 0 ? "auto" : "none",
              }}
            >
              <StackCard service={service} active={offset === 0} />
            </div>
          );
        })}
      </div>

      {stacked ? (
        <div className="mt-8 flex justify-center gap-3">
          {items.map((service, i) => (
            <button
              key={service.slug}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${service.title}`}
              aria-current={i === index}
              className="grid size-6 place-items-center"
            >
              <span
                aria-hidden
                className={cn(
                  "block h-2.5 rounded-full border border-accent transition-[width,background-color] duration-400",
                  i === index ? "w-8 bg-accent" : "w-2.5 bg-transparent hover:bg-accent/30",
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StackCard({ service, active }: { service: Service; active: boolean }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      tabIndex={active ? 0 : -1}
      data-cursor="VIEW"
      className="flex h-full w-full flex-col items-center justify-center gap-6 rounded-[2rem] border border-white/60 bg-white p-10 text-center shadow-2xl shadow-black/40"
    >
      <AnimatedIcon
        name={service.icon}
        size="lg"
        ring
        className="bg-accent/10 text-accent-strong"
      />
      {/* Styled as a heading but not one: this sits directly under the page h1, and a
          real h3 here would skip a level in the document outline. */}
      <p className="font-display text-h2 leading-tight uppercase text-accent-strong">{service.title}</p>
      <p className="max-w-xs text-sm leading-relaxed text-neutral-600">{service.blurb}</p>
    </Link>
  );
}

function StaticCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="card-glass flex flex-col gap-4 rounded-3xl p-6 transition-colors duration-300 hover:border-accent"
    >
      <AnimatedIcon name={service.icon} size="sm" />
      <p className="font-display text-h3 uppercase text-fg">{service.title}</p>
      <p className="text-sm text-fg-muted">{service.blurb}</p>
    </Link>
  );
}
