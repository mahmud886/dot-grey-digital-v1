import type { Metadata } from "next";
import { works } from "@/redesign/content";
import { Em, Footer } from "@/redesign/v13/Chrome";
import { PageHead, WorkCard, WorkRow } from "@/redesign/v13/Bits";
import { WorkIndex } from "@/redesign/v13/Pages";
import s from "@/redesign/v13/pages.module.css";

export const metadata: Metadata = { title: "Work" };

const CATEGORIES = ["UI/UX", "Web", "Email", "Branding"];

export default function V13Work() {
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
