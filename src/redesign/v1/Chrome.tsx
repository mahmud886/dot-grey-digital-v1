import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { disciplines, site } from "@/redesign/content";
import s from "./v1.module.css";

export function Header() {
  return (
    <header className={s.header}>
      <div className={`${s.wrap} ${s.headerInner}`}>
        <BrandMark href="/v1" ink="#e9eaf4" accent="#c8ff3d" className={s.logo} />
        <nav className={`${s.nav} ${s.mono}`} aria-label="Main">
          <Link href="/v1#capabilities">Capabilities</Link>
          <Link href="/v1#work">Work</Link>
          <Link href="/v1#process">Process</Link>
          <Link href="/v1#contact">Contact</Link>
        </nav>
        <span className={`${s.status} ${s.mono}`}>
          <span className={s.dot} /> Taking projects for Q1
        </span>
        <Link href="/v1#contact" className={s.btn}>
          Start a project <ArrowUpRight size={16} />
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`${s.wrap} ${s.footGrid}`}>
        <div>
          <BrandMark href="/v1" ink="#e9eaf4" accent="#c8ff3d" className={s.logo} />
          <p style={{ marginTop: "1rem", maxWidth: "34ch" }}>
            Design, software, automation, data and machine learning — under one roof in Dhaka, shipping worldwide.
          </p>
        </div>
        <div>
          <h4 className={s.mono}>Capabilities</h4>
          <ul>
            {disciplines.map((d) => (
              <li key={d.id}>
                <Link href="/v1#capabilities">{d.short}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className={s.mono}>Contact</h4>
          <ul>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>Dhaka · Remote</li>
          </ul>
        </div>
        <div>
          <h4 className={s.mono}>Prototype</h4>
          <ul>
            <li>v1 — Signal</li>
            <li>
              <Link href="/versions">Compare all versions</Link>
            </li>
            <li>© {new Date().getFullYear()} DotGrey Digital</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
