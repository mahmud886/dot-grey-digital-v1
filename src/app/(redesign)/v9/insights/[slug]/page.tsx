import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getMemberBySlug, getPostBySlug, getRelatedPosts, posts } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { PixelReveal } from "@/redesign/v9/Client";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v9/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getPostBySlug(slug)?.title ?? "Insight" };
}

export default async function V9Post({ params }: PageProps<"/v9/insights/[slug]">) {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  if (!p) notFound();
  const author = getMemberBySlug(p.author);
  const related = getRelatedPosts(slug, 3);

  return (
    <main>
      <PageHead crumb={{ href: "/v9/insights", label: "Insights" }} meta={`${p.category} ◇ ${p.readingMinutes} min read`} title={p.title}>
        <p className={s.byline}>
          {author ? <Link href={`/v9/team/${author.slug}`}>{author.name}</Link> : "DotGrey"} <G name="slash" /> {formatPostDate(p.date)}
        </p>
      </PageHead>

      <PixelReveal className={s.caseCover}>
        <ProjectArt slug={`post-${p.slug}`} label={p.category} variant="contour" ink="#f7f7f5" paper="#0b0b0b" ratio={21 / 9} title="Article artwork" />
      </PixelReveal>

      <article className={`${s.section} ${s.wrap}`}>
        <div className={s.article}>
          <p className={s.articleLede}>{p.excerpt}</p>
          {p.blocks.map((b, i) => {
            if (b.type === "heading") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "quote")
              return (
                <figure key={i}>
                  <blockquote>
                    <G name="flower" /> {b.text}
                  </blockquote>
                  <figcaption>{b.attribution}</figcaption>
                </figure>
              );
            if (b.type === "list")
              return (
                <ul key={i}>
                  {b.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              );
            return <p key={i}>{b.text}</p>;
          })}
          <p className={s.articleEnd} aria-hidden="true">
            <G name="asterisk" />
          </p>
        </div>
      </article>

      <section className={s.section}>
        <div className={s.wrap}>
          <SectionHead n="02" title="Read next" aside={`${related.length} essays`} />
          <ul className={s.table}>
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/v9/insights/${r.slug}`} className={s.tRow}>
                  <span className={s.tKey}>
                    <G name="arrow" />
                  </span>
                  <span className={s.tName}>{r.title}</span>
                  <span className={s.tVal}>
                    {r.category} — {formatPostDate(r.date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
