import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { FaqTabs } from "@/components/sections/FaqTabs";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { pages } from "@/data/copy";

const copy = pages.faq;

export const metadata: Metadata = { title: "FAQ", description: copy.lead };

export default function FaqPage() {
  return (
    <>
      <PageHero
        title={copy.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        lead={copy.lead}
      />

      <Section spacing="lg">
        <Container>
          <h2 className="sr-only">Questions and answers</h2>
          <FaqTabs />

          <Reveal className="card-glass mt-16 rounded-3xl p-8 md:mt-20 md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="font-display text-h2 text-fg">{copy.stillTitle}</h2>
                <p className="mt-3 max-w-lg text-fg-muted">{copy.stillBody}</p>
              </div>
              <Magnetic>
                <ButtonLink href="/contact" arrow>
                  {copy.stillCtaLabel}
                </ButtonLink>
              </Magnetic>
            </div>
          </Reveal>
        </Container>
      </Section>

      <ProjectForm />
    </>
  );
}
