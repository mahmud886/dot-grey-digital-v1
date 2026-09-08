import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  dot = true,
  className,
}: {
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-eyebrow font-semibold uppercase text-accent",
        className,
      )}
    >
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-accent" /> : null}
      {children}
    </span>
  );
}
