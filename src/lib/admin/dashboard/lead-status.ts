import type { LeadStatus } from "@/types/db/persistence";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "חדש",
  CONTACTED: "נוצר קשר",
  IN_PROGRESS: "בטיפול",
  CLOSED: "נסגר",
  ARCHIVED: "בארכיון",
};

export function getLeadStatusLabel(status: LeadStatus): string {
  return LEAD_STATUS_LABELS[status];
}
