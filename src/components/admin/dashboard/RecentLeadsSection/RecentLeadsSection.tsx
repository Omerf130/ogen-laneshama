import Link from "next/link";
import type { DashboardLeadSummary } from "@/types/admin-dashboard";
import { DashboardEmptyState } from "@/components/admin/dashboard/DashboardEmptyState/DashboardEmptyState";
import { RecentLeadsMobileList } from "@/components/admin/dashboard/RecentLeadsMobileList/RecentLeadsMobileList";
import { RecentLeadsTable } from "@/components/admin/dashboard/RecentLeadsTable/RecentLeadsTable";
import styles from "./RecentLeadsSection.module.scss";

type RecentLeadsSectionProps = {
  leads: DashboardLeadSummary[];
};

export function RecentLeadsSection({ leads }: RecentLeadsSectionProps) {
  const hasLeads = leads.length > 0;

  return (
    <section className={styles.section} aria-labelledby="recent-leads-title">
      <div className={styles.header}>
        <h2 id="recent-leads-title" className={styles.title}>
          חמש השארות הפרטים האחרונות
        </h2>
        <Link href="/admin/leads" className={styles.viewAllLink}>
          צפייה בכל הלידים
        </Link>
      </div>

      {hasLeads ? (
        <>
          <div className={styles.desktopOnly}>
            <RecentLeadsTable leads={leads} />
          </div>
          <div className={styles.mobileOnly}>
            <RecentLeadsMobileList leads={leads} />
          </div>
        </>
      ) : (
        <DashboardEmptyState />
      )}
    </section>
  );
}
