import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Reads the repository's markdown docs at build time so they can be browsed at /docs.
 * Every docs page is statically prerendered, so the filesystem is only touched during
 * `next build` — nothing here runs at request time.
 */
export type DocMeta = {
  slug: string;
  /** Path relative to the repo root, shown to the reader. */
  file: string;
  /** Short label for the sidebar and cards. */
  label: string;
};

// Scoped to the docs/ folder so the bundler traces only those files into the server
// output rather than the whole project. The root README needs its own literal path.
const readDoc = (file: string) => readFileSync(join(process.cwd(), "docs", file), "utf8");
const readRootReadme = () => readFileSync(join(process.cwd(), "README.md"), "utf8");

/**
 * Explicit list rather than a directory scan, so ordering and slugs are intentional — and
 * so every path the build reads is a literal. A computed path makes the bundler trace the
 * entire project into the server output.
 */
const SOURCES = [
  { slug: "readme", file: "docs/README.md", label: "Overview", read: () => readDoc("README.md") },
  { slug: "project-readme", file: "README.md", label: "Project README", read: () => readRootReadme() },
  { slug: "00-brand", file: "docs/00-brand.md", label: "Brand & tokens", read: () => readDoc("00-brand.md") },
  { slug: "01-sitemap", file: "docs/01-sitemap.md", label: "Sitemap & routes", read: () => readDoc("01-sitemap.md") },
  { slug: "02-sections", file: "docs/02-sections.md", label: "Sections", read: () => readDoc("02-sections.md") },
  { slug: "03-components", file: "docs/03-components.md", label: "Components", read: () => readDoc("03-components.md") },
  { slug: "04-motion", file: "docs/04-motion.md", label: "Motion", read: () => readDoc("04-motion.md") },
  { slug: "05-content", file: "docs/05-content.md", label: "Content", read: () => readDoc("05-content.md") },
  { slug: "06-cms", file: "docs/06-cms.md", label: "CMS", read: () => readDoc("06-cms.md") },
  { slug: "07-cms-setup", file: "docs/07-cms-setup.md", label: "CMS setup", read: () => readDoc("07-cms-setup.md") },
  { slug: "08-golive-checklist", file: "docs/08-golive-checklist.md", label: "Go-live checklist", read: () => readDoc("08-golive-checklist.md") },
] as const;

export const DOC_SOURCES: DocMeta[] = SOURCES.map(({ slug, file, label }) => ({ slug, file, label }));

export type Doc = DocMeta & {
  title: string;
  summary: string;
  body: string;
  headings: { id: string; text: string }[];
};

/** Mirrors the slugger used when rendering headings, so contents links resolve. */
export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripMarkdown(line: string) {
  return line
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .trim();
}

export function getDoc(slug: string): Doc | undefined {
  const source = SOURCES.find((d) => d.slug === slug);
  if (!source) return undefined;

  const meta: DocMeta = { slug: source.slug, file: source.file, label: source.label };
  const raw = source.read();
  const lines = raw.split("\n");

  const titleLine = lines.find((line) => line.startsWith("# "));
  const title = titleLine ? stripMarkdown(titleLine.slice(2)) : meta.label;

  // First real paragraph after the H1, used as the card description.
  const afterTitle = titleLine ? lines.slice(lines.indexOf(titleLine) + 1) : lines;
  const summaryLine = afterTitle.find(
    (line) => line.trim() && !line.startsWith("#") && !line.startsWith("|") && !line.startsWith("```"),
  );
  const summary = summaryLine ? stripMarkdown(summaryLine) : "";

  // H2s only — deeper levels would make the contents list noisier than the page.
  let inFence = false;
  const headings: { id: string; text: string }[] = [];
  for (const line of lines) {
    if (line.startsWith("```")) inFence = !inFence;
    if (inFence || !line.startsWith("## ")) continue;
    const text = stripMarkdown(line.slice(3));
    headings.push({ id: slugifyHeading(text), text });
  }

  // The H1 is rendered by the page header, so drop it from the body.
  const body = titleLine ? raw.replace(titleLine, "").trimStart() : raw;

  return { ...meta, title, summary, body, headings };
}

export function getAllDocs(): Doc[] {
  return DOC_SOURCES.map((meta) => getDoc(meta.slug)).filter((d): d is Doc => Boolean(d));
}

/** Rewrites links between docs so they work as routes. */
export function resolveDocHref(href: string): string | null {
  if (/^(https?:|mailto:|#)/.test(href)) return href;

  const cleaned = href.replace(/^\.\//, "").replace(/^\.\.\//, "").replace(/^docs\//, "");
  const match = DOC_SOURCES.find(
    (d) => d.file.endsWith(`/${cleaned}`) || d.file === cleaned || `${d.slug}.md` === cleaned,
  );

  return match ? `/docs/${match.slug}` : null;
}
