import { notFound } from "next/navigation";

/** Unknown URLs under /v12 get v12's own 404 (with its header and footer) instead of the global one. */
export default function V12Missing() {
  notFound();
}
