"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { useMotion } from "@/redesign/shared/useMotion";
import type { Work } from "@/redesign/content";
import { variantFor } from "./art";
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
  { href: "/v8#work", label: "Work" },
  { href: "/v8#services", label: "Services" },
  { href: "/v8#process", label: "Process" },
];
const RIGHT = [
  { href: "/v8#about", label: "About" },
  { href: "/v8#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const first = useRef<HTMLAnchorElement>(null);

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
              <Link key={l.label} href={l.href} className={s.pill}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <Ticker />
        <div className={`${s.cluster} ${s.clusterRight}`}>
          <nav aria-label="Secondary" className={s.pills}>
            {RIGHT.map((l) => (
              <Link key={l.label} href={l.href} className={s.pill}>
                {l.label}
              </Link>
            ))}
          </nav>
          <MotionToggle />
          <button type="button" className={`${s.pill} ${s.menuBtn}`} aria-expanded={open} aria-controls="v8-menu" onClick={() => setOpen(true)}>
            Menu
          </button>
        </div>
      </header>

      <div id="v8-menu" className={s.sheet} data-open={open} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <div className={s.sheetTop}>
          <BrandMark href="/v8" ink="#ffffff" accent="#8f8f8f" className={s.logo} />
          <button type="button" className={s.pill} onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <nav aria-label="Menu" className={s.sheetLinks}>
          {[...LEFT, ...RIGHT].map((l, k) => (
            <Link key={l.label} ref={k === 0 ? first : undefined} href={l.href} onClick={() => setOpen(false)} style={{ ["--k" as string]: k }}>
              {l.label}.
            </Link>
          ))}
        </nav>
        <div className={s.sheetFoot}>
          <span>Design · Software · Automation · Data · ML</span>
          <MotionToggle />
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
      <p className={s.hello}>Hello.</p>
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
export function HalftoneField() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { paused } = useMotionCtx();

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

    const build = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = box.clientWidth;
      H = box.clientHeight;
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
      masks = FIELD_WORDS.map((word) => {
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
      const t = (now - start) / 1000;
      const hold = 2.6;
      const phase = paused ? 0 : t / hold;
      const a = Math.floor(phase) % FIELD_WORDS.length;
      const b = (a + 1) % FIELD_WORDS.length;
      const f = phase - Math.floor(phase);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#ffffff";
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
  }, [paused]);

  return (
    <div ref={wrap} className={s.field} role="img" aria-label="Dot field spelling Design, Software, Automation, Data, ML">
      <canvas ref={canvas} className={s.fieldCanvas} />
      <div className={s.fieldCaption}>
        <span>Six disciplines, one team.</span>
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
        {AUDIENCE[i]}.
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
          Our work.
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
              <ProjectArt slug={w.slug} label={w.client} variant={variantFor(w.slug)} ink="#ffffff" paper="#141414" ratio={1.5} />
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
        <Link href="/works" className={`${s.card} ${s.cardAll}`}>
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
