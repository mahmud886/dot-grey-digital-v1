import type { Metadata } from "next";
import Link from "next/link";
import { disciplines, offices, site } from "@/redesign/content";
import { budgetOptions, timelineOptions } from "@/data/site";
import { PageHead } from "@/redesign/v9/Chrome";
import { BriefForm, DhakaTime } from "@/redesign/v9/Client";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Contact" };

export default function V9Contact() {
  const [dhaka, remote] = offices;
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta="New business, any size"
        title={
          <>
            Say <G name="wave" /> hello
          </>
        }
        lede={<>Two minutes here saves a week of email; we reply within a working day. Prefer one question at a time? Try the <Link href="/v9/start" className={s.asideLink}>step-by-step brief</Link>.</>}
      />
      <section className={s.sectionTight}>
        <div className={`${s.wrap} ${s.contactGrid}`}>
          <BriefForm email={site.email} needs={[...disciplines.map((d) => d.short), "Not sure yet"]} budgets={budgetOptions} timelines={timelineOptions} />
          <aside className={s.contactAside}>
            <p className={s.label}>Rather write?</p>
            <a href={`mailto:${site.email}`} className={s.contactBig}>
              {site.email}
            </a>
            <p className={s.label}>Or call</p>
            <p>{site.phone}</p>
            <p className={s.label}>Studio</p>
            <p className={s.addressSm}>
              <G name="diamond" /> {dhaka.lines.join(" ")} <G name="asterisk" /> <DhakaTime /> in Dhaka <G name="dot" /> {remote.lines.join(" ")}
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
