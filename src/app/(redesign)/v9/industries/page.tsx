import type { Metadata } from "next";
import Link from "next/link";
import { sectors, worksFor } from "@/redesign/agency";
import { ProjectMockup } from "@/redesign/shared/ProjectMockup";
import { PageHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import m from "@/redesign/v9/more.module.css";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Industries" };

export default function V9Industries() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta={`(${String(sectors.length).padStart(2, "0")}) sectors, from published work only`}
        title={
          <>
            Where we <G name="arrow" /> have been
          </>
        }
        lede="Sectors we have shipped in, the problems that keep coming up there, and the case studies to show for it."
      />
      <section className={s.sectionTight}>
        <ol className={s.wrap} style={{ borderTop: "1px solid var(--ink)" }}>
          {sectors.map((sec, i) => {
            const list = worksFor(sec.slugs);
            return (
              <li key={sec.id} className={m.sector}>
                <span className={m.engNum}>{String(i + 1).padStart(2, "0")}</span>
                <h2 className={m.sectorName}>{sec.name}</h2>
                <div>
                  <p className={s.label} style={{ marginBottom: 8 }}>
                    Problems we know
                  </p>
                  <ul className={m.sectorProblems}>
                    {sec.problems.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className={m.sectorWorks}>
                  <p className={s.label}>Case studies</p>
                  {list.map((w) => (
                    <Link key={w.slug} href={`/v9/work/${w.slug}`} className={m.sectorWork}>
                      <span>
                        <ProjectMockup slug={w.slug} ink="var(--art-ink)" paper="var(--art-paper)" ratio={4 / 3} label={false} />
                      </span>
                      <span>
                        <b>{w.title}</b>
                        <small>
                          {w.category} <G name="slash" /> {w.stats[0].value} {w.stats[0].label}
                        </small>
                      </span>
                    </Link>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
      <nav className={m.band} aria-label="Next steps">
        <Link href="/v9/work" className={m.bandLink}>
          <span className={s.label}>Everything we have published</span>
          <b>
            All work <G name="arrow" />
          </b>
          <p>Nine projects, each with the one number the client cared about.</p>
        </Link>
        <Link href="/v9/start" className={m.bandLink}>
          <span className={s.label}>Your sector is not here?</span>
          <b>
            Start a project <G name="arrow" />
          </b>
          <p>Most problems are not unique to one industry. Tell us yours.</p>
        </Link>
      </nav>
    </main>
  );
}
