import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import { works } from "@/site/content";
import { Em, Footer } from "@/site/Chrome";
import { PageHead, WorkCard, WorkRow } from "@/site/Bits";
import { WorkIndex } from "@/site/Pages";
import s from "@/site/pages.module.css";

export const metadata: Metadata = pageMeta({ title: "Work", description: "Selected projects from DotGrey Digital, each with the one number the client cared about most.", path: "/work" });

const CATEGORIES = ["UI/UX", "Web", "Email", "Branding"];

export default function WorkPage() {
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="Shipped."
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
      <Footer signoff="Next?" />
    </>
  );
}
