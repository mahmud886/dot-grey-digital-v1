"use server";

import { z } from "zod";
import { budgetOptions, serviceOptions, timelineOptions } from "@/data/site";

export type BriefState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

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
  const parsed = schema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    company: formData.get("company"),
    service: formData.get("service"),
    budget: formData.get("budget"),
    timeline: formData.get("timeline"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  // Silently accept honeypot hits so bots get no signal.
  if (parsed.data.website) {
    return { status: "success", message: "Thanks — we will be in touch within one working day." };
  }

  // TODO: send via Resend/SMTP once the mail provider is chosen.
  console.info("[brief]", { ...parsed.data, website: undefined });

  return { status: "success", message: "Thanks — we will be in touch within one working day." };
}
