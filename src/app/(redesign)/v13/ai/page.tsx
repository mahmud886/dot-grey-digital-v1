import type { Metadata } from "next";
import Link from "next/link";
import { aiOffer, aiPrinciples, aiWont } from "@/redesign/agency";
import { disciplines } from "@/redesign/content";
import { Closing, Head } from "@/redesign/v13/Bits";
import { Em, Footer, Stop } from "@/redesign/v13/Chrome";
import s13 from "@/redesign/v13/v13.module.css";
import { Sculpture } from "@/redesign/v13/Client";
import s from "@/redesign/v13/pages.module.css";

export const metadata: Metadata = { title: "AI & automation" };

export default function V13Ai() {
  const ml = disciplines.findIndex((d) => d.id === "ml");
  return (
    <>
    <main className={s.pg}>
      <section className={`${s.wrap} ${s.hero} ${s.craftHero}`}>
        <div className={s.heroText}>
          <p className={s.kicker}>
            <Link href="/v13/services">Services</Link> — AI &amp; automation
          </p>
          <h1 className={s13.pageHeadline}>
            <Stop>Useful AI.</Stop>
          </h1>
          <p className={s13.pageSentence}>
            Models and automations, <Em>measured.</Em>
          </p>
          <p className={s.heroLead}>Models and automations built into the work your team already does — evaluated before launch, monitored after it.</p>
          <div className={s.ctas}>
            <Link href="/v13/start" className={s.pillInk}>
              Start a project <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/v13/services/ml" className={s.textLink}>
              The ML craft
            </Link>
          </div>
        </div>
        <Sculpture labels={disciplines.map((x) => x.short)} initial={ml < 0 ? 0 : ml} single />
      </section>

      <section className={`${s.wrap} ${s.section}`} aria-labelledby="offer">
        <Head id="offer" label="What we build" title="Six things we" turn="do well." />
        <ol className={s.values}>
          {aiOffer.map((o, i) => (
            <li key={o.title}>
              <span className={s.serviceNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{o.title}</h3>
              <p>{o.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.dark} aria-labelledby="principles">
        <div className={s.wrap}>
          <Head id="principles" label="Responsible by default" title="How we" turn="build it." />
          <ol className={s.approachDark}>
            {aiPrinciples.map((p, i) => (
              <li key={p.title}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${s.wrap} ${s.section} ${s.twoUp}`} aria-labelledby="wont">
        <Head id="wont" label="Equally important" title="What we" turn="won't." />
        <ul className={s.wontList}>
          {aiWont.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <Closing title="Have a process that should" turn="run itself?" secondary={{ href: "/v13/services/automation", label: "The automation craft" }} />
    </main>
      <Footer signoff="Think." />
    </>
  );
}
