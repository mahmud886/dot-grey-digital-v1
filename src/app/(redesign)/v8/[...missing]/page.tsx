import { notFound } from "next/navigation";

/** Unknown URLs under /v8 get v8's own 404 (with its header and footer) instead of the global one. */
export default function V8Missing() {
  notFound();
}
