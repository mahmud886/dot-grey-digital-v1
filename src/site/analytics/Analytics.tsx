"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import s from "@/site/site.module.css";
import { GA_ID } from "./config";
import { closeBanner, deleteGaCookies, getBannerOpen, getChoice, openBanner, privacySignal, setChoice, subscribe, type Choice } from "./consent";
import { pageView, track } from "./track";

/** Stored choice, "server" while hydrating (so the first paint never differs from the server's). */
export function useChoice(): Choice | "server" {
  return useSyncExternalStore(subscribe, getChoice, () => "server" as const);
}

function useBannerOpen() {
  return useSyncExternalStore(subscribe, getBannerOpen, () => false);
}

/**
 * Everything analytics, mounted once in the site layout: the consent banner, the GA4 loader
 * (only after "Accept"), page views on client-side navigation, and the delegated listeners
 * for call-to-action clicks and FAQ opens. Renders nothing without a Measurement ID.
 */
export function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Banner />
      <Loader />
      <PageViews />
      <Listeners />
    </>
  );
}

/* ------------------------------------------------------------------ banner */

function Banner() {
  const choice = useChoice();
  const open = useBannerOpen();
  const [idle, setIdle] = useState(false);
  const accept = useRef<HTMLButtonElement>(null);

  // Wait until the page has settled, so the banner never competes with the first paint.
  useEffect(() => {
    const t = window.setTimeout(() => setIdle(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  // A visitor who has said nothing, and whose browser has not sent an opt-out signal,
  // is asked once. An opt-out signal counts as "no": nothing loads, nothing is asked.
  const ask = choice === null && idle && !privacySignal();
  const show = ask || open;

  useEffect(() => {
    const el = accept.current;
    // The banner is only "open" because the visitor pressed Cookie settings, so focus may move.
    if (open && el) el.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && getBannerOpen() && getChoice() !== null) closeBanner();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!show || choice === "server") return null;
  const current = choice === "granted" ? "You have accepted analytics." : choice === "denied" ? "You have declined analytics." : null;

  return (
    <section className={s.consent} aria-labelledby="consent-title" aria-describedby="consent-text" data-consent-banner>
      <h2 id="consent-title" className={s.consentTitle}>
        Cookies
      </h2>
      <p id="consent-text" className={s.consentText}>
        We would like to use Google Analytics to see which pages are read, with no advertising and no profiling. It only runs if you accept.{" "}
        <a href="/cookies">Cookie details</a>
        {current ? <> · {current}</> : null}
      </p>
      <div className={s.consentActions}>
        <button type="button" className={s.consentBtn} onClick={() => setChoice("denied")}>
          Decline
        </button>
        <button type="button" className={s.consentBtn} onClick={() => setChoice("granted")} ref={accept}>
          Accept
        </button>
      </div>
    </section>
  );
}

/** Footer / cookies-page button that reopens the banner. Renders nothing without an ID. */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!GA_ID) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={openBanner}
    >
      Cookie settings
    </button>
  );
}

/* ------------------------------------------------------------------ GA4 */

function Loader() {
  const choice = useChoice();
  const started = useRef(false);
  const granted = choice === "granted";

  useEffect(() => {
    const flag = `ga-disable-${GA_ID}` as const;
    if (!window.gtag) return;
    if (granted) {
      window[flag] = false;
      window.gtag("consent", "update", { analytics_storage: "granted" }); // ad signals stay denied
      if (!started.current) {
        started.current = true;
        window.gtag("js", new Date());
        window.gtag("config", GA_ID, {
          anonymize_ip: true,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
          send_page_view: false,
        });
      }
    } else if (choice !== "server") {
      window[flag] = true;
      window.gtag("consent", "update", { analytics_storage: "denied" });
      deleteGaCookies();
    }
  }, [granted, choice]);

  // Declined visitors never download gtag.js.
  return granted ? <Script id="ga-src" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" /> : null;
}

/** One page_view per route, after consent. The first load and each client-side navigation. */
function PageViews() {
  const pathname = usePathname();
  const granted = useChoice() === "granted";
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!granted) {
      last.current = null;
      return;
    }
    if (last.current === pathname) return;
    // After the commit, so document.title is the new page's.
    const t = window.setTimeout(() => {
      last.current = pathname;
      pageView(pathname);
    }, 0);
    return () => window.clearTimeout(t);
  }, [pathname, granted]);

  return null;
}

/** cta_click on any "Start a project" link, and faq_open on any <details>, wherever they are. */
function Listeners() {
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href="/start"], [data-cta]');
      if (!a) return;
      const label = (a.getAttribute("data-cta") || a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
      const where = a.closest("header") ? "header" : a.closest("footer") ? "footer" : `page:${location.pathname}`;
      track("cta_click", { label, location: where });
    };
    const toggle = (e: Event) => {
      const d = e.target as HTMLDetailsElement;
      if (d?.tagName !== "DETAILS" || !d.open) return;
      const index = d.parentElement ? Array.from(d.parentElement.children).indexOf(d) : 0;
      track("faq_open", { index, page: location.pathname });
    };
    document.addEventListener("click", click);
    document.addEventListener("toggle", toggle, true); // toggle does not bubble
    return () => {
      document.removeEventListener("click", click);
      document.removeEventListener("toggle", toggle, true);
    };
  }, []);
  return null;
}

/** Fires an event once per mount (and once consent is given), e.g. project_view on a case study. */
export function TrackView({ name, params }: { name: string; params?: Record<string, string | number | boolean> }) {
  const granted = useChoice() === "granted";
  const sent = useRef(false);
  const key = JSON.stringify(params ?? {});
  useEffect(() => {
    if (!granted || sent.current) return;
    sent.current = true;
    track(name, JSON.parse(key));
  }, [granted, name, key]);
  return null;
}
