import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getMemberBySlug, getPostBySlug, getRelatedPosts, posts, type PostBlock } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Footer, Portrait, SecHead, Stop } from "@/redesign/v8/Chrome";
import s from "@/redesign/v8/v8.module.css";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v8/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  return { title: p ? p.title : "Insight", description: p?.excerpt };
}

function Block({ b, first }: { b: PostBlock; first: boolean }) {
  switch (b.type) {
    case "heading":
      return (
        <h2 className={s.artH2}>
          <Stop>{b.text.endsWith(".") || b.text.endsWith("?") ? b.text : `${b.text}.`}</Stop>
        </h2>
      );
    case "quote":
      return (
        <figure className={s.artQuote}>
          <blockquote>“{b.text}”</blockquote>
          {b.attribution && <figcaption>— {b.attribution}</figcaption>}
        </figure>
      );
    case "list":
      return (
        <ul className={s.artList}>
          {b.items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      );
    default:
      return <p className={first ? s.artFirst : undefined}>{b.text}</p>;
  }
}

export default async function V8Post({ params }: PageProps<"/v8/insights/[slug]">) {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  if (!p) notFound();
  const author = getMemberBySlug(p.author);
  const related = getRelatedPosts(slug, 3);
  const firstPara = p.blocks.findIndex((b) => b.type === "paragraph");

  return (
    <>
      <main id="main">
        <article>
          <header className={s.artHead}>
            <nav aria-label="Breadcrumb" className={s.coverCrumbs}>
              <Link href="/v8/insights">Insights</Link>
              <span aria-hidden="true">/</span>
              <span>{p.category}</span>
            </nav>
            <h1 className={s.artTitle}>
              <Stop>{p.title.endsWith(".") || p.title.endsWith("?") ? p.title : `${p.title}.`}</Stop>
            </h1>
            <p className={s.artExcerpt}>{p.excerpt}</p>
            <p className={s.artMeta}>
              {author ? <Link href={`/v8/team/${author.slug}`}>{author.name}</Link> : null}
              <span>{formatPostDate(p.date)}</span>
              <span>{p.readingMinutes} min read</span>
            </p>
          </header>
          <div className={s.caseHeroArt}>
            <ProjectArt slug={`post-${p.slug}`} label={p.category} variant="contour" ink="var(--art-ink)" paper="var(--art-paper)" ratio={2.4} title="Generated artwork for this essay" />
          </div>
          <div className={s.artBody}>
            {p.blocks.map((b, i) => (
              <Block key={i} b={b} first={i === firstPara} />
            ))}
          </div>
          {author && (
            <aside className={s.artAuthor} aria-label="About the author">
              <Portrait slug={author.slug} name={author.name} />
              <div>
                <p className={s.cardKicker}>Written by</p>
                <Link href={`/v8/team/${author.slug}`} className={s.teamName}>
                  {author.name}
                </Link>
                <p className={s.teamRole}>{author.role}</p>
              </div>
            </aside>
          )}
        </article>

        <section className={s.process} aria-labelledby="more-title">
          <SecHead id="more-title" title="Read next." />
          <ul className={s.postList}>
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/v8/insights/${r.slug}`} className={s.postRow}>
                  <span className={s.postCat}>{r.category}</span>
                  <span className={s.postTitle}>{r.title}</span>
                  <span className={s.postMeta}>{r.readingMinutes} min →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer signoff="Done." />
    </>
  );
}
