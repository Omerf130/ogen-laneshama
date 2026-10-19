"use client";

import type { RepositoryContentPageSlug } from "@/lib/db/repositories/constants";
import { saveContentPageAction } from "@/features/admin/content-pages/save-content-page.action";
import {
  AdminEditorSaveBar,
  AdminField,
  AdminImageField,
  AdminSection,
  AdminSeoSection,
  AdminTextInput,
  AdminTextarea,
  ContentBlockEditor,
  fromContentBlockFormValue,
  toContentBlockFormValue,
  useAdminBaselineOnSaveComplete,
  useAdminCmsSubmit,
  useAdminFormState,
} from "@/components/admin/forms";
import formStyles from "@/components/admin/forms/forms.module.scss";
import type { AdminImageFieldValue, AdminMediaPickerItem } from "@/types/admin-media-picker";
import { TREATMENT_SLUGS } from "@/lib/validation/admin-cms";
import styles from "./ContentPageEditor.module.scss";

type ContentPageEditorProps = {
  slug: RepositoryContentPageSlug;
  content: Record<string, unknown>;
  seo?: { title?: string; description?: string };
  imagePreview?: { src: string | null; alt: string } | null;
  mediaAssets?: AdminMediaPickerItem[];
};

function buildInitialValues(
  slug: RepositoryContentPageSlug,
  content: Record<string, unknown>,
  seo?: { title?: string; description?: string },
) {
  return { slug, content: structuredClone(content), seo: seo ?? {} };
}

export function ContentPageEditor({
  slug,
  content,
  seo,
  imagePreview,
  mediaAssets = [],
}: ContentPageEditorProps) {
  const { values, setValues, isDirty, resetBaseline } = useAdminFormState(
    buildInitialValues(slug, content, seo),
  );
  const { state, submit, isPending } = useAdminCmsSubmit(saveContentPageAction);
  const expandSections = Boolean(state.error);

  useAdminBaselineOnSaveComplete(
    isPending,
    state.success,
    values,
    resetBaseline,
  );

  const handleSave = () => {
    submit({
      slug,
      content: values.content,
      seo: values.seo,
    } as never);
  };

  const c = values.content as Record<string, unknown>;

  const updateContent = (patch: Record<string, unknown>) => {
    setValues({ ...values, content: { ...c, ...patch } });
  };

  const updateHero = (patch: Record<string, string>) => {
    updateContent({ hero: { ...(c.hero as object), ...patch } });
  };

  const updateBlock = (key: string, block: ReturnType<typeof fromContentBlockFormValue>) => {
    updateContent({ [key]: block });
  };

  const updateCta = (patch: Partial<{ label: string; href: string }>) => {
    updateContent({ cta: { ...(c.cta as object), ...patch } });
  };

  const getPageImageValue = (
    key: "portrait" | "image",
    fallbackAlt: string,
  ): AdminImageFieldValue => {
    const image = c[key] as AdminImageFieldValue | undefined;

    return {
      src: image?.src ?? imagePreview?.src ?? null,
      alt: image?.alt ?? imagePreview?.alt ?? fallbackAlt,
      mediaId: image?.mediaId,
      fitMode: image?.fitMode,
      objectPosition: image?.objectPosition,
    };
  };

  const updatePageImage = (key: "portrait" | "image", image: AdminImageFieldValue) => {
    updateContent({ [key]: image });
  };

  return (
    <div className={`${styles.editor} ${formStyles.editorWithSaveBar}`}>
      <div className={styles.stack}>
        {slug === "about" ? (
          <>
            <AdminSection forceOpen={expandSections} title="כותרת">
              <AdminField label="כותרת" htmlFor="about-hero-title">
                <AdminTextInput
                  id="about-hero-title"
                  value={(c.hero as { title: string }).title}
                  onChange={(title) => updateHero({ title })}
                  disabled={isPending}
                />
              </AdminField>
              <AdminField label="תת-כותרת" htmlFor="about-hero-subtitle">
                <AdminTextarea
                  id="about-hero-subtitle"
                  value={(c.hero as { subtitle: string }).subtitle}
                  onChange={(subtitle) => updateHero({ subtitle })}
                  disabled={isPending}
                  rows={2}
                />
              </AdminField>
            </AdminSection>
            {(["introduction", "philosophy", "approach", "safeSpace"] as const).map(
              (key) => (
                <ContentBlockEditor
                  key={key}
                  label={key}
                  value={toContentBlockFormValue(c[key] as never)}
                  onChange={(block) => updateBlock(key, fromContentBlockFormValue(block))}
                  disabled={isPending}
                />
              ),
            )}
            <ContentBlockEditor
              label="שיטות"
              value={toContentBlockFormValue(c.methods as never)}
              onChange={(block) => {
                const methods = c.methods as {
                  treatmentLinks: Array<{ slug: string; label: string }>;
                };
                updateContent({
                  methods: {
                    ...fromContentBlockFormValue(block),
                    treatmentLinks: methods.treatmentLinks,
                  },
                });
              }}
              disabled={isPending}
            />
            {(c.methods as { treatmentLinks: Array<{ slug: string; label: string }> })
              .treatmentLinks.map((link, index) => (
                <AdminField
                  key={link.slug}
                  label={`קישור טיפול: ${link.slug}`}
                  htmlFor={`about-link-${link.slug}`}
                >
                  <AdminTextInput
                    id={`about-link-${link.slug}`}
                    value={link.label}
                    onChange={(label) => {
                      const methods = c.methods as {
                        treatmentLinks: Array<{ slug: string; label: string }>;
                      };
                      const treatmentLinks = [...methods.treatmentLinks];
                      treatmentLinks[index] = { ...link, label };
                      updateContent({
                        methods: { ...methods, treatmentLinks },
                      });
                    }}
                    disabled={isPending || !TREATMENT_SLUGS.includes(link.slug as never)}
                  />
                </AdminField>
              ))}
            {slug === "about" ? (
              <AdminImageField
                label="דיוקן"
                value={getPageImageValue("portrait", "דיוקן")}
                onChange={(image) => updatePageImage("portrait", image)}
                mediaAssets={mediaAssets}
                placement="contentPortrait"
                disabled={isPending}
              />
            ) : null}
          </>
        ) : null}

        {slug === "pregnancy-motherhood" ? (
          <>
            <AdminSection forceOpen={expandSections} title="כותרת">
              <AdminField label="כותרת" htmlFor="preg-hero-title">
                <AdminTextInput
                  id="preg-hero-title"
                  value={(c.hero as { title: string }).title}
                  onChange={(title) => updateHero({ title })}
                  disabled={isPending}
                />
              </AdminField>
              <AdminField label="תת-כותרת" htmlFor="preg-hero-subtitle">
                <AdminTextarea
                  id="preg-hero-subtitle"
                  value={(c.hero as { subtitle: string }).subtitle}
                  onChange={(subtitle) => updateHero({ subtitle })}
                  disabled={isPending}
                  rows={2}
                />
              </AdminField>
            </AdminSection>
            {(["recognition", "howSupportHelps", "process", "reassurance"] as const).map(
              (key) => (
                <ContentBlockEditor
                  key={key}
                  label={key}
                  value={toContentBlockFormValue(c[key] as never)}
                  onChange={(block) => updateBlock(key, fromContentBlockFormValue(block))}
                  disabled={isPending}
                />
              ),
            )}
            <AdminSection forceOpen={expandSections} title="רגעים">
              <AdminField label="כותרת" htmlFor="moments-title">
                <AdminTextInput
                  id="moments-title"
                  value={(c.moments as { title: string }).title}
                  onChange={(title) =>
                    updateContent({
                      moments: { ...(c.moments as object), title },
                    })
                  }
                  disabled={isPending}
                />
              </AdminField>
              {(c.moments as { items: Array<{ title: string; description: string }> })
                .items.map((item, index) => (
                  <div key={index} className={styles.momentItem}>
                    <AdminField label={`רגע ${index + 1} — כותרת`} htmlFor={`moment-title-${index}`}>
                      <AdminTextInput
                        id={`moment-title-${index}`}
                        value={item.title}
                        onChange={(title) => {
                          const moments = c.moments as {
                            title: string;
                            items: Array<{ title: string; description: string }>;
                          };
                          const items = [...moments.items];
                          items[index] = { ...item, title };
                          updateContent({ moments: { ...moments, items } });
                        }}
                        disabled={isPending}
                      />
                    </AdminField>
                    <AdminField label="תיאור" htmlFor={`moment-desc-${index}`}>
                      <AdminTextarea
                        id={`moment-desc-${index}`}
                        value={item.description}
                        onChange={(description) => {
                          const moments = c.moments as {
                            title: string;
                            items: Array<{ title: string; description: string }>;
                          };
                          const items = [...moments.items];
                          items[index] = { ...item, description };
                          updateContent({ moments: { ...moments, items } });
                        }}
                        disabled={isPending}
                        rows={2}
                      />
                    </AdminField>
                  </div>
                ))}
            </AdminSection>
            <AdminField label="הבהרה" htmlFor="preg-disclaimer">
              <AdminTextarea
                id="preg-disclaimer"
                value={c.disclaimer as string}
                onChange={(disclaimer) => updateContent({ disclaimer })}
                disabled={isPending}
                rows={2}
              />
            </AdminField>
            {slug === "pregnancy-motherhood" ? (
              <AdminImageField
                label="תמונה"
                value={getPageImageValue("image", "תמונה")}
                onChange={(image) => updatePageImage("image", image)}
                mediaAssets={mediaAssets}
                placement="contentPortrait"
                disabled={isPending}
              />
            ) : null}
          </>
        ) : null}

        {slug === "contact" ? (
          <AdminSection forceOpen={expandSections} title="עמוד יצירת קשר">
            <AdminField label="כותרת" htmlFor="contact-title">
              <AdminTextInput
                id="contact-title"
                value={c.title as string}
                onChange={(title) => updateContent({ title })}
                disabled={isPending}
              />
            </AdminField>
            <AdminField label="תת-כותרת" htmlFor="contact-subtitle">
              <AdminTextarea
                id="contact-subtitle"
                value={c.subtitle as string}
                onChange={(subtitle) => updateContent({ subtitle })}
                disabled={isPending}
                rows={2}
              />
            </AdminField>
            <AdminField label="מבוא" htmlFor="contact-intro">
              <AdminTextarea
                id="contact-intro"
                value={c.intro as string}
                onChange={(intro) => updateContent({ intro })}
                disabled={isPending}
                rows={3}
              />
            </AdminField>
            <AdminField label="כותרת אמצעי קשר" htmlFor="contact-methods-heading">
              <AdminTextInput
                id="contact-methods-heading"
                value={c.contactMethodsHeading as string}
                onChange={(contactMethodsHeading) =>
                  updateContent({ contactMethodsHeading })
                }
                disabled={isPending}
              />
            </AdminField>
            <AdminSection forceOpen={expandSections} title="תוויות טופס">
              {(
                [
                  ["nameLabel", "שם"],
                  ["phoneLabel", "טלפון"],
                  ["emailLabel", 'דוא"ל'],
                  ["messageLabel", "הודעה"],
                  ["submitLabel", "שליחה"],
                  ["devNotice", "הודעת פיתוח"],
                ] as const
              ).map(([key, label]) => (
                <AdminField key={key} label={label} htmlFor={`form-${key}`}>
                  <AdminTextInput
                    id={`form-${key}`}
                    value={(c.form as Record<string, string>)[key]}
                    onChange={(value) =>
                      updateContent({
                        form: { ...(c.form as object), [key]: value },
                      })
                    }
                    disabled={isPending}
                  />
                </AdminField>
              ))}
            </AdminSection>
            <AdminField label="טקסט WhatsApp (אופציונלי)" htmlFor="contact-whatsapp">
              <AdminTextInput
                id="contact-whatsapp"
                value={(c.ctaWhatsApp as string | undefined) ?? ""}
                onChange={(ctaWhatsApp) =>
                  updateContent({ ctaWhatsApp: ctaWhatsApp || undefined })
                }
                disabled={isPending}
              />
            </AdminField>
          </AdminSection>
        ) : null}

        {slug === "treatments" ? (
          <AdminSection forceOpen={expandSections} title="עמוד טיפולים">
            <AdminField label="כותרת" htmlFor="treatments-title">
              <AdminTextInput
                id="treatments-title"
                value={c.title as string}
                onChange={(title) => updateContent({ title })}
                disabled={isPending}
              />
            </AdminField>
            <AdminField label="תת-כותרת" htmlFor="treatments-subtitle">
              <AdminTextarea
                id="treatments-subtitle"
                value={c.subtitle as string}
                onChange={(subtitle) => updateContent({ subtitle })}
                disabled={isPending}
                rows={2}
              />
            </AdminField>
            <AdminField label="מבוא" htmlFor="treatments-intro">
              <AdminTextarea
                id="treatments-intro"
                value={c.intro as string}
                onChange={(intro) => updateContent({ intro })}
                disabled={isPending}
                rows={3}
              />
            </AdminField>
          </AdminSection>
        ) : null}

        {(slug === "about" ||
          slug === "pregnancy-motherhood" ||
          slug === "treatments") && (
          <AdminSection forceOpen={expandSections} title="קריאה לפעולה">
            <AdminField label="טקסט כפתור" htmlFor="page-cta-label">
              <AdminTextInput
                id="page-cta-label"
                value={(c.cta as { label: string }).label}
                onChange={(label) => updateCta({ label })}
                disabled={isPending}
              />
            </AdminField>
            <AdminField label="קישור" htmlFor="page-cta-href">
              <AdminTextInput
                id="page-cta-href"
                value={(c.cta as { href: string }).href}
                onChange={(href) => updateCta({ href })}
                disabled={isPending}
              />
            </AdminField>
          </AdminSection>
        )}

        <AdminSection forceOpen={expandSections} title="SEO">
          <AdminSeoSection
            values={values.seo}
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
