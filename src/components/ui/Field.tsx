"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type BaseProps = {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
};

function labelClasses() {
  return "block font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted";
}

export function Field({
  name,
  label,
  type = "text",
  as = "input",
  rows = 4,
  required,
  error,
  className,
  placeholder,
}: BaseProps & { type?: string; as?: "input" | "textarea"; rows?: number; placeholder?: string }) {
  const id = useId();
  const errorId = `${id}-error`;
  const shared = cn(
    "w-full border-b bg-transparent pt-2 pb-3 text-fg placeholder:text-fg-subtle transition-colors duration-300 focus:border-accent focus:outline-none",
    error ? "border-red-500" : "border-line",
  );

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClasses()}>
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(shared, "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={shared}
        />
      )}

      {error ? (
        <p id={errorId} className="mt-2 text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  name,
  label,
  options,
  placeholder = "Select an option",
  required,
  error,
  className,
}: BaseProps & { options: string[]; placeholder?: string }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClasses()}>
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </label>

      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          defaultValue=""
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full appearance-none border-b bg-transparent pt-2 pr-8 pb-3 text-fg transition-colors duration-300 focus:border-accent focus:outline-none",
            error ? "border-red-500" : "border-line",
          )}
        >
          <option value="" disabled className="bg-bg text-fg">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-bg text-fg">
              {option}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-fg-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {error ? (
        <p id={errorId} className="mt-2 text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Off-screen honeypot. Real users never see or focus it. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="website-field">Website</label>
      <input id="website-field" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
