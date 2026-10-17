"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Discipline, Work } from "@/redesign/content";
import s from "./v5.module.css";

/** Status-bar clock in the visitor's local time. */
export function Clock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString("en-GB"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className={s.clock}>{t}</span>;
}

type Line = { text: string; tone?: "ok" | "amber" | "dim" | "in" };

const BOOT: Line[] = [
  { text: "DotGrey OS 7.0 — booting studio…", tone: "dim" },
  { text: "[  ok  ] design.service        started", tone: "ok" },
  { text: "[  ok  ] software.service      started", tone: "ok" },
  { text: "[  ok  ] automation.service    started", tone: "ok" },
  { text: "[  ok  ] data.service          started", tone: "ok" },
  { text: "[  ok  ] ml.service            started", tone: "ok" },
  { text: "All systems nominal. Type `help`, or tap a command below.", tone: "amber" },
];

/**
 * A working shell. Boots line by line (instantly under reduced motion), then accepts
 * commands. `open <project>` navigates to that case study; section commands scroll.
 */
export function Terminal({ disciplines, works, email }: { disciplines: Discipline[]; works: Work[]; email: string }) {
  const reduced = useReducedMotion();
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduced motion prints the whole boot log in one tick instead of line by line.
    const step = reduced ? BOOT.length : 1;
    let i = 0;
    const id = setInterval(() => {
      i += step;
      setLines(BOOT.slice(0, i));
      if (i >= BOOT.length) clearInterval(id);
    }, reduced ? 0 : 220);
    return () => clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [lines]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h].slice(0, 30));
    setHIndex(-1);
    const [name, ...args] = cmd.split(/\s+/);
    const out: Line[] = [{ text: `guest@dotgrey:~$ ${cmd}`, tone: "in" }];
    switch (name.toLowerCase()) {
      case "help":
        out.push(
          { text: "commands:" },
          { text: "  services        what we do" },
          { text: "  work            recent projects" },
          { text: "  open <name>     open a case study, e.g. `open workday`" },
          { text: "  automate        run the pipeline demo" },
          { text: "  whoami | date | contact | clear", tone: "dim" },
        );
        break;
      case "services":
      case "ls":
        disciplines.forEach((d) => out.push({ text: `  ${d.number}  ${d.title.padEnd(28)} ${d.short.toLowerCase()}/`, tone: "ok" }));
        out.push({ text: "  → scrolling to ~/services", tone: "dim" });
        setTimeout(() => scrollTo("services"), 400);
        break;
      case "work":
      case "projects":
        works.forEach((w) => out.push({ text: `  ${w.slug.padEnd(22)} ${w.stats[0].value.padStart(6)}  ${w.stats[0].label}`, tone: "ok" }));
        out.push({ text: "  try: open " + works[0].slug, tone: "dim" });
        break;
      case "open":
      case "cd": {
        const q = (args[0] ?? "").toLowerCase();
        const hit = works.find((w) => w.slug.startsWith(q) || w.title.toLowerCase().startsWith(q));
        if (q && hit) {
          out.push({ text: `  opening ${hit.title}…`, tone: "amber" });
          setTimeout(() => router.push(`/v5/work/${hit.slug}`), 350);
        } else out.push({ text: `  no such project: ${q || "(empty)"} — try \`work\``, tone: "amber" });
        break;
      }
      case "automate":
      case "run":
        out.push({ text: "  → jumping to pipeline.run()", tone: "dim" });
        setTimeout(() => scrollTo("pipeline"), 300);
        break;
      case "whoami":
        out.push({ text: "  guest — welcome. we're DotGrey: design, software, automation, data & ML.", tone: "ok" });
        break;
      case "date":
        out.push({ text: "  " + new Date().toString(), tone: "ok" });
        break;
      case "contact":
      case "hire":
        out.push({ text: `  mail → ${email}`, tone: "amber" }, { text: "  we reply within one working day.", tone: "dim" });
        break;
      case "sudo":
        out.push({ text: "  permission granted. opening your mail client…", tone: "amber" });
        setTimeout(() => (window.location.href = `mailto:${email}`), 500);
        break;
      case "clear":
        setLines([]);
        return;
      default:
        out.push({ text: `  command not found: ${name}. type \`help\``, tone: "amber" });
    }
    setLines((l) => [...l, ...out]);
  }

  return (
    <div>
      <div ref={outRef} className={s.lines} aria-live="polite" style={{ maxHeight: "22rem", overflow: "auto" }}>
        {lines.map((l, i) => (
          <div key={i} className={l.tone === "ok" ? s.ok : l.tone === "amber" ? s.amber : l.tone === "dim" ? s.dim : undefined}>
            {l.text}
          </div>
        ))}
      </div>
      <form
        className={s.promptRow}
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
          setValue("");
        }}
      >
        <label htmlFor="v5-shell" className={s.prompt}>
          guest@dotgrey:~$
        </label>
        <input
          ref={inputRef}
          id="v5-shell"
          className={s.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" && history.length) {
              e.preventDefault();
              const n = Math.min(history.length - 1, hIndex + 1);
              setHIndex(n);
              setValue(history[n]);
            }
          }}
          autoComplete="off"
          spellCheck={false}
          placeholder="type help"
          aria-describedby="v5-shell-hint"
        />
        <span className={s.cursor} aria-hidden="true" />
      </form>
      <div id="v5-shell-hint" className={s.chips}>
        {["help", "services", "work", `open ${works[0].slug}`, "automate", "contact"].map((c) => (
          <button key={c} type="button" className={s.chip} onClick={() => run(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

type Stage = { name: string; detail: string; ms: number; log: string[] };

const SCENARIOS: Record<string, Stage[]> = {
  "New lead": [
    { name: "Trigger", detail: "Form submitted on website", ms: 500, log: ["webhook POST /leads 201", "payload: {name, company, message}"] },
    { name: "Enrich", detail: "Company size, industry, region", ms: 800, log: ["lookup company domain", "industry=logistics size=200-500"] },
    { name: "Classify (ML)", detail: "Intent + fit score", ms: 900, log: ["model=lead-fit-v3", "intent=project fit=0.87"] },
    { name: "Route", detail: "Create deal, assign owner", ms: 600, log: ["crm.deals.create → #4821", "owner=sales-apac"] },
    { name: "Notify", detail: "Slack + reply email", ms: 500, log: ["slack #new-business ✓", "auto-reply sent ✓"] },
  ],
  "Invoice received": [
    { name: "Trigger", detail: "PDF arrives in finance inbox", ms: 500, log: ["imap: 1 new message", "attachment: INV-2026-0417.pdf"] },
    { name: "Extract (ML)", detail: "Read fields from the PDF", ms: 1000, log: ["ocr + layout model", "vendor, total, due date, VAT → extracted"] },
    { name: "Validate", detail: "Match PO and amounts", ms: 700, log: ["PO-3381 matched", "amount within 0.5% tolerance"] },
    { name: "Post", detail: "Create bill in accounting", ms: 600, log: ["accounting.bills.create → B-9912"] },
    { name: "Notify", detail: "Approver gets one click", ms: 500, log: ["approval request → finance lead ✓"] },
  ],
  "Support ticket": [
    { name: "Trigger", detail: "Email to support@", ms: 500, log: ["helpdesk: ticket #77120 opened"] },
    { name: "Classify (ML)", detail: "Topic, urgency, language", ms: 900, log: ["topic=billing urgency=high lang=en"] },
    { name: "Retrieve", detail: "Search docs + past tickets", ms: 800, log: ["rag: 4 passages, top score 0.91"] },
    { name: "Draft", detail: "Suggested reply for an agent", ms: 900, log: ["draft ready — human review required"] },
    { name: "Route", detail: "Priority queue + SLA timer", ms: 500, log: ["queue=billing-priority SLA=2h ✓"] },
  ],
};

/** Run a real-looking automation, step by step, with a streaming log. Starts only on click. */
export function Pipeline() {
  const reduced = useReducedMotion();
  const [scenario, setScenario] = useState<keyof typeof SCENARIOS>("New lead");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>(["// choose a scenario and press run"]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stages = SCENARIOS[scenario];

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const start = performance.now();
    const stamp = (ms: number) => `[${(ms / 1000).toFixed(2).padStart(5, "0")}s]`;
    setRunning(true);
    setStep(0);
    setLog([`${stamp(0)} pipeline "${scenario.toLowerCase()}" started`]);
    let at = 0;
    stages.forEach((st, i) => {
      at += reduced ? 0 : st.ms;
      const t = at;
      timers.current.push(
        setTimeout(() => {
          setStep(i + 1);
          setLog((l) => [...l, `${stamp(t)} ✓ ${st.name.toLowerCase()}`, ...st.log.map((x) => `           ${x}`)]);
          if (i === stages.length - 1) {
            const total = reduced ? 0 : performance.now() - start;
            setLog((l) => [...l, "", `done — ${stages.length} steps · ${(total / 1000).toFixed(1)}s · 0 errors`]);
            setRunning(false);
          }
        }, t),
      );
    });
  }

  return (
    <div className={s.demo}>
      <div>
        <div className={s.chips} style={{ marginTop: 0, marginBottom: "1rem" }} role="radiogroup" aria-label="Scenario">
          {Object.keys(SCENARIOS).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={k === scenario}
              className={s.chip}
              style={k === scenario ? { background: "var(--g)", color: "var(--bg)" } : undefined}
              disabled={running}
              onClick={() => {
                setScenario(k as keyof typeof SCENARIOS);
                setStep(-1);
                setLog(["// press run"]);
              }}
            >
              {k}
            </button>
          ))}
        </div>
        <div className={s.dag}>
          {stages.map((st, i) => (
            <div key={st.name}>
              <div className={`${s.nodeBox} ${step > i ? s.nodeDone : step === i && running ? s.nodeRun : ""}`}>
                <span>{step > i ? "[✓]" : step === i && running ? "[▸]" : "[ ]"}</span>
                <span>
                  <b>{st.name}</b>
                  <small>{st.detail}</small>
                </span>
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
              {i < stages.length - 1 && <div className={s.arrow}>│</div>}
            </div>
          ))}
        </div>
        <button type="button" className={s.btn} style={{ marginTop: "1.25rem" }} onClick={run} disabled={running}>
          {running ? "running…" : "▶ run pipeline"}
        </button>
      </div>
      <pre className={s.log} aria-live="polite">
        {log.join("\n")}
      </pre>
    </div>
  );
}
