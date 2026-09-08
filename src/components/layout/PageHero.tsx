import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";

export type Crumb = { label: string; href?: string };

export function PageHero({
  title,
  breadcrumbs = [],
  lead,
  meta,
}: {
  title: string;
  breadcrumbs?: Crumb[];
  lead?: string;
  meta?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-bg-elev pt-32 pb-16 md:pt-44 md:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 light:hidden">
        <Image
          src="/img/page-backdrop.svg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-elev via-bg-elev/70 to-bg-elev/30" />
      </div>

      <Container className="relative">
        {breadcrumbs.length ? (
          <Reveal y={16}>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted">
                {breadcrumbs.map((crumb, i) => (
                  <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                    {crumb.href ? (
                      <Link href={crumb.href} className="transition-colors duration-300 hover:text-accent">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-accent">{crumb.label}</span>
                    )}
                    {i < breadcrumbs.length - 1 ? (
                      <span aria-hidden className="text-fg-subtle">/</span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        ) : null}

        <SplitText as="h1" text={title} trigger="mount" className="mt-6 block font-display text-h1 text-fg" />

        {lead ? (
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-body-lg text-fg-muted">{lead}</p>
          </Reveal>
        ) : null}

        {meta ? <Reveal delay={0.2}>{meta}</Reveal> : null}
      </Container>
    </section>
  );
}
