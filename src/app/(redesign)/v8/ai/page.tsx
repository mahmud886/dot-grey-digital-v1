import type { Metadata } from "next";
import Link from "next/link";
import { aiOffer, aiPrinciples, aiWont } from "@/redesign/agency";
import { Footer, PageCover, SecHead } from "@/redesign/v8/Chrome";
import { HalftoneField } from "@/redesign/v8/Client";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "AI & automation" };

export default function V8Ai() {
  return (
    <>
      <main id="main">
        <PageCover
          kicker="AI & automation"
          title="Useful AI."
          lead="Models and automations that do a measurable job inside your product or operations — evaluated before launch, monitored after, and always with a person able to step in."
          aside={
            <p className={s.pageAside}>
              Have a use case? <Link href="/v8/start">Start a project →</Link>
            </p>
          }
        />

        <HalftoneField words={["LLM", "RAG", "Agents", "MLOps"]} caption="Six things we build, one rule: measure it." compact />

        <section className={s.process} aria-labelledby="o-title">
          <SecHead id="o-title" title="What we build." />
          <ol className={s.tileGrid + " " + s.three}>
            {aiOffer.map((o, i) => (
              <li key={o.title}>
                <span className={s.tileKick}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.tileTitle}>
                  {o.title}
                  <span className={s.stop}>.</span>
                </h3>
                <p>{o.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${s.chapterDark} ${s.process}`} aria-labelledby="pr-title">
          <SecHead id="pr-title" title="How we do it." note="Responsible AI, written as things we do rather than things we believe." />
          <ol className={s.tileGrid}>
            {aiPrinciples.map((p, i) => (
              <li key={p.title}>
                <span className={s.tileKick}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.tileTitle}>
                  {p.title}
                  <span className={s.stop}>.</span>
                </h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.process} aria-labelledby="w-title">
          <SecHead id="w-title" title="What we won't." note="Saying no to these is part of the job." />
          <ul className={`${s.checkList} ${s.no}`}>
            {aiWont.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>

        <div className={s.ctaBand}>
          <p>Start with an automation audit.</p>
          <Link href="/v8/engagements" className={s.pillAccent}>
            See Discovery →
          </Link>
        </div>
      </main>
      <Footer signoff="Measured." />
    </>
  );
}
