"use client";

import { useEffect, useRef } from "react";
import { rowsFor, subjectFor, validate, type CleanData, type FormKind, type FormResult } from "./schema";

/**
 * Where forms post. The Node build uses the Resend route handler; the static (cPanel) build
 * sets NEXT_PUBLIC_FORMS_ENDPOINT=/api/forms.php at build time.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_FORMS_ENDPOINT || "/api/forms";

export type SubmitOutcome =
  | { status: "sent" }
  | { status: "invalid"; fields: Record<string, string>; error: string }
  | { status: "fallback"; mailto: string }
  | { status: "error"; error: string };

/** A mailto: link carrying the same fields, for when no mail service answers. */
export function mailtoFor(to: string, kind: FormKind, d: CleanData) {
  const body = rowsFor(kind, d)
    .map(([k, v]) => (v.includes("\n") ? `${k}:\n${v}` : `${k}: ${v}`))
    .join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(subjectFor(kind, d))}&body=${encodeURIComponent(body)}`;
}

/**
 * Sends a form. Any answer short of "sent" or "invalid" — no mail service configured, a
 * network failure, a server error — falls back to opening the visitor's email app, so a
 * brief is never lost.
 */
export async function submitForm(kind: FormKind, data: Record<string, unknown>, opts: { to: string; startedAt: number; hp?: string }): Promise<SubmitOutcome> {
  const local = validate(kind, data);
  if (!local.ok) return { status: "invalid", fields: local.fields, error: "Please check the highlighted fields." };
  const mailto = mailtoFor(opts.to, kind, local.data);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ kind, data, hp: opts.hp ?? "", t: Date.now() - opts.startedAt }),
    });
    const body = (await res.json().catch(() => null)) as FormResult | null;
    if (res.ok && body?.ok) return { status: "sent" };
    if (body && !body.ok && body.fields) return { status: "invalid", fields: body.fields, error: body.error };
    if (res.status === 429 && body && !body.ok) return { status: "error", error: body.error };
    return { status: "fallback", mailto };
  } catch {
    return { status: "fallback", mailto };
  }
}

/**
 * Spam guards for a form: when it appeared (for the minimum-fill-time check) and a honeypot
 * field that only bots fill in. Render `<Honeypot inputRef={guard.hp} />` inside the form.
 */
export function useFormGuard() {
  const shownAt = useRef(0);
  const hp = useRef<HTMLInputElement>(null);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);
  return { hp, opts: (to: string) => ({ to, startedAt: shownAt.current, hp: hp.current?.value ?? "" }) };
}
