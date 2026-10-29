import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { ThemeIcon, ThemeToggle } from "@/redesign/shared/ThemeToggle";
import { offices, site } from "@/redesign/content";
import { DhakaTime, MenuToggle, NavLinks, type NavLink } from "./Client";
import s from "./v13.module.css";

export const BASE = "/v13";

/**
 * Phase 1 is one long homepage plus case studies, so the navigation points at its sections.
 * Each becomes a page of its own in phase 2.
 */
const NAV: NavLink[] = [
  { href: `${BASE}#work`, label: "Work", id: "work" },
  { href: `${BASE}#services`, label: "Services", id: "services" },
  { href: `${BASE}#process`, label: "Process", id: "process" },
  { href: `${BASE}#about`, label: "About", id: "about" },
  { href: `${BASE}#insights`, label: "Insights", id: "insights" },
];

const MOBILE = [...NAV.map(({ href, label }) => ({ href, label })), { href: "#start", label: "Start a project" }];

/** The accent marks the full stop at the end of a headline — "Hello." — and nothing louder. */
export function Stop({ children }: { children: string }) {
  const last = children.slice(-1);
  if (!".?!".includes(last)) return <>{children}</>;
  return (
    <>
      {children.slice(0, -1)}
      <span className={s.stop}>{last}</span>
    </>
  );
}

/** The italic voice: a word or two in Cormorant Garamond. */
export function Em({ children }: { children: ReactNode }) {
  return <em className={s.em}>{children}</em>;
}

export function SecHead({ id, title, note }: { id?: string; title: string; note?: ReactNode }) {
  return (
    <div className={s.secHead}>
      <h2 id={id} className={s.chapterTitle}>
        <Stop>{title}</Stop>
      </h2>
      {note && <p className={s.secNote}>{note}</p>}
    </div>
  );
}

export function Header() {
  return (
    <header className={s.header}>
      <div className={`${s.wrap} ${s.headerInner}`}>
        <div className={s.brand}>
          <BrandMark href={BASE} ink="var(--ink)" accent="var(--grey)" className={s.logo} />
          <span className={s.tagline}>Independent. Technical. Kind.</span>
        </div>
        <nav className={s.nav} aria-label="Main">
          <NavLinks links={NAV} />
        </nav>
        <div className={s.headerEnd}>
          <ThemeToggle className={s.themeBtn}>
            <ThemeIcon />
          </ThemeToggle>
          <a href="#start" className={`${s.pill} ${s.headerCta}`}>
            Start a project <span aria-hidden="true">↗</span>
          </a>
          <MenuToggle links={MOBILE} />
        </div>
      </div>
    </header>
  );
}

/**
 * The closing chapter on every page: the way in (#start), the essentials, and a giant
 * italic sign-off — "Bye." on the homepage, "Done." after a case study.
 */
export function Footer({ signoff = "Bye." }: { signoff?: string }) {
  return (
    <footer id="start" className={`${s.chapter} ${s.footer}`} aria-labelledby="start-title">
      <div className={s.wrap}>
        <div className={s.footLead}>
          <h2 id="start-title" className={s.footKicker}>
            <Stop>Start a project.</Stop>
          </h2>
          <p className={s.footNote}>Got a product, a process or a pile of data? Tell us what you are trying to do — we reply within a working day.</p>
          <a href={`mailto:${site.email}?subject=${encodeURIComponent("New project")}`} className={s.footMail}>
            {site.email}
          </a>
          <div className={s.footCtas}>
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("New project")}`} className={s.pillInk}>
              Write to us <span aria-hidden="true">↗</span>
            </a>
            <Link href={`${BASE}#work`} className={s.pill}>
              See the work
            </Link>
          </div>
        </div>

        <div className={s.footGrid}>
          <nav aria-label="Footer">
            <p className={s.label}>Studio</p>
            <ul className={s.footList}>
              {NAV.map((l) => (
                <li key={l.id}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          {offices.map((o) => (
            <div key={o.label}>
              <p className={s.label}>{o.label}</p>
              <p className={s.footText}>{o.lines.join(", ")}</p>
            </div>
          ))}
          <div>
            <p className={s.label}>Right now</p>
            <p className={s.footText}>
              <DhakaTime /> in Dhaka
            </p>
            <ThemeToggle className={s.themeBtn}>
              <ThemeIcon />
              <span className={s.modeLabel}>Colour mode</span>
            </ThemeToggle>
          </div>
        </div>
      </div>

      <p className={s.bye} aria-hidden="true" style={{ ["--len" as string]: signoff.length }}>
        <Stop>{signoff}</Stop>
      </p>

      <div className={`${s.wrap} ${s.footBar}`}>
        <span>© {new Date().getFullYear()} DotGrey Digital</span>
        <span>Design · Software · Automation · Data · ML</span>
      </div>
    </footer>
  );
}
