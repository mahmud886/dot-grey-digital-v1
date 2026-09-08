import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ApplicationForm } from "@/components/sections/ApplicationForm";
import { benefits, getJobBySlug, jobs } from "@/data/jobs";
import { pages } from "@/data/copy";

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return {};
  return { title: job.title, description: job.summary };
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-display text-h2 text-fg">{title}</h2>
      <ul className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-fg-muted">
            <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  return (
    <>
      <PageHero
        title={job.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/careers" },
          { label: job.title },
        ]}
        lead={job.summary}
        meta={
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {[job.department, job.location, job.type].map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-line px-4 py-2 font-display text-eyebrow font-semibold tracking-[0.14em] uppercase text-fg-muted"
              >
                {chip}
              </li>
            ))}
          </ul>
        }
      />

      <Section spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[7fr_4fr] lg:gap-20">
            <Reveal className="flex flex-col gap-12">
              <List title="What you will do" items={job.responsibilities} />
              <List title="What we are looking for" items={job.requirements} />
              <List title="Nice to have" items={job.niceToHave} />
            </Reveal>

            <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
              <div className="card-glass rounded-3xl p-8 md:p-9">
                <h2 className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted">
                  Benefits
                </h2>
                <ul className="mt-6 flex flex-col gap-5">
                  {benefits.map((benefit) => (
                    <li key={benefit.title}>
                      <p className="text-fg">{benefit.title}</p>
                      <p className="mt-1 text-sm text-fg-muted">{benefit.body}</p>
                    </li>
                  ))}
                </ul>
                <a
                  href="#apply"
                  className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent-strong px-7 font-display text-eyebrow font-semibold tracking-[0.12em] uppercase text-accent-fg transition-colors duration-300 hover:bg-accent"
                >
                  Apply for this role
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section id="apply" spacing="lg" bg="elev" bordered>
        <Container size="narrow">
          <Reveal>
            <h2 className="font-display text-h1 text-fg">{pages.careers.applyTitle}</h2>
            <p className="mt-4 text-fg-muted">{pages.careers.applyBody}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <ApplicationForm role={job.title} />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
