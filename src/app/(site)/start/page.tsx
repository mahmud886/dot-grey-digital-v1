import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { budgetOptions, timelineOptions } from "@/data/site";
import { startNeeds, startStages } from "@/site/agency";
import { site } from "@/site/content";
import { Em, Footer } from "@/site/Chrome";
import { PageHead } from "@/site/Bits";
import { LocalHello } from "@/site/Pages";
import { StartWizard } from "@/site/More";
import s from "@/site/pages.module.css";

export const metadata: Metadata = pageMeta({ title: "Start a project", description: "A six-step brief: tell us what you need, your stage, budget and timing, and we will reply within a day.", path: "/start" });

export default function StartPage() {
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="Start here."
        label="Start a project — six short steps"
        title={
          <>
            Six short steps, <Em>about two minutes.</Em>
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
              See <Link href="/engagements">how engagements work</Link> or <Link href="/process">the process</Link>.
            </p>
          </div>
        </aside>
      </section>
    </main>
      <Footer signoff="Go on." />
    </>
  );
}
