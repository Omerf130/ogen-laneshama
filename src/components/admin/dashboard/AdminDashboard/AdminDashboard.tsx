import type { AdminIdentity } from "@/types/admin";
import type { AdminDashboardData } from "@/types/admin-dashboard";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader/DashboardHeader";
import { KpiCardGrid } from "@/components/admin/dashboard/KpiCardGrid/KpiCardGrid";
import { RecentLeadsSection } from "@/components/admin/dashboard/RecentLeadsSection/RecentLeadsSection";
import styles from "./AdminDashboard.module.scss";

type AdminDashboardProps = {
  admin: AdminIdentity;
  data: AdminDashboardData;
};

export function AdminDashboard({ admin, data }: AdminDashboardProps) {
  return (
    <div className={styles.dashboard}>
      <DashboardHeader admin={admin} />
      <KpiCardGrid
        data={{
          totalLeads: data.totalLeads,
          homepageVisitors: data.homepageVisitors,
          homepageVisitorsThisWeek: data.homepageVisitorsThisWeek,
          newLeads: data.newLeads,
        }}
      />
      <RecentLeadsSection leads={data.recentLeads} />
    </div>
  );
}
