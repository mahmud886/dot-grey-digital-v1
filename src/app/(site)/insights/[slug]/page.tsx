import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getPostBySlug, getRelatedPosts, posts, team } from "@/site/content";
import { ProjectArt } from "@/site/shared/ProjectArt";
import { Em, Footer } from "@/site/Chrome";
import s from "@/site/pages.module.css";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  return p ? pageMeta({ title: p.title, description: p.excerpt, path: `/insights/${slug}` }) : { title: "Insight" };
}

export default async function PostPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  if (!p) notFound();
  const author = team.find((m) => m.slug === p.author);
  const related = getRelatedPosts(slug, 2);
  // The last word of the title takes the italic voice.
  const words = p.title.split(" ");
  const tail = words.pop();

  return (
    <>
    <main className={s.pg}>
      <article>
        <header className={`${s.wrap} ${s.articleHead}`}>
          <p className={s.kicker}>
            <Link href="/insights">Insights</Link> — {p.category}
          </p>
          <h1 className={s.articleTitle}>
            {words.join(" ")} <Em>{tail}</Em>
          </h1>
          <p className={s.articleMeta}>
            {author && (
              <>
                By{" "}
                <Link href={`/team/${author.slug}`} className={s.textLink}>
                  {author.name}
                </Link>{" "}
                ·{" "}
              </>
            )}
            {formatPostDate(p.date)} · {p.readingMinutes} min read
          </p>
        </header>
        <div className={`${s.wrap} ${s.cover}`}>
          <ProjectArt slug={p.slug} label={p.category} variant="contour" ink="var(--art-b-ink)" paper="var(--art-b-paper)" ratio={2.4} />
        </div>
        <div className={`${s.wrap} ${s.articleBody}`}>
          <p className={s.articleLead}>{p.excerpt}</p>
          {p.blocks.map((b, i) => {
            if (b.type === "heading") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "quote")
              return (
                <figure key={i} className={s.pull}>
                  <blockquote>“{b.text}”</blockquote>
                  {b.attribution && <figcaption>— {b.attribution}</figcaption>}
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

      <section className={`${s.wrap} ${s.section}`} aria-labelledby="more">
        <div className={s.secHead}>
          <p className={s.label}>Keep reading</p>
          <h2 id="more" className={s.h2}>
            More <Em>notes.</Em>
          </h2>
        </div>
        <ul className={s.journal}>
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={`/insights/${r.slug}`} className={s.post} data-cursor="view">
                <span className={s.postArt}>
                  <ProjectArt slug={r.slug} label={r.category} variant="rings" ink="var(--art-a-ink)" paper="var(--art-a-paper)" ratio={1.4} />
                </span>
                <span className={s.postMeta}>
                  {r.category} · {r.readingMinutes} min
                </span>
                <span className={s.postTitle}>{r.title}</span>
                <span className={s.postExcerpt}>{r.excerpt}</span>
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
