"use client";

import type { SubmitOutcome } from "./submit";

/**
 * What the visitor sees after pressing send. `sent` is a real delivery; `fallback` means no
 * mail service answered, so we opened their email app instead and say so plainly.
 */
export function sentCopy(outcome: SubmitOutcome | null, email: string) {
  if (outcome?.status === "fallback") {
    return {
      label: "Almost there",
      title: "We couldn't send it from here, so your email app should open with everything filled in.",
      body: (
        <>
          Press send there and we reply within one working day. Nothing opened? Write to <a href={`mailto:${email}`}>{email}</a>.
        </>
      ),
    };
  }
  return {
    label: "Sent",
    title: "Thanks — we'll reply within one working day.",
    body: (
      <>
        It went straight to the studio inbox, and a person reads every one. Anything to add? Write to <a href={`mailto:${email}`}>{email}</a>.
      </>
    ),
  };
}
