"use client";

import { useEffect } from "react";

/**
 * Puts a close button in the corner of Keystatic's array "Edit item" dialog, which ships
 * with Done as its only control — so a dialog you opened by mistake, or looked at and
 * changed nothing in, has no obvious way out.
 *
 * It closes and nothing more. Keystatic renders that dialog against the live preview props
 * for the array element, so anything typed is already in the form state either way; Done
 * does not commit and this does not discard. Nothing reaches the content files until the
 * editor presses Save on the screen behind.
 *
 * Closing goes through an Escape keydown, which is the dismissal Keystatic's own
 * DialogContainer already listens for, rather than a second path of our own.
 */
function enhance(dialog: HTMLElement) {
  if (dialog.dataset.closeButtonAdded) return;

  // Only the edit dialog is missing an exit; the add-item one already has Cancel.
  const hasDone = [...dialog.querySelectorAll("button")].some(
    (button) => button.textContent?.trim() === "Done",
  );
  if (!hasDone) return;
  dialog.dataset.closeButtonAdded = "true";

  if (getComputedStyle(dialog).position === "static") dialog.style.position = "relative";

  const close = document.createElement("button");
  close.type = "button";
  close.setAttribute("aria-label", "Close");
  close.style.cssText = [
    "position: absolute",
    "inset-block-start: 0.875rem",
    "inset-inline-end: 0.875rem",
    "display: grid",
    "place-items: center",
    "width: 2rem",
    "height: 2rem",
    "border-radius: 999px",
    // Keystatic's design-system class names are hashed at build time, so this is styled from
    // its CSS variables and falls back to a neutral that works in both of its themes.
    "border: 1px solid var(--ksv-border-color-neutral, rgba(128,128,128,0.4))",
    "background: transparent",
    "color: inherit",
    "cursor: pointer",
    "line-height: 0",
    "z-index: 1",
  ].join(";");
  close.innerHTML =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  close.addEventListener("click", () => {
    dialog.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true }),
    );
  });

  // Keep a long item heading from running underneath the button.
  const heading = dialog.querySelector<HTMLElement>("h1, h2, h3");
  if (heading) heading.style.paddingInlineEnd = "2.75rem";

  dialog.appendChild(close);
}

export function DialogCloseButton() {
  useEffect(() => {
    const scan = () => {
      for (const dialog of document.querySelectorAll<HTMLElement>('[role="dialog"]')) {
        enhance(dialog);
      }
    };
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
