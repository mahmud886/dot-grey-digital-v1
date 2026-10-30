import type { Metadata } from "next";
import SiteLayout from "./(site)/layout";
import NotFoundPage from "./(site)/not-found";

export const metadata: Metadata = { title: "Page not found" };

/**
 * The root 404, used for 404.html in the static (cPanel) export, where no server routes
 * unknown URLs into the (site) group. Same page, wrapped in the site layout.
 */
export default function GlobalNotFound() {
  return (
    <SiteLayout>
      <NotFoundPage />
    </SiteLayout>
  );
}
