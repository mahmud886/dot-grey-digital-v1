import type { Metadata } from "next";
import Link from "next/link";
import { budgetOptions, timelineOptions } from "@/data/site";
import { disciplines, offices, site } from "@/redesign/content";
import { PageHead, SectionHead } from "@/redesign/v11/Chrome";
import { BriefForm, LiveTime } from "@/redesign/v11/Client";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Contact" };

export default function V11Contact() {
  const blocks = [
    { label: "New business", body: "Projects, retainers, a problem you cannot name yet.", href: `mailto:${site.email}?subject=${encodeURIComponent("New project")}`, cta: site.email },
    { label: "Press", body: "Interviews, talks and quotes about the studio.", href: `mailto:${site.email}?subject=${encodeURIComponent("Press")}`, cta: "Write to press" },
    { label: "Join us", body: "Open roles and how we hire.", href: "/v11/careers", cta: "See careers" },
  ];
  return (
    <main>
      <PageHead label="Contact" title="Got a project? ● Let's talk." lede="Two minutes here saves a week of email. We reply within a working day." />

      <section className={s.sectionTight}>
        <ol className={s.contactBlocks}>
          {blocks.map((b, i) => (
            <li key={b.label}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h2 className={s.valueTitle}>{b.label}</h2>
              <p>{b.body}</p>
              {b.href.startsWith("/") ? (
                <Link href={b.href} className={s.arrowLink}>
                  {b.cta} <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <a href={b.href} className={s.arrowLink}>
                  {b.cta} <span aria-hidden="true">→</span>
                </a>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section} aria-labelledby="brief">
        <SectionHead title="The brief" id="brief">
          <p className={s.headNote}>Fields marked optional can wait.</p>
        </SectionHead>
        <BriefForm email={site.email} needs={disciplines.map((d) => d.short)} budgets={budgetOptions} timelines={timelineOptions} />
      </section>

      <section className={s.section} aria-labelledby="where">
        <SectionHead title="Where" count={offices.length} id="where" />
        <ol className={s.offices}>
          {offices.map((o) => (
            <li key={o.label}>
              <h3 className={s.valueTitle}>{o.label}</h3>
              <p>{o.lines.join(", ")}</p>
              {o.label === "Dhaka" && (
                <p className={s.clockInk}>
                  <LiveTime tz="Asia/Dhaka" /> <span className={s.muted}>local time</span>
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
