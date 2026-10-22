import type { Metadata } from "next";
import Link from "next/link";
import { aiOffer, aiPrinciples, aiWont } from "@/redesign/agency";
import { Dot, PageHead, SectionHead } from "@/redesign/v11/Chrome";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "AI & automation" };

export default function V11Ai() {
  return (
    <main>
      <PageHead label="AI & automation" title="Useful AI. ● Measured first." lede="Assistants, retrieval, agents and models that do a real job, with evaluation, monitoring and a human who can override them." />

      <section className={s.section} aria-labelledby="ai-build">
        <SectionHead title="What we build" count={aiOffer.length} id="ai-build" />
        <ol className={s.values}>
          {aiOffer.map((o, i) => (
            <li key={o.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.valueTitle}>{o.title}</h3>
              <p>{o.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.dark} aria-labelledby="ai-rules">
        <p className={s.label}>(02) Principles</p>
        <h2 id="ai-rules" className={s.darkTitle}>
          Evaluation first. <Dot /> Always.
        </h2>
        <ol className={s.steps}>
          {aiPrinciples.map((p, i) => (
            <li key={p.title}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.stepTitle}>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section} aria-labelledby="ai-wont">
        <SectionHead title="What we won't do" count={aiWont.length} id="ai-wont" />
        <ol className={s.wont}>
          {aiWont.map((w, i) => (
            <li key={w}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <span>{w}</span>
            </li>
          ))}
        </ol>
        <div className={s.ctaRow}>
          <Link href="/v11/start" className={s.btn}>
            Talk about an AI project <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v11/services/ml" className={s.btnGhost}>
            Machine learning service
          </Link>
          <Link href="/v11/services/automation" className={s.btnGhost}>
            Automation service
          </Link>
        </div>
      </section>
    </main>
  );
}
