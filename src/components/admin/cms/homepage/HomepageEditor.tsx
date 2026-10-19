"use client";

import Link from "next/link";
import type { AdminHomepageEditorData } from "@/lib/admin/cms/loaders/homepage.loader";
import { saveHomepageAction } from "@/features/admin/homepage/save-homepage.action";
import type { HomepageDocumentInput } from "@/lib/validation/homepage";
import {
  AdminEditorSaveBar,
  AdminField,
  AdminImageField,
  AdminSection,
  AdminSeoSection,
  AdminTextInput,
  AdminTextarea,
  AdminToggle,
  useAdminBaselineOnSaveComplete,
  useAdminCmsSubmit,
  useAdminFormState,
} from "@/components/admin/forms";
import formStyles from "@/components/admin/forms/forms.module.scss";
import type { AdminMediaPickerItem } from "@/types/admin-media-picker";
import styles from "./HomepageEditor.module.scss";

type HomepageEditorProps = {
  initialData: AdminHomepageEditorData;
  mediaAssets: AdminMediaPickerItem[];
};

type HomepageAssetKey =
  | "hero"
  | "aboutPortrait"
  | "pregnancySpotlight"
  | "botanicalAccent";

export function HomepageEditor({ initialData, mediaAssets }: HomepageEditorProps) {
  const { values, setValues, isDirty, resetBaseline } = useAdminFormState(
    initialData.document,
  );
  const { state, submit, isPending } = useAdminCmsSubmit(saveHomepageAction);
  const expandSections = Boolean(state.error);

  useAdminBaselineOnSaveComplete(
    isPending,
    state.success,
    values,
    resetBaseline,
  );

  const content = values.content;
  const visibility = values.sectionVisibility ?? {};
  const assets = values.assets ?? {};

  const updateContent = (patch: Partial<HomepageDocumentInput["content"]>) => {
    setValues({ ...values, content: { ...content, ...patch } });
  };

  const getAssetValue = (key: HomepageAssetKey, fallbackAlt: string) => {
    const ref = assets[key];

    return {
      src: ref?.src ?? initialData.assetPreviews[key].src,
      alt: ref?.alt ?? initialData.assetPreviews[key].alt ?? fallbackAlt,
      mediaId: ref?.mediaId,
      fitMode: ref?.fitMode,
      objectPosition: ref?.objectPosition,
    };
  };

  const updateAsset = (
    key: HomepageAssetKey,
    image: {
      src: string | null;
      alt: string;
      mediaId?: string;
      fitMode?: "cover" | "contain";
      objectPosition?: { x: number; y: number };
    },
  ) => {
    setValues({
      ...values,
      assets: {
        ...assets,
        [key]: {
          mediaId: image.mediaId,
          src: image.src,
          alt: image.alt,
          fitMode: image.fitMode,
          objectPosition: image.objectPosition,
        },
      },
    });
  };

  const handleSave = () => {
    submit(values);
  };

  return (
    <div className={`${styles.editor} ${formStyles.editorWithSaveBar}`}>
      <div className={styles.stack}>
        <AdminSection forceOpen={expandSections} title="Hero">
          <AdminField label="Eyebrow" htmlFor="hero-eyebrow">
            <AdminTextInput
              id="hero-eyebrow"
              value={content.hero.eyebrow}
              onChange={(eyebrow) =>
                updateContent({ hero: { ...content.hero, eyebrow } })
              }
              disabled={isPending}
            />
          </AdminField>
          <AdminField label="כותרת" htmlFor="hero-title">
            <AdminTextInput
              id="hero-title"
              value={content.hero.title}
              onChange={(title) =>
                updateContent({ hero: { ...content.hero, title } })
              }
              disabled={isPending}
            />
          </AdminField>
          <AdminField label="תת-כותרת" htmlFor="hero-subtitle">
            <AdminTextarea
              id="hero-subtitle"
              value={content.hero.subtitle}
              onChange={(subtitle) =>
                updateContent({ hero: { ...content.hero, subtitle } })
              }
              disabled={isPending}
              rows={2}
            />
          </AdminField>
          <AdminField label="טקסט כפתור" htmlFor="hero-cta">
            <AdminTextInput
              id="hero-cta"
              value={content.hero.ctaPrimary}
              onChange={(ctaPrimary) =>
                updateContent({ hero: { ...content.hero, ctaPrimary } })
              }
              disabled={isPending}
            />
          </AdminField>
          <AdminImageField
            label="תמונת Hero"
            value={getAssetValue("hero", "תמונת Hero")}
            onChange={(image) => updateAsset("hero", image)}
            mediaAssets={mediaAssets}
            placement="hero"
            disabled={isPending}
          />
        </AdminSection>

        <AdminSection forceOpen={expandSections} title="Recognition">
          {(
            [
              ["title", "כותרת"],
              ["subtitle", "תת-כותרת"],
              ["featuredStatement", "משפט מרכזי"],
              ["featuredAccent", "הדגשה (אופציונלי)"],
            ] as const
          ).map(([key, label]) => (
            <AdminField key={key} label={label} htmlFor={`rec-${key}`}>
              <AdminTextInput
                id={`rec-${key}`}
                value={content.recognition[key] ?? ""}
                onChange={(value) =>
                  updateContent({
                    recognition: {
                      ...content.recognition,
                      [key]: value || undefined,
                    },
                  })
                }
                disabled={isPending}
              />
            </AdminField>
          ))}
          {content.recognition.supportingStatements.map((statement, index) => (
            <AdminField
              key={index}
              label={`משפט תומך ${index + 1}`}
              htmlFor={`rec-support-${index}`}
            >
              <AdminTextarea
                id={`rec-support-${index}`}
                value={statement}
                onChange={(value) => {
                  const supportingStatements = [
                    ...content.recognition.supportingStatements,
                  ];
                  supportingStatements[index] = value;
                  updateContent({
                    recognition: { ...content.recognition, supportingStatements },
                  });
                }}
                disabled={isPending}
                rows={2}
              />
            </AdminField>
          ))}
        </AdminSection>

        <AdminSection
          forceOpen={expandSections}
          title="למי זה מתאים"
          description="נדרשות בדיוק 4 פריטים."
        >
          <AdminField label="Eyebrow" htmlFor="who-eyebrow">
            <AdminTextInput
              id="who-eyebrow"
              value={content.recognition.whoIsItFor.eyebrow}
              onChange={(eyebrow) =>
                updateContent({
                  recognition: {
                    ...content.recognition,
                    whoIsItFor: { ...content.recognition.whoIsItFor, eyebrow },
                  },
                })
              }
              disabled={isPending}
            />
          </AdminField>
          {content.recognition.whoIsItFor.titleLines.map((line, index) => (
            <AdminField
              key={index}
              label={`שורת כותרת ${index + 1}`}
              htmlFor={`who-title-${index}`}
            >
              <AdminTextInput
                id={`who-title-${index}`}
                value={line}
                onChange={(value) => {
                  const titleLines = [...content.recognition.whoIsItFor.titleLines] as [
                    string,
                    string,
                  ];
                  titleLines[index] = value;
                  updateContent({
                    recognition: {
                      ...content.recognition,
                      whoIsItFor: {
                        ...content.recognition.whoIsItFor,
                        titleLines,
                      },
                    },
                  });
                }}
                disabled={isPending}
              />
            </AdminField>
          ))}
          {content.recognition.whoIsItFor.items.map((item, index) => (
            <AdminField
              key={index}
              label={`פריט ${index + 1}`}
              htmlFor={`who-item-${index}`}
            >
              <AdminTextInput
                id={`who-item-${index}`}
                value={item}
                onChange={(value) => {
                  const items = [...content.recognition.whoIsItFor.items] as [
                    string,
                    string,
                    string,
                    string,
                  ];
                  items[index] = value;
                  updateContent({
                    recognition: {
                      ...content.recognition,
                      whoIsItFor: {
                        ...content.recognition.whoIsItFor,
                        items,
                      },
                    },
                  });
                }}
                disabled={isPending}
              />
            </AdminField>
          ))}
        </AdminSection>

        <AdminSection forceOpen={expandSections} title="תצוגה מקדימה — אודות">
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["title", "כותרת"],
              ["featuredStatement", "משפט מרכזי"],
              ["featuredAccent", "הדגשה (אופציונלי)"],
              ["supportingCopy", "טקסט תומך"],
              ["ctaLabel", "טקסט כפתור"],
            ] as const
          ).map(([key, label]) => (
            <AdminField key={key} label={label} htmlFor={`about-${key}`}>
              <AdminTextInput
                id={`about-${key}`}
                value={content.aboutPreview[key] ?? ""}
                onChange={(value) =>
                  updateContent({
                    aboutPreview: {
                      ...content.aboutPreview,
                      [key]: value || undefined,
                    },
                  })
                }
                disabled={isPending}
              />
            </AdminField>
          ))}
          <AdminField label="כותרת — למה רחלי" htmlFor="why-title">
            <AdminTextInput
              id="why-title"
              value={content.aboutPreview.whyRacheli.title}
              onChange={(title) =>
                updateContent({
                  aboutPreview: {
                    ...content.aboutPreview,
                    whyRacheli: { ...content.aboutPreview.whyRacheli, title },
                  },
                })
              }
              disabled={isPending}
            />
          </AdminField>
          {content.aboutPreview.whyRacheli.points.map((point, index) => (
            <AdminField
              key={index}
              label={`נקודה ${index + 1}`}
              htmlFor={`why-point-${index}`}
            >
              <AdminTextInput
                id={`why-point-${index}`}
                value={point}
                onChange={(value) => {
                  const points = [...content.aboutPreview.whyRacheli.points];
                  points[index] = value;
                  updateContent({
                    aboutPreview: {
                      ...content.aboutPreview,
                      whyRacheli: { ...content.aboutPreview.whyRacheli, points },
                    },
                  });
                }}
                disabled={isPending}
              />
            </AdminField>
          ))}
          <AdminImageField
            label="דיוקן"
            value={getAssetValue("aboutPortrait", "דיוקן")}
            onChange={(image) => updateAsset("aboutPortrait", image)}
            mediaAssets={mediaAssets}
            placement="portrait"
            disabled={isPending}
          />
        </AdminSection>

        <AdminSection forceOpen={expandSections} title="תצוגה מקדימה — טיפולים">
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["title", "כותרת"],
              ["subtitle", "תת-כותרת"],
              ["ctaLabel", "טקסט כפתור"],
            ] as const
          ).map(([key, label]) => (
            <AdminField key={key} label={label} htmlFor={`treatments-${key}`}>
              <AdminTextInput
                id={`treatments-${key}`}
                value={content.treatmentsPreview[key]}
                onChange={(value) =>
                  updateContent({
                    treatmentsPreview: {
                      ...content.treatmentsPreview,
                      [key]: value,
                    },
                  })
                }
                disabled={isPending}
              />
            </AdminField>
          ))}
        </AdminSection>

        <AdminSection forceOpen={expandSections} title="הריון ואימהות">
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["featuredStatement", "משפט מרכזי"],
              ["excerpt", "קטע"],
              ["disclaimer", "הבהרה"],
              ["ctaLabel", "טקסט כפתור"],
            ] as const
          ).map(([key, label]) => (
            <AdminField key={key} label={label} htmlFor={`preg-${key}`}>
              <AdminTextInput
                id={`preg-${key}`}
                value={content.pregnancySpotlight[key]}
                onChange={(value) =>
                  updateContent({
                    pregnancySpotlight: {
                      ...content.pregnancySpotlight,
                      [key]: value,
                    },
                  })
                }
                disabled={isPending}
              />
            </AdminField>
          ))}
          <AdminImageField
            label="תמונה"
            value={getAssetValue("pregnancySpotlight", "הריון ואימהות")}
            onChange={(image) => updateAsset("pregnancySpotlight", image)}
            mediaAssets={mediaAssets}
            placement="pregnancySpotlight"
            disabled={isPending}
          />
        </AdminSection>

        <AdminSection forceOpen={expandSections} title="אלמנט דקורטיבי">
          <AdminImageField
            label="אלמנט דקורטיבי"
            value={getAssetValue("botanicalAccent", "אלמנט דקורטיבי")}
            onChange={(image) => updateAsset("botanicalAccent", image)}
            mediaAssets={mediaAssets}
            disabled={isPending}
          />
        </AdminSection>

        <AdminSection
          forceOpen={expandSections}
          title="תהליך"
          description="נדרשים בדיוק 4 שלבים."
        >
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["title", "כותרת"],
              ["subtitle", "תת-כותרת"],
            ] as const
          ).map(([key, label]) => (
            <AdminField key={key} label={label} htmlFor={`process-${key}`}>
              <AdminTextInput
                id={`process-${key}`}
                value={content.process[key]}
                onChange={(value) =>
                  updateContent({
                    process: { ...content.process, [key]: value },
                  })
                }
                disabled={isPending}
              />
            </AdminField>
          ))}
          {content.process.steps.map((step, index) => (
            <div key={index} className={styles.stepItem}>
              <AdminField label={`שלב ${index + 1} — כותרת`} htmlFor={`step-title-${index}`}>
                <AdminTextInput
                  id={`step-title-${index}`}
                  value={step.title}
                  onChange={(title) => {
                    const steps = [...content.process.steps] as typeof content.process.steps;
                    steps[index] = { ...step, title };
                    updateContent({ process: { ...content.process, steps } });
                  }}
                  disabled={isPending}
                />
              </AdminField>
              <AdminField label="תיאור" htmlFor={`step-desc-${index}`}>
                <AdminTextarea
                  id={`step-desc-${index}`}
                  value={step.description}
                  onChange={(description) => {
                    const steps = [...content.process.steps] as typeof content.process.steps;
                    steps[index] = { ...step, description };
                    updateContent({ process: { ...content.process, steps } });
                  }}
                  disabled={isPending}
                  rows={2}
                />
              </AdminField>
            </div>
          ))}
        </AdminSection>

        <AdminSection forceOpen={expandSections} title="שאלות נפוצות">
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["title", "כותרת"],
              ["subtitle", "תת-כותרת"],
            ] as const
          ).map(([key, label]) => (
            <AdminField key={key} label={label} htmlFor={`faq-${key}`}>
              <AdminTextInput
                id={`faq-${key}`}
                value={content.faqSection[key]}
                onChange={(value) =>
                  updateContent({
                    faqSection: { ...content.faqSection, [key]: value },
                  })
                }
                disabled={isPending}
              />
            </AdminField>
          ))}
          <p className={styles.linkPanel}>
            <Link href="/admin/faq">
              ניהול שאלות ({initialData.publishedFaqCount} מפורסמות)
            </Link>
          </p>
        </AdminSection>

        <AdminSection forceOpen={expandSections} title="המלצות">
          <AdminField label="כותרת" htmlFor="testimonials-title">
            <AdminTextInput
              id="testimonials-title"
              value={content.testimonialsSection.title}
              onChange={(title) =>
                updateContent({
                  testimonialsSection: {
                    ...content.testimonialsSection,
                    title,
                  },
                })
              }
              disabled={isPending}
            />
          </AdminField>
          <AdminField label="תת-כותרת" htmlFor="testimonials-subtitle">
            <AdminTextInput
              id="testimonials-subtitle"
              value={content.testimonialsSection.subtitle}
              onChange={(subtitle) =>
                updateContent({
                  testimonialsSection: {
                    ...content.testimonialsSection,
                    subtitle,
                  },
                })
              }
              disabled={isPending}
            />
          </AdminField>
          <p className={styles.linkPanel}>
            <Link href="/admin/testimonials">
              ניהול המלצות ({initialData.publishedTestimonialCount} מפורסמות)
            </Link>
          </p>
        </AdminSection>

        <AdminSection forceOpen={expandSections} title="CTA יצירת קשר">
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["featuredStatement", "משפט מרכזי"],
              ["subtitle", "תת-כותרת"],
              ["ctaLabel", "טקסט כפתור"],
            ] as const
          ).map(([key, label]) => (
            <AdminField key={key} label={label} htmlFor={`cta-${key}`}>
              <AdminTextInput
                id={`cta-${key}`}
                value={content.contactCta[key]}
                onChange={(value) =>
                  updateContent({
                    contactCta: { ...content.contactCta, [key]: value },
                  })
                }
                disabled={isPending}
              />
            </AdminField>
          ))}
        </AdminSection>

        <AdminSection forceOpen={expandSections} title="נראות סקשנים">
          <AdminToggle
            id="visibility-faq"
            label="הצגת שאלות נפוצות בדף הבית"
            checked={visibility.faq !== false}
            onChange={(checked) =>
              setValues({
                ...values,
                sectionVisibility: { ...visibility, faq: checked },
              })
            }
            disabled={isPending}
          />
          <AdminToggle
            id="visibility-testimonials"
            label="הצגת המלצות בדף הבית"
            checked={visibility.testimonials !== false}
            onChange={(checked) =>
              setValues({
                ...values,
                sectionVisibility: { ...visibility, testimonials: checked },
              })
            }
            disabled={isPending}
          />
        </AdminSection>

        <AdminSection forceOpen={expandSections} title="SEO">
          <AdminSeoSection
            values={values.seo ?? {}}
            onChange={(seo) => setValues({ ...values, seo })}
            disabled={isPending}
          />
        </AdminSection>
      </div>

      <AdminEditorSaveBar
        isDirty={isDirty}
        isPending={isPending}
        onSave={handleSave}
        success={state.success}
        error={state.error}
      />
    </div>
  );
}
