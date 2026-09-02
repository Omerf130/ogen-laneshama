import type { ReactNode } from "react";
import styles from "./forms.module.scss";

type AdminFieldProps = {
  label: string;
  htmlFor: string;
  helper?: string;
  error?: string;
  children: ReactNode;
};

export function AdminField({
  label,
  htmlFor,
  helper,
  error,
  children,
}: AdminFieldProps) {
  const helperId = helper ? `${htmlFor}-helper` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {helper ? (
        <p id={helperId} className={styles.helper}>
          {helper}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function getAdminFieldDescribedBy(htmlFor: string, helper?: string, error?: string) {
  return [helper ? `${htmlFor}-helper` : undefined, error ? `${htmlFor}-error` : undefined]
    .filter(Boolean)
    .join(" ") || undefined;
}
