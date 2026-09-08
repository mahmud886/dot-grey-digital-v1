"use client";

import { useActionState } from "react";
import { submitApplication, type ApplicationState } from "@/app/actions/application";
import { Field, Honeypot } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initial: ApplicationState = { status: "idle" };

export function ApplicationForm({ role }: { role: string }) {
  const [state, formAction] = useActionState(submitApplication, initial);
  const errors = state.fieldErrors ?? {};
  const prev = state.values ?? {};

  return (
    <form action={formAction} className="relative flex flex-col gap-7" noValidate>
      <Honeypot />
      <input type="hidden" name="role" value={role} />

      <div className="grid gap-7 sm:grid-cols-2">
        <Field name="fullName"
        defaultValue={prev.fullName} label="Full name" required error={errors.fullName} placeholder="Jane Doe" />
        <Field name="email"
        defaultValue={prev.email} label="Email" type="email" required error={errors.email} placeholder="jane@email.com" />
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field name="phone"
        defaultValue={prev.phone} label="Phone" type="tel" error={errors.phone} placeholder="+880 1700 000000" />
        <Field name="portfolio"
        defaultValue={prev.portfolio} label="Portfolio or CV link" type="url" error={errors.portfolio} placeholder="https://" />
      </div>

      <Field
        name="note"
        defaultValue={prev.note}
        label="Why this role"
        as="textarea"
        rows={5}
        required
        error={errors.note}
        placeholder="A few sentences on what you would bring, and a piece of work you are proud of."
      />

      <div className="flex flex-wrap items-center gap-5">
        <SubmitButton label="Send application" />
        {state.message ? (
          <p role="status" className={state.status === "success" ? "text-accent" : "text-red-500"}>
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
