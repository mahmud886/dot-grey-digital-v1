import type { Metadata } from "next";
import Link from "next/link";
import { offices, stats, team, values } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { DhakaTime } from "@/redesign/v9/Client";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "About" };

export default function V9About() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta="Est. 2019"
        title={
          <>
            A small studio <G name="asterisk" /> in Dhaka
          </>
        }
        lede="The people you meet in the first workshop are the people who build the thing. No account layers, no hand-over decks."
      />

      <section className={s.section}>
        <div className={`${s.wrap} ${s.manifestoGrid}`}>
          <span className={s.label}>(01) Why we exist</span>
          <p className={s.manifesto}>
            Products fall in the gaps <G name="slash" /> between the designer and the engineer, between the dashboard and the
            data under it <G name="wave" /> We close those gaps by keeping every craft in one team <G name="dot" />
          </p>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap}>
          <SectionHead n="02" title="Numbers" aside="Since 2019" />
          <ul className={s.statRow}>
            {stats.map((st) => (
              <li key={st.label}>
                <span className={s.statBig}>
                  {st.value}
                  {st.suffix}
                </span>
                <span className={s.label}>{st.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${s.section} ${s.dark}`}>
        <div className={s.wrap}>
          <SectionHead n="03" title="How we work" aside={`(${String(values.length).padStart(2, "0")}) values`} dark />
          <ol className={s.steps}>
            {values.map((v, i) => (
              <li key={v.title} className={s.step}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.stepTitle}>{v.title}</h3>
                <p className={s.stepBody}>{v.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap}>
          <SectionHead n="04" title="People" aside="Portraits are generated artwork" />
          <ul className={s.teamGrid}>
            {team.map((m) => (
              <li key={m.slug}>
                <Link href={`/v9/team/${m.slug}`} className={s.person}>
                  <span className={s.personArt}>
                    <ProjectArt slug={`person-${m.slug}`} label={m.name} variant="rings" ink="#f7f7f5" paper="#0b0b0b" ratio={4 / 5} />
                    <span className={s.monogram} aria-hidden="true">
                      {m.name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    </span>
                  </span>
                  <span className={s.personName}>{m.name}</span>
                  <span className={s.label}>{m.role}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap}>
          <SectionHead n="05" title="Places" aside="Four time zones" />
          <ul className={s.table}>
            {offices.map((o) => (
              <li key={o.label} className={s.tRow}>
                <span className={s.tKey}>
                  <G name={o.label === "Dhaka" ? "diamond" : "ring"} />
                </span>
                <span className={s.tName}>{o.label}</span>
                <span className={s.tVal}>
                  {o.lines.join(", ")}
                  {o.label === "Dhaka" && (
                    <>
                      {" "}
                      — <DhakaTime /> local
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
