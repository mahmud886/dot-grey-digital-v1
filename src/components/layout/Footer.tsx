import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { footerCompanyNav, legalNav, site, socials } from "@/data/site";
import { services } from "@/data/services";

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-subtle">
      {children}
    </h2>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block text-fg-muted transition-[color,transform] duration-300 hover:translate-x-1 hover:text-accent"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-elev pt-20 md:pt-28">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-6 text-fg-muted">{site.description}</p>
            <div className="mt-7 flex flex-col gap-1.5">
              <a
                href={`mailto:${site.email}`}
                className="font-display text-h3 uppercase text-fg transition-colors duration-300 hover:text-accent"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="text-fg-muted transition-colors duration-300 hover:text-accent"
              >
                {site.phone}
              </a>
            </div>
          </div>

          <div>
            <ColumnHeading>Services</ColumnHeading>
            <ul className="mt-5 flex flex-col gap-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <FooterLink href={`/services/${service.slug}`}>{service.title}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnHeading>Company</ColumnHeading>
            <ul className="mt-5 flex flex-col gap-2.5">
              {footerCompanyNav.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnHeading>Connect</ColumnHeading>
            <ul className="mt-5 flex flex-col gap-2.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="inline-block text-fg-muted transition-[color,transform] duration-300 hover:translate-x-1 hover:text-accent"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Oversized wordmark, clipped by the section edge. */}
      <div aria-hidden className="mt-16 overflow-hidden md:mt-24">
        <p className="px-5 text-center font-display leading-[0.78] font-bold tracking-[0.01em] whitespace-nowrap text-fg/[0.06] uppercase [font-size:clamp(4rem,16vw,16rem)]">
          DotGrey
        </p>
      </div>

      <Container>
        <div className="flex flex-col gap-4 border-t border-line py-7 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex items-center gap-5">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors duration-300 hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
