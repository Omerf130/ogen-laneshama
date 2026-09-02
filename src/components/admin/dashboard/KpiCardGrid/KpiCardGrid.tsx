import { Bell, Inbox, TrendingUp, Users } from "lucide-react";
import type { AdminDashboardData } from "@/types/admin-dashboard";
import { KpiCard } from "@/components/admin/dashboard/KpiCard/KpiCard";
import styles from "./KpiCardGrid.module.scss";

type KpiCardGridProps = {
  data: Pick<
    AdminDashboardData,
    "totalLeads" | "homepageVisitors" | "homepageVisitorsThisWeek" | "newLeads"
  >;
};

export function KpiCardGrid({ data }: KpiCardGridProps) {
  return (
    <section className={styles.grid} aria-label="סיכום נתונים">
      <KpiCard
        label="סה״כ לידים"
        metric={data.totalLeads}
        icon={Inbox}
        variant="leads"
        supportingText="כל הפניות שהתקבלו דרך האתר"
      />
      <KpiCard
        label="מבקרים בדף הבית"
        metric={data.homepageVisitors}
        icon={Users}
        variant="visitors"
      />
      <KpiCard
        label="מבקרים השבוע"
        metric={data.homepageVisitorsThisWeek}
        icon={TrendingUp}
        variant="weekly"
      />
      <KpiCard
        label="לידים חדשים"
        metric={data.newLeads}
        icon={Bell}
        variant="newLeads"
        supportingText={
          data.newLeads.value > 0
            ? "ממתינים לטיפול"
            : "אין לידים חדשים כרגע"
        }
        actionable={data.newLeads.value > 0}
      />
    </section>
  );
}
