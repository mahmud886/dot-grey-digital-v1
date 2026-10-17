import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, getMemberBySlug, postCategories, posts } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Footer, PageCover, Stop } from "@/redesign/v8/Chrome";
import { JournalIndex } from "@/redesign/v8/Client";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Insights" };

const ART = ["contour", "halftone", "rings", "matrix"] as const;

export default function V8Insights() {
  const [lead, ...rest] = posts;
  const leadAuthor = getMemberBySlug(lead.author);
  return (
    <>
      <main id="main">
        <PageCover kicker={`Insights · ${posts.length} essays`} title="On record." lead="Short essays on the decisions behind the work. We publish when we have learned something, not on a schedule." />

        <section className={s.indexSec} aria-label="Latest">
          <Link href={`/v8/insights/${lead.slug}`} className={s.postLead}>
            <span className={s.postLeadArt}>
              <ProjectArt slug={`post-${lead.slug}`} label={lead.category} variant="contour" ink="var(--art-ink)" paper="var(--art-paper)" ratio={2.2} />
            </span>
            <span className={s.postLeadText}>
              <span className={s.cardKicker}>
                Latest · {lead.category} · {formatPostDate(lead.date)}
              </span>
              <span className={s.postLeadTitle}>
                <Stop>{lead.title.endsWith(".") ? lead.title : `${lead.title}.`}</Stop>
              </span>
              <span className={s.postLeadExcerpt}>{lead.excerpt}</span>
              <span className={s.postMeta}>
                {leadAuthor?.name} · {lead.readingMinutes} min read
              </span>
            </span>
          </Link>
        </section>

        <section className={s.indexSec} aria-label="All essays">
          <JournalIndex
            categories={postCategories}
            items={rest.map((p, i) => ({
              slug: p.slug,
              category: p.category,
              node: (
                <Link href={`/v8/insights/${p.slug}`} className={s.postRow}>
                  <span className={s.postThumb} aria-hidden="true">
                    <ProjectArt slug={`post-${p.slug}`} label={p.category} variant={ART[i % ART.length]} ink="var(--art-ink)" paper="var(--art-paper)" ratio={1.4} />
                  </span>
                  <span className={s.postCat}>
                    {p.category} · {formatPostDate(p.date)}
                  </span>
                  <span className={s.postTitle}>{p.title}</span>
                  <span className={s.postMeta}>{p.readingMinutes} min →</span>
                </Link>
              ),
            }))}
          />
        </section>
      </main>
      <Footer signoff="Off the page." />
    </>
  );
}
