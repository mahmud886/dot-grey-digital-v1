import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { plannedResources } from "@/site/agency";
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
            What we&apos;ve written, <Em>and what&apos;s next.</Em>
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
        <Newsletter email={site.email} id="news-page" />
      </section>

      <Closing title="Rather talk it" turn="through?" primary={{ href: "/contact", label: "Get in touch" }} secondary={{ href: "/insights", label: "All insights" }} />
    </main>
      <Footer signoff="Read on." />
    </>
  );
}
