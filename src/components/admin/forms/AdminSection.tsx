import type { ReactNode } from "react";
import styles from "./forms.module.scss";

type AdminSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  /** Expand when save validation fails so errors inside collapsed panels are visible. */
  forceOpen?: boolean;
};

export function AdminSection({
  title,
  description,
  children,
  forceOpen = false,
}: AdminSectionProps) {
  return (
    <details className={styles.section} open={forceOpen || undefined}>
      <summary className={styles.sectionSummary}>
        <span className={styles.sectionTitle}>{title}</span>
        <span className={styles.sectionChevron} aria-hidden="true" />
      </summary>
      {description ? (
        <p className={styles.sectionDescription}>{description}</p>
      ) : null}
      <div className={styles.sectionBody}>{children}</div>
    </details>
  );
}
