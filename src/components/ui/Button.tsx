import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * `solid` uses --accent-strong rather than --accent: white on the brand orange measures
 * 3.1:1, which fails AA at button text sizes. The vivid --accent is still used for fills
 * behind large text. See docs/00-brand.md → "The contrast rule".
 */
const VARIANTS = {
  solid: "bg-accent-strong text-accent-fg hover:bg-accent",
  outline: "border border-line-strong text-fg hover:border-accent hover:text-accent",
  light: "bg-fg text-bg hover:bg-accent hover:text-accent-fg",
  ghost: "text-fg hover:text-accent",
} as const;

const SIZES = {
  sm: "h-10 px-5 text-[0.75rem]",
  md: "h-12 px-7 text-[0.8125rem]",
  lg: "h-14 px-9 text-sm",
} as const;

type Variant = keyof typeof VARIANTS;
type Size = keyof typeof SIZES;

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 8h12M9 3l5 5-5 5" />
    </svg>
  );
}

function classes(variant: Variant, size: Size, className?: string) {
  return cn(
    "group inline-flex items-center justify-center gap-2.5 rounded-full font-display font-semibold uppercase tracking-[0.1em] transition-colors duration-300",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "solid",
  size = "md",
  arrow = false,
  className,
  children,
  ...rest
}: CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "solid",
  size = "md",
  arrow = false,
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}
