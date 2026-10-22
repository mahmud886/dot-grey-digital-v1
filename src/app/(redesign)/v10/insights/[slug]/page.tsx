import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getMemberBySlug, getPostBySlug, getRelatedPosts, posts } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Page, PageHero } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v10/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getPostBySlug(slug)?.title ?? "Insight" };
}

export default async function V10Post({ params }: PageProps<"/v10/insights/[slug]">) {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  if (!p) notFound();
  const author = getMemberBySlug(p.author);
  const related = getRelatedPosts(p.slug, 2);

  return (
    <Page>
      <PageHero
        kicker={`Log entry · ${p.category} · ${formatPostDate(p.date)} · ${p.readingMinutes} min read`}
        title={p.title}
        long
        form="dust"
        lede={p.excerpt}
      >
        {author && (
          <p className={s.byline}>
            By{" "}
            <Link href={`/v10/team/${author.slug}`} className={s.inlineLink}>
              {author.name}
            </Link>{" "}
            · {author.role}
          </p>
        )}
      </PageHero>

      <div className={s.articleCover}>
        <ProjectArt slug={p.slug} variant="contour" ratio={2.6} ink="var(--fg)" paper="var(--bg)" />
      </div>

      <article className={`${s.block} ${s.prose} ${s.article}`}>
        {p.blocks.map((b, i) => {
          if (b.type === "heading") return <h2 key={i}>{b.text}</h2>;
          if (b.type === "quote")
            return (
              <blockquote key={i}>
                <p>“{b.text}”</p>
                {b.attribution && <cite>— {b.attribution}</cite>}
              </blockquote>
            );
          if (b.type === "list")
            return (
              <ul key={i}>
                {b.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            );
          return <p key={i}>{b.text}</p>;
        })}
      </article>

      <section className={s.block} aria-label="Read next">
        <p className={s.label}>Read next</p>
        <ul className={s.cards}>
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={`/v10/insights/${r.slug}`} className={s.card}>
                <ProjectArt slug={r.slug} variant="halftone" ratio={1.6} ink="var(--fg)" paper="var(--bg)" />
                <span className={s.cardMeta}>
                  {r.category} · {formatPostDate(r.date)}
                </span>
                <span className={s.cardTitle}>{r.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
