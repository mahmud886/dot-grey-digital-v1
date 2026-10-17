import Link from "next/link";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { offices, site } from "@/redesign/content";
import { DhakaTime, MobileMenu } from "./Client";
import { G } from "./Glyphs";
import s from "./v9.module.css";

const LINKS = [
  { href: "/v9#work", label: "Work" },
  { href: "/v9#services", label: "Services" },
  { href: "/v9#index", label: "Index" },
  { href: "/v9#contact", label: "Contact" },
];

/**
 * Fixed header in difference blend, so it reads on paper and on the black chapters. The
 * mobile menu sits outside it: a blended parent would blend the black overlay too.
 */
export function Header() {
  return (
    <>
      <header className={s.header}>
      <BrandMark href="/v9" ink="#ffffff" accent="#8c8c8c" className={s.logo} />
      <p className={s.headerTag}>
        Design, software <G name="asterisk" /> intelligence
      </p>
      <nav aria-label="Main" className={s.nav}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
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

export function Footer() {
  const [dhaka, remote] = offices;
  return (
    <footer className={s.footer} id="contact">
      <div className={s.wrap}>
        <a href={`mailto:${site.email}`} className={s.footCta}>
          <span className={s.footCtaKicker}>(Contact) New business, any size</span>
          <span className={s.footCtaLine}>
            Start a project <G name="arrow" />
          </span>
        </a>

        <p className={s.address}>
          <G name="diamond" /> {dhaka.lines[0]} <G name="asterisk" /> {dhaka.lines[1]} <G name="dot" /> {remote.lines.join(" ")}{" "}
          <G name="wave" /> <a href={`mailto:${site.email}`}>{site.email}</a> <G name="plus" /> {site.phone}
        </p>

        <div className={s.footCols}>
          <div>
            <h3 className={s.footHead}>Menu</h3>
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
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
                <Link href="/versions">All versions</Link>
              </li>
              <li>Not indexed by search engines</li>
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
