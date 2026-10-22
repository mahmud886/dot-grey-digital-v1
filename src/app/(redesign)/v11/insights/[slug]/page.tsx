import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getMemberBySlug, getPostBySlug, getRelatedPosts, posts } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Crumb, Dot, SectionHead } from "@/redesign/v11/Chrome";
import s from "@/redesign/v11/v11.module.css";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v11/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  return { title: p?.title ?? "Insight", description: p?.excerpt };
}

export default async function V11Post({ params }: PageProps<"/v11/insights/[slug]">) {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  if (!p) notFound();
  const author = getMemberBySlug(p.author);
  const related = getRelatedPosts(slug, 3);

  return (
    <main>
      <article>
        <header className={s.articleHead}>
          <Crumb href="/v11/insights">Insights</Crumb>
          <p className={s.label}>
            {p.category} ● {formatPostDate(p.date)} ● {p.readingMinutes} min read
          </p>
          <h1 className={s.articleTitle}>{p.title}</h1>
          <p className={s.lede}>{p.excerpt}</p>
          {author && (
            <p className={s.byline}>
              By <Link href={`/v11/team/${author.slug}`}>{author.name}</Link> <span className={s.muted}>— {author.role}</span>
            </p>
          )}
        </header>
        <div className={s.articleArt}>
          <ProjectArt slug={`post-${p.slug}`} variant="halftone" ink="var(--art-d-ink)" paper="var(--art-d-paper)" ratio={2.2} />
        </div>
        <div className={s.prose}>
          {p.blocks.map((b, i) => {
            if (b.type === "heading") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "quote")
              return (
                <figure key={i}>
                  <blockquote>
                    <Dot /> {b.text}
                  </blockquote>
                  <figcaption>— {b.attribution}</figcaption>
                </figure>
              );
            if (b.type === "list")
              return (
                <ul key={i}>
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              );
            return <p key={i}>{b.text}</p>;
          })}
        </div>
      </article>

      <section className={s.section} aria-labelledby="more">
        <SectionHead title="Read next" count={related.length} id="more" />
        <ol className={s.news}>
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={`/v11/insights/${r.slug}`} className={`${s.newsRow} ${s.newsRowBare}`}>
                <span className={s.newsMeta}>
                  {r.category} ● {formatPostDate(r.date)}
                </span>
                <span className={s.newsTitle}>{r.title}</span>
                <span className={s.rowArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
