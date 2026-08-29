import styles from "./Label.module.scss";

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}

export function Label({ htmlFor, children, required }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={styles.label}>
      {children}
      {required ? (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}
