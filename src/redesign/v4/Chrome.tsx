import Link from "next/link";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { site } from "@/redesign/content";
import s from "./v4.module.css";

export function Header() {
  return (
    <header className={s.header}>
      <div className={s.logoCell}>
        <BrandMark href="/v4" ink="#ffffff" accent="#e4ff00" className={s.logo} />
      </div>
      <nav className={s.nav} aria-label="Main">
        <Link href="/v4#services">Services</Link>
        <Link href="/v4#work">Work</Link>
        <Link href="/v4#process">Process</Link>
      </nav>
      <Link href="/v4#contact" className={s.headCta}>
        Let&apos;s build →
      </Link>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={`${s.footer} ${s.pad}`}>
      <BrandMark href="/v4" ink="#ffffff" accent="#e4ff00" className={s.footLogo} />
      <div>
        <div className={s.footLinks}>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <Link href="/versions">All versions</Link>
          <span>Dhaka / Remote</span>
        </div>
        <p className={s.label} style={{ marginTop: "1rem", color: "#9a9a9a" }}>
          © {new Date().getFullYear()} DotGrey Digital — Prototype v4 Brutal
        </p>
      </div>
    </footer>
  );
}
