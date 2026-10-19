"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createTestimonialAction,
  updateTestimonialAction,
} from "@/features/admin/testimonials/testimonials.actions";
import type { TestimonialLeanDocument } from "@/lib/db/repositories/testimonial.repository";
import {
  AdminActionFeedback,
  AdminField,
  AdminFormActions,
  AdminSection,
  AdminTextInput,
  AdminTextarea,
  AdminToggle,
  useAdminBaselineOnSaveComplete,
  useAdminCmsSubmit,
  useAdminFormState,
} from "@/components/admin/forms";
import styles from "../faq/FaqItemEditor.module.scss";

type TestimonialFormValues = {
  quote: string;
  name: string;
  context: string;
  isPublished: boolean;
};

type TestimonialItemEditorProps = {
  mode: "create" | "edit";
  initialItem?: TestimonialLeanDocument;
};

function toFormValues(item?: TestimonialLeanDocument): TestimonialFormValues {
  return {
    quote: item?.quote ?? "",
    name: item?.name ?? "",
    context: item?.context ?? "",
    isPublished: item?.isPublished ?? false,
  };
}

export function TestimonialItemEditor({
  mode,
  initialItem,
}: TestimonialItemEditorProps) {
  const router = useRouter();
  const action =
    mode === "create" ? createTestimonialAction : updateTestimonialAction;
  const { values, setField, isDirty, resetBaseline } =
    useAdminFormState(toFormValues(initialItem));
  const { state, submit, isPending } = useAdminCmsSubmit(action);

  useEffect(() => {
    if (state.success && mode === "create") {
      router.push("/admin/testimonials");
      router.refresh();
    }
  }, [state.success, mode, router]);

  useAdminBaselineOnSaveComplete(
    isPending,
    mode === "edit" ? state.success : undefined,
    values,
    resetBaseline,
  );

  const handleSave = () => {
    const payload = {
      quote: values.quote,
      name: values.name.trim() || undefined,
      context: values.context.trim() || undefined,
      isPublished: values.isPublished,
    };

    if (mode === "create") {
      submit(payload);
      return;
    }

    if (!initialItem) {
      return;
    }

    submit({ mongoId: String(initialItem._id), ...payload });
  };

  return (
    <div className={styles.editor}>
      <Link href="/admin/testimonials" className={styles.backLink}>
        חזרה לרשימה
      </Link>

      <AdminActionFeedback success={state.success} error={state.error} />

      <AdminSection
        title={mode === "create" ? "המלצה חדשה" : "עריכת המלצה"}
      >
        <AdminField label="ציטוט" htmlFor="testimonial-quote">
          <AdminTextarea
            id="testimonial-quote"
            value={values.quote}
            onChange={(quote) => setField("quote", quote)}
            disabled={isPending}
            rows={5}
          />
        </AdminField>
        <AdminField label="שם (אופציונלי)" htmlFor="testimonial-name">
          <AdminTextInput
            id="testimonial-name"
            value={values.name}
            onChange={(name) => setField("name", name)}
            disabled={isPending}
          />
        </AdminField>
        <AdminField label="הקשר (אופציונלי)" htmlFor="testimonial-context">
          <AdminTextInput
            id="testimonial-context"
            value={values.context}
            onChange={(context) => setField("context", context)}
            disabled={isPending}
          />
        </AdminField>
        <AdminToggle
          id="testimonial-published"
          label="פרסום"
          checked={values.isPublished}
          onChange={(isPublished) => setField("isPublished", isPublished)}
          disabled={isPending}
        />
      </AdminSection>

      <AdminFormActions
        isDirty={mode === "create" ? true : isDirty}
        isPending={isPending}
        onSave={handleSave}
      />
    </div>
  );
}
