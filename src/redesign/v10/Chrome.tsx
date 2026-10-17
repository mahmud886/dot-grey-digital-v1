import Link from "next/link";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { offices, site } from "@/redesign/content";
import s from "./v10.module.css";

/** Top HUD: logo left, a single pill right. Fixed on every v10 page. */
export function Header({ home = false }: { home?: boolean }) {
  const base = home ? "" : "/v10";
  return (
    <header className={s.top}>
      <BrandMark href="/v10" ink="#ffffff" accent="#7a7a7a" className={s.logo} />
      <nav className={s.pill} aria-label="Main">
        <Link href={`${base}#work`}>Work</Link>
        <span className={s.pillRule} aria-hidden="true" />
        <Link href={`${base}#contact`}>Contact</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <span>© {new Date().getFullYear()} DotGrey Digital</span>
      <span>{offices[0].lines.join(", ")}</span>
      <a href={`mailto:${site.email}`}>{site.email}</a>
      <Link href="/">All prototypes</Link>
    </footer>
  );
}
