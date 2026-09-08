export const THEMES = ["dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

/** Dark-first: the design's native look is dark, so that is what a first visit gets. */
export const DEFAULT_THEME: Theme = "dark";
export const THEME_STORAGE_KEY = "dotgrey-theme";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}
