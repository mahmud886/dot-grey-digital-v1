"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ACCENT_COOKIE, THEME_COOKIE } from "@/redesign/shared/theme";
import { useAccent, useTheme } from "@/redesign/shared/useTheme";
import s from "./v11.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ------------------------------------------------------------------ stage tracker */

type StageView = { id: string; title: string; line: string; happens: string[]; deliverables: string[]; who: string[]; duration: string };

/**
 * The process as a run of full-width "spreads". A sticky index on the left marks the stage in
 * view and grows a progress line; on mobile it becomes a bar pinned under the header.
 */
export function StageTracker({ stages }: { stages: StageView[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.tracker}>
      <nav className={s.trackRail} aria-label="Stages">
        <div className={s.progressRow} aria-hidden="true">
          <span>{pad(active + 1)}</span>
          <span className={s.progressTrack}>
            <span className={s.progressFill} style={{ transform: `scaleX(${(active + 1) / stages.length})` }} />
          </span>
          <span>{pad(stages.length)}</span>
        </div>
        <ol>
          {stages.map((st, i) => (
            <li key={st.id}>
              <a href={`#stage-${st.id}`} aria-current={i === active ? "step" : undefined}>
                <span className={s.trackDot} aria-hidden="true" />
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
            className={s.stage}
            aria-labelledby={`stage-${st.id}-t`}
          >
            <p className={s.label}>
              Stage {pad(i + 1)} <span aria-hidden="true">●</span> {st.duration}
            </p>
            <h2 id={`stage-${st.id}-t`} className={s.stageTitle}>
              {st.title}
              <span className={s.dot} aria-hidden="true">
                ●
              </span>
            </h2>
            <p className={s.stageLine}>{st.line}</p>
            <div className={s.stageCols}>
              {(
                [
                  ["What happens", st.happens],
                  ["You get", st.deliverables],
                  ["In the room", st.who],
                ] as const
              ).map(([h, list]) => (
                <div key={h}>
                  <p className={s.label}>{h}</p>
                  <ul className={s.plainList}>
                    {list.map((x) => (
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
const QUESTIONS = ["What do you need", "Where are you starting", "Roughly what budget", "When do you want to start", "Who should we reply to", "Does this look right"];

/**
 * Start a project, one question per screen. No backend: the last step opens the visitor's
 * email app with every answer filled in, and the page says so.
 */
export function StartWizard({ email, needs, stages, budgets, timelines }: { email: string; needs: string[]; stages: Opt[]; budgets: string[]; timelines: string[] }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<StartData>({ needs: [], stage: "", budget: "", timeline: "", name: "", email: "", company: "", message: "" });
  const [error, setError] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const head = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const set = <K extends keyof StartData>(k: K, v: StartData[K]) => setD((x) => ({ ...x, [k]: v }));

  // Move focus to the new question after Next/Back, but not on first load.
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
      if (!isEmail(d.email)) e.email = "We need an email address to reply to.";
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

  const summary: [string, string, number][] = [
    ["Need", d.needs.join(", "), 0],
    ["Stage", stages.find((x) => x.id === d.stage)?.label ?? "", 1],
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
          Your email app should open with the brief filled in. <span className={s.dot} aria-hidden="true">●</span>
        </h2>
        <p className={s.bodyLg}>
          Press send there and we reply within a working day. Nothing opened? Write to <a href={`mailto:${email}`}>{email}</a>. Nothing has been stored on this site.
        </p>
        <button type="button" className={s.btn} onClick={() => setSent(false)}>
          Edit the answers
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
            <span className={s.wizNum}>{pad(i + 1)}</span>
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
      <input id={`start-${k}`} type={type} autoComplete={auto} value={d[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={!!error[k]} aria-describedby={error[k] ? `start-${k}-err` : undefined} />
      {error[k] && (
        <small id={`start-${k}-err`} className={s.err}>
          {error[k]}
        </small>
      )}
    </div>
  );

  return (
    <form className={s.wizard} onSubmit={submit} noValidate>
      <div className={s.progressRow} aria-hidden="true">
        <span>{pad(step + 1)}</span>
        <span className={s.progressTrack}>
          <span className={s.progressFill} style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
        </span>
        <span>{pad(STEPS.length)}</span>
      </div>
      <ol className={s.wizSteps} aria-hidden="true">
        {STEPS.map((x, i) => (
          <li key={x} data-done={i < step} data-on={i === step}>
            {x}
          </li>
        ))}
      </ol>
      <p className={s.label} aria-live="polite">
        Step {step + 1} of {STEPS.length} <span aria-hidden="true">●</span> {STEPS[step]}
      </p>

      <h2 id="wiz-q" ref={head} tabIndex={-1} className={s.wizQ}>
        {QUESTIONS[step]}
        <span className={s.dot} aria-hidden="true">
          ?
        </span>
      </h2>

      <div className={s.wizPane}>
        {step === 0 && (
          <div className={s.wizOpts} role="group" aria-labelledby="wiz-q" aria-describedby={error.needs ? "start-needs-err" : undefined}>
            {needs.map((n, i) => (
              <label key={n} className={s.wizOpt}>
                <input id={i === 0 ? "start-needs" : undefined} type="checkbox" checked={d.needs.includes(n)} onChange={() => set("needs", d.needs.includes(n) ? d.needs.filter((x) => x !== n) : [...d.needs, n])} />
                <span>
                  <span className={s.wizNum}>{pad(i + 1)}</span>
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
            <div className={s.formTwo}>
              {field("name", "Your name", "text", "name")}
              {field("email", "Email", "email", "email")}
            </div>
            {field("company", "Company (optional)", "text", "organization")}
            <div className={s.field} data-error={!!error.message}>
              <label htmlFor="start-message">What are you trying to do?</label>
              <textarea id="start-message" rows={4} value={d.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!error.message} aria-describedby={error.message ? "start-message-err" : undefined} />
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
        {(step === 2 || step === 3) && <p className={s.wizHint}>Optional — skip it if you are not sure.</p>}
      </div>

      <div className={s.wizNav}>
        {step > 0 ? (
          <button type="button" className={s.btnGhost} onClick={back}>
            ← Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className={s.btn}>
          {step === STEPS.length - 1 ? "Send it" : "Next"} <span aria-hidden="true">→</span>
        </button>
      </div>
      {step === STEPS.length - 1 && <p className={s.wizHint}>Opens your email app with these answers filled in. Nothing is stored on this site.</p>}
    </form>
  );
}

/* ------------------------------------------------------------------ stack filter */

export function StackFilter({ tools, groups }: { tools: { name: string; group: string }[]; groups: string[] }) {
  const [q, setQ] = useState("");
  const [g, setG] = useState("All");
  const list = useMemo(() => tools.filter((t) => (g === "All" || t.group === g) && t.name.toLowerCase().includes(q.trim().toLowerCase())), [tools, q, g]);
  const count = (x: string) => (x === "All" ? tools.length : tools.filter((t) => t.group === x).length);
  return (
    <div>
      <label className={s.search}>
        <span className={s.label}>Search the stack</span>
        <input type="search" placeholder="E.G. NEXT.JS, DBT, PYTORCH" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <div role="radiogroup" aria-label="Discipline" className={s.filters}>
        {["All", ...groups].map((x) => (
          <button key={x} type="button" role="radio" aria-checked={g === x} className={s.filter} onClick={() => setG(x)}>
            <span className={s.filterRing} aria-hidden="true" />
            {x}
            <span className={s.filterCount}>({pad(count(x))})</span>
          </button>
        ))}
      </div>
      <p className={s.label} aria-live="polite">
        Showing ({pad(list.length)})
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
        <p className={s.bodyLg}>Nothing by that name. We may still use it — ask us.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ newsletter */

/** No mailing list exists yet, so subscribing is an honest email to the studio. */
export function Newsletter({ email, id = "nl" }: { email: string; id?: string }) {
  const [addr, setAddr] = useState("");
  const [state, setState] = useState<"idle" | "error" | "sent">("idle");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(addr)) return setState("error");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Add me to your notes")}&body=${encodeURIComponent(`Please send occasional notes to ${addr}.`)}`;
    setState("sent");
  };
  return (
    <form className={s.newsForm} onSubmit={submit} noValidate>
      <label htmlFor={id} className={s.label}>
        Occasional notes
      </label>
      <div className={s.newsField}>
        <input id={id} type="email" autoComplete="email" placeholder="YOU@COMPANY.COM" value={addr} onChange={(e) => setAddr(e.target.value)} aria-invalid={state === "error"} aria-describedby={`${id}-msg`} />
        <button type="submit">
          Subscribe <span aria-hidden="true">→</span>
        </button>
      </div>
      <small id={`${id}-msg`} className={state === "error" ? s.err : s.newsNote} aria-live="polite">
        {state === "error"
          ? "That doesn't look like an email address."
          : state === "sent"
            ? "Your email app should open — send it and we'll add you by hand."
            : "A few times a year. No list software yet: this opens an email to us."}
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
      <dl className={s.cookieNow}>
        <div>
          <dt className={s.label}>Theme now</dt>
          <dd>{theme ?? "—"}</dd>
        </div>
        <div>
          <dt className={s.label}>Accent now</dt>
          <dd>{accent ?? "—"}</dd>
        </div>
      </dl>
      <button type="button" className={s.btn} onClick={reset}>
        Clear my preferences
      </button>
      <p className={s.newsNote} aria-live="polite">
        {done ? "Cleared. The theme follows your system setting again." : "Removes both cookies. Nothing else is stored."}
      </p>
    </div>
  );
}
