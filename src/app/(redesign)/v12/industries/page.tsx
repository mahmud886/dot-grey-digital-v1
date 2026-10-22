import type { Metadata } from "next";
import Link from "next/link";
import { sectors, worksFor } from "@/redesign/agency";
import { Closing } from "@/redesign/v12/Bits";
import { Em, PageHead } from "@/redesign/v12/Chrome";
import { ProjectMockup } from "@/redesign/shared/ProjectMockup";
import s from "@/redesign/v12/v12.module.css";

export const metadata: Metadata = { title: "Industries" };

export default function V12Industries() {
  return (
    <main>
      <PageHead
        label={`Industries — ${sectors.length} sectors`}
        title={
          <>
            Where we&apos;ve <Em>been.</Em>
          </>
        }
        lead="Sectors our published work touches, and the problems we keep meeting there. Every project linked below is a real case study."
      />
      <section className={`${s.wrap} ${s.sectionTight}`} aria-label="Sectors">
        <ol className={s.sectors}>
          {sectors.map((sec, i) => {
            const list = worksFor(sec.slugs);
            return (
              <li key={sec.id} className={s.sector}>
                <span className={s.serviceNum}>{String(i + 1).padStart(2, "0")}</span>
                <div className={s.sectorMain}>
                  <h2 className={s.sectorName}>{sec.name}</h2>
                  <p className={s.label}>Problems we&apos;re good at</p>
                  <ul className={s.plainList}>
                    {sec.problems.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <ul className={s.sectorWork}>
                  {list.map((w) => (
                    <li key={w.slug}>
                      <Link href={`/v12/work/${w.slug}`} className={s.sectorCard} data-cursor="view">
                        <span className={s.sectorArt}>
                          <ProjectMockup slug={w.slug} ink="var(--art-a-ink)" paper="var(--art-a-paper)" ratio={1.6} />
                        </span>
                        <span className={s.sectorTitle}>
                          {w.title} <span aria-hidden="true">→</span>
                        </span>
                        <small>
                          {w.category} · {w.year}
                        </small>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </section>
      <Closing title="Your sector isn't" turn="listed?" secondary={{ href: "/v12/contact", label: "Tell us about it" }} />
    </main>
  );
}
