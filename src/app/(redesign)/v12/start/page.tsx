import type { Metadata } from "next";
import Link from "next/link";
import { budgetOptions, timelineOptions } from "@/data/site";
import { startNeeds, startStages } from "@/redesign/agency";
import { site } from "@/redesign/content";
import { Em, PageHead } from "@/redesign/v12/Chrome";
import { LocalHello } from "@/redesign/v12/Client";
import { StartWizard } from "@/redesign/v12/More";
import s from "@/redesign/v12/v12.module.css";

export const metadata: Metadata = { title: "Start a project" };

export default function V12Start() {
  return (
    <main>
      <PageHead
        label="Start a project — six short steps"
        title={
          <>
            Start <Em>here.</Em>
          </>
        }
        lead="A few questions, one at a time. About two minutes, and it saves the first call from being twenty questions."
      >
        <LocalHello />
      </PageHead>
      <section className={`${s.wrap} ${s.sectionTight} ${s.contactGrid}`}>
        <StartWizard email={site.email} needs={startNeeds} stages={startStages} budgets={budgetOptions} timelines={timelineOptions} />
        <aside className={s.contactAside} aria-label="What happens next">
          <div>
            <p className={s.label}>What happens next</p>
            <ol className={s.nextSteps}>
              <li>We reply within one working day.</li>
              <li>A 30-minute call to understand the problem.</li>
              <li>A written proposal with scope, team and price.</li>
            </ol>
          </div>
          <div>
            <p className={s.label}>Rather just write?</p>
            <a href={`mailto:${site.email}`} className={s.mail}>
              {site.email}
            </a>
          </div>
          <div>
            <p className={s.label}>Still deciding?</p>
            <p className={s.note}>
              See <Link href="/v12/engagements">how engagements work</Link> or <Link href="/v12/process">the process</Link>.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
