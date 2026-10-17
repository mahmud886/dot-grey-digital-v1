import Link from "next/link";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { site } from "@/redesign/content";
import { Clock } from "./Client";
import s from "./v5.module.css";

export function StatusBar() {
  return (
    <header className={s.bar}>
      <div className={`${s.wrap} ${s.barInner}`}>
        <BrandMark href="/v5" ink="#39ff6a" accent="#ffb000" className={s.logo} />
        <nav className={s.tabs} aria-label="Main">
          <Link href="/v5#shell">[0] shell</Link>
          <Link href="/v5#pipeline">[1] pipeline</Link>
          <Link href="/v5#services">[2] services</Link>
          <Link href="/v5#work">[3] work</Link>
          <Link href="/v5#contact">[4] contact</Link>
        </nav>
        <Clock />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={`${s.wrap} ${s.footer}`}>
      <div>guest@dotgrey:~$ logout</div>
      <div>
        [process exited with code 0] · {site.email} · prototype v5 ·{" "}
        <Link href="/" style={{ textDecoration: "underline" }}>
          all versions
        </Link>{" "}
        · © {new Date().getFullYear()} DotGrey Digital
      </div>
    </footer>
  );
}

export function Window({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={s.window}>
      <div className={s.titlebar}>
        <span className={s.lights} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {title}
      </div>
      <div className={s.screen}>{children}</div>
    </div>
  );
}
