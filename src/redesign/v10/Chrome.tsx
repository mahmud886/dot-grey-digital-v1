import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { disciplines, offices, site } from "@/redesign/content";
import { DhakaTime, Field, MobileMenu, NavLinks, ThemePill } from "./Client";
import type { FormationId } from "./formations";
import s from "./v10.module.css";

/** Top HUD: logo left, the nav pill and theme pill right. Fixed on every v10 page. */
export function Header() {
  return (
    <header className={s.top}>
      <BrandMark href="/v10" ink="var(--fg)" accent="var(--mute)" className={s.logo} />
      <div className={s.topRight}>
        <nav className={s.pill} aria-label="Main">
          <NavLinks />
        </nav>
        <ThemePill className={s.themeTop} />
        <MobileMenu />
      </div>
    </header>
  );
}

/** Footer as a HUD readout: four columns of links and live studio time. */
export function Footer() {
  const [dhaka, remote] = offices;
  return (
    <footer className={s.footer}>
      <div className={s.footGrid}>
        <div>
          <p className={s.label}>Index</p>
          <ul>
            <li>
              <Link href="/v10/work">Work</Link>
            </li>
            <li>
              <Link href="/v10/services">Services</Link>
            </li>
            <li>
              <Link href="/v10/about">About</Link>
            </li>
            <li>
              <Link href="/v10/insights">Insights</Link>
            </li>
            <li>
              <Link href="/v10/careers">Careers</Link>
            </li>
            <li>
              <Link href="/v10/faq">FAQ</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className={s.label}>Services</p>
          <ul>
            {disciplines.map((d) => (
              <li key={d.id}>
                <Link href={`/v10/services/${d.id}`}>{d.short}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={s.label}>Studio</p>
          <ul>
            <li>{dhaka.lines.join(", ")}</li>
            <li>
              <DhakaTime /> in Dhaka
            </li>
            <li>{remote.lines.join(" ")}</li>
          </ul>
        </div>
        <div>
          <p className={s.label}>Signal</p>
          <ul>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>{site.phone}</li>
            <li>
              <Link href="/v10/contact">Start a project</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={s.footBar}>
        <span>© {new Date().getFullYear()} DotGrey Digital</span>
        <Link href="/v10/privacy">Privacy</Link>
        <Link href="/v10/terms">Terms</Link>
        <Link href="/">All prototypes</Link>
      </div>
    </footer>
  );
}

/** A dot-matrix title sized to fit its own length, with a trailing accent mark. */
export function Big({ text, mark = ".", as: Tag = "h1", className, max = 9, id }: { text: string; mark?: string; as?: "h1" | "h2"; className?: string; max?: number; id?: string }) {
  const style = { "--len": Math.max(text.length + mark.length, 5), "--max": `${max}rem` } as CSSProperties;
  return (
    <Tag id={id} className={`${s.big} ${className ?? ""}`} style={style}>
      {text}
      {mark && <span className={s.acc}>{mark}</span>}
    </Tag>
  );
}

/** Inner-page hero: system kicker, dot-matrix title, lede, and a quiet particle field. */
export function PageHero({
  kicker,
  title,
  long,
  lede,
  form = "dust",
  side = "right",
  children,
}: {
  kicker: ReactNode;
  title: string;
  /** Long titles (articles, jobs) wrap at a fixed size instead of fitting one line. */
  long?: boolean;
  lede?: ReactNode;
  form?: FormationId;
  side?: "right" | "center";
  children?: ReactNode;
}) {
  return (
    <section className={s.pageHero} data-side={side}>
      <Field form={form} side={side} />
      <div className={s.pageHeroText}>
        <p className={s.kicker}>{kicker}</p>
        {long ? (
          <h1 className={s.longTitle}>
            {title}
            <span className={s.acc}>.</span>
          </h1>
        ) : (
          <Big text={title} />
        )}
        {lede && <p className={s.lede}>{lede}</p>}
        {children}
      </div>
    </section>
  );
}

/** Standard inner page: hero, content, footer. */
export function Page({ children }: { children: ReactNode }) {
  return (
    <>
      <main className={s.page}>{children}</main>
      <div className={s.pageFoot}>
        <Footer />
      </div>
    </>
  );
}

export function SecHead({ id, title, note }: { id: string; title: string; note?: ReactNode }) {
  return (
    <div className={s.secHead}>
      <Big as="h2" id={id} text={title} max={6} className={s.secBig} />
      {note && <p className={s.secNote}>{note}</p>}
    </div>
  );
}
