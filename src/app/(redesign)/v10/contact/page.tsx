import type { Metadata } from "next";
import { disciplines, offices, site } from "@/redesign/content";
import { budgetOptions, timelineOptions } from "@/data/site";
import { Page, PageHero } from "@/redesign/v10/Chrome";
import { BriefConsole, DhakaTime } from "@/redesign/v10/Client";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Contact" };

export default function V10Contact() {
  const [dhaka, remote] = offices;
  return (
    <Page>
      <PageHero kicker="Uplink · new business, any size" title="Contact" form="hero" lede="Two minutes here saves a week of email. Tell us what you're trying to do; we reply within a working day." />
      <section className={`${s.block} ${s.contactGrid}`}>
        <BriefConsole email={site.email} needs={[...disciplines.map((d) => d.short), "Not sure yet"]} budgets={budgetOptions} timelines={timelineOptions} />
        <aside className={s.contactAside}>
          <p className={s.label}>Direct line</p>
          <a href={`mailto:${site.email}`} className={s.mail}>
            {site.email} <span aria-hidden="true">↗</span>
          </a>
          <p className={s.label}>Phone</p>
          <p>{site.phone}</p>
          <p className={s.label}>{dhaka.label}</p>
          <p>{dhaka.lines.join(", ")}</p>
          <p className={s.nodeTime}>
            <DhakaTime /> in Dhaka now
          </p>
          <p className={s.label}>{remote.label}</p>
          <p>{remote.lines.join(" ")}</p>
        </aside>
      </section>
    </Page>
  );
}
