import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { checklists } from "@/site/agency";
import { formatPostDate, postCategories, posts, site } from "@/site/content";
import { Closing, Head } from "@/site/Bits";
import { Em, Footer } from "@/site/Chrome";
import { PageHead } from "@/site/Bits";
import { Newsletter } from "@/site/More";
import s from "@/site/pages.module.css";

export const metadata: Metadata = pageMeta({ title: "Resources", description: "Essays and checklists from DotGrey, grouped by topic, plus a newsletter.", path: "/resources" });

export default function ResourcesPage() {
  const groups = postCategories.map((c) => ({ c, list: posts.filter((p) => p.category === c) })).filter((g) => g.list.length);
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="Take notes."
        label="Resources"
        title={
          <>
            Essays and <Em>checklists.</Em>
          </>
        }
        lead="What we have written down about the work, grouped by topic, plus the short checklists we use on our own projects."
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
                    <Link href={`/insights/${p.slug}`}>
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

      <section className={s.dark} aria-labelledby="lists">
        <div className={s.wrap}>
          <Head id="lists" label="Checklists" title="Three lists we" turn="use ourselves." note="Short enough to read before a meeting. Copy them, change them, make them yours." />
          <ol className={s.approachDark}>
            {checklists.map((c, i) => (
              <li key={c.title}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                <ul className={s.checklist}>
                  {c.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${s.wrap} ${s.section} ${s.twoUp}`} aria-labelledby="notes">
        <Head id="notes" label="Newsletter" title="A few times" turn="a year." />
        <Newsletter email={site.email} id="news-page" />
      </section>

      <Closing title="Rather talk it" turn="through?" primary={{ href: "/contact", label: "Get in touch" }} secondary={{ href: "/insights", label: "All insights" }} />
    </main>
      <Footer signoff="Read on." />
    </>
  );
}
