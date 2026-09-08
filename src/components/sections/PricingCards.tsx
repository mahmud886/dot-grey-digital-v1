"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { plans, pricingModes, type BillingMode } from "@/data/pricing";
import { cn } from "@/lib/cn";

export function PricingCards({ bg = "transparent" }: { bg?: "transparent" | "elev" }) {
  const [mode, setMode] = useState<BillingMode>("monthly");
  const current = pricingModes.find((m) => m.id === mode) ?? pricingModes[0];

  return (
    <Section spacing="lg" bg={bg}>
      <Container>
        <SectionHeading
          label="Plans"
          title="Pick the shape that fits"
          action={
            <div
              role="radiogroup"
              aria-label="Billing type"
              className="relative inline-flex rounded-full border border-line p-1"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-accent transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  mode === "project" ? "translate-x-full" : "translate-x-0",
                )}
              />
              {pricingModes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "relative z-10 w-40 rounded-full py-2.5 font-display text-eyebrow font-semibold tracking-[0.12em] uppercase transition-colors duration-300",
                    mode === m.id ? "text-accent-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          }
        />

        <RevealGroup className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={cn(
                "flex flex-col rounded-3xl p-8 transition-colors duration-300 md:p-9",
                plan.featured
                  ? "border border-accent bg-bg-card lg:scale-[1.03]"
                  : "card-glass hover:border-line-strong",
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted">
                  {plan.name}
                </h3>
                {plan.featured ? (
                  <span className="rounded-full bg-accent px-3 py-1 font-display text-[0.625rem] font-bold tracking-[0.12em] uppercase text-accent-fg">
                    Most popular
                  </span>
                ) : null}
              </div>

              <p className="mt-6 font-display text-h1 text-fg tabular-nums">
                ${plan.price[mode].toLocaleString("en-US")}
                <span className="ml-1.5 font-body text-base font-normal text-fg-muted">
                  {current.suffix}
                </span>
              </p>

              <p className="mt-4 text-fg-muted">{plan.blurb}</p>

              <p className="mt-8 font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-subtle">
                What&rsquo;s included
              </p>
              <ul className="mt-4 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-fg-muted">
                    <svg aria-hidden viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m4 10.5 4 4 8-9" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="/contact"
                variant={plan.featured ? "solid" : "outline"}
                className="mt-9 w-full"
              >
                Start a project
              </ButtonLink>
            </article>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
