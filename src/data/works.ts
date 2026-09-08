import data from "@/content/works.json";

export type WorkStat = { value: string; label: string };
export type WorkCategory = "UI/UX" | "Web" | "Email" | "Branding";

export type Work = {
  slug: string;
  title: string;
  year: string;
  category: WorkCategory;
  client: string;
  summary: string;
  tags: string[];
  services: string[];
  cover: string;
  gallery: string[];
  challenge: string;
  solution: string;
  stats: WorkStat[];
  quote: { text: string; author: string; role: string };
};

export const workCategories: string[] = data.categories;

// JSON widens `category` to string, so assert back to the union the filter relies on.
export const works = data.works as Work[];

export const getWorkBySlug = (slug: string) => works.find((w) => w.slug === slug);

export function getNextWork(slug: string) {
  const i = works.findIndex((w) => w.slug === slug);
  if (i === -1) return works[0];
  return works[(i + 1) % works.length];
}
