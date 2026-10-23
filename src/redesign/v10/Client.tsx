"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { useMotion } from "@/redesign/shared/useMotion";
import { useAccent, useTheme } from "@/redesign/shared/useTheme";
import { ThemeToggle } from "@/redesign/shared/ThemeToggle";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { ProjectMockup } from "@/redesign/shared/ProjectMockup";
import type { Discipline, Post, Work } from "@/redesign/content";
import { buildFormation, buildFormations, buildRandoms, type FormationId } from "./formations";
import { readPalette, startEngine, type Engine, type EngineState } from "./engine";
import { MENU_EXTRA } from "./agency-extra";
import s from "./v10.module.css";

// Where each formation sits on screen and how bright it is: hero, six disciplines, dust.
const OFF_WIDE: [number, number][] = [[0.38, 0.02], ...Array(6).fill([0.47, 0]), [0, 0]];
const OFF_TALL: [number, number][] = [[0, 0.36], ...Array(6).fill([0, 0.42]), [0, 0]];
const DIM = [1, 1, 1, 1, 1, 1, 1, 0.28];

let glSupport: boolean | null = null;
function detectGL() {
  if (glSupport === null) {
    try {
      glSupport = !!document.createElement("canvas").getContext("webgl");
    } catch {
      glSupport = false;
    }
  }
  return glSupport;
}
const noSubscribe = () => () => {};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Keeps an engine's colours in step with the page tokens. Runs after the theme or accent
 * attribute on <html> changes; reading computed styles means the CSS stays the only
 * source of truth for colour.
 */
function usePalette(engine: React.RefObject<Engine | null>, host: React.RefObject<HTMLElement | null>) {
  const theme = useTheme();
  const accent = useAccent();
  useEffect(() => {
    if (!engine.current || !host.current) return;
    engine.current.setPalette(readPalette(host.current));
  }, [theme, accent, engine, host]);
}

type Chapter = { id: string; label: string };

/**
 * The world: a fixed WebGL point field behind the homepage. Scrolling through the sections
 * marked `data-ch` morphs the points from one formation to the next; the HUD (discipline
 * filter, chapter counter, Pause) tracks the same position. Text stays in the DOM.
 */
export function World({ chapters, children }: { chapters: Chapter[]; children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const { paused, reduced, toggle } = useMotion();
  const hasGL = useSyncExternalStore(noSubscribe, detectGL, () => true);
  const [active, setActive] = useState(0);
  const motionRef = useRef({ paused, reduced });
  useEffect(() => {
    motionRef.current = { paused, reduced };
    engineRef.current?.dirty();
  }, [paused, reduced]);
  usePalette(engineRef, rootRef);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root) return;

    // Scroll position → chapter index + morph amount, shared with the renderer.
    const state: EngineState = { k: 0, mix: 0 };
    let anchors: number[] = [];
    const measure = () => {
      anchors = [...root.querySelectorAll<HTMLElement>("[data-ch]")].map((el) => el.getBoundingClientRect().top + scrollY);
    };
    const onScroll = () => {
      if (!anchors.length) return;
      const y = scrollY + innerHeight * 0.5;
      let k = 0;
      while (k < anchors.length - 1 && anchors[k + 1] <= y) k++;
      const span = k < anchors.length - 1 ? anchors[k + 1] - anchors[k] : 1;
      const frac = k < anchors.length - 1 ? Math.max(0, (y - anchors[k]) / span) : 0;
      state.k = k;
      state.mix = motionRef.current.reduced ? (frac > 0.85 ? 1 : 0) : smooth(0.55, 1, frac);
      setActive(k);
      if (barRef.current) {
        const p = Math.min(1, Math.max(0, (k - 1 + frac) / 6));
        barRef.current.style.transform = `scaleX(${k === 0 ? 0 : p})`;
      }
      engineRef.current?.dirty();
    };
    measure();
    onScroll();
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(root);
    addEventListener("scroll", onScroll, { passive: true });

    if (canvas) {
      const count = innerWidth < 760 ? 4200 : 9000;
      engineRef.current = startEngine({
        canvas,
        count,
        formations: buildFormations(count),
        randoms: buildRandoms(count),
        state,
        motion: () => motionRef.current,
        offset: (k, tall) => (tall ? OFF_TALL : OFF_WIDE)[k],
        dim: (k) => DIM[k],
        size: (tall) => (tall ? 2.2 : 2.6),
      });
      engineRef.current?.setPalette(readPalette(root));
    }
    return () => {
      ro.disconnect();
      removeEventListener("scroll", onScroll);
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [hasGL]);

  const go = (id: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  const chapter = active >= 1 && active <= 6 ? active : 0;

  return (
    <div ref={rootRef} className={s.world} data-zone={active >= 7 ? "index" : undefined}>
      {hasGL ? (
        <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
      ) : (
        <div className={s.fallback} aria-hidden="true">
          <ProjectArt slug="dotgrey" variant="halftone" ratio={1} ink="var(--fg)" paper="var(--bg)" style={{ height: "100%" }} />
        </div>
      )}

      <nav className={s.filter} aria-label="What are you looking for?" data-hidden={active >= 7 || undefined}>
        <p className={s.filterLabel}>What are you looking for?</p>
        <ul>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} onClick={go(c.id)} aria-current={chapter === i + 1 ? "true" : undefined}>
                <span className={s.filterDot} aria-hidden="true" />
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={s.counter}>
        <button type="button" className={s.pause} onClick={toggle} aria-pressed={paused} aria-label={paused ? "Play motion" : "Pause motion"}>
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
        <span className={s.counterNum} aria-hidden="true" hidden={active >= 7}>
          {String(chapter).padStart(2, "0")}
          <span> / 06</span>
        </span>
        <span className={s.counterBar} aria-hidden="true" hidden={active >= 7}>
          <span ref={barRef} />
        </span>
        <span className={s.counterLabel} aria-hidden="true">
          {chapter ? chapters[chapter - 1].label : active >= 7 ? "Index" : "Intro"}
        </span>
      </div>

      {children}
    </div>
  );
}

/**
 * A quieter field for inner pages: one formation, a slow drift, sitting behind the page
 * hero and stopping when it scrolls away. Fewer points than the homepage world.
 */
export function Field({ form, side = "right" }: { form: FormationId; side?: "right" | "center" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const { paused, reduced, toggle } = useMotion();
  const hasGL = useSyncExternalStore(noSubscribe, detectGL, () => true);
  const motionRef = useRef({ paused, reduced });
  useEffect(() => {
    motionRef.current = { paused, reduced };
    engineRef.current?.dirty();
  }, [paused, reduced]);
  usePalette(engineRef, hostRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hostRef.current) return;
    const count = innerWidth < 760 ? 1800 : 3600;
    const shape = buildFormation(form, count);
    const wide: [number, number] = side === "center" ? [0, 0.02] : [0.5, 0.02];
    const tall: [number, number] = [0, 0.04];
    engineRef.current = startEngine({
      canvas,
      count,
      formations: [shape],
      randoms: buildRandoms(count),
      state: { k: 0, mix: 0 },
      motion: () => motionRef.current,
      offset: (_k, isTall) => (isTall ? tall : wide),
      dim: () => 0.95,
      size: (isTall) => (isTall ? 2 : 2.4),
      spin: 0.045,
      bloomMs: [100, 1300],
    });
    engineRef.current?.setPalette(readPalette(hostRef.current));
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [form, side, hasGL]);

  return (
    <div ref={hostRef} className={s.field} data-side={side} aria-hidden="true">
      {hasGL ? (
        <canvas ref={canvasRef} className={s.fieldCanvas} />
      ) : (
        <div className={s.fieldFallback}>
          <ProjectArt slug={form} variant="halftone" ratio={1.4} ink="var(--fg)" paper="var(--bg)" />
        </div>
      )}
      <button type="button" className={`${s.pause} ${s.fieldPause}`} onClick={toggle} aria-pressed={paused} aria-label={paused ? "Play motion" : "Pause motion"}>
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </button>
    </div>
  );
}

/** Fast dot-matrix counter, 000 → 100, then the field blooms. Pure CSS fade as a backstop. */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const num = el?.querySelector("[data-num]");
    if (!el || !num || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 800);
      num.textContent = String(Math.round(100 * (1 - Math.pow(1 - p, 2)))).padStart(3, "0");
      if (p < 1) raf = requestAnimationFrame(tick);
      else el.dataset.done = "true";
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div ref={ref} className={s.loader} aria-hidden="true">
      <span data-num>000</span>
      <small>Loading the engine</small>
    </div>
  );
}

const KEYWORDS: Record<string, string[]> = {
  design: ["design", "brand", "logo", "ui", "ux", "figma", "prototype", "identity", "look", "redesign", "research", "interface"],
  development: ["website", "site", "web", "app", "mobile", "ios", "android", "shop", "store", "ecommerce", "cms", "landing", "next"],
  software: ["saas", "platform", "tool", "internal", "api", "backend", "portal", "system", "cloud", "legacy", "erp", "software"],
  automation: ["automate", "automation", "workflow", "invoice", "invoices", "zapier", "n8n", "crm", "integrate", "integration", "manual", "repetitive", "email", "agent", "agents", "sync"],
  data: ["dashboard", "data", "analytics", "report", "reports", "reporting", "bi", "forecast", "metrics", "kpi", "sql", "pipeline", "warehouse"],
  ml: ["ai", "ml", "model", "chatbot", "bot", "llm", "gpt", "predict", "prediction", "rag", "vision", "recommend", "recommendation", "classify", "machine", "learning", "assistant"],
};

/**
 * "Ask DotGrey" — a guided search, not an AI: it matches words in the question to a
 * discipline, answers from the services content and jumps to that chapter (or, off the
 * homepage, links to that service).
 */
export function Ask({ disciplines, email, jump = true }: { disciplines: Discipline[]; email: string; jump?: boolean }) {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<{ text: string; id?: string } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const words = q.toLowerCase().match(/[a-z0-9]+/g) ?? [];
    if (!words.length) return;
    let best: Discipline | null = null;
    let score = 0;
    for (const d of disciplines) {
      const n = words.filter((w) => KEYWORDS[d.id]?.includes(w)).length;
      if (n > score) {
        score = n;
        best = d;
      }
    }
    if (!best) {
      setAnswer({ text: `No match yet. Try words like "dashboard", "chatbot" or "invoices" — or write to ${email}.` });
      return;
    }
    setAnswer({ text: `That's ${best.title}. ${best.line} Where we usually start: ${best.capabilities[0]}, ${best.capabilities[1]}.`, id: best.id });
    if (jump) {
      const el = document.getElementById(best.id);
      el?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  };

  return (
    <form className={s.ask} onSubmit={submit} role="search">
      <label htmlFor="v10-ask" className={s.askLabel}>
        Ask DotGrey <span>Guided search · matches your words to what we do</span>
      </label>
      <div className={s.askRow}>
        <input id="v10-ask" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. automate our invoices" autoComplete="off" />
        <button type="submit" aria-label="Search">
          →
        </button>
      </div>
      <p className={s.askOut} aria-live="polite">
        {answer?.text}
        {answer?.id && !jump && (
          <>
            {" "}
            <Link href={`/v10/services/${answer.id}`} className={s.inlineLink}>
              Open the service →
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

/** Work index: dot-matrix rows; the preview panel follows hover and keyboard focus. */
export function WorkIndex({ works }: { works: Work[] }) {
  const [i, setI] = useState(0);
  const w = works[Math.min(i, works.length - 1)];
  if (!w) return <p className={s.empty}>Nothing in this category yet.</p>;
  return (
    <div className={s.index}>
      <ol className={s.rows}>
        {works.map((x, n) => (
          <li key={x.slug}>
            <Link href={`/v10/work/${x.slug}`} className={s.row} data-on={x.slug === w.slug || undefined} onPointerEnter={() => setI(n)} onFocus={() => setI(n)}>
              <span className={s.rowNum}>{String(n + 1).padStart(2, "0")}</span>
              <span className={s.rowTitle}>{x.title}</span>
              <span className={s.rowMeta}>
                {x.category} · {x.year}
              </span>
              <span className={s.rowStat}>{x.stats[0].value}</span>
              <span className={s.rowArt} aria-hidden="true">
                <ProjectMockup slug={x.slug} ratio={2.2} ink="var(--fg)" paper="var(--bg)" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <aside className={s.preview} aria-hidden="true">
        <div className={s.previewArt}>
          <ProjectMockup key={w.slug} slug={w.slug} ratio={1.25} ink="var(--fg)" paper="var(--bg)" />
        </div>
        <p className={s.previewSum}>{w.summary}</p>
        <p className={s.previewStat}>
          <b>{w.stats[0].value}</b> {w.stats[0].label}
        </p>
      </aside>
    </div>
  );
}

/** HUD-style chip filter: one row of options with counts. */
function Chips({ options, value, onChange, label }: { options: { id: string; count: number }[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className={s.chips} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" className={s.chip} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.id} <span>{String(o.count).padStart(2, "0")}</span>
        </button>
      ))}
    </div>
  );
}

const countBy = <T,>(items: T[], key: (t: T) => string) => {
  const ids = [...new Set(items.map(key))];
  return [{ id: "All", count: items.length }, ...ids.map((id) => ({ id, count: items.filter((x) => key(x) === id).length }))];
};

export function WorkCatalogue({ works }: { works: Work[] }) {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? works : works.filter((w) => w.category === cat);
  return (
    <>
      <Chips label="Filter by category" options={countBy(works, (w) => w.category)} value={cat} onChange={setCat} />
      <p className={s.resultLine} aria-live="polite">
        {String(list.length).padStart(2, "0")} {list.length === 1 ? "project" : "projects"} · {cat === "All" ? "all categories" : cat}
      </p>
      <WorkIndex key={cat} works={list} />
    </>
  );
}

export function PostIndex({ posts, authors, dates }: { posts: Post[]; authors: Record<string, string>; dates: Record<string, string> }) {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? posts : posts.filter((p) => p.category === cat);
  return (
    <>
      <Chips label="Filter by topic" options={countBy(posts, (p) => p.category)} value={cat} onChange={setCat} />
      <ol className={s.posts}>
        {list.map((p, i) => (
          <li key={p.slug}>
            <Link href={`/v10/insights/${p.slug}`} className={s.post}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={s.postMain}>
                <span className={s.postMeta}>
                  {p.category} · {dates[p.slug]} · {p.readingMinutes} min · {authors[p.author] ?? "DotGrey"}
                </span>
                <span className={s.postTitle}>{p.title}</span>
                <span className={s.postEx}>{p.excerpt}</span>
              </span>
              <span className={s.postArt} aria-hidden="true">
                <ProjectArt slug={p.slug} variant="halftone" ratio={1.4} ink="var(--fg)" paper="var(--bg)" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}

export function FaqBrowser({ items, categories }: { items: { id: string; category: string; question: string; answer: string }[]; categories: string[] }) {
  const [cat, setCat] = useState("All");
  const opts = [{ id: "All", count: items.length }, ...categories.map((c) => ({ id: c, count: items.filter((x) => x.category === c).length }))];
  const list = cat === "All" ? items : items.filter((x) => x.category === cat);
  return (
    <>
      <Chips label="Filter by topic" options={opts} value={cat} onChange={setCat} />
      <div className={s.faq}>
        {list.map((f, i) => (
          <details key={f.id} className={s.qa}>
            <summary>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <span>{f.question}</span>
              <span className={s.qaMark} aria-hidden="true" />
            </summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </div>
    </>
  );
}

function subscribeMinute(cb: () => void) {
  const id = window.setInterval(cb, 15_000);
  return () => clearInterval(id);
}
const dhakaTime = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka" });

export function DhakaTime() {
  const t = useSyncExternalStore(subscribeMinute, dhakaTime, () => "--:--");
  return <span suppressHydrationWarning>{t}</span>;
}

const NAV = [
  { href: "/v10/work", label: "Work" },
  { href: "/v10/services", label: "Services" },
  { href: "/v10/about", label: "About" },
  { href: "/v10/insights", label: "Insights" },
  { href: "/v10/careers", label: "Careers" },
  { href: "/v10/contact", label: "Contact" },
];

/** Desktop nav inside the HUD pill; marks the current section. */
export function NavLinks({ items = NAV }: { items?: typeof NAV }) {
  const path = usePathname();
  return (
    <>
      {items.map((l, i) => (
        <span key={l.href} className={s.pillItem}>
          {i > 0 && <span className={s.pillRule} aria-hidden="true" />}
          <Link href={l.href} aria-current={path === l.href || path.startsWith(`${l.href}/`) ? "page" : undefined}>
            {l.label}
          </Link>
        </span>
      ))}
    </>
  );
}

/** HUD-style theme pill: "◐ Dark" in light mode, "◐ Light" in dark. */
export function ThemePill({ className }: { className?: string }) {
  return (
    <ThemeToggle className={`${s.themePill} ${className ?? ""}`}>
      <span aria-hidden="true">◐</span>
      <span className={s.toDark}>Dark</span>
      <span className={s.toLight}>Light</span>
    </ThemeToggle>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <>
      <button type="button" className={s.menuBtn} aria-expanded={open} aria-controls="v10-menu" onClick={() => setOpen(true)}>
        Menu
      </button>
      <div id="v10-menu" className={s.menu} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <div className={s.menuTop}>
          <span className={s.menuSys}>DG/ENGINE · NAV</span>
          <button ref={closeRef} type="button" className={s.menuBtn} onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <nav aria-label="Mobile">
          <ol className={s.menuList}>
            {[{ href: "/v10", label: "Home" }, ...NAV, ...MENU_EXTRA].map((l, i) => (
              <li key={l.href} style={{ animationDelay: `${40 + i * 40}ms` }}>
                <Link href={l.href} onClick={() => setOpen(false)} aria-current={path === l.href ? "page" : undefined}>
                  <span className={s.rowNum}>{String(i).padStart(2, "0")}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className={s.menuFoot}>
          <span>Colour mode</span>
          <ThemePill />
        </div>
      </div>
    </>
  );
}

type Errors = Partial<Record<"name" | "email" | "needs" | "message", string>>;

/**
 * The brief, as a console: numbered prompts, a log line per error, and a hand-off to the
 * visitor's email app. Nothing is sent or stored by this page.
 */
export function BriefConsole({ email, needs, budgets, timelines }: { email: string; needs: string[]; budgets: string[]; timelines: string[] }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const next: Errors = {};
    if (!v("name")) next.name = "Name required.";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) next.email = "A valid email, so we can reply.";
    if (!picked.length) next.needs = "Pick at least one.";
    if (v("message").length < 10) next.message = "A sentence or two about the project.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    const body = [
      `Name: ${v("name")}`,
      `Email: ${v("email")}`,
      v("company") && `Company: ${v("company")}`,
      `Needs: ${picked.join(", ")}`,
      v("budget") && `Budget: ${v("budget")}`,
      v("timeline") && `Timeline: ${v("timeline")}`,
      "",
      v("message"),
    ]
      .filter((x) => x !== "")
      .join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Project brief — ${v("name")}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className={s.console} role="status">
        <p className={s.consoleBar}>
          <span>brief.send</span>
          <span>exit 0</span>
        </p>
        <div className={s.consoleBody}>
          <p className={s.ok}>&gt; Brief handed to your email app.</p>
          <p>
            It should have opened with the brief filled in — press send there and we reply within a working day. Nothing was
            stored on this site. No window? Write to <a href={`mailto:${email}`}>{email}</a>.
          </p>
          <button type="button" className={s.ghostBtn} onClick={() => setSent(false)}>
            Edit the brief
          </button>
        </div>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <span className={s.err} id={`v10-err-${k}`}>
        ! {errors[k]}
      </span>
    ) : null;
  const errCount = Object.keys(errors).length;

  return (
    <form ref={formRef} className={s.console} onSubmit={submit} noValidate>
      <p className={s.consoleBar}>
        <span>new-brief.sh</span>
        <span>{errCount ? `${errCount} error${errCount > 1 ? "s" : ""}` : "ready"}</span>
      </p>
      <div className={`${s.consoleBody} ${s.formGrid}`}>
        <label className={s.cField}>
          <span className={s.cLabel}>01 &gt; name</span>
          <input name="name" data-field="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "v10-err-name" : undefined} />
          {err("name")}
        </label>
        <label className={s.cField}>
          <span className={s.cLabel}>02 &gt; email</span>
          <input name="email" type="email" data-field="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "v10-err-email" : undefined} />
          {err("email")}
        </label>
        <label className={`${s.cField} ${s.cWide}`}>
          <span className={s.cLabel}>03 &gt; company (optional)</span>
          <input name="company" autoComplete="organization" />
        </label>
        <fieldset className={`${s.cField} ${s.cWide}`}>
          <legend className={s.cLabel}>04 &gt; what you need</legend>
          <div className={s.chips} data-field="needs" tabIndex={-1} aria-describedby={errors.needs ? "v10-err-needs" : undefined}>
            {needs.map((n) => (
              <button
                key={n}
                type="button"
                className={s.chip}
                aria-pressed={picked.includes(n)}
                onClick={() => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]))}
              >
                {n}
              </button>
            ))}
          </div>
          {err("needs")}
        </fieldset>
        <label className={s.cField}>
          <span className={s.cLabel}>05 &gt; budget (optional)</span>
          <select name="budget" defaultValue="">
            <option value="">Not sure yet</option>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className={s.cField}>
          <span className={s.cLabel}>06 &gt; timeline (optional)</span>
          <select name="timeline" defaultValue="">
            <option value="">Flexible</option>
            {timelines.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className={`${s.cField} ${s.cWide}`}>
          <span className={s.cLabel}>07 &gt; the project</span>
          <textarea name="message" rows={5} data-field="message" aria-invalid={!!errors.message} aria-describedby={errors.message ? "v10-err-message" : undefined} />
          {err("message")}
        </label>
        <div className={`${s.cWide} ${s.formFoot}`}>
          <button type="submit" className={s.cta}>
            Run brief <span aria-hidden="true">→</span>
          </button>
          <span className={s.formNote}>Opens your email app with the brief filled in. Nothing is stored here.</span>
        </div>
      </div>
    </form>
  );
}
