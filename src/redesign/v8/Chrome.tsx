import Link from "next/link";
import type { ReactNode } from "react";
import type { LegalPage } from "@/data/legal";
import { disciplines, offices, site, type Work } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { variantFor } from "./art";
import { DhakaClock } from "./Client";
import s from "./v8.module.css";

export const BASE = "/v8";

/**
 * A headline in V8's grammar: short, ending on a full stop (or a question mark) that takes
 * the accent colour. Pass the words; the last character is split off and marked.
 */
export function Stop({ children }: { children: string }) {
  const last = children.slice(-1);
  if (last !== "." && last !== "?" && last !== "!") return <>{children}</>;
  return (
    <>
      {children.slice(0, -1)}
      <span className={s.stop}>{last}</span>
    </>
  );
}

/**
 * Every inner page opens the same way: a kicker, a giant two-or-three-word headline and,
 * optionally, a lead and something on the right.
 */
export function PageCover({ kicker, title, lead, aside, dark = false }: { kicker: ReactNode; title: string; lead?: ReactNode; aside?: ReactNode; dark?: boolean }) {
  return (
    <section className={`${s.cover} ${dark ? s.chapterDark : ""}`}>
      <p className={s.coverKicker}>{kicker}</p>
      <h1 className={s.coverTitle}>
        <Stop>{title}</Stop>
      </h1>
      {(lead || aside) && (
        <div className={s.coverFoot}>
          {lead ? <p className={s.coverLead}>{lead}</p> : <span />}
          {aside && <div className={s.coverAside}>{aside}</div>}
        </div>
      )}
    </section>
  );
}

/** Generated stand-in for a portrait (rings seeded by the name) with a monogram. Not a photo. */
export function Portrait({ slug, name, label = false }: { slug: string; name: string; label?: boolean }) {
  return (
    <span className={s.portrait}>
      <ProjectArt slug={`person-${slug}`} label={name} variant="rings" ink="var(--fg)" paper="var(--surface)" ratio={0.8} title={label ? `Generated artwork for ${name}, not a photo` : undefined} />
      <span className={s.monogram} aria-hidden="true">
        {name
          .split(" ")
          .map((p) => p[0])
          .join("")}
      </span>
    </span>
  );
}

/** Full-width row used by the work index's Stack view. */
export function WorkStackItem({ work, index }: { work: Work; index: number }) {
  return (
    <Link href={`${BASE}/work/${work.slug}`} className={s.stackItem}>
      <span className={s.stackArt}>
        <ProjectArt slug={work.slug} label={work.client} variant={variantFor(work.slug)} ink="var(--art-ink)" paper="var(--art-paper)" ratio={2.1} />
      </span>
      <span className={s.stackMeta}>
        <span className={s.cardKicker}>
          {String(index + 1).padStart(2, "0")} · {work.category} · {work.year}
        </span>
        <span className={s.stackTitle}>{work.title}</span>
        <span className={s.stackSummary}>{work.summary}</span>
        <span className={s.stackStat}>
          <b>{work.stats[0].value}</b>
          <span>{work.stats[0].label}</span>
        </span>
      </span>
    </Link>
  );
}

/** Compact card used by the Grid view, related work and the reel-less pages. */
export function WorkGridItem({ work, index }: { work: Work; index: number }) {
  return (
    <Link href={`${BASE}/work/${work.slug}`} className={s.gridItem}>
      <span className={s.cardArt}>
        <ProjectArt slug={work.slug} label={work.client} variant={variantFor(work.slug)} ink="var(--art-ink)" paper="var(--art-paper)" ratio={1.5} />
      </span>
      <span className={s.cardMeta}>
        <span>
          <span className={s.cardKicker}>
            {String(index + 1).padStart(2, "0")} · {work.category} · {work.year}
          </span>
          <span className={s.cardTitle}>{work.title}</span>
        </span>
        <span className={s.cardStat}>
          <b>{work.stats[0].value}</b>
          <span>{work.stats[0].label}</span>
        </span>
      </span>
    </Link>
  );
}

/** A section heading in the chapter style, with the accented stop. */
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

export function Legal({ page }: { page: LegalPage }) {
  return (
    <main id="main">
      <PageCover kicker={`Updated ${page.updated}`} title="Fine print." lead={page.title} />
      <section className={s.legal}>
        <p className={s.notice} role="note">
          {page.notice}
        </p>
        <nav aria-label="On this page" className={s.legalToc}>
          <p className={s.footHead}>On this page</p>
          <ol>
            {page.blocks.map((b, i) => (
              <li key={b.heading}>
                <a href={`#s-${i}`}>{b.heading}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={s.legalBody}>
          {page.blocks.map((b, i) => (
            <section key={b.heading} id={`s-${i}`} className={s.legalBlock}>
              <h2>
                <Stop>{`${b.heading}.`}</Stop>
              </h2>
              {b.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {b.bullets.length > 0 && (
                <ul>
                  {b.bullets.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </section>
    </main>
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

/** Every page ends on a giant one-word sign-off: "Bye." on the homepage, "Done." on a case. */
export function Footer({ signoff = "Bye." }: { signoff?: string }) {
  return (
    <footer id="contact" className={`${s.chapterDark} ${s.footer}`}>
      <div className={s.footGrid}>
        <div className={s.footLead}>
          <p className={s.footKicker}>Got a product, a process or a pile of data?</p>
          <a href={`mailto:${site.email}`} className={s.footMail}>
            {site.email}
          </a>
          <div className={s.footCtas}>
            <Link href={`${BASE}/contact`} className={s.pillLight}>
              Start a project →
            </Link>
            <a href={`mailto:${site.email}?subject=Hello`} className={s.pillGhost}>
              Just say hello
            </a>
          </div>
        </div>
        <div>
          <p className={s.footHead}>What we do</p>
          <ul className={s.footList}>
            {disciplines.map((d) => (
              <li key={d.id}>
                <Link href={`${BASE}/services/${d.id}`}>{d.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        {SITEMAP.map((col) => (
          <div key={col.label}>
            <p className={s.footHead}>{col.label}</p>
            <ul className={s.footList}>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className={s.footHead}>Find us</p>
          {offices.map((o) => (
            <p key={o.label} className={s.footText}>
              <b>{o.label}</b>
              <br />
              {o.lines.join(", ")}
            </p>
          ))}
          <p className={s.footText}>
            <DhakaClock />
          </p>
        </div>
      </div>
      <p className={s.bye} aria-hidden="true" style={{ ["--len" as string]: signoff.length }}>
        <Stop>{signoff}</Stop>
      </p>
      <div className={s.footBar}>
        <span>© {new Date().getFullYear()} DotGrey Digital</span>
        <span>
          Prototype v8 · <Link href="/">All versions</Link>
        </span>
      </div>
    </footer>
  );
}
