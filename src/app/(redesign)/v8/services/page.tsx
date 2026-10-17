import type { Metadata } from "next";
import Link from "next/link";
import { disciplines, process } from "@/redesign/content";
import { Footer, PageCover, SecHead, Stop } from "@/redesign/v8/Chrome";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Services" };

export default function V8Services() {
  return (
    <>
      <main id="main">
        <PageCover
          kicker="Services · 06"
          title="Make it."
          lead="Six disciplines under one roof. Most problems cross at least two of them — a design problem that is really a data problem, a workflow that needs a model — so we staff all six."
        />

        <section className={s.svcIndex} aria-label="Disciplines">
          <ol className={s.svcRows}>
            {disciplines.map((d) => (
              <li key={d.id}>
                <Link href={`/v8/services/${d.id}`} className={s.svcRow}>
                  <span className={s.svcNum}>{d.number}</span>
                  <span className={s.svcName}>
                    <Stop>{`${d.short}.`}</Stop>
                  </span>
                  <span className={s.svcLine}>{d.line}</span>
                  <span className={s.svcArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${s.chapterDark} ${s.process}`} aria-labelledby="loop-title">
          <SecHead id="loop-title" title="One loop." note="Every discipline runs on the same five stages, in weekly cycles you can see and click." />
          <ol className={s.loop}>
            {process.map((p, i) => (
              <li key={p.title}>
                <span className={s.loopNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.loopTitle}>
                  <Stop>{`${p.title}.`}</Stop>
                </span>
                <span className={s.loopBody}>{p.body}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.process} aria-labelledby="stack-title">
          <SecHead id="stack-title" title="The kit." note="Tools we know well. We follow your stack when you have one." />
          <dl className={s.kit}>
            {disciplines.map((d) => (
              <div key={d.id}>
                <dt>{d.short}</dt>
                <dd>{d.stack.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer signoff="Let's go." />
    </>
  );
}
