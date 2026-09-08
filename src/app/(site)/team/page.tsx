import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { jobs } from "@/data/jobs";
import { pages } from "@/data/copy";

const copy = pages.team;

export const metadata: Metadata = { title: "Team", description: copy.lead };

export default function TeamPage() {
  return (
    <>
      <PageHero
        title={copy.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Team" }]}
        lead={copy.lead}
      />

      <TeamGrid label="Team" title="Everyone at DotGrey" />

      <Section spacing="md" bg="elev" bordered>
        <Container>
          <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-h2 text-fg">{copy.hiringTitle}</h2>
              <p className="mt-3 text-fg-muted">
                {jobs.length} {copy.hiringBody}
              </p>
            </div>
            <Magnetic>
              <ButtonLink href="/careers" arrow>
                {copy.hiringCtaLabel}
              </ButtonLink>
            </Magnetic>
          </Reveal>
        </Container>
      </Section>

      <ProjectForm />
    </>
  );
}
