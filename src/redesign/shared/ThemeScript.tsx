import { themeBootScript } from "./theme";

/** Stamps data-theme and data-accent on <html> before first paint, so there is no flash. */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />;
}
