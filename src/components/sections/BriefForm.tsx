"use client";

import { useActionState } from "react";
import { submitBrief, type BriefState } from "@/app/actions/brief";
import { Field, SelectField, Honeypot } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { budgetOptions, serviceOptions, timelineOptions } from "@/data/site";
import { sections } from "@/data/copy";

const initial: BriefState = { status: "idle" };

export function BriefForm() {
  const [state, formAction] = useActionState(submitBrief, initial);
  const errors = state.fieldErrors ?? {};
  // After a rejected submit the inputs would otherwise come back empty, throwing away
  // everything the visitor typed. Text inputs keep their DOM value across a re-render,
  // but React ignores a changed `defaultValue` on an uncontrolled <select> — so the
  // selects are keyed on their restored value, which remounts just those two.
  const prev = state.values ?? {};

  return (
    <form action={formAction} className="relative flex flex-col gap-7" noValidate>
      <Honeypot />

      <div className="grid gap-7 sm:grid-cols-2">
        <Field name="fullName"
        defaultValue={prev.fullName} label="Full name" required error={errors.fullName} placeholder="Jane Doe" />
        <Field name="email"
        defaultValue={prev.email} label="Email" type="email" required error={errors.email} placeholder="jane@company.com" />
      </div>

      <Field name="company"
        defaultValue={prev.company} label="Company" error={errors.company} placeholder="Acme Inc." />

      <div className="grid gap-7 sm:grid-cols-2">
        <SelectField
          key={`service-${prev.service ?? ""}`}
          name="service"
          defaultValue={prev.service}
          label="Service required"
          options={serviceOptions}
          placeholder="Select a service"
          required
          error={errors.service}
        />
        <SelectField
          key={`budget-${prev.budget ?? ""}`}
          name="budget"
          defaultValue={prev.budget}
          label="Project budget"
          options={budgetOptions}
          placeholder="Select a range"
          required
          error={errors.budget}
        />
      </div>

      <SelectField
        key={`timeline-${prev.timeline ?? ""}`}
        name="timeline"
        label="Timeline"
        options={timelineOptions}
        placeholder="When do you need it?"
        error={errors.timeline}
      />

      <Field
        name="message"
        defaultValue={prev.message}
        label="Project details"
        as="textarea"
        rows={4}
        required
        error={errors.message}
        placeholder="Tell us what you are building and when you need it."
      />

      <div className="flex flex-wrap items-center gap-5">
        <SubmitButton label={sections.projectForm.submitLabel} />
        {state.message ? (
          <p role="status" className={state.status === "success" ? "text-accent" : "text-red-500"}>
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
