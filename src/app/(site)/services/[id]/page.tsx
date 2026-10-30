import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { disciplines, process, works } from "@/site/content";
import { Em, Footer, Stop } from "@/site/Chrome";
import s13 from "@/site/site.module.css";

import { WorkCard } from "@/site/Bits";
import { Sculpture } from "@/site/Client";
import { CRAFT_FAQ, RELATED } from "@/site/related";
import s from "@/site/pages.module.css";
import { ArrowUpRight } from "@/site/shared/Arrow";

export function generateStaticParams() {
  return disciplines.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  const d = disciplines.find((x) => x.id === id);
  return d ? pageMeta({ title: d.title, description: d.line, path: `/services/${id}` }) : { title: "Service" };
}

export default async function ServicePage({ params }: PageProps<"/services/[id]">) {
  const { id } = await params;
  const index = disciplines.findIndex((x) => x.id === id);
  if (index < 0) notFound();
  const d = disciplines[index];
  const related = RELATED[d.id].map((slug) => works.find((w) => w.slug === slug)).filter((w) => w !== undefined);
  const next = disciplines[(index + 1) % disciplines.length];
  const [first, ...rest] = d.title.split(" ");

  return (
    <>
    <main className={s.pg}>
      <section className={`${s.wrap} ${s.hero} ${s.craftHero}`}>
        <div className={s.heroText}>
          <p className={s.kicker}>
            <Link href="/services">Services</Link> — {d.number}
          </p>
          <h1 className={s13.pageHeadline}>
            <Stop>{`${d.short}.`}</Stop>
          </h1>
          <p className={s13.pageSentence}>
            {first} <Em>{rest.join(" ")}</Em>
          </p>
          <p className={s.heroLead}>{d.line}</p>
          <div className={s.ctas}>
            <Link href="/start" className={s.pillInk}>
              Start a project <ArrowUpRight />
            </Link>
          </div>
        </div>
        <Sculpture labels={disciplines.map((x) => x.short)} initial={index} single />
      </section>

      <section className={`${s.wrap} ${s.section} ${s.twoUp}`}>
        <div>
          <p className={s.label}>What we do</p>
          <ul className={s.bigList}>
            {d.capabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className={s.label}>Usually with</p>
          <ul className={s.plainList}>
            {d.stack.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={s.dark} aria-labelledby="how">
        <div className={s.wrap}>
          <div className={s.secHead}>
            <p className={s.label}>How we work</p>
            <h2 id="how" className={s.h2}>
              Five steps, <Em>weekly.</Em>
            </h2>
          </div>
          <ol className={s.approachDark}>
            {process.map((p, i) => (
              <li key={p.title}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${s.wrap} ${s.section}`} aria-labelledby="related">
        <div className={s.secHead}>
          <p className={s.label}>Related work</p>
          <h2 id="related" className={s.h2}>
            In <Em>practice.</Em>
          </h2>
        </div>
        {related.length ? (
          <div className={s.workGrid}>
            {related.map((w) => (
              <WorkCard key={w.slug} work={w} index={works.indexOf(w)} />
            ))}
          </div>
        ) : (
          <p className={s.empty}>
            No public case study for {d.title} yet — most of it sits inside client systems we can&apos;t show.{" "}
            <Link href="/contact" className={s.textLink}>
              Ask for a walkthrough
            </Link>
            .
          </p>
        )}
      </section>

      <section className={`${s.wrap} ${s.section} ${s.faqWrap}`} aria-labelledby="faq">
        <div>
          <p className={s.label}>Questions</p>
          <h2 id="faq" className={s.h2}>
            Fair <Em>questions.</Em>
          </h2>
        </div>
        <div className={s.faq}>
          {CRAFT_FAQ[d.id].map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <i aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={`${s.wrap} ${s.band}`} aria-label="Working together">
        <p className={s.bandText}>
          Start with a two-week Discovery, a fixed Sprint or a team on <Em>an outcome.</Em>
        </p>
        <div className={s.ctas}>
          <Link href="/engagements" className={s.pill}>
            How engagements work <span aria-hidden="true">→</span>
          </Link>
          <Link href="/start" className={s.pillInk}>
            Start a project <ArrowUpRight />
          </Link>
        </div>
      </section>

      <section className={`${s.wrap} ${s.nextBlock}`}>
        <p className={s.label}>Next craft</p>
        <Link href={`/services/${next.id}`} className={s.nextCraft}>
          <span className={s.serviceNum}>{next.number}</span>
          <span>{next.title}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
      <Footer signoff="Your move." />
    </>
  );
}
