import { getMemberBySlug, team } from "@/data/team";
import { OG_CONTENT_TYPE, OG_SIZE, shareCard } from "@/lib/og";

export const alt = "Team member";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return team.map((member) => ({ slug: member.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = getMemberBySlug(slug);
  return shareCard({
    eyebrow: member?.role ?? "Team",
    title: member?.name ?? "The team",
    description: member?.bio[0],
    footer: "DotGrey Digital",
  });
}
