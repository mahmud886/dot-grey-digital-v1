"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Doc } from "@/lib/docs";
import { cn } from "@/lib/cn";

/**
 * Below `lg` this is a horizontally scrolling row of chips, so a ten-item list does not
 * push the article off the screen; from `lg` it becomes a sticky vertical rail with the
 * current document's contents nested underneath.
 */
export function DocsSidebar({
  docs,
  headings,
}: {
  docs: { slug: string; label: string }[];
  headings: Doc["headings"];
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
      <p className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-subtle">
        Documentation
      </p>

      <ul
        className={cn(
          "no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1",
          "lg:mt-5 lg:flex-col lg:gap-1 lg:overflow-x-visible lg:border-l lg:border-line lg:pb-0",
        )}
      >
        {docs.map((doc) => {
          const href = `/docs/${doc.slug}`;
          const active = pathname === href;

          return (
            <li key={doc.slug} className="shrink-0 lg:shrink">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-full border px-4 py-2 text-[0.9375rem] whitespace-nowrap transition-colors duration-200",
                  "lg:-ml-px lg:rounded-none lg:border-0 lg:border-l lg:px-0 lg:py-1.5 lg:pl-4",
                  active
                    ? "border-accent bg-accent text-accent-fg lg:bg-transparent lg:font-semibold lg:text-fg"
                    : "border-line text-fg-muted hover:border-line-strong hover:text-fg lg:border-transparent",
                )}
              >
                {doc.label}
              </Link>

              {active && headings.length ? (
                <ul className="mt-1 mb-2 hidden flex-col gap-1 lg:flex">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className="block py-1 pl-8 text-sm text-fg-subtle transition-colors duration-200 hover:text-accent"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
