import Link from "next/link";
import { versions } from "@/redesign/content";
import { ReviewControls } from "./ReviewControls";

// Inline colours, because prototype CSS modules (unlayered) can override Tailwind utilities on links.
const DIM = "rgb(255 255 255 / 0.7)";

/** Small floating switcher so reviewers can hop between prototypes of the same set. */
export function VersionBar({ current }: { current: string }) {
  const set = versions.find((v) => v.id === current)?.set;
  return (
    <nav
      aria-label="Redesign prototypes"
      className="fixed bottom-3 left-1/2 z-[100] flex max-w-[calc(100vw-16px)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full [scrollbar-width:none] bg-black/80 [&>*]:shrink-0 p-1 text-[11px] font-medium tracking-wide text-white shadow-lg backdrop-blur"
      style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
    >
      <Link href="/" className="rounded-full px-3 py-1.5 text-white/70 hover:text-white" style={{ color: DIM }}>
        All
      </Link>
      {versions
        .filter((v) => v.set === set)
        .map((v) => (
          <Link
            key={v.id}
            href={`/${v.id}`}
            title={v.name}
            aria-current={v.id === current ? "page" : undefined}
            style={v.id === current ? { background: "#fff", color: "#000" } : { color: DIM }}
            className={
              v.id === current
                ? "rounded-full bg-white px-2.5 py-1.5 text-black"
                : "rounded-full px-2.5 py-1.5 text-white/70 hover:bg-white/15 hover:text-white"
            }
          >
            {v.id.toUpperCase()}
          </Link>
        ))}
      {set === "mono" && <ReviewControls />}
    </nav>
  );
}
