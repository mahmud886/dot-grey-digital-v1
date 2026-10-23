import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/redesign/content";
import { budgetOptions, timelineOptions } from "@/data/site";
import { startNeeds, startStages } from "@/redesign/agency";
import { Page, PageHero } from "@/redesign/v10/Chrome";
import { StartWizard } from "@/redesign/v10/More";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Start a project" };

export default function V10Start() {
  return (
    <Page>
      <PageHero
        kicker="Boot · six questions, about two minutes"
        title="Start"
        form="hero"
        lede="Answer six short prompts. At the end your email app opens with the brief filled in — nothing is stored on this site."
      />
      <section className={`${s.block} ${s.xWizWrap}`} aria-label="Project wizard">
        <StartWizard
          email={site.email}
          needs={startNeeds}
          stages={startStages}
          budgets={budgetOptions}
          timelines={timelineOptions}
        />
        <aside className={s.xAside}>
          <p className={s.label}>Prefer to write?</p>
          <p>
            <a className={s.inlineLink} href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <p className={s.label}>Not sure what you need?</p>
          <p>
            Read the <Link className={s.inlineLink} href="/v10/engagements">engagement modes</Link> or the{" "}
            <Link className={s.inlineLink} href="/v10/process">
              process
            </Link>
            .
          </p>
        </aside>
      </section>
    </Page>
  );
}
