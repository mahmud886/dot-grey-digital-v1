"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Stage } from "@/site/agency";
import { ACCENT_COOKIE, THEME_COOKIE } from "@/site/shared/theme";
import { useAccent, useTheme } from "@/site/shared/useTheme";
import { Honeypot } from "@/site/forms/Honeypot";
import { sentCopy } from "@/site/forms/Status";
import { submitForm, useFormGuard, type SubmitOutcome } from "@/site/forms/submit";
import s from "./pages.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------------------------------------------ stage tracker */

/**
 * The process as a calm vertical read. A sticky column on the left draws the rings motif:
 * one ring per stage, filled up to the stage in view, with the stage list beneath it.
 * On mobile the column becomes a thin progress line under the header.
 */
export function StageTracker({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.tracker}>
      <nav className={s.trackRail} aria-label="Stages">
        <svg viewBox="0 0 120 120" className={s.trackRings} aria-hidden="true">
          {stages.map((st, k) => (
            <circle key={st.id} cx="60" cy="60" r={14 + k * 11} data-on={k <= active} />
          ))}
        </svg>
        <span className={s.trackLine} aria-hidden="true">
          <span style={{ transform: `scaleX(${(active + 1) / stages.length})` }} />
        </span>
        <ol>
          {stages.map((st, i) => (
            <li key={st.id}>
              <a href={`#stage-${st.id}`} aria-current={i === active ? "step" : undefined}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {st.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={s.trackBody}>
        {stages.map((st, i) => (
          <section
            key={st.id}
            id={`stage-${st.id}`}
            data-i={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={s.stageBlock}
            aria-labelledby={`stage-${st.id}-t`}
          >
            <p className={s.kicker}>
              Stage {String(i + 1).padStart(2, "0")} — {st.duration}
            </p>
            <h2 id={`stage-${st.id}-t`} className={s.stageTitle}>
              {st.title}
            </h2>
            <p className={s.stageLine}>{st.line}</p>
            <div className={s.stageCols}>
              {(
                [
                  ["What happens", st.happens],
                  ["You get", st.deliverables],
                  ["In the room", st.who],
                ] as const
              ).map(([label, items]) => (
                <div key={label}>
                  <p className={s.label}>{label}</p>
                  <ul className={s.plainList}>
                    {items.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ start wizard */

type Opt = { id: string; label: string; note?: string };

type StartData = { needs: string[]; stage: string; budget: string; timeline: string; name: string; email: string; company: string; message: string };

const STEPS = ["Need", "Stage", "Budget", "Timing", "You", "Review"] as const;
const QUESTIONS = ["What do you need?", "Where are you starting from?", "Roughly what budget?", "When would you like to start?", "Who should we reply to?", "Does this look right?"];

/**
 * Start a project, one quiet question at a time. The last step sends the answers to the
 * studio inbox; if no mail service answers, it opens the visitor's email app instead.
 */
export function StartWizard({ email, needs, stages, budgets, timelines }: { email: string; needs: string[]; stages: Opt[]; budgets: string[]; timelines: string[] }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<StartData>({ needs: [], stage: "", budget: "", timeline: "", name: "", email: "", company: "", message: "" });
  const [error, setError] = useState<Record<string, string>>({});
  const [outcome, setOutcome] = useState<SubmitOutcome | null>(null);
  const [busy, setBusy] = useState(false);
  const guard = useFormGuard();
  const sent = !!outcome && outcome.status !== "error";
  const head = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const set = <K extends keyof StartData>(k: K, v: StartData[K]) => setD((x) => ({ ...x, [k]: v }));

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    head.current?.focus();
  }, [step, sent]);

  const check = (i: number) => {
    const e: Record<string, string> = {};
    if (i === 0 && !d.needs.length) e.needs = "Pick at least one.";
    if (i === 1 && !d.stage) e.stage = "Pick the closest one.";
    if (i === 4) {
      if (!d.name.trim()) e.name = "Tell us who you are.";
      if (!EMAIL.test(d.email)) e.email = "We need an email address to reply to.";
      if (d.message.trim().length < 20) e.message = "A sentence or two, please — at least 20 characters.";
    }
    setError(e);
    if (Object.keys(e).length) document.getElementById(`start-${Object.keys(e)[0]}`)?.focus();
    return !Object.keys(e).length;
  };

  const next = () => check(step) && setStep((x) => Math.min(STEPS.length - 1, x + 1));
  const back = () => {
    setError({});
    setStep((x) => Math.max(0, x - 1));
  };

  const stageLabel = stages.find((x) => x.id === d.stage)?.label ?? "";
  const summary: [string, string, number][] = [
    ["Need", d.needs.join(", "), 0],
    ["Stage", stageLabel, 1],
    ["Budget", d.budget || "Not given", 2],
    ["Timing", d.timeline || "Not given", 3],
    ["Name", d.name, 4],
    ["Email", d.email, 4],
    ["Company", d.company || "—", 4],
    ["Message", d.message, 4],
  ];

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return next();
    if (busy) return;
    setBusy(true);
    const r = await submitForm("start", { ...d, stage: stageLabel }, guard.opts(email));
    setBusy(false);
    if (r.status === "invalid") {
      // Server-side checks only cover the "You" step, so go back there.
      setError(r.fields);
      setStep(r.fields.needs ? 0 : 4);
      return;
    }
    if (r.status === "fallback") window.location.href = r.mailto;
    setOutcome(r);
  };

  if (sent) {
    const c = sentCopy(outcome, email);
    return (
      <div className={s.sent} role="status">
        <p className={s.label}>{c.label}</p>
        <h2 ref={head} tabIndex={-1} className={s.sentTitle}>
          {c.title}
        </h2>
        <p>{c.body}</p>
        <button type="button" className={s.pill} onClick={() => setOutcome(null)}>
          {outcome?.status === "sent" ? "Start another" : "Edit the answers"}
        </button>
      </div>
    );
  }

  const choice = (name: string, opts: Opt[], value: string, onPick: (v: string) => void) => (
    <div className={s.wizOpts} role="radiogroup" aria-labelledby="wiz-q" aria-describedby={error[name] ? `start-${name}-err` : undefined}>
      {opts.map((o, i) => (
        <label key={o.id} className={s.wizOpt}>
          <input id={i === 0 ? `start-${name}` : undefined} type="radio" name={name} checked={value === o.id} onChange={() => onPick(o.id)} />
          <span>
            <b>{o.label}</b>
            {o.note && <small>{o.note}</small>}
          </span>
        </label>
      ))}
    </div>
  );

  const field = (k: "name" | "email" | "company", label: string, type = "text", auto?: string) => (
    <div className={s.field} data-error={!!error[k]}>
      <label htmlFor={`start-${k}`}>{label}</label>
      <input
        id={`start-${k}`}
        type={type}
        autoComplete={auto}
        value={d[k]}
        onChange={(e) => set(k, e.target.value)}
        aria-invalid={!!error[k]}
        aria-describedby={error[k] ? `start-${k}-err` : undefined}
      />
      {error[k] && (
        <small id={`start-${k}-err`} className={s.err}>
          {error[k]}
        </small>
      )}
    </div>
  );

  const [q, last] = [QUESTIONS[step].split(" ").slice(0, -1).join(" "), QUESTIONS[step].split(" ").slice(-1)[0]];

  return (
    <form className={s.wizard} onSubmit={submit} noValidate aria-busy={busy}>
      <Honeypot inputRef={guard.hp} />
      <div className={s.wizTop}>
        <p className={s.kicker} aria-live="polite">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>
        <ol className={s.wizSteps} aria-hidden="true">
          {STEPS.map((x, i) => (
            <li key={x} data-done={i < step} data-on={i === step}>
              {x}
            </li>
          ))}
        </ol>
        <span className={s.wizBar} aria-hidden="true">
          <span style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
        </span>
      </div>

      <h2 id="wiz-q" ref={head} tabIndex={-1} className={s.wizQ}>
        {q} <em className={s.em}>{last}</em>
      </h2>

      <div className={s.wizPane}>
        {step === 0 && (
          <div className={s.wizOpts} role="group" aria-labelledby="wiz-q" aria-describedby={error.needs ? "start-needs-err" : undefined}>
            {needs.map((n, i) => (
              <label key={n} className={s.wizOpt}>
                <input
                  id={i === 0 ? "start-needs" : undefined}
                  type="checkbox"
                  checked={d.needs.includes(n)}
                  onChange={() => set("needs", d.needs.includes(n) ? d.needs.filter((x) => x !== n) : [...d.needs, n])}
                />
                <span>
                  <b>{n}</b>
                </span>
              </label>
            ))}
          </div>
        )}
        {step === 1 && choice("stage", stages, d.stage, (v) => set("stage", v))}
        {step === 2 && choice("budget", budgets.map((b) => ({ id: b, label: b })), d.budget, (v) => set("budget", v))}
        {step === 3 && choice("timeline", timelines.map((b) => ({ id: b, label: b })), d.timeline, (v) => set("timeline", v))}
        {step === 4 && (
          <div className={s.form}>
            <div className={s.formRow}>
              {field("name", "Your name", "text", "name")}
              {field("email", "Email", "email", "email")}
            </div>
            {field("company", "Company (optional)", "text", "organization")}
            <div className={s.field} data-error={!!error.message}>
              <label htmlFor="start-message">What are you trying to do?</label>
              <textarea
                id="start-message"
                rows={4}
                value={d.message}
                onChange={(e) => set("message", e.target.value)}
                aria-invalid={!!error.message}
                aria-describedby={error.message ? "start-message-err" : undefined}
              />
              {error.message && (
                <small id="start-message-err" className={s.err}>
                  {error.message}
                </small>
              )}
            </div>
          </div>
        )}
        {step === 5 && (
          <dl className={s.wizReview}>
            {summary.map(([k, v, at]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
                <button type="button" className={s.wizEdit} onClick={() => setStep(at)} aria-label={`Edit ${k}`}>
                  Edit
                </button>
              </div>
            ))}
          </dl>
        )}
        {(error.needs || error.stage) && (
          <small id={`start-${error.needs ? "needs" : "stage"}-err`} className={s.err}>
            {error.needs || error.stage}
          </small>
        )}
        {(step === 2 || step === 3) && <small className={s.note}>Optional — skip it if you are not sure.</small>}
      </div>

      <div className={s.wizNav}>
        {step > 0 ? (
          <button type="button" className={s.pill} onClick={back}>
            <span aria-hidden="true">←</span> Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className={s.pillInk} disabled={busy}>
          {step === STEPS.length - 1 ? (busy ? "Sending…" : "Send it") : "Next"} <span aria-hidden="true">→</span>
        </button>
      </div>
      {step === STEPS.length - 1 && (
        <small role="status" aria-live="polite" className={outcome?.status === "error" ? s.err : s.note}>
          {outcome?.status === "error" ? outcome.error : "Goes straight to our inbox. We reply within one working day."}
        </small>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ stack filter */

export function StackFilter({ tools, groups }: { tools: { name: string; group: string }[]; groups: string[] }) {
  const [q, setQ] = useState("");
  const [g, setG] = useState("All");
  const list = useMemo(() => tools.filter((t) => (g === "All" || t.group === g) && t.name.toLowerCase().includes(q.trim().toLowerCase())), [tools, q, g]);
  return (
    <div className={s.stackTool}>
      <div className={s.toolbar}>
        <label className={s.search}>
          <span className={s.label}>Search the kit</span>
          <input type="search" placeholder="e.g. Next.js, dbt, PyTorch" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className={s.filters} role="radiogroup" aria-label="Craft">
          {["All", ...groups].map((x) => (
            <button key={x} type="button" role="radio" aria-checked={g === x} onClick={() => setG(x)}>
              {x}
            </button>
          ))}
        </div>
      </div>
      <p className={s.count} aria-live="polite">
        {list.length} {list.length === 1 ? "tool" : "tools"}
      </p>
      {list.length ? (
        <ul className={s.toolGrid}>
          {list.map((t) => (
            <li key={t.name}>
              <b>{t.name}</b>
              <span>{t.group}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.empty}>Nothing by that name. We may still use it — ask us.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ newsletter */

/**
 * Occasional notes. Adds the address to the Resend list when one is configured, otherwise
 * emails the studio to add it by hand; with no mail service at all, opens an email instead.
 */
export function Newsletter({ email, id }: { email: string; id: string }) {
  const [addr, setAddr] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "error" | "sent" | "fallback" | "failed">("idle");
  const [msg, setMsg] = useState("");
  const guard = useFormGuard();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === "busy") return;
    if (!EMAIL.test(addr)) return setState("error");
    setState("busy");
    const r = await submitForm("newsletter", { email: addr }, guard.opts(email));
    if (r.status === "invalid") return setState("error");
    if (r.status === "error") {
      setMsg(r.error);
      return setState("failed");
    }
    if (r.status === "fallback") {
      window.location.href = r.mailto;
      return setState("fallback");
    }
    setAddr("");
    setState("sent");
  };
  return (
    <form className={s.news} onSubmit={submit} noValidate aria-busy={state === "busy"}>
      <Honeypot inputRef={guard.hp} />
      <label htmlFor={id} className={s.label}>
        Occasional notes
      </label>
      <div className={s.newsRow}>
        <input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          aria-invalid={state === "error"}
          aria-describedby={`${id}-msg`}
        />
        <button type="submit" disabled={state === "busy"}>
          {state === "busy" ? "Adding…" : "Subscribe"} <span aria-hidden="true">↗</span>
        </button>
      </div>
      <small id={`${id}-msg`} className={state === "error" || state === "failed" ? s.err : s.note} aria-live="polite">
        {state === "error"
          ? "That doesn't look like an email address."
          : state === "failed"
            ? msg
            : state === "sent"
              ? "You're on the list. Expect a note a few times a year — no more."
              : state === "fallback"
                ? "We couldn't add you from here, so your email app should open — send it and we'll add you by hand."
                : "A few times a year. Unsubscribe any time by replying to any note."}
      </small>
    </form>
  );
}

/* ------------------------------------------------------------------ cookie control */

/** Shows the two preference cookies as they are now, and clears them. */
export function CookieReset() {
  const theme = useTheme();
  const accent = useAccent();
  const [done, setDone] = useState(false);
  const reset = () => {
    for (const n of [THEME_COOKIE, ACCENT_COOKIE]) document.cookie = `${n}=; path=/; max-age=0; samesite=lax`;
    const root = document.documentElement;
    root.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.dataset.accent = "mono";
    setDone(true);
  };
  return (
    <div className={s.cookieBox}>
      <dl>
        <div>
          <dt>Theme now</dt>
          <dd>{theme ?? "—"}</dd>
        </div>
        <div>
          <dt>Accent now</dt>
          <dd>{accent ?? "—"}</dd>
        </div>
      </dl>
      <button type="button" className={s.pillInk} onClick={reset}>
        Clear my preferences
      </button>
      <small className={s.note} aria-live="polite">
        {done ? "Cleared. The theme now follows your system setting again." : "Removes both cookies. Nothing else is stored."}
      </small>
    </div>
  );
}

/* ------------------------------------------------------------------ job application */

type Apply = { name: string; email: string; links: string; message: string };

/**
 * Apply for a role. Sends to the studio inbox like the brief; CVs travel as links, since
 * email attachments through a web form are a spam magnet. Falls back to the email app.
 */
export function ApplyForm({ email, role }: { email: string; role: string }) {
  const [f, setF] = useState<Apply>({ name: "", email: "", links: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [outcome, setOutcome] = useState<SubmitOutcome | null>(null);
  const [busy, setBusy] = useState(false);
  const guard = useFormGuard();
  const set = (k: keyof Apply, v: string) => setF((x) => ({ ...x, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const r = await submitForm("apply", { ...f, role }, guard.opts(email));
    setBusy(false);
    if (r.status === "invalid") {
      setErrors(r.fields);
      document.getElementById(`apply-${Object.keys(r.fields)[0]}`)?.focus();
      return;
    }
    setErrors({});
    if (r.status === "fallback") window.location.href = r.mailto;
    setOutcome(r);
  };

  if (outcome && outcome.status !== "error") {
    const c = sentCopy(outcome, email);
    return (
      <div className={s.sent} role="status">
        <p className={s.label}>{c.label}</p>
        <p className={s.sentTitle}>{outcome.status === "sent" ? "Thanks — we read every application and reply within a week." : c.title}</p>
        <p>{c.body}</p>
      </div>
    );
  }

  const field = (k: keyof Apply, label: string, opts: { type?: string; auto?: string; area?: boolean; hint?: string } = {}) => (
    <div className={s.field} data-error={!!errors[k]}>
      <label htmlFor={`apply-${k}`}>{label}</label>
      {opts.area ? (
        <textarea
          id={`apply-${k}`}
          rows={k === "links" ? 2 : 5}
          value={f[k]}
          onChange={(e) => set(k, e.target.value)}
          aria-invalid={!!errors[k]}
          aria-describedby={errors[k] ? `apply-${k}-err` : opts.hint ? `apply-${k}-hint` : undefined}
        />
      ) : (
        <input
          id={`apply-${k}`}
          type={opts.type ?? "text"}
          autoComplete={opts.auto}
          value={f[k]}
          onChange={(e) => set(k, e.target.value)}
          aria-invalid={!!errors[k]}
          aria-describedby={errors[k] ? `apply-${k}-err` : undefined}
        />
      )}
      {errors[k] ? (
        <small id={`apply-${k}-err`} className={s.err}>
          {errors[k]}
        </small>
      ) : (
        opts.hint && (
          <small id={`apply-${k}-hint`} className={s.note}>
            {opts.hint}
          </small>
        )
      )}
    </div>
  );

  return (
    <form className={s.form} onSubmit={submit} noValidate aria-busy={busy}>
      <Honeypot inputRef={guard.hp} />
      <div className={s.formRow}>
        {field("name", "Your name", { auto: "name" })}
        {field("email", "Email", { type: "email", auto: "email" })}
      </div>
      {field("links", "Links (optional)", { area: true, hint: "Portfolio, GitHub, LinkedIn or a CV link — one per line." })}
      {field("message", "A few lines about you", { area: true })}
      <div className={s.formFoot}>
        <button type="submit" className={s.pillInk} disabled={busy}>
          {busy ? "Sending…" : "Send application"} <span aria-hidden="true">↗</span>
        </button>
        <small role="status" aria-live="polite" className={outcome?.status === "error" ? s.err : undefined}>
          {outcome?.status === "error" ? outcome.error : "Goes straight to the people hiring for this role."}
        </small>
      </div>
    </form>
  );
}
