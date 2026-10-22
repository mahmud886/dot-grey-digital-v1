import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { disciplines, process, works } from "@/redesign/content";
import { Em, WorkCard } from "@/redesign/v12/Chrome";
import { Sculpture } from "@/redesign/v12/Client";
import { CRAFT_FAQ, RELATED } from "@/redesign/v12/related";
import s from "@/redesign/v12/v12.module.css";

export function generateStaticParams() {
  return disciplines.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/v12/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  const d = disciplines.find((x) => x.id === id);
  return { title: d ? d.title : "Service" };
}

export default async function V12Service({ params }: PageProps<"/v12/services/[id]">) {
  const { id } = await params;
  const index = disciplines.findIndex((x) => x.id === id);
  if (index < 0) notFound();
  const d = disciplines[index];
  const related = RELATED[d.id].map((slug) => works.find((w) => w.slug === slug)).filter((w) => w !== undefined);
  const next = disciplines[(index + 1) % disciplines.length];
  const [first, ...rest] = d.title.split(" ");

  return (
    <main>
      <section className={`${s.wrap} ${s.hero} ${s.craftHero}`}>
        <div className={s.heroText}>
          <p className={s.kicker}>
            <Link href="/v12/services">Services</Link> — {d.number}
          </p>
          <h1 className={s.heroTitle}>
            {first} <Em>{rest.join(" ")}</Em>
          </h1>
          <p className={s.heroLead}>{d.line}</p>
          <div className={s.ctas}>
            <Link href="/v12/start" className={s.pillInk}>
              Start a project <span aria-hidden="true">↗</span>
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
            No published case study for {d.short.toLowerCase()} yet — most of it sits inside client systems we can&apos;t show.{" "}
            <Link href="/v12/contact" className={s.textLink}>
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
          <Link href="/v12/engagements" className={s.pill}>
            How engagements work <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v12/start" className={s.pillInk}>
            Start a project <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className={`${s.wrap} ${s.nextBlock}`}>
        <p className={s.label}>Next craft</p>
        <Link href={`/v12/services/${next.id}`} className={s.nextCraft}>
          <span className={s.serviceNum}>{next.number}</span>
          <span>{next.title}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
