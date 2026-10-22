import type { Metadata } from "next";
import { startNeeds, startStages } from "@/redesign/agency";
import { site } from "@/redesign/content";
import { budgetOptions, timelineOptions } from "@/data/site";
import { PageHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import { StartIndex } from "@/redesign/v9/More";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Start a project" };

export default function V9Start() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta="(06) questions, two minutes"
        title={
          <>
            Start <G name="asterisk" /> here
          </>
        }
        lede={
          <>
            Six short questions, one at a time. At the end your answers open as an email to us — nothing is stored on this site. Rather talk? Write to{" "}
            <a href={`mailto:${site.email}`} className={s.asideLink}>
              {site.email}
            </a>
            .
          </>
        }
      />
      <section className={s.sectionTight}>
        <div className={s.wrap}>
          <StartIndex email={site.email} needs={startNeeds} stages={startStages} budgets={budgetOptions} timelines={timelineOptions} />
        </div>
      </section>
    </main>
  );
}
