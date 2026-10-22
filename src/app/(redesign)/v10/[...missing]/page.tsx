import { notFound } from "next/navigation";

/** Unknown URLs under /v10 get v10's own 404 (with its HUD) instead of the global one. */
export default function V10Missing() {
  notFound();
}
