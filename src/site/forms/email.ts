import { rowsFor, subjectFor, type CleanData, type FormKind } from "./schema";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** The notification the studio receives: plain text plus a simple, escaped HTML table. */
export function notification(kind: FormKind, d: CleanData) {
  const rows = rowsFor(kind, d);
  const subject = subjectFor(kind, d);
  const text = `${subject}\n\n${rows.map(([k, v]) => (v.includes("\n") ? `${k}:\n${v}` : `${k}: ${v}`)).join("\n")}\n\n— Sent from the form on dotgreydigital.com. Reply to this email to answer ${d.name || d.email} directly.`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p style="margin:0 0 16px;font-size:13px;color:#6b6b68">New ${esc(kind)} from the website</p>
<h1 style="margin:0 0 20px;font-size:22px">${esc(subject)}</h1>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 16px 10px 0;border-top:1px solid #ddd;vertical-align:top;color:#6b6b68;white-space:nowrap">${esc(k)}</td><td style="padding:10px 0;border-top:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("")}</table>
<p style="margin:24px 0 0;font-size:13px;color:#6b6b68">Reply to this email to answer ${esc(d.name || d.email)} directly.</p></div>`;
  return { subject, text, html };
}

/** Optional confirmation to the visitor (CONTACT_AUTOREPLY=true). */
export function autoReply(kind: FormKind, d: CleanData, studio: string) {
  const first = (d.name || "").split(" ")[0] || "there";
  if (kind === "newsletter") {
    const line = "You're on the list for our occasional notes — a few a year, no more. Reply any time to unsubscribe.";
    return {
      subject: "You're on the list",
      text: `Hello,\n\n${line}\n\n${studio}`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111"><p>Hello,</p><p>${line}</p><p>${esc(studio)}</p></div>`,
    };
  }
  const what = kind === "apply" ? "your application" : "your brief";
  const text = `Hello ${first},\n\nThanks — we have ${what} and a person will reply within one working day.\n\nIf anything changes, just reply to this email.\n\n${studio}`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111"><p>Hello ${esc(first)},</p><p>Thanks — we have ${what} and a person will reply within one working day.</p><p>If anything changes, just reply to this email.</p><p>${esc(studio)}</p></div>`;
  return { subject: `Thanks — we have ${what}`, text, html };
}
