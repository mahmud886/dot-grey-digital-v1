import type { Metadata } from "next";
import Link from "next/link";
import { disciplines, process } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { CRAFT_ART } from "@/redesign/v11/related";
import { Dot, PageHead, SectionHead } from "@/redesign/v11/Chrome";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Services" };


export default function V11Services() {
  return (
    <main>
      <PageHead
        label="Services"
        title="Six crafts. ● One team."
        count={disciplines.length}
        lede="Most problems cross a boundary — a design problem that is really a data problem, a workflow that needs a model. So we staff all six."
      />
      <section className={s.sectionTight}>
        <ol className={s.svcIndex}>
          {disciplines.map((d, i) => (
            <li key={d.id}>
              <Link href={`/v11/services/${d.id}`} className={s.svcRow}>
                <span className={s.svcThumb} aria-hidden="true">
                  <ProjectArt
                    slug={`v11-${d.id}`}
                    label={d.short}
                    variant={CRAFT_ART[d.id]}
                    ink={i % 2 ? "var(--art-l-ink)" : "var(--art-d-ink)"}
                    paper={i % 2 ? "var(--art-l-paper)" : "var(--art-d-paper)"}
                    ratio={1.3}
                  />
                </span>
                <span className={s.svcNum}>{d.number}</span>
                <span className={s.svcTitle}>{d.title}</span>
                <span className={s.svcLine}>{d.line}</span>
                <span className={s.rowArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.dark} aria-labelledby="how">
        <p className={s.label}>(02) Process</p>
        <h2 id="how" className={s.darkTitle}>
          Weekly releases. <Dot /> No black boxes.
        </h2>
        <ol className={s.steps}>
          {process.map((p, i) => (
            <li key={p.title}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.stepTitle}>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section}>
        <SectionHead title="Not sure which?">
          <Link href="/v11/contact" className={s.arrowLink}>
            Tell us the problem <span aria-hidden="true">→</span>
          </Link>
        </SectionHead>
        <p className={s.lede}>Describe what you are trying to do. We will tell you which crafts it needs — and if it needs none of them.</p>
      </section>
    </main>
  );
}
