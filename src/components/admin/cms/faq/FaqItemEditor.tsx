"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createFaqItemAction,
  updateFaqItemAction,
} from "@/features/admin/faq/faq.actions";
import type { FaqItemLeanDocument } from "@/lib/db/repositories/faq-item.repository";
import {
  AdminActionFeedback,
  AdminField,
  AdminFormActions,
  AdminSection,
  AdminTextInput,
  AdminTextarea,
  AdminToggle,
  useAdminCmsSubmit,
  useAdminFormState,
} from "@/components/admin/forms";
import styles from "./FaqItemEditor.module.scss";

type FaqFormValues = {
  question: string;
  answer: string;
  isPublished: boolean;
};

type FaqItemEditorProps = {
  mode: "create" | "edit";
  initialItem?: FaqItemLeanDocument;
};

function toFormValues(item?: FaqItemLeanDocument): FaqFormValues {
  return {
    question: item?.question ?? "",
    answer: item?.answer ?? "",
    isPublished: item?.isPublished ?? false,
  };
}

export function FaqItemEditor({ mode, initialItem }: FaqItemEditorProps) {
  const router = useRouter();
  const action = mode === "create" ? createFaqItemAction : updateFaqItemAction;
  const { values, setField, isDirty, resetBaseline } =
    useAdminFormState(toFormValues(initialItem));
  const { state, submit, isPending } = useAdminCmsSubmit(action);

  useEffect(() => {
    if (state.success) {
      if (mode === "create") {
        router.push("/admin/faq");
        router.refresh();
        return;
      }

      resetBaseline(values);
    }
  }, [state.success, mode, router, resetBaseline, values]);

  const handleSave = () => {
    if (mode === "create") {
      submit(values);
      return;
    }

    if (!initialItem) {
      return;
    }

    submit({ id: initialItem.id, ...values });
  };

  return (
    <div className={styles.editor}>
      <Link href="/admin/faq" className={styles.backLink}>
        חזרה לרשימה
      </Link>

      <AdminActionFeedback success={state.success} error={state.error} />

      <AdminSection
        title={mode === "create" ? "שאלה חדשה" : "עריכת שאלה"}
      >
        <AdminField label="שאלה" htmlFor="faq-question">
          <AdminTextInput
            id="faq-question"
            value={values.question}
            onChange={(question) => setField("question", question)}
            disabled={isPending}
          />
        </AdminField>
        <AdminField label="תשובה" htmlFor="faq-answer">
          <AdminTextarea
            id="faq-answer"
            value={values.answer}
            onChange={(answer) => setField("answer", answer)}
            disabled={isPending}
            rows={6}
          />
        </AdminField>
        <AdminToggle
          id="faq-published"
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
