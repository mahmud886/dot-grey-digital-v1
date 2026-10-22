import type { Metadata } from "next";
import { allTools, toolPrinciples } from "@/redesign/agency";
import { disciplines } from "@/redesign/content";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import { StackIndex } from "@/redesign/v9/More";
import m from "@/redesign/v9/more.module.css";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Capabilities" };

export default function V9Capabilities() {
  const tools = allTools();
  const groups = [...new Set([...disciplines.map((d) => d.short), ...tools.map((t) => t.group)])].filter((g) => tools.some((t) => t.group === g));
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9/services", label: "Services" }}
        meta={`(${tools.length}) tools in the index`}
        title={
          <>
            The kit <G name="plus" /> in full
          </>
        }
        lede="Every tool named in our disciplines and in published case studies, indexed. Search it, or filter by craft."
      />
      <section className={s.sectionTight}>
        <div className={s.wrap}>
          <StackIndex tools={tools} groups={groups} />
        </div>
      </section>
      <section className={`${s.section} ${s.dark}`}>
        <div className={s.wrap}>
          <SectionHead n="02" title="How we choose tools" aside={`${toolPrinciples.length} rules`} dark />
          <ul className={m.principles}>
            {toolPrinciples.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
