import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { Faq } from "@/components/sections/Faq";
import { pages } from "@/data/copy";

const copy = pages.contact;

export const metadata: Metadata = { title: "Contact", description: copy.lead };

export default function ContactPage() {
  return (
    <>
      <PageHero
        title={copy.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        lead={copy.lead}
      />

      <ProjectForm id="brief" />

      <Section spacing="none" bordered>
        {/* Deliberately not an embedded map — a styled tile grid keeps the page fast and
            avoids a third-party tracker. Swap for a real map if the client wants one. */}
        <div
          aria-hidden
          className="h-64 w-full bg-bg-elev bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] md:h-80"
        >
          <div className="grid h-full place-items-center">
            <span className="rounded-full border border-line bg-bg px-6 py-3 font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted">
              {copy.mapLabel}
            </span>
          </div>
        </div>
      </Section>

      <Container className="sr-only">
        <h2>Contact details</h2>
      </Container>

      <Faq limit={4} />
    </>
  );
}
