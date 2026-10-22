import type { Metadata } from "next";
import Link from "next/link";
import { offices, site, stats, team, testimonials, values } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import { DhakaTime } from "@/redesign/v10/Client";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "About" };

const initials = (name: string) =>
  name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2);

export default function V10About() {
  const [dhaka, remote] = offices;
  const quote = testimonials[1] ?? testimonials[0];
  return (
    <Page>
      <PageHero
        kicker={`System info · running since ${site.founded}`}
        title="About"
        form="ml"
        lede="A small, senior studio in Dhaka that designs the interface, builds the software, automates the busywork and trains the models behind it."
      />

      <section className={`${s.block} ${s.twoCol}`} aria-label="Story">
        <div>
          <p className={s.label}>Why one team</p>
          <p className={s.readout}>
            Products fail in the gaps — between the designer and the engineer, between the dashboard and the data under it,
            between the model and the workflow it is supposed to help.
          </p>
        </div>
        <div className={s.readSm}>
          <p>
            So we keep the gaps inside one room. The people you meet in the first workshop are the people who build the thing,
            and they stay on it after launch.
          </p>
          <p>
            No hand-over decks. Working software every week, decisions written down, and a number agreed up front that tells
            everyone whether it worked.
          </p>
        </div>
      </section>

      <section className={s.block} aria-label="In numbers">
        <dl className={s.stats}>
          {stats.map((st) => (
            <div key={st.label}>
              <dt>{st.label}</dt>
              <dd>
                {st.value}
                {st.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={s.block} aria-labelledby="val-h">
        <SecHead id="val-h" title="Rules" note="Six we actually use to make decisions." />
        <ol className={s.ruleGrid}>
          {values.map((v, i) => (
            <li key={v.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.block} aria-labelledby="team-h">
        <SecHead id="team-h" title="Crew" note="Portraits are generated dot-matrix monograms, not photographs." />
        <ul className={s.crew}>
          {team.map((m) => (
            <li key={m.slug}>
              <Link href={`/v10/team/${m.slug}`} className={s.card}>
                <ProjectArt slug={m.slug} label={initials(m.name)} variant="matrix" ratio={1.2} ink="var(--fg)" paper="var(--bg)" />
                <span className={s.cardTitle}>{m.name}</span>
                <span className={s.cardMeta}>{m.role}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.block} aria-labelledby="loc-h">
        <SecHead id="loc-h" title="Nodes" />
        <dl className={s.nodes}>
          <div>
            <dt>{dhaka.label}</dt>
            <dd>{dhaka.lines.join(", ")}</dd>
            <dd className={s.nodeTime}>
              <DhakaTime /> local
            </dd>
          </div>
          <div>
            <dt>{remote.label}</dt>
            <dd>{remote.lines.join(" ")}</dd>
            <dd className={s.nodeTime}>Overlap window daily</dd>
          </div>
        </dl>
        <figure className={s.quote}>
          <blockquote>“{quote.quote}”</blockquote>
          <figcaption>
            {quote.author} — {quote.role}
          </figcaption>
        </figure>
      </section>
    </Page>
  );
}
