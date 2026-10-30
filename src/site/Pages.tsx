"use client";

import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import type { Discipline } from "@/site/content";
import { Honeypot } from "@/site/forms/Honeypot";
import { sentCopy } from "@/site/forms/Status";
import { submitForm, useFormGuard, type SubmitOutcome } from "@/site/forms/submit";
import s from "./pages.module.css";
import { ArrowUpRight } from "@/site/shared/Arrow";

/** Services as a hairline list. Rows invert on hover; click opens capabilities and stack. */
export function ServiceList({ items }: { items: Discipline[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className={s.services}>
      {items.map((d) => {
        const isOpen = open === d.id;
        return (
          <li key={d.id} className={s.service} data-open={isOpen}>
            <h3 className={s.serviceHead}>
              <button type="button" aria-expanded={isOpen} aria-controls={`svc-${d.id}`} onClick={() => setOpen(isOpen ? null : d.id)}>
                <span className={s.serviceNum}>{d.number}</span>
                <span className={s.serviceTitle}>{d.title}</span>
                <span className={s.serviceLine}>{d.line}</span>
                <span className={s.serviceArrow} aria-hidden="true">
                  →
                </span>
              </button>
            </h3>
            <div id={`svc-${d.id}`} className={s.servicePanel} role="region" aria-label={d.title}>
              <div>
                <div className={s.servicePanelInner}>
                  <div>
                    <small>What we do</small>
                    <ul>
                      {d.capabilities.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <small>Usually with</small>
                    <ul>
                      {d.stack.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function hello(now: Date) {
  const h = now.getHours();
  const greet = h < 5 ? "Up late?" : h < 12 ? "Good morning." : h < 17 ? "Good afternoon." : h < 22 ? "Good evening." : "Up late?";
  const t = (tz?: string) => now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz });
  const yours = t();
  const dhaka = t("Asia/Dhaka");
  if (yours === dhaka) return `${greet} It's ${yours} — same time as us in Dhaka.`;
  return `${greet} It's ${yours} for you, ${dhaka} in Dhaka.`;
}

const subscribeMinute = (cb: () => void) => {
  const id = window.setInterval(cb, 20_000);
  return () => window.clearInterval(id);
};

/** "Good evening. It's 9:14 PM for you, 3:14 AM in Dhaka." Client-only; neutral on the server. */
export function LocalHello() {
  const text = useSyncExternalStore(subscribeMinute, () => hello(new Date()), () => "Hello from Dhaka.");
  return <p className={s.hello}>{text}</p>;
}


type Opt = { id: string; label: string };

/** A row of pill filters; one is always selected. */
export function Filters({ options, value, onChange, label }: { options: Opt[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className={s.filters} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Work index: filter by kind of project and switch between the tilted-card grid and a
 * dense list. Items are rendered on the server and passed in, keyed by category.
 */
export function WorkIndex({
  categories,
  items,
}: {
  categories: string[];
  items: { slug: string; category: string; card: ReactNode; row: ReactNode }[];
}) {
  const [cat, setCat] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const shown = items.filter((i) => cat === "all" || i.category === cat);
  return (
    <>
      <div className={s.toolbar}>
        <Filters
          label="Filter by kind of project"
          value={cat}
          onChange={setCat}
          options={[{ id: "all", label: `All (${items.length})` }, ...categories.map((c) => ({ id: c, label: c }))]}
        />
        <Filters
          label="View"
          value={view}
          onChange={(v) => setView(v as "grid" | "list")}
          options={[
            { id: "grid", label: "Grid" },
            { id: "list", label: "List" },
          ]}
        />
      </div>
      <p className={s.count} aria-live="polite">
        {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>
      {view === "grid" ? (
        <div className={s.workGrid}>
          {shown.map((i) => (
            <div key={i.slug}>{i.card}</div>
          ))}
        </div>
      ) : (
        <ul className={s.workList}>
          {shown.map((i) => (
            <li key={i.slug}>{i.row}</li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Journal list with a category filter. */
export function JournalIndex({ categories, items }: { categories: string[]; items: { slug: string; category: string; node: ReactNode }[] }) {
  const [cat, setCat] = useState(categories[0] ?? "All");
  const shown = items.filter((i) => cat === "All" || i.category === cat);
  return (
    <>
      <div className={s.toolbar}>
        <Filters label="Filter by topic" value={cat} onChange={setCat} options={categories.map((c) => ({ id: c, label: c }))} />
      </div>
      {shown.length ? (
        <ul className={s.journal}>
          {shown.map((i) => (
            <li key={i.slug}>{i.node}</li>
          ))}
        </ul>
      ) : (
        <p className={s.empty}>Nothing in {cat} yet. We only publish when we have something to say.</p>
      )}
    </>
  );
}

/** FAQ grouped by topic: pick a topic, read its questions. */
export function FaqTabs({ groups }: { groups: { id: string; items: { q: string; a: string }[] }[] }) {
  const [cat, setCat] = useState(groups[0]?.id ?? "");
  const group = groups.find((g) => g.id === cat) ?? groups[0];
  return (
    <div className={s.faqPage}>
      <Filters label="Topic" value={cat} onChange={setCat} options={groups.map((g) => ({ id: g.id, label: `${g.id} (${g.items.length})` }))} />
      <div className={s.faq}>
        {group?.items.map((f) => (
          <details key={f.q}>
            <summary>
              {f.q}
              <i aria-hidden="true" />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

type Brief = { name: string; email: string; company: string; needs: string[]; budget: string; timeline: string; message: string };

/**
 * Project brief. Sends to the studio inbox through the forms endpoint (Resend or PHP);
 * if no mail service answers, it opens the visitor's email app with the brief filled in
 * instead, and says so.
 */
export function BriefForm({ email, needs, budgets, timelines }: { email: string; needs: string[]; budgets: string[]; timelines: string[] }) {
  const [f, setF] = useState<Brief>({ name: "", email: "", company: "", needs: [], budget: "", timeline: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Brief, string>>>({});
  const [outcome, setOutcome] = useState<SubmitOutcome | null>(null);
  const [busy, setBusy] = useState(false);
  const guard = useFormGuard();
  const set = <K extends keyof Brief>(k: K, v: Brief[K]) => setF((x) => ({ ...x, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const err: typeof errors = {};
    if (!f.name.trim()) err.name = "Tell us who you are.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) err.email = "We need an email address to reply to.";
    if (!f.needs.length) err.needs = "Pick at least one.";
    if (f.message.trim().length < 20) err.message = "A sentence or two, please — at least 20 characters.";
    setErrors(err);
    if (Object.keys(err).length) {
      const first = Object.keys(err)[0];
      document.getElementById(`brief-${first}`)?.focus();
      return;
    }
    setBusy(true);
    const r = await submitForm("brief", f, guard.opts(email));
    setBusy(false);
    if (r.status === "invalid") {
      setErrors(r.fields as typeof errors);
      document.getElementById(`brief-${Object.keys(r.fields)[0]}`)?.focus();
      return;
    }
    if (r.status === "fallback") window.location.href = r.mailto;
    setOutcome(r);
  };

  if (outcome && outcome.status !== "error") {
    const c = sentCopy(outcome, email);
    return (
      <div className={s.sent} role="status">
        <p className={s.label}>{c.label}</p>
        <p className={s.sentTitle}>{c.title}</p>
        <p>{c.body}</p>
        <button type="button" className={s.pill} onClick={() => setOutcome(null)}>
          {outcome.status === "sent" ? "Send another" : "Edit the brief"}
        </button>
      </div>
    );
  }

  const field = (k: "name" | "email" | "company", label: string, type = "text", auto?: string) => (
    <div className={s.field} data-error={!!errors[k]}>
      <label htmlFor={`brief-${k}`}>{label}</label>
      <input
        id={`brief-${k}`}
        type={type}
        autoComplete={auto}
        value={f[k]}
        onChange={(e) => set(k, e.target.value)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `brief-${k}-err` : undefined}
      />
      {errors[k] && (
        <small id={`brief-${k}-err`} className={s.err}>
          {errors[k]}
        </small>
      )}
    </div>
  );

  const choice = (k: "budget" | "timeline", label: string, opts: string[]) => (
    <fieldset className={s.choice}>
      <legend>{label}</legend>
      <div className={s.chips}>
        {opts.map((o) => (
          <label key={o}>
            <input type="radio" name={k} value={o} checked={f[k] === o} onChange={() => set(k, o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <form className={s.form} onSubmit={submit} noValidate aria-busy={busy}>
      <Honeypot inputRef={guard.hp} />
      <div className={s.formRow}>
        {field("name", "Your name", "text", "name")}
        {field("email", "Email", "email", "email")}
      </div>
      {field("company", "Company (optional)", "text", "organization")}
      <fieldset className={s.choice} data-error={!!errors.needs} aria-describedby={errors.needs ? "brief-needs-err" : undefined}>
        <legend>What do you need?</legend>
        <div className={s.chips}>
          {needs.map((n, i) => (
            <label key={n}>
              <input
                id={i === 0 ? "brief-needs" : undefined}
                type="checkbox"
                checked={f.needs.includes(n)}
                onChange={() => set("needs", f.needs.includes(n) ? f.needs.filter((x) => x !== n) : [...f.needs, n])}
              />
              <span>{n}</span>
            </label>
          ))}
        </div>
        {errors.needs && (
          <small id="brief-needs-err" className={s.err}>
            {errors.needs}
          </small>
        )}
      </fieldset>
      {choice("budget", "Budget (optional)", budgets)}
      {choice("timeline", "Timeline (optional)", timelines)}
      <div className={s.field} data-error={!!errors.message}>
        <label htmlFor="brief-message">What are you trying to do?</label>
        <textarea
          id="brief-message"
          rows={5}
          value={f.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "brief-message-err" : undefined}
        />
        {errors.message && (
          <small id="brief-message-err" className={s.err}>
            {errors.message}
          </small>
        )}
      </div>
      <div className={s.formFoot}>
        <button type="submit" className={s.pillInk} disabled={busy}>
          {busy ? "Sending…" : "Send the brief"} <ArrowUpRight />
        </button>
        <small role="status" aria-live="polite" className={outcome?.status === "error" ? s.err : undefined}>
          {outcome?.status === "error" ? outcome.error : "Goes straight to our inbox. We reply within one working day."}
        </small>
      </div>
    </form>
  );
}
