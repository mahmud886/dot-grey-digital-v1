import type { Metadata } from "next";
import { cookies } from "@/redesign/agency";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import { CookieReset } from "@/redesign/v10/More";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Cookies" };

export default function V10Cookies() {
  return (
    <Page>
      <PageHero kicker="Storage · two preference cookies, no tracking" title="Cookies" form="dust" lede="This site sets two cookies, and only when you change a setting. No analytics, no advertising, nothing shared." />
      <section className={s.block} aria-labelledby="list-h">
        <SecHead id="list-h" title="The two" />
        <div className={s.xTableWrap}>
          <table className={s.xTable}>
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
                  <th scope="row">
                    <code>{c.name}</code>
                  </th>
                  <td>{c.purpose}</td>
                  <td>{c.values}</td>
                  <td>{c.lasts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className={s.block} aria-label="Reset">
        <CookieReset />
      </section>
    </Page>
  );
}
