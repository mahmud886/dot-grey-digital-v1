"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { RevealGroup } from "@/components/ui/Reveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { services } from "@/data/services";
import { sections } from "@/data/copy";

/**
 * On desktop the section pins and vertical scroll drives the card row sideways [16].
 * Below `lg`, and under reduced motion, it is an ordinary grid — pinning takes the
 * scrollbar away from the user, which is only worth it when there is room for the payoff.
 */
export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const pinned = isDesktop && !reduced;
  const copy = sections.services;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!pinned || !section || !track) return;

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

      const tween = gsap.to(track, {
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

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef, dependencies: [pinned] },
  );

  const action = (
    <Magnetic>
      <ButtonLink href="/services" variant="light" arrow>
        {copy.ctaLabel}
      </ButtonLink>
    </Magnetic>
  );

  if (!pinned) {
    return (
      <Section id="services" spacing="lg" bg="elev" bordered>
        <Container>
          <SectionHeading label={copy.eyebrow} title={copy.title} action={action} />
          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} featured={i === 1} />
            ))}
          </RevealGroup>
        </Container>
      </Section>
    );
  }

  return (
    <div ref={sectionRef} className="relative overflow-hidden border-y border-line bg-bg-elev">
      <div className="flex min-h-svh flex-col justify-center py-24">
        <Container>
          <SectionHeading label={copy.eyebrow} title={copy.title} action={action} />
        </Container>

        <div className="mt-16 overflow-hidden">
          <div ref={trackRef} className="flex gap-6 pr-24 pl-[max(2rem,calc((100vw-1200px)/2+2rem))]">
            {services.map((service, i) => (
              <div key={service.slug} className="w-[340px] shrink-0">
                <ServiceCard service={service} featured={i === 1} className="h-full" />
              </div>
            ))}
          </div>
        </div>

        <Container className="mt-10">
          <p className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-subtle">
            Scroll to explore &mdash; {services.length} services
          </p>
        </Container>
      </div>
    </div>
  );
}
