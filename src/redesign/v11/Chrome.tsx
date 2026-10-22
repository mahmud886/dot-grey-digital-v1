import Link from "next/link";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { disciplines, offices, site } from "@/redesign/content";
import { SITE_MAP } from "./agency-extra";
import { Header as ClientHeader, LiveTime, ThemeText } from "./Client";
import { Newsletter } from "./More";
import s from "./v11.module.css";

export function Header() {
  return <ClientHeader items={disciplines.map(({ id, number, title, line }) => ({ id, number, title, line }))} />;
}

/** Section title with a "(06)" style counter, Basic-style. */
export function SectionHead({ title, count, children, id }: { title: string; count?: number; children?: React.ReactNode; id?: string }) {
  return (
    <div className={s.sectionHead}>
      <h2 id={id} className={s.h2}>
        {title}
        {count !== undefined && <span className={s.count}>({String(count).padStart(2, "0")})</span>}
      </h2>
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer id="contact" className={s.footer}>
      <Link href="/v11/start" className={s.cta}>
        <span>Got a project?</span>{" "}
        <span className={s.ctaLine}>
          <span className={s.dot} aria-hidden="true">
            ●
          </span>{" "}
          Let&apos;s talk.
        </span>
      </Link>

      <div className={s.footGrid}>
        <div>
          <span className={s.label}>New business</span>
          <a href={`mailto:${site.email}`} className={s.footLink}>
            {site.email}
          </a>
        </div>
        {offices.map((o) => (
          <div key={o.label}>
            <span className={s.label}>{o.label}</span>
            <p>
              {o.lines.map((l) => (
                <span key={l}>
                  {l}
                  <br />
                </span>
              ))}
            </p>
            {o.label === "Dhaka" ? (
              <p className={s.clock}>
                <LiveTime tz="Asia/Dhaka" /> <span className={s.muted}>GMT+6</span>
              </p>
            ) : (
              <p className={s.clock}>
                4 <span className={s.muted}>time zones</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className={s.footMap}>
        {SITE_MAP.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <span className={s.label}>{g.title}</span>
            <ul className={s.footNav}>
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className={s.footNews}>
          <Newsletter email={site.email} id="nl-foot" />
          <ThemeText className={s.footTheme} />
        </div>
      </div>

      <div className={s.footMark}>
        <BrandMark href="/v11" ink="var(--art-d-ink)" accent="#7a7a78" className={s.footLogo} />
      </div>
      <div className={s.footBase}>
        <span>
          ©26 DotGrey® ● <Link href="/v11/privacy">Privacy</Link> ● <Link href="/v11/terms">Terms</Link> ● <Link href="/">All prototypes</Link>
        </span>
        <span>Design ● Software ● Automation ● Data ● ML</span>
        <span>Since {site.founded}</span>
      </div>
    </footer>
  );
}

/** The ● device inside headlines; takes the accent colour. */
export function Dot() {
  return (
    <span className={s.dot} aria-hidden="true">
      ●
    </span>
  );
}

/** Splits a headline on "●" and sets each one as the accent dot. */
export function Dotted({ text }: { text: string }) {
  const parts = text.split("●");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <Dot />}
        </span>
      ))}
    </>
  );
}

/** Inner-page opener: label, giant uppercase headline (with ● support), lede and an optional counter. */
export function PageHead({ label, title, lede, count, children }: { label: string; title: string; lede?: string; count?: number; children?: React.ReactNode }) {
  return (
    <section className={s.pageHead}>
      <p className={s.label}>{label}</p>
      <h1 className={s.pageTitle}>
        <Dotted text={title} />
        {count !== undefined && <span className={s.count}>({String(count).padStart(2, "0")})</span>}
      </h1>
      {(lede || children) && (
        <div className={s.pageHeadFoot}>
          {lede && <p className={s.lede}>{lede}</p>}
          {children}
        </div>
      )}
    </section>
  );
}

/** Breadcrumb-ish back link in the V11 label style. */
export function Crumb({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={s.crumb}>
      <span aria-hidden="true">←</span> {children}
    </Link>
  );
}
