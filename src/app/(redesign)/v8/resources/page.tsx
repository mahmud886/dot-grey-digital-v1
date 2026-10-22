import type { Metadata } from "next";
import Link from "next/link";
import { plannedResources } from "@/redesign/agency";
import { formatPostDate, postCategories, posts, site } from "@/redesign/content";
import { Footer, PageCover, SecHead } from "@/redesign/v8/Chrome";
import { Newsletter } from "@/redesign/v8/More";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Resources" };

export default function V8Resources() {
  const groups = postCategories.map((c) => ({ c, items: posts.filter((p) => p.category === c) })).filter((g) => g.items.length);
  return (
    <>
      <main id="main">
        <PageCover kicker="Resources" title="Take notes." lead="Essays on how we make decisions, and the checklists we use on projects — the first of which are still being written." aside={<Newsletter email={site.email} />} />

        <section className={s.process} aria-labelledby="e-title">
          <SecHead id="e-title" title="Essays." note={<Link href="/v8/insights">All insights →</Link>} />
          <ol className={s.tileGrid}>
            {groups.map((g) => (
              <li key={g.c}>
                <span className={s.tileKick}>{g.c}</span>
                <ul className={s.dashList}>
                  {g.items.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/v8/insights/${p.slug}`} style={{ color: "inherit", fontWeight: 700 }}>
                        {p.title}
                      </Link>
                      <br />
                      <small className={s.newsNote}>
                        {formatPostDate(p.date)} · {p.readingMinutes} min
                      </small>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${s.chapterDark} ${s.process}`} aria-labelledby="c-title">
          <SecHead id="c-title" title="Checklists." note="Being written now. Subscribe and we'll send them when they're ready." />
          <ol className={s.tileGrid + " " + s.three}>
            {plannedResources.map((r, i) => (
              <li key={r.title}>
                <span className={s.soon}>Coming soon</span>
                <span className={s.tileKick}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.tileTitle}>{r.title}</h3>
                <p>{r.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer signoff="Read on." />
    </>
  );
}
