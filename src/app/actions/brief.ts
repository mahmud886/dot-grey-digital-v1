"use server";

import { z } from "zod";
import { budgetOptions, serviceOptions, timelineOptions } from "@/data/site";
import { sendNotification } from "@/lib/mail";

export type BriefState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Echoed back so a validation error does not wipe what the visitor typed. */
  values?: Record<string, string>;
};

/** FormData returns null for a control the browser did not submit; zod sees null as a
 *  type error rather than "empty", so optional fields would reject. Normalise first. */
function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}


const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.enum(serviceOptions as [string, ...string[]], { error: "Please choose a service." }),
  budget: z.enum(budgetOptions as [string, ...string[]], { error: "Please choose a budget range." }),
  timeline: z.enum(timelineOptions as [string, ...string[]]).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more — at least 10 characters.").max(4000),
  // Bots fill hidden fields; humans leave them empty.
  website: z.string().max(0).optional(),
});

export async function submitBrief(_prev: BriefState, formData: FormData): Promise<BriefState> {
  const values = Object.fromEntries(
    ["fullName", "email", "company", "service", "budget", "timeline", "message"].map((k) => [
      k,
      field(formData, k),
    ]),
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

  // Silently accept honeypot hits so bots get no signal.
  if (parsed.data.website) {
    return { status: "success", message: "Thanks — we will be in touch within one working day." };
  }

  const { fullName, email, company, service, budget, timeline, message } = parsed.data;

  const result = await sendNotification({
    subject: `New project brief — ${fullName}${company ? ` (${company})` : ""}`,
    replyTo: email,
    text: [
      `Name:     ${fullName}`,
      `Email:    ${email}`,
      `Company:  ${company || "—"}`,
      `Service:  ${service}`,
      `Budget:   ${budget}`,
      `Timeline: ${timeline || "—"}`,
      "",
      message,
    ].join("\n"),
  });

  if (!result.delivered) {
    // The visitor still gets a success message — the submission is in the logs and the
    // cause is ours to fix, not theirs.
    console.warn("[brief:not-delivered]", result.reason);
  }

  return { status: "success", message: "Thanks — we will be in touch within one working day." };
}
