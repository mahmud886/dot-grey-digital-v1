import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { getServiceBySlug, services } from "@/data/services";
import { pages } from "@/data/copy";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.title, description: service.lead };
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        title={service.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
        lead={service.lead}
        meta={
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {service.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line px-4 py-2 font-display text-eyebrow font-semibold tracking-[0.14em] uppercase text-fg-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        }
      />

      <Section spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-20">
            <Reveal className="flex flex-col gap-6">
              <h2 className="font-display text-h1 text-fg">Overview</h2>
              {service.overview.map((paragraph) => (
                <p key={paragraph} className="text-body-lg text-fg-muted">
                  {paragraph}
                </p>
              ))}
            </Reveal>

            <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
              <div className="card-glass rounded-3xl p-8 md:p-9">
                <h2 className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted">
                  What&rsquo;s included
                </h2>
                <ul className="mt-6 flex flex-col gap-4">
                  {service.included.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-fg">
                      <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-accent">
                        <svg aria-hidden viewBox="0 0 20 20" className="size-3 text-accent-fg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m4 10.5 4 4 8-9" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" bg="elev" bordered>
        <Container>
          <SectionHeading label="Capabilities" title="What you get" />
          <RevealGroup className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {service.features.map((feature) => (
              <article key={feature.title} className="card-glass rounded-3xl p-8">
                <span className="grid size-12 place-items-center rounded-2xl bg-accent-dim text-accent">
                  <Icon name={feature.icon} className="size-6" />
                </span>
                <h3 className="mt-6 font-display text-h3 text-fg">{feature.title}</h3>
                <p className="mt-3 text-fg-muted">{feature.description}</p>
              </article>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <SectionHeading label="Why it matters" title="What it changes" />
          <RevealGroup className="mt-14 flex flex-col md:mt-20">
            {service.benefits.map((benefit, i) => (
              <div
                key={benefit.title}
                className="grid gap-4 border-t border-line py-8 last:border-b md:grid-cols-[auto_1fr_2fr] md:items-start md:gap-10"
              >
                <span className="font-display text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-h2 text-fg">{benefit.title}</h3>
                <p className="text-fg-muted">{benefit.description}</p>
              </div>
            ))}
          </RevealGroup>

          <Reveal className="mt-14">
            <h3 className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted">
              Industries we do this for
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {service.industries.map((industry) => (
                <li
                  key={industry}
                  className="rounded-full bg-accent-dim px-4 py-2 font-display text-eyebrow font-semibold tracking-[0.14em] uppercase text-accent"
                >
                  {industry}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      <ProcessSteps
        steps={pages.services.process}
        label="Process"
        title={`How a ${service.title.toLowerCase()} engagement runs`}
      />

      <Section spacing="lg">
        <Container>
          <SectionHeading label="Related" title="Other things we do" />
          <RevealGroup className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="card-glass group rounded-3xl p-8 transition-colors duration-300 hover:border-accent"
              >
                <span className="font-display text-h3 text-accent">{item.number}</span>
                <h3 className="mt-5 font-display text-h3 text-fg transition-colors duration-300 group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="mt-3 text-fg-muted">{item.blurb}</p>
              </Link>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <ProjectForm />
    </>
  );
}
