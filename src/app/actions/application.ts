"use server";

import { z } from "zod";
import { sendNotification } from "@/lib/mail";

export type ApplicationState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Echoed back so a validation error does not wipe what the applicant typed. */
  values?: Record<string, string>;
};

/** FormData returns null for a control the browser did not submit; zod sees null as a
 *  type error rather than "empty", so optional fields would reject. Normalise first. */
function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}


const schema = z.object({
  role: z.string().trim().min(1).max(200),
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  portfolio: z.url("Please enter a valid URL, including https://").max(400).or(z.literal("")),
  note: z.string().trim().min(20, "A short note helps — at least 20 characters.").max(4000),
  website: z.string().max(0).optional(),
});

export async function submitApplication(
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const values = Object.fromEntries(
    ["role", "fullName", "email", "phone", "portfolio", "note"].map((k) => [k, field(formData, k)]),
  );

  const parsed = schema.safeParse({ ...values, website: field(formData, "website") });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors, values };
  }

  if (parsed.data.website) {
    return { status: "success", message: "Thanks for applying — we read every application." };
  }

  const { role, fullName, email, phone, portfolio, note } = parsed.data;

  const result = await sendNotification({
    subject: `Application — ${role} — ${fullName}`,
    replyTo: email,
    text: [
      `Role:      ${role}`,
      `Name:      ${fullName}`,
      `Email:     ${email}`,
      `Phone:     ${phone || "—"}`,
      `Portfolio: ${portfolio || "—"}`,
      "",
      note,
    ].join("\n"),
  });

  if (!result.delivered) {
    console.warn("[application:not-delivered]", result.reason);
  }

  return { status: "success", message: "Thanks for applying — we read every application." };
}
