import type { LeadStatus } from "@/types/db/persistence";

export type AdminLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: LeadStatus;
  isRead: boolean;
  internalNotes?: string;
  sourcePage: string;
  sourceReferrer?: string;
  createdAt: string;
  updatedAt?: string;
  archivedAt?: string | null;
};
