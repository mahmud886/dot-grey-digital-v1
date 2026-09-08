import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { Testimonials } from "@/components/sections/Testimonials";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { values } from "@/data/values";
import { pages } from "@/data/copy";

const copy = pages.about;

export const metadata: Metadata = {
  title: "About",
  description: copy.lead,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={copy.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        lead={copy.lead}
      />

      <Section spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal className="relative aspect-[6/7] overflow-hidden rounded-3xl border border-line bg-bg-card">
              <Image
                src={copy.storyImage}
                alt="Inside the DotGrey studio"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col justify-center gap-6">
              <h2 className="font-display text-h1 text-fg">{copy.storyTitle}</h2>
              {copy.storyParagraphs.map((paragraph, i) => (
                <p key={paragraph} className={i === 0 ? "text-body-lg text-fg-muted" : "text-fg-muted"}>
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      <StatsStrip bg="elev" />

      <Section spacing="lg">
        <Container>
          <SectionHeading label={copy.valuesLabel} title={copy.valuesTitle} />
          <RevealGroup className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="card-glass rounded-3xl p-8 transition-colors duration-300 hover:border-accent"
              >
                <h3 className="font-display text-h3 text-fg">{value.title}</h3>
                <p className="mt-4 text-fg-muted">{value.body}</p>
              </article>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <MarqueeBand />
      <TeamGrid limit={3} showCta title="Meet the team" />
      <Testimonials />
      <ProjectForm />
    </>
  );
}
