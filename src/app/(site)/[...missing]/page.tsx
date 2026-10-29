import { notFound } from "next/navigation";

/** Unknown URLs get the site 404 (with its header and footer) instead of the bare global one. */
export default function MissingPage() {
  notFound();
}
