import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { ThemeIcon, ThemeToggle } from "@/redesign/shared/ThemeToggle";
import { offices, site } from "@/redesign/content";
import { DhakaTime, MenuToggle, NavLinks, Reveal, type NavLink } from "./Client";
import { Newsletter } from "./More";
import { V13_MAP, V13_MOBILE } from "./nav";
import s from "./v13.module.css";

export const BASE = "/v13";

const NAV: NavLink[] = [
  { href: `${BASE}/work`, label: "Work", id: "work" },
  { href: `${BASE}/services`, label: "Services", id: "services" },
  { href: `${BASE}/process`, label: "Process", id: "process" },
  { href: `${BASE}/about`, label: "About", id: "about" },
  { href: `${BASE}/insights`, label: "Insights", id: "insights" },
];

const MOBILE = V13_MOBILE;

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
      <Reveal id={id} className={s.chapterTitle} text={title} />
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
          <Link href={`${BASE}/start`} className={`${s.pill} ${s.headerCta}`} data-magnetic>
            Start a project <span aria-hidden="true">↗</span>
          </Link>
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
            <Link href={`${BASE}/start`} className={s.pillInk} data-magnetic>
              Start a project <span aria-hidden="true">↗</span>
            </Link>
            <Link href={`${BASE}/work`} className={s.pill} data-magnetic>
              See the work
            </Link>
          </div>
          <div className={s.footNews}>
            <Newsletter email={site.email} id="v13-news-foot" />
          </div>
        </div>

        <div className={s.footMap}>
          {V13_MAP.map((col) => (
            <nav key={col.label} aria-label={col.label}>
              <p className={s.label}>{col.label}</p>
              <ul className={s.footList}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={s.footGrid}>
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

      {/* V12's sign-off under V8's: the name, set as wide as the page. */}
      <p className={s.giant} aria-hidden="true">
        dotgrey
      </p>

      <div className={`${s.wrap} ${s.footBar}`}>
        <span>© {new Date().getFullYear()} DotGrey Digital</span>
        <span>Design · Software · Automation · Data · ML</span>
      </div>
    </footer>
  );
}
