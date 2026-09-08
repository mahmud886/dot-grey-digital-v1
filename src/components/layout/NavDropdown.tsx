"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/data/site";
import { cn } from "@/lib/cn";

/**
 * v1's dropdown was `hidden group-hover:block` — invisible to keyboards entirely. This one
 * opens on hover *and* focus, closes on Escape (returning focus to the trigger), and lets
 * arrow keys walk the items [36].
 */
export function NavDropdown({
  item,
  active,
  children: trigger,
}: {
  item: NavItem;
  active: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items = item.children ?? [];

  const focusItem = useCallback((index: number) => {
    const links = listRef.current?.querySelectorAll<HTMLAnchorElement>("a");
    if (!links?.length) return;
    const next = (index + links.length) % links.length;
    links[next].focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    const links = Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      // From the trigger, ArrowDown enters the menu at the first item.
      requestAnimationFrame(() => focusItem(current === -1 ? 0 : current + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (current > 0) focusItem(current - 1);
      else triggerRef.current?.focus();
    }
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={onKeyDown}
    >
      <Link
        ref={triggerRef}
        href={item.href}
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex h-20 items-center gap-1.5 px-4 font-display text-[0.8125rem] font-medium tracking-[0.08em] uppercase transition-colors duration-300",
          active ? "text-accent" : "text-fg hover:text-accent",
        )}
      >
        {trigger}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={cn("size-3 transition-transform duration-300", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-4 bottom-6 h-px origin-left bg-accent transition-transform duration-300",
            active || open ? "scale-x-100" : "scale-x-0",
          )}
        />
      </Link>

      {/* The panel's open state is driven by inline style rather than swapped utility
          classes: it is JS state, it needs to animate, and keeping it here means the
          transition cannot be defeated by utility ordering. */}
      <div
        className="absolute top-full left-1/2 w-56 rounded-2xl border border-line bg-bg-card p-2 backdrop-blur-xl"
        style={{
          transform: `translateX(-50%) translateY(${open ? "0px" : "8px"})`,
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "auto" : "none",
          transition:
            "opacity 300ms var(--ease-out-expo), transform 300ms var(--ease-out-expo), visibility 300ms",
        }}
      >
        <ul ref={listRef}>
          {items.map((child, i) => (
            <li key={child.href}>
              <Link
                href={child.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3.5 py-2.5 text-[0.9375rem] text-fg-muted transition-[background-color,color,translate] duration-200 hover:translate-x-1 hover:bg-accent-dim hover:text-fg"
                style={{
                  transitionDelay: open ? `${i * 30}ms` : "0ms",
                }}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
