import Link from "next/link";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { ThemeToggle } from "@/redesign/shared/ThemeToggle";
import { disciplines, offices, site } from "@/redesign/content";
import { DhakaTime, MobileMenu } from "./Client";
import { G } from "./Glyphs";
import s from "./v9.module.css";

export const LINKS = [
  { href: "/v9/work", label: "Work" },
  { href: "/v9/services", label: "Services" },
  { href: "/v9/about", label: "About" },
  { href: "/v9/insights", label: "Insights" },
  { href: "/v9/careers", label: "Careers" },
  { href: "/v9/contact", label: "Contact" },
];

/** "◐ Dark" / "◐ Light" — both labels render, CSS shows the one that applies. */
export function ThemeLabel() {
  return (
    <>
      <G name="ring" className={s.themeGlyph} />
      <span className={s.toDark}>Dark</span>
      <span className={s.toLight}>Light</span>
    </>
  );
}

/**
 * Fixed header in difference blend, so it reads on paper and on the contrast chapters. The
 * mobile menu sits outside it: a blended parent would blend the overlay too.
 */
export function Header() {
  return (
    <>
      <header className={s.header}>
        <BrandMark href="/v9" ink="#ffffff" accent="#8c8c8c" className={s.logo} />
        <p className={s.headerTag}>
          Design, software <G name="asterisk" /> intelligence
        </p>
        <div className={s.headerEnd}>
          <nav aria-label="Main" className={s.nav}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle className={s.themeBtn}>
            <ThemeLabel />
          </ThemeToggle>
        </div>
      </header>
      <MobileMenu links={LINKS} />
    </>
  );
}

/** "(01) Selected work ———— 2023—2025" */
export function SectionHead({ n, title, aside, dark }: { n: string; title: string; aside?: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`${s.sectionHead} ${dark ? s.sectionHeadDark : ""}`}>
      <span>({n})</span>
      <h2 className={s.sectionTitle}>{title}</h2>
      <span className={s.sectionAside}>{aside}</span>
    </div>
  );
}

/**
 * The top of every inner page: a meta line, a giant Gloock title (which may carry glyphs)
 * and a short lede, with optional extras underneath.
 */
export function PageHead({
  crumb,
  meta,
  title,
  lede,
  children,
}: {
  crumb: { href: string; label: string };
  meta?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className={s.caseHero}>
      <p className={s.heroMeta}>
        <Link href={crumb.href} className={s.back}>
          <G name="arrow" className={s.flipArrow} /> {crumb.label}
        </Link>
        <span>{meta}</span>
        <span className={s.heroMetaEnd}>
          Dhaka <DhakaTime />
        </span>
      </p>
      <h1 className={s.pageTitle}>{title}</h1>
      {(lede || children) && (
        <div className={s.pageIntro}>
          {lede && <p className={s.caseSummary}>{lede}</p>}
          {children}
        </div>
      )}
    </section>
  );
}

export function Footer() {
  const [dhaka, remote] = offices;
  return (
    <footer className={s.footer} id="contact">
      <div className={s.wrap}>
        <Link href="/v9/contact" className={s.footCta}>
          <span className={s.footCtaKicker}>(Contact) New business, any size</span>
          <span className={s.footCtaLine}>
            Start a project <G name="arrow" />
          </span>
        </Link>

        <p className={s.address}>
          <G name="diamond" /> {dhaka.lines[0]} <G name="asterisk" /> {dhaka.lines[1]} <G name="dot" /> {remote.lines.join(" ")}{" "}
          <G name="wave" /> <a href={`mailto:${site.email}`}>{site.email}</a> <G name="plus" /> {site.phone}
        </p>

        <div className={s.footCols}>
          <div>
            <h3 className={s.footHead}>Studio</h3>
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/v9/faq">FAQ</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className={s.footHead}>Services</h3>
            <ul>
              {disciplines.map((d) => (
                <li key={d.id}>
                  <Link href={`/v9/services/${d.id}`}>{d.short}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={s.footHead}>Contact</h3>
            <ul>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>{site.phone}</li>
              <li>
                Dhaka <DhakaTime />
              </li>
            </ul>
          </div>
          <div>
            <h3 className={s.footHead}>Prototype</h3>
            <ul>
              <li>V9 — Index</li>
              <li>
                <Link href="/">All versions</Link>
              </li>
              <li>
                <Link href="/v9/privacy">Privacy</Link> <G name="slash" /> <Link href="/v9/terms">Terms</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className={s.footMark} aria-hidden="true">
        DotGrey
        <G name="asterisk" />
      </p>
      <div className={`${s.wrap} ${s.footBase}`}>
        <span>© 2019—{new Date().getFullYear()} DotGrey Digital</span>
        <span>Digital-first design ◇ Dhaka</span>
      </div>
    </footer>
  );
}
