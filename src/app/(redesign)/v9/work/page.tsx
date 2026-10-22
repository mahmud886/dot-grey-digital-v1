import type { Metadata } from "next";
import { works } from "@/redesign/content";
import { PageHead } from "@/redesign/v9/Chrome";
import { WorkCatalogue } from "@/redesign/v9/Client";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Work" };

export default function V9Work() {
  const years = works.map((w) => Number(w.year));
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta={`(${String(works.length).padStart(2, "0")}) projects, ${Math.min(...years)}—${Math.max(...years)}`}
        title={
          <>
            Work <G name="asterisk" /> index
          </>
        }
        lede="Every project, one line each. The number on the right is the one the client cared about most."
      />
      <section className={s.sectionTight}>
        <WorkCatalogue works={works} />
      </section>
    </main>
  );
}
