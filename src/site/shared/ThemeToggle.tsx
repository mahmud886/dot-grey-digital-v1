"use client";

import type { ReactNode } from "react";
import { THEME_COOKIE, writeCookie, type Theme } from "./theme";
import { useTheme } from "./useTheme";

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

/**
 * Switches theme with a circular reveal that grows from the button (View Transitions API).
 * Browsers without it get a short colour cross-fade; reduced motion switches instantly.
 */
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  writeCookie(THEME_COOKIE, next);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as ViewTransitionDoc;

  if (reduce) {
    root.dataset.theme = next;
    return;
  }
  if (!doc.startViewTransition) {
    root.classList.add("dg-theme-fade");
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove("dg-theme-fade"), 450);
    return;
  }
  const x = origin?.x ?? innerWidth / 2;
  const y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const t = doc.startViewTransition(() => {
    root.dataset.theme = next;
  });
  t.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}

/**
 * Unstyled toggle: each design passes its own className and, optionally, its own label.
 * `data-theme-current` on the button lets CSS swap icons without JS.
 */
export function ThemeToggle({ className, children, label }: { className?: string; children?: ReactNode; label?: string }) {
  const theme = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className={className}
      data-theme-current={theme ?? undefined}
      // When the button shows a visible word, the accessible name starts with it (WCAG 2.5.3).
      aria-label={label ? (theme ? `${label}: switch to ${next} mode` : label) : theme ? `Switch to ${next} mode` : "Switch colour mode"}
      onClick={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        setTheme(next, { x: b.left + b.width / 2, y: b.top + b.height / 2 });
      }}
    >
      {children ?? <ThemeIcon />}
    </button>
  );
}

/** Sun in dark mode, moon in light mode; both drawn, CSS in theme.css shows one. */
export function ThemeIcon() {
  return (
    <span className="dg-theme-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="dg-sun" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg viewBox="0 0 24 24" className="dg-moon" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </span>
  );
}
