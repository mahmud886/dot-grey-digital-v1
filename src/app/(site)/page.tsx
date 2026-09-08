import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { services } from "@/data/services";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Section spacing="sm" bordered>
        <Marquee
          items={services.map((service) => service.title)}
          className="font-display text-display-2 leading-none font-bold"
          outlined
        />
      </Section>
    </>
  );
}
