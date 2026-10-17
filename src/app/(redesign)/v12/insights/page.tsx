import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, postCategories, posts, team } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Em, PageHead } from "@/redesign/v12/Chrome";
import { JournalIndex } from "@/redesign/v12/Client";
import s from "@/redesign/v12/v12.module.css";

export const metadata: Metadata = { title: "Insights" };

const VARIANT = ["contour", "rings", "halftone", "contour"] as const;

export default function V12Insights() {
  return (
    <main>
      <PageHead
        label="Insights"
        title={
          <>
            Notes from <Em>the studio.</Em>
          </>
        }
        lead="Short essays on the decisions behind the work. We publish when we have learned something, not on a schedule."
      />
      <section className={`${s.wrap} ${s.sectionTight}`}>
        <JournalIndex
          categories={postCategories}
          items={posts.map((p, i) => {
            const author = team.find((m) => m.slug === p.author);
            return {
              slug: p.slug,
              category: p.category,
              node: (
                <Link href={`/v12/insights/${p.slug}`} className={s.post} data-cursor="view">
                  <span className={s.postArt}>
                    <ProjectArt slug={p.slug} label={p.category} variant={VARIANT[i % VARIANT.length]} ink="var(--art-a-ink)" paper="var(--art-a-paper)" ratio={1.4} />
                  </span>
                  <span className={s.postMeta}>
                    {p.category} · {formatPostDate(p.date)} · {p.readingMinutes} min
                  </span>
                  <span className={s.postTitle}>{p.title}</span>
                  <span className={s.postExcerpt}>{p.excerpt}</span>
                  {author && <span className={s.postBy}>By {author.name}</span>}
                </Link>
              ),
            };
          })}
        />
      </section>
    </main>
  );
}
