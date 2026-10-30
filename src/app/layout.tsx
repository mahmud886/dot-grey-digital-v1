import type { Metadata } from "next";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/site-url";
import { ThemeScript } from "@/site/shared/ThemeScript";
import { ConsentDefaults } from "@/site/analytics/Defaults";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — design, software, automation, data and AI`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  // No url here on purpose: metadata merges field by field, so a url set at this level would
  // make every page claim to be the homepage, and link previews follow og:url. Each page sets
  // its own canonical instead.
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning must sit on <html> itself — ThemeScript mutates this exact
    // element, and on an ancestor the prop would silently do nothing.
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <ThemeScript />
        <ConsentDefaults />
      </head>
      <body>{children}</body>
    </html>
  );
}
