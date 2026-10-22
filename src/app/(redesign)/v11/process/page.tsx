import type { Metadata } from "next";
import Link from "next/link";
import { fromYou, rhythm, stages } from "@/redesign/agency";
import { Dot, PageHead, SectionHead } from "@/redesign/v11/Chrome";
import { StageTracker } from "@/redesign/v11/More";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Process" };

export default function V11Process() {
  return (
    <main>
      <PageHead label="Process ● Five stages" title="How it goes. ● Every week." lede="Discover, design, build, automate, measure. Short loops, working software from week two, and a number we agree to move." count={stages.length} />

      <section className={s.sectionTight} aria-label="Stages">
        <StageTracker stages={stages} />
      </section>

      <section className={s.dark} aria-labelledby="rhythm">
        <p className={s.label}>(02) The week</p>
        <h2 id="rhythm" className={s.darkTitle}>
          Demos, <Dot /> not decks.
        </h2>
        <ol className={s.steps}>
          {rhythm.map((r, i) => (
            <li key={r.when}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.stepTitle}>{r.when}</h3>
              <p>{r.what}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section} aria-labelledby="from-you">
        <SectionHead title="What we need from you" count={fromYou.length} id="from-you" />
        <ol className={s.capList}>
          {fromYou.map((x, i) => (
            <li key={x}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <span>{x}</span>
            </li>
          ))}
        </ol>
        <div className={s.ctaRow}>
          <Link href="/v11/start" className={s.btn}>
            Start a project <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v11/engagements" className={s.btnGhost}>
            See engagements
          </Link>
        </div>
      </section>
    </main>
  );
}
