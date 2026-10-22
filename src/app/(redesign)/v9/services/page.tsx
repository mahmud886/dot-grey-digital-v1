import type { Metadata } from "next";
import Link from "next/link";
import { disciplines, process } from "@/redesign/content";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Services" };

export default function V9Services() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta="(06) disciplines, one team"
        title={
          <>
            Six crafts <G name="diamond" /> one room
          </>
        }
        lede="Most problems cross a boundary — a design problem that is really a data problem, a workflow that needs a model. So we keep all six under one roof."
      />
      <section className={s.sectionTight}>
        <ol className={`${s.wrap} ${s.bigList}`}>
          {disciplines.map((d) => (
            <li key={d.id}>
              <Link href={`/v9/services/${d.id}`} className={s.bigRow}>
                <span className={s.bigNum}>{d.number}</span>
                <span className={s.bigTitle}>{d.short}</span>
                <span className={s.bigLine}>{d.line}</span>
                <span className={s.bigArrow}>
                  <G name="arrow" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className={`${s.section} ${s.dark}`}>
        <div className={s.wrap}>
          <SectionHead n="02" title="How a project moves" aside="Weekly loops" dark />
          <ol className={s.steps}>
            {process.map((p, i) => (
              <li key={p.title} className={s.step}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.stepTitle}>{p.title}</h3>
                <p className={s.stepBody}>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
