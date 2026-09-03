"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, getFieldDescribedBy } from "@/components/ui/form/FormField";
import { Input, Textarea } from "@/components/ui/form/Input";
import { submitContactFormAction } from "@/features/contact/submit-contact-form.action";
import type { ContactFormActionState } from "@/features/contact/submit-contact-form.types";
import type { ContactFormContent } from "@/types/content";
import styles from "./ContactForm.module.scss";

interface ContactFormProps {
  form: ContactFormContent;
}

const initialState: ContactFormActionState = {};

export function ContactForm({ form }: ContactFormProps) {
  const [formStartedAt] = useState(() => Date.now());
  const [state, formAction, isPending] = useActionState(
    submitContactFormAction,
    initialState,
  );

  if (state.success) {
    return (
      <div className={styles.form}>
        <p className={styles.success} role="status">
          {state.success}
        </p>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      action={formAction}
      noValidate
    >
      <input type="hidden" name="formStartedAt" value={formStartedAt} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className={styles.honeypot}
      />

      {state.error && !state.fieldErrors ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : null}

      <FormField id="contact-name" label={form.nameLabel} required error={state.fieldErrors?.name}>
        <Input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          hasError={Boolean(state.fieldErrors?.name)}
          disabled={isPending}
          aria-describedby={getFieldDescribedBy(state.fieldErrors?.name, "contact-name")}
        />
      </FormField>

      <FormField id="contact-phone" label={form.phoneLabel} required error={state.fieldErrors?.phone}>
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          hasError={Boolean(state.fieldErrors?.phone)}
          disabled={isPending}
          aria-describedby={getFieldDescribedBy(state.fieldErrors?.phone, "contact-phone")}
        />
      </FormField>

      <FormField id="contact-email" label={form.emailLabel} required error={state.fieldErrors?.email}>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          hasError={Boolean(state.fieldErrors?.email)}
          disabled={isPending}
          aria-describedby={getFieldDescribedBy(state.fieldErrors?.email, "contact-email")}
        />
      </FormField>

      <FormField
        id="contact-message"
        label={form.messageLabel}
        required
        error={state.fieldErrors?.message}
      >
        <Textarea
          id="contact-message"
          name="message"
          required
          hasError={Boolean(state.fieldErrors?.message)}
          disabled={isPending}
          aria-describedby={getFieldDescribedBy(state.fieldErrors?.message, "contact-message")}
        />
      </FormField>

      <Button type="submit" disabled={isPending}>
        {isPending ? "שולח..." : form.submitLabel}
      </Button>
    </form>
  );
}
