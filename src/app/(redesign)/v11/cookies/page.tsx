import type { Metadata } from "next";
import { cookies } from "@/redesign/agency";
import { PageHead, SectionHead } from "@/redesign/v11/Chrome";
import { CookieReset } from "@/redesign/v11/More";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Cookies" };

export default function V11Cookies() {
  return (
    <main>
      <PageHead label="Legal ● Cookies" title="Two cookies. ● That's all." lede="No analytics, no advertising, no tracking. Just two preferences, stored only when you change them." count={cookies.length} />
      <section className={s.sectionTight}>
        <div className={s.tableWrap} tabIndex={0} role="region" aria-label="Cookies this site sets">
          <table className={s.compare}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Purpose</th>
                <th scope="col">Values</th>
                <th scope="col">Lasts</th>
              </tr>
            </thead>
            <tbody>
              {cookies.map((c) => (
                <tr key={c.name}>
                  <th scope="row">{c.name}</th>
                  <td>{c.purpose}</td>
                  <td>{c.values}</td>
                  <td>{c.lasts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className={s.section} aria-labelledby="reset">
        <SectionHead title="Your preferences" id="reset" />
        <CookieReset />
      </section>
    </main>
  );
}
