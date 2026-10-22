import Link from "next/link";
import type { ReactNode } from "react";
import { Em } from "./Chrome";
import s from "./v12.module.css";

/** The closing invitation on the agency pages: a big line with an italic turn and two ways in. */
export function Closing({ title, turn, primary = { href: "/v12/start", label: "Start a project" }, secondary }: { title: ReactNode; turn: ReactNode; primary?: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  return (
    <section className={`${s.wrap} ${s.contact}`}>
      <h2 className={s.ctaSmall}>
        {title} <Em>{turn}</Em>
      </h2>
      <div className={s.ctas}>
        <Link href={primary.href} className={s.pillInk}>
          {primary.label} <span aria-hidden="true">↗</span>
        </Link>
        {secondary && (
          <Link href={secondary.href} className={s.textLink}>
            {secondary.label}
          </Link>
        )}
      </div>
    </section>
  );
}

/** A section heading: small label, big title with its italic word, optional note. */
export function Head({ id, label, title, turn, note }: { id: string; label: string; title: ReactNode; turn?: ReactNode; note?: ReactNode }) {
  return (
    <div className={s.secHead}>
      <p className={s.label}>{label}</p>
      <h2 id={id} className={s.h2}>
        {title} {turn && <Em>{turn}</Em>}
      </h2>
      {note && <p className={s.note}>{note}</p>}
    </div>
  );
}
