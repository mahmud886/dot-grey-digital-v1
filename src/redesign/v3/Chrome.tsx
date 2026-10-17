import Link from "next/link";
import { BrandMark } from "@/redesign/shared/BrandMark";
import { site } from "@/redesign/content";
import s from "./v3.module.css";

export function Header({ dwg }: { dwg: string }) {
  return (
    <header className={s.header}>
      <div className={`${s.wrap} ${s.titleBlock}`}>
        <div className={s.tbCell}>
          <BrandMark href="/v3" ink="#e6efff" accent="#ffd23f" className={s.logo} />
        </div>
        <div className={`${s.tbCell} ${s.tbMeta} ${s.mono}`}>
          <small>Dwg no.</small>
          {dwg}
        </div>
        <div className={`${s.tbCell} ${s.tbMeta} ${s.mono}`}>
          <small>Scale</small>
          1 : 1
        </div>
        <div className={`${s.tbCell} ${s.tbMeta} ${s.mono}`}>
          <small>Rev</small>C — {new Date().getFullYear()}
        </div>
        <nav className={`${s.nav} ${s.mono}`} aria-label="Main">
          <Link href="/v3#system">System</Link>
          <Link href="/v3#specs">Specs</Link>
          <Link href="/v3#drawings">Drawings</Link>
          <Link href="/v3#schedule">Schedule</Link>
        </nav>
        <div className={s.tbCell} style={{ paddingRight: 0 }}>
          <Link href="/v3#brief" className={s.cta}>
            Request a spec →
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <div className={`${s.footGrid} ${s.mono}`}>
          <div>
            <small>Drawn by</small>
            <span style={{ color: "var(--fg)" }}>DotGrey Digital — design, software, automation, data & ML.</span>
          </div>
          <div>
            <small>Contact</small>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div>
            <small>Location</small>
            Dhaka · Remote
          </div>
          <div>
            <small>Sheet</small>
            Prototype v3 —{" "}
            <Link href="/" style={{ textDecoration: "underline" }}>
              all versions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Line-drawn schematic for each discipline. */
export function Schematic({ id }: { id: string }) {
  const common = { className: s.sheetIcon, viewBox: "0 0 240 90", "aria-hidden": true } as const;
  switch (id) {
    case "design":
      return (
        <svg {...common}>
          <rect x="20" y="10" width="200" height="70" />
          <rect x="30" y="20" width="70" height="50" />
          <path d="M110 24h100M110 36h80M110 48h90M110 62h40" />
          <circle cx="65" cy="45" r="14" />
        </svg>
      );
    case "development":
      return (
        <svg {...common}>
          <path d="M70 20L40 45l30 25M170 20l30 25-30 25M135 15l-30 60" />
        </svg>
      );
    case "software":
      return (
        <svg {...common}>
          <rect x="70" y="8" width="100" height="20" />
          <rect x="70" y="35" width="100" height="20" />
          <rect x="70" y="62" width="100" height="20" />
          <path d="M80 18h4M80 45h4M80 72h4M20 45h50M170 45h50" />
        </svg>
      );
    case "automation":
      return (
        <svg {...common}>
          <rect x="15" y="30" width="44" height="30" />
          <rect x="98" y="30" width="44" height="30" />
          <rect x="181" y="30" width="44" height="30" />
          <path d="M59 45h39M142 45h39M92 40l6 5-6 5M175 40l6 5-6 5M120 30V12h83v18" />
        </svg>
      );
    case "data":
      return (
        <svg {...common}>
          <path d="M30 80V10M30 80h190" />
          <rect x="50" y="50" width="22" height="30" />
          <rect x="90" y="35" width="22" height="45" />
          <rect x="130" y="20" width="22" height="60" />
          <rect x="170" y="42" width="22" height="38" />
          <path d="M50 46l40-16 40-14 40 20" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          {[20, 45, 70].map((y) => (
            <circle key={`a${y}`} cx="40" cy={y} r="6" />
          ))}
          {[12, 34, 56, 78].map((y) => (
            <circle key={`b${y}`} cx="120" cy={y} r="6" />
          ))}
          <circle cx="200" cy="45" r="6" />
          <path d="M46 20L114 12M46 20L114 34M46 45L114 34M46 45L114 56M46 70L114 56M46 70L114 78M126 12L194 45M126 34L194 45M126 56L194 45M126 78L194 45" />
        </svg>
      );
  }
}
