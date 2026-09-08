import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollHighlightText } from "@/components/ui/ScrollHighlightText";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { sections } from "@/data/copy";

export function InnovativeDesign() {
  const copy = sections.innovative;

  return (
    <Section spacing="lg">
      <Container>
        <Reveal y={20}>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <ScrollHighlightText
            as="h2"
            text={copy.statement}
            className="font-display text-display-2 uppercase"
          />

          <Reveal delay={0.1} className="flex flex-col items-start gap-6 lg:pt-3">
            {copy.body.map((paragraph) => (
              <p key={paragraph} className="text-fg-muted">
                {paragraph}
              </p>
            ))}
            <Magnetic>
              <ButtonLink href="/about" variant="outline" arrow>
                {copy.ctaLabel}
              </ButtonLink>
            </Magnetic>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
