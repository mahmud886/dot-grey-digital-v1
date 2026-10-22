import type { Metadata } from "next";
import { accessibility } from "@/redesign/agency";
import { site } from "@/redesign/content";
import { Footer, PageCover } from "@/redesign/v8/Chrome";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Accessibility" };

export default function V8Accessibility() {
  return (
    <>
      <main id="main">
        <PageCover kicker={`Accessibility · target ${accessibility.standard}`} title="For everyone." lead="What we aim for on this site, what we have done, and where we know it still falls short." />
        <section className={s.policy} aria-labelledby="a1">
          <h2 id="a1">
            The standard<span className={s.stop}>.</span>
          </h2>
          <div className={s.policyBody}>
            <p>We design and build this site to meet the Web Content Accessibility Guidelines ({accessibility.standard}), and we apply the same standard to client work unless a project calls for more.</p>
          </div>
        </section>
        <section className={s.policy} aria-labelledby="a2">
          <h2 id="a2">
            What we do<span className={s.stop}>.</span>
          </h2>
          <div className={s.policyBody}>
            <ul className={s.dashList}>
              {accessibility.done.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </section>
        <section className={s.policy} aria-labelledby="a3">
          <h2 id="a3">
            Known limits<span className={s.stop}>.</span>
          </h2>
          <div className={s.policyBody}>
            <ul className={s.dashList}>
              {accessibility.limits.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </section>
        <section className={s.policy} aria-labelledby="a4">
          <h2 id="a4">
            Tell us<span className={s.stop}>.</span>
          </h2>
          <div className={s.policyBody}>
            <p>
              Found a barrier? Email <a href={`mailto:${site.email}?subject=Accessibility`}>{site.email}</a> with the page and what happened. We reply within two working days and fix what we can.
            </p>
          </div>
        </section>
      </main>
      <Footer signoff="Thank you." />
    </>
  );
}
