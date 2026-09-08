import "server-only";
import { site } from "@/data/site";

/**
 * Email delivery for the two forms.
 *
 * Resend is used when RESEND_API_KEY is set. Without it — local development, or a deploy
 * where the key has not been added yet — the payload is logged and the caller still gets
 * a success result, so a missing key can never turn into a failed submission for a real
 * visitor. The result says which path ran, and the caller records it.
 */
export type MailResult = { delivered: boolean; reason?: string };

type MailInput = {
  subject: string;
  /** Plain-text body. These are internal notification emails, not marketing. */
  text: string;
  replyTo?: string;
};

export async function sendNotification({
  subject,
  text,
  replyTo,
}: MailInput): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.info("[mail:skipped]", { subject, to, text });
    return { delivered: false, reason: "RESEND_API_KEY or CONTACT_FROM_EMAIL not set" };
  }

  try {
    // Imported lazily so the SDK stays out of the bundle when mail is not configured.
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      text,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      console.error("[mail:failed]", error);
      return { delivered: false, reason: error.message };
    }

    return { delivered: true };
  } catch (err) {
    // A delivery failure must not lose the submission or show the visitor an error they
    // cannot act on — it is logged for us and reported as sent to them.
    console.error("[mail:threw]", err);
    return { delivered: false, reason: err instanceof Error ? err.message : "unknown" };
  }
}
