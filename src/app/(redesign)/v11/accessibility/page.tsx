import type { Metadata } from "next";
import { accessibility } from "@/redesign/agency";
import { site } from "@/redesign/content";
import { PageHead, SectionHead } from "@/redesign/v11/Chrome";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Accessibility" };

export default function V11Accessibility() {
  return (
    <main>
      <PageHead label="Legal ● Accessibility" title="For everyone. ● On purpose." lede={`We aim for ${accessibility.standard}. Here is what this site does, and where it still falls short.`} />
      <section className={s.twoCol}>
        <div>
          <SectionHead title="What's done" count={accessibility.done.length} />
          <ul className={s.plainList}>
            {accessibility.done.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHead title="Known limits" count={accessibility.limits.length} />
          <ul className={s.plainList}>
            {accessibility.limits.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className={s.sectionTight}>
        <p className={s.bodyLg}>
          Something hard to use? Write to <a href={`mailto:${site.email}?subject=${encodeURIComponent("Accessibility")}`}>{site.email}</a> and we will fix it or send you the content another way.
        </p>
      </section>
    </main>
  );
}
