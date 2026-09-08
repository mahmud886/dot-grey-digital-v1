"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, socials, site } from "@/data/site";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { setScrollLocked } from "./SmoothScroll";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/cn";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLockBodyScroll(open);

  useEffect(() => {
    setScrollLocked(open);
    return () => setScrollLocked(false);
  }, [open]);

  // Close on route change so a link tap does not leave the overlay up.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      // Keep focus inside the overlay while it is open.
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    panel?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      id="mobile-menu"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-90 flex flex-col bg-bg transition-[clip-path,visibility] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
        open
          ? "visible [clip-path:circle(150%_at_calc(100%-2.5rem)_2.5rem)]"
          : "invisible [clip-path:circle(0%_at_calc(100%-2.5rem)_2.5rem)]",
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-end gap-3 px-5">
        <ThemeToggle />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid size-10 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 pb-10" aria-label="Mobile">
        <ul className="flex flex-col">
          {mainNav.map((item, i) => {
            const isOpen = expanded === item.label;
            return (
              <li key={item.label} className="border-b border-line">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block flex-1 py-4 font-display text-h2 uppercase text-fg transition-[transform,opacity,color] duration-500 hover:text-accent"
                    style={{
                      transitionDelay: open ? `${140 + i * 60}ms` : "0ms",
                      transform: open ? "translateY(0)" : "translateY(18px)",
                      opacity: open ? 1 : 0,
                    }}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                      className="grid size-10 place-items-center text-fg-muted"
                    >
                      <svg aria-hidden viewBox="0 0 24 24" className={cn("size-5 transition-transform duration-300", isOpen && "rotate-45")} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  ) : null}
                </div>

                {item.children ? (
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-400",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <ul className="overflow-hidden">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className="block py-2.5 pl-4 text-fg-muted transition-colors hover:text-accent"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                      <li aria-hidden className="h-3" />
                    </ul>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col gap-4">
          <a
            href={`mailto:${site.email}`}
            className="font-display text-h3 uppercase text-fg transition-colors hover:text-accent"
          >
            {site.email}
          </a>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
