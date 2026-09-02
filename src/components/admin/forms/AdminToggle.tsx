import styles from "./forms.module.scss";

type AdminToggleProps = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function AdminToggle({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
}: AdminToggleProps) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleLabelWrap}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        {description ? <p className={styles.helper}>{description}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        data-checked={checked ? "true" : "false"}
        className={styles.toggle}
        onClick={() => onChange(!checked)}
        disabled={disabled}
      >
        <span className={styles.toggleThumb} aria-hidden="true" />
      </button>
    </div>
  );
}
