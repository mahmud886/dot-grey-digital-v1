import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { accessibility } from "@/site/agency";
import { site } from "@/site/content";
import { Em, Footer } from "@/site/Chrome";
import { PageHead } from "@/site/Bits";
import s from "@/site/pages.module.css";

export const metadata: Metadata = pageMeta({ title: "Accessibility", description: "How this site meets WCAG 2.2 AA, its known limitations, and how to tell us about a barrier.", path: "/accessibility" });

export default function AccessibilityPage() {
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
            See also our <Link href="/cookies">cookie policy</Link> and <Link href="/privacy">privacy policy</Link>.
          </p>
        </div>
      </section>
    </main>
      <Footer signoff="Thanks." />
    </>
  );
}
