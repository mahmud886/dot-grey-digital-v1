import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { faqs, type FaqCategory } from "@/data/faq";
import { sections } from "@/data/copy";

export function Faq({
  limit = 5,
  category,
  bg = "transparent",
}: {
  limit?: number;
  category?: FaqCategory;
  bg?: "transparent" | "elev";
}) {
  const copy = sections.faq;
  const items = (category ? faqs.filter((f) => f.category === category) : faqs)
    .slice(0, limit)
    .map((f) => ({ id: f.id, question: f.question, answer: f.answer }));

  return (
    <Section id="faq" spacing="lg" bg={bg}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal y={20}>
              <Eyebrow>{copy.eyebrow}</Eyebrow>
            </Reveal>
            <SplitText as="h2" text={copy.title} className="mt-5 block font-display text-h1 text-fg" />

            <Reveal delay={0.1} className="card-glass mt-9 rounded-3xl p-8">
              <p className="font-display text-h3 text-fg">{copy.cardTitle}</p>
              <p className="mt-3 text-fg-muted">{copy.cardBody}</p>
              <Magnetic className="mt-7">
                <ButtonLink href="/contact" arrow>
                  {copy.ctaLabel}
                </ButtonLink>
              </Magnetic>
            </Reveal>
          </div>

          <Reveal delay={0.05}>
            <Accordion items={items} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
