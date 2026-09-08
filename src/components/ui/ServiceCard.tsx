import Link from "next/link";
import { Icon } from "./Icon";
import type { Service } from "@/data/services";
import { cn } from "@/lib/cn";

export function ServiceCard({
  service,
  featured = false,
  className,
}: {
  service: Service;
  featured?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      data-cursor="VIEW"
      className={cn(
        "group flex h-full flex-col rounded-3xl p-8 transition-[border-color,background-color,transform] duration-400 md:p-9",
        featured
          ? "border border-accent bg-accent text-accent-fg"
          : "card-glass hover:border-accent",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "grid size-14 place-items-center rounded-2xl transition-colors duration-400",
            featured
              ? "bg-accent-fg text-accent-strong"
              : "bg-accent-dim text-accent group-hover:bg-accent group-hover:text-accent-fg",
          )}
        >
          <Icon name={service.icon} className="size-7" />
        </span>
        <span
          className={cn(
            "font-display text-sm",
            featured ? "text-accent-fg/70" : "text-fg-subtle",
          )}
        >
          {service.number}
        </span>
      </div>

      <h3
        className={cn(
          "mt-7 font-display text-h3",
          featured ? "text-accent-fg" : "text-fg",
        )}
      >
        {service.title}
      </h3>

      <p className={cn("mt-3 flex-1 text-sm", featured ? "text-accent-fg/85" : "text-fg-muted")}>
        {service.blurb}
      </p>

      <span
        className={cn(
          "mt-8 inline-flex items-center gap-2 font-display text-eyebrow font-semibold tracking-[0.14em] uppercase transition-colors duration-300",
          featured ? "text-accent-fg" : "text-fg group-hover:text-accent",
        )}
      >
        Learn more
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 8h12M9 3l5 5-5 5" />
        </svg>
      </span>
    </Link>
  );
}
