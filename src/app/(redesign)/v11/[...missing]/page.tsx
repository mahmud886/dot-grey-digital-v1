import { notFound } from "next/navigation";

/** Unknown URLs under /v11 get v11's own 404 (with its header and footer) instead of the global one. */
export default function V11Missing() {
  notFound();
}
