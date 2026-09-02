import type { LeadStatus } from "@/types/db/persistence";
import { getLeadStatusLabel } from "@/lib/admin/dashboard/lead-status";
import styles from "./LeadStatusBadge.module.scss";

type LeadStatusBadgeProps = {
  status: LeadStatus;
};

const STATUS_CLASS: Record<LeadStatus, string> = {
  NEW: styles.new,
  CONTACTED: styles.contacted,
  IN_PROGRESS: styles.inProgress,
  CLOSED: styles.closed,
  ARCHIVED: styles.archived,
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const label = getLeadStatusLabel(status);

  return (
    <span className={`${styles.badge} ${STATUS_CLASS[status]}`}>{label}</span>
  );
}
