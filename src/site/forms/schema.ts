/**
 * One contract for every form on the site, shared by the browser, the Node route handler
 * (src/app/api/forms/route.server.ts) and mirrored by the PHP endpoint (php/forms.php).
 * Change a limit here and in php/forms.php together.
 *
 * Request body: { kind, data, hp, t }
 *   kind — which form
 *   data — the fields below
 *   hp   — honeypot; humans never see the field, so anything in it means a bot
 *   t    — milliseconds the visitor spent on the form before sending
 */
export const FORM_KINDS = ["brief", "start", "apply", "newsletter"] as const;
export type FormKind = (typeof FORM_KINDS)[number];

export type FormPayload = { kind: FormKind; data: Record<string, unknown>; hp?: string; t?: number };

/** Responses from either backend. `fallback: "mailto"` means: no mail service is set up, use the email app. */
export type FormResult = { ok: true } | { ok: false; error: string; fields?: Record<string, string>; fallback?: "mailto" };

export const LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  short: 120,
  links: 1000,
  message: 5000,
  messageMin: 20,
  needs: 10,
  /** Below this many ms a submission is treated as automated. */
  minFillMs: { brief: 2500, start: 2500, apply: 2500, newsletter: 800 } as Record<FormKind, number>,
};

export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]+$/;

export type CleanData = {
  name?: string;
  email: string;
  company?: string;
  needs?: string[];
  stage?: string;
  budget?: string;
  timeline?: string;
  role?: string;
  links?: string;
  message?: string;
};

const str = (v: unknown) => (typeof v === "string" ? v.replace(/\r\n?/g, "\n").trim() : "");
/** Single-line fields: no line breaks (they end up in subjects and headers). */
const line = (v: unknown) => str(v).replace(/[\r\n\t]+/g, " ");

type Check = { ok: true; data: CleanData } | { ok: false; fields: Record<string, string> };

/** Server-side validation. The browser runs the same checks for instant feedback. */
export function validate(kind: FormKind, raw: Record<string, unknown>): Check {
  const f: Record<string, string> = {};
  const email = line(raw.email).toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) f.email = "We need an email address to reply to.";
  if (kind === "newsletter") return Object.keys(f).length ? { ok: false, fields: f } : { ok: true, data: { email } };

  const name = line(raw.name);
  if (!name) f.name = "Tell us who you are.";
  else if (name.length > LIMITS.name) f.name = "That name is too long.";

  const message = str(raw.message);
  if (message.length < LIMITS.messageMin) f.message = "A sentence or two, please — at least 20 characters.";
  else if (message.length > LIMITS.message) f.message = "Please keep it under 5,000 characters.";

  const data: CleanData = { name, email, message };

  if (kind === "brief" || kind === "start") {
    const needs = Array.isArray(raw.needs) ? raw.needs.map(line).filter(Boolean).slice(0, LIMITS.needs) : [];
    if (!needs.length) f.needs = "Pick at least one.";
    data.needs = needs.map((n) => n.slice(0, LIMITS.short));
    data.company = line(raw.company).slice(0, LIMITS.company);
    data.budget = line(raw.budget).slice(0, LIMITS.short);
    data.timeline = line(raw.timeline).slice(0, LIMITS.short);
    if (kind === "start") data.stage = line(raw.stage).slice(0, LIMITS.short);
  }
  if (kind === "apply") {
    data.role = line(raw.role).slice(0, LIMITS.short);
    if (!data.role) f.role = "Which role is this for?";
    data.links = str(raw.links).slice(0, LIMITS.links);
  }
  return Object.keys(f).length ? { ok: false, fields: f } : { ok: true, data };
}

const SUBJECTS: Record<FormKind, (d: CleanData) => string> = {
  brief: (d) => `Project brief — ${d.company || d.name}`,
  start: (d) => `New project — ${d.company || d.name}`,
  apply: (d) => `Application — ${d.role} — ${d.name}`,
  newsletter: (d) => `Notes signup — ${d.email}`,
};

export const subjectFor = (kind: FormKind, d: CleanData) => SUBJECTS[kind](d);

/** The email body as label/value rows, used for plain text, HTML and the mailto fallback. */
export function rowsFor(kind: FormKind, d: CleanData): [string, string][] {
  const rows: [string, string | undefined][] =
    kind === "newsletter"
      ? [["Email", d.email], ["Request", "Please add this address to the occasional notes list."]]
      : [
          ["Name", d.name],
          ["Email", d.email],
          ["Company", d.company],
          ["Role", d.role],
          ["Needs", d.needs?.join(", ")],
          ["Stage", d.stage],
          ["Budget", d.budget],
          ["Timeline", d.timeline],
          ["Links", d.links],
          ["Message", d.message],
        ];
  return rows.filter((r): r is [string, string] => !!r[1]);
}
