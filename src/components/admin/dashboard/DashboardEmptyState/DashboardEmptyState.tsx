import styles from "./DashboardEmptyState.module.scss";

type DashboardEmptyStateProps = {
  message?: string;
};

export function DashboardEmptyState({
  message = "עדיין לא התקבלו השארות פרטים.",
}: DashboardEmptyStateProps) {
  return (
    <div className={styles.empty} role="status">
      <p className={styles.message}>{message}</p>
    </div>
  );
}
