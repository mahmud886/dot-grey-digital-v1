import type { Metadata } from "next";
import { accessibility } from "@/redesign/agency";
import { site } from "@/redesign/content";
import { PageHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import m from "@/redesign/v9/more.module.css";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Accessibility" };

export default function V9Accessibility() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta={`Target: ${accessibility.standard}`}
        title={
          <>
            For <G name="ring" /> everyone
          </>
        }
        lede="What this site does to be usable by everyone, where it still falls short, and how to tell us."
      />
      <section className={s.sectionTight}>
        <div className={s.wrap}>
          <div className={m.policy}>
            <h2>Standard</h2>
            <p className={m.policyLead}>We aim for {accessibility.standard} on every page, in light and dark themes.</p>
          </div>
          <div className={m.policy}>
            <h2>What is done</h2>
            <ol className={m.policyList}>
              {accessibility.done.map((x, i) => (
                <li key={x}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {x}
                </li>
              ))}
            </ol>
          </div>
          <div className={m.policy}>
            <h2>Known limits</h2>
            <ol className={m.policyList}>
              {accessibility.limits.map((x, i) => (
                <li key={x}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {x}
                </li>
              ))}
            </ol>
          </div>
          <div className={m.policy}>
            <h2>Tell us</h2>
            <p className={m.policyLead}>
              Found a barrier? Write to{" "}
              <a href={`mailto:${site.email}?subject=${encodeURIComponent("Accessibility")}`} className={s.asideLink}>
                {site.email}
              </a>{" "}
              and we reply within two working days.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
