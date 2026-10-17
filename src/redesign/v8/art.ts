import type { ArtVariant } from "@/redesign/shared/ProjectArt";
import { works } from "@/redesign/content";

const ORDER: ArtVariant[] = ["halftone", "contour", "rings", "matrix", "poster"];

/** Each project keeps one art style across the reel and its case study. */
export function variantFor(slug: string, offset = 0): ArtVariant {
  const i = Math.max(0, works.findIndex((w) => w.slug === slug));
  return ORDER[(i + offset) % ORDER.length];
}
