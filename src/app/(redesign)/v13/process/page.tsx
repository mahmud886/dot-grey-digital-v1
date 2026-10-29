import type { Metadata } from "next";
import { fromYou, rhythm, stages } from "@/redesign/agency";
import { Closing, Head } from "@/redesign/v13/Bits";
import { Em, Footer } from "@/redesign/v13/Chrome";
import { PageHead } from "@/redesign/v13/Bits";
import { StageTracker } from "@/redesign/v13/More";
import s from "@/redesign/v13/pages.module.css";

export const metadata: Metadata = { title: "Process" };

export default function V13Process() {
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="How it goes."
        label="Process — five stages"
        title={
          <>
            How it <Em>moves.</Em>
          </>
        }
        lead="Five stages, run in weekly loops. You see working software from the second week, and every stage ends with something you own."
      />

      <section className={`${s.wrap} ${s.sectionTight}`} aria-label="The stages">
        <StageTracker stages={stages} />
      </section>

      <section className={s.dark} aria-labelledby="rhythm">
        <div className={s.wrap}>
          <Head id="rhythm" label="Every week" title="A steady" turn="rhythm." />
          <ol className={s.approachDark}>
            {rhythm.map((r, i) => (
              <li key={r.when}>
                <svg viewBox="0 0 120 120" className={s.rings} aria-hidden="true">
                  {Array.from({ length: 4 }, (_, k) => (
                    <circle key={k} cx="60" cy="60" r={16 + k * 13} data-on={k <= i} />
                  ))}
                </svg>
                <h3>{r.when}</h3>
                <p>{r.what}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${s.wrap} ${s.section} ${s.twoUp}`} aria-labelledby="you">
        <Head id="you" label="What we need from you" title="Four small" turn="things." />
        <ul className={s.bigList}>
          {fromYou.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <Closing title="Ready when you" turn="are." secondary={{ href: "/v13/engagements", label: "How engagements work" }} />
    </main>
      <Footer signoff="See you." />
    </>
  );
}
