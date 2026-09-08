import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { RevealGroup } from "@/components/ui/Reveal";
import { getAllDocs } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Internal reference for the DotGrey Digital website.",
  // Internal reference, not marketing — keep it out of search results.
  robots: { index: false, follow: false },
};

export default function DocsIndexPage() {
  const docs = getAllDocs();

  return (
    <>
      <PageHero
        title="Documentation"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Docs" }]}
        lead="The specs this site was built from — design tokens, section behaviour, the component inventory, the motion catalogue, and how to edit content."
      />

      <Section spacing="lg">
        <Container>
          <h2 className="sr-only">All documents</h2>
          <RevealGroup className="grid gap-6 md:grid-cols-2">
            {docs.map((doc, i) => (
              <Link
                key={doc.slug}
                href={`/docs/${doc.slug}`}
                className="card-glass group flex flex-col rounded-3xl p-8 transition-colors duration-300 hover:border-accent"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-display text-h3 text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="grid size-10 place-items-center rounded-full border border-line text-fg-muted transition-[transform,background-color,color,border-color] duration-400 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg"
                  >
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 8h12M9 3l5 5-5 5" />
                    </svg>
                  </span>
                </div>

                <h3 className="mt-6 font-display text-h3 text-fg transition-colors duration-300 group-hover:text-accent">
                  {doc.title}
                </h3>
                {doc.summary ? (
                  <p className="mt-3 line-clamp-3 flex-1 text-fg-muted">{doc.summary}</p>
                ) : null}

                <p className="mt-6 font-mono text-sm text-fg-subtle">{doc.file}</p>
              </Link>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    </>
  );
}
