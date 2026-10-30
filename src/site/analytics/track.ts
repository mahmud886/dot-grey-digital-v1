import { GA_ID } from "./config";
import { getChoice } from "./consent";

type Params = Record<string, string | number | boolean>;
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

/** Keeps event parameters small and primitive. Never pass names, emails or message text. */
function clean(params: Params = {}): Params {
  const out: Params = {};
  for (const [k, v] of Object.entries(params)) out[k] = typeof v === "string" ? v.slice(0, 100) : v;
  return out;
}

/** Sends a GA4 event. Does nothing unless analytics is configured and the visitor accepted. */
export function track(name: string, params?: Params) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag || getChoice() !== "granted") return;
  window.gtag("event", name, clean(params));
}

export function pageView(path: string) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag || getChoice() !== "granted") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: location.href,
    page_title: document.title,
  });
}

/** Form outcomes, mapped to GA4's recommended events. */
export function trackForm(kind: "brief" | "start" | "apply" | "newsletter") {
  if (kind === "newsletter") return track("sign_up", { method: "newsletter" });
  track("generate_lead", { form: kind === "brief" ? "contact" : kind === "apply" ? "careers" : "start" });
}
