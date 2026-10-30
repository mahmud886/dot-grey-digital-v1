"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, Fragment, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectMockup } from "@/site/shared/ProjectMockup";
import { useMotion } from "@/site/shared/useMotion";
import { ThemeIcon, ThemeToggle } from "@/site/shared/ThemeToggle";
import { useTheme } from "@/site/shared/useTheme";
import type { Work } from "@/site/content";
import { LINES, PTS, forms } from "./sculpture";
import s from "./site.module.css";
import { ArrowUpRight } from "@/site/shared/Arrow";

/* ------------------------------------------------------------------ motion */

type MotionState = ReturnType<typeof useMotion>;
const MotionCtx = createContext<MotionState>({ paused: false, reduced: false, toggle: () => {} });

/** One switch for everything that moves on its own: the sculptures and the rotating word. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const motion = useMotion();
  return <MotionCtx.Provider value={motion}>{children}</MotionCtx.Provider>;
}

export const useMotionCtx = () => useContext(MotionCtx);

/* ------------------------------------------------------------------ wireframe renderer */

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const BUCKETS = 7;
let FORMS: Float32Array[] | null = null;
let NORMS: number[] | null = null;
const getForms = () => (FORMS ??= forms());

/**
 * How much to scale each form so all six read at the same visual size: the sphere fills its
 * bounding radius, the ribbon and the knot do not. Normalised to the median extent.
 */
function getNorms() {
  if (NORMS) return NORMS;
  const radii = getForms().map((f) => {
    let r = 0;
    for (let i = 0; i < f.length; i += 3) r = Math.max(r, Math.hypot(f[i], f[i + 1], f[i + 2]));
    return r || 1;
  });
  const sorted = [...radii].sort((a, b) => a - b);
  const mid = sorted[Math.floor(sorted.length / 2)];
  NORMS = radii.map((r) => Math.min(1.15, Math.max(0.78, mid / r)));
  return NORMS;
}

type Wire = { goTo: (i: number, instant: boolean) => void; repaint: () => void; start: () => void; destroy: () => void };

/**
 * Draws one of the six forms as fine ink lines with its own 3D projection, depth shown by
 * opacity. Morphs point-for-point between forms. `live()` decides whether it keeps rotating.
 */
function createWire(canvas: HTMLCanvasElement, initial: number, opts: { live: () => boolean; follow: boolean; fill: number; speed: number }): Wire {
  const ctx = canvas.getContext("2d")!;
  const F = getForms();
  const N = getNorms();
  let norm = N[initial];
  let normTo = N[initial];
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
  let lastDraw = 0;
  let stride = 1;
  let lineStep = 1;
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
    const scale = Math.min(w, h) * opts.fill * norm;
    const D = 3.4;
    const ox = w / 2;
    const oy = h / 2;
    for (let b = 0; b < BUCKETS; b++) paths[b] = new Path2D();
    for (let l = 0; l < LINES; l += lineStep) {
      let px = 0;
      let py = 0;
      let pz = 0;
      let lastBucket = -1;
      // Every `stride`-th point, always ending on the last so the line reaches its end.
      for (let p = 0; p < PTS; p = p === PTS - 1 ? PTS : Math.min(PTS - 1, p + stride)) {
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
    norm += (normTo - norm) * 0.08;
    if (Math.abs(normTo - norm) > 0.001) morphing = true;
    const live = opts.live();
    if (live) {
      ry += dt * opts.speed;
      rx += (tx - rx) * 0.04;
    }
    // Idle rotation is slow, so draw it at ~30 fps; morphs run at full rate.
    if (morphing || now - lastDraw >= 42) {
      lastDraw = now;
      draw();
    }
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
    w = r.width;
    h = r.height;
    // Small canvases (phones): fewer points per line and a lower pixel ratio. The lines are
    // 0.8px hairlines, so the difference is invisible but the raster cost is much lower.
    const small = Math.min(w, h) < 520;
    stride = small ? 2 : 1;
    lineStep = small ? 2 : 1;
    dpr = Math.min(small ? 1.5 : 2, window.devicePixelRatio || 1);
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
  // First frame is drawn now; the rotation loop begins once the page has finished loading, so it
  // never competes with first paint, hydration or the load event.
  if (document.readyState === "complete") window.setTimeout(start, 1200);
  else window.addEventListener("load", () => window.setTimeout(start, 1200), { once: true });

  return {
    goTo(i, instant) {
      from = new Float32Array(cur);
      to = F[i];
      normTo = N[i];
      if (instant) {
        norm = normTo;
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

  // Created only when the canvas comes near the viewport, so a long page doesn't build six
  // sculptures up front.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || wire.current) return;
        wire.current = createWire(el, initial, { live: () => live.current, follow, fill, speed });
        io.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
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
export function Sculpture({ labels, initial = 0, single = false }: { labels: string[]; initial?: number; single?: boolean }) {
  const { paused, toggle } = useMotionCtx();
  const { ref, wire, reduced } = useWire(initial, true, 0.6, 0.00018);
  const [index, setIndex] = useState(initial);
  const go = (i: number) => {
    setIndex(i);
    wire.current?.goTo(i, reduced);
  };
  const n = (x: number) => String(x).padStart(2, "0");
  if (single) {
    return (
      <div className={`${s.sculpture} ${s.sculptureSingle}`}>
        <div className={s.stage}>
          <canvas ref={ref} className={s.canvas} aria-hidden="true" />
        </div>
        <div className={s.caption}>
          <p>
            <span>The shape of it</span> — <b>{labels[index]}</b>
          </p>
          <button type="button" className={s.pause} onClick={toggle} aria-pressed={paused}>
            {paused ? "Play motion" : "Pause motion"}
          </button>
        </div>
      </div>
    );
  }
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

/** Header links; the underline marks the section of the site you are in (team pages count as About). */
export function NavLinks({ links }: { links: NavLink[] }) {
  const path = usePathname();
  const section = path.split("/")[1] ?? "";
  const current = section === "team" ? "about" : section;
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
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      btn.current?.focus();
    };
    // While the sheet is open the page behind it is inert: Tab can't wander into content you
    // can't see, and screen readers don't read it.
    const behind = [...document.querySelectorAll<HTMLElement>("#content, #start")];
    behind.forEach((el) => (el.inert = true));
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      behind.forEach((el) => (el.inert = false));
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <>
      <button ref={btn} type="button" className={s.menuBtn} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
        <span>{open ? "Close" : "Menu"}</span>
        <i aria-hidden="true" data-open={open} />
      </button>
      <div id="site-menu" className={s.sheet} data-open={open} inert={!open}>
        <nav aria-label="Mobile">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ transitionDelay: `${60 + i * 40}ms` }}>
              {l.label} <ArrowUpRight />
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

/* ------------------------------------------------------------------ tilt card */

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


/* ------------------------------------------------------------------ clocks */

export function subscribeMinute(cb: () => void) {
  const id = setInterval(cb, 20_000);
  return () => clearInterval(id);
}

export const timeFmt = (tz?: string) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });

const dhakaNow = () => timeFmt("Asia/Dhaka").format(new Date());

/** Live Dhaka time; a dash on the server. */
export function DhakaTime() {
  const t = useSyncExternalStore(subscribeMinute, dhakaNow, () => "—");
  return <span suppressHydrationWarning>{t}</span>;
}

/* ------------------------------------------------------------------ reveal & magnet */

/**
 * A headline whose words rise out of a mask as it enters the viewport, one after another.
 * Server markup is the plain, visible headline; the client arms the effect only for headlines
 * still below the fold, so nothing flashes and reduced motion sees it as-is.
 */
export function Reveal({ as: Tag = "h2", text, className, id }: { as?: "h1" | "h2" | "h3" | "p"; text: string; className?: string; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { reduced } = useMotionCtx();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92) return;
    el.dataset.armed = "true";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.in = "true";
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  const last = text.slice(-1);
  const stop = ".?!".includes(last);
  const words = (stop ? text.slice(0, -1) : text).split(" ");
  return (
    <Tag ref={ref} id={id} className={`${className ?? ""} ${s.reveal}`}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className={s.rw}>
            <span style={{ ["--d" as string]: `${i * 70}ms` }}>
              {w}
              {i === words.length - 1 && stop && <span className={s.stop}>{last}</span>}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Pills marked data-magnetic lean toward the pointer a little. Mouse only, motion allowed. */
export function Magnet() {
  const fine = useSyncExternalStore(subscribeFine, () => window.matchMedia(FINE).matches, () => false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!fine || reduced) return;
    let cur: HTMLElement | null = null;
    const reset = (el: HTMLElement) => {
      el.style.transform = "";
    };
    const move = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-magnetic]") ?? null;
      if (cur && cur !== el) reset(cur);
      cur = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.3}px)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      if (cur) reset(cur);
    };
  }, [fine, reduced]);
  return null;
}
