"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, type NavItem } from "@/data/site";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { direction, scrolled } = useScrollDirection();
  const pathname = usePathname();

  const hidden = direction === "down" && !menuOpen;

  const isActive = (item: NavItem) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-80 will-change-[translate,opacity]",
          // `translate`, not `transform`: Tailwind v4's -translate-y-* utilities set the
          // standalone `translate` property, so transitioning `transform` animated nothing
          // and the header simply vanished the instant the direction flipped.
          "transition-[translate,opacity,background-color,backdrop-filter,border-color]",
          scrolled
            ? "border-b border-line bg-bg/95 lg:bg-bg/80 lg:backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
          // Asymmetric on purpose: it lifts away on an ease-in curve, so it gathers speed and
          // reads as leaving, and comes back on expo-out, which arrives fast and settles.
          hidden
            ? "-translate-y-full opacity-0 duration-[420ms] ease-[cubic-bezier(0.55,0,0.85,0.4)]"
            : "translate-y-0 opacity-100 duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-6 lg:h-20">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center">
              {mainNav.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <NavDropdown item={item} active={isActive(item)}>
                      {item.label}
                    </NavDropdown>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isActive(item) ? "page" : undefined}
                      className={cn(
                        "group relative flex h-20 items-center px-4 font-display text-[0.8125rem] font-medium tracking-[0.08em] uppercase transition-colors duration-300",
                        isActive(item) ? "text-accent" : "text-fg hover:text-accent",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute inset-x-4 bottom-6 h-px origin-left bg-accent transition-transform duration-300",
                          isActive(item) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Magnetic className="hidden lg:inline-block">
              <ButtonLink href="/contact" size="sm">
                Get a quote
              </ButtonLink>
            </Magnetic>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid size-10 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent lg:hidden"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
