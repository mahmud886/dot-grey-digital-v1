import type { Metadata } from "next";
import { works } from "@/redesign/content";
import { Page, PageHero } from "@/redesign/v10/Chrome";
import { WorkCatalogue } from "@/redesign/v10/Client";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Work" };

export default function V10Work() {
  return (
    <Page>
      <PageHero kicker={`Index · ${String(works.length).padStart(2, "0")} case files`} title="Work" form="data" lede="Every project here shipped, and every one has the number the client cared about." />
      <section className={s.block} aria-label="Projects">
        <WorkCatalogue works={works} />
      </section>
    </Page>
  );
}
