import type { Metadata } from "next";
import Link from "next/link";
import { fromYou, rhythm, stages } from "@/redesign/agency";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import { StageTimeline } from "@/redesign/v10/More";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Process" };

export default function V10Process() {
  return (
    <Page>
      <PageHero
        kicker={`Runtime · ${stages.length} stages, weekly loops`}
        title="Process"
        form="automation"
        lede="Five stages, run in weekly loops. You see working software from week two, and every stage ends with something you own."
      />

      <section className={s.block} aria-label="Stages">
        <StageTimeline stages={stages} />
      </section>

      <section className={`${s.block} ${s.twoCol}`} aria-labelledby="rhythm-h">
        <div>
          <SecHead id="rhythm-h" title="Weekly" note="The same rhythm on every project, so nobody has to ask how it's going." />
          <ol className={s.list}>
            {rhythm.map((r, i) => (
              <li key={r.when}>
                <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                <b>{r.when}</b> — {r.what}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <SecHead id="you-h" title="From you" note="What makes a project go fast." />
          <ol className={s.list}>
            {fromYou.map((r, i) => (
              <li key={r}>
                <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                {r}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={s.block} aria-label="Next">
        <div className={s.ctaBand}>
          <p className={s.kicker}>Choose a way to start</p>
          <Link href="/v10/engagements" className={s.nextLink}>
            Engagements <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v10/start" className={s.cta}>
            Start a project <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </Page>
  );
}
