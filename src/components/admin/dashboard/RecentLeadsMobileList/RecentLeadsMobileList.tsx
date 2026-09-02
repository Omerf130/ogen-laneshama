import Link from "next/link";
import type { DashboardLeadSummary } from "@/types/admin-dashboard";
import { formatDashboardDate } from "@/lib/admin/dashboard/format-dashboard-date";
import { LeadStatusBadge } from "@/components/admin/dashboard/LeadStatusBadge/LeadStatusBadge";
import styles from "./RecentLeadsMobileList.module.scss";

type RecentLeadsMobileListProps = {
  leads: DashboardLeadSummary[];
};

export function RecentLeadsMobileList({ leads }: RecentLeadsMobileListProps) {
  return (
    <ul className={styles.list}>
      {leads.map((lead) => (
        <li key={lead.id} className={styles.item}>
          <div className={styles.main}>
            <p className={styles.name}>{lead.name}</p>
            <p className={styles.phone}>{lead.phone}</p>
            <p className={styles.email}>{lead.email}</p>
            <p className={styles.date}>{formatDashboardDate(lead.createdAt)}</p>
          </div>
          <div className={styles.meta}>
            <LeadStatusBadge status={lead.status} />
            <Link
              href="/admin/leads"
              className={styles.actionLink}
              aria-label={`צפייה בליד של ${lead.name}`}
            >
              צפייה
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
