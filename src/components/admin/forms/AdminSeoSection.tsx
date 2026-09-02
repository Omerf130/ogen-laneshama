import { AdminField } from "./AdminField";
import { AdminTextInput } from "./AdminTextInput";
import { AdminTextarea } from "./AdminTextarea";
import styles from "./forms.module.scss";

export type AdminSeoValues = {
  title?: string;
  description?: string;
};

type AdminSeoSectionProps = {
  values: AdminSeoValues;
  onChange: (values: AdminSeoValues) => void;
  disabled?: boolean;
};

export function AdminSeoSection({
  values,
  onChange,
  disabled,
}: AdminSeoSectionProps) {
  return (
    <details className={styles.seoDetails}>
      <summary className={styles.seoSummary}>הגדרות SEO מתקדמות</summary>
      <div className={styles.seoBody}>
        <p className={styles.helper}>
          אם השדות ריקים, האתר ישתמש בערכי ברירת המחדל מהגדרות האתר.
        </p>
        <AdminField label="כותרת SEO" htmlFor="seo-title">
          <AdminTextInput
            id="seo-title"
            value={values.title ?? ""}
            onChange={(title) => onChange({ ...values, title })}
            disabled={disabled}
          />
        </AdminField>
        <AdminField label="תיאור SEO" htmlFor="seo-description">
          <AdminTextarea
            id="seo-description"
            value={values.description ?? ""}
            onChange={(description) => onChange({ ...values, description })}
            disabled={disabled}
            rows={3}
          />
        </AdminField>
      </div>
    </details>
  );
}
