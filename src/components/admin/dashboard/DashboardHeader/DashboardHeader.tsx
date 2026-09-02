import type { AdminIdentity } from "@/types/admin";
import styles from "./DashboardHeader.module.scss";

type DashboardHeaderProps = {
  admin: AdminIdentity;
};

export function DashboardHeader({ admin }: DashboardHeaderProps) {
  const greeting = admin.name ? `שלום ${admin.name}.` : "שלום.";

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{greeting}</h1>
      <p className={styles.subtitle}>ברוכה הבאה למערכת הניהול של האתר.</p>
    </header>
  );
}
