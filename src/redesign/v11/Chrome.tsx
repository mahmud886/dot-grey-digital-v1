import Link from "next/link";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { disciplines, offices, site } from "@/redesign/content";
import { Header as ClientHeader, LiveTime } from "./Client";
import s from "./v11.module.css";

export function Header() {
  return <ClientHeader items={disciplines.map(({ id, number, title, line }) => ({ id, number, title, line }))} />;
}

/** Section title with a "(06)" style counter, Basic-style. */
export function SectionHead({ title, count, children, id }: { title: string; count?: number; children?: React.ReactNode; id?: string }) {
  return (
    <div className={s.sectionHead}>
      <h2 id={id} className={s.h2}>
        {title}
        {count !== undefined && <span className={s.count}>({String(count).padStart(2, "0")})</span>}
      </h2>
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer id="contact" className={s.footer}>
      <a href={`mailto:${site.email}`} className={s.cta}>
        <span>Got a project?</span>{" "}
        <span className={s.ctaLine}>
          <span className={s.dot} aria-hidden="true">
            ●
          </span>{" "}
          Let&apos;s talk.
        </span>
      </a>

      <div className={s.footGrid}>
        <div>
          <span className={s.label}>New business</span>
          <a href={`mailto:${site.email}`} className={s.footLink}>
            {site.email}
          </a>
        </div>
        {offices.map((o) => (
          <div key={o.label}>
            <span className={s.label}>{o.label}</span>
            <p>
              {o.lines.map((l) => (
                <span key={l}>
                  {l}
                  <br />
                </span>
              ))}
            </p>
            {o.label === "Dhaka" ? (
              <p className={s.clock}>
                <LiveTime tz="Asia/Dhaka" /> <span className={s.muted}>GMT+6</span>
              </p>
            ) : (
              <p className={s.clock}>
                4 <span className={s.muted}>time zones</span>
              </p>
            )}
          </div>
        ))}
        <div>
          <span className={s.label}>Index</span>
          <ul className={s.footNav}>
            <li>
              <Link href="/v11#work">Work</Link>
            </li>
            <li>
              <Link href="/v11#services">Services</Link>
            </li>
            <li>
              <Link href="/v11#process">Process</Link>
            </li>
            <li>
              <Link href="/">All prototypes</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={s.footMark}>
        <BrandMark href="/v11" ink="#f4f4f2" accent="#7a7a78" className={s.footLogo} />
      </div>
      <div className={s.footBase}>
        <span>©26 DotGrey®</span>
        <span>Design ● Software ● Automation ● Data ● ML</span>
        <span>Since {site.founded}</span>
      </div>
    </footer>
  );
}
