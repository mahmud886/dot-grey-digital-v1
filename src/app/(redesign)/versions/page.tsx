import type { Metadata } from "next";
import Link from "next/link";
import { versions, works } from "@/redesign/content";

export const metadata: Metadata = { title: "Redesign prototypes — DotGrey Digital" };

/** Comparison index for the seven redesign directions. Deliberately plain, so the versions speak. */
export default function Versions() {
  const sample = works[0].slug;
  return (
    <main className="min-h-screen bg-[#f5f5f4] px-5 py-14 text-[#1c1917] md:px-10" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#78716c]">DotGrey Digital — redesign, phase 1</p>
        <h1 className="mt-3 text-4xl font-bold normal-case tracking-tight md:text-6xl" style={{ fontFamily: "inherit", textTransform: "none", letterSpacing: "-0.03em" }}>
          Seven directions. Pick the one that feels like you.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#57534e]">
          Each prototype has a working homepage and a case-study page, its own type, colour and logo colours, and one
          signature interaction. Same content everywhere, so you are comparing design, not copy.
        </p>
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {versions.map((v) => (
            <li key={v.id} className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="flex h-24">
                {v.palette.map((c) => (
                  <span key={c} className="flex-1" style={{ background: c }} title={c} />
                ))}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="whitespace-nowrap text-2xl font-bold" style={{ fontFamily: "inherit", textTransform: "none", letterSpacing: "-0.02em" }}>
                    {v.id.toUpperCase()} — {v.name}
                  </h2>
                  <span className="text-xs text-[#78716c]">{v.fonts}</span>
                </div>
                <p className="text-[#44403c]">{v.idea}</p>
                <p className="text-sm text-[#57534e]">
                  <b className="text-[#1c1917]">Signature:</b> {v.signature}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  <Link href={`/${v.id}`} className="rounded-full bg-[#1c1917] px-4 py-2 text-sm font-semibold text-white hover:bg-black">
                    Open homepage →
                  </Link>
                  <Link href={`/${v.id}/work/${sample}`} className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5">
                    Case study
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-[#78716c]">
          Prototypes are excluded from search engines (noindex). The live site at <Link href="/" className="underline">/</Link> is unchanged.
        </p>
      </div>
    </main>
  );
}
