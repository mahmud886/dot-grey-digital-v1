"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ACCENT_COOKIE, THEME_COOKIE } from "@/redesign/shared/theme";
import { useAccent, useTheme } from "@/redesign/shared/useTheme";
import s from "./v8.module.css";

/* ------------------------------------------------------------------ stage tracker */

type StageView = { id: string; title: string; line: string; happens: string[]; deliverables: string[]; who: string[]; duration: string };

/**
 * The process, one stage per screen. A sticky rail on the left tracks which stage is in view
 * and how far through the process the reader is; on mobile the rail becomes a top bar.
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
        <span className={s.trackBar} aria-hidden="true">
          <span style={{ transform: `scaleY(${(active + 1) / stages.length})` }} />
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
              Stage {String(i + 1).padStart(2, "0")} · {st.duration}
            </p>
            <h2 id={`stage-${st.id}-t`} className={s.stageTitle}>
              {st.title}
              <span className={s.stop}>.</span>
            </h2>
            <p className={s.stageLine}>{st.line}</p>
            <div className={s.stageCols}>
              <div>
                <p className={s.footHead}>What happens</p>
                <ul className={s.dashList}>
                  {st.happens.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={s.footHead}>You get</p>
                <ul className={s.dashList}>
                  {st.deliverables.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={s.footHead}>Who is in the room</p>
                <ul className={s.dashList}>
                  {st.who.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
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

/**
 * Start a project, one question at a time. No backend: the last step opens the visitor's
 * email app with everything filled in, and the page says so.
 */
export function StartWizard({ email, needs, stages, budgets, timelines }: { email: string; needs: string[]; stages: Opt[]; budgets: string[]; timelines: string[] }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<StartData>({ needs: [], stage: "", budget: "", timeline: "", name: "", email: "", company: "", message: "" });
  const [error, setError] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
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
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "We need an email address to reply to.";
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
        <p className={s.kicker}>Almost there.</p>
        <h2 ref={head} tabIndex={-1} className={s.sentTitle}>
          Your email app should open with the brief filled in.
        </h2>
        <p className={s.sentBody}>
          Press send there and we reply within a working day. Nothing opened? Write to <a href={`mailto:${email}`}>{email}</a>. Nothing has been stored on this site.
        </p>
        <button type="button" className={s.pillSolidWide} onClick={() => setSent(false)}>
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
            <b>{o.label}</b>
            {o.note && <small>{o.note}</small>}
          </span>
        </label>
      ))}
    </div>
  );

  const field = (k: "name" | "email" | "company", label: string, type = "text", auto?: string) => (
    <div className={s.fieldRow} data-error={!!error[k]}>
      <label htmlFor={`start-${k}`}>{label}</label>
      <input id={`start-${k}`} type={type} autoComplete={auto} value={d[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={!!error[k]} aria-describedby={error[k] ? `start-${k}-err` : undefined} />
      {error[k] && (
        <small id={`start-${k}-err`} className={s.err}>
          {error[k]}
        </small>
      )}
    </div>
  );

  const questions = ["What do you need?", "Where are you starting from?", "Roughly what budget?", "When do you want to start?", "Who should we reply to?", "Does this look right?"];

  return (
    <form className={s.wizard} onSubmit={submit} noValidate>
      <div className={s.wizTop}>
        <p className={s.kicker} aria-live="polite">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
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
        {questions[step].slice(0, -1)}
        <span className={s.stop}>?</span>
      </h2>

      <div className={s.wizPane}>
        {step === 0 && (
          <div className={s.wizOpts} role="group" aria-labelledby="wiz-q" aria-describedby={error.needs ? "start-needs-err" : undefined}>
            {needs.map((n, i) => (
              <label key={n} className={s.wizOpt}>
                <input id={i === 0 ? "start-needs" : undefined} type="checkbox" checked={d.needs.includes(n)} onChange={() => set("needs", d.needs.includes(n) ? d.needs.filter((x) => x !== n) : [...d.needs, n])} />
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
            <div className={s.formTwo}>
              {field("name", "Your name", "text", "name")}
              {field("email", "Email", "email", "email")}
            </div>
            {field("company", "Company (optional)", "text", "organization")}
            <div className={s.fieldRow} data-error={!!error.message}>
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
        {(step === 2 || step === 3) && <small className={s.wizHint}>Optional — skip it if you are not sure.</small>}
      </div>

      <div className={s.wizNav}>
        {step > 0 ? (
          <button type="button" className={s.pillGhost} onClick={back}>
            ← Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className={s.pillAccent}>
          {step === STEPS.length - 1 ? "Send it →" : "Next →"}
        </button>
      </div>
      {step === STEPS.length - 1 && <small className={s.wizHint}>Opens your email app with these answers filled in. Nothing is stored on this site.</small>}
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
      <div className={s.stackBar}>
        <label className={s.searchBox}>
          <span className={s.srOnly}>Search the stack</span>
          <input type="search" placeholder="Search — e.g. Next.js, dbt, PyTorch" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div role="radiogroup" aria-label="Discipline" className={s.chips}>
          {["All", ...groups].map((x) => (
            <button key={x} type="button" role="radio" aria-checked={g === x} className={s.chip} onClick={() => setG(x)}>
              {x}
            </button>
          ))}
        </div>
      </div>
      <p className={s.indexCount} aria-live="polite">
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
        <p className={s.emptyNote}>Nothing by that name. We may still use it — ask us.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ newsletter */

/** No mailing list exists yet, so subscribing is an honest email to the studio. */
export function Newsletter({ email, compact = false }: { email: string; compact?: boolean }) {
  const [addr, setAddr] = useState("");
  const [state, setState] = useState<"idle" | "error" | "sent">("idle");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) return setState("error");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Add me to your notes")}&body=${encodeURIComponent(`Please send occasional notes to ${addr}.`)}`;
    setState("sent");
  };
  const id = compact ? "nl-foot" : "nl-page";
  return (
    <form className={`${s.news} ${compact ? s.newsCompact : ""}`} onSubmit={submit} noValidate>
      <label htmlFor={id} className={s.footHead}>
        Occasional notes
      </label>
      <div className={s.newsRow}>
        <input id={id} type="email" autoComplete="email" placeholder="you@company.com" value={addr} onChange={(e) => setAddr(e.target.value)} aria-invalid={state === "error"} aria-describedby={`${id}-msg`} />
        <button type="submit">Subscribe →</button>
      </div>
      <small id={`${id}-msg`} className={state === "error" ? s.err : s.newsNote} aria-live="polite">
        {state === "error" ? "That doesn't look like an email address." : state === "sent" ? "Your email app should open — send it and we'll add you by hand." : "A few times a year. No list software yet: this opens an email to us."}
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
      <button type="button" className={s.pillAccent} onClick={reset}>
        Clear my preferences
      </button>
      <small className={s.newsNote} aria-live="polite">
        {done ? "Cleared. The theme now follows your system setting again." : "Removes both cookies. Nothing else is stored."}
      </small>
    </div>
  );
}
