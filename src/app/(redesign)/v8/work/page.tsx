import type { Metadata } from "next";
import { works } from "@/redesign/content";
import { Footer, PageCover, WorkGridItem, WorkStackItem } from "@/redesign/v8/Chrome";
import { WorkIndex } from "@/redesign/v8/Client";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Work" };

const CATEGORIES = ["UI/UX", "Web", "Email", "Branding"];

export default function V8Work() {
  return (
    <>
      <main id="main">
        <PageCover kicker={`Work · ${works.length} projects`} title="Shipped." lead="Every project here is live, and every one has a number the client cared about." />
        <section className={s.indexSec} aria-label="All projects">
          <WorkIndex
            categories={CATEGORIES}
            items={works.map((w, i) => ({
              slug: w.slug,
              category: w.category,
              stack: <WorkStackItem work={w} index={i} />,
              grid: <WorkGridItem work={w} index={i} />,
            }))}
          />
        </section>
      </main>
      <Footer signoff="Next?" />
    </>
  );
}
