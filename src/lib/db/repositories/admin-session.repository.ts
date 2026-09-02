import "server-only";

import { ensureDbConnection } from "@/lib/db/repositories/shared";
import { AdminSessionModel } from "@/lib/db/models/admin-session.model";
import {
  findActiveAdminUserById,
  type AdminUserLeanDocument,
} from "@/lib/db/repositories/admin-user.repository";

export type AdminSessionLeanDocument = {
  _id: { toString(): string };
  adminUserId: { toString(): string } | string;
  tokenHash: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AdminSessionWithAdmin = AdminSessionLeanDocument & {
  adminUser?: AdminUserLeanDocument | null;
};

export async function createAdminSession(input: {
  adminUserId: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<AdminSessionLeanDocument> {
  await ensureDbConnection();

  const doc = await AdminSessionModel.create({
    adminUserId: input.adminUserId,
    tokenHash: input.tokenHash,
    expiresAt: input.expiresAt,
  });

  const lean = doc.toObject();

  return {
    _id: lean._id,
    adminUserId: lean.adminUserId,
    tokenHash: lean.tokenHash,
    expiresAt: lean.expiresAt,
    createdAt: lean.createdAt,
    updatedAt: lean.updatedAt,
  };
}

export async function findValidSessionByTokenHash(
  tokenHash: string,
): Promise<AdminSessionWithAdmin | null> {
  await ensureDbConnection();

  const session = await AdminSessionModel.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  })
    .lean()
    .exec();

  if (!session) {
    return null;
  }

  const admin = await findActiveAdminUserById(session.adminUserId.toString());

  if (!admin) {
    return null;
  }

  return {
    _id: session._id,
    adminUserId: session.adminUserId,
    tokenHash: session.tokenHash,
    expiresAt: session.expiresAt,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    adminUser: admin,
  };
}

export async function deleteSessionByTokenHash(tokenHash: string): Promise<void> {
  await ensureDbConnection();

  await AdminSessionModel.deleteOne({ tokenHash }).exec();
}

export async function deleteSessionsByAdminUserId(
  adminUserId: string,
): Promise<void> {
  await ensureDbConnection();

  await AdminSessionModel.deleteMany({ adminUserId }).exec();
}
