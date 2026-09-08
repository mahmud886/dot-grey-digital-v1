import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

export type ProseBlock = { heading: string; paragraphs: string[]; bullets: string[] };

export function ProseLayout({
  updated,
  notice,
  blocks,
}: {
  updated: string;
  notice?: string;
  blocks: ProseBlock[];
}) {
  return (
    <Section spacing="lg">
      <Container size="narrow">
        {notice ? (
          <Reveal className="rounded-2xl border border-accent/40 bg-accent-dim p-5">
            <p className="text-sm text-fg">{notice}</p>
          </Reveal>
        ) : null}

        <Reveal delay={0.05}>
          <p className="mt-10 text-sm text-fg-subtle">Last updated {updated}</p>

          <div className="mt-6 flex flex-col gap-10">
            {blocks.map((block) => (
              <section key={block.heading}>
                <h2 className="font-display text-h2 text-fg">{block.heading}</h2>

                {block.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-fg-muted">
                    {paragraph}
                  </p>
                ))}

                {block.bullets.length ? (
                  <ul className="mt-4 flex flex-col gap-2">
                    {block.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-fg-muted">
                        <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <p className="mt-10">
            <a className="text-accent" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
