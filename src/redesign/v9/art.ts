import type { ArtVariant } from "@/redesign/shared/ProjectArt";

/** v9 avoids the poster variant: its heavy sans fights Gloock. Variants rotate by project. */
const ORDER: ArtVariant[] = ["contour", "matrix", "halftone", "rings"];

/** `index` is the project's position in the works list. */
export function artFor(index: number, offset = 0): ArtVariant {
  return ORDER[(Math.max(0, index) + offset) % ORDER.length];
}
