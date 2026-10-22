import type { Metadata } from "next";
import Link from "next/link";
import { works } from "@/redesign/content";
import { ProjectArt, type ArtVariant } from "@/redesign/shared/ProjectArt";
import { PageHead } from "@/redesign/v11/Chrome";
import { Filtered } from "@/redesign/v11/Client";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Work" };

const VARIANTS: ArtVariant[] = ["poster", "halftone", "contour", "rings", "matrix", "halftone"];

export default function V11Work() {
  const categories = [...new Set(works.map((w) => w.category))];
  return (
    <main>
      <PageHead label="Work" title="Work that ● ships." count={works.length} lede="Every project here is live, and every one has a number the client cared about. Filter by craft." />
      <section className={s.sectionTight}>
        <Filtered
          label="Filter work by category"
          categories={categories}
          className={s.workGrid}
          items={works.map((w, i) => {
            const light = i % 3 === 1;
            return {
              key: w.slug,
              category: w.category,
              node: (
                <Link href={`/v11/work/${w.slug}`} className={s.workCard}>
                  <span className={s.workArt}>
                    <ProjectArt
                      slug={w.slug}
                      label={w.client}
                      variant={VARIANTS[i % VARIANTS.length]}
                      ink={light ? "var(--art-l-ink)" : "var(--art-d-ink)"}
                      paper={light ? "var(--art-l-paper)" : "var(--art-d-paper)"}
                      ratio={0.78}
                    />
                    <span className={s.engStat}>
                      <b>{w.stats[0].value}</b>
                      <small>{w.stats[0].label}</small>
                    </span>
                  </span>
                  <span className={s.fourMeta}>
                    <span className={s.fourNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={s.fourTitle}>{w.title}</span>
                    <span className={s.fourCat}>
                      {w.category} ● {w.year}
                    </span>
                  </span>
                </Link>
              ),
            };
          })}
        />
      </section>
    </main>
  );
}
