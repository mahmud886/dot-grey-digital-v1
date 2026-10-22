import type { Metadata } from "next";
import Link from "next/link";
import { howWeWork, rituals } from "@/redesign/agency";
import { benefits, values } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Footer, PageCover, SecHead } from "@/redesign/v8/Chrome";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Culture" };

export default function V8Culture() {
  return (
    <>
      <main id="main">
        <PageCover kicker="Culture" title="Inside." lead="How a small studio in Dhaka works with people across time zones: few meetings, written decisions, and the same people from pitch to launch." />

        <section className={s.process} aria-labelledby="h-title">
          <SecHead id="h-title" title="How we work." />
          <ol className={s.tileGrid + " " + s.three}>
            {howWeWork.map((h, i) => (
              <li key={h.title}>
                <ProjectArt slug={`culture-${i}`} variant={["contour", "rings", "halftone"][i] as "contour"} ink="var(--art-ink)" paper="var(--art-paper)" ratio={1.4} title="Generated artwork, not a photo" />
                <h3 className={s.tileTitle}>
                  {h.title}
                  <span className={s.stop}>.</span>
                </h3>
                <p>{h.body}</p>
              </li>
            ))}
          </ol>
          <p className={s.newsNote} style={{ marginTop: 20 }}>
            Images on this page are generated artwork, not photos of the team.
          </p>
        </section>

        <section className={`${s.chapterDark} ${s.process}`} aria-labelledby="r-title">
          <SecHead id="r-title" title="Rituals." note="Four habits that keep a remote team honest." />
          <ol className={s.tileGrid}>
            {rituals.map((r, i) => (
              <li key={r.title}>
                <span className={s.tileKick}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.tileTitle}>
                  {r.title}
                  <span className={s.stop}>.</span>
                </h3>
                <p>{r.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.process} aria-labelledby="v-title">
          <SecHead id="v-title" title="In practice." note="Our values, and what each one changes on a normal Tuesday." />
          <ol className={s.valueGrid}>
            {values.map((v, i) => (
              <li key={v.title}>
                <span className={s.valueNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.valueTitle}>
                  {v.title}
                  <span className={s.stop}>.</span>
                </h3>
                <p>{v.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${s.chapterDark} ${s.process}`} aria-labelledby="b-title">
          <SecHead id="b-title" title="Benefits." note={<Link href="/v8/careers">See open roles →</Link>} />
          <ol className={s.tileGrid}>
            {benefits.map((b, i) => (
              <li key={b.title}>
                <span className={s.tileKick}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.tileTitle}>{b.title}</h3>
                <p>{b.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer signoff="Join us." />
    </>
  );
}
