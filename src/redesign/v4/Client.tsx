"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Work } from "@/redesign/content";
import s from "./v4.module.css";

/**
 * A marquee that only moves when the page scrolls — no autoplay loop, so nothing moves
 * that the visitor did not ask for.
 */
export function ScrollBand({ words }: { words: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => ref.current?.style.setProperty("--shift", `${-scrollY * 0.6}px`);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  const line = [...words, ...words, ...words, ...words];
  return (
    <div className={s.band} aria-hidden="true">
      <div ref={ref} className={s.bandTrack}>
        {line.map((w, i) => (
          <span key={i}>{w} ✦</span>
        ))}
      </div>
    </div>
  );
}

/**
 * Work reel. On wide screens with motion allowed, the section pins and vertical scroll
 * drives the cards sideways (GSAP ScrollTrigger). Everywhere else it is a plain
 * swipeable row with scroll-snap. A "VIEW" badge follows the mouse over the cards.
 */
export function Reel({ items, title }: { items: Work[]; title: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const badge = useRef<HTMLDivElement>(null);
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
            scrub: 0.6,
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
    badge.current?.style.setProperty("--bx", `${e.clientX}px`);
    badge.current?.style.setProperty("--by", `${e.clientY}px`);
  };

  return (
    <section ref={section} className={s.reel} id="work">
      <div className={`${s.reelHead} ${s.pad}`}>{title}</div>
      <div
        ref={track}
        className={`${s.track} ${native ? s.trackNative : ""}`}
        onPointerMove={move}
        onPointerEnter={(e) => e.pointerType === "mouse" && badge.current?.style.setProperty("--bs", "1")}
        onPointerLeave={() => badge.current?.style.setProperty("--bs", "0")}
      >
        {items.map((w) => (
          <Link key={w.slug} href={`/v4/work/${w.slug}`} className={s.card}>
            <div className={s.cardImg}>
              <Image src={w.cover} alt={`${w.title} cover`} width={1600} height={1000} />
            </div>
            <div className={s.cardMeta}>
              <div>
                <span className={s.label} style={{ color: "#e4ff00" }}>
                  {w.category} / {w.year}
                </span>
                <div className={s.cardTitle}>{w.title}</div>
              </div>
              <div className={s.cardStat}>
                <b>{w.stats[0].value}</b>
                <span className={s.label}>{w.stats[0].label}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div ref={badge} className={s.badge} aria-hidden="true">
        VIEW →
      </div>
    </section>
  );
}

/** One giant quote at a time, with square prev/next buttons. */
export function QuoteCycler({ items }: { items: { id: string; quote: string; author: string; role: string }[] }) {
  const [i, setI] = useState(0);
  const q = items[i];
  const words = q.quote.split(" ");
  const cut = Math.min(6, words.length);
  return (
    <div className={s.quoteSec}>
      <span className={s.label}>
        Client says ({i + 1}/{items.length})
      </span>
      <blockquote className={s.quote} aria-live="polite">
        “<mark>{words.slice(0, cut).join(" ")}</mark> {words.slice(cut).join(" ")}”
      </blockquote>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
        <span className={s.label}>
          {q.author} — {q.role}
        </span>
        <div className={s.quoteNav}>
          <button type="button" className={s.sqBtn} aria-label="Previous quote" onClick={() => setI((i - 1 + items.length) % items.length)}>
            ←
          </button>
          <button type="button" className={s.sqBtn} aria-label="Next quote" onClick={() => setI((i + 1) % items.length)}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
