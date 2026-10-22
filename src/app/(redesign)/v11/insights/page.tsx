import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, postCategories, posts } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { PageHead } from "@/redesign/v11/Chrome";
import { Filtered } from "@/redesign/v11/Client";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Insights" };

export default function V11Insights() {
  return (
    <main>
      <PageHead label="Insights" title="Notes from ● the studio." count={posts.length} lede="Short essays on the decisions behind the work. We publish when we have learned something, not on a schedule." />
      <section className={s.sectionTight}>
        <Filtered
          label="Filter insights by topic"
          categories={postCategories}
          className={s.news}
          items={posts.map((p, i) => ({
            key: p.slug,
            category: p.category,
            node: (
              <Link href={`/v11/insights/${p.slug}`} className={s.newsRow}>
                <span className={s.newsThumb} aria-hidden="true">
                  <ProjectArt
                    slug={`post-${p.slug}`}
                    variant={i % 2 ? "contour" : "halftone"}
                    ink={i % 2 ? "var(--art-l-ink)" : "var(--art-d-ink)"}
                    paper={i % 2 ? "var(--art-l-paper)" : "var(--art-d-paper)"}
                    ratio={1.4}
                  />
                </span>
                <span className={s.newsMeta}>
                  {p.category} ● {formatPostDate(p.date)} ● {p.readingMinutes} min
                </span>
                <span className={s.newsTitle}>{p.title}</span>
                <span className={s.newsExcerpt}>{p.excerpt}</span>
                <span className={s.rowArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            ),
          }))}
        />
      </section>
    </main>
  );
}
