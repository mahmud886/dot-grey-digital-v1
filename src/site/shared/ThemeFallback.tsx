"use client";

import { useEffect } from "react";
import { ACCENT_COOKIE, ACCENTS, THEME_COOKIE } from "./theme";

const read = (name: string) => document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? null;

/**
 * Error and not-found pages are rendered on the client inside Next's error shell, where the
 * inline pre-paint script never runs. This applies the same choice once React mounts, and
 * does nothing when the script already did its job.
 */
export function ThemeFallback() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.theme) return;
    const t = read(THEME_COOKIE);
    root.dataset.theme = t === "light" || t === "dark" ? t : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const a = read(ACCENT_COOKIE);
    root.dataset.accent = ACCENTS.some((x) => x.id === a) ? (a as string) : "mono";
  }, []);
  return null;
}
