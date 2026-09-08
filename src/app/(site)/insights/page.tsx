import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { InsightsGrid } from "@/components/sections/InsightsGrid";
import { ProjectForm } from "@/components/sections/ProjectForm";

const lead =
  "Notes on design, engineering and running a small studio. Written by the people doing the work, not a content team.";

export const metadata: Metadata = { title: "Insights", description: lead };

export default function InsightsPage() {
  return (
    <>
      <PageHero
        title="Insights"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
        lead={lead}
      />

      <Section spacing="lg">
        <Container>
          <h2 className="sr-only">All writing</h2>
          <InsightsGrid />
        </Container>
      </Section>

      <ProjectForm />
    </>
  );
}
