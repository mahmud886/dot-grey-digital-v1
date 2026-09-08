import data from "@/content/insights.json";

/**
 * Posts are stored as a small block model rather than markdown so the CMS can offer real
 * fields for each block type and the site never has to ship a markdown parser to the
 * browser — /docs already carries that cost, and it is not on the marketing path.
 */
export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; attribution: string }
  | { type: "list"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  category: string;
  /** ISO date; formatted at render time. */
  date: string;
  readingMinutes: number;
  /** Team member slug, so the byline links to a real profile. */
  author: string;
  excerpt: string;
  cover: string;
  blocks: PostBlock[];
};

export const postCategories: string[] = data.categories;

export const posts = (data.posts as Post[])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date));

export const getPostBySlug = (slug: string) => posts.find((p) => p.slug === slug);

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPostBySlug(slug);
  if (!current) return posts.slice(0, limit);
  const sameCategory = posts.filter((p) => p.slug !== slug && p.category === current.category);
  const rest = posts.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function formatPostDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
