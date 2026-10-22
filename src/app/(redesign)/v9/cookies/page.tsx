import type { Metadata } from "next";
import { cookies } from "@/redesign/agency";
import { PageHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import { CookieReset } from "@/redesign/v9/More";
import m from "@/redesign/v9/more.module.css";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Cookies" };

export default function V9Cookies() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta={`(${String(cookies.length).padStart(2, "0")}) cookies, both preferences`}
        title={
          <>
            Two <G name="dot" /> cookies
          </>
        }
        lede="This site sets exactly two cookies, both to remember a choice you made. No analytics, no advertising, no tracking."
      />
      <section className={s.sectionTight}>
        <div className={s.wrap}>
          <div className={m.policy}>
            <h2>What is set</h2>
            <div className={m.compareWrap}>
              <table className={m.cookieTable}>
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
          </div>
          <div className={m.policy}>
            <h2>Your choice</h2>
            <CookieReset />
          </div>
        </div>
      </section>
    </main>
  );
}
