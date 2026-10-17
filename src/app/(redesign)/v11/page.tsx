import Link from "next/link";
import { disciplines, featuredWorks, process, stats, testimonials, works, type Work } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Footer, Header, SectionHead } from "@/redesign/v11/Chrome";
import { DragCarousel, FeaturedGrid, HeroReel, ServiceRows, type Card, type Cut } from "@/redesign/v11/Client";
import s from "@/redesign/v11/v11.module.css";

const card = (w: Work): Card => ({ slug: w.slug, client: w.client, title: w.title, category: w.category, year: w.year, stat: w.stats[0] });

const f = featuredWorks;
const CUTS: Cut[] = [
  { kind: "art", slug: f[0].slug, label: f[0].client, caption: `${f[0].title} — ${f[0].category}`, variant: "halftone" },
  { kind: "word", text: "Design" },
  { kind: "art", slug: f[1].slug, label: f[1].client, caption: `${f[1].title} — ${f[1].category}`, variant: "poster", invert: true },
  { kind: "word", text: "Software", invert: true },
  { kind: "dot" },
  { kind: "art", slug: f[2].slug, label: f[2].client, caption: `${f[2].title} — ${f[2].category}`, variant: "contour" },
  { kind: "word", text: "Automation" },
  { kind: "art", slug: f[3].slug, label: f[3].client, caption: `${f[3].title} — ${f[3].category}`, variant: "halftone", invert: true },
  { kind: "word", text: "Data", invert: true },
  { kind: "art", slug: f[4].slug, label: f[4].client, caption: `${f[4].title} — ${f[4].category}`, variant: "rings" },
  { kind: "word", text: "ML & AI" },
  { kind: "dot", invert: true },
  { kind: "art", slug: f[5].slug, label: f[5].client, caption: `${f[5].title} — ${f[5].category}`, variant: "poster" },
];

export default function V11Home() {
  const quote = testimonials[0];
  return (
    <>
      <Header />
      <main>
        <HeroReel cuts={CUTS}>
          <h1 className={s.heroTitle}>
            Design that thinks. <span className={s.dot} aria-hidden="true">●</span> Software that works.
          </h1>
        </HeroReel>

        {/* Studio statement + lockup */}
        <section className={s.statement} aria-labelledby="studio">
          <p className={s.label} id="studio">
            (01) Studio
          </p>
          <h2 className={s.mission}>
            DotGrey® is a design and engineering studio. <span className={s.dot} aria-hidden="true">●</span> We design the product, build the
            software, automate the busywork and teach it to think.
          </h2>
          <div className={s.statementFoot}>
            <p className={s.lede}>Eighteen people in Dhaka and four time zones. One team from first sketch to the model in production.</p>
            <Link href="/v11#services" className={s.arrowLink}>
              What we do <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className={s.lockup} aria-hidden="true">
            DotGrey<sup>®</sup>
          </p>
        </section>

        {/* Featured work 4-up */}
        <section id="work" className={s.section} aria-labelledby="featured">
          <SectionHead title="Featured work" count={4} id="featured">
            <Link href="/v11#engagements" className={s.arrowLink}>
              All work <span aria-hidden="true">→</span>
            </Link>
          </SectionHead>
          <FeaturedGrid items={f.slice(0, 4).map(card)} />
        </section>

        {/* Drag carousel */}
        <section id="engagements" className={s.section} aria-labelledby="eng">
          <SectionHead title="Featured engagements" count={works.length} id="eng">
            <p className={s.headNote}>Drag, swipe or use the arrows.</p>
          </SectionHead>
          <DragCarousel items={works.map(card)} />
        </section>

        {/* Dark chapter: services */}
        <section id="services" className={s.dark} aria-labelledby="helps">
          <p className={s.label}>(02) Services</p>
          <h2 id="helps" className={s.darkTitle}>
            DotGrey® helps teams <span className={s.dot} aria-hidden="true">●</span> ship what matters.
          </h2>
          <ServiceRows items={disciplines} />
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

        {/* Process as news-style rows */}
        <section id="process" className={s.section} aria-labelledby="how">
          <SectionHead title="How we work" count={process.length} id="how">
            <p className={s.headNote}>Weekly releases. No black boxes.</p>
          </SectionHead>
          <ol className={s.rows}>
            {process.map((p, i) => (
              <li key={p.title} className={s.row}>
                <span className={s.rowThumb} aria-hidden="true">
                  <ProjectArt slug={`process-${p.title}`} variant={i % 2 ? "rings" : "contour"} ink="#141414" paper="#e4e4e0" ratio={1} frame={i} />
                </span>
                <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.rowTitle}>{p.title}</h3>
                <p className={s.rowBody}>{p.body}</p>
                <span className={s.rowArrow} aria-hidden="true">
                  →
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* One voice */}
        <section className={s.quoteBlock} aria-label="Client words">
          <figure>
            <blockquote className={s.quote}>
              <span className={s.dot} aria-hidden="true">
                ●
              </span>{" "}
              {quote.quote}
            </blockquote>
            <figcaption className={s.quoteBy}>
              <b>{quote.author}</b> <span className={s.muted}>— {quote.role}</span>
            </figcaption>
          </figure>
        </section>
      </main>
      <Footer />
    </>
  );
}
