import Image from "next/image";
import Link from "next/link";
import { TiltCard } from "./TiltCard";
import type { Work } from "@/data/works";
import { cn } from "@/lib/cn";

export function WorkCard({
  work,
  priority = false,
  className,
}: {
  work: Work;
  /** Set on the first card in a grid so the LCP image is not lazy-loaded. */
  priority?: boolean;
  className?: string;
}) {
  return (
    <TiltCard className={cn("rounded-3xl", className)}>
      <Link
        href={`/works/${work.slug}`}
        data-cursor="VIEW"
        className="group block rounded-3xl"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-bg-card">
          <Image
            src={work.cover}
            alt={work.title}
            fill
            priority={priority}
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 rounded-full bg-bg/80 px-3.5 py-1.5 font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg backdrop-blur-md">
            {work.category}
          </span>
        </div>

        <div className="mt-6 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h3 className="font-display text-h2 text-fg transition-colors duration-300 group-hover:text-accent">
              {work.title}
            </h3>
            <p className="mt-2 max-w-md text-fg-muted">{work.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-3 py-1 font-display text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-fg-subtle"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          <span className="shrink-0 font-display text-sm text-fg-subtle">{work.year}</span>
        </div>
      </Link>
    </TiltCard>
  );
}
