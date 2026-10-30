/**
 * Google Analytics is off unless a GA4 Measurement ID is set at build time:
 *
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 *
 * With no (or a malformed) ID nothing in src/site/analytics renders or runs: no banner,
 * no script, no dataLayer. The value is baked into the bundle, so rebuild after changing
 * it. See ANALYTICS.md.
 */
const raw = (process.env.NEXT_PUBLIC_GA_ID ?? "").trim();

export const GA_ID = /^G-[A-Z0-9]{4,}$/.test(raw) ? raw : "";
export const CONSENT_COOKIE = "dg-consent";
