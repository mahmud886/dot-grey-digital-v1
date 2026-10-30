import { CONSENT_COOKIE, GA_ID } from "./config";

/**
 * Cookie consent state: a first-party cookie (`dg-consent` = granted | denied, one year)
 * plus a tiny store so the banner, the footer button and the GA loader stay in step.
 * Client-only; nothing here needs a server, so it works in the static (cPanel) export too.
 */
export type Choice = "granted" | "denied" | null;

const YEAR = 60 * 60 * 24 * 365;
const listeners = new Set<() => void>();
let bannerOpen = false;

const emit = () => listeners.forEach((l) => l());

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function readCookie(name: string) {
  return document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? null;
}

/** The stored choice, or null when the visitor has not decided. */
export function getChoice(): Choice {
  const v = readCookie(CONSENT_COOKIE);
  return v === "granted" || v === "denied" ? v : null;
}

export function getBannerOpen() {
  return bannerOpen;
}

export function setChoice(choice: "granted" | "denied") {
  document.cookie = `${CONSENT_COOKIE}=${choice}; path=/; max-age=${YEAR}; samesite=lax`;
  bannerOpen = false;
  emit();
}

/** Forgets the choice, so the banner asks again. */
export function clearChoice() {
  document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0; samesite=lax`;
  emit();
}

export function openBanner() {
  bannerOpen = true;
  emit();
}

export function closeBanner() {
  bannerOpen = false;
  emit();
}

/** Global Privacy Control or Do Not Track: an opt-out signal sent by the browser. */
export function privacySignal() {
  const n = navigator as Navigator & { globalPrivacyControl?: boolean };
  return n.globalPrivacyControl === true || n.doNotTrack === "1";
}

/** True only when analytics is configured AND the visitor said yes. */
export function analyticsAllowed() {
  return !!GA_ID && getChoice() === "granted";
}

/** Removes Google's cookies (`_ga`, `_ga_<ID>`, `_gid`, `_gat*`) from this host and its parents. */
export function deleteGaCookies() {
  const names = document.cookie
    .split("; ")
    .map((c) => c.split("=")[0])
    .filter((n) => n === "_ga" || n.startsWith("_ga_") || n === "_gid" || n.startsWith("_gat"));
  if (!names.length) return;
  const host = location.hostname;
  const parts = host.split(".");
  const domains = new Set<string>(["", host, `.${host}`]);
  for (let i = 1; i < parts.length - 1; i++) domains.add(`.${parts.slice(i).join(".")}`);
  for (const n of names) {
    for (const d of domains) document.cookie = `${n}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT${d ? `; domain=${d}` : ""}`;
  }
}
