"use client";

import { DEFAULT_THEME, THEME_STORAGE_KEY, isTheme, type Theme } from "./theme";

/**
 * The document element is the source of truth — ThemeScript stamps `data-theme` before
 * first paint, so React reads the real, server-agreed value instead of assuming a default.
 */
const listeners = new Set<() => void>();

let cached: Theme = DEFAULT_THEME;
let hydrated = false;

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getThemeSnapshot(): Theme {
  // getSnapshot must be cheap and referentially stable, so the attribute is read once and
  // then only re-read when we ourselves change it.
  if (!hydrated) {
    const attr = document.documentElement.getAttribute("data-theme");
    cached = isTheme(attr) ? attr : DEFAULT_THEME;
    hydrated = true;
  }
  return cached;
}

export function getThemeServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function setTheme(next: Theme) {
  cached = next;
  hydrated = true;
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* private mode or blocked storage — the theme still applies for this visit */
  }
  for (const listener of listeners) listener();
}
