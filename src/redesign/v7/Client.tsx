"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import s from "./v7.module.css";

function partOfDay(h: number) {
  if (h < 5) return { hello: "Up late?", icon: "☾" };
  if (h < 12) return { hello: "Good morning!", icon: "☀" };
  if (h < 17) return { hello: "Good afternoon!", icon: "☀" };
  if (h < 22) return { hello: "Good evening!", icon: "☾" };
  return { hello: "Up late?", icon: "☾" };
}

const fmt = (d: Date, tz?: string) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz });

/**
 * "Good evening! It's 8:14 PM for you and 6:14 AM here in Dhaka." Server renders a neutral
 * hello; the local version replaces it after hydration.
 */
export function Greeting() {
  const [text, setText] = useState<{ hello: string; icon: string; line: string } | null>(null);
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const p = partOfDay(now.getHours());
      setText({ ...p, line: `It's ${fmt(now)} for you and ${fmt(now, "Asia/Dhaka")} here in Dhaka.` });
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={s.greet}>
      <span className={s.greetDot} aria-hidden="true" />
      <span suppressHydrationWarning>
        {text ? (
          <>
            <span aria-hidden="true">{text.icon}</span> {text.hello} {text.line}
          </>
        ) : (
          "Hello from Dhaka!"
        )}
      </span>
    </span>
  );
}

type NeedId = "website" | "app" | "software" | "automation" | "data" | "ml";

const NEEDS: { id: NeedId; label: string; weeks: number; roles: string[] }[] = [
  { id: "website", label: "Website", weeks: 3, roles: ["Designer", "Web engineer"] },
  { id: "app", label: "Mobile app", weeks: 6, roles: ["Product designer", "Mobile engineer"] },
  { id: "software", label: "Custom software", weeks: 8, roles: ["Product designer", "Backend engineer", "Frontend engineer"] },
  { id: "automation", label: "Automation", weeks: 3, roles: ["Automation engineer"] },
  { id: "data", label: "Data dashboard", weeks: 4, roles: ["Data engineer", "Analyst"] },
  { id: "ml", label: "AI / ML feature", weeks: 6, roles: ["ML engineer", "Data engineer"] },
];

const SIZES = [
  { id: "s", label: "Small — a focused first version", k: 0.7 },
  { id: "m", label: "Medium — a solid launch", k: 1 },
  { id: "l", label: "Large — a platform", k: 1.6 },
] as const;

const PACE = [
  { id: "asap", label: "As soon as possible" },
  { id: "q", label: "In the next 1–3 months" },
  { id: "flex", label: "Flexible" },
] as const;

/**
 * Scope planner: pick what you need, how big and how soon; get a rough timeline and the
 * team shape. Deliberately a range, labelled as a guide — not a quote.
 */
export function ScopePlanner({ email }: { email: string }) {
  const [needs, setNeeds] = useState<NeedId[]>(["website", "automation"]);
  const [size, setSize] = useState<(typeof SIZES)[number]["id"]>("m");
  const [pace, setPace] = useState<(typeof PACE)[number]["id"]>("q");

  const picked = NEEDS.filter((n) => needs.includes(n.id));
  const base = picked.length ? Math.max(...picked.map((n) => n.weeks)) + 0.4 * (picked.reduce((a, n) => a + n.weeks, 0) - Math.max(...picked.map((n) => n.weeks))) : 0;
  const k = SIZES.find((x) => x.id === size)!.k;
  const weeks = base * k * (pace === "asap" ? 0.85 : 1);
  const lo = Math.max(2, Math.round(weeks * 0.85));
  const hi = Math.max(lo + 1, Math.round(weeks * 1.25));
  const roles = [...new Set(["Project lead", ...picked.flatMap((n) => n.roles)])];
  const team = roles.length + (pace === "asap" ? 1 : 0);

  const body = encodeURIComponent(
    `Hi DotGrey,\n\nWe'd like to talk about: ${picked.map((n) => n.label).join(", ") || "a project"}.\nSize: ${SIZES.find((x) => x.id === size)!.label}\nTiming: ${PACE.find((x) => x.id === pace)!.label}\n\nYour planner suggested roughly ${lo}–${hi} weeks with a team of ${team}.\n\n`,
  );

  const toggle = (id: NeedId) => setNeeds((n) => (n.includes(id) ? n.filter((x) => x !== id) : [...n, id]));

  return (
    <div className={s.planner}>
      <div>
        <div className={s.q}>
          <span className={s.qLabel} id="need-label">
            1. What do you need? <small>(pick any)</small>
          </span>
          <div className={s.opts} role="group" aria-labelledby="need-label">
            {NEEDS.map((n) => (
              <button key={n.id} type="button" className={s.opt} aria-pressed={needs.includes(n.id)} onClick={() => toggle(n.id)}>
                {needs.includes(n.id) && <Check size={16} aria-hidden="true" />}
                {n.label}
              </button>
            ))}
          </div>
        </div>
        <div className={s.q}>
          <span className={s.qLabel} id="size-label">
            2. How big?
          </span>
          <div className={s.opts} role="radiogroup" aria-labelledby="size-label">
            {SIZES.map((x) => (
              <button key={x.id} type="button" role="radio" className={s.opt} aria-checked={size === x.id} onClick={() => setSize(x.id)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <div className={s.q} style={{ marginBottom: 0 }}>
          <span className={s.qLabel} id="pace-label">
            3. When?
          </span>
          <div className={s.opts} role="radiogroup" aria-labelledby="pace-label">
            {PACE.map((x) => (
              <button key={x.id} type="button" role="radio" className={s.opt} aria-checked={pace === x.id} onClick={() => setPace(x.id)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={s.result} aria-live="polite">
        <span style={{ fontWeight: 700 }}>Your rough plan</span>
        {picked.length ? (
          <>
            <span className={s.resultBig}>
              {lo}–{hi} weeks
            </span>
            <span>
              with a team of <b>{team}</b>
              {pace === "asap" ? " (one extra pair of hands to go faster)" : ""}:
            </span>
            <div className={s.team}>
              {roles.map((r) => (
                <span key={r} className={s.role}>
                  {r}
                </span>
              ))}
              {pace === "asap" && <span className={s.role}>+1 engineer</span>}
            </div>
            <a href={`mailto:${email}?subject=${encodeURIComponent("Project plan")}&body=${body}`} className={s.btn} style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
              Send this plan <ArrowRight size={18} />
            </a>
          </>
        ) : (
          <span className={s.resultBig} style={{ fontSize: "1.6rem" }}>
            Pick at least one thing you need.
          </span>
        )}
        <span className={s.note}>A rough guide from typical projects, not a quote. We&apos;ll confirm after a 30-minute call.</span>
      </div>
    </div>
  );
}
