import type { Metadata } from "next";
import Link from "next/link";
import { sectors, worksFor } from "@/redesign/agency";
import { ProjectMockup } from "@/redesign/shared/ProjectMockup";
import { PageHead } from "@/redesign/v11/Chrome";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Industries" };

export default function V11Industries() {
  return (
    <main>
      <PageHead label="Industries" title="Where we've worked. ● So far." lede="Every sector here links to published work. The problems are the ones we keep being asked to solve." count={sectors.length} />
      <section className={s.sectionTight} aria-label="Sectors">
        <ol className={s.sectors}>
          {sectors.map((sec, i) => {
            const list = worksFor(sec.slugs);
            return (
              <li key={sec.id} id={sec.id} className={s.sector}>
                <div className={s.sectorHead}>
                  <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                  <h2 className={s.sectorName}>{sec.name}</h2>
                  <span className={s.count}>({String(list.length).padStart(2, "0")})</span>
                </div>
                <div className={s.sectorBody}>
                  <div>
                    <p className={s.label}>Problems we solve</p>
                    <ul className={s.plainList}>
                      {sec.problems.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <ul className={s.sectorWorks}>
                    {list.map((w, k) => (
                      <li key={w.slug}>
                        <Link href={`/v11/work/${w.slug}`} className={s.workCard}>
                          <span className={s.workArt}>
                            <ProjectMockup slug={w.slug} frame={k % 4} ink={k % 2 ? "var(--art-l-ink)" : "var(--art-d-ink)"} paper={k % 2 ? "var(--art-l-paper)" : "var(--art-d-paper)"} ratio={1.25} />
                          </span>
                          <span className={s.fourMeta}>
                            <span className={s.fourNum}>{w.year}</span>
                            <span className={s.fourTitle}>{w.title}</span>
                            <span className={s.fourCat}>
                              {w.category} ● {w.stats[0]?.value} {w.stats[0]?.label}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
