import { getWorkBySlug, works } from "@/data/works";
import { OG_CONTENT_TYPE, OG_SIZE, shareCard } from "@/lib/og";

export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  return shareCard({
    eyebrow: work ? `${work.category} · ${work.year}` : "Case study",
    title: work?.title ?? "Selected work",
    description: work?.summary,
    footer: work ? work.services.join(" · ") : undefined,
  });
}
