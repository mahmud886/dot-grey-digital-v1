import type { Metadata } from "next";
import Link from "next/link";
import { budgetOptions, timelineOptions } from "@/data/site";
import { startNeeds, startStages } from "@/redesign/agency";
import { site } from "@/redesign/content";
import { Footer, PageCover } from "@/redesign/v8/Chrome";
import { Clocks } from "@/redesign/v8/Client";
import { StartWizard } from "@/redesign/v8/More";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Start a project" };

export default function V8Start() {
  return (
    <>
      <main id="main">
        <PageCover kicker="Start a project · 6 short steps" title="Start here." lead="A few questions, one at a time. It takes about two minutes and saves the first call from being twenty questions." />
        <section className={s.startGrid}>
          <StartWizard email={site.email} needs={startNeeds} stages={startStages} budgets={budgetOptions} timelines={timelineOptions} />
          <aside className={s.startAside} aria-label="What happens next">
            <div>
              <p className={s.footHead}>What happens next</p>
              <ol className={s.dashList}>
                <li>We reply within one working day.</li>
                <li>A 30-minute call to understand the problem.</li>
                <li>A written proposal with scope, team and price.</li>
              </ol>
            </div>
            <div>
              <p className={s.footHead}>Rather just write?</p>
              <a href={`mailto:${site.email}`} className={s.contactMail}>
                {site.email}
              </a>
            </div>
            <div>
              <p className={s.footHead}>Still deciding?</p>
              <p className={s.newsNote}>
                See <Link href="/v8/engagements">how engagements work</Link> or <Link href="/v8/process">the process</Link>.
              </p>
            </div>
            <Clocks />
          </aside>
        </section>
      </main>
      <Footer signoff="Over to you." />
    </>
  );
}
