"use client";

import { useSyncExternalStore } from "react";
import type { AccentId, Theme } from "./theme";

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-accent"] });
  return () => mo.disconnect();
}

/**
 * The current theme, read from <html>. Null on the server and during hydration, since only
 * the pre-paint script knows the answer; components should render theme-neutral markup and
 * let CSS do the work, using this only for things CSS cannot reach (canvas, WebGL).
 */
export function useTheme(): Theme | null {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.theme as Theme | undefined) ?? null,
    () => null,
  );
}

export function useAccent(): AccentId | null {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.accent as AccentId | undefined) ?? null,
    () => null,
  );
}
