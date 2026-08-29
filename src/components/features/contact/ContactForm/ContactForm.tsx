"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, getFieldDescribedBy } from "@/components/ui/form/FormField";
import { Input, Textarea } from "@/components/ui/form/Input";
import type { ContactFormContent } from "@/types/content";
import styles from "./ContactForm.module.scss";

interface ContactFormProps {
  form: ContactFormContent;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm({ form }: ContactFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const nextErrors: FormErrors = {};

    if (!name) nextErrors.name = "נא להזין שם";
    if (!phone) nextErrors.phone = "נא להזין מספר טלפון";
    if (!email) {
      nextErrors.email = "נא להזין כתובת דוא\"ל";
    } else if (!validateEmail(email)) {
      nextErrors.email = "נא להזין כתובת דוא\"ל תקינה";
    }
    if (!message) nextErrors.message = "נא להזין הודעה";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    /* Submission disabled until backend phase — no fake success state */
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-describedby="contact-form-notice"
    >
      <p id="contact-form-notice" className={styles.notice} role="status">
        {form.devNotice}
      </p>

      <FormField id="contact-name" label={form.nameLabel} required error={errors.name}>
        <Input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          hasError={Boolean(errors.name)}
          aria-describedby={getFieldDescribedBy(errors.name, "contact-name")}
        />
      </FormField>

      <FormField id="contact-phone" label={form.phoneLabel} required error={errors.phone}>
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          hasError={Boolean(errors.phone)}
          aria-describedby={getFieldDescribedBy(errors.phone, "contact-phone")}
        />
      </FormField>

      <FormField id="contact-email" label={form.emailLabel} required error={errors.email}>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          hasError={Boolean(errors.email)}
          aria-describedby={getFieldDescribedBy(errors.email, "contact-email")}
        />
      </FormField>

      <FormField id="contact-message" label={form.messageLabel} required error={errors.message}>
        <Textarea
          id="contact-message"
          name="message"
          required
          hasError={Boolean(errors.message)}
          aria-describedby={getFieldDescribedBy(errors.message, "contact-message")}
        />
      </FormField>

      <Button type="submit" disabled>
        {form.submitLabel}
      </Button>
    </form>
  );
}
