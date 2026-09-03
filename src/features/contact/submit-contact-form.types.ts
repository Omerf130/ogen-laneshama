export type ContactFormActionState = {
  success?: string;
  error?: string;
  fieldErrors?: Partial<Record<"name" | "phone" | "email" | "message", string>>;
};
