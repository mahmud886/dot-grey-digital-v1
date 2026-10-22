import type { Metadata } from "next";
import Link from "next/link";
import { fromYou, rhythm, stages } from "@/redesign/agency";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import { StageIndex } from "@/redesign/v9/More";
import m from "@/redesign/v9/more.module.css";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Process" };

export default function V9Process() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta={`(${String(stages.length).padStart(2, "0")}) stages, weekly loops`}
        title={
          <>
            How a project <G name="wave" /> moves
          </>
        }
        lede="Five stages, run in short loops. You see working software from the second week, and every stage ends with something you own."
      />
      <section className={s.sectionTight}>
        <div className={s.wrap}>
          <StageIndex stages={stages} />
        </div>
      </section>
      <section className={`${s.section} ${s.dark}`}>
        <div className={s.wrap}>
          <SectionHead n="02" title="The weekly rhythm" aside="Same every week" dark />
          <ul className={m.rhythm}>
            {rhythm.map((r) => (
              <li key={r.when}>
                <span className={m.rhythmKey}>{r.when}</span>
                <p className={m.rhythmVal}>{r.what}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className={s.section}>
        <div className={s.wrap}>
          <SectionHead n="03" title="What we need from you" aside={`${fromYou.length} things`} />
          <ol className={m.notesList}>
            {fromYou.map((x, i) => (
              <li key={x}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {x}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <nav className={m.band} aria-label="Next steps">
        <Link href="/v9/engagements" className={m.bandLink}>
          <span className={s.label}>How we work together</span>
          <b>
            Engagements <G name="arrow" />
          </b>
          <p>Discovery, Sprint, Product team or Embedded squad — and how each is priced.</p>
        </Link>
        <Link href="/v9/start" className={m.bandLink}>
          <span className={s.label}>Ready when you are</span>
          <b>
            Start a project <G name="arrow" />
          </b>
          <p>Six short questions. Your answers open as an email to us.</p>
        </Link>
      </nav>
    </main>
  );
}
