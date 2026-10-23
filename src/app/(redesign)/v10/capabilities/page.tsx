import type { Metadata } from "next";
import Link from "next/link";
import { allTools, toolPrinciples } from "@/redesign/agency";
import { disciplines } from "@/redesign/content";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import { StackConsole } from "@/redesign/v10/More";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Stack" };

export default function V10Capabilities() {
  const tools = allTools();
  return (
    <Page>
      <PageHero
        kicker={`Kit · ${tools.length} tools across ${disciplines.length} crafts`}
        title="Stack"
        form="software"
        lede="Everything we reach for, in one searchable list. We pick per project — these are the tools we know deeply, not a checklist."
      />
      <section className={s.block} aria-label="Tool search">
        <StackConsole tools={tools} />
      </section>
      <section className={s.block} aria-labelledby="pick-h">
        <SecHead id="pick-h" title="How we choose" />
        <ol className={s.ruleGrid}>
          {toolPrinciples.map((p, i) => (
            <li key={p.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.block} aria-labelledby="craft-h">
        <SecHead id="craft-h" title="By craft" />
        <ul className={s.modules}>
          {disciplines.map((d) => (
            <li key={d.id}>
              <Link href={`/v10/services/${d.id}`} className={s.module}>
                <span className={s.rowNum}>{d.number}</span>
                <span className={s.moduleTitle}>{d.short}</span>
                <span className={s.moduleLine}>{d.stack.join(" · ")}</span>
                <span className={s.moduleCaps}>{d.capabilities.slice(0, 3).join(" · ")}</span>
                <span className={s.moduleGo} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
