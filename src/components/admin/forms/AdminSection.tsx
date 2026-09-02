import type { ReactNode } from "react";
import styles from "./forms.module.scss";

type AdminSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AdminSection({ title, description, children }: AdminSectionProps) {
  return (
    <section className={styles.section}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {description ? (
          <p className={styles.sectionDescription}>{description}</p>
        ) : null}
      </header>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}
