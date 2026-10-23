import type { Metadata } from "next";
import Link from "next/link";
import { howWeWork, rituals } from "@/redesign/agency";
import { benefits, values } from "@/redesign/content";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Inside" };

export default function V10Culture() {
  return (
    <Page>
      <PageHero
        kicker="Culture · how the studio actually runs"
        title="Inside"
        form="design"
        lede="A small, senior team in Dhaka and across time zones. Here is how we work together — the rituals, the rules and what we offer the people who join."
      />
      <section className={s.block} aria-labelledby="how-h">
        <SecHead id="how-h" title="How" />
        <div className={s.threeCol}>
          {howWeWork.map((h, i) => (
            <div key={h.title}>
              <p className={s.label}>{String(i + 1).padStart(2, "0")}</p>
              <p className={s.readout}>{h.title}</p>
              <div className={s.readSm}>
                <p>{h.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className={s.block} aria-labelledby="rit-h">
        <SecHead id="rit-h" title="Rituals" />
        <ol className={s.steps}>
          {rituals.map((r, i) => (
            <li key={r.title}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.block} aria-labelledby="val-h">
        <SecHead id="val-h" title="Values" note="The six we use to decide." />
        <ol className={s.ruleGrid}>
          {values.map((v, i) => (
            <li key={v.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.block} aria-labelledby="perk-h">
        <SecHead id="perk-h" title="Perks" />
        <ol className={s.ruleGrid}>
          {benefits.map((b, i) => (
            <li key={b.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.block} aria-label="Careers">
        <div className={s.ctaBand}>
          <p className={s.kicker}>Want in?</p>
          <Link href="/v10/about" className={s.nextLink}>
            Meet the crew <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v10/careers" className={s.cta}>
            Open roles <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </Page>
  );
}
