import type { Metadata } from "next";
import { budgetOptions, timelineOptions } from "@/data/site";
import { disciplines, offices, site } from "@/redesign/content";
import { Em, Footer } from "@/redesign/v13/Chrome";
import { PageHead } from "@/redesign/v13/Bits";
import { DhakaTime } from "@/redesign/v13/Client";
import { BriefForm, LocalHello } from "@/redesign/v13/Pages";
import s from "@/redesign/v13/pages.module.css";

export const metadata: Metadata = { title: "Contact" };

export default function V13Contact() {
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="Let's talk."
        label="Contact"
        title={
          <>
            Let&apos;s make it <Em>matter.</Em>
          </>
        }
      >
        <LocalHello />
      </PageHead>
      <section className={`${s.wrap} ${s.sectionTight} ${s.contactGrid}`}>
        <BriefForm
          email={site.email}
          needs={[...disciplines.map((d) => d.short), "Not sure yet"]}
          budgets={budgetOptions}
          timelines={timelineOptions}
        />
        <aside className={s.contactAside}>
          <div>
            <p className={s.label}>Rather write?</p>
            <a href={`mailto:${site.email}`} className={s.mail}>
              {site.email}
            </a>
          </div>
          <div>
            <p className={s.label}>Or call</p>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={s.textLink}>
              {site.phone}
            </a>
          </div>
          {offices.map((o) => (
            <div key={o.label}>
              <p className={s.label}>{o.label}</p>
              <p>{o.lines.join(", ")}</p>
              {o.label === "Dhaka" && (
                <p className={s.note}>
                  <DhakaTime /> in Dhaka now
                </p>
              )}
            </div>
          ))}
          <div>
            <p className={s.label}>What happens next</p>
            <ol className={s.nextSteps}>
              <li>We reply within one working day.</li>
              <li>A 30-minute call to understand the problem.</li>
              <li>A short written plan with a range, not a guess.</li>
            </ol>
          </div>
        </aside>
      </section>
    </main>
      <Footer signoff="Talk soon." />
    </>
  );
}
