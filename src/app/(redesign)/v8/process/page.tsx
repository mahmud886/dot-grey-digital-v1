import type { Metadata } from "next";
import Link from "next/link";
import { fromYou, rhythm, stages } from "@/redesign/agency";
import { Footer, PageCover, SecHead } from "@/redesign/v8/Chrome";
import { StageTracker } from "@/redesign/v8/More";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Process" };

export default function V8Process() {
  return (
    <>
      <main id="main">
        <PageCover
          kicker={`Process · ${stages.length} stages`}
          title="How it goes."
          lead="Five stages, run in short loops. You see working software from the second week, and every stage ends with something you can keep."
          aside={
            <p className={s.pageAside}>
              Ready? <Link href="/v8/start">Start a project →</Link>
            </p>
          }
        />

        <StageTracker stages={stages} />

        <section className={`${s.chapterDark} ${s.process}`} aria-labelledby="r-title">
          <SecHead id="r-title" title="Every week." note="The rhythm doesn't change between projects, so you always know what happens next." />
          <ol className={s.tileGrid}>
            {rhythm.map((r) => (
              <li key={r.when}>
                <span className={s.tileKick}>{r.when}</span>
                <p>{r.what}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.process} aria-labelledby="y-title">
          <SecHead id="y-title" title="From you." note="Projects stall on access and decisions, not on design or code. This is what keeps them moving." />
          <ul className={s.checkList}>
            {fromYou.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>

        <div className={s.ctaBand}>
          <p>Which shape fits your project?</p>
          <Link href="/v8/engagements" className={s.pillAccent}>
            Ways to work with us →
          </Link>
        </div>
      </main>
      <Footer signoff="Onwards." />
    </>
  );
}
