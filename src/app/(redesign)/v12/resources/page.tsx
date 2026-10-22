import type { Metadata } from "next";
import Link from "next/link";
import { plannedResources } from "@/redesign/agency";
import { formatPostDate, postCategories, posts, site } from "@/redesign/content";
import { Closing, Head } from "@/redesign/v12/Bits";
import { Em, PageHead } from "@/redesign/v12/Chrome";
import { Newsletter } from "@/redesign/v12/More";
import s from "@/redesign/v12/v12.module.css";

export const metadata: Metadata = { title: "Resources" };

export default function V12Resources() {
  const groups = postCategories.map((c) => ({ c, list: posts.filter((p) => p.category === c) })).filter((g) => g.list.length);
  return (
    <main>
      <PageHead
        label="Resources"
        title={
          <>
            Take <Em>notes.</Em>
          </>
        }
        lead="What we have written down about the work, grouped by topic — and the checklists we are preparing next."
      />

      <section className={`${s.wrap} ${s.sectionTight}`} aria-label="Essays by topic">
        <div className={s.topicGrid}>
          {groups.map((g) => (
            <div key={g.c}>
              <p className={s.label}>
                {g.c} <span className={s.count}>({g.list.length})</span>
              </p>
              <ul className={s.topicList}>
                {g.list.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/v12/insights/${p.slug}`}>
                      <span>{p.title}</span>
                      <small>
                        {formatPostDate(p.date)} · {p.readingMinutes} min
                      </small>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className={s.dark} aria-labelledby="soon">
        <div className={s.wrap}>
          <Head id="soon" label="Coming soon" title="Checklists, in" turn="progress." note="Not published yet — subscribe below and we'll send them when they are." />
          <ol className={s.approachDark}>
            {plannedResources.map((r, i) => (
              <li key={r.title}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")} — Coming soon</span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${s.wrap} ${s.section} ${s.twoUp}`} aria-labelledby="notes">
        <Head id="notes" label="Newsletter" title="A few times" turn="a year." />
        <Newsletter email={site.email} id="v12-news-page" />
      </section>

      <Closing title="Rather talk it" turn="through?" primary={{ href: "/v12/contact", label: "Get in touch" }} secondary={{ href: "/v12/insights", label: "All insights" }} />
    </main>
  );
}
