import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { ProjectArt, type ArtVariant } from "@/redesign/shared/ProjectArt";
import { ThemeIcon, ThemeToggle } from "@/redesign/shared/ThemeToggle";
import { offices, site, type Work } from "@/redesign/content";
import { MenuToggle, NavLinks } from "./Client";
import s from "./v12.module.css";

export const BASE = "/v12";

const NAV = [
  { href: `${BASE}/work`, label: "Work" },
  { href: `${BASE}/services`, label: "Services" },
  { href: `${BASE}/about`, label: "About" },
  { href: `${BASE}/insights`, label: "Insights" },
  { href: `${BASE}/careers`, label: "Careers" },
];

const MOBILE = [...NAV, { href: `${BASE}/faq`, label: "FAQ" }, { href: `${BASE}/contact`, label: "Contact" }];

/** The italic accent voice: a word or two set in Cormorant Garamond. */
export function Em({ children }: { children: ReactNode }) {
  return <em className={s.em}>{children}</em>;
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
          <Link href={`${BASE}/contact`} className={`${s.pill} ${s.headerCta}`}>
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </Link>
          <MenuToggle links={MOBILE} />
        </div>
      </div>
    </header>
  );
}

/** Page opening shared by the inner pages: label, big title with an italic turn, lead. */
export function PageHead({ label, title, lead, children }: { label: ReactNode; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className={`${s.wrap} ${s.pageHead}`}>
      <p className={s.kicker}>{label}</p>
      <h1 className={s.pageTitle}>{title}</h1>
      {lead && <p className={s.pageLead}>{lead}</p>}
      {children}
    </section>
  );
}

const VARIANTS: ArtVariant[] = ["contour", "rings", "halftone"];

/**
 * A work card: two tilted art "mockups" on a stage that straighten and scale up on hover.
 * Frame colours are theme tokens, so the cards re-ink with the theme.
 */
export function WorkCard({ work, index, size = "md" }: { work: Work; index: number; size?: "md" | "lg" }) {
  const a = VARIANTS[index % VARIANTS.length];
  const b = VARIANTS[(index + 1) % VARIANTS.length];
  return (
    <Link href={`${BASE}/work/${work.slug}`} className={s.card} data-size={size} data-cursor="view">
      <div className={s.stage2}>
        <div className={`${s.frame} ${s.frameBack}`}>
          <ProjectArt slug={work.slug} label={work.client} variant={a} ink="var(--art-a-ink)" paper="var(--art-a-paper)" ratio={1.25} frame={1} />
        </div>
        <div className={`${s.frame} ${s.frameFront}`}>
          <ProjectArt slug={work.slug} label={work.client} variant={b} ink="var(--art-b-ink)" paper="var(--art-b-paper)" ratio={1.25} />
        </div>
      </div>
      <div className={s.cardMeta}>
        <h3 className={s.cardTitle}>{work.title}</h3>
        <span className={s.cardCat}>
          {work.category} · {work.year}
        </span>
        <p className={s.cardStat}>
          <b>{work.stats[0].value}</b> {work.stats[0].label.toLowerCase()}
        </p>
      </div>
    </Link>
  );
}

/** The same project as a dense hairline row, for the list view. */
export function WorkRow({ work, index }: { work: Work; index: number }) {
  return (
    <Link href={`${BASE}/work/${work.slug}`} className={s.workRow} data-cursor="view">
      <span className={s.serviceNum}>{String(index + 1).padStart(2, "0")}</span>
      <span className={s.workRowArt}>
        <ProjectArt slug={work.slug} label={work.client} variant={VARIANTS[index % 3]} ink="var(--art-a-ink)" paper="var(--art-a-paper)" ratio={1.25} />
      </span>
      <span className={s.workRowTitle}>{work.title}</span>
      <span className={s.workRowCat}>
        {work.category} · {work.year}
      </span>
      <span className={s.workRowStat}>
        <b>{work.stats[0].value}</b> {work.stats[0].label.toLowerCase()}
      </span>
      <span className={s.serviceArrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}

/**
 * A generative stand-in for a portrait: rings seeded by the person's name. It is labelled
 * as artwork, not a photo, wherever it appears large.
 */
export function Portrait({ slug, name, title }: { slug: string; name: string; title?: string }) {
  return (
    <span className={s.portrait}>
      <ProjectArt slug={`person-${slug}`} label={name} variant="rings" ink="var(--ink)" paper="var(--paper-2)" ratio={0.8} title={title} />
      <span className={s.monogram} aria-hidden="true">
        {name
          .split(" ")
          .map((p) => p[0])
          .join("")}
      </span>
    </span>
  );
}

const SITEMAP = [
  {
    label: "Explore",
    links: [
      { href: `${BASE}/work`, label: "Work" },
      { href: `${BASE}/services`, label: "Services" },
      { href: `${BASE}/about`, label: "About" },
      { href: `${BASE}/insights`, label: "Insights" },
    ],
  },
  {
    label: "Studio",
    links: [
      { href: `${BASE}/careers`, label: "Careers" },
      { href: `${BASE}/faq`, label: "FAQ" },
      { href: `${BASE}/contact`, label: "Contact" },
      { href: `${BASE}/privacy`, label: "Privacy" },
      { href: `${BASE}/terms`, label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`${s.wrap} ${s.footCols}`}>
        <div>
          <p className={s.footLead}>
            Design, software, automation, data and machine learning — <Em>under one roof</Em> in Dhaka.
          </p>
          <p className={s.footMail}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        {SITEMAP.map((col) => (
          <div key={col.label}>
            <small className={s.label}>{col.label}</small>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <small className={s.label}>Where</small>
          <ul>
            {offices.map((o) => (
              <li key={o.label}>
                <b>{o.label}</b> — {o.lines.join(", ")}
              </li>
            ))}
            <li>
              <Link href="/">All prototypes ↗</Link>
            </li>
            <li>© {new Date().getFullYear()} DotGrey Digital</li>
          </ul>
        </div>
      </div>
      <div className={s.giant} aria-hidden="true">
        dotgrey
      </div>
    </footer>
  );
}
