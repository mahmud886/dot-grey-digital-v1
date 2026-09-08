import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";

export type ProcessStep = { title: string; body: string };

export function ProcessSteps({
  steps,
  label = "How we work",
  title = "A process you can plan around",
  bg = "elev",
}: {
  steps: ProcessStep[];
  label?: string;
  title?: string;
  bg?: "transparent" | "elev";
}) {
  return (
    <Section spacing="lg" bg={bg} bordered>
      <Container>
        <SectionHeading label={label} title={title} />

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="bg-bg p-8 md:p-9">
              <span className="font-display text-h2 text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-display text-h3 text-fg">{step.title}</h3>
              <p className="mt-3 text-fg-muted">{step.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
