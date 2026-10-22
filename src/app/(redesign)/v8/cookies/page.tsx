import type { Metadata } from "next";
import { cookies } from "@/redesign/agency";
import { Footer, PageCover } from "@/redesign/v8/Chrome";
import { CookieReset } from "@/redesign/v8/More";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Cookies" };

export default function V8Cookies() {
  return (
    <>
      <main id="main">
        <PageCover kicker={`Cookies · ${cookies.length} in total`} title="Two cookies." lead="This site sets two small preference cookies and nothing else: no analytics, advertising or tracking cookies." />
        <section className={s.policy} aria-labelledby="c1">
          <h2 id="c1">
            What we set<span className={s.stop}>.</span>
          </h2>
          <div className={s.policyBody}>
            <div className={s.tableWrap} style={{ borderTop: 0 }}>
              <table className={s.cookieTable}>
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Why</th>
                    <th scope="col">Values</th>
                    <th scope="col">Kept for</th>
                  </tr>
                </thead>
                <tbody>
                  {cookies.map((c) => (
                    <tr key={c.name}>
                      <td>
                        <code>{c.name}</code>
                      </td>
                      <td>{c.purpose}</td>
                      <td>{c.values}</td>
                      <td>{c.lasts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>Both are first-party, are only set when you change the theme or accent, and are read by a small script in the page so it shows your choice before it paints. They are never sent to anyone else.</p>
          </div>
        </section>
        <section className={s.policy} aria-labelledby="c2">
          <h2 id="c2">
            Your choice<span className={s.stop}>.</span>
          </h2>
          <div className={s.policyBody}>
            <CookieReset />
          </div>
        </section>
      </main>
      <Footer signoff="Crumbs." />
    </>
  );
}
