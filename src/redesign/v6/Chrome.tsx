import Link from "next/link";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { site } from "@/redesign/content";
import s from "./v6.module.css";

export function Nav() {
  return (
    <header className={`${s.nav} ${s.glass}`}>
      <BrandMark href="/v6" ink="#14123a" accent="#6b4dff" className={s.logo} />
      <nav className={s.navLinks} aria-label="Main">
        <Link href="/v6#services">Services</Link>
        <Link href="/v6#work">Work</Link>
        <Link href="/v6#process">Process</Link>
      </nav>
      <Link href="/v6#contact" className={s.pill}>
        Let&apos;s talk
      </Link>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={`${s.wrap} ${s.footer}`}>
      <div className={`${s.footInner} ${s.glass}`}>
        <BrandMark href="/v6" ink="#14123a" accent="#6b4dff" className={s.logo} />
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <span>Dhaka · Remote</span>
        <Link href="/versions" style={{ textDecoration: "underline" }}>
          All versions
        </Link>
        <span>© {new Date().getFullYear()} DotGrey Digital · v6 Spatial</span>
      </div>
    </footer>
  );
}
