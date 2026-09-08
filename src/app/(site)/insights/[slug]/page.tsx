import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { PostCard } from "@/components/ui/PostCard";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { formatPostDate, getPostBySlug, getRelatedPosts, posts } from "@/data/insights";
import { getMemberBySlug } from "@/data/team";
import { site } from "@/data/site";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", publishedTime: post.date, title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = getMemberBySlug(post.author);
  const related = getRelatedPosts(post.slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: author?.name ?? site.name },
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <PageHero
        title={post.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights" },
          { label: post.category },
        ]}
        lead={post.excerpt}
        meta={
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8 font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-subtle">
            {author ? (
              <Link href={`/team/${author.slug}`} className="text-fg transition-colors hover:text-accent">
                {author.name}
              </Link>
            ) : null}
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span>{post.readingMinutes} min read</span>
            <span className="rounded-full bg-accent-dim px-3 py-1 text-accent">{post.category}</span>
          </div>
        }
      />

      <Section spacing="md">
        <Container size="wide">
          <Reveal className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line bg-bg-card">
            <Image src={post.cover} alt="" fill priority sizes="100vw" className="object-cover" />
          </Reveal>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="narrow">
          <Reveal>
            <article>
              {post.blocks.map((block, i) => {
                if (block.type === "heading") {
                  return (
                    <h2 key={i} className="mt-14 font-display text-h2 text-fg first:mt-0">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "quote") {
                  return (
                    <figure key={i} className="mt-10 border-l-2 border-accent pl-6">
                      <blockquote className="font-display text-h3 text-fg">
                        <p>&ldquo;{block.text}&rdquo;</p>
                      </blockquote>
                      <figcaption className="mt-3 text-sm text-fg-muted">
                        {block.attribution}
                      </figcaption>
                    </figure>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul key={i} className="mt-6 flex flex-col gap-3">
                      {block.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-fg-muted">
                          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="mt-6 text-body-lg text-fg-muted first:mt-0">
                    {block.text}
                  </p>
                );
              })}
            </article>
          </Reveal>

          {author ? (
            <Reveal delay={0.1}>
              <div className="card-glass mt-16 flex items-center gap-5 rounded-3xl p-6">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={author.portrait} alt={author.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-subtle">
                    Written by
                  </p>
                  <Link
                    href={`/team/${author.slug}`}
                    className="mt-1 block font-display text-h3 uppercase text-fg transition-colors hover:text-accent"
                  >
                    {author.name}
                  </Link>
                  <p className="mt-1 text-sm text-fg-muted">{author.role}</p>
                </div>
              </div>
            </Reveal>
          ) : null}
        </Container>
      </Section>

      <Section spacing="lg" bg="elev" bordered>
        <Container>
          <SectionHeading label="More" title="Keep reading" />
          <RevealGroup className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <PostCard key={item.slug} post={item} />
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <ProjectForm />
    </>
  );
}
