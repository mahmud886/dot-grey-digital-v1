import type { Metadata } from "next";
import Link from "next/link";
import { aiOffer, aiPrinciples, aiWont } from "@/redesign/agency";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "AI & automation" };

export default function V10Ai() {
  return (
    <Page>
      <PageHero
        kicker="Models · evaluated, monitored, overridable"
        title="Useful AI"
        form="ml"
        lede="Language models, retrieval, agents and automation — built into the tools your team already uses, measured before and after launch."
      />
      <section className={s.block} aria-labelledby="build-h">
        <SecHead id="build-h" title="We build" note="Six kinds of work, usually combined." />
        <ol className={s.ruleGrid}>
          {aiOffer.map((o, i) => (
            <li key={o.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{o.title}</h3>
              <p>{o.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.block} aria-labelledby="rules-h">
        <SecHead id="rules-h" title="Rules" note="Applied to every AI feature we ship." />
        <ol className={s.steps}>
          {aiPrinciples.map((p, i) => (
            <li key={p.title}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.block} aria-labelledby="wont-h">
        <div className={s.console}>
          <p className={s.consoleBar}>
            <span>policy --deny</span>
            <span>{aiWont.length} rules</span>
          </p>
          <div className={s.consoleBody}>
            <h2 id="wont-h" className={s.xWizHead}>
              What we won&apos;t do<span className={s.acc}>.</span>
            </h2>
            <ul className={s.xDeny}>
              {aiWont.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className={s.block} aria-label="Next">
        <div className={s.ctaBand}>
          <p className={s.kicker}>Have a process that should run itself?</p>
          <Link href="/v10/services/ml" className={s.nextLink}>
            ML &amp; AI module <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v10/start" className={s.cta}>
            Start a project <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </Page>
  );
}
