import type { legalPages } from "@/redesign/content";
import { PageHead } from "./Chrome";
import { G } from "./Glyphs";
import s from "./v9.module.css";

/** Privacy and Terms: a contents index beside numbered sections. */
export function Legal({ page }: { page: (typeof legalPages)["privacy"] }) {
  const id = (h: string) => h.toLowerCase().replace(/\W+/g, "-");
  return (
    <main>
      <PageHead crumb={{ href: "/v9", label: "Index" }} meta={`Updated ${page.updated}`} title={page.title}>
        <p className={s.notice}>
          <G name="plus" /> {page.notice}
        </p>
      </PageHead>
      <section className={`${s.sectionTight} ${s.wrap} ${s.legal}`}>
        <nav aria-label="On this page" className={s.legalNav}>
          <p className={s.label}>Contents</p>
          <ol>
            {page.blocks.map((b, i) => (
              <li key={b.heading}>
                <a href={`#${id(b.heading)}`}>
                  <span>{String(i + 1).padStart(2, "0")}</span> {b.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={s.article}>
          {page.blocks.map((b, i) => (
            <section key={b.heading} id={id(b.heading)}>
              <h2>
                <span className={s.legalNum}>{String(i + 1).padStart(2, "0")}</span> {b.heading}
              </h2>
              {b.paragraphs.map((t) => (
                <p key={t}>{t}</p>
              ))}
              {b.bullets.length > 0 && (
                <ul>
                  {b.bullets.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
