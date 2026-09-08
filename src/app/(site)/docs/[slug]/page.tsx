import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Markdown } from "@/components/docs/Markdown";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DOC_SOURCES, getDoc } from "@/lib/docs";

export function generateStaticParams() {
  return DOC_SOURCES.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.summary, robots: { index: false, follow: false } };
}

export default async function DocPage({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const index = DOC_SOURCES.findIndex((d) => d.slug === slug);
  const previous = index > 0 ? DOC_SOURCES[index - 1] : null;
  const next = index < DOC_SOURCES.length - 1 ? DOC_SOURCES[index + 1] : null;

  return (
    <>
      <PageHero
        title={doc.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: doc.label },
        ]}
        meta={<p className="mt-6 font-mono text-sm text-fg-subtle">{doc.file}</p>}
      />

      <Section spacing="lg">
        <Container>
          {/* The single mobile column needs an explicit 0 minimum: an `auto` track is sized by
                its widest content, so a wide table would stretch the track instead of
                scrolling inside its own overflow container. */}
          <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
            <DocsSidebar docs={DOC_SOURCES} headings={doc.headings} />

            <div className="min-w-0">
              <Reveal>
                <article className="max-w-3xl">
                  <Markdown>{doc.body}</Markdown>
                </article>
              </Reveal>

              <nav
                aria-label="Pagination"
                className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
              >
                {previous ? (
                  <Link
                    href={`/docs/${previous.slug}`}
                    className="group rounded-2xl border border-line p-5 transition-colors duration-300 hover:border-accent"
                  >
                    <span className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-subtle">
                      Previous
                    </span>
                    <span className="mt-2 block font-display text-h3 text-fg transition-colors duration-300 group-hover:text-accent">
                      {previous.label}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}

                {next ? (
                  <Link
                    href={`/docs/${next.slug}`}
                    className="group rounded-2xl border border-line p-5 text-right transition-colors duration-300 hover:border-accent"
                  >
                    <span className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-subtle">
                      Next
                    </span>
                    <span className="mt-2 block font-display text-h3 text-fg transition-colors duration-300 group-hover:text-accent">
                      {next.label}
                    </span>
                  </Link>
                ) : null}
              </nav>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
