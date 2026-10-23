import type { Metadata } from "next";
import Link from "next/link";
import { sectors, worksFor } from "@/redesign/agency";
import { ProjectMockup } from "@/redesign/shared/ProjectMockup";
import { Page, PageHero } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Industries" };

export default function V10Industries() {
  return (
    <Page>
      <PageHero
        kicker={`Sectors · ${sectors.length} where we've shipped`}
        title="Industries"
        form="data"
        lede="Where our published work sits, and the problems we keep being asked to solve there. Every link below is a real case study."
      />
      <section className={s.block} aria-label="Sectors">
        <ol className={s.xSectors}>
          {sectors.map((sec, i) => {
            const list = worksFor(sec.slugs);
            return (
              <li key={sec.id} className={s.xSector} aria-labelledby={`sec-${sec.id}`}>
                <div>
                  <p className={s.kicker}>
                    sector {String(i + 1).padStart(2, "0")} · {list.length} case file{list.length === 1 ? "" : "s"}
                  </p>
                  <h2 id={`sec-${sec.id}`} className={s.xSectorTitle}>
                    {sec.name}
                  </h2>
                  <p className={s.label}>Problems we&apos;re good at</p>
                  <ul className={s.xDash}>
                    {sec.problems.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <ul className={s.xSectorWork}>
                  {list.map((w) => (
                    <li key={w.slug}>
                      <Link href={`/v10/work/${w.slug}`} className={s.card}>
                        <ProjectMockup slug={w.slug} ratio={1.6} ink="var(--fg)" paper="var(--bg)" />
                        <span className={s.cardTitle}>{w.title}</span>
                        <span className={s.cardStat}>
                          <b>{w.stats[0].value}</b> {w.stats[0].label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </section>
      <section className={s.block} aria-label="Start">
        <div className={s.ctaBand}>
          <p className={s.kicker}>Different sector? The problems are usually familiar.</p>
          <Link href="/v10/work" className={s.nextLink}>
            All work <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v10/start" className={s.cta}>
            Start a project <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </Page>
  );
}
