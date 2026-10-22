import type { Metadata } from "next";
import { benefits, values } from "@/redesign/content";
import { howWeWork, rituals } from "@/redesign/agency";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Closing, Head } from "@/redesign/v12/Bits";
import { Em, PageHead } from "@/redesign/v12/Chrome";
import s from "@/redesign/v12/v12.module.css";

export const metadata: Metadata = { title: "Culture" };

export default function V12Culture() {
  return (
    <main>
      <PageHead
        label="Culture"
        title={
          <>
            Inside, <Em>quietly.</Em>
          </>
        }
        lead="How a small, senior studio spends its week — the habits that keep the work good and the people around."
      />

      <section className={`${s.wrap} ${s.sectionTight}`} aria-label="Studio">
        <figure className={s.cultureArt}>
          <ProjectArt slug="v12-culture" label="DotGrey" variant="contour" ink="var(--ink)" paper="var(--paper-2)" ratio={2.4} />
          <figcaption className={s.note}>Generated artwork — studio photography to come.</figcaption>
        </figure>
      </section>

      <section className={`${s.wrap} ${s.section}`} aria-labelledby="how">
        <Head id="how" label="How we work" title="Three" turn="choices." />
        <ol className={s.values}>
          {howWeWork.map((h, i) => (
            <li key={h.title}>
              <span className={s.serviceNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{h.title}</h3>
              <p>{h.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.dark} aria-labelledby="rituals">
        <div className={s.wrap}>
          <Head id="rituals" label="Rituals" title="Small habits," turn="kept." />
          <ol className={s.approachDark}>
            {rituals.map((r, i) => (
              <li key={r.title}>
                <svg viewBox="0 0 120 120" className={s.rings} aria-hidden="true">
                  {Array.from({ length: 4 }, (_, k) => (
                    <circle key={k} cx="60" cy="60" r={16 + k * 13} data-on={k <= i} />
                  ))}
                </svg>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${s.wrap} ${s.section} ${s.twoUp}`} aria-labelledby="values">
        <Head id="values" label="Values in practice" title="What we" turn="hold to." />
        <ul className={s.bigList}>
          {values.map((v) => (
            <li key={v.title}>
              {v.title}
              <small className={s.bigListNote}>{v.body}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${s.wrap} ${s.sectionTight}`} aria-labelledby="benefits">
        <Head id="benefits" label="Looking after people" title="The" turn="basics." />
        <ol className={s.values}>
          {benefits.map((b, i) => (
            <li key={b.title}>
              <span className={s.serviceNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <Closing title="Want to work" turn="here?" primary={{ href: "/v12/careers", label: "See open roles" }} secondary={{ href: "/v12/about", label: "Meet the team" }} />
    </main>
  );
}
