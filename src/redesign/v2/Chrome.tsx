import Link from "next/link";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { site } from "@/redesign/content";
import { Dateline, ReadingProgress } from "./Client";
import s from "./v2.module.css";

export function Masthead({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <ReadingProgress />
      <div className={s.wrap}>
        <div className={`${s.strip} ${s.caps}`}>
          <span>
            <Dateline />
          </span>
          <span className={s.stripMid}>The studio journal of DotGrey Digital</span>
          <span>Dhaka · Remote · Est. {site.founded}</span>
        </div>
        {!compact && (
          <div className={s.mast}>
            <BrandMark href="/v2" ink="#191512" accent="#8c1c13" className={s.mastLogo} />
            <p className={s.mastTag}>Design, software, automation, data & machine learning — reported weekly.</p>
          </div>
        )}
      </div>
      <div className={s.navRow}>
        <nav className={`${s.wrap} ${s.nav} ${s.caps}`} aria-label="Sections">
          {compact && (
            <Link href="/v2" style={{ marginRight: "auto" }}>
              ← Front page
            </Link>
          )}
          <Link href="/v2#contents">Contents</Link>
          <Link href="/v2#features">Features</Link>
          <Link href="/v2#method">Method</Link>
          <Link href="/v2#letters">Letters</Link>
          <Link href="/v2#write">Write to us</Link>
        </nav>
      </div>
    </>
  );
}

export function Colophon() {
  return (
    <footer className={s.wrap}>
      <div className={s.colophon}>
        <p>
          <span className={s.caps}>Colophon</span>
          <br />
          Set in Newsreader and Libre Franklin. Printed on the internet from Dhaka, Bangladesh. Prototype v2 —{" "}
          <Link href="/versions" style={{ borderBottom: "1px solid currentColor" }}>
            compare all versions
          </Link>
          .
        </p>
        <p>
          <span className={s.caps}>Correspondence</span>
          <br />
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <br />© {new Date().getFullYear()} DotGrey Digital
        </p>
        <p className={s.fin}>Fin.</p>
      </div>
    </footer>
  );
}
