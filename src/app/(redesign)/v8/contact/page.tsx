import type { Metadata } from "next";
import { budgetOptions, timelineOptions } from "@/data/site";
import { disciplines, offices, site } from "@/redesign/content";
import { Footer, PageCover } from "@/redesign/v8/Chrome";
import { BriefForm, Clocks, ReplyLine } from "@/redesign/v8/Client";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Contact" };

export default function V8Contact() {
  return (
    <>
      <main id="main">
        <PageCover kicker="Contact" title="Let's talk." lead="Tell us what you are trying to do. Two minutes here saves a week of email." aside={<ReplyLine />} />
        <section className={s.contactGrid}>
          <BriefForm email={site.email} needs={[...disciplines.map((d) => d.short), "Not sure yet"]} budgets={budgetOptions} timelines={timelineOptions} />
          <aside className={s.contactAside} aria-label="Other ways to reach us">
            <div>
              <p className={s.footHead}>Rather write?</p>
              <a href={`mailto:${site.email}`} className={s.contactMail}>
                {site.email}
              </a>
            </div>
            <div>
              <p className={s.footHead}>Or call</p>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={s.contactLine}>
                {site.phone}
              </a>
            </div>
            {offices.map((o) => (
              <div key={o.label}>
                <p className={s.footHead}>{o.label}</p>
                <p className={s.contactLine}>{o.lines.join(", ")}</p>
              </div>
            ))}
            <Clocks />
          </aside>
        </section>
      </main>
      <Footer signoff="Talk soon." />
    </>
  );
}
