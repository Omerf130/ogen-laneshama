"use server";

import { publicContactFormSchema } from "@/lib/validation/lead";
import { createLead } from "@/lib/db/repositories/lead.repository";
import type { ContactFormActionState } from "./submit-contact-form.types";

const GENERIC_ERROR = "לא ניתן לשלוח את הפנייה כרגע. נסו שוב מאוחר יותר.";
const SUCCESS_MESSAGE =
  "תודה על פנייתך. קיבלנו את ההודעה ונחזור אלייך בהקדם.";

const MIN_SUBMIT_MS = 2000;

function mapZodFieldErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>,
): ContactFormActionState["fieldErrors"] {
  const fieldErrors: ContactFormActionState["fieldErrors"] = {};

  for (const issue of issues) {
    const key = issue.path[0];

    if (
      typeof key === "string" &&
      (key === "name" || key === "phone" || key === "email" || key === "message")
    ) {
      fieldErrors[key] = "השדה אינו תקין";
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export async function submitContactFormAction(
  _prev: ContactFormActionState,
  formData: FormData,
): Promise<ContactFormActionState> {
  const parsed = publicContactFormSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
    formStartedAt: formData.get("formStartedAt"),
  });

  if (!parsed.success) {
    const fieldErrors = mapZodFieldErrors(parsed.error.issues);

    if (fieldErrors) {
      return { fieldErrors, error: "נא לתקן את השדות המסומנים" };
    }

    return { error: GENERIC_ERROR };
  }

  if (parsed.data.website?.trim()) {
    return { success: SUCCESS_MESSAGE };
  }

  if (
    parsed.data.formStartedAt &&
    Date.now() - parsed.data.formStartedAt < MIN_SUBMIT_MS
  ) {
    return { error: GENERIC_ERROR };
  }

  try {
    await createLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      message: parsed.data.message,
      sourcePage: "/contact",
    });

    return { success: SUCCESS_MESSAGE };
  } catch {
    return { error: GENERIC_ERROR };
  }
}
