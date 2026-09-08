"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export type AccordionItem = { id: string; question: string; answer: string };

export function Accordion({
  items,
  defaultOpenId,
  className,
}: {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}) {
  const uid = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? items[0]?.id ?? null);

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => {
        const open = openId === item.id;
        const panelId = `${uid}-${item.id}-panel`;
        const buttonId = `${uid}-${item.id}-button`;

        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-h3 text-fg transition-colors duration-300 hover:text-accent"
              >
                {item.question}
                <span
                  aria-hidden
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border border-line transition-[transform,background-color,color,border-color] duration-400",
                    open ? "rotate-45 border-accent bg-accent text-accent-fg" : "text-fg-muted",
                  )}
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 text-fg-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
