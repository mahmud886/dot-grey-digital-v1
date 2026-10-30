/**
 * Form endpoint for Node hosting (Vercel or `next start`): validates, filters spam and sends
 * through Resend. The cPanel/static build has no server, so this file is named *.server.ts
 * and only counts as a route when next.config.ts includes that extension (see STATIC_EXPORT).
 * php/forms.php implements the same contract for that build.
 */
import { Resend } from "resend";
import { site } from "@/data/site";
import { autoReply, notification } from "@/site/forms/email";
import { FORM_KINDS, LIMITS, validate, type FormKind, type FormResult } from "@/site/forms/schema";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
/** Best-effort only: each server instance keeps its own counts and loses them on restart. */
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const json = (body: FormResult, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return json({ ok: false, error: "Not allowed." }, 403);

  const raw = await req.text();
  if (raw.length > 20_000) return json({ ok: false, error: "That message is too long." }, 413);
  let body: { kind?: unknown; data?: unknown; hp?: unknown; t?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Something went wrong with the form." }, 400);
  }

  const kind = body.kind as FormKind;
  if (!FORM_KINDS.includes(kind) || typeof body.data !== "object" || body.data === null) {
    return json({ ok: false, error: "Something went wrong with the form." }, 400);
  }

  // Bots: answer as if it worked, so they learn nothing.
  if (typeof body.hp === "string" && body.hp.trim() !== "") return json({ ok: true });
  if (typeof body.t !== "number" || body.t < LIMITS.minFillMs[kind]) return json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (limited(ip)) return json({ ok: false, error: "Too many messages in a short time — please try again in a few minutes." }, 429);

  const checked = validate(kind, body.data as Record<string, unknown>);
  if (!checked.ok) return json({ ok: false, error: "Please check the highlighted fields.", fields: checked.fields }, 422);

  const key = process.env.RESEND_API_KEY;
  if (!key) return json({ ok: false, error: "Email is not set up on this server.", fallback: "mailto" }, 503);

  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const from = process.env.CONTACT_FROM_EMAIL || `${site.name} <${site.email}>`;
  const resend = new Resend(key);
  const d = checked.data;

  try {
    const segment = process.env.RESEND_AUDIENCE_ID;
    if (kind === "newsletter" && segment) {
      const { error } = await resend.contacts.create({ email: d.email, unsubscribed: false, segments: [{ id: segment }] });
      // An address that is already on the list is still a success for the visitor.
      if (error && !/already exists/i.test(error.message)) throw new Error(error.name);
    } else {
      const n = notification(kind, d);
      const { error } = await resend.emails.send({ from, to, replyTo: d.email, subject: n.subject, text: n.text, html: n.html });
      if (error) throw new Error(error.name);
    }

    if (process.env.CONTACT_AUTOREPLY === "true") {
      const r = autoReply(kind, d, site.name);
      // A failed courtesy email should not turn a delivered brief into an error.
      await resend.emails.send({ from, to: d.email, replyTo: to, subject: r.subject, text: r.text, html: r.html }).catch(() => undefined);
    }
    return json({ ok: true });
  } catch (e) {
    console.error("[forms] send failed:", e instanceof Error ? e.message : "unknown error");
    return json({ ok: false, error: "We couldn't send that just now.", fallback: "mailto" }, 502);
  }
}
