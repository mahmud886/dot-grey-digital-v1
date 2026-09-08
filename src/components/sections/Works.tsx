import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { WorkCard } from "@/components/ui/WorkCard";
import { works } from "@/data/works";
import { sections } from "@/data/copy";
import { cn } from "@/lib/cn";

export function Works({ limit = 4 }: { limit?: number }) {
  const copy = sections.works;

  return (
    <Section id="works" spacing="lg">
      <Container>
        <SectionHeading label={copy.eyebrow} title={copy.title} lead={copy.lead} />

        <RevealGroup stagger={0.09} className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 lg:grid-cols-2">
          {works.slice(0, limit).map((work, i) => (
            <WorkCard
              key={work.slug}
              work={work}
              priority={i === 0}
              // Offset the second column so the grid does not read as a table.
              className={cn(i % 2 === 1 && "lg:mt-20")}
            />
          ))}
        </RevealGroup>

        <Reveal className="mt-20 flex justify-center">
          <Magnetic>
            <ButtonLink href="/works" size="lg" arrow>
              {copy.ctaLabel}
            </ButtonLink>
          </Magnetic>
        </Reveal>
      </Container>
    </Section>
  );
}
