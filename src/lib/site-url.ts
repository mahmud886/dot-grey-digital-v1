import { site } from "@/data/site";

/**
 * The address this deployment is actually served from, for everything that has to be
 * absolute: share images, og:url, the sitemap, robots.txt, the Organization JSON-LD.
 *
 * `site.url` (edited in the CMS) is the domain the site is *meant* to live on, and it only
 * becomes true once DNS points at this deployment. Until then dotgreydigital.com is still the
 * previous site on other hosting, and every absolute URL built from it 404s — link previews
 * on Facebook, LinkedIn and WhatsApp come up with no image, and the sitemap hands search
 * engines pages that do not exist on that server.
 *
 * On Vercel, VERCEL_PROJECT_PRODUCTION_URL is the production domain Vercel is serving: the
 * *.vercel.app address today, and the custom domain automatically once one is attached to
 * the project. So this is right before the switch and after it, with nothing to remember.
 * NEXT_PUBLIC_SITE_URL overrides it for a host that provides neither.
 *
 * Server-only — VERCEL_PROJECT_PRODUCTION_URL is not exposed to the browser. Every caller
 * today is a server component or a metadata route.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return site.url;
}

export const siteUrl = resolveSiteUrl().replace(/\/+$/, "");
