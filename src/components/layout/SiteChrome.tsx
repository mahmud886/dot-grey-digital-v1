import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SmoothScroll } from "./SmoothScroll";
import { AmbientBackground } from "./AmbientBackground";
import { ScrollProgress } from "./ScrollProgress";
import { Cursor } from "./Cursor";
import { Preloader } from "./Preloader";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageTransition } from "./PageTransition";
import { site } from "@/data/site";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  telephone: site.phone,
  foundingDate: String(site.founded),
};

/**
 * The public site's shell. It lives here rather than in the root layout so that
 * /keystatic — which renders its own full-page CMS UI — does not inherit the ambient
 * background, cursor, smooth scrolling or preloader.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <ThemeProvider>
        <SmoothScroll>
          <AmbientBackground />
          <Preloader />
          <ScrollProgress />
          <Cursor />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-accent-strong focus:px-5 focus:py-3 focus:text-accent-fg"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScroll>
      </ThemeProvider>
    </div>
  );
}
