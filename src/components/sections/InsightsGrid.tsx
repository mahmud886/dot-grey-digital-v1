"use client";

import { useMemo, useState } from "react";
import { PostCard } from "@/components/ui/PostCard";
import { postCategories, posts } from "@/data/insights";
import { cn } from "@/lib/cn";

export function InsightsGrid() {
  const [active, setActive] = useState("All");

  const visible = useMemo(
    () => (active === "All" ? posts : posts.filter((p) => p.category === active)),
    [active],
  );

  return (
    <>
      <div role="tablist" aria-label="Filter writing by category" className="flex flex-wrap gap-2.5">
        {postCategories.map((category) => {
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
        <div className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post, i) => (
            <PostCard key={post.slug} post={post} priority={i === 0} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-body-lg text-fg-muted">Nothing here yet — try another filter.</p>
      )}
    </>
  );
}
