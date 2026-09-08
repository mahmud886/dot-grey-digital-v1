"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { gsap, useGSAP } from "@/lib/gsap";
import { services } from "@/data/services";
import { sections } from "@/data/copy";

/**
 * On desktop the section pins and vertical scroll drives the card row sideways [16].
 * Below `lg`, and under reduced motion, it is an ordinary grid.
 *
 * Both cases render the SAME DOM — only classes and the GSAP timeline differ. That
 * matters: `pin: true` inserts a pin-spacer wrapper into the DOM, so if React swapped the
 * subtree for a different tree on resize it would try to remove a node GSAP had moved and
 * throw ("client-side exception"). gsap.matchMedia() creates the pin only while the query
 * matches and reverts it — including the spacer — the moment it stops.
 */
export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const copy = sections.services;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden border-y border-line bg-bg-elev py-20 md:py-32 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-24"
    >
      <Container>
        <SectionHeading
          label={copy.eyebrow}
          title={copy.title}
          action={
            <Magnetic>
              <ButtonLink href="/services" variant="light" arrow>
                {copy.ctaLabel}
              </ButtonLink>
            </Magnetic>
          }
        />
      </Container>

      <div className="mt-14 md:mt-16 lg:overflow-hidden">
        <div
          ref={trackRef}
          className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-5 sm:grid-cols-2 md:px-8 lg:mx-0 lg:flex lg:w-max lg:max-w-none lg:gap-6 lg:pr-24 lg:pl-[max(2rem,calc((100vw-1200px)/2+2rem))]"
        >
          {services.map((service, i) => (
            <div key={service.slug} className="lg:w-[340px] lg:shrink-0">
              <ServiceCard service={service} featured={i === 1} seed={i} className="h-full" />
            </div>
          ))}
        </div>
      </div>

      <Container className="mt-10 hidden lg:block">
        <p className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-subtle">
          Scroll to explore &mdash; {services.length} services
        </p>
      </Container>
    </section>
  );
}
