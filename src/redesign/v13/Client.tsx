"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectMockup } from "@/redesign/shared/ProjectMockup";
import { useMotion } from "@/redesign/shared/useMotion";
import { ThemeIcon, ThemeToggle } from "@/redesign/shared/ThemeToggle";
import { useTheme } from "@/redesign/shared/useTheme";
import type { Work } from "@/redesign/content";
import { LINES, PTS, forms } from "./sculpture";
import s from "./v13.module.css";

/* ------------------------------------------------------------------ motion */

type MotionState = ReturnType<typeof useMotion>;
const MotionCtx = createContext<MotionState>({ paused: false, reduced: false, toggle: () => {} });

/** One switch for everything that moves on its own: the sculptures and the rotating word. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const motion = useMotion();
  return <MotionCtx.Provider value={motion}>{children}</MotionCtx.Provider>;
}

const useMotionCtx = () => useContext(MotionCtx);

/* ------------------------------------------------------------------ wireframe renderer */

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const BUCKETS = 7;
let FORMS: Float32Array[] | null = null;
const getForms = () => (FORMS ??= forms());

type Wire = { goTo: (i: number, instant: boolean) => void; repaint: () => void; start: () => void; destroy: () => void };

/**
 * Draws one of the six forms as fine ink lines with its own 3D projection, depth shown by
 * opacity. Morphs point-for-point between forms. `live()` decides whether it keeps rotating.
 */
function createWire(canvas: HTMLCanvasElement, initial: number, opts: { live: () => boolean; follow: boolean; fill: number; speed: number }): Wire {
  const ctx = canvas.getContext("2d")!;
  const F = getForms();
  const cur = new Float32Array(F[initial]);
  let from = new Float32Array(F[initial]);
  let to = F[initial];
  let ink = "#111111";
  let morphStart = -1;
  const MORPH = 1500;
  let ry = -0.6 + initial * 0.4;
  let rx = 0.32;
  let tx = 0.32;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let visible = true;
  let last = performance.now();
  const paths: Path2D[] = [];

  const readInk = () => {
    ink = getComputedStyle(canvas).getPropertyValue("--wire").trim() || getComputedStyle(canvas).color || ink;
  };

  function draw() {
    if (!w) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cy = Math.cos(ry);
    const sy = Math.sin(ry);
    const cx = Math.cos(rx);
    const sx = Math.sin(rx);
    const scale = Math.min(w, h) * opts.fill;
    const D = 3.4;
    const ox = w / 2;
    const oy = h / 2;
    for (let b = 0; b < BUCKETS; b++) paths[b] = new Path2D();
    for (let l = 0; l < LINES; l++) {
      let px = 0;
      let py = 0;
      let pz = 0;
      let lastBucket = -1;
      for (let p = 0; p < PTS; p++) {
        const k = (l * PTS + p) * 3;
        const x0 = cur[k];
        const y0 = cur[k + 1];
        const z0 = cur[k + 2];
        const x1 = x0 * cy + z0 * sy;
        const z1 = -x0 * sy + z0 * cy;
        const y2 = y0 * cx - z1 * sx;
        const z2 = y0 * sx + z1 * cx;
        const f = D / (D - z2);
        const X = ox + x1 * f * scale;
        const Y = oy - y2 * f * scale;
        if (p > 0) {
          const b = Math.max(0, Math.min(BUCKETS - 1, Math.floor((((z2 + pz) / 2 + 1) / 2) * BUCKETS)));
          if (b !== lastBucket) {
            paths[b].moveTo(px, py);
            lastBucket = b;
          }
          paths[b].lineTo(X, Y);
        }
        px = X;
        py = Y;
        pz = z2;
      }
    }
    ctx.lineWidth = 0.8;
    ctx.lineJoin = "round";
    ctx.strokeStyle = ink;
    for (let b = 0; b < BUCKETS; b++) {
      ctx.globalAlpha = 0.12 + (b / (BUCKETS - 1)) * 0.78;
      ctx.stroke(paths[b]);
    }
    ctx.globalAlpha = 1;
  }

  function step(now: number) {
    const dt = Math.min(64, now - last);
    last = now;
    let morphing = false;
    if (morphStart >= 0) {
      const t = (now - morphStart) / MORPH;
      morphing = t < 1.35;
      for (let l = 0; l < LINES; l++) {
        // lines re-form one after another
        const lt = ease(Math.max(0, Math.min(1, t * 1.35 - (l / LINES) * 0.35)));
        const base = l * PTS * 3;
        for (let i = base; i < base + PTS * 3; i++) cur[i] = from[i] + (to[i] - from[i]) * lt;
      }
      if (!morphing) morphStart = -1;
    }
    const live = opts.live();
    if (live) {
      ry += dt * opts.speed;
      rx += (tx - rx) * 0.04;
    }
    draw();
    raf = visible && (live || morphing) ? requestAnimationFrame(step) : 0;
  }

  const start = () => {
    if (!raf && visible) {
      last = performance.now();
      raf = requestAnimationFrame(step);
    }
  };

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    draw();
  };

  const onMove = (e: PointerEvent) => {
    if (!opts.live()) return;
    tx = 0.18 + (e.clientY / window.innerHeight) * 0.36;
    ry += (e.clientX / window.innerWidth - 0.5) * 0.004;
  };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
  });
  io.observe(canvas);
  if (opts.follow) window.addEventListener("pointermove", onMove, { passive: true });
  readInk();
  resize();
  start();

  return {
    goTo(i, instant) {
      from = new Float32Array(cur);
      to = F[i];
      if (instant) {
        cur.set(to);
        morphStart = -1;
        draw();
        return;
      }
      morphStart = performance.now();
      start();
    },
    repaint() {
      readInk();
      draw();
    },
    start,
    destroy() {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    },
  };
}

/** Shared lifecycle: create once, follow pause and theme. */
function useWire(initial: number, follow: boolean, fill: number, speed: number) {
  const { paused, reduced } = useMotionCtx();
  const theme = useTheme();
  const ref = useRef<HTMLCanvasElement>(null);
  const wire = useRef<Wire | null>(null);
  const live = useRef(!paused);

  useEffect(() => {
    live.current = !paused;
    if (!paused) wire.current?.start();
  }, [paused]);

  useEffect(() => {
    wire.current?.repaint();
  }, [theme]);

  useEffect(() => {
    if (!ref.current) return;
    wire.current = createWire(ref.current, initial, { live: () => live.current, follow, fill, speed });
    return () => {
      wire.current?.destroy();
      wire.current = null;
    };
    // `initial` only seeds the first form; later changes go through goTo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, wire, reduced };
}

/**
 * Hero sculpture: tap to shift through the six forms, one per discipline. Caption, form
 * list and the page's single Pause control sit underneath.
 */
export function Sculpture({ labels }: { labels: string[] }) {
  const { paused, toggle } = useMotionCtx();
  const { ref, wire, reduced } = useWire(0, true, 0.6, 0.00018);
  const [index, setIndex] = useState(0);
  const go = (i: number) => {
    setIndex(i);
    wire.current?.goTo(i, reduced);
  };
  const n = (x: number) => String(x).padStart(2, "0");
  return (
    <div className={s.sculpture}>
      <button
        type="button"
        className={s.stage}
        onClick={() => go((index + 1) % labels.length)}
        data-cursor="shift"
        aria-label={`Shift the sculpture to the next form. Showing ${labels[index]}.`}
      >
        <canvas ref={ref} className={s.canvas} aria-hidden="true" />
      </button>
      <div className={s.caption}>
        <p aria-live="polite">
          <span>The shape of it</span> — {n(index + 1)}/{n(labels.length)} — <b>{labels[index]}</b>
          <span className={s.hint}> · Tap to shift</span>
        </p>
        <button type="button" className={s.pause} onClick={toggle} aria-pressed={paused}>
          {paused ? "Play motion" : "Pause motion"}
        </button>
      </div>
      <ol className={s.formList} aria-label="Forms">
        {labels.map((l, i) => (
          <li key={l}>
            <button type="button" aria-current={i === index ? "true" : undefined} onClick={() => go(i)}>
              <span>{n(i + 1)}</span> {l}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** A discipline's form, turning slowly. Decorative; used inside the services deck. */
export function Form({ index }: { index: number }) {
  const { ref } = useWire(index, false, 0.46, 0.00012);
  return <canvas ref={ref} className={s.formCanvas} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ chrome */

/** Thin accent line along the top of the viewport: how far down the page you are. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className={s.progress} aria-hidden="true" />;
}

const FINE = "(hover: hover) and (pointer: fine)";
const subscribeFine = (cb: () => void) => {
  const m = window.matchMedia(FINE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** Ink dot that grows into a round "View" / "Shift" badge over cards and the sculpture. */
export function Cursor() {
  const fine = useSyncExternalStore(subscribeFine, () => window.matchMedia(FINE).matches, () => false);
  const reduced = useReducedMotion();
  const on = fine && !reduced;
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"" | "view" | "shift">("");

  useEffect(() => {
    if (!on) return;
    const el = ref.current;
    if (!el) return;
    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.dataset.visible = "true";
      if (!raf) raf = requestAnimationFrame(loop);
      const t = (e.target as Element | null)?.closest?.("[data-cursor]");
      setMode((t?.getAttribute("data-cursor") as "view" | "shift" | null) ?? "");
    };
    const onLeave = () => {
      el.dataset.visible = "false";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={ref} className={s.cursor} data-mode={mode} aria-hidden="true">
      <span>{mode === "view" ? "View" : mode === "shift" ? "Shift" : ""}</span>
    </div>
  );
}

export type NavLink = { href: string; label: string; id: string };

/**
 * Header links. The homepage is one long page in this phase, so links are anchors and the
 * underline follows the section in view; on a case study, "Work" stays underlined.
 */
export function NavLinks({ links }: { links: NavLink[] }) {
  const path = usePathname();
  const home = path === "/v13";
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!home) return;
    const els = links.map((l) => document.getElementById(l.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [home, links]);

  const current = home ? active : path.startsWith("/v13/work") ? "work" : "";
  return (
    <>
      {links.map((l) => (
        <Link key={l.id} href={l.href} aria-current={current === l.id ? "location" : undefined}>
          {l.label}
        </Link>
      ))}
    </>
  );
}

/** Mobile menu: a full-screen paper sheet with large links. The "+" turns into "×". */
export function MenuToggle({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <>
      <button type="button" className={s.menuBtn} aria-expanded={open} aria-controls="v13-menu" onClick={() => setOpen(!open)}>
        <span>{open ? "Close" : "Menu"}</span>
        <i aria-hidden="true" data-open={open} />
      </button>
      <div id="v13-menu" className={s.sheet} data-open={open} inert={!open}>
        <nav aria-label="Mobile">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ transitionDelay: `${60 + i * 40}ms` }}>
              {l.label} <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <div className={s.sheetFoot}>
          <span>Colour mode</span>
          <ThemeToggle className={s.themeBtn}>
            <ThemeIcon />
            <ModeLabel />
          </ThemeToggle>
        </div>
      </div>
    </>
  );
}

/** "Light" / "Dark" next to the toggle icon: names the mode you switch to. */
export function ModeLabel() {
  const theme = useTheme();
  return <span className={s.modeLabel}>{theme === "dark" ? "Light" : theme === "light" ? "Dark" : "Mode"}</span>;
}

/* ------------------------------------------------------------------ hero */

/** DOTGREY sized by script so the ink spans the content width exactly. */
export function Wordmark({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement!;
    const fit = () => {
      el.style.fontSize = "100px";
      const w = el.getBoundingClientRect().width;
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

/**
 * The hero row under the wordmark: a giant italic "Hello." and, beside it, a line written for
 * the visitor's time of day, both clocks and the two ways in. Neutral on the server.
 */
export function Greeting() {
  const key = useSyncExternalStore(subscribeMinute, nowKey, () => "");
  const [day, hour, local, dhaka] = key.split("|");
  const line = key ? lineFor(Number(day), Number(hour)) : "One studio for design, software, automation, data and machine learning.";
  return (
    <div className={s.heroRow}>
      <p className={s.hello}>
        Hello<span className={s.stop}>.</span>
      </p>
      <div className={s.greetSide}>
        <p className={s.greetLine}>{line}</p>
        <p className={s.greetMeta} suppressHydrationWarning>
          {key ? (
            <>
              <span>{local} for you</span>
              <span>{dhaka} in Dhaka</span>
            </>
          ) : (
            <span>Dhaka · Worldwide</span>
          )}
        </p>
        <div className={s.greetCtas}>
          <a href="#start" className={s.pillInk}>
            Start a project <span aria-hidden="true">↗</span>
          </a>
          <a href="#work" className={s.textLink}>
            See the work
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ halftone field (from v8) */

const FIELD_WORDS = ["Design", "Software", "Automation", "Data", "ML"];

/** The page's one Pause control, as a small pill. */
export function MotionPill({ className }: { className?: string }) {
  const { paused, toggle } = useMotionCtx();
  return (
    <button type="button" className={className ?? s.fieldPause} onClick={toggle} aria-pressed={paused}>
      <span aria-hidden="true" className={s.motionIcon} data-paused={paused} />
      {paused ? "Play" : "Pause"}
    </button>
  );
}

/**
 * V8's signature panel: a field of dots that spells each discipline in turn, wiping from
 * left to right. Dots swell around the pointer. Ink comes from CSS, so it follows the theme;
 * it stops on Pause, offscreen and under reduced motion (first word, still).
 */
export function HalftoneField({ words = FIELD_WORDS, caption = "Six disciplines, one team." }: { words?: string[]; caption?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { paused } = useMotionCtx();
  const theme = useTheme();
  const [word, setWord] = useState(0);

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
    let visible = false;
    let shown = -1;
    const pointer = { x: -9999, y: -9999, k: 0 };
    const start = performance.now();
    const ink = getComputedStyle(cv).color;

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
      // Fewer, larger dots on small screens so each word still reads.
      step = W < 640 ? 9 : W < 1100 ? 12 : 15;
      cols = Math.ceil(W / step);
      rows = Math.ceil(H / step);
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      const family = getComputedStyle(cv).fontFamily;
      masks = words.map((w) => {
        o.clearRect(0, 0, cols, rows);
        let size = rows * 0.62;
        o.font = `900 ${size}px ${family}`;
        const tw = o.measureText(w).width;
        if (tw > cols * 0.86) size *= (cols * 0.86) / tw;
        o.font = `900 ${size}px ${family}`;
        o.textAlign = "center";
        o.textBaseline = "middle";
        o.fillStyle = "#fff";
        o.fillText(w, cols / 2, rows / 2 + size * 0.04);
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
      // The label follows the word you can read: it switches once the wipe is mostly done.
      const readable = f > 0.84 ? b : a;
      if (readable !== shown) {
        shown = readable;
        setWord(readable);
      }
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = ink;
      pointer.k += ((pointer.x > -999 ? 1 : 0) - pointer.k) * 0.08;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = (i + 0.5) * step;
          const y = (j + 0.5) * step;
          // Wipe from left to right during the last 35% of each hold.
          const local = Math.min(1, Math.max(0, ((f - 0.65) / 0.35) * 1.6 - (i / cols) * 0.6));
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
    draw(performance.now());
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

  const n = (x: number) => String(x).padStart(2, "0");
  return (
    <div ref={wrap} className={s.field} role="img" aria-label={`Dot field spelling ${words.join(", ")}`}>
      <canvas ref={canvas} className={s.fieldCanvas} />
      <div className={s.fieldTop} aria-hidden="true">
        <span>
          {n(word + 1)} / {n(words.length)}
        </span>
        <span className={s.fieldWord}>{words[word]}</span>
      </div>
      <div className={s.fieldCaption}>
        <span>{caption}</span>
        <MotionPill />
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

/** Paragraph whose words darken as it scrolls through the viewport. CSS vars, no re-renders. */
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

/** Two tilted frames of a project that straighten and lift on hover. */
export function TiltCard({ work, index, href }: { work: Work; index: number; href: string }) {
  return (
    <Link href={href} className={s.tilt} data-cursor="view">
      <span className={s.tiltStage}>
        <span className={`${s.frame} ${s.frameBack}`}>
          <ProjectMockup slug={work.slug} ink="var(--art-a-ink)" paper="var(--art-a-paper)" ratio={1.25} frame={1} label={false} />
        </span>
        <span className={`${s.frame} ${s.frameFront}`}>
          <ProjectMockup slug={work.slug} ink="var(--art-b-ink)" paper="var(--art-b-paper)" ratio={1.25} frame={index % 2 ? 2 : 0} />
        </span>
      </span>
      <span className={s.tiltMeta}>
        <span>
          <span className={s.tiltKicker}>
            {String(index + 1).padStart(2, "0")} · {work.category} · {work.year}
          </span>
          <span className={s.tiltTitle}>{work.title}</span>
        </span>
        <span className={s.tiltStat}>
          <b>{work.stats[0].value}</b>
          <span>{work.stats[0].label}</span>
        </span>
      </span>
    </Link>
  );
}

/**
 * "Our work." On wide screens with motion allowed the section pins and vertical scroll
 * moves the cards sideways. Otherwise a native swipe row with scroll-snap.
 */
export function WorkReel({ items, title, note }: { items: Work[]; title: ReactNode; note: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
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

  return (
    <section ref={section} id="work" className={s.reel} aria-labelledby="work-title">
      <div className={s.reelHead}>
        <h2 id="work-title" className={s.chapterTitle}>
          {title}
        </h2>
        <p className={s.reelNote}>
          {note}
          <span className={s.reelHint} aria-hidden="true">
            {native ? "Swipe →" : "Scroll →"}
          </span>
        </p>
      </div>
      <div ref={track} className={`${s.track} ${native ? s.trackNative : ""}`}>
        {items.map((w, i) => (
          <div key={w.slug} className={s.reelItem}>
            <TiltCard work={w} index={i} href={`/v13/work/${w.slug}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ services deck */

/** Sticky cards that stack like a deck; each covered card shrinks and dims a little. */
export function Deck({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(`.${s.deckCard}`, ref.current);
        cards.slice(0, -1).forEach((card, i) => {
          gsap.to(card, {
            scale: 0.93,
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
          <button type="button" className={s.round} onClick={() => go(-1)} aria-label="Previous quote">
            ←
          </button>
          <button type="button" className={s.round} onClick={() => go(1)} aria-label="Next quote">
            →
          </button>
        </span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ clocks */

const dhakaNow = () => timeFmt("Asia/Dhaka").format(new Date());

/** Live Dhaka time; a dash on the server. */
export function DhakaTime() {
  const t = useSyncExternalStore(subscribeMinute, dhakaNow, () => "—");
  return <span suppressHydrationWarning>{t}</span>;
}
