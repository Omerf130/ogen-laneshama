import styles from "./forms.module.scss";

type AdminTextInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: "text" | "email" | "url" | "tel";
  describedBy?: string;
};

export function AdminTextInput({
  id,
  value,
  onChange,
  disabled,
  type = "text",
  describedBy,
}: AdminTextInputProps) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className={styles.input}
      aria-describedby={describedBy}
      suppressHydrationWarning
    />
  );
}
