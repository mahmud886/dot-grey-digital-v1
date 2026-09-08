import { getServiceBySlug, services } from "@/data/services";
import { OG_CONTENT_TYPE, OG_SIZE, shareCard } from "@/lib/og";

export const alt = "Service";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  return shareCard({
    eyebrow: "Service",
    title: service?.title ?? "What we do",
    description: service?.blurb,
    footer: service ? service.tags.join(" · ") : undefined,
  });
}
