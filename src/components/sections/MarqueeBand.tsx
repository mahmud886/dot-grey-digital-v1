import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { sections } from "@/data/copy";

export function MarqueeBand() {
  const { items } = sections.marquee;

  return (
    <Section spacing="sm" bordered className="overflow-hidden">
      <Marquee
        items={items}
        speed={38}
        outlined
        className="font-display text-display-2 leading-none font-semibold tracking-[0.02em]"
      />
      <Marquee
        items={items}
        speed={50}
        direction="right"
        className="mt-2 font-display text-display-2 leading-none font-semibold tracking-[0.02em] text-fg/10 md:mt-4"
      />
    </Section>
  );
}
