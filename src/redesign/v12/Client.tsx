"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMotion } from "@/redesign/shared/useMotion";
import type { Discipline } from "@/redesign/content";
import { LINES, PTS, forms } from "./sculpture";
import s from "./v12.module.css";

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const BUCKETS = 7;

/**
 * Hero sculpture: a wireframe drawn in 2D canvas with its own projection. Six forms, one
 * per discipline; tapping shifts to the next and the lines re-form with a stagger. Idle
 * rotation follows the pointer and stops on Pause (and by default under reduced motion).
 */
export function Sculpture({ labels }: { labels: string[] }) {
  const { paused, reduced, toggle } = useMotion();
  const [index, setIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ goTo: (i: number) => void } | null>(null);
  const pausedRef = useRef(paused);
  const reducedRef = useRef(reduced);
  const kick = useRef<(() => void) | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
    reducedRef.current = reduced;
    if (!paused) kick.current?.();
  }, [paused, reduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const F = forms();
    const cur = new Float32Array(F[0]);
    let from = new Float32Array(F[0]);
    let to = F[0];
    let morphStart = -1;
    const MORPH = 1500;
    let ry = -0.6;
    let rx = 0.32;
    let tx = 0.32;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      draw();
    };

    const paths: Path2D[] = [];
    function draw() {
      if (!ctx || !w) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const scale = Math.min(w * 0.4, h * 0.45);
      const D = 3.4;
      const ox = w / 2;
      const oy = h / 2;
      for (let b = 0; b < BUCKETS; b++) paths[b] = new Path2D();
      for (let l = 0; l < LINES; l++) {
        let prevX = 0;
        let prevY = 0;
        let prevZ = 0;
        let lastBucket = -1;
        for (let p = 0; p < PTS; p++) {
          const k = (l * PTS + p) * 3;
          const x0 = cur[k];
          const y0 = cur[k + 1];
          const z0 = cur[k + 2];
          // rotate around y, then x
          const x1 = x0 * cy + z0 * sy;
          const z1 = -x0 * sy + z0 * cy;
          const y2 = y0 * cx - z1 * sx;
          const z2 = y0 * sx + z1 * cx;
          const f = D / (D - z2);
          const X = ox + x1 * f * scale;
          const Y = oy - y2 * f * scale;
          if (p > 0) {
            const zm = (z2 + prevZ) / 2;
            const b = Math.max(0, Math.min(BUCKETS - 1, Math.floor(((zm + 1) / 2) * BUCKETS)));
            if (b !== lastBucket) {
              paths[b].moveTo(prevX, prevY);
              lastBucket = b;
            }
            paths[b].lineTo(X, Y);
          }
          prevX = X;
          prevY = Y;
          prevZ = z2;
        }
      }
      ctx.lineWidth = 0.8;
      ctx.lineJoin = "round";
      for (let b = 0; b < BUCKETS; b++) {
        ctx.strokeStyle = `rgba(17,17,17,${(0.12 + (b / (BUCKETS - 1)) * 0.78).toFixed(3)})`;
        ctx.stroke(paths[b]);
      }
    }

    function step(now: number) {
      const dt = Math.min(64, now - last);
      last = now;
      let morphing = false;
      if (morphStart >= 0) {
        const t = (now - morphStart) / MORPH;
        morphing = t < 1.35;
        for (let l = 0; l < LINES; l++) {
          // lines re-form one after another, front to back
          const lt = ease(Math.max(0, Math.min(1, t * 1.35 - (l / LINES) * 0.35)));
          const base = l * PTS * 3;
          for (let i = base; i < base + PTS * 3; i++) cur[i] = from[i] + (to[i] - from[i]) * lt;
        }
        if (!morphing) morphStart = -1;
      }
      const live = !pausedRef.current;
      if (live) {
        ry += dt * 0.00018;
        rx += (tx - rx) * 0.04;
      }
      draw();
      if (visible && (live || morphing)) raf = requestAnimationFrame(step);
      else raf = 0;
    }

    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };
    kick.current = start;

    api.current = {
      goTo(i: number) {
        from = new Float32Array(cur);
        to = F[i];
        if (reducedRef.current) {
          cur.set(to);
          morphStart = -1;
          draw();
          return;
        }
        morphStart = performance.now();
        start();
      },
    };

    const onMove = (e: PointerEvent) => {
      if (pausedRef.current) return;
      const py = e.clientY / window.innerHeight;
      const px = e.clientX / window.innerWidth;
      tx = 0.18 + py * 0.36;
      ry += (px - 0.5) * 0.004;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    resize();
    start();
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      api.current = null;
      kick.current = null;
    };
  }, []);

  const go = (i: number) => {
    setIndex(i);
    api.current?.goTo(i);
  };
  const next = () => go((index + 1) % labels.length);
  const n = String(index + 1).padStart(2, "0");

  return (
    <div className={s.sculpture}>
      <button type="button" className={s.stage} onClick={next} data-cursor="shift" aria-label={`Shift the sculpture to the next form. Showing ${labels[index]}.`}>
        <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
      </button>
      <div className={s.caption}>
        <p aria-live="polite">
          <span>The shape of it</span> — {n}/{String(labels.length).padStart(2, "0")} — <b>{labels[index]}</b>
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
              <span>{String(i + 1).padStart(2, "0")}</span> {l}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Thin ink line along the top of the viewport showing how far down the page you are. */
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

/**
 * Custom cursor: a small ink dot that grows into a round "VIEW" badge over work cards
 * (anything with data-cursor="view"). Fine pointers only; off under reduced motion.
 */
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

/** Services as a hairline list. Rows invert on hover; click opens capabilities and stack. */
export function ServiceList({ items }: { items: Discipline[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className={s.services}>
      {items.map((d) => {
        const isOpen = open === d.id;
        return (
          <li key={d.id} className={s.service} data-open={isOpen}>
            <h3 className={s.serviceHead}>
              <button type="button" aria-expanded={isOpen} aria-controls={`svc-${d.id}`} onClick={() => setOpen(isOpen ? null : d.id)}>
                <span className={s.serviceNum}>{d.number}</span>
                <span className={s.serviceTitle}>{d.title}</span>
                <span className={s.serviceLine}>{d.line}</span>
                <span className={s.serviceArrow} aria-hidden="true">
                  →
                </span>
              </button>
            </h3>
            <div id={`svc-${d.id}`} className={s.servicePanel} role="region" aria-label={d.title}>
              <div>
                <div className={s.servicePanelInner}>
                  <div>
                    <small>What we do</small>
                    <ul>
                      {d.capabilities.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <small>Usually with</small>
                    <ul>
                      {d.stack.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function hello(now: Date) {
  const h = now.getHours();
  const greet = h < 5 ? "Up late?" : h < 12 ? "Good morning." : h < 17 ? "Good afternoon." : h < 22 ? "Good evening." : "Up late?";
  const t = (tz?: string) => now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz });
  const yours = t();
  const dhaka = t("Asia/Dhaka");
  if (yours === dhaka) return `${greet} It's ${yours} — same time as us in Dhaka.`;
  return `${greet} It's ${yours} for you, ${dhaka} in Dhaka.`;
}

const subscribeMinute = (cb: () => void) => {
  const id = window.setInterval(cb, 20_000);
  return () => window.clearInterval(id);
};

/** "Good evening. It's 9:14 PM for you, 3:14 AM in Dhaka." Client-only; neutral on the server. */
export function LocalHello() {
  const text = useSyncExternalStore(subscribeMinute, () => hello(new Date()), () => "Hello from Dhaka.");
  return <p className={s.hello}>{text}</p>;
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
      <button type="button" className={s.menuBtn} aria-expanded={open} aria-controls="v12-menu" onClick={() => setOpen(!open)}>
        <span>{open ? "Close" : "Menu"}</span>
        <i aria-hidden="true" data-open={open} />
      </button>
      <div id="v12-menu" className={s.sheet} data-open={open} inert={!open}>
        <nav aria-label="Mobile">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ transitionDelay: `${60 + i * 50}ms` }}>
              {l.label} <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
