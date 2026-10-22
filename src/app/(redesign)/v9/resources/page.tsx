import type { Metadata } from "next";
import Link from "next/link";
import { plannedResources } from "@/redesign/agency";
import { formatPostDate, postCategories, posts, site } from "@/redesign/content";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import { Notes } from "@/redesign/v9/More";
import m from "@/redesign/v9/more.module.css";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Resources" };

export default function V9Resources() {
  const groups = postCategories.map((c) => ({ c, list: posts.filter((p) => p.category === c) })).filter((g) => g.list.length);
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9/insights", label: "Insights" }}
        meta={`(${String(posts.length).padStart(2, "0")}) essays, more on the way`}
        title={
          <>
            Take <G name="wave" /> notes
          </>
        }
        lede="Essays sorted by topic, the checklists we are writing up, and a way to hear when there is something new."
      >
        <Notes email={site.email} id="v9-res-notes" />
      </PageHead>
      {groups.map((g, gi) => (
        <section key={g.c} className={s.sectionTight}>
          <div className={s.wrap}>
            <SectionHead n={String(gi + 1).padStart(2, "0")} title={g.c} aside={`${g.list.length} ${g.list.length === 1 ? "essay" : "essays"}`} />
            <ol className={s.bigList}>
              {g.list.map((p) => (
                <li key={p.slug}>
                  <Link href={`/v9/insights/${p.slug}`} className={s.bigRow}>
                    <span className={s.bigNum}>{p.readingMinutes}′</span>
                    <span className={s.bigTitle} style={{ fontSize: "clamp(1.8rem, 3.6vw, 3.6rem)" }}>
                      {p.title}
                    </span>
                    <span className={s.bigLine}>{formatPostDate(p.date)}</span>
                    <span className={s.bigArrow}>
                      <G name="arrow" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}
      <section className={`${s.section} ${s.dark}`}>
        <div className={s.wrap}>
          <SectionHead n={String(groups.length + 1).padStart(2, "0")} title="Checklists in progress" aside="Not published yet" dark />
          <ul className={m.planned}>
            {plannedResources.map((r) => (
              <li key={r.title} style={{ borderTopColor: "var(--chap-fg)" }}>
                <span className={m.soon} style={{ borderColor: "var(--chap-fg)" }}>
                  Coming soon
                </span>
                <h3>{r.title}</h3>
                <p style={{ fontSize: 14 }}>{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
