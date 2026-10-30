"use client";

/**
 * Homepage-only client components. Kept out of Client.tsx (which every page loads through the
 * layout) so inner pages don't download GSAP, the dot field or the work reel.
 */
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Work } from "@/site/content";
import { useTheme } from "@/site/shared/useTheme";
import { ArrowUpRight } from "@/site/shared/Arrow";
import { TiltCard, subscribeMinute, timeFmt, useMotionCtx } from "./Client";
import s from "./site.module.css";

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
    // A face can finish loading after `ready` first resolves; refit whenever one does.
    document.fonts?.addEventListener("loadingdone", fit);
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => {
      ro.disconnect();
      document.fonts?.removeEventListener("loadingdone", fit);
    };
  }, []);
  return (
    <span ref={ref} className={s.wordmark} aria-hidden="true">
      {text.slice(0, -1)}
      <span>{text.slice(-1)}</span>
    </span>
  );
}

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
  // The server renders a neutral line of about the same length, so the swap to the visitor's own
  // line doesn't move anything (the box is also given a four-line minimum in CSS).
  const line = key ? lineFor(Number(day), Number(hour)) : "Design, software, automation, data and ML — one team.";
  return (
    <div className={s.heroRow}>
      <p className={s.hello}>
        Hello<span className={s.stop}>.</span>
      </p>
      <div className={s.greetSide}>
        <p className={s.greetLine}>
          <span>{line}</span>
        </p>
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
          <Link href="/start" className={s.pillInk} data-magnetic>
            Start a project <ArrowUpRight />
          </Link>
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
    const binsRef: number[][] = [];
    let lastFrame = 0;
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
      // Dots are batched by radius (quarter-pixel bins): a few fills per frame instead of one per dot.
      const bins = binsRef;
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
          (bins[Math.round(r * 4)] ??= []).push(x, y);
        }
      }
      for (let k = 0; k < bins.length; k++) {
        const b = bins[k];
        if (!b || !b.length) continue;
        const rr = k / 4;
        ctx.beginPath();
        for (let q = 0; q < b.length; q += 2) {
          ctx.moveTo(b[q] + rr, b[q + 1]);
          ctx.arc(b[q], b[q + 1], rr, 0, Math.PI * 2);
        }
        ctx.fill();
        b.length = 0;
      }
    };

    // ~30 fps is plenty for a slow wipe and halves the main-thread cost.
    const loop = (now: number) => {
      if (now - lastFrame >= 30) {
        lastFrame = now;
        draw(now);
      }
      if (!paused && visible) raf = requestAnimationFrame(loop);
    };

    // Masks (five words rasterised to a grid) are built the first time the panel is near the
    // viewport, not at page load, so the work stays off the critical path.
    let armed = false;
    const arm = () => {
      armed = true;
      build();
      draw(performance.now());
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (e.isIntersecting && !armed) arm();
        cancelAnimationFrame(raf);
        if (visible && armed) raf = requestAnimationFrame(loop);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(box);
    const ro = new ResizeObserver(() => {
      if (!armed) return;
      build();
      draw(performance.now());
    });
    ro.observe(box);
    document.fonts?.ready.then(() => {
      if (!armed) return;
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
    <div ref={wrap} className={s.field}>
      <canvas ref={canvas} className={s.fieldCanvas} role="img" aria-label={`Dot field spelling ${words.join(", ")}`} />
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
            <TiltCard work={w} index={i} href={`/work/${w.slug}`} />
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

