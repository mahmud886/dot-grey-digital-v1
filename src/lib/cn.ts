import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge cannot know our custom `--text-*` and `--color-*` tokens, so by default it
 * reads `text-h1` as a colour and lets `text-fg` override it — silently dropping the font
 * size. Teaching it both scales keeps `cn("text-h1", "text-fg")` producing both classes.
 * If you add a token to either scale in globals.css, add it here too.
 */
const FONT_SIZES = ["display-1", "display-2", "h1", "h2", "h3", "body-lg", "eyebrow"];

const COLORS = [
  "bg",
  "bg-elev",
  "bg-card",
  "fg",
  "fg-muted",
  "fg-subtle",
  "line",
  "line-strong",
  "accent",
  "accent-strong",
  "accent-fg",
  "accent-dim",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
      "text-color": [{ text: COLORS }],
      "bg-color": [{ bg: COLORS }],
      "border-color": [{ border: COLORS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
