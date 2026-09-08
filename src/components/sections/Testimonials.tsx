"use client";

import { useCallback, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { testimonials } from "@/data/testimonials";
import { sections } from "@/data/copy";
import { cn } from "@/lib/cn";

export function Testimonials() {
  const reduced = useReducedMotion();
  const copy = sections.testimonials;

  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, align: "start", containScroll: "trimSnaps" },
    reduced ? [] : [Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  // Embla owns this state, so read it as an external store rather than mirroring it into
  // React state from an effect — which is what v1's Hero did, and what React Compiler's
  // set-state-in-effect rule flags.
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!embla) return () => {};
      embla.on("select", onChange).on("reInit", onChange);
      return () => {
        embla.off("select", onChange).off("reInit", onChange);
      };
    },
    [embla],
  );

  const selected = useSyncExternalStore(
    subscribe,
    () => embla?.selectedScrollSnap() ?? 0,
    () => 0,
  );

  const snapCount = useSyncExternalStore(
    subscribe,
    () => embla?.scrollSnapList().length ?? 0,
    () => 0,
  );

  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          label={copy.eyebrow}
          title={copy.title}
          action={
            <div className="flex gap-3">
              <ArrowButton label="Previous testimonial" onClick={() => embla?.scrollPrev()} direction="prev" />
              <ArrowButton label="Next testimonial" onClick={() => embla?.scrollNext()} direction="next" />
            </div>
          }
        />

        <div className="mt-14 md:mt-20" data-cursor="DRAG">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className="min-w-0 shrink-0 grow-0 basis-full pr-6 md:basis-[70%] lg:basis-1/2"
                >
                  <TestimonialCard item={item} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: snapCount }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === selected}
                onClick={() => embla?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-400",
                  i === selected ? "w-10 bg-accent" : "w-4 bg-line-strong hover:bg-fg-subtle",
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ArrowButton({
  label,
  onClick,
  direction,
}: {
  label: string;
  onClick: () => void;
  direction: "prev" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-12 place-items-center rounded-full border border-line text-fg transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-fg"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={cn("size-4", direction === "prev" && "rotate-180")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}
