import Link from "next/link";
import type { DashboardLeadSummary } from "@/types/admin-dashboard";
import { formatDashboardDate } from "@/lib/admin/dashboard/format-dashboard-date";
import { LeadStatusBadge } from "@/components/admin/dashboard/LeadStatusBadge/LeadStatusBadge";
import styles from "./RecentLeadsTable.module.scss";

type RecentLeadsTableProps = {
  leads: DashboardLeadSummary[];
};

export function RecentLeadsTable({ leads }: RecentLeadsTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">שם</th>
            <th scope="col">טלפון</th>
            <th scope="col">אימייל</th>
            <th scope="col">תאריך</th>
            <th scope="col">סטטוס</th>
            <th scope="col">
              <span className={styles.srOnly}>פעולה</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className={styles.nameCell}>{lead.name}</td>
              <td>{lead.phone}</td>
              <td className={styles.emailCell}>{lead.email}</td>
              <td>{formatDashboardDate(lead.createdAt)}</td>
              <td>
                <LeadStatusBadge status={lead.status} />
              </td>
              <td className={styles.actionCell}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className={styles.actionLink}
                  aria-label={`צפייה בליד של ${lead.name}`}
                >
                  צפייה
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
