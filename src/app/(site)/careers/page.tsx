import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { benefits, jobs } from "@/data/jobs";
import { pages } from "@/data/copy";

const copy = pages.careers;

export const metadata: Metadata = { title: "Careers", description: copy.lead };

export default function CareersPage() {
  return (
    <>
      <PageHero
        title={copy.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
        lead={copy.lead}
      />

      <Section spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal className="flex flex-col justify-center gap-6">
              <h2 className="font-display text-h1 text-fg">{copy.whyTitle}</h2>
              {copy.whyParagraphs.map((paragraph, i) => (
                <p key={paragraph} className={i === 0 ? "text-body-lg text-fg-muted" : "text-fg-muted"}>
                  {paragraph}
                </p>
              ))}
            </Reveal>

            <Reveal delay={0.1} className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-line bg-bg-card">
              <Image
                src={copy.cultureImage}
                alt="Inside the DotGrey studio"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>
          </div>

          <RevealGroup className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card-glass rounded-3xl p-7">
                <h3 className="font-display text-h3 text-fg">{benefit.title}</h3>
                <p className="mt-3 text-fg-muted">{benefit.body}</p>
              </div>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section spacing="lg" bg="elev" bordered>
        <Container>
          <SectionHeading label={copy.rolesLabel} title={`${jobs.length} positions open`} />

          <RevealGroup className="mt-14 border-t border-line md:mt-20">
            {jobs.map((job) => (
              <Link
                key={job.slug}
                href={`/careers/${job.slug}`}
                className="group grid gap-3 border-b border-line py-7 transition-colors duration-300 lg:grid-cols-[4fr_2fr_2fr_2fr_auto] lg:items-center lg:gap-8"
              >
                <h3 className="font-display text-h3 text-fg transition-colors duration-300 group-hover:text-accent">
                  {job.title}
                </h3>
                <span className="text-fg-muted">{job.department}</span>
                <span className="text-fg-muted">{job.location}</span>
                <span className="text-fg-muted">{job.type}</span>
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center justify-self-start rounded-full border border-line text-fg-muted transition-[transform,background-color,color,border-color] duration-400 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg lg:justify-self-end"
                >
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 8h12M9 3l5 5-5 5" />
                  </svg>
                </span>
              </Link>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <ProjectForm />
    </>
  );
}
