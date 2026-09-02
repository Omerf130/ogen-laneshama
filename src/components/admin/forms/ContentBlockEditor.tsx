import { AdminField } from "./AdminField";
import { AdminTextInput } from "./AdminTextInput";
import { AdminTextarea } from "./AdminTextarea";
import styles from "./forms.module.scss";

export type ContentBlockFormValue = {
  id: string;
  title?: string;
  body: string;
  variant?: string;
};

function bodyToText(body: string | string[]): string {
  return Array.isArray(body) ? body.join("\n") : body;
}

type ContentBlockEditorProps = {
  label: string;
  value: ContentBlockFormValue;
  onChange: (value: ContentBlockFormValue) => void;
  disabled?: boolean;
  showTitle?: boolean;
};

export function ContentBlockEditor({
  label,
  value,
  onChange,
  disabled,
  showTitle = true,
}: ContentBlockEditorProps) {
  const bodyText = bodyToText(value.body as string | string[]);

  return (
    <div className={styles.listItem}>
      <p className={styles.label}>{label}</p>
      {showTitle ? (
        <AdminField label="כותרת" htmlFor={`${value.id}-title`}>
          <AdminTextInput
            id={`${value.id}-title`}
            value={value.title ?? ""}
            onChange={(title) =>
              onChange({ ...value, title: title || undefined })
            }
            disabled={disabled}
          />
        </AdminField>
      ) : null}
      <AdminField
        label="תוכן"
        htmlFor={`${value.id}-body`}
        helper="שורות מרובות יישמרו כרשימת פסקאות."
      >
        <AdminTextarea
          id={`${value.id}-body`}
          value={bodyText}
          onChange={(text) =>
            onChange({
              ...value,
              body: text,
            })
          }
          disabled={disabled}
          rows={5}
        />
      </AdminField>
    </div>
  );
}

export function toContentBlockFormValue(block: {
  id: string;
  title?: string;
  body: string | string[];
  variant?: string;
}): ContentBlockFormValue {
  return {
    id: block.id,
    title: block.title,
    body: bodyToText(block.body),
    variant: block.variant,
  };
}

export function fromContentBlockFormValue(value: ContentBlockFormValue): {
  id: string;
  title?: string;
  body: string | string[];
  variant?: string;
} {
  const lines = value.body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const originalHadMultipleLines = lines.length > 1;

  return {
    id: value.id,
    title: value.title?.trim() || undefined,
    body: originalHadMultipleLines ? lines : value.body.trim(),
    variant: value.variant,
  };
}
