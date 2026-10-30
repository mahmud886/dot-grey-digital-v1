import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { cookies } from "@/site/agency";
import { Em, Footer } from "@/site/Chrome";
import { PageHead } from "@/site/Bits";
import { CookieReset } from "@/site/More";
import { GA_ID } from "@/site/analytics/config";
import s from "@/site/pages.module.css";

// Analytics is off unless a Measurement ID was set at build time (see ANALYTICS.md), and the
// page says exactly what that build does.
const analyticsOn = !!GA_ID;

export const metadata: Metadata = pageMeta({
  title: "Cookies",
  description: analyticsOn
    ? "The preference cookies this site sets, and the two Google Analytics cookies that are only set if you accept analytics."
    : "This site sets two preference cookies, for colour mode and accent, and nothing else.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head={analyticsOn ? "Cookies." : "Two cookies."}
        label="Cookie policy"
        title={
          analyticsOn ? (
            <>
              Preferences, and analytics <Em>only if you say yes.</Em>
            </>
          ) : (
            <>
              Two preferences, <Em>nothing else.</Em>
            </>
          )
        }
        lead={
          analyticsOn
            ? "We set small preference cookies. Google Analytics adds its own only if you accept analytics in the banner; decline and nothing else is stored. There is no advertising and no profiling."
            : "This site sets two small preference cookies and nothing else: no analytics, no advertising, no tracking."
        }
      />
      <section className={`${s.wrap} ${s.sectionTight}`} aria-label="The cookies">
        <div className={s.tableWrap} role="region" aria-label="Cookies this site sets" tabIndex={0}>
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
              {cookies
                .filter((c) => analyticsOn || (!c.analytics && c.name !== "dg-consent"))
                .map((c) => (
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
          <p className={s.prose}>
            The theme cookie is set only when you use the light/dark switch; the accent cookie is only set if an accent colour is chosen.
            {analyticsOn ? " The consent cookie records your analytics answer. Use Cookie settings to change it at any time: switching to Decline stops analytics at once and deletes Google's cookies." : ""} Clear everything here and the site follows your system setting again.
          </p>
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
