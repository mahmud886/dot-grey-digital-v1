import { themeBootScript } from "./theme";
import { ThemeFallback } from "./ThemeFallback";

/** Stamps data-theme and data-accent on <html> before first paint, so there is no flash. */
export function ThemeScript() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      <ThemeFallback />
    </>
  );
}
