"use client";

import { useEffect } from "react";
import type { SiteSettingsLeanDocument } from "@/lib/db/repositories/site-settings.repository";
import { saveSiteSettingsAction } from "@/features/admin/settings/save-site-settings.action";
import {
  AdminActionFeedback,
  AdminField,
  AdminFormActions,
  AdminSection,
  AdminSeoSection,
  AdminTextInput,
  AdminTextarea,
  useAdminCmsSubmit,
  useAdminFormState,
} from "@/components/admin/forms";
import styles from "./SiteSettingsEditor.module.scss";

type SiteSettingsFormValues = {
  businessName: string;
  therapistName: string;
  tagline: string;
  siteUrl: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  whatsapp: {
    number: string;
    message: string;
  };
  socialLinks: SiteSettingsLeanDocument["socialLinks"];
  footerBrandSentence: string;
  defaultSeo: {
    title?: string;
    description?: string;
  };
};

function toFormValues(doc: SiteSettingsLeanDocument): SiteSettingsFormValues {
  return {
    businessName: doc.businessName,
    therapistName: doc.therapistName,
    tagline: doc.tagline,
    siteUrl: doc.siteUrl,
    contact: { ...doc.contact },
    whatsapp: { ...doc.whatsapp },
    socialLinks: doc.socialLinks.map((link) => ({ ...link })),
    footerBrandSentence: doc.footer.brandSentence,
    defaultSeo: {
      title: doc.defaultSeo?.title,
      description: doc.defaultSeo?.description,
    },
  };
}

type SiteSettingsEditorProps = {
  initialDoc: SiteSettingsLeanDocument;
};

export function SiteSettingsEditor({ initialDoc }: SiteSettingsEditorProps) {
  const { values, setValues, setField, isDirty, resetBaseline } =
    useAdminFormState(toFormValues(initialDoc));
  const { state, submit, isPending } = useAdminCmsSubmit(saveSiteSettingsAction);

  const handleSave = () => {
    submit(values);
  };

  useEffect(() => {
    if (state.success) {
      resetBaseline(values);
    }
  }, [state.success, values, resetBaseline]);

  return (
    <div className={styles.editor}>
      <AdminActionFeedback success={state.success} error={state.error} />

      <div className={styles.stack}>
        <AdminSection title="פרטי העסק">
          <AdminField label="שם העסק" htmlFor="businessName">
            <AdminTextInput
              id="businessName"
              value={values.businessName}
              onChange={(businessName) => setField("businessName", businessName)}
              disabled={isPending}
            />
          </AdminField>
          <AdminField label="שם המטפלת" htmlFor="therapistName">
            <AdminTextInput
              id="therapistName"
              value={values.therapistName}
              onChange={(therapistName) => setField("therapistName", therapistName)}
              disabled={isPending}
            />
          </AdminField>
          <AdminField label="סלוגן" htmlFor="tagline">
            <AdminTextInput
              id="tagline"
              value={values.tagline}
              onChange={(tagline) => setField("tagline", tagline)}
              disabled={isPending}
            />
          </AdminField>
          <AdminField label="כתובת האתר" htmlFor="siteUrl">
            <AdminTextInput
              id="siteUrl"
              type="url"
              value={values.siteUrl}
              onChange={(siteUrl) => setField("siteUrl", siteUrl)}
              disabled={isPending}
            />
          </AdminField>
        </AdminSection>

        <AdminSection title="פרטי קשר">
          <AdminField label="טלפון" htmlFor="phone">
            <AdminTextInput
              id="phone"
              type="tel"
              value={values.contact.phone}
              onChange={(phone) =>
                setValues({ ...values, contact: { ...values.contact, phone } })
              }
              disabled={isPending}
            />
          </AdminField>
          <AdminField label='דוא"ל' htmlFor="email">
            <AdminTextInput
              id="email"
              type="email"
              value={values.contact.email}
              onChange={(email) =>
                setValues({ ...values, contact: { ...values.contact, email } })
              }
              disabled={isPending}
            />
          </AdminField>
          <AdminField label="כתובת" htmlFor="address">
            <AdminTextarea
              id="address"
              value={values.contact.address}
              onChange={(address) =>
                setValues({ ...values, contact: { ...values.contact, address } })
              }
              disabled={isPending}
              rows={2}
            />
          </AdminField>
        </AdminSection>

        <AdminSection title="WhatsApp">
          <AdminField label="מספר" htmlFor="whatsappNumber">
            <AdminTextInput
              id="whatsappNumber"
              type="tel"
              value={values.whatsapp.number}
              onChange={(number) =>
                setValues({ ...values, whatsapp: { ...values.whatsapp, number } })
              }
              disabled={isPending}
            />
          </AdminField>
          <AdminField label="הודעה מוכנה" htmlFor="whatsappMessage">
            <AdminTextarea
              id="whatsappMessage"
              value={values.whatsapp.message}
              onChange={(message) =>
                setValues({ ...values, whatsapp: { ...values.whatsapp, message } })
              }
              disabled={isPending}
              rows={2}
            />
          </AdminField>
        </AdminSection>

        <AdminSection
          title="רשתות חברתיות"
          description="עריכת קישורים קיימים בלבד. הוספת פלטפורמות חדשות דורשת עדכון מפתח."
        >
          {values.socialLinks.map((link, index) => (
            <div key={`${link.platform}-${index}`} className={styles.socialItem}>
              <p className={styles.socialPlatform}>{link.platform}</p>
              <AdminField label="תווית" htmlFor={`social-label-${index}`}>
                <AdminTextInput
                  id={`social-label-${index}`}
                  value={link.label}
                  onChange={(label) => {
                    const socialLinks = [...values.socialLinks];
                    socialLinks[index] = { ...link, label };
                    setField("socialLinks", socialLinks);
                  }}
                  disabled={isPending}
                />
              </AdminField>
              <AdminField label="קישור" htmlFor={`social-url-${index}`}>
                <AdminTextInput
                  id={`social-url-${index}`}
                  type="url"
                  value={link.url}
                  onChange={(url) => {
                    const socialLinks = [...values.socialLinks];
                    socialLinks[index] = { ...link, url };
                    setField("socialLinks", socialLinks);
                  }}
                  disabled={isPending}
                />
              </AdminField>
            </div>
          ))}
        </AdminSection>

        <AdminSection title="פוטר">
          <AdminField label="משפט מותג" htmlFor="footerBrandSentence">
            <AdminTextarea
              id="footerBrandSentence"
              value={values.footerBrandSentence}
              onChange={(footerBrandSentence) =>
                setField("footerBrandSentence", footerBrandSentence)
              }
              disabled={isPending}
              rows={2}
            />
          </AdminField>
        </AdminSection>

        <AdminSection title="ניווט">
          <div className={styles.readOnlyPanel}>
            <p className={styles.readOnlyTitle}>מבנה הניווט</p>
            <p className={styles.readOnlyText}>
              מבנה הניווט (תפריט ראשי וקישורי פוטר) מנוהל על ידי המפתח.
            </p>
            <ul className={styles.navList}>
              {initialDoc.mainNav.map((item) => (
                <li key={item.href}>{item.label}</li>
              ))}
            </ul>
          </div>
        </AdminSection>

        <AdminSection title="SEO ברירת מחדל">
          <AdminSeoSection
            values={values.defaultSeo}
            onChange={(defaultSeo) => setField("defaultSeo", defaultSeo)}
            disabled={isPending}
          />
        </AdminSection>
      </div>

      <AdminFormActions isDirty={isDirty} isPending={isPending} onSave={handleSave} />
    </div>
  );
}
