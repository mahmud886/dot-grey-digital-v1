"use client";

import { useEffect } from "react";

/**
 * Adds a Cancel button to Keystatic's array "Edit item" dialog, which ships with Done as
 * its only control.
 *
 * Keystatic renders that dialog against the live preview props for the array element, so
 * every keystroke is already in the form state and Done does nothing but close. There is
 * no buffered draft to throw away, which is why cancelling has to be done here: we snapshot
 * the fields when the dialog opens and write them back if the editor cancels.
 *
 * Nothing is saved to disk either way — the surrounding form still needs its own Save — so
 * this reverts an edit in progress, not a committed one.
 *
 * Values are restored through the native value setter plus an input event, because React
 * tracks its own copy of a controlled input's value and ignores a plain assignment.
 *
 * The snapshot covers inputs, textareas and selects. Anything it cannot faithfully put back
 * — an image picker, a rich-text editor, or a nested array whose rows can be added and
 * removed inside the dialog — makes the button say Close and skip the restore, so the label
 * never promises a revert it will not do.
 */

type Restorable = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const FIELD_SELECTOR = "input, textarea, select";
const UNRESTORABLE_SELECTOR = '[contenteditable="true"], input[type="file"]';

function setValue(field: Restorable, value: string) {
  const prototype =
    field instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : field instanceof HTMLSelectElement
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  setter?.call(field, value);
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
}

function enhance(dialog: HTMLElement) {
  if (dialog.dataset.cancelAdded) return;

  const done = [...dialog.querySelectorAll("button")].find(
    (button) => button.textContent?.trim() === "Done",
  );
  if (!done?.parentElement) return;
  dialog.dataset.cancelAdded = "true";

  const fields = [...dialog.querySelectorAll<Restorable>(FIELD_SELECTOR)].filter(
    (field) => !(field instanceof HTMLInputElement && field.type === "file"),
  );
  // `checked` is only meaningful for a checkbox or radio — reading it on a text input
  // returns false rather than undefined, which is what made an earlier version of this
  // treat every text field as a checkbox and skip restoring it.
  const isToggle = (field: Restorable): field is HTMLInputElement =>
    field instanceof HTMLInputElement && (field.type === "checkbox" || field.type === "radio");
  const snapshot = fields.map((field) => ({
    field,
    value: field.value,
    checked: isToggle(field) ? field.checked : null,
  }));
  // A nested "Add" button means an array inside this item, whose rows a snapshot of field
  // values cannot put back.
  const hasNestedArray = [...dialog.querySelectorAll("button")].some(
    (button) => button.textContent?.trim() === "Add",
  );
  const canRestore = !hasNestedArray && !dialog.querySelector(UNRESTORABLE_SELECTOR);

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = canRestore ? "Cancel" : "Close";
  // Keystatic's design system classes are hashed at build time, so the button is styled
  // from its tokens rather than by borrowing a class name that will not survive an upgrade.
  cancel.style.cssText = [
    "margin-inline-end: 0.75rem",
    "padding: 0 1.25rem",
    "height: 2.5rem",
    "border-radius: 999px",
    "border: 1px solid var(--ksv-border-color-neutral, rgba(128,128,128,0.45))",
    "background: transparent",
    "color: inherit",
    "font: inherit",
    "font-weight: 600",
    "cursor: pointer",
  ].join(";");

  cancel.addEventListener("click", () => {
    if (canRestore) {
      for (const entry of snapshot) {
        if (entry.checked !== null) {
          const toggle = entry.field as HTMLInputElement;
          if (toggle.checked !== entry.checked) toggle.click();
          continue;
        }
        if (entry.field.value !== entry.value) setValue(entry.field, entry.value);
      }
    }
    // Escape is how Keystatic's own DialogContainer dismisses; reusing it keeps the close
    // path identical to the one the dialog already supports.
    dialog.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true }),
    );
  });

  done.parentElement.insertBefore(cancel, done);
}

export function DialogCancel() {
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
