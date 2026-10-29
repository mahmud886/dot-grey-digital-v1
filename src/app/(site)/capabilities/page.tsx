import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import { allTools, toolPrinciples } from "@/site/agency";
import { disciplines } from "@/site/content";
import { Closing, Head } from "@/site/Bits";
import { Em, Footer } from "@/site/Chrome";
import { PageHead } from "@/site/Bits";
import { StackFilter } from "@/site/More";
import s from "@/site/pages.module.css";

export const metadata: Metadata = pageMeta({ title: "Capabilities", description: "The tools and technologies DotGrey uses across design, development, software, automation, data and machine learning.", path: "/capabilities" });

export default function CapabilitiesPage() {
  const tools = allTools();
  const groups = [...new Set(tools.map((t) => t.group))];
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="The kit."
        label={`Capabilities — ${tools.length} tools`}
        title={
          <>
            Every tool we use, <Em>grouped by craft.</Em>
          </>
        }
        lead="Every tool named in our services and published work, grouped by craft. Search it, filter it, or ask about one that isn't here."
      />
      <section className={`${s.wrap} ${s.sectionTight}`} aria-label="Tool stack">
        <StackFilter tools={tools} groups={groups} />
      </section>

      <section className={s.dark} aria-labelledby="choose">
        <div className={s.wrap}>
          <Head id="choose" label="How we choose" title="Four" turn="rules." />
          <ol className={s.approachDark}>
            {toolPrinciples.map((p, i) => (
              <li key={p.title}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${s.wrap} ${s.section}`} aria-labelledby="crafts">
        <Head id="crafts" label="By craft" title="What each" turn="covers." />
        <ol className={s.values}>
          {disciplines.map((d) => (
            <li key={d.id}>
              <span className={s.serviceNum}>{d.number}</span>
              <h3>{d.title}</h3>
              <p>{d.capabilities.join(" · ")}</p>
            </li>
          ))}
        </ol>
      </section>

      <Closing title="Pick the problem," turn="not the tool." secondary={{ href: "/services", label: "See the services" }} />
    </main>
      <Footer signoff="Ship it." />
    </>
  );
}
