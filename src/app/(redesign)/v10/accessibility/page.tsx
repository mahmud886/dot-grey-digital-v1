import type { Metadata } from "next";
import { accessibility } from "@/redesign/agency";
import { site } from "@/redesign/content";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Accessibility" };

export default function V10Accessibility() {
  return (
    <Page>
      <PageHero kicker={`Statement · target ${accessibility.standard}`} title="Access" form="dust" lede="This site should work for everyone, with any input and any assistive technology. Here is what we do, and what we know is not there yet." />
      <section className={`${s.block} ${s.twoCol}`} aria-label="Statement">
        <div>
          <SecHead id="done-h" title="Done" />
          <ul className={s.xDash}>
            {accessibility.done.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className={s.formNote}>The particle field is decorative: every word on the page is real text, and reduced motion shows a still field.</p>
        </div>
        <div>
          <SecHead id="lim-h" title="Limits" />
          <ul className={s.xDash}>
            {accessibility.limits.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className={s.readout} style={{ marginTop: "2rem" }}>
            Found a barrier? <a className={s.inlineLink} href={`mailto:${site.email}?subject=Accessibility`}>{site.email}</a>
          </p>
        </div>
      </section>
    </Page>
  );
}
