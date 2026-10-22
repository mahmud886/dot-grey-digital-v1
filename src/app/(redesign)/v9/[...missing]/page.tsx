import { notFound } from "next/navigation";

/** Unknown URLs under /v9 get v9's own 404 (with its header and footer) instead of the global one. */
export default function V9Missing() {
  notFound();
}
