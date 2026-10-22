import type { Metadata } from "next";
import Link from "next/link";
import { allTools, toolPrinciples } from "@/redesign/agency";
import { disciplines } from "@/redesign/content";
import { Footer, PageCover, SecHead } from "@/redesign/v8/Chrome";
import { StackFilter } from "@/redesign/v8/More";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Capabilities" };

export default function V8Capabilities() {
  const tools = allTools();
  const groups = [...new Set(tools.map((t) => t.group))];
  return (
    <>
      <main id="main">
        <PageCover
          kicker={`Capabilities · ${tools.length} tools`}
          title="The kit."
          lead="Everything we design, build and run with — drawn from our disciplines and the tools named in published case studies."
        />

        <section className={s.indexSec} aria-label="Technology stack">
          <StackFilter tools={tools} groups={groups} />
        </section>

        <section className={`${s.chapterDark} ${s.process}`} aria-labelledby="cap-title">
          <SecHead id="cap-title" title="By craft." note="What each discipline covers, and where to read more." />
          <ol className={s.tileGrid + " " + s.three}>
            {disciplines.map((d) => (
              <li key={d.id}>
                <span className={s.tileKick}>{d.number}</span>
                <h3 className={s.tileTitle}>
                  <Link href={`/v8/services/${d.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {d.title} →
                  </Link>
                </h3>
                <p>{d.capabilities.join(" · ")}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.process} aria-labelledby="p-title">
          <SecHead id="p-title" title="How we choose." note="Four questions every tool has to answer before it goes into your product." />
          <ol className={s.tileGrid}>
            {toolPrinciples.map((p, i) => (
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
      </main>
      <Footer signoff="Built right." />
    </>
  );
}
