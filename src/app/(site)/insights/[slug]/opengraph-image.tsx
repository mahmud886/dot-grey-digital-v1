import { getPostBySlug, posts } from "@/data/insights";
import { OG_CONTENT_TYPE, OG_SIZE, shareCard } from "@/lib/og";

export const alt = "Article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return shareCard({
    eyebrow: post?.category ?? "Insights",
    title: post?.title ?? "Insights",
    description: post?.excerpt,
    footer: post ? `${post.readingMinutes} min read` : undefined,
  });
}
