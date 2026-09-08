import { DialogCancel } from "@/components/keystatic/DialogCancel";

/**
 * The CMS renders its own full-page UI, so it opts out of the site's chrome. Site pages
 * live in the (site) route group, which is what keeps that chrome away from here.
 */
export default function KeystaticLayout({ children }: LayoutProps<"/keystatic">) {
  return (
    <>
      {children}
      <DialogCancel />
    </>
  );
}
