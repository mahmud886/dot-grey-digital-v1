import Link from "next/link";
import { disciplines, offices, site } from "@/redesign/content";
import { DhakaClock } from "./Client";
import s from "./v8.module.css";

/** Every page ends on a giant one-word sign-off: "Bye." on the homepage, "Done." on a case. */
export function Footer({ signoff = "Bye." }: { signoff?: string }) {
  return (
    <footer id="contact" className={`${s.chapterDark} ${s.footer}`}>
      <div className={s.footGrid}>
        <div className={s.footLead}>
          <p className={s.footKicker}>Got a product, a process or a pile of data?</p>
          <a href={`mailto:${site.email}`} className={s.footMail}>
            {site.email}
          </a>
          <div className={s.footCtas}>
            <Link href="mailto:hello@dotgreydigital.com" className={s.pillLight}>
              Start a project →
            </Link>
            <a href={`mailto:${site.email}?subject=Hello`} className={s.pillGhost}>
              Just say hello
            </a>
          </div>
        </div>
        <div>
          <p className={s.footHead}>Studio</p>
          {offices.map((o) => (
            <p key={o.label} className={s.footText}>
              <b>{o.label}</b>
              <br />
              {o.lines.join(", ")}
            </p>
          ))}
          <p className={s.footText}>
            <DhakaClock />
          </p>
        </div>
        <div>
          <p className={s.footHead}>What we do</p>
          <ul className={s.footList}>
            {disciplines.map((d) => (
              <li key={d.id}>
                <Link href="/v8#services">{d.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className={s.bye} aria-hidden="true">
        {signoff}
      </p>
      <div className={s.footBar}>
        <span>© {new Date().getFullYear()} DotGrey Digital</span>
        <span>
          Prototype v8 · <Link href="/">All versions</Link>
        </span>
      </div>
    </footer>
  );
}
