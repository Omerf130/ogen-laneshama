import { Label } from "../Label";
import styles from "./FormField.module.scss";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormField({
  id,
  label,
  required,
  error,
  children,
}: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={styles.field}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function getFieldDescribedBy(error?: string, id?: string): string | undefined {
  return error && id ? `${id}-error` : undefined;
}
