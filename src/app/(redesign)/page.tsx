import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { site, versions, works } from "@/redesign/content";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { CardCursor } from "@/redesign/lab/Client";
import s from "@/redesign/lab/lab.module.css";

const sans = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--lab-sans" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--lab-mono" });

export const metadata: Metadata = {
  title: { absolute: "DotGrey Digital — Redesign Lab" },
  description: "Thirteen redesign directions for DotGrey Digital, each with a working homepage and case study.",
};

/** Which reference site each black-and-white direction learned from. */
const AFTER: Partial<Record<string, string>> = {
  v8: "Instrument + Huge",
  v9: "Locomotive",
  v10: "Active Theory",
  v11: "BASIC/DEPT®",
  v12: "Umber",
  v13: "V8 + V12",
};

const ROUNDS = [
  {
    set: "mono",
    id: "black-and-white",
    kicker: "Round two",
    title: "Black & white",
    note: "New layouts, no colour. Each one is built on a single reference site's strongest idea.",
  },
  {
    set: "colour",
    id: "colour",
    kicker: "Round one",
    title: "Colour",
    note: "The first seven directions, kept for comparison.",
  },
] as const;

const pad = (id: string) => id.replace("v", "").padStart(2, "0");

export default function Lab() {
  const sample = works[0].slug;
  return (
    <div className={`${s.root} ${sans.variable} ${mono.variable}`}>
      <header className={s.header}>
        <BrandMark href="/" ink="#f5f5f4" accent="#8a8a8a" className={s.logo} />
        <span className={s.headerLabel}>Redesign Lab</span>
        <nav className={s.headerNav} aria-label="Rounds">
          {ROUNDS.map((r) => (
            <a key={r.id} href={`#${r.id}`}>
              {r.title}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className={s.hero}>
          <p className={s.kicker}>DotGrey Digital · {versions.length} directions · 2 rounds</p>
          <h1 className={s.title}>
            Thirteen ways
            <br />
            to be <em>DotGrey.</em>
          </h1>
          <div className={s.heroFoot}>
            <p className={s.lead}>
              Every direction is a working prototype — a homepage and a case study, its own type, layout and motion — built
              on the same content, so you compare design, not copy.
            </p>
            <ol className={s.how}>
              <li>
                <span>01</span>Open a few, on desktop and on your phone.
              </li>
              <li>
                <span>02</span>Pick one, or two to combine.
              </li>
              <li>
                <span>03</span>We build the full site from it.
              </li>
            </ol>
          </div>
        </section>

        {ROUNDS.map((round) => {
          const list = versions.filter((v) => v.set === round.set);
          return (
            <section key={round.id} id={round.id} className={s.round} aria-labelledby={`${round.id}-title`}>
              <div className={s.roundHead}>
                <span className={s.kicker}>
                  {round.kicker} · {pad(list[0].id)}–{pad(list[list.length - 1].id)}
                </span>
                <h2 id={`${round.id}-title`} className={s.roundTitle}>
                  {round.title}
                </h2>
                <p className={s.roundNote}>{round.note}</p>
              </div>

              <ul className={round.set === "mono" ? s.gridLarge : s.gridSmall}>
                {list.map((v) => (
                  <li key={v.id} className={s.card} data-cursor>
                    <Link href={`/${v.id}`} className={s.cardLink} aria-label={`Open ${v.id.toUpperCase()} ${v.name}`}>
                      <span className={s.frame}>
                        <Image
                          src={`/previews/${v.id}.jpg`}
                          alt=""
                          width={1440}
                          height={900}
                          sizes={round.set === "mono" ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 33vw, 100vw"}
                        />
                      </span>
                    </Link>
                    <div className={s.meta}>
                      <span className={s.num}>{pad(v.id)}</span>
                      <div className={s.metaMain}>
                        <h3 className={s.name}>{v.name}</h3>
                        <p className={s.idea}>{v.idea}</p>
                        <p className={s.small}>
                          {AFTER[v.id] && <>After {AFTER[v.id]} · </>}
                          {v.fonts}
                        </p>
                      </div>
                      <span className={s.swatches} aria-hidden="true">
                        {v.palette.map((c) => (
                          <i key={c} style={{ background: c }} />
                        ))}
                      </span>
                    </div>
                    <div className={s.actions}>
                      <Link href={`/${v.id}`} className={s.btn}>
                        Homepage ↗
                      </Link>
                      <Link href={`/${v.id}/work/${sample}`} className={s.btnGhost}>
                        Case study
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </main>

      <footer className={s.footer}>
        <p className={s.footBig}>
          Seen the one?
          <br />
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <div className={s.footMeta}>
          <span>Prototypes for review — not indexed by search engines.</span>
          <span>The previous site lives on the legacy branch.</span>
          <span>© {new Date().getFullYear()} DotGrey Digital</span>
        </div>
      </footer>

      <CardCursor />
    </div>
  );
}
