import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { SplitText } from "./SplitText";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

export function SectionHeading({
  label,
  title,
  lead,
  action,
  align = "left",
  className,
  titleClassName,
}: {
  label?: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-7 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {label ? (
          <Reveal y={20}>
            <Eyebrow>{label}</Eyebrow>
          </Reveal>
        ) : null}
        <SplitText
          as="h2"
          text={title}
          className={cn("mt-5 block font-display text-h1 text-fg", titleClassName)}
        />
        {lead ? (
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-fg-muted">{lead}</p>
          </Reveal>
        ) : null}
      </div>
      {action ? <Reveal delay={0.15}>{action}</Reveal> : null}
    </div>
  );
}
