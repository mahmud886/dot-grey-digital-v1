"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

export function SubmitButton({ label, className }: { label: string; className?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-14 items-center justify-center gap-3 rounded-full bg-accent-strong px-9 font-display text-sm font-semibold tracking-[0.1em] uppercase text-accent-fg transition-colors duration-300 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {pending ? "Sending…" : label}
    </button>
  );
}
