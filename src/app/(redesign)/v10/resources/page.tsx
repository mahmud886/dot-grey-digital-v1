import type { Metadata } from "next";
import Link from "next/link";
import { plannedResources } from "@/redesign/agency";
import { formatPostDate, postCategories, posts, site } from "@/redesign/content";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import { Newsletter } from "@/redesign/v10/More";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Resources" };

export default function V10Resources() {
  const groups = postCategories.map((c) => ({ c, list: posts.filter((p) => p.category === c) })).filter((g) => g.list.length);
  return (
    <Page>
      <PageHero
        kicker={`Library · ${posts.length} essays, ${plannedResources.length} tools in progress`}
        title="Resources"
        form="dust"
        lede="Essays on the decisions behind the work, the checklists we are turning into downloads, and a short monthly note."
      />
      <section className={s.block} aria-labelledby="ess-h">
        <SecHead id="ess-h" title="Essays" note="Grouped by topic." />
        {groups.map((g) => (
          <div key={g.c} className={s.xGroup}>
            <p className={s.label}>
              {g.c} · {g.list.length}
            </p>
            <ul className={s.list}>
              {g.list.map((p) => (
                <li key={p.slug}>
                  <Link href={`/v10/insights/${p.slug}`} className={s.xRowLink}>
                    <span>{p.title}</span>
                    <span className={s.xToolGroup}>
                      {formatPostDate(p.date)} · {p.readingMinutes} min
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section className={s.block} aria-labelledby="tool-h">
        <SecHead id="tool-h" title="Checklists" note="Not published yet — marked as such until they are." />
        <ol className={s.ruleGrid}>
          {plannedResources.map((r, i) => (
            <li key={r.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")} · coming soon</span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className={`${s.block} ${s.twoCol}`} aria-labelledby="news-h">
        <SecHead id="news-h" title="Notes" note="One email a month: what we shipped, what we learned, nothing else." />
        <Newsletter email={site.email} />
      </section>
    </Page>
  );
}
