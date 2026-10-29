import type { Metadata } from "next";
import Link from "next/link";
import { budgetOptions, timelineOptions } from "@/data/site";
import { startNeeds, startStages } from "@/redesign/agency";
import { site } from "@/redesign/content";
import { Em, Footer } from "@/redesign/v13/Chrome";
import { PageHead } from "@/redesign/v13/Bits";
import { LocalHello } from "@/redesign/v13/Pages";
import { StartWizard } from "@/redesign/v13/More";
import s from "@/redesign/v13/pages.module.css";

export const metadata: Metadata = { title: "Start a project" };

export default function V13Start() {
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
              See <Link href="/v13/engagements">how engagements work</Link> or <Link href="/v13/process">the process</Link>.
            </p>
          </div>
        </aside>
      </section>
    </main>
      <Footer signoff="Go on." />
    </>
  );
}
