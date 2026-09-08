import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { RevealGroup } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Faq } from "@/components/sections/Faq";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { services } from "@/data/services";
import { pages } from "@/data/copy";

const copy = pages.services;

export const metadata: Metadata = {
  title: "Services",
  description: copy.lead,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title={copy.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        lead={copy.lead}
      />

      <Section spacing="lg">
        <Container>
          {/* The design has no visible heading above this grid, but the card titles are
              h3 — without an h2 the outline would jump a level. */}
          <h2 className="sr-only">All services</h2>
          <RevealGroup className="grid gap-6 md:grid-cols-2">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} featured={i === 1} seed={i} />
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <ProcessSteps
        steps={copy.process}
        label={copy.processLabel}
        title={copy.processTitle}
      />

      <Faq limit={4} />
      <ProjectForm />
    </>
  );
}
