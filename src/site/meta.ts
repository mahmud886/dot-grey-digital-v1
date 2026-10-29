import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Per-page metadata: title, description, canonical URL and the matching Open Graph card.
 * Open Graph and Twitter are replaced, not merged, by child metadata, so the site-level
 * fields and the share image (src/app/opengraph-image.tsx) are repeated here.
 */
const IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — design, software, automation, data and AI` };

export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const ogTitle = title ? `${title} — ${site.name}` : `${site.name} — design, software, automation, data and AI`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, locale: "en_US", title: ogTitle, description, url: path, images: [IMAGE] },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [IMAGE.url] },
  };
}
