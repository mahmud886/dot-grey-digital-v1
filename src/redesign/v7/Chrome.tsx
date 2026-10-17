import Link from "next/link";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { disciplines, offices, site } from "@/redesign/content";
import s from "./v7.module.css";

export function Header() {
  return (
    <header className={`${s.wrap} ${s.header}`}>
      <div className={s.headerInner}>
        <BrandMark href="/v7" ink="#2b1d14" accent="#ff6a2b" className={s.logo} />
        <nav className={s.nav} aria-label="Main">
          <Link href="/v7#planner">Plan a project</Link>
          <Link href="/v7#services">Services</Link>
          <Link href="/v7#work">Work</Link>
          <Link href="/v7#faq">FAQ</Link>
        </nav>
        <Link href="/v7#hello" className={s.btn}>
          Say hello
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={`${s.wrap} ${s.footer}`}>
      <div className={s.footInner}>
        <div>
          <BrandMark href="/v7" ink="#2b1d14" accent="#ff6a2b" className={s.logo} />
          <p style={{ marginTop: "1rem", maxWidth: "36ch" }}>
            A friendly studio for design, software, automation, data and machine learning. Made with care in Dhaka.
          </p>
        </div>
        <div>
          <b style={{ color: "var(--ink)" }}>What we do</b>
          <ul style={{ marginTop: "0.5rem" }}>
            {disciplines.map((d) => (
              <li key={d.id}>{d.title}</li>
            ))}
          </ul>
        </div>
        <div>
          <b style={{ color: "var(--ink)" }}>Find us</b>
          <p style={{ marginTop: "0.5rem" }}>
            {offices[0].lines.join(", ")}
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p style={{ marginTop: "1rem" }}>
            <Link href="/versions" style={{ textDecoration: "underline" }}>
              All prototypes
            </Link>{" "}
            · © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
