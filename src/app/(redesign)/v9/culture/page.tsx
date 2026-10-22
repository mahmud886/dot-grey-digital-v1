import type { Metadata } from "next";
import Link from "next/link";
import { howWeWork, rituals } from "@/redesign/agency";
import { values } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import m from "@/redesign/v9/more.module.css";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Culture" };

export default function V9Culture() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9/about", label: "About" }}
        meta="How the studio runs"
        title={
          <>
            Inside <G name="ring" /> the studio
          </>
        }
        lede="Small teams, senior people, written decisions and quiet mornings. The habits behind the work."
      />
      <section className={s.sectionTight}>
        <div className={s.wrap}>
          <ul className={`${m.principles} ${m.principlesThree}`}>
            {howWeWork.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className={s.sectionTight}>
        <div className={s.wrap}>
          <figure>
            <ProjectArt slug="studio-culture" variant="contour" ink="var(--art-ink)" paper="var(--art-paper)" ratio={2.4} />
            <figcaption className={s.formNote} style={{ marginTop: 10 }}>
              Generated artwork, not a photo of the studio.
            </figcaption>
          </figure>
        </div>
      </section>
      <section className={`${s.section} ${s.dark}`}>
        <div className={s.wrap}>
          <SectionHead n="02" title="Rituals" aside={`${rituals.length} habits`} dark />
          <ul className={m.rhythm}>
            {rituals.map((r) => (
              <li key={r.title}>
                <span className={m.rhythmKey}>{r.title}</span>
                <p className={m.rhythmVal}>{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className={s.section}>
        <div className={s.wrap}>
          <SectionHead n="03" title="Values" aside={`${values.length} of them`} />
          <ol className={m.notesList}>
            {values.map((v, i) => (
              <li key={v.title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <b>{v.title}</b> — {v.body}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <nav className={m.band} aria-label="Next steps">
        <Link href="/v9/careers" className={m.bandLink}>
          <span className={s.label}>Join us</span>
          <b>
            Open roles <G name="arrow" />
          </b>
          <p>Roles, benefits and how hiring works.</p>
        </Link>
        <Link href="/v9/about" className={m.bandLink}>
          <span className={s.label}>The people</span>
          <b>
            About <G name="arrow" />
          </b>
          <p>Story, numbers, team and places.</p>
        </Link>
      </nav>
    </main>
  );
}
