import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES } from "@/lib/theme";

/**
 * Runs before first paint and stamps `data-theme` on <html>, so there is no flash and the
 * server markup and the client agree. The theme store reads the attribute this sets — it
 * must never assume DEFAULT_THEME on its own.
 */
export function ThemeScript() {
  const source = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var ok=${JSON.stringify(
    THEMES,
  )};if(ok.indexOf(t)===-1){t=${JSON.stringify(DEFAULT_THEME)};}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme',${JSON.stringify(
    DEFAULT_THEME,
  )});}})();`;

  return <script dangerouslySetInnerHTML={{ __html: source }} />;
}
