import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { disciplines, process } from "@/site/content";
import { Em, Footer } from "@/site/Chrome";
import { PageHead } from "@/site/Bits";
import s from "@/site/pages.module.css";
import { ArrowUpRight } from "@/site/shared/Arrow";

export const metadata: Metadata = pageMeta({ title: "Services", description: "Product and brand design, web and app development, custom software, automation, data science and machine learning.", path: "/services" });

export default function ServicesPage() {
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="Make it."
        label="Services"
        title={
          <>
            Six crafts, <Em>one team.</Em>
          </>
        }
        lead="Most problems cross a boundary, so we keep design, engineering, automation, data and machine learning in one room."
      />
      <section className={`${s.wrap} ${s.sectionTight}`}>
        <ul className={s.craftList}>
          {disciplines.map((d) => (
            <li key={d.id}>
              <Link href={`/services/${d.id}`} className={s.craftRow}>
                <span className={s.serviceNum}>{d.number}</span>
                <span className={s.craftTitle}>{d.title}</span>
                <span className={s.craftLine}>{d.line}</span>
                <span className={s.craftCaps}>{d.capabilities.slice(0, 3).join(" · ")}</span>
                <span className={s.serviceArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className={s.dark} aria-labelledby="how">
        <div className={s.wrap}>
          <div className={s.secHead}>
            <p className={s.label}>Every engagement</p>
            <h2 id="how" className={s.h2}>
              How it <Em>moves.</Em>
            </h2>
          </div>
          <ol className={s.steps}>
            {process.map((p, i) => (
              <li key={p.title} className={s.step}>
                <svg viewBox="0 0 120 120" className={s.rings} aria-hidden="true">
                  {Array.from({ length: 5 }, (_, k) => (
                    <circle key={k} cx="60" cy="60" r={14 + k * 11} data-on={k <= i} />
                  ))}
                </svg>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.stepTitle}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className={`${s.wrap} ${s.contact}`}>
        <h2 className={s.ctaSmall}>
          Not sure which one you need? <Em>That&apos;s normal.</Em>
        </h2>
        <div className={s.ctas}>
          <Link href="/contact" className={s.pillInk}>
            Tell us the problem <ArrowUpRight />
          </Link>
          <Link href="/engagements" className={s.textLink}>
            How engagements work
          </Link>
        </div>
      </section>
    </main>
      <Footer signoff="Let's go." />
    </>
  );
}
