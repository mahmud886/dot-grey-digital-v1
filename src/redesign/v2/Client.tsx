"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import s from "./v2.module.css";

/** Thin oxblood bar showing how far through the "issue" the reader is. */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      ref.current?.style.setProperty("--p", String(max > 0 ? scrollY / max : 0));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return <div ref={ref} className={s.progress} aria-hidden="true" />;
}

const PARTS = ["Early", "Morning", "Afternoon", "Evening", "Late"] as const;

function editionFor(d: Date) {
  const h = d.getHours();
  const part = h < 6 ? PARTS[4] : h < 9 ? PARTS[0] : h < 12 ? PARTS[1] : h < 17 ? PARTS[2] : h < 22 ? PARTS[3] : PARTS[4];
  const weekend = d.getDay() === 0 || d.getDay() === 6;
  return `${weekend ? "Weekend" : part} edition`;
}

/**
 * Dateline in the visitor's own time — "Saturday, 17 October 2026 · Weekend edition".
 * Renders a neutral label on the server, then the local one after hydration.
 */
const noSubscribe = () => () => {};

function localDateline() {
  const d = new Date();
  const date = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return `${date} · ${editionFor(d)}`;
}

export function Dateline() {
  const text = useSyncExternalStore(noSubscribe, localDateline, () => "Today's edition");
  return <span suppressHydrationWarning>{text}</span>;
}

/**
 * A paragraph whose words ink in as it scrolls through the viewport. Words wrapped in
 * *asterisks* in the source are set in oxblood italic. Fully inked under reduced motion.
 */
export function InkText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const start = innerHeight * 0.85;
      const end = innerHeight * 0.3;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height * 0.6)));
      setCount(Math.round(p * words.length));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [reduced, words.length]);

  return (
    <p ref={ref} className={s.ink}>
      {words.map((w, i) => {
        const accent = w.startsWith("*");
        return (
          <span key={i} data-on={reduced || i < count} data-accent={accent}>
            {w.replaceAll("*", "")}{" "}
          </span>
        );
      })}
    </p>
  );
}
