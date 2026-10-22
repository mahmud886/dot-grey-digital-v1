import type { Metadata } from "next";
import Link from "next/link";
import { aiOffer, aiPrinciples, aiWont } from "@/redesign/agency";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import m from "@/redesign/v9/more.module.css";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "AI & automation" };

export default function V9Ai() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9/services", label: "Services" }}
        meta="Machine learning, agents, automation"
        title={
          <>
            Useful <G name="flower" /> AI
          </>
        }
        lede="Models where judgement is needed, rules where it is not, and a person who can always override. Measured before it ships, monitored after."
      />
      <section className={s.sectionTight}>
        <ol className={`${s.wrap} ${s.bigList}`}>
          {aiOffer.map((o, i) => (
            <li key={o.title}>
              <div className={s.bigRow}>
                <span className={s.bigNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.bigTitle}>{o.title}</span>
                <span className={s.bigLine}>{o.body}</span>
                <span />
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className={`${s.section} ${s.dark}`}>
        <div className={s.wrap}>
          <SectionHead n="02" title="How we build it" aside={`${aiPrinciples.length} principles`} dark />
          <ul className={m.principles}>
            {aiPrinciples.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className={s.section}>
        <div className={s.wrap}>
          <SectionHead n="03" title="What we won't do" aside="Said plainly" />
          <ol className={m.wont}>
            {aiWont.map((x, i) => (
              <li key={x}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p>
                  <G name="slash" />
                  {x}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <nav className={m.band} aria-label="Next steps">
        <Link href="/v9/services/ml" className={m.bandLink}>
          <span className={s.label}>The discipline</span>
          <b>
            Machine learning <G name="arrow" />
          </b>
          <p>Capabilities, stack and how an ML engagement runs.</p>
        </Link>
        <Link href="/v9/start" className={m.bandLink}>
          <span className={s.label}>Have a use case?</span>
          <b>
            Start a project <G name="arrow" />
          </b>
          <p>A short Discovery is usually the right first step for AI work.</p>
        </Link>
      </nav>
    </main>
  );
}
