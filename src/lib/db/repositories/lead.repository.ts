import { LeadModel } from "@/lib/db/models/lead.model";
import { ensureDbConnection, returnUpdatedDocument } from "@/lib/db/repositories/shared";
import type { AdminLeadUpdateInput } from "@/lib/validation/lead";
import type { LeadStatus } from "@/types/db/persistence";

export type LeadLeanDocument = {
  _id: unknown;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: LeadStatus;
  isRead: boolean;
  internalNotes?: string;
  sourcePage: string;
  sourceReferrer?: string;
  userAgent?: string;
  ipHash?: string;
  archivedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateLeadInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
  sourcePage: string;
};

export async function createLead(input: CreateLeadInput): Promise<LeadLeanDocument> {
  await ensureDbConnection();

  const doc = await LeadModel.create({
    name: input.name,
    phone: input.phone,
    email: input.email,
    message: input.message,
    sourcePage: input.sourcePage,
    status: "NEW",
    isRead: false,
  });

  return doc.toObject() as LeadLeanDocument;
}

export async function findLeadsForAdmin(input?: {
  status?: LeadStatus;
  search?: string;
  includeArchived?: boolean;
}): Promise<LeadLeanDocument[]> {
  await ensureDbConnection();

  const filter: Record<string, unknown> = {};

  if (input?.status) {
    filter.status = input.status;
  } else if (!input?.includeArchived) {
    filter.status = { $ne: "ARCHIVED" };
  }

  if (input?.search?.trim()) {
    const escaped = input.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    filter.$or = [{ name: regex }, { phone: regex }, { email: regex }];
  }

  return LeadModel.find(filter)
    .sort({ createdAt: -1 })
    .lean<LeadLeanDocument[]>()
    .exec();
}

export async function findLeadByIdForAdmin(id: string): Promise<LeadLeanDocument | null> {
  await ensureDbConnection();

  return LeadModel.findById(id).lean<LeadLeanDocument>().exec();
}

export async function updateLeadById(
  id: string,
  input: AdminLeadUpdateInput,
): Promise<LeadLeanDocument | null> {
  await ensureDbConnection();

  const $set: Record<string, unknown> = {};

  if (input.status !== undefined) {
    $set.status = input.status;
  }
  if (input.isRead !== undefined) {
    $set.isRead = input.isRead;
  }
  if (input.internalNotes !== undefined) {
    $set.internalNotes = input.internalNotes;
  }
  if (input.archivedAt !== undefined) {
    $set.archivedAt = input.archivedAt;
  }

  return LeadModel.findByIdAndUpdate(id, { $set }, { ...returnUpdatedDocument, runValidators: true })
    .lean<LeadLeanDocument>()
    .exec();
}
