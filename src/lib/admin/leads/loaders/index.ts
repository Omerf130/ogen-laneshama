import "server-only";

import { AdminCmsDbError } from "@/lib/admin/cms/errors";
import {
  findLeadByIdForAdmin,
  findLeadsForAdmin,
  type LeadLeanDocument,
} from "@/lib/db/repositories/lead.repository";
import type { AdminLead } from "@/types/admin-lead";

function toIsoString(value: Date | string | undefined | null): string | undefined {
  if (value == null) {
    return undefined;
  }

  return value instanceof Date ? value.toISOString() : value;
}

function toAdminLead(doc: LeadLeanDocument): AdminLead {
  return {
    id: String(doc._id),
    name: doc.name,
    phone: doc.phone,
    email: doc.email,
    message: doc.message,
    status: doc.status,
    isRead: doc.isRead,
    internalNotes: doc.internalNotes,
    sourcePage: doc.sourcePage,
    sourceReferrer: doc.sourceReferrer,
    createdAt: toIsoString(doc.createdAt) ?? new Date().toISOString(),
    updatedAt: toIsoString(doc.updatedAt),
    archivedAt: toIsoString(doc.archivedAt) ?? null,
  };
}

export async function loadLeadsForAdmin(): Promise<AdminLead[]> {
  const docs = await findLeadsForAdmin({ includeArchived: true });
  return docs.map(toAdminLead);
}

export async function loadLeadForAdmin(id: string): Promise<AdminLead> {
  const doc = await findLeadByIdForAdmin(id);

  if (!doc) {
    throw new AdminCmsDbError("הפנייה לא נמצאה");
  }

  return toAdminLead(doc);
}
