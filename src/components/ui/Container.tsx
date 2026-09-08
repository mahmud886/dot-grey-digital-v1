import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const SIZES = {
  narrow: "max-w-3xl",
  default: "max-w-[1200px]",
  wide: "max-w-[1440px]",
} as const;

export function Container({
  as: Tag = "div",
  size = "default",
  className,
  children,
}: {
  as?: ElementType;
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("mx-auto w-full px-5 md:px-8", SIZES[size], className)}>{children}</Tag>
  );
}
