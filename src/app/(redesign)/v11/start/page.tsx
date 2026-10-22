import type { Metadata } from "next";
import { budgetOptions, timelineOptions } from "@/data/site";
import { startNeeds, startStages } from "@/redesign/agency";
import { site } from "@/redesign/content";
import { PageHead } from "@/redesign/v11/Chrome";
import { StartWizard } from "@/redesign/v11/More";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Start a project" };

export default function V11Start() {
  return (
    <main>
      <PageHead label="Start a project ● Six questions" title="Start here. ● Two minutes." lede="Six short questions. At the end your email app opens with the answers; we reply within a working day." />
      <section className={s.sectionTight} aria-label="Project wizard">
        <StartWizard email={site.email} needs={startNeeds} stages={startStages} budgets={budgetOptions} timelines={timelineOptions} />
      </section>
    </main>
  );
}
