"use client";

import { ACCENT_COOKIE, ACCENTS, writeCookie } from "./theme";
import { ThemeToggle } from "./ThemeToggle";
import { useAccent } from "./useTheme";

/**
 * Review-only controls in the version switcher: theme and accent. The accent picker exists
 * so the team can try colours live; the final site would ship one accent.
 */
export function ReviewControls() {
  const accent = useAccent();
  return (
    <span className="flex items-center gap-1 border-l border-white/20 pl-1.5">
      <ThemeToggle className="grid size-7 place-items-center rounded-full text-[15px] text-white/80 hover:bg-white/15 hover:text-white" />
      <span role="radiogroup" aria-label="Accent colour" className="flex items-center gap-1 px-1">
        {ACCENTS.map((a) => (
          <button
            key={a.id}
            type="button"
            role="radio"
            aria-checked={accent === a.id}
            aria-label={`${a.label} accent`}
            title={`${a.label} accent`}
            onClick={() => {
              document.documentElement.dataset.accent = a.id;
              writeCookie(ACCENT_COOKIE, a.id);
            }}
            className="size-4 rounded-full ring-white/0 ring-offset-1 ring-offset-black transition aria-checked:ring-2 aria-checked:ring-white"
            style={{ background: a.swatch, boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.35)" }}
          />
        ))}
      </span>
    </span>
  );
}
