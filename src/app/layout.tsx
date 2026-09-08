import type { Metadata } from "next";
import { Kanit, Roboto } from "next/font/google";
import { site } from "@/data/site";
import { ThemeScript } from "@/components/layout/ThemeScript";
import "./globals.css";

// Only the weights the design actually uses: 500 (nav), 600 (buttons and eyebrows),
// 700 (headings) and 800 (logo and footer wordmark). Every extra weight is another
// font file on the critical path.
const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
  preload: true,
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "digital agency",
    "UI/UX design",
    "web development",
    "email templates",
    "banner ads",
    "Veeva",
  ],
  // No title/description here on purpose. Metadata objects are merged field by field, so a
  // title set at this level is inherited whole by every child route — every case study and
  // article would share a link preview reading "DotGrey Digital". Left unset, Next fills
  // og:title and og:description from each page's own title and description.
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning must sit on <html> itself — ThemeScript mutates this exact
    // element, and on an ancestor the prop would silently do nothing.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${kanit.variable} ${roboto.variable} antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      {/* Site chrome lives in (site)/layout.tsx so /keystatic can opt out of it. */}
      <body>{children}</body>
    </html>
  );
}
