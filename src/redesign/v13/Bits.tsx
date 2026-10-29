import Link from "next/link";
import type { ReactNode } from "react";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { ProjectMockup } from "@/redesign/shared/ProjectMockup";
import type { Work } from "@/redesign/content";
import { BASE, Em, Stop } from "./Chrome";
import { Reveal } from "./Client";
import p from "./pages.module.css";
import s from "./v13.module.css";

/**
 * Inner-page opening: V8's voice on top — a one-line headline ending in the accent full
 * stop — then V12's sentence with its italic turn, and the lead.
 */
export function PageHead({ label, head, title, lead, children }: { label: ReactNode; head: string; title?: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className={`${s.wrap} ${s.pageHead}`}>
      <p className={s.label}>{label}</p>
      <Reveal as="h1" className={s.pageHeadline} text={head} />
      {title && <p className={s.pageSentence}>{title}</p>}
      {lead && <p className={s.pageLead}>{lead}</p>}
      {children}
    </section>
  );
}

/** The closing invitation on the agency pages: a big line with an italic turn and two ways in. */
export function Closing({ title, turn, primary = { href: `${BASE}/start`, label: "Start a project" }, secondary }: { title: ReactNode; turn: ReactNode; primary?: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  return (
    <section className={`${s.wrap} ${p.contact}`}>
      <h2 className={p.ctaSmall}>
        {title} <Em>{turn}</Em>
      </h2>
      <div className={p.ctas}>
        <Link href={primary.href} className={s.pillInk}>
          {primary.label} <span aria-hidden="true">↗</span>
        </Link>
        {secondary && (
          <Link href={secondary.href} className={s.textLink}>
            {secondary.label}
          </Link>
        )}
      </div>
    </section>
  );
}

/** A section heading: small label, bold title with its italic word, optional note. */
export function Head({ id, label, title, turn, note }: { id: string; label: string; title: ReactNode; turn?: ReactNode; note?: ReactNode }) {
  return (
    <div className={p.secHead}>
      <p className={s.label}>{label}</p>
      <h2 id={id} className={`${p.h2} ${s.headBold}`}>
        {typeof title === "string" && !turn ? <Stop>{title}</Stop> : title} {turn && <Em>{turn}</Em>}
      </h2>
      {note && <p className={p.note}>{note}</p>}
    </div>
  );
}

/**
 * A work card: two tilted mockups on a stage that straighten and scale up on hover.
 * Frame colours are theme tokens, so the cards re-ink with the theme.
 */
export function WorkCard({ work, index, size = "md" }: { work: Work; index: number; size?: "md" | "lg" }) {
  return (
    <Link href={`${BASE}/work/${work.slug}`} className={p.card} data-size={size} data-cursor="view">
      <div className={p.stage2}>
        <div className={`${p.frame} ${p.frameBack}`}>
          <ProjectMockup slug={work.slug} ink="var(--art-a-ink)" paper="var(--art-a-paper)" ratio={1.25} frame={1} label={false} />
        </div>
        <div className={`${p.frame} ${p.frameFront}`}>
          <ProjectMockup slug={work.slug} ink="var(--art-b-ink)" paper="var(--art-b-paper)" ratio={1.25} frame={index % 2 ? 2 : 0} />
        </div>
      </div>
      <div className={p.cardMeta}>
        <h3 className={p.cardTitle}>{work.title}</h3>
        <span className={p.cardCat}>
          {work.category} · {work.year}
        </span>
        <p className={p.cardStat}>
          <b>{work.stats[0].value}</b> {work.stats[0].label.toLowerCase()}
        </p>
      </div>
    </Link>
  );
}

/** The same project as a dense hairline row, for the list view. */
export function WorkRow({ work, index }: { work: Work; index: number }) {
  return (
    <Link href={`${BASE}/work/${work.slug}`} className={p.workRow} data-cursor="view">
      <span className={p.serviceNum}>{String(index + 1).padStart(2, "0")}</span>
      <span className={p.workRowArt}>
        <ProjectMockup slug={work.slug} ink="var(--art-a-ink)" paper="var(--art-a-paper)" ratio={1.25} />
      </span>
      <span className={p.workRowTitle}>{work.title}</span>
      <span className={p.workRowCat}>
        {work.category} · {work.year}
      </span>
      <span className={p.workRowStat}>
        <b>{work.stats[0].value}</b> {work.stats[0].label.toLowerCase()}
      </span>
      <span className={p.serviceArrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}

/** Generative stand-in for a portrait, seeded by the person's name; labelled as artwork, not a photo. */
export function Portrait({ slug, name, title }: { slug: string; name: string; title?: string }) {
  return (
    <span className={p.portrait}>
      <ProjectArt slug={`person-${slug}`} label={name} variant="rings" ink="var(--ink)" paper="var(--paper-2)" ratio={0.8} title={title} />
      <span className={p.monogram} aria-hidden="true">
        {name
          .split(" ")
          .map((x) => x[0])
          .join("")}
      </span>
    </span>
  );
}
