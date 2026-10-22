import type { Metadata } from "next";
import Link from "next/link";
import { accessibility } from "@/redesign/agency";
import { site } from "@/redesign/content";
import { Em, PageHead } from "@/redesign/v12/Chrome";
import s from "@/redesign/v12/v12.module.css";

export const metadata: Metadata = { title: "Accessibility" };

export default function V12Accessibility() {
  return (
    <main>
      <PageHead
        label="Accessibility statement"
        title={
          <>
            For <Em>everyone.</Em>
          </>
        }
        lead={`We aim for ${accessibility.standard} on this site and on the products we build.`}
      />
      <section className={`${s.wrap} ${s.sectionTight} ${s.twoUp}`}>
        <div>
          <p className={s.label}>What we have done</p>
          <ul className={s.bigList}>
            {accessibility.done.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className={s.label}>Known limitations</p>
          <ul className={s.bigList}>
            {accessibility.limits.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className={s.prose} style={{ marginTop: "2.5rem" }}>
            Found a barrier? Write to <a href={`mailto:${site.email}?subject=Accessibility`}>{site.email}</a> and we will reply within two working days.
          </p>
          <p className={s.note} style={{ marginTop: "1rem" }}>
            See also our <Link href="/v12/cookies">cookie policy</Link> and <Link href="/v12/privacy">privacy policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
