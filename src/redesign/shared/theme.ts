/**
 * Light/dark theme and accent for the prototypes.
 *
 * The choice lives in cookies rather than localStorage so a server or edge function can read
 * it later, but pages stay static: a tiny script in <head> reads the cookies and stamps
 * `data-theme` / `data-accent` on <html> before first paint. With no cookie, the visitor's
 * system setting decides.
 */
export const THEME_COOKIE = "dg-theme";
export const ACCENT_COOKIE = "dg-accent";

export type Theme = "light" | "dark";

/** "mono" means no accent: each design falls back to its own ink colour. */
export const ACCENTS = [
  { id: "mono", label: "Mono", swatch: "linear-gradient(135deg, #111 50%, #f2f2f0 50%)" },
  { id: "orange", label: "Orange", swatch: "#ff5a1f" },
  { id: "blue", label: "Blue", swatch: "#2f5bff" },
  { id: "lime", label: "Lime", swatch: "#c6f432" },
  { id: "violet", label: "Violet", swatch: "#7a4dff" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];

const YEAR = 60 * 60 * 24 * 365;

export function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${YEAR}; samesite=lax`;
}

/** Inline, pre-paint. Kept as a string so it can run before React exists. */
export const themeBootScript = `(function(){try{var d=document.documentElement;var m=function(n){var r=document.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return r?r[1]:null};var t=m(${JSON.stringify(
  THEME_COOKIE,
)});if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t);var a=m(${JSON.stringify(
  ACCENT_COOKIE,
)});d.setAttribute('data-accent',${JSON.stringify(ACCENTS.map((a) => a.id))}.indexOf(a)>-1?a:'mono')}catch(e){}})();`;
