import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const SPACING = {
  none: "",
  sm: "py-14 md:py-20",
  md: "py-20 md:py-32",
  lg: "py-24 md:py-40",
} as const;

const BG = {
  /* `transparent` lets the fixed ambient gradient show through — the default. */
  transparent: "",
  base: "bg-bg",
  elev: "bg-bg-elev",
  card: "bg-bg-card",
} as const;

export function Section({
  id,
  spacing = "md",
  bg = "transparent",
  bordered = false,
  className,
  children,
}: {
  id?: string;
  spacing?: keyof typeof SPACING;
  bg?: keyof typeof BG;
  bordered?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        SPACING[spacing],
        BG[bg],
        bordered && "border-y border-line",
        className,
      )}
    >
      {children}
    </section>
  );
}
