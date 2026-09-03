"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { TreatmentLeanDocument } from "@/lib/db/repositories/treatment.repository";
import { saveTreatmentAction } from "@/features/admin/treatments/treatments.actions";
import {
  AdminActionFeedback,
  AdminField,
  AdminFormActions,
  AdminImageField,
  AdminSection,
  AdminSeoSection,
  AdminTextInput,
  AdminTextarea,
  ContentBlockEditor,
  fromContentBlockFormValue,
  toContentBlockFormValue,
  useAdminCmsSubmit,
  useAdminFormState,
} from "@/components/admin/forms";
import type { AdminImageFieldValue, AdminMediaPickerItem } from "@/types/admin-media-picker";
import styles from "./TreatmentEditor.module.scss";

type TreatmentFormValues = {
  title: string;
  shortDescription: string;
  emotionalOpening: string;
  image: AdminImageFieldValue;
  whatItIs: ReturnType<typeof toContentBlockFormValue>;
  whoItSuits: ReturnType<typeof toContentBlockFormValue>;
  sessionProcess: ReturnType<typeof toContentBlockFormValue>;
  supportiveGoals: ReturnType<typeof toContentBlockFormValue>;
  expectations: ReturnType<typeof toContentBlockFormValue>;
  disclaimer: string;
  cta: { label: string; href: string };
  seo: { title?: string; description?: string };
};

function toFormValues(treatment: TreatmentLeanDocument): TreatmentFormValues {
  return {
    title: treatment.title,
    shortDescription: treatment.shortDescription,
    emotionalOpening: treatment.emotionalOpening,
    image: {
      src: treatment.image?.src ?? null,
      alt: treatment.image?.alt ?? treatment.title,
      mediaId: treatment.image?.mediaId
        ? String(treatment.image.mediaId)
        : undefined,
    },
    whatItIs: toContentBlockFormValue(treatment.whatItIs),
    whoItSuits: toContentBlockFormValue(treatment.whoItSuits),
    sessionProcess: toContentBlockFormValue(treatment.sessionProcess),
    supportiveGoals: toContentBlockFormValue(treatment.supportiveGoals),
    expectations: toContentBlockFormValue(treatment.expectations),
    disclaimer: treatment.disclaimer ?? "",
    cta: { ...treatment.cta },
    seo: {
      title: treatment.seo?.title,
      description: treatment.seo?.description,
    },
  };
}

type TreatmentEditorProps = {
  slug: string;
  treatment: TreatmentLeanDocument;
  imagePreview: { src: string | null; alt: string };
  mediaAssets: AdminMediaPickerItem[];
};

export function TreatmentEditor({
  slug,
  treatment,
  imagePreview,
  mediaAssets,
}: TreatmentEditorProps) {
  const { values, setValues, setField, isDirty, resetBaseline } =
    useAdminFormState(toFormValues(treatment));
  const { state, submit, isPending } = useAdminCmsSubmit(saveTreatmentAction);

  useEffect(() => {
    if (state.success) {
      resetBaseline(values);
    }
  }, [state.success, resetBaseline, values]);

  const handleSave = () => {
    submit({
      slug,
      treatment: {
        title: values.title,
        shortDescription: values.shortDescription,
        emotionalOpening: values.emotionalOpening,
        whatItIs: fromContentBlockFormValue(values.whatItIs),
        whoItSuits: fromContentBlockFormValue(values.whoItSuits),
        sessionProcess: fromContentBlockFormValue(values.sessionProcess),
        supportiveGoals: fromContentBlockFormValue(values.supportiveGoals),
        expectations: fromContentBlockFormValue(values.expectations),
        disclaimer: values.disclaimer.trim() || undefined,
        cta: values.cta,
        image: values.image,
        faq: treatment.faq,
        layoutVariant: treatment.layoutVariant,
        isActive: treatment.isActive,
        sortOrder: treatment.sortOrder,
        seo: values.seo,
      },
    });
  };

  const updateBlock = (
    key:
      | "whatItIs"
      | "whoItSuits"
      | "sessionProcess"
      | "supportiveGoals"
      | "expectations",
    block: TreatmentFormValues[typeof key],
  ) => {
    setValues({ ...values, [key]: block });
  };

  return (
    <div className={styles.editor}>
      <Link href="/admin/treatments" className={styles.backLink}>
        חזרה לרשימה
      </Link>

      <AdminActionFeedback success={state.success} error={state.error} />

      <div className={styles.stack}>
        <AdminSection title="פרטים כלליים">
          <AdminField label="כותרת" htmlFor="treatment-title">
            <AdminTextInput
              id="treatment-title"
              value={values.title}
              onChange={(title) => setField("title", title)}
              disabled={isPending}
            />
          </AdminField>
          <AdminField label="תיאור קצר" htmlFor="treatment-short">
            <AdminTextarea
              id="treatment-short"
              value={values.shortDescription}
              onChange={(shortDescription) =>
                setField("shortDescription", shortDescription)
              }
              disabled={isPending}
              rows={2}
            />
          </AdminField>
          <AdminField label="פתיחה רגשית" htmlFor="treatment-opening">
            <AdminTextarea
              id="treatment-opening"
              value={values.emotionalOpening}
              onChange={(emotionalOpening) =>
                setField("emotionalOpening", emotionalOpening)
              }
              disabled={isPending}
              rows={4}
            />
          </AdminField>
          <AdminImageField
            label="תמונת הטיפול"
            value={{
              src: values.image.src ?? imagePreview.src,
              alt: values.image.alt || imagePreview.alt,
              mediaId: values.image.mediaId,
            }}
            onChange={(image) => setField("image", image)}
            mediaAssets={mediaAssets}
            disabled={isPending}
          />
        </AdminSection>

        <AdminSection title="תוכן הטיפול">
          <ContentBlockEditor
            label="מה זה"
            value={values.whatItIs}
            onChange={(block) => updateBlock("whatItIs", block)}
            disabled={isPending}
          />
          <ContentBlockEditor
            label="למי זה מתאים"
            value={values.whoItSuits}
            onChange={(block) => updateBlock("whoItSuits", block)}
            disabled={isPending}
          />
          <ContentBlockEditor
            label="תהליך המפגש"
            value={values.sessionProcess}
            onChange={(block) => updateBlock("sessionProcess", block)}
            disabled={isPending}
          />
          <ContentBlockEditor
            label="מטרות תומכות"
            value={values.supportiveGoals}
            onChange={(block) => updateBlock("supportiveGoals", block)}
            disabled={isPending}
          />
          <ContentBlockEditor
            label="ציפיות"
            value={values.expectations}
            onChange={(block) => updateBlock("expectations", block)}
            disabled={isPending}
          />
          <AdminField label="הבהרה (אופציונלי)" htmlFor="treatment-disclaimer">
            <AdminTextarea
              id="treatment-disclaimer"
              value={values.disclaimer}
              onChange={(disclaimer) => setField("disclaimer", disclaimer)}
              disabled={isPending}
              rows={2}
            />
          </AdminField>
        </AdminSection>

        <AdminSection title="קריאה לפעולה">
          <AdminField label="טקסט כפתור" htmlFor="cta-label">
            <AdminTextInput
              id="cta-label"
              value={values.cta.label}
              onChange={(label) =>
                setValues({ ...values, cta: { ...values.cta, label } })
              }
              disabled={isPending}
            />
          </AdminField>
          <AdminField label="קישור" htmlFor="cta-href">
            <AdminTextInput
              id="cta-href"
              value={values.cta.href}
              onChange={(href) =>
                setValues({ ...values, cta: { ...values.cta, href } })
              }
              disabled={isPending}
            />
          </AdminField>
        </AdminSection>

        <AdminSection title="SEO">
          <AdminSeoSection
            values={values.seo}
            onChange={(seo) => setField("seo", seo)}
            disabled={isPending}
          />
        </AdminSection>
      </div>

      <AdminFormActions isDirty={isDirty} isPending={isPending} onSave={handleSave} />
    </div>
  );
}
