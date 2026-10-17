"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { ProjectArt, type ArtVariant } from "@/redesign/shared/ProjectArt";
import { useMotion } from "@/redesign/shared/useMotion";
import s from "./v11.module.css";

/* ------------------------------------------------------------------ header + drawer */

type DrawerItem = { id: string; number: string; title: string; line: string };

const NAV = [
  { label: "Work", href: "/v11#work" },
  { label: "Services", href: "/v11#services" },
  { label: "Process", href: "/v11#process" },
  { label: "Contact", href: "/v11#contact" },
];

/**
 * Fixed header set in `mix-blend-mode: difference`, so the same white type reads on the
 * black reel, the grain paper and the charcoal chapters. The ●●● button opens a dark
 * capabilities drawer.
 */
export function Header({ items }: { items: DrawerItem[] }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <header className={s.header}>
        <BrandMark href="/v11" ink="#ffffff" accent="#8c8c8c" className={s.logo} />
        <nav className={s.nav} aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          ref={triggerRef}
          type="button"
          className={s.dots}
          aria-expanded={open}
          aria-controls="v11-drawer"
          aria-label="Open capabilities"
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={s.scrim} data-open={open} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside id="v11-drawer" className={s.drawer} data-open={open} role="dialog" aria-modal="true" aria-label="Capabilities" inert={!open}>
        <div className={s.drawerTop}>
          <span className={s.label}>
            Capabilities <span className={s.count}>({String(items.length).padStart(2, "0")})</span>
          </span>
          <button ref={closeRef} type="button" className={s.close} onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <ol className={s.drawerList}>
          {items.map((d) => (
            <li key={d.id}>
              <Link href="/v11#services" onClick={() => setOpen(false)}>
                <span className={s.drawerNum}>{d.number}</span>
                <span className={s.drawerTitle}>{d.title}</span>
                <span className={s.drawerLine}>{d.line}</span>
              </Link>
            </li>
          ))}
        </ol>
        <nav className={s.drawerNav} aria-label="Drawer">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

/* ------------------------------------------------------------------ kinetic reel */

export type Cut =
  | { kind: "word"; text: string; invert?: boolean }
  | { kind: "dot"; invert?: boolean }
  | { kind: "art"; slug: string; label: string; caption: string; variant: ArtVariant; invert?: boolean };

const CUT_MS = 820;

/** Advances through the cuts on a fixed beat. Kept under ~1.3 cuts/s, well below flash limits. */
function useCutIndex(length: number, running: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % length), CUT_MS);
    return () => clearInterval(id);
  }, [length, running]);
  return index;
}

const timecode = (ms: number) => {
  const sec = Math.floor(ms / 1000);
  return `00:${String(sec).padStart(2, "0")}`;
};

function ReelFrame({ cut, big = false }: { cut: Cut; big?: boolean }) {
  const invert = cut.invert ?? false;
  return (
    <div className={`${s.frame} ${big ? s.frameBig : ""}`} data-invert={invert}>
      {cut.kind === "word" && (
        <span className={s.cutWord} style={{ ["--len" as string]: Math.max(4, cut.text.length) }}>
          {cut.text}
        </span>
      )}
      {cut.kind === "dot" && <span className={s.cutDot} />}
      {cut.kind === "art" && (
        <>
          <ProjectArt
            slug={cut.slug}
            label={cut.label}
            variant={cut.variant}
            ink={invert ? "#141414" : "#f4f4f2"}
            paper={invert ? "#ecece9" : "#0d0d0d"}
            ratio={1.6}
            className={s.cutArt}
          />
          <span className={s.cutCaption}>{cut.caption}</span>
        </>
      )}
    </div>
  );
}

/**
 * Full-bleed hero reel. There is no video footage, so the reel is cut from type and the
 * generative project art. A "WATCH REEL" badge follows the cursor on desktop; clicking
 * (or the button) opens the reel full screen. Pauses off-screen; Pause is always visible.
 */
export function HeroReel({ cuts, children }: { cuts: Cut[]; children: ReactNode }) {
  const { paused, toggle } = useMotion();
  const [inView, setInView] = useState(true);
  const [open, setOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const index = useCutIndex(cuts.length, !paused && (inView || open));

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !badgeRef.current || !heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    const overUi = (e.target as HTMLElement).closest("a, button");
    badgeRef.current.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0) translate(-50%, -50%) scale(${overUi ? 0 : 1})`;
  };

  const close = useCallback(() => {
    setOpen(false);
    openRef.current?.focus();
  }, []);

  return (
    <section
      ref={heroRef}
      className={s.hero}
      onPointerMove={move}
      onPointerLeave={() => badgeRef.current?.style.setProperty("transform", "translate3d(50vw, 60vh, 0) translate(-50%, -50%) scale(0)")}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        if (matchMedia("(pointer: fine)").matches) setOpen(true);
      }}
    >
      <div className={s.heroStage} aria-hidden="true">
        <ReelFrame cut={cuts[index]} />
      </div>
      <span ref={badgeRef} className={s.badge} aria-hidden="true">
        Watch reel
      </span>

      <div className={s.heroTop}>
        <span>Reel ©26</span>
        <span aria-hidden="true">
          {timecode(index * CUT_MS)} / {timecode(cuts.length * CUT_MS)}
        </span>
      </div>

      <div className={s.heroBottom}>{children}</div>

      <div className={s.heroControls}>
        <button ref={openRef} type="button" className={s.pill} onClick={() => setOpen(true)}>
          <span className={s.playDot} aria-hidden="true" />
          Watch reel
        </button>
        <button type="button" className={s.pillGhost} onClick={toggle} aria-pressed={paused}>
          {paused ? "Play" : "Pause"}
        </button>
      </div>

      {open && <ReelOverlay cuts={cuts} index={index} paused={paused} toggle={toggle} onClose={close} />}
    </section>
  );
}

function ReelOverlay({ cuts, index, paused, toggle, onClose }: { cuts: Cut[]; index: number; paused: boolean; toggle: () => void; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        toggle();
      }
    };
    addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      removeEventListener("keydown", onKey);
    };
  }, [onClose, toggle]);

  return (
    <div className={s.overlay} role="dialog" aria-modal="true" aria-label="DotGrey reel">
      <div className={s.overlayTop}>
        <span>DotGrey® — Reel ©26</span>
        <button ref={closeRef} type="button" className={s.close} onClick={onClose}>
          Close
        </button>
      </div>
      <div className={s.overlayStage} aria-hidden="true">
        <ReelFrame cut={cuts[index]} big />
      </div>
      <div className={s.overlayBottom}>
        <button type="button" className={s.pillGhost} onClick={toggle} aria-pressed={paused}>
          {paused ? "Play" : "Pause"}
        </button>
        <ol className={s.segments} aria-hidden="true">
          {cuts.map((c, i) => (
            <li key={i} data-on={i <= index} />
          ))}
        </ol>
        <span aria-hidden="true">
          {timecode(index * CUT_MS)} / {timecode(cuts.length * CUT_MS)}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ featured 4-up */

export type Card = { slug: string; client: string; title: string; category: string; year: string; stat: { value: string; label: string } };

/** Four-up featured work. Hovering (or scrolling past on touch) advances the 00 / 04 line. */
export function FeaturedGrid({ items }: { items: Card[] }) {
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    list.querySelectorAll("li").forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);

  const n = items.length;
  const shown = active === null ? 0 : active + 1;
  return (
    <>
      <div className={s.progressRow} aria-hidden="true">
        <span>{String(shown).padStart(2, "0")}</span>
        <span className={s.progressTrack}>
          <span className={s.progressFill} style={{ transform: `scaleX(${shown / n})` }} />
        </span>
        <span>{String(n).padStart(2, "0")}</span>
      </div>
      <ol ref={listRef} className={s.fourUp} data-active={active !== null} onMouseLeave={() => setActive(null)}>
        {items.map((w, i) => (
          <li key={w.slug} data-i={i} data-on={active === i}>
            <Link href={`/v11/work/${w.slug}`} className={s.fourCard} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
              <span className={s.fourArt}>
                <ProjectArt slug={w.slug} label={w.client} variant={i % 2 ? "halftone" : "poster"} ink={i % 2 ? "#141414" : "#f4f4f2"} paper={i % 2 ? "#dcdcd8" : "#161616"} ratio={0.78} />
              </span>
              <span className={s.fourMeta}>
                <span className={s.fourNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.fourTitle}>{w.title}</span>
                <span className={s.fourCat}>
                  {w.category} ● {w.year}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}

/* ------------------------------------------------------------------ drag carousel */

/**
 * Horizontal carousel you can drag with the mouse, swipe on touch, or scroll with the
 * keyboard (the track is focusable) and the arrow buttons. A DRAG badge follows the
 * cursor; the line underneath grows with progress.
 */
export function DragCarousel({ items }: { items: Card[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const [progress, setProgress] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  const onScroll = () => {
    const t = trackRef.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    setProgress(max > 0 ? t.scrollLeft / max : 0);
  };

  const step = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector("li");
    const w = card ? card.getBoundingClientRect().width + 16 : t.clientWidth * 0.8;
    t.scrollBy({ left: dir * w, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const down = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !trackRef.current) return;
    drag.current = { down: true, x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
  };
  const move = (e: React.PointerEvent) => {
    const t = trackRef.current;
    if (e.pointerType === "mouse" && badgeRef.current && t) {
      const r = t.getBoundingClientRect();
      badgeRef.current.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0) translate(-50%, -50%) scale(1)`;
    }
    if (!drag.current.down || !t) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4 && !drag.current.moved) {
      drag.current.moved = true;
      setGrabbing(true);
      t.setPointerCapture(e.pointerId);
    }
    if (drag.current.moved) t.scrollLeft = drag.current.left - dx;
  };
  const up = () => {
    drag.current.down = false;
    setGrabbing(false);
  };

  return (
    <div className={s.carousel}>
      <div
        ref={trackRef}
        className={s.track}
        data-grabbing={grabbing}
        tabIndex={0}
        role="region"
        aria-label="Featured engagements — scroll horizontally"
        onScroll={onScroll}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={() => badgeRef.current?.style.setProperty("transform", "translate3d(50%, 40%, 0) translate(-50%, -50%) scale(0)")}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        <ol>
          {items.map((w, i) => (
            <li key={w.slug}>
              <Link href={`/v11/work/${w.slug}`} className={s.engCard} draggable={false}>
                <span className={s.engArt}>
                  <ProjectArt
                    slug={w.slug}
                    label={w.client}
                    variant={(["halftone", "poster", "contour", "halftone", "rings", "poster"] as const)[i % 6]}
                    ink={i % 3 === 1 ? "#141414" : "#f4f4f2"}
                    paper={i % 3 === 1 ? "#e2e2de" : "#151515"}
                    ratio={0.7}
                    frame={2}
                  />
                  <span className={s.engStat}>
                    <b>{w.stat.value}</b>
                    <small>{w.stat.label}</small>
                  </span>
                </span>
                <span className={s.engMeta}>
                  <span>{w.title}</span>
                  <span className={s.muted}>
                    {w.category} ● {w.year}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <span ref={badgeRef} className={s.dragBadge} aria-hidden="true">
        Drag
      </span>
      <div className={s.carouselFoot}>
        <span className={s.progressTrack} aria-hidden="true">
          <span className={s.progressFill} style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
        </span>
        <div className={s.arrows}>
          <button type="button" onClick={() => step(-1)} aria-label="Previous engagement">
            ←
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next engagement">
            →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ services */

type Service = { id: string; number: string; title: string; line: string; capabilities: string[]; stack: string[] };

/** Uppercase service rows that expand to capabilities; one open at a time. */
export function ServiceRows({ items }: { items: Service[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <ul className={s.services}>
      {items.map((d) => {
        const on = open === d.id;
        return (
          <li key={d.id} data-open={on}>
            <h3 className={s.serviceHead}>
              <button type="button" aria-expanded={on} aria-controls={`svc-${d.id}`} onClick={() => setOpen(on ? null : d.id)}>
                <span className={s.serviceNum}>{d.number}</span>
                <span className={s.serviceTitle}>{d.title}</span>
                <span className={s.serviceArrow} aria-hidden="true">
                  →
                </span>
              </button>
            </h3>
            <div id={`svc-${d.id}`} className={s.servicePanel} role="region" aria-label={d.title}>
              <div>
                <p className={s.serviceLine}>{d.line}</p>
                <p className={s.serviceCaps}>
                  {d.capabilities.map((c, i) => (
                    <span key={c}>
                      {c}
                      {i < d.capabilities.length - 1 && <span aria-hidden="true"> ● </span>}
                    </span>
                  ))}
                </p>
                <p className={s.serviceStack}>
                  <span className={s.muted}>Stack —</span> {d.stack.join(", ")}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ live time */

const subscribeMinute = (cb: () => void) => {
  const id = setInterval(cb, 10_000);
  return () => clearInterval(id);
};

/** Live local time for an office, e.g. "18:42". Server renders a placeholder. */
export function LiveTime({ tz }: { tz: string }) {
  const time = useSyncExternalStore(
    subscribeMinute,
    () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }),
    () => "--:--",
  );
  return <time suppressHydrationWarning>{time}</time>;
}
