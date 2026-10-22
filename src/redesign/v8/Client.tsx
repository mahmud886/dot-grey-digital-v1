"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { ProjectMockup } from "@/redesign/shared/ProjectMockup";
import { useMotion } from "@/redesign/shared/useMotion";
import { ThemeToggle } from "@/redesign/shared/ThemeToggle";
import { useTheme } from "@/redesign/shared/useTheme";
import type { Work } from "@/redesign/content";
import s from "./v8.module.css";

/* ------------------------------------------------------------------ motion */

type MotionState = ReturnType<typeof useMotion>;
const MotionCtx = createContext<MotionState>({ paused: false, reduced: false, toggle: () => {} });

/** One switch for every moving thing on the page: ticker, rotating word, halftone field. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const motion = useMotion();
  return <MotionCtx.Provider value={motion}>{children}</MotionCtx.Provider>;
}

const useMotionCtx = () => useContext(MotionCtx);

export function MotionToggle({ className }: { className?: string }) {
  const { paused, toggle } = useMotionCtx();
  return (
    <button type="button" className={className ?? s.pill} onClick={toggle} aria-pressed={paused} aria-label={paused ? "Play motion" : "Pause motion"}>
      <span aria-hidden="true" className={s.motionIcon} data-paused={paused} />
      <span className={s.motionText}>{paused ? "Play" : "Pause"}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ header */

const TICKER = [
  "Now booking projects for next quarter",
  "Design · Software · Automation · Data · ML",
  "Based in Dhaka, working worldwide",
  "Weekly releases. No black boxes.",
];

function Ticker() {
  const { paused } = useMotionCtx();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (paused || hold) return;
    const id = setInterval(() => setI((n) => (n + 1) % TICKER.length), 3800);
    return () => clearInterval(id);
  }, [paused, hold]);
  return (
    <div className={s.ticker} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
      {TICKER.map((t, k) => (
        <span key={t} data-on={k === i} aria-hidden={k !== i}>
          {t}
        </span>
      ))}
    </div>
  );
}

const LEFT = [
  { href: "/v8/work", label: "Work" },
  { href: "/v8/services", label: "Services" },
  { href: "/v8/process", label: "Process" },
];
const RIGHT = [
  { href: "/v8/about", label: "About" },
  { href: "/v8/insights", label: "Insights" },
  { href: "/v8/contact", label: "Contact" },
];
const SHEET = [...LEFT, { href: "/v8/engagements", label: "Engagements" }, ...RIGHT.slice(0, 2), { href: "/v8/careers", label: "Careers" }, RIGHT[2], { href: "/v8/start", label: "Start a project" }];

/** "Light" or "Dark" — the mode you are in. Neutral until the pre-paint script's answer is read. */
function ModeLabel() {
  const theme = useTheme();
  return <span className={s.motionText}>{theme === "dark" ? "Dark" : theme === "light" ? "Light" : "Mode"}</span>;
}

/** A pill like every other header control: a half-filled dot and the current mode. */
export function ThemePill({ className }: { className?: string }) {
  return (
    <ThemeToggle className={className ?? s.pill}>
      <span aria-hidden="true" className={s.modeDot} />
      <ModeLabel />
    </ThemeToggle>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const first = useRef<HTMLAnchorElement>(null);
  const path = usePathname();
  const current = (href: string) => (path === href || path.startsWith(`${href}/`) ? "page" : undefined);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a href="#main" className={s.skip}>
        Skip to content
      </a>
      <header className={s.header}>
        <div className={s.cluster}>
          <BrandMark href="/v8" ink="#ffffff" accent="#8f8f8f" className={s.logo} />
          <nav aria-label="Main" className={s.pills}>
            {LEFT.map((l) => (
              <Link key={l.label} href={l.href} className={s.pill} aria-current={current(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <Ticker />
        <div className={`${s.cluster} ${s.clusterRight}`}>
          <nav aria-label="Secondary" className={s.pills}>
            {RIGHT.map((l) => (
              <Link key={l.label} href={l.href} className={s.pill} aria-current={current(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/v8/start" className={`${s.pill} ${s.startPill}`} aria-current={current("/v8/start")}>
            Start a project
          </Link>
          <ThemePill className={`${s.pill} ${s.headerMode}`} />
          <MotionToggle />
          <button type="button" className={`${s.pill} ${s.menuBtn}`} aria-expanded={open} aria-controls="v8-menu" onClick={() => setOpen(true)}>
            Menu
          </button>
        </div>
      </header>

      <div id="v8-menu" className={s.sheet} data-open={open} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <div className={s.sheetTop}>
          <BrandMark href="/v8" ink="var(--fg)" accent="var(--muted)" className={s.logo} />
          <button type="button" className={s.pill} onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <nav aria-label="Menu" className={s.sheetLinks}>
          {SHEET.map((l, k) => (
            <Link
              key={l.label}
              ref={k === 0 ? first : undefined}
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={current(l.href)}
              style={{ ["--k" as string]: k }}
            >
              {l.label}
              <span className={s.stop}>.</span>
            </Link>
          ))}
        </nav>
        <div className={s.sheetFoot}>
          <span>Design · Software · Automation · Data · ML</span>
          <span className={s.sheetCtl}>
            <ThemePill />
            <MotionToggle />
          </span>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ hero */

/** Sets the font size so the word spans its container exactly, edge to edge. */
export function Wordmark({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement!;
    const fit = () => {
      el.style.fontSize = "100px";
      const w = el.getBoundingClientRect().width;
      // At 100px the D's left bearing (pulled in by the negative margin) and the Y's right
      // bearing add ~4.5px of empty box; fit the ink, not the box.
      if (w) el.style.fontSize = `${(100 * parent.clientWidth) / (w - 4.5)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);
  return (
    <span ref={ref} className={s.wordmark} aria-hidden="true">
      {text.slice(0, -1)}
      <span>{text.slice(-1)}</span>
    </span>
  );
}

function subscribeMinute(cb: () => void) {
  const id = setInterval(cb, 20_000);
  return () => clearInterval(id);
}

const timeFmt = (tz?: string) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });

function nowKey() {
  const d = new Date();
  return `${d.getDay()}|${d.getHours()}|${timeFmt().format(d)}|${timeFmt("Asia/Dhaka").format(d)}`;
}

function lineFor(day: number, h: number) {
  const weekend = day === 0 || day === 6;
  if (h < 5) return "Burning the midnight oil? Someone on our team is probably up too.";
  if (weekend) return day === 0 && h >= 17 ? "Sunday evening. Let's make Monday lighter." : "Here on a weekend? Respect. Good ideas don't keep office hours.";
  if (h < 9) return "You're up early. Coffee first, roadmap second.";
  if (h < 12) return "Morning. Inbox open, ambitions high. Good time to talk.";
  if (h < 17) return "Afternoon. The best hour to ship something small.";
  if (h < 21) return "Evening. The day's done — the ideas aren't.";
  return "Late one. Big ideas don't clock out either.";
}

/** "Hello." plus a line written for the visitor's time of day. Neutral on the server. */
export function Greeting() {
  const key = useSyncExternalStore(subscribeMinute, nowKey, () => "");
  const [day, hour, local, dhaka] = key.split("|");
  const line = key ? lineFor(Number(day), Number(hour)) : "One studio for design, software, automation, data and machine learning.";
  return (
    <div className={s.greeting}>
      <p className={s.hello}>
        Hello<span className={s.stop}>.</span>
      </p>
      <div className={s.greetSide}>
        <p className={s.greetLine}>{line}</p>
        <p className={s.greetMeta} suppressHydrationWarning>
          {key ? (
            <>
              {local} for you · {dhaka} in Dhaka
            </>
          ) : (
            "Dhaka · Worldwide"
          )}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ halftone field */

const FIELD_WORDS = ["Design", "Software", "Automation", "Data", "ML"];

/**
 * A field of dots that spells each discipline in turn, halftone-style. Dots swell around
 * the pointer. Stops on Pause and under reduced motion (shows the first word, still).
 */
export function HalftoneField({ words = FIELD_WORDS, caption = "Six disciplines, one team.", compact = false }: { words?: string[]; caption?: string; compact?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { paused } = useMotionCtx();
  // Redraw in the new ink when the theme flips; the colour itself comes from CSS.
  const theme = useTheme();

  useEffect(() => {
    const cv = canvas.current!;
    const box = wrap.current!;
    const ctx = cv.getContext("2d")!;
    let W = 0;
    let H = 0;
    let step = 16;
    let cols = 0;
    let rows = 0;
    let masks: Float32Array[] = [];
    let raf = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999, k: 0 };
    const start = performance.now();
    const ink = getComputedStyle(box).color;

    const build = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = box.clientWidth;
      H = box.clientHeight;
      if (!W || !H) {
        masks = [];
        return;
      }
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      step = W < 640 ? 10 : 15;
      cols = Math.ceil(W / step);
      rows = Math.ceil(H / step);
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      const family = getComputedStyle(cv).fontFamily;
      masks = words.map((word) => {
        o.clearRect(0, 0, cols, rows);
        let size = rows * 0.62;
        o.font = `900 ${size}px ${family}`;
        const w = o.measureText(word).width;
        if (w > cols * 0.86) size *= (cols * 0.86) / w;
        o.font = `900 ${size}px ${family}`;
        o.textAlign = "center";
        o.textBaseline = "middle";
        o.fillStyle = "#fff";
        o.fillText(word, cols / 2, rows / 2 + size * 0.04);
        const data = o.getImageData(0, 0, cols, rows).data;
        const m = new Float32Array(cols * rows);
        for (let i = 0; i < m.length; i++) m[i] = data[i * 4 + 3] / 255;
        return m;
      });
    };

    const draw = (now: number) => {
      if (!masks.length) return;
      const t = (now - start) / 1000;
      const hold = 2.6;
      const phase = paused ? 0 : t / hold;
      const a = Math.floor(phase) % words.length;
      const b = (a + 1) % words.length;
      const f = phase - Math.floor(phase);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = ink;
      pointer.k += ((pointer.x > -999 ? 1 : 0) - pointer.k) * 0.08;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = (i + 0.5) * step;
          const y = (j + 0.5) * step;
          // Wipe from left to right during the last 35% of each hold.
          const local = Math.min(1, Math.max(0, (f - 0.65) / 0.35 * 1.6 - (i / cols) * 0.6));
          const m = masks[a][j * cols + i] * (1 - local) + masks[b][j * cols + i] * local;
          const wave = paused ? 0.5 : 0.5 + 0.5 * Math.sin(x * 0.011 + y * 0.007 - t * 1.4);
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          const near = pointer.k * Math.exp(-(d * d) / 14000);
          const r = step * 0.5 * Math.min(1, 0.1 + wave * 0.1 + m * 0.82 + near * 0.55);
          if (r < 0.5) continue;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      draw(now);
      if (!paused && visible) raf = requestAnimationFrame(loop);
    };

    build();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(box);
    const ro = new ResizeObserver(() => {
      build();
      draw(performance.now());
    });
    ro.observe(box);
    document.fonts?.ready.then(() => {
      build();
      draw(performance.now());
    });
    const move = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      if (paused) draw(performance.now());
    };
    const leave = () => {
      pointer.x = pointer.y = -9999;
      if (paused) draw(performance.now());
    };
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      box.removeEventListener("pointermove", move);
      box.removeEventListener("pointerleave", leave);
    };
  }, [paused, theme, words]);

  return (
    <div
      ref={wrap}
      className={`${s.field} ${compact ? s.fieldCompact : ""}`}
      role="img"
      aria-label={`Dot field spelling ${words.join(", ")}`}
    >
      <canvas ref={canvas} className={s.fieldCanvas} />
      <div className={s.fieldCaption}>
        <span>{caption}</span>
        <MotionToggle className={s.pillDark} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ statement */

const AUDIENCE = ["people", "businesses", "founders", "teams", "users"];

export function RotatingWord() {
  const { paused } = useMotionCtx();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % AUDIENCE.length), 2200);
    return () => clearInterval(id);
  }, [paused]);
  return (
    <span className={s.rotor}>
      <span className={s.srOnly}>{AUDIENCE.join(", ")}.</span>
      <span key={i} className={s.rotorWord} aria-hidden="true">
        {AUDIENCE[i]}
        <span className={s.stop}>.</span>
      </span>
    </span>
  );
}

/** Paragraph whose words darken as it scrolls through the viewport. Pure CSS vars, no re-renders. */
export function ScrubText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { reduced } = useMotionCtx();
  const words = text.split(" ");
  useEffect(() => {
    const el = ref.current!;
    if (reduced) {
      el.style.setProperty("--p", "1");
      return;
    }
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const start = innerHeight * 0.88;
      const end = innerHeight * 0.35;
      const p = (start - r.top) / (start - end + r.height * 0.5);
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [reduced]);
  return (
    <p ref={ref} className={s.scrub} style={{ ["--n" as string]: words.length }}>
      {words.map((w, i) => (
        <span key={i} style={{ ["--i" as string]: i }}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ work reel */

/**
 * "Our work." On wide screens with motion allowed the section pins and vertical scroll
 * moves the cards sideways. Otherwise a native swipe row with scroll-snap. A "View →"
 * pill follows the mouse over the cards.
 */
export function WorkReel({ items }: { items: Work[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [native, setNative] = useState(true);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        setNative(false);
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          setNative(true);
        };
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [native]);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cursor.current?.style.setProperty("--cx", `${e.clientX}px`);
    cursor.current?.style.setProperty("--cy", `${e.clientY}px`);
  };

  return (
    <section ref={section} id="work" className={s.reel} aria-labelledby="work-title">
      <div className={s.reelHead}>
        <h2 id="work-title" className={s.chapterTitle}>
          Our work<span className={s.stop}>.</span>
        </h2>
        <p className={s.reelNote}>
          {items.length} recent projects. Every one has a number the client cared about.
          <span className={s.reelHint} aria-hidden="true">
            {native ? "Swipe →" : "Scroll →"}
          </span>
        </p>
      </div>
      <div
        ref={track}
        className={`${s.track} ${native ? s.trackNative : ""}`}
        onPointerMove={move}
        onPointerEnter={(e) => e.pointerType === "mouse" && cursor.current?.setAttribute("data-on", "true")}
        onPointerLeave={() => cursor.current?.setAttribute("data-on", "false")}
      >
        {items.map((w, i) => (
          <Link key={w.slug} href={`/v8/work/${w.slug}`} className={s.card}>
            <div className={s.cardArt}>
              <ProjectMockup slug={w.slug} ink="var(--fg)" paper="var(--art-paper)" ratio={1.5} />
            </div>
            <div className={s.cardMeta}>
              <div>
                <span className={s.cardKicker}>
                  {String(i + 1).padStart(2, "0")} · {w.category} · {w.year}
                </span>
                <h3 className={s.cardTitle}>{w.title}</h3>
              </div>
              <div className={s.cardStat}>
                <b>{w.stats[0].value}</b>
                <span>{w.stats[0].label}</span>
              </div>
            </div>
          </Link>
        ))}
        <Link href="/v8/work" className={`${s.card} ${s.cardAll}`}>
          <span>All work</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div ref={cursor} className={s.cursor} data-on="false" aria-hidden="true">
        View →
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ services deck */

/**
 * Cards are CSS-sticky so they stack like a deck. With motion allowed, each card shrinks
 * and dims a little as the next one slides over it.
 */
export function Deck({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(`.${s.deckCard}`, ref.current);
        cards.slice(0, -1).forEach((card, i) => {
          gsap.to(card, {
            scale: 0.92,
            "--dim": 0.35,
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 20%", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={s.deck}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ quotes */

type Quote = { id: string; quote: string; author: string; role: string };

export function Quotes({ items }: { items: Quote[] }) {
  const [i, setI] = useState(0);
  const q = items[i];
  const go = (d: number) => setI((n) => (n + d + items.length) % items.length);
  return (
    <figure className={s.quoteFig}>
      <blockquote className={s.quote} aria-live="polite">
        “{q.quote}”
      </blockquote>
      <figcaption className={s.quoteFoot}>
        <span>
          <b>{q.author}</b> — {q.role}
        </span>
        <span className={s.quoteNav}>
          <span className={s.quoteCount}>
            {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <button type="button" className={s.pillSolid} onClick={() => go(-1)} aria-label="Previous quote">
            ←
          </button>
          <button type="button" className={s.pillSolid} onClick={() => go(1)} aria-label="Next quote">
            →
          </button>
        </span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ clock */

const dhakaKey = () => timeFmt("Asia/Dhaka").format(new Date());

export function DhakaClock() {
  const t = useSyncExternalStore(subscribeMinute, dhakaKey, () => "");
  return <span suppressHydrationWarning>{t ? `${t} in Dhaka` : "Dhaka"}</span>;
}

/* ------------------------------------------------------------------ work index */

type ChipOpt = { id: string; label: string; count?: number };

/** A row of pills that behave like radio buttons. */
export function Chips({ label, options, value, onChange }: { label: string; options: ChipOpt[]; value: string; onChange: (v: string) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className={s.chips}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={s.chip} onClick={() => onChange(o.id)}>
          {o.label}
          {o.count !== undefined && <sup>{o.count}</sup>}
        </button>
      ))}
    </div>
  );
}

/**
 * The full work index: category filter plus Instrument's Display toggle. "Stack" gives each
 * project a full-width row; "Grid" packs them two across. Cards are rendered on the server
 * and passed in, so this only decides which to show and how.
 */
export function WorkIndex({ categories, items }: { categories: string[]; items: { slug: string; category: string; stack: ReactNode; grid: ReactNode }[] }) {
  const [cat, setCat] = useState("all");
  const [view, setView] = useState<"stack" | "grid">("stack");
  const shown = items.filter((i) => cat === "all" || i.category === cat);
  const opts = [{ id: "all", label: "All", count: items.length }, ...categories.map((c) => ({ id: c, label: c, count: items.filter((i) => i.category === c).length }))];
  return (
    <>
      <div className={s.indexBar}>
        <Chips label="Filter by discipline" options={opts} value={cat} onChange={setCat} />
        <div className={s.viewToggle}>
          <span className={s.viewLabel}>Display</span>
          <Chips
            label="Display"
            options={[
              { id: "stack", label: "Stack" },
              { id: "grid", label: "Grid" },
            ]}
            value={view}
            onChange={(v) => setView(v as "stack" | "grid")}
          />
        </div>
      </div>
      <p className={s.indexCount} aria-live="polite">
        {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>
      <ul className={view === "stack" ? s.stackList : s.gridList}>
        {shown.map((i) => (
          <li key={i.slug}>{view === "stack" ? i.stack : i.grid}</li>
        ))}
      </ul>
    </>
  );
}

/* ------------------------------------------------------------------ journal */

export function JournalIndex({ categories, items }: { categories: string[]; items: { slug: string; category: string; node: ReactNode }[] }) {
  const [cat, setCat] = useState("all");
  const shown = items.filter((i) => cat === "all" || i.category === cat);
  const used = categories.filter((c) => items.some((i) => i.category === c));
  return (
    <>
      <div className={s.indexBar}>
        <Chips label="Filter by topic" options={[{ id: "all", label: "All" }, ...used.map((c) => ({ id: c, label: c }))]} value={cat} onChange={setCat} />
      </div>
      <ol className={s.postList}>
        {shown.map((i) => (
          <li key={i.slug}>{i.node}</li>
        ))}
      </ol>
    </>
  );
}

/* ------------------------------------------------------------------ faq */

export function FaqTabs({ groups }: { groups: { id: string; items: { q: string; a: string }[] }[] }) {
  const [tab, setTab] = useState(groups[0]?.id ?? "");
  const active = groups.find((g) => g.id === tab) ?? groups[0];
  return (
    <div className={s.faqWrap}>
      <Chips label="Topic" options={groups.map((g) => ({ id: g.id, label: g.id, count: g.items.length }))} value={tab} onChange={setTab} />
      <div className={s.faqList}>
        {active.items.map((f) => (
          <details key={f.q} className={s.faqItem}>
            <summary>
              <span>{f.q}</span>
              <span aria-hidden="true" className={s.faqMark} />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ clocks */

const dhakaHour = (d: Date) => Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Dhaka" }).format(d));

const localKey = () => {
  const d = new Date();
  return `${timeFmt().format(d)}|${timeFmt("Asia/Dhaka").format(d)}|${dhakaHour(d)}`;
};

/** Two live clocks: the visitor's and Dhaka's. Dashes on the server. */
export function Clocks() {
  const key = useSyncExternalStore(subscribeMinute, localKey, () => "—|—|");
  const [you, dhaka] = key.split("|");
  return (
    <dl className={s.clocks} suppressHydrationWarning>
      <div>
        <dt>Your time</dt>
        <dd>{you}</dd>
      </div>
      <div>
        <dt>Dhaka</dt>
        <dd>{dhaka}</dd>
      </div>
    </dl>
  );
}

/** "It's 21:14 for you and 03:14 in Dhaka — we'll reply in our morning." */
export function ReplyLine() {
  const key = useSyncExternalStore(subscribeMinute, localKey, () => "");
  if (!key) return <p className={s.pageAside}>We reply within one working day, from Dhaka.</p>;
  const [you, dhaka, dh] = key.split("|");
  const open = Number(dh) >= 10 && Number(dh) < 19;
  return (
    <p className={s.pageAside} suppressHydrationWarning>
      It&apos;s {you} for you and {dhaka} in Dhaka — {open ? "we're at our desks, so expect a reply today." : "we'll reply in our morning."}
    </p>
  );
}

/* ------------------------------------------------------------------ brief form */

type Brief = { name: string; email: string; company: string; needs: string[]; budget: string; timeline: string; message: string };

/**
 * Project brief. The prototypes have no backend, so a valid brief opens the visitor's email
 * app with everything filled in — and the page says exactly that.
 */
export function BriefForm({ email, needs, budgets, timelines }: { email: string; needs: string[]; budgets: string[]; timelines: string[] }) {
  const [f, setF] = useState<Brief>({ name: "", email: "", company: "", needs: [], budget: "", timeline: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Brief, string>>>({});
  const [sent, setSent] = useState(false);
  const set = <K extends keyof Brief>(k: K, v: Brief[K]) => setF((x) => ({ ...x, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!f.name.trim()) err.name = "Tell us who you are.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) err.email = "We need an email address to reply to.";
    if (!f.needs.length) err.needs = "Pick at least one.";
    if (f.message.trim().length < 20) err.message = "A sentence or two, please — at least 20 characters.";
    setErrors(err);
    if (Object.keys(err).length) {
      document.getElementById(`brief-${Object.keys(err)[0]}`)?.focus();
      return;
    }
    const body = [
      `Name: ${f.name}`,
      `Email: ${f.email}`,
      f.company ? `Company: ${f.company}` : null,
      `Needs: ${f.needs.join(", ")}`,
      f.budget ? `Budget: ${f.budget}` : null,
      f.timeline ? `Timeline: ${f.timeline}` : null,
      "",
      f.message,
    ]
      .filter((x) => x !== null)
      .join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Project brief — ${f.company || f.name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className={s.sent} role="status">
        <p className={s.kicker}>Almost there.</p>
        <p className={s.sentTitle}>Your email app should open with the brief filled in.</p>
        <p className={s.sentBody}>
          Press send there and we reply within a working day. Nothing opened? Write to <a href={`mailto:${email}`}>{email}</a>.
        </p>
        <button type="button" className={s.pillSolidWide} onClick={() => setSent(false)}>
          Edit the brief
        </button>
      </div>
    );
  }

  const text = (k: "name" | "email" | "company", label: string, type = "text", auto?: string) => (
    <div className={s.fieldRow} data-error={!!errors[k]}>
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

  const pick = (k: "budget" | "timeline", label: string, opts: string[]) => (
    <fieldset className={s.fieldSet}>
      <legend>{label}</legend>
      <div className={s.optRow}>
        {opts.map((o) => (
          <label key={o} className={s.opt}>
            <input type="radio" name={k} value={o} checked={f[k] === o} onChange={() => set(k, o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <form className={s.form} onSubmit={submit} noValidate>
      <div className={s.formTwo}>
        {text("name", "Your name", "text", "name")}
        {text("email", "Email", "email", "email")}
      </div>
      {text("company", "Company (optional)", "text", "organization")}
      <fieldset className={s.fieldSet} data-error={!!errors.needs} aria-describedby={errors.needs ? "brief-needs-err" : undefined}>
        <legend>What do you need?</legend>
        <div className={s.optRow}>
          {needs.map((n, i) => (
            <label key={n} className={s.opt}>
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
      {pick("budget", "Budget (optional)", budgets)}
      {pick("timeline", "Timeline (optional)", timelines)}
      <div className={s.fieldRow} data-error={!!errors.message}>
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
        <button type="submit" className={s.pillAccent}>
          Send the brief →
        </button>
        <small>Opens your email app with the brief filled in. Nothing is stored here.</small>
      </div>
    </form>
  );
}
