import type { Metadata } from "next";
import Link from "next/link";
import { accessibility } from "@/redesign/agency";
import { site } from "@/redesign/content";
import { Em, Footer } from "@/redesign/v13/Chrome";
import { PageHead } from "@/redesign/v13/Bits";
import s from "@/redesign/v13/pages.module.css";

export const metadata: Metadata = { title: "Accessibility" };

export default function V13Accessibility() {
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="For everyone."
        label="Accessibility statement"
        title={
          <>
            WCAG 2.2 AA, <Em>and honest about the gaps.</Em>
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
            See also our <Link href="/v13/cookies">cookie policy</Link> and <Link href="/v13/privacy">privacy policy</Link>.
          </p>
        </div>
      </section>
    </main>
      <Footer signoff="Thanks." />
    </>
  );
}
