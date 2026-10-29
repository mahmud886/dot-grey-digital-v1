import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { cookies } from "@/site/agency";
import { Em, Footer } from "@/site/Chrome";
import { PageHead } from "@/site/Bits";
import { CookieReset } from "@/site/More";
import s from "@/site/pages.module.css";

export const metadata: Metadata = pageMeta({ title: "Cookies", description: "This site sets two preference cookies, for colour mode and accent, and nothing else.", path: "/cookies" });

export default function CookiesPage() {
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="Two cookies."
        label="Cookie policy"
        title={
          <>
            Two preferences, <Em>nothing else.</Em>
          </>
        }
        lead="This site sets two small preference cookies and nothing else: no analytics, no advertising, no tracking."
      />
      <section className={`${s.wrap} ${s.sectionTight}`} aria-label="The cookies">
        <div className={s.tableWrap}>
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
      <section className={`${s.wrap} ${s.sectionTight} ${s.twoUp}`}>
        <div>
          <p className={s.label}>Your choice</p>
          <p className={s.prose}>Both cookies are set only when you use the theme or accent controls. Clear them here at any time; the site then follows your system setting.</p>
          <p className={s.note} style={{ marginTop: "1rem" }}>
            More in the <Link href="/privacy">privacy policy</Link>.
          </p>
        </div>
        <CookieReset />
      </section>
    </main>
      <Footer signoff="Crumbs." />
    </>
  );
}
