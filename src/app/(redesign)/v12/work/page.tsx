import type { Metadata } from "next";
import { works } from "@/redesign/content";
import { Em, PageHead, WorkCard, WorkRow } from "@/redesign/v12/Chrome";
import { WorkIndex } from "@/redesign/v12/Client";
import s from "@/redesign/v12/v12.module.css";

export const metadata: Metadata = { title: "Work" };

const CATEGORIES = ["UI/UX", "Web", "Email", "Branding"];

export default function V12Work() {
  return (
    <main>
      <PageHead
        label="Work — 2023 to 2025"
        title={
          <>
            Ambition, <Em>in practice.</Em>
          </>
        }
        lead="Nine projects, each with the one number the client cared about most."
      />
      <section className={`${s.wrap} ${s.sectionTight}`}>
        <WorkIndex
          categories={CATEGORIES}
          items={works.map((w, i) => ({
            slug: w.slug,
            category: w.category,
            card: <WorkCard work={w} index={i} />,
            row: <WorkRow work={w} index={i} />,
          }))}
        />
      </section>
    </main>
  );
}
