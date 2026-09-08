"use server";

import { z } from "zod";

export type ApplicationState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

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
  const parsed = schema.safeParse({
    role: formData.get("role"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    portfolio: formData.get("portfolio"),
    note: formData.get("note"),
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

  if (parsed.data.website) {
    return { status: "success", message: "Thanks for applying — we read every application." };
  }

  // TODO: send via Resend/SMTP once the mail provider is chosen.
  console.info("[application]", { ...parsed.data, website: undefined });

  return { status: "success", message: "Thanks for applying — we read every application." };
}
