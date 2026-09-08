"use client";

import { useMemo, useState } from "react";
import { WorkCard } from "@/components/ui/WorkCard";
import { workCategories, works } from "@/data/works";
import { pages } from "@/data/copy";
import { cn } from "@/lib/cn";

export function WorksFilterGrid() {
  const [active, setActive] = useState("All");

  const visible = useMemo(
    () => (active === "All" ? works : works.filter((w) => w.category === active)),
    [active],
  );

  return (
    <>
      <div role="tablist" aria-label="Filter work by category" className="flex flex-wrap gap-2.5">
        {workCategories.map((category) => {
          const selected = category === active;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(category)}
              className={cn(
                "rounded-full border px-5 py-2.5 font-display text-eyebrow font-semibold tracking-[0.14em] uppercase transition-colors duration-300",
                selected
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      {visible.length ? (
        <div className="mt-14 grid gap-x-8 gap-y-16 md:mt-20 lg:grid-cols-2">
          {visible.map((work, i) => (
            <WorkCard
              key={work.slug}
              work={work}
              priority={i === 0}
              className={cn(i % 2 === 1 && "lg:mt-20")}
            />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-body-lg text-fg-muted">{pages.works.emptyState}</p>
      )}
    </>
  );
}
