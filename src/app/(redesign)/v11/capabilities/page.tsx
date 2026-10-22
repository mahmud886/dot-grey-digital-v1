import type { Metadata } from "next";
import { allTools, toolPrinciples } from "@/redesign/agency";
import { Dot, PageHead } from "@/redesign/v11/Chrome";
import { StackFilter } from "@/redesign/v11/More";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Capabilities" };

export default function V11Capabilities() {
  const tools = allTools();
  const groups = [...new Set(tools.map((t) => t.group))];
  return (
    <main>
      <PageHead label="Capabilities ● The kit" title="The kit. ● Chosen to last." lede="Every tool named in our services and published work, in one place. Search it, filter it, ask us about anything missing." count={tools.length} />
      <section className={s.sectionTight} aria-label="Tool stack">
        <StackFilter tools={tools} groups={groups} />
      </section>
      <section className={s.dark} aria-labelledby="choose">
        <p className={s.label}>(02) How we choose</p>
        <h2 id="choose" className={s.darkTitle}>
          Boring where it counts. <Dot />
        </h2>
        <ol className={s.steps}>
          {toolPrinciples.map((p, i) => (
            <li key={p.title}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.stepTitle}>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
