import type { Metadata } from "next";
import Link from "next/link";
import { sectors, worksFor } from "@/redesign/agency";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { variantFor } from "@/redesign/v8/art";
import { Footer, PageCover } from "@/redesign/v8/Chrome";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Industries" };

export default function V8Industries() {
  return (
    <>
      <main id="main">
        <PageCover
          kicker={`Industries · ${sectors.length} sectors`}
          title="Where we've been."
          lead="The sectors our published work comes from, and the problems we keep being asked to solve in them. New sector? The process is the same."
        />
        <section className={s.indexSec} aria-label="Sectors">
          <ol className={s.sectorList}>
            {sectors.map((sec, i) => (
              <li key={sec.id} className={s.sector}>
                <span className={s.kicker}>{String(i + 1).padStart(2, "0")}</span>
                <h2 className={s.sectorName}>
                  {sec.name}
                  <span className={s.stop}>.</span>
                </h2>
                <div>
                  <p className={s.footHead}>Problems we solve</p>
                  <ul className={s.dashList}>
                    {sec.problems.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className={s.footHead}>Published work</p>
                  <ul className={s.sectorWork}>
                    {worksFor(sec.slugs).map((w) => (
                      <li key={w.slug}>
                        <Link href={`/v8/work/${w.slug}`}>
                          <span>
                            <ProjectArt slug={w.slug} label={w.client} variant={variantFor(w.slug)} ink="var(--art-ink)" paper="var(--art-paper)" ratio={1.5} />
                          </span>
                          <span>{w.title} →</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <div className={s.ctaBand}>
          <p>Your sector isn&apos;t here?</p>
          <Link href="/v8/start" className={s.pillAccent}>
            Tell us about it →
          </Link>
        </div>
      </main>
      <Footer signoff="Any sector." />
    </>
  );
}
