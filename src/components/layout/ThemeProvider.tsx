"use client";

import { useCallback, useSyncExternalStore, type ReactNode } from "react";
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  setTheme as writeTheme,
  subscribeTheme,
} from "@/lib/theme-store";
import type { Theme } from "@/lib/theme";

/**
 * No context needed — the store is module-level, so any component can read the theme
 * without a provider boundary. Kept as a component so the root layout has one obvious
 * place to mount theme concerns later.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  const setTheme = useCallback((next: Theme) => writeTheme(next), []);
  const toggleTheme = useCallback(
    () => writeTheme(theme === "dark" ? "light" : "dark"),
    [theme],
  );

  return { theme, setTheme, toggleTheme };
}
