import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { sections } from "@/data/copy";

export function MarqueeBand() {
  const { items } = sections.marquee;

  return (
    <Section spacing="sm" bordered className="overflow-hidden">
      {/* Outlined type is intentionally very low contrast, so the band is decorative and
          the services are announced once by the hidden list below. */}
      <Marquee
        items={items}
        speed={38}
        decorative
        outlined
        className="font-display text-display-2 leading-none font-semibold tracking-[0.02em]"
      />
      {/* Second row repeats the first purely as texture. */}
      <Marquee
        items={items}
        speed={50}
        decorative
        direction="right"
        className="mt-2 font-display text-display-2 leading-none font-semibold tracking-[0.02em] text-fg/10 md:mt-4"
      />
      <span className="sr-only">Our services: {items.join(", ")}</span>
    </Section>
  );
}
