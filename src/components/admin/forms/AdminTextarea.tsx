import styles from "./forms.module.scss";

type AdminTextareaProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rows?: number;
  describedBy?: string;
};

export function AdminTextarea({
  id,
  value,
  onChange,
  disabled,
  rows = 4,
  describedBy,
}: AdminTextareaProps) {
  return (
    <textarea
      id={id}
      value={value}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className={styles.textarea}
      aria-describedby={describedBy}
    />
  );
}
