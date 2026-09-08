import type { Metadata } from "next";
import { Kanit, Roboto } from "next/font/google";
import { site } from "@/data/site";
import { ThemeScript } from "@/components/layout/ThemeScript";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
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
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
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
