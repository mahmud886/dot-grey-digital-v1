import type { Metadata } from "next";
import Link from "next/link";
import { howWeWork, rituals } from "@/redesign/agency";
import { benefits, values } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Dot, PageHead, SectionHead } from "@/redesign/v11/Chrome";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Inside" };

export default function V11Culture() {
  return (
    <main>
      <PageHead label="Inside ● Culture" title="Inside. ● How it feels here." lede="A small senior team in Dhaka and across time zones. Quiet mornings, Friday demos, decisions written down." />

      <section className={s.cultureArt} aria-hidden="true">
        {["halftone", "contour", "rings"].map((v, i) => (
          <ProjectArt key={v} slug={`v11-culture-${i}`} variant={v as "halftone" | "contour" | "rings"} ink={i === 1 ? "var(--art-l-ink)" : "var(--art-d-ink)"} paper={i === 1 ? "var(--art-l-paper)" : "var(--art-d-paper)"} ratio={0.8} />
        ))}
      </section>
      <p className={`${s.sectionTight} ${s.headNote}`} style={{ paddingTop: 0, textAlign: "left" }}>
        Generated artwork, not photos of the studio.
      </p>

      <section className={s.section} aria-labelledby="how">
        <SectionHead title="How we work" count={howWeWork.length} id="how" />
        <ol className={s.values}>
          {howWeWork.map((h, i) => (
            <li key={h.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.valueTitle}>{h.title}</h3>
              <p>{h.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.dark} aria-labelledby="rituals">
        <p className={s.label}>(02) Rituals</p>
        <h2 id="rituals" className={s.darkTitle}>
          Friday demos. <Dot /> Quiet mornings.
        </h2>
        <ol className={s.steps}>
          {rituals.map((r, i) => (
            <li key={r.title}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.stepTitle}>{r.title}</h3>
              <p>{r.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section} aria-labelledby="values">
        <SectionHead title="What we value" count={values.length} id="values" />
        <ol className={s.capList}>
          {values.map((v, i) => (
            <li key={v.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <span>{v.title}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section} aria-labelledby="perks">
        <SectionHead title="What you get" count={benefits.length} id="perks" />
        <ol className={s.values}>
          {benefits.map((b, i) => (
            <li key={b.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.valueTitle}>{b.title}</h3>
              <p>{b.body}</p>
            </li>
          ))}
        </ol>
        <div className={s.ctaRow}>
          <Link href="/v11/careers" className={s.btn}>
            See open roles <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v11/about" className={s.btnGhost}>
            About the studio
          </Link>
        </div>
      </section>
    </main>
  );
}
