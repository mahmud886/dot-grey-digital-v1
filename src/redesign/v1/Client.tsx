"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { useMotion } from "@/redesign/shared/useMotion";
import type { Work } from "@/redesign/content";
import s from "./v1.module.css";

type Node = { x: number; y: number; vx: number; vy: number };

/**
 * The hero's living neural network: nodes drift, link to their neighbours, bend towards
 * the pointer, and carry "signals" along their links. The telemetry under it reports the
 * simulation's real numbers. Stops when paused, off-screen, or under reduced motion.
 */
export function NeuralHero({ children, lead }: { children: ReactNode; lead: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { paused, toggle } = useMotion();
  const [tel, setTel] = useState({ nodes: 0, links: 0, signals: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999 };
    let signals: { a: number; b: number; t: number }[] = [];
    let raf = 0;
    let visible = true;
    let lastTel = 0;
    const LINK = 140;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(120, Math.round((w * h) / 13000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
      signals = [];
    }

    function frame(now: number, animate: boolean) {
      ctx!.clearRect(0, 0, w, h);
      let links = 0;
      const pairs: [number, number][] = [];

      for (const n of nodes) {
        if (animate) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 200 && d > 1) {
            n.vx += (dx / d) * 0.02;
            n.vy += (dy / d) * 0.02;
          }
          n.vx *= 0.985;
          n.vy *= 0.985;
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            links++;
            pairs.push([i, j]);
            const near = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) < 180;
            const alpha = (1 - d / LINK) * (near ? 0.85 : 0.34);
            ctx!.strokeStyle = near ? `rgba(200,255,61,${alpha})` : `rgba(160,170,220,${alpha})`;
            ctx!.lineWidth = near ? 1.1 : 0.7;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        const near = Math.hypot(n.x - mouse.x, n.y - mouse.y) < 180;
        ctx!.fillStyle = near ? "#c8ff3d" : "rgba(233,234,244,0.7)";
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, near ? 2.4 : 1.5, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (animate) {
        if (pairs.length && signals.length < 14 && Math.random() < 0.12) {
          const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
          signals.push({ a, b, t: 0 });
        }
        signals = signals.filter((sg) => (sg.t += 0.02) < 1);
      }
      for (const sg of signals) {
        const a = nodes[sg.a];
        const b = nodes[sg.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * sg.t;
        const y = a.y + (b.y - a.y) * sg.t;
        ctx!.fillStyle = "#5ce1e6";
        ctx!.shadowColor = "#5ce1e6";
        ctx!.shadowBlur = 10;
        ctx!.beginPath();
        ctx!.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      if (now - lastTel > 400) {
        lastTel = now;
        setTel({ nodes: nodes.length, links, signals: signals.length });
      }
    }

    function loop(now: number) {
      frame(now, true);
      raf = requestAnimationFrame(loop);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !paused) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.parentElement?.addEventListener("pointerleave", onLeave);

    if (paused) frame(performance.now(), false);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.parentElement?.removeEventListener("pointerleave", onLeave);
    };
  }, [paused]);

  return (
    <section className={`${s.hero} ${paused ? s.paused : ""}`} aria-label="Introduction">
      <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
      <div className={s.heroFade} />
      <div className={s.wrap}>
        {children}
        <div className={s.heroBottom}>
          <div>{lead}</div>
          <div className={s.telemetry} aria-live="off">
            <div>
              <span className={s.telValue}>{tel.nodes}</span>
              <span className={`${s.mono} ${s.telLabel}`}>Nodes</span>
            </div>
            <div>
              <span className={s.telValue}>{tel.links}</span>
              <span className={`${s.mono} ${s.telLabel}`}>Links</span>
            </div>
            <div>
              <span className={s.telValue}>{tel.signals}</span>
              <span className={`${s.mono} ${s.telLabel}`}>Signals</span>
            </div>
            <button type="button" onClick={toggle} className={`${s.pause} ${s.mono}`} aria-pressed={paused}>
              {paused ? <Play size={14} /> : <Pause size={14} />}
              {paused ? "Play" : "Pause"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Spotlight that follows the pointer inside a model card. */
export function Spotlight({ children, className }: { children: ReactNode; className: string }) {
  return (
    <article
      className={className}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </article>
  );
}

/** Work index: rows with a preview image that follows the cursor (pointer devices only). */
export function WorkList({ items }: { items: Work[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Work | null>(null);

  return (
    <div
      className={s.workList}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        ref.current?.style.setProperty("--px", `${e.clientX + 24}px`);
        ref.current?.style.setProperty("--py", `${e.clientY - 110}px`);
      }}
      onPointerLeave={() => setActive(null)}
    >
      {items.map((w, i) => (
        <Link
          key={w.slug}
          href={`/v1/work/${w.slug}`}
          className={s.workRow}
          onPointerEnter={(e) => e.pointerType === "mouse" && setActive(w)}
          onFocus={() => setActive(null)}
        >
          <span className={s.mono} style={{ color: "var(--muted)" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={s.workTitle}>{w.title}</span>
          <span className={`${s.hideSm} ${s.mono}`}>{w.category}</span>
          <span className={`${s.hideSm} ${s.mono}`}>{w.year}</span>
          <span className={s.workStat}>
            <b>{w.stats[0].value}</b>
            <span className={s.mono}>{w.stats[0].label}</span>
          </span>
        </Link>
      ))}
      <div ref={ref} className={`${s.preview} ${active ? s.previewOn : ""}`} aria-hidden="true">
        {active && <Image src={active.cover} alt="" width={680} height={425} />}
      </div>
    </div>
  );
}

/** Counts up once when scrolled into view. */
export function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { reduced } = useMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1400);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, reduced]);

  return (
    <span ref={ref} className={s.statValue}>
      {reduced ? value : n}
      {suffix && <sup>{suffix}</sup>}
    </span>
  );
}

export function QuoteTabs({ items }: { items: { id: string; quote: string; author: string; role: string }[] }) {
  const [i, setI] = useState(0);
  const q = items[i];
  return (
    <div className={s.quoteWrap}>
      <div className={s.quoteTabs} role="tablist" aria-label="Client voices">
        {items.map((t, k) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={k === i}
            className={s.quoteTab}
            onClick={() => setI(k)}
          >
            {t.author}
            <small>{t.role}</small>
          </button>
        ))}
      </div>
      <figure role="tabpanel">
        <blockquote className={s.quote}>{q.quote}</blockquote>
        <figcaption className={s.mono} style={{ marginTop: "1.5rem", color: "var(--muted)" }}>
          {q.author} — {q.role}
        </figcaption>
      </figure>
    </div>
  );
}
