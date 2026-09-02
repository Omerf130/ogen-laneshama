import type { LucideIcon } from "lucide-react";
import type { DashboardMetricValue } from "@/types/admin-dashboard";
import styles from "./KpiCard.module.scss";

export type KpiCardVariant = "leads" | "visitors" | "weekly" | "newLeads";

type KpiCardProps = {
  label: string;
  metric: DashboardMetricValue;
  icon: LucideIcon;
  variant: KpiCardVariant;
  supportingText?: string;
  actionable?: boolean;
};

export function KpiCard({
  label,
  metric,
  icon: Icon,
  variant,
  supportingText,
  actionable = false,
}: KpiCardProps) {
  const displayValue = metric.kind === "number" ? metric.value.toLocaleString("he-IL") : metric.display;
  const hint =
    metric.kind === "unavailable"
      ? metric.hint
      : supportingText;

  const cardClassName = [
    styles.card,
    styles[variant],
    actionable ? styles.actionable : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName} aria-label={label}>
      <div className={styles.topRow}>
        <p className={styles.label}>{label}</p>
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon className={styles.icon} strokeWidth={1.5} />
        </span>
      </div>
      <p className={styles.value}>{displayValue}</p>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </article>
  );
}
