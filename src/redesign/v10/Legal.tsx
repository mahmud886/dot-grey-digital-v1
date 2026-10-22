import type { legalPages } from "@/redesign/content";
import { Page, PageHero } from "./Chrome";
import s from "./v10.module.css";

/** Privacy and Terms: a contents index beside numbered, readable sections. */
export function Legal({ page }: { page: (typeof legalPages)["privacy"] }) {
  const id = (h: string) => h.toLowerCase().replace(/\W+/g, "-");
  return (
    <Page>
      <PageHero kicker={`Document · updated ${page.updated}`} title={page.title.split(" ")[0]} form="dust" lede={page.title}>
        <p className={s.notice}>! {page.notice}</p>
      </PageHero>
      <section className={`${s.block} ${s.legal}`}>
        <nav aria-label="On this page" className={s.toc}>
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
        <div className={s.prose}>
          {page.blocks.map((b, i) => (
            <section key={b.heading} id={id(b.heading)}>
              <h2>
                <span className={s.proseNum}>{String(i + 1).padStart(2, "0")}</span> {b.heading}
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
    </Page>
  );
}
