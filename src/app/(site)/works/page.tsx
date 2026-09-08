import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { WorksFilterGrid } from "@/components/sections/WorksFilterGrid";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { pages } from "@/data/copy";

const copy = pages.works;

export const metadata: Metadata = { title: "Works", description: copy.lead };

export default function WorksPage() {
  return (
    <>
      <PageHero
        title={copy.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Works" }]}
        lead={copy.lead}
      />
      <Section spacing="lg">
        <Container>
          <h2 className="sr-only">All projects</h2>
          <WorksFilterGrid />
        </Container>
      </Section>
      <ProjectForm />
    </>
  );
}
