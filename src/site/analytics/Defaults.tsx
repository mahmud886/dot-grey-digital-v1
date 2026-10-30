import { GA_ID } from "./config";

/**
 * Runs in <head>, before anything else: defines dataLayer and gtag and sets Consent Mode v2
 * to "denied" for every signal. gtag.js itself is not downloaded until the visitor accepts
 * (see Analytics.tsx). Renders nothing when no Measurement ID is configured.
 */
export function ConsentDefaults() {
  if (!GA_ID) return null;
  const source =
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;" +
    "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});" +
    "gtag('set','ads_data_redaction',true);";
  return <script dangerouslySetInnerHTML={{ __html: source }} />;
}
