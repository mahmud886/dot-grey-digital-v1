"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Stage } from "@/redesign/agency";
import { ACCENT_COOKIE, THEME_COOKIE } from "@/redesign/shared/theme";
import { useAccent, useTheme } from "@/redesign/shared/useTheme";
import { G } from "./Glyphs";
import m from "./more.module.css";
import s from "./v9.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------------------------------
 * Process as an index: a sticky column holds a giant serif numeral for the stage in view and
 * the list of stages; the stages scroll past on the right. On mobile the column collapses
 * into a thin sticky bar.
 * ---------------------------------------------------------------------------------------- */

export function StageIndex({ stages }: { stages: Stage[] }) {
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
    <div className={m.stageWrap}>
      <nav className={m.stageRail} aria-label="Stages">
        <p className={m.stageNumeral} aria-hidden="true">
          {pad(active + 1)}
        </p>
        <span className={m.stageBar} aria-hidden="true">
          <span style={{ transform: `scaleX(${(active + 1) / stages.length})` }} />
        </span>
        <ol className={m.stageList}>
          {stages.map((st, i) => (
            <li key={st.id}>
              <a href={`#stage-${st.id}`} aria-current={i === active ? "step" : undefined}>
                <span>{pad(i + 1)}</span>
                {st.title}
                <small>{st.duration}</small>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={m.stageBody}>
        {stages.map((st, i) => (
          <section
            key={st.id}
            id={`stage-${st.id}`}
            data-i={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={m.stage}
            aria-labelledby={`stage-${st.id}-t`}
          >
            <p className={s.label}>
              Stage {pad(i + 1)} <G name="slash" /> {st.duration}
            </p>
            <h2 id={`stage-${st.id}-t`} className={m.stageTitle}>
              {st.title} <G name="asterisk" />
            </h2>
            <p className={m.stageLine}>{st.line}</p>
            <dl className={m.stageTable}>
              {(
                [
                  ["What happens", st.happens],
                  ["You get", st.deliverables],
                  ["In the room", st.who],
                ] as const
              ).map(([k, list]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>
                    <ul>
                      {list.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------
 * Start a project: one question per screen, answered by picking rows from an index. No
 * backend — the last step opens an email with everything filled in, and says so.
 * ---------------------------------------------------------------------------------------- */

type Opt = { id: string; label: string; note?: string };
type StartData = { needs: string[]; stage: string; budget: string; timeline: string; name: string; email: string; company: string; message: string };

const STEPS = ["Need", "Stage", "Budget", "Timing", "You", "Review"] as const;
const QUESTIONS = ["What do you need", "Where are you starting from", "Roughly what budget", "When do you want to start", "Who should we reply to", "Does this read right"];

export function StartIndex({ email, needs, stages, budgets, timelines }: { email: string; needs: string[]; stages: Opt[]; budgets: string[]; timelines: string[] }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<StartData>({ needs: [], stage: "", budget: "", timeline: "", name: "", email: "", company: "", message: "" });
  const [error, setError] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const head = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const set = <K extends keyof StartData>(k: K, v: StartData[K]) => setD((x) => ({ ...x, [k]: v }));

  // Move focus to the new question after every step change, but not on first render.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    head.current?.focus();
  }, [step, sent]);

  const check = (i: number) => {
    const e: Record<string, string> = {};
    if (i === 0 && !d.needs.length) e.needs = "Pick at least one row.";
    if (i === 1 && !d.stage) e.stage = "Pick the closest one.";
    if (i === 4) {
      if (!d.name.trim()) e.name = "Tell us who you are.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "We need an email address to reply to.";
      if (d.message.trim().length < 20) e.message = "A sentence or two, please — at least 20 characters.";
    }
    setError(e);
    const firstKey = Object.keys(e)[0];
    if (firstKey) document.getElementById(`v9s-${firstKey}`)?.focus();
    return !firstKey;
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

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return next();
    const body = summary.map(([k, v]) => `${k}: ${v}`).join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`New project — ${d.company || d.name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className={s.sent} role="status">
        <p className={s.label}>Almost there</p>
        <h2 ref={head} tabIndex={-1} className={s.sentTitle}>
          Your email app should open with the brief <G name="arrow" />
        </h2>
        <p>
          Press send there and we reply within a working day. Nothing opened? Write to <a href={`mailto:${email}`}>{email}</a>. Nothing has been stored on this
          site.
        </p>
        <button type="button" className={s.textBtn} onClick={() => setSent(false)}>
          Edit the answers
        </button>
      </div>
    );
  }

  const rows = (name: string, opts: Opt[], picked: (id: string) => boolean, onPick: (id: string) => void, multi = false) => (
    <div
      className={m.optRows}
      role={multi ? "group" : "radiogroup"}
      aria-labelledby="v9s-q"
      aria-describedby={error[name] ? `v9s-${name}-err` : undefined}
    >
      {opts.map((o, i) => (
        <label key={o.id} className={m.optRow}>
          <input id={i === 0 ? `v9s-${name}` : undefined} type={multi ? "checkbox" : "radio"} name={name} checked={picked(o.id)} onChange={() => onPick(o.id)} />
          <span className={m.optNum}>{pad(i + 1)}</span>
          <span className={m.optLabel}>{o.label}</span>
          {o.note && <span className={m.optNote}>{o.note}</span>}
          <span className={m.optMark} aria-hidden="true">
            <G name={multi ? "plus" : "dot"} />
          </span>
        </label>
      ))}
    </div>
  );

  const field = (k: "name" | "email" | "company", label: string, type = "text", auto?: string, wide = false) => (
    <label className={`${s.field} ${wide ? s.fieldWide : ""}`}>
      <span className={s.label}>{label}</span>
      <input
        id={`v9s-${k}`}
        type={type}
        autoComplete={auto}
        value={d[k]}
        onChange={(e) => set(k, e.target.value)}
        aria-invalid={!!error[k]}
        aria-describedby={error[k] ? `v9s-${k}-err` : undefined}
      />
      {error[k] && (
        <span id={`v9s-${k}-err`} className={s.err}>
          <G name="plus" /> {error[k]}
        </span>
      )}
    </label>
  );

  return (
    <form className={m.wizard} onSubmit={submit} noValidate>
      <div className={m.wizTop}>
        <p className={m.wizCount} aria-live="polite">
          <span>{pad(step + 1)}</span> / {pad(STEPS.length)} <G name="slash" /> {STEPS[step]}
        </p>
        <ol className={m.wizSteps} aria-hidden="true">
          {STEPS.map((x, i) => (
            <li key={x} data-done={i < step || undefined} data-on={i === step || undefined}>
              {x}
            </li>
          ))}
        </ol>
        <span className={m.wizBar} aria-hidden="true">
          <span style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
        </span>
      </div>

      <h2 id="v9s-q" ref={head} tabIndex={-1} className={m.wizQ}>
        {QUESTIONS[step]} <G name="ring" />
      </h2>

      <div className={m.wizPane}>
        {step === 0 &&
          rows(
            "needs",
            needs.map((n) => ({ id: n, label: n })),
            (id) => d.needs.includes(id),
            (id) => set("needs", d.needs.includes(id) ? d.needs.filter((x) => x !== id) : [...d.needs, id]),
            true,
          )}
        {step === 1 && rows("stage", stages, (id) => d.stage === id, (id) => set("stage", id))}
        {step === 2 && rows("budget", budgets.map((b) => ({ id: b, label: b })), (id) => d.budget === id, (id) => set("budget", id))}
        {step === 3 && rows("timeline", timelines.map((b) => ({ id: b, label: b })), (id) => d.timeline === id, (id) => set("timeline", id))}
        {step === 4 && (
          <div className={s.form}>
            {field("name", "Your name", "text", "name")}
            {field("email", "Email", "email", "email")}
            {field("company", "Company (optional)", "text", "organization", true)}
            <label className={`${s.field} ${s.fieldWide}`}>
              <span className={s.label}>What are you trying to do?</span>
              <textarea
                id="v9s-message"
                rows={4}
                value={d.message}
                onChange={(e) => set("message", e.target.value)}
                aria-invalid={!!error.message}
                aria-describedby={error.message ? "v9s-message-err" : undefined}
              />
              {error.message && (
                <span id="v9s-message-err" className={s.err}>
                  <G name="plus" /> {error.message}
                </span>
              )}
            </label>
          </div>
        )}
        {step === 5 && (
          <dl className={m.review}>
            {summary.map(([k, v, at], i) => (
              <div key={k}>
                <dt>
                  <span>{pad(i + 1)}</span>
                  {k}
                </dt>
                <dd>{v}</dd>
                <button type="button" className={s.textBtn} onClick={() => setStep(at)} aria-label={`Edit ${k}`}>
                  Edit
                </button>
              </div>
            ))}
          </dl>
        )}
        {(error.needs || error.stage) && (
          <p id={`v9s-${error.needs ? "needs" : "stage"}-err`} className={s.err}>
            <G name="plus" /> {error.needs || error.stage}
          </p>
        )}
        {(step === 2 || step === 3) && <p className={s.formNote}>Optional — skip it if you are not sure.</p>}
      </div>

      <div className={m.wizNav}>
        {step > 0 ? (
          <button type="button" className={s.textBtn} onClick={back}>
            Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className={s.cta}>
          {step === STEPS.length - 1 ? "Send it" : "Next"} <G name="arrow" />
        </button>
      </div>
      {step === STEPS.length - 1 && <p className={s.formNote}>Opens your email app with these answers filled in. Nothing is stored on this site.</p>}
    </form>
  );
}

/* ------------------------------------------------------------------------------------------
 * The tool stack as a searchable index, alphabetical, with the craft in the margin.
 * ---------------------------------------------------------------------------------------- */

export function StackIndex({ tools, groups }: { tools: { name: string; group: string }[]; groups: string[] }) {
  const [q, setQ] = useState("");
  const [g, setG] = useState("All");
  const list = useMemo(() => tools.filter((t) => (g === "All" || t.group === g) && t.name.toLowerCase().includes(q.trim().toLowerCase())), [tools, q, g]);
  const letters = useMemo(() => {
    const map = new Map<string, typeof list>();
    for (const t of list) {
      const L = /[a-z]/i.test(t.name[0]) ? t.name[0].toUpperCase() : "#";
      map.set(L, [...(map.get(L) ?? []), t]);
    }
    return [...map];
  }, [list]);
  const count = (x: string) => (x === "All" ? tools.length : tools.filter((t) => t.group === x).length);

  return (
    <div>
      <label className={`${s.field} ${m.search}`}>
        <span className={s.label}>Search the stack</span>
        <input type="search" placeholder="Next.js, dbt, PyTorch…" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <div className={s.filters} role="radiogroup" aria-label="Craft">
        {["All", ...groups].map((x) => (
          <button key={x} type="button" role="radio" aria-checked={g === x} className={s.filter} onClick={() => setG(x)}>
            {x}
            <sup>{pad(count(x))}</sup>
          </button>
        ))}
      </div>
      <p className={s.label} aria-live="polite">
        {list.length} {list.length === 1 ? "entry" : "entries"}
      </p>
      {letters.length ? (
        <div className={m.letters}>
          {letters.map(([L, items]) => (
            <section key={L} className={m.letter} aria-label={L}>
              <p className={m.letterHead} aria-hidden="true">
                {L}
              </p>
              <ul>
                {items.map((t) => (
                  <li key={t.name}>
                    <span className={m.toolName}>{t.name}</span>
                    <span className={m.toolGroup}>{t.group}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <p className={s.emptyNote}>Not in the index. We may still use it — ask us.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------
 * Newsletter: no list software yet, so subscribing is an honest email to the studio.
 * ---------------------------------------------------------------------------------------- */

export function Notes({ email, id = "v9-notes" }: { email: string; id?: string }) {
  const [addr, setAddr] = useState("");
  const [state, setState] = useState<"idle" | "error" | "sent">("idle");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) return setState("error");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Add me to your notes")}&body=${encodeURIComponent(`Please send occasional notes to ${addr}.`)}`;
    setState("sent");
  };
  return (
    <form className={m.notes} onSubmit={submit} noValidate>
      <label htmlFor={id} className={s.label}>
        Occasional notes
      </label>
      <div className={m.notesRow}>
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
        <button type="submit" aria-label="Subscribe">
          <G name="arrow" />
        </button>
      </div>
      <p id={`${id}-msg`} className={state === "error" ? s.err : s.formNote} aria-live="polite">
        {state === "error"
          ? "That doesn't look like an email address."
          : state === "sent"
            ? "Your email app should open — send it and we add you by hand."
            : "A few times a year. No list software yet: this opens an email to us."}
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------------------------------
 * Cookie control: the two preference cookies as they are now, and a way to clear them.
 * ---------------------------------------------------------------------------------------- */

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
    <div className={m.cookieBox}>
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
      <button type="button" className={s.cta} onClick={reset}>
        Clear my preferences <G name="slash" />
      </button>
      <p className={s.formNote} aria-live="polite">
        {done ? "Cleared. The theme follows your system setting again." : "Removes both cookies. Nothing else is stored."}
      </p>
    </div>
  );
}
