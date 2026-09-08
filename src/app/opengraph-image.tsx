import { site } from "@/data/site";
import { OG_CONTENT_TYPE, OG_SIZE, shareCard } from "@/lib/og";

export const alt = `${site.name} — ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return shareCard({
    title: site.tagline,
    description: site.description,
    footer: "UI/UX · Web · Email · Banner ads · Veeva · Motion",
  });
}
