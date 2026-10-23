"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { ACCENT_COOKIE, THEME_COOKIE } from "@/redesign/shared/theme";
import { useAccent, useTheme } from "@/redesign/shared/useTheme";
import type { Stage, Tool } from "@/redesign/agency";
import s from "./v10.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ process timeline */

/**
 * The process as a HUD timeline: a sticky readout tracks which stage is on screen and how
 * far through the run the reader is. On narrow screens the readout becomes a top strip.
 */
export function StageTimeline({ stages }: { stages: Stage[] }) {
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
    <div className={s.xTrack}>
      <nav className={s.xRail} aria-label="Stages">
        <p className={s.label}>
          run · stage {pad(active + 1)}/{pad(stages.length)}
        </p>
        <span className={s.xRailBar} aria-hidden="true">
          <span style={{ transform: `scaleX(${(active + 1) / stages.length})` }} />
        </span>
        <ol>
          {stages.map((st, i) => (
            <li key={st.id}>
              <a href={`#stage-${st.id}`} aria-current={i === active ? "step" : undefined}>
                <span className={s.xDot} aria-hidden="true" />
                <span className={s.rowNum}>{pad(i + 1)}</span>
                {st.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div>
        {stages.map((st, i) => (
          <section
            key={st.id}
            id={`stage-${st.id}`}
            data-i={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={s.xStage}
            aria-labelledby={`stage-${st.id}-t`}
          >
            <p className={s.kicker}>
              stage {pad(i + 1)} · {st.duration}
            </p>
            <h2 id={`stage-${st.id}-t`} className={s.xStageTitle}>
              {st.title}
              <span className={s.acc}>.</span>
            </h2>
            <p className={s.xStageLine}>{st.line}</p>
            <div className={s.xCols}>
              <div>
                <p className={s.label}>Process</p>
                <ul className={s.xDash}>
                  {st.happens.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={s.label}>Output</p>
                <ul className={s.xDash}>
                  {st.deliverables.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={s.label}>Who runs it</p>
                <ul className={s.xDash}>
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

type Option = { id: string; label: string; note?: string };
type Answers = { needs: string[]; stage: string; budget: string; timing: string; name: string; email: string; company: string; message: string };

const STEPS = ["need", "stage", "budget", "timing", "contact", "review"] as const;

/**
 * Start a project, as a six-step console. Each step validates before moving on and puts
 * focus on the first problem; the last step hands everything to the visitor's email app.
 */
export function StartWizard({ email, needs, stages, budgets, timelines }: { email: string; needs: string[]; stages: Option[]; budgets: string[]; timelines: string[] }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({ needs: [], stage: "", budget: "", timing: "", name: "", email: "", company: "", message: "" });
  const [error, setError] = useState<Partial<Record<keyof Answers, string>>>({});
  const [sent, setSent] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const first = useRef(true);

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    bodyRef.current?.querySelector<HTMLElement>("[data-step-head]")?.focus();
  }, [step, sent]);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((p) => ({ ...p, [k]: v }));

  const check = (): boolean => {
    const e: typeof error = {};
    const id = STEPS[step];
    if (id === "need" && !a.needs.length) e.needs = "Pick at least one.";
    if (id === "stage" && !a.stage) e.stage = "Pick the closest match.";
    if (id === "budget" && !a.budget) e.budget = "Pick a range, or 'Not sure yet'.";
    if (id === "timing" && !a.timing) e.timing = "Pick a timeline, or 'Flexible'.";
    if (id === "contact") {
      if (!a.name.trim()) e.name = "Name required.";
      if (!/^\S+@\S+\.\S+$/.test(a.email.trim())) e.email = "A valid email, so we can reply.";
      if (a.message.trim().length < 10) e.message = "A sentence or two about the project.";
    }
    setError(e);
    const key = Object.keys(e)[0];
    if (key) {
      requestAnimationFrame(() => bodyRef.current?.querySelector<HTMLElement>(`[data-field="${key}"]`)?.focus());
      return false;
    }
    return true;
  };

  const next = () => check() && setStep((n) => Math.min(n + 1, STEPS.length - 1));
  const back = () => {
    setError({});
    setStep((n) => Math.max(n - 1, 0));
  };

  const send = () => {
    const stageLabel = stages.find((x) => x.id === a.stage)?.label ?? a.stage;
    const body = [
      `Name: ${a.name}`,
      `Email: ${a.email}`,
      a.company && `Company: ${a.company}`,
      `Needs: ${a.needs.join(", ")}`,
      `Stage: ${stageLabel}`,
      `Budget: ${a.budget}`,
      `Timeline: ${a.timing}`,
      "",
      a.message,
    ]
      .filter((x) => x !== "")
      .join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`New project — ${a.name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const radio = (field: "stage" | "budget" | "timing", options: Option[]) => (
    <div className={s.xOpts} role="radiogroup" aria-labelledby={`${uid}-h`} data-field={field} tabIndex={-1} aria-describedby={error[field] ? `${uid}-err` : undefined}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={a[field] === o.id} className={s.xOpt} onClick={() => set(field, o.id)}>
          <span className={s.xOptBox} aria-hidden="true" />
          <span>
            {o.label}
            {o.note && <small>{o.note}</small>}
          </span>
        </button>
      ))}
    </div>
  );

  const err = (k: keyof Answers) =>
    error[k] ? (
      <p className={s.err} id={k === "needs" || k === "stage" || k === "budget" || k === "timing" ? `${uid}-err` : `${uid}-err-${k}`}>
        ! {error[k]}
      </p>
    ) : null;

  if (sent) {
    return (
      <div className={s.console} role="status" ref={bodyRef}>
        <p className={s.consoleBar}>
          <span>start.sh</span>
          <span>exit 0</span>
        </p>
        <div className={s.consoleBody}>
          <h2 className={s.xWizHead} tabIndex={-1} data-step-head>
            &gt; Brief handed to your email app
          </h2>
          <p className={s.xWizNote}>
            It should have opened with everything filled in — press send there, and we reply within a working day. Nothing was stored
            on this site. No window? Write to <a href={`mailto:${email}`}>{email}</a>.
          </p>
          <button type="button" className={s.ghostBtn} onClick={() => setSent(false)}>
            Back to the review
          </button>
        </div>
      </div>
    );
  }

  const id = STEPS[step];
  const titles: Record<(typeof STEPS)[number], string> = {
    need: "What do you need?",
    stage: "Where are you now?",
    budget: "What's the budget?",
    timing: "When should it start?",
    contact: "Who are we talking to?",
    review: "Check and send",
  };
  const stageLabel = stages.find((x) => x.id === a.stage)?.label;

  return (
    <form
      className={s.console}
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        if (id === "review") send();
        else next();
      }}
      noValidate
    >
      <p className={s.consoleBar}>
        <span>
          start.sh<span className={s.xBarSteps}> · {STEPS.map((x, i) => (i === step ? `[${x}]` : x)).join(" › ")}</span>
          <span className={s.xBarNow}> · {STEPS[step]}</span>
        </span>
        <span>
          {pad(step + 1)}/{pad(STEPS.length)}
        </span>
      </p>
      <span className={s.xProg} aria-hidden="true">
        <span style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
      </span>
      <div className={s.consoleBody} ref={bodyRef}>
        <h2 id={`${uid}-h`} className={s.xWizHead} tabIndex={-1} data-step-head>
          <span className={s.rowNum}>{pad(step + 1)} &gt;</span> {titles[id]}
        </h2>

        {id === "need" && (
          <>
            <p className={s.xWizNote}>Pick everything that applies.</p>
            <div className={s.chips} data-field="needs" tabIndex={-1} role="group" aria-labelledby={`${uid}-h`} aria-describedby={error.needs ? `${uid}-err` : undefined}>
              {needs.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={s.chip}
                  aria-pressed={a.needs.includes(n)}
                  onClick={() => set("needs", a.needs.includes(n) ? a.needs.filter((x) => x !== n) : [...a.needs, n])}
                >
                  {n}
                </button>
              ))}
            </div>
            {err("needs")}
          </>
        )}
        {id === "stage" && (
          <>
            {radio("stage", stages)}
            {err("stage")}
          </>
        )}
        {id === "budget" && (
          <>
            <p className={s.xWizNote}>A rough range helps us suggest the right engagement. It is not a commitment.</p>
            {radio(
              "budget",
              Array.from(new Set([...budgets, "Not sure yet"])).map((b) => ({ id: b, label: b })),
            )}
            {err("budget")}
          </>
        )}
        {id === "timing" && (
          <>
            {radio(
              "timing",
              Array.from(new Set([...timelines, "Flexible"])).map((b) => ({ id: b, label: b })),
            )}
            {err("timing")}
          </>
        )}
        {id === "contact" && (
          <div className={s.formGrid}>
            <label className={s.cField}>
              <span className={s.cLabel}>name</span>
              <input data-field="name" value={a.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!error.name} aria-describedby={error.name ? `${uid}-err-name` : undefined} />
              {err("name")}
            </label>
            <label className={s.cField}>
              <span className={s.cLabel}>email</span>
              <input
                data-field="email"
                type="email"
                value={a.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
                aria-invalid={!!error.email}
                aria-describedby={error.email ? `${uid}-err-email` : undefined}
              />
              {err("email")}
            </label>
            <label className={`${s.cField} ${s.cWide}`}>
              <span className={s.cLabel}>company (optional)</span>
              <input value={a.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
            </label>
            <label className={`${s.cField} ${s.cWide}`}>
              <span className={s.cLabel}>the project</span>
              <textarea
                data-field="message"
                rows={4}
                value={a.message}
                onChange={(e) => set("message", e.target.value)}
                aria-invalid={!!error.message}
                aria-describedby={error.message ? `${uid}-err-message` : undefined}
              />
              {err("message")}
            </label>
          </div>
        )}
        {id === "review" && (
          <dl className={s.xReview}>
            {(
              [
                ["Needs", a.needs.join(", "), 0],
                ["Stage", stageLabel, 1],
                ["Budget", a.budget, 2],
                ["Timeline", a.timing, 3],
                ["Contact", `${a.name} · ${a.email}${a.company ? ` · ${a.company}` : ""}`, 4],
                ["Project", a.message, 4],
              ] as const
            ).map(([k, v, to]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
                <dd>
                  <button type="button" className={s.inlineLink} onClick={() => setStep(to)}>
                    Edit
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className={s.formFoot}>
          {step > 0 && (
            <button type="button" className={s.ghostBtn} onClick={back}>
              <span aria-hidden="true">←</span> Back
            </button>
          )}
          <button type="submit" className={s.cta}>
            {id === "review" ? "Send via email" : "Next"} <span aria-hidden="true">→</span>
          </button>
          {id === "review" && <span className={s.formNote}>Opens your email app with the brief filled in. Nothing is stored here.</span>}
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ stack console */

/** The full tool list as a searchable console: type to filter, chips to narrow by craft. */
export function StackConsole({ tools }: { tools: Tool[] }) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("All");
  const groups = useMemo(() => ["All", ...Array.from(new Set(tools.map((t) => t.group)))], [tools]);
  const shown = tools.filter((t) => (group === "All" || t.group === group) && t.name.toLowerCase().includes(q.trim().toLowerCase()));
  const inputId = useId();

  return (
    <div className={s.console}>
      <p className={s.consoleBar}>
        <span>stack --list</span>
        <span aria-live="polite">
          {shown.length}/{tools.length} tools
        </span>
      </p>
      <div className={s.consoleBody}>
        <label htmlFor={inputId} className={s.cLabel}>
          &gt; grep
        </label>
        <input id={inputId} className={s.xSearch} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a tool name…" autoComplete="off" />
        <div className={s.chips} role="group" aria-label="Filter by craft">
          {groups.map((g) => (
            <button key={g} type="button" className={s.chip} aria-pressed={group === g} onClick={() => setGroup(g)}>
              {g} <span>{g === "All" ? tools.length : tools.filter((t) => t.group === g).length}</span>
            </button>
          ))}
        </div>
        {shown.length ? (
          <ul className={s.xTools}>
            {shown.map((t) => (
              <li key={t.name}>
                <span>{t.name}</span>
                <span className={s.xToolGroup}>{t.group}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={s.xWizNote}>&gt; No match. Try a shorter word, or ask us — we probably use something close.</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ newsletter */

/** There is no mailing-list software yet, so subscribing is an honest email. */
export function Newsletter({ email }: { email: string }) {
  const [done, setDone] = useState(false);
  const [bad, setBad] = useState(false);
  const id = useId();
  return done ? (
    <p className={s.ok} role="status">
      &gt; Your email app should have opened with a subscribe note. Send it and we add you by hand — no list software yet.
    </p>
  ) : (
    <form
      className={s.xNews}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const v = String(new FormData(e.currentTarget).get("addr") ?? "").trim();
        if (!/^\S+@\S+\.\S+$/.test(v)) {
          setBad(true);
          e.currentTarget.querySelector("input")?.focus();
          return;
        }
        window.location.href = `mailto:${email}?subject=${encodeURIComponent("Subscribe me")}&body=${encodeURIComponent(`Please add ${v} to the DotGrey notes.`)}`;
        setDone(true);
      }}
    >
      <label htmlFor={id} className={s.cLabel}>
        &gt; subscribe
      </label>
      <div>
        <input id={id} name="addr" type="email" placeholder="you@company.com" autoComplete="email" aria-invalid={bad} aria-describedby={bad ? `${id}-e` : undefined} />
        <button type="submit" className={s.cta}>
          Subscribe <span aria-hidden="true">→</span>
        </button>
      </div>
      {bad && (
        <p className={s.err} id={`${id}-e`}>
          ! A valid email, please.
        </p>
      )}
      <p className={s.formNote}>Opens an email to us. Roughly one note a month; reply to leave.</p>
    </form>
  );
}

/* ------------------------------------------------------------------ cookie reset */

/** Shows the two preference cookies' current values and clears them on request. */
export function CookieReset() {
  const theme = useTheme();
  const accent = useAccent();
  const [cleared, setCleared] = useState(false);
  return (
    <div className={s.console}>
      <p className={s.consoleBar}>
        <span>cookies --show</span>
        <span>{cleared ? "cleared" : "2 set at most"}</span>
      </p>
      <div className={s.consoleBody}>
        <p className={s.xWizNote}>
          &gt; Current view: {theme ?? "…"} theme, {accent ?? "…"} accent.
        </p>
        <button
          type="button"
          className={s.ghostBtn}
          onClick={() => {
            for (const n of [THEME_COOKIE, ACCENT_COOKIE]) document.cookie = `${n}=; path=/; max-age=0; samesite=lax`;
            setCleared(true);
          }}
        >
          Clear my preferences
        </button>
        {cleared && (
          <p className={s.ok} role="status">
            &gt; Both cookies deleted. The page keeps its look until you reload; then it follows your system setting.
          </p>
        )}
      </div>
    </div>
  );
}
