import type { Metadata } from "next";
import Link from "next/link";
import { disciplines, process } from "@/redesign/content";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Services" };

export default function V10Services() {
  return (
    <Page>
      <PageHero
        kicker="Modules · 06 loaded"
        title="Services"
        form="software"
        lede="Six crafts in one system. Most problems cross at least two of them, so one team runs all six."
      />
      <section className={s.block} aria-label="All services">
        <ol className={s.modules}>
          {disciplines.map((d) => (
            <li key={d.id}>
              <Link href={`/v10/services/${d.id}`} className={s.module}>
                <span className={s.rowNum}>{d.number}</span>
                <span className={s.moduleTitle}>{d.short}</span>
                <span className={s.moduleLine}>{d.line}</span>
                <span className={s.moduleCaps}>{d.capabilities.slice(0, 3).join(" · ")}</span>
                <span className={s.moduleGo} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.block} aria-labelledby="run-h">
        <SecHead id="run-h" title="Runtime" note="Five stages, in weekly loops. You see working software from week two." />
        <ol className={s.pipeline}>
          {process.map((p, i) => (
            <li key={p.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </Page>
  );
}
