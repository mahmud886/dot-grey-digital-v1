import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { ProjectArt, type ArtVariant } from "@/redesign/shared/ProjectArt";
import { disciplines, offices, site, type Work } from "@/redesign/content";
import { MenuToggle } from "./Client";
import s from "./v12.module.css";

const LINKS = [
  { href: "/v12#services", label: "Services" },
  { href: "/v12#work", label: "Work" },
  { href: "/v12#process", label: "Process" },
  { href: "/v12#contact", label: "Contact" },
];

/** The italic accent voice: a word or two set in Cormorant Garamond. */
export function Em({ children }: { children: ReactNode }) {
  return <em className={s.em}>{children}</em>;
}

export function Header() {
  return (
    <header className={s.header}>
      <div className={`${s.wrap} ${s.headerInner}`}>
        <div className={s.brand}>
          <BrandMark href="/v12" ink="#111111" accent="#7a7a76" className={s.logo} />
          <span className={s.tagline}>Independent. Technical. Kind.</span>
        </div>
        <nav className={s.nav} aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/v12#contact" className={`${s.pill} ${s.headerCta}`}>
          Let&apos;s talk <span aria-hidden="true">↗</span>
        </Link>
        <MenuToggle links={[...LINKS, { href: `mailto:${site.email}`, label: "Email us" }]} />
      </div>
    </header>
  );
}

const VARIANTS: ArtVariant[] = ["contour", "rings", "halftone"];

/**
 * A work card: two tilted art "mockups" on a stage that straighten and scale up on hover.
 * The whole card is one link; the cursor turns into a VIEW badge over it.
 */
export function WorkCard({ work, index, size = "md" }: { work: Work; index: number; size?: "md" | "lg" }) {
  const a = VARIANTS[index % VARIANTS.length];
  const b = VARIANTS[(index + 1) % VARIANTS.length];
  return (
    <Link href={`/v12/work/${work.slug}`} className={s.card} data-size={size} data-cursor="view">
      <div className={s.stage2}>
        <div className={`${s.frame} ${s.frameBack}`}>
          <ProjectArt slug={work.slug} label={work.client} variant={a} ink="#111111" paper="#f6f5f1" ratio={1.25} frame={1} />
        </div>
        <div className={`${s.frame} ${s.frameFront}`}>
          <ProjectArt slug={work.slug} label={work.client} variant={b} ink="#eeede9" paper="#111111" ratio={1.25} />
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

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`${s.wrap} ${s.footCols}`}>
        <div>
          <p className={s.footLead}>
            Design, software, automation, data and machine learning — <Em>under one roof</Em> in Dhaka.
          </p>
        </div>
        <div>
          <small className={s.label}>Crafts</small>
          <ul>
            {disciplines.map((d) => (
              <li key={d.id}>{d.short}</li>
            ))}
          </ul>
        </div>
        <div>
          <small className={s.label}>Studio</small>
          <ul>
            {offices.map((o) => (
              <li key={o.label}>
                <b>{o.label}</b> — {o.lines.join(", ")}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <small className={s.label}>Say hello</small>
          <ul>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
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
