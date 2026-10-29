import { notFound } from "next/navigation";

/** Unknown URLs under /v13 get v13's own 404 (with its header and footer) instead of the global one. */
export default function V13Missing() {
  notFound();
}
