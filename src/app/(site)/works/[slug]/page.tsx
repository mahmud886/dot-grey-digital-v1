import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SplitText } from "@/components/ui/SplitText";
import { getNextWork, getWorkBySlug, works } from "@/data/works";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: PageProps<"/works/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return {};
  return { title: work.title, description: work.summary };
}

export default async function WorkDetailPage({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  const next = getNextWork(work.slug);
  const meta = [
    { label: "Client", value: work.client },
    { label: "Year", value: work.year },
    { label: "Duration", value: work.duration },
    { label: "Team", value: work.team },
    { label: "Our role", value: work.role },
    { label: "Services", value: work.services.join(", ") },
  ];

  return (
    <>
      <PageHero
        title={work.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Works", href: "/works" },
          { label: work.title },
        ]}
        lead={work.summary}
        meta={
          <dl className="mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-subtle">
                  {item.label}
                </dt>
                <dd className="mt-2 text-fg">{item.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <Section spacing="md">
        <Container size="wide">
          <Reveal className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line bg-bg-card">
            <Image
              src={work.cover}
              alt={work.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </Reveal>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2 className="font-display text-h1 text-fg">The challenge</h2>
              <p className="mt-5 text-body-lg text-fg-muted">{work.challenge}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-h1 text-fg">What we did</h2>
              <p className="mt-5 text-body-lg text-fg-muted">{work.solution}</p>
            </Reveal>
          </div>

          <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-20 md:grid-cols-3">
            {work.stats.map((stat) => (
              <div key={stat.label} className="bg-bg p-8 md:p-9">
                <p className="font-display text-h1 uppercase text-accent">{stat.value}</p>
                <p className="mt-3 text-fg-muted">{stat.label}</p>
              </div>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section spacing="lg" bg="elev" bordered>
        <Container>
          <SectionHeading label="Approach" title="How we got there" />
          <RevealGroup className="mt-14 md:mt-20">
            {work.approach.map((step, i) => (
              <div
                key={step.title}
                className="group grid gap-3 border-t border-line py-8 last:border-b md:grid-cols-[auto_1fr_2fr] md:items-baseline md:gap-10"
              >
                <span className="font-display text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-h2 text-fg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:translate-x-2">
                  {step.title}
                </h3>
                <p className="text-fg-muted">{step.body}</p>
              </div>
            ))}
          </RevealGroup>

          <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-[7fr_5fr] lg:gap-20">
            <Reveal>
              <h2 className="font-display text-h2 text-fg">What we delivered</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {work.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-fg-muted">
                    <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-accent">
                      <svg aria-hidden viewBox="0 0 20 20" className="size-3 text-accent-fg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m4 10.5 4 4 8-9" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-display text-h2 text-fg">Tools</h2>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {work.tools.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-full border border-line px-4 py-2 font-display text-eyebrow font-semibold tracking-[0.14em] uppercase text-fg-muted"
                  >
                    {tool}
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 font-display text-h2 text-fg">Outcome</h2>
              <p className="mt-5 text-body-lg text-fg-muted">{work.outcome}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <SectionHeading label="Gallery" title="A closer look" className="mb-14 md:mb-20" />
          <RevealGroup className="grid gap-6 md:grid-cols-2">
            {work.gallery.map((src, i) => (
              <div
                key={src}
                className={
                  i === 0
                    ? "relative col-span-full aspect-[16/9] overflow-hidden rounded-3xl border border-line bg-bg-card"
                    : "relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-bg-card"
                }
              >
                <Image
                  src={src}
                  alt={`${work.title} — image ${i + 1}`}
                  fill
                  sizes={i === 0 ? "100vw" : "(max-width: 767px) 100vw, 50vw"}
                  className="object-cover"
                />
              </div>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
            <figure className="mx-auto mt-16 max-w-3xl text-center md:mt-24">
              <blockquote className="font-display text-h2 text-fg">
                <p>&ldquo;{work.quote.text}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-7 text-fg-muted">
                <span className="text-fg">{work.quote.author}</span> — {work.quote.role}
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </Section>

      <Link
        href={`/works/${next.slug}`}
        data-cursor="VIEW"
        className="group relative block overflow-hidden border-t border-line py-24 md:py-32"
      >
        <Image
          src={next.cover}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:opacity-40"
        />
        <div aria-hidden className="absolute inset-0 bg-bg/70" />
        <Container className="relative text-center">
          <span className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-accent">
            Next project
          </span>
          <SplitText
            as="h2"
            text={next.title}
            className="mt-5 block font-display text-display-2 text-fg"
          />
        </Container>
      </Link>
    </>
  );
}
