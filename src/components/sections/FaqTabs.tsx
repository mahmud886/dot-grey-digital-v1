"use client";

import { useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { faqCategories, faqs } from "@/data/faq";
import { cn } from "@/lib/cn";

export function FaqTabs() {
  const [active, setActive] = useState(faqCategories[0]);
  const items = faqs
    .filter((f) => f.category === active)
    .map((f) => ({ id: f.id, question: f.question, answer: f.answer }));

  return (
    <>
      <div role="tablist" aria-label="FAQ categories" className="flex flex-wrap gap-2.5">
        {faqCategories.map((category) => {
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

      <div className="mt-10">
        {/* Keyed so the accordion resets its open item when the category changes. */}
        <Accordion key={active} items={items} />
      </div>
    </>
  );
}
