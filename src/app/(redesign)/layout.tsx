import type { Metadata } from "next";

// Prototypes for review, not part of the public site: keep them out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function RedesignLayout({ children }: { children: React.ReactNode }) {
  return children;
}
