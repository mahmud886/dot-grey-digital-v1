import type { Metadata } from "next";
import Link from "next/link";
import { plannedResources } from "@/redesign/agency";
import { formatPostDate, postCategories, posts, site } from "@/redesign/content";
import { Dot, PageHead, SectionHead } from "@/redesign/v11/Chrome";
import { Newsletter } from "@/redesign/v11/More";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Resources" };

export default function V11Resources() {
  const groups = postCategories.map((c) => ({ c, list: posts.filter((p) => p.category === c) })).filter((g) => g.list.length);
  return (
    <main>
      <PageHead label="Resources" title="Take notes. ● Free to use." lede="Essays on the decisions behind the work, grouped by topic, plus the checklists we are writing next." count={posts.length} />

      {groups.map((g) => (
        <section key={g.c} className={s.sectionTight} aria-labelledby={`res-${g.c}`}>
          <SectionHead title={g.c} count={g.list.length} id={`res-${g.c}`} />
          <ol className={s.rows}>
            {g.list.map((p, i) => (
              <li key={p.slug}>
                <Link href={`/v11/insights/${p.slug}`} className={`${s.row} ${s.rowNoThumb}`}>
                  <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.rowTitle}>{p.title}</span>
                  <span className={s.rowBody}>
                    {formatPostDate(p.date)} ● {p.readingMinutes} min
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className={s.dark} aria-labelledby="planned">
        <p className={s.label}>(02) Coming soon</p>
        <h2 id="planned" className={s.darkTitle}>
          Checklists. <Dot /> Not yet.
        </h2>
        <ol className={s.steps}>
          {plannedResources.map((r, i) => (
            <li key={r.title}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, "0")} ● Coming soon</span>
              <h3 className={s.stepTitle}>{r.title}</h3>
              <p>{r.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section} aria-label="Newsletter">
        <Newsletter email={site.email} id="nl-resources" />
      </section>
    </main>
  );
}
