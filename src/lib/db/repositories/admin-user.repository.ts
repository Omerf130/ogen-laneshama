import "server-only";

import { ensureDbConnection } from "@/lib/db/repositories/shared";
import { AdminUserModel } from "@/lib/db/models/admin-user.model";
import { normalizeAdminEmail } from "@/lib/admin/auth/constants";

export type AdminUserLeanDocument = {
  _id: { toString(): string };
  email: string;
  passwordHash?: string;
  name?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function findAdminUserByEmailWithPassword(
  email: string,
): Promise<AdminUserLeanDocument | null> {
  await ensureDbConnection();

  return AdminUserModel.findOne({ email: normalizeAdminEmail(email) })
    .select("+passwordHash")
    .lean()
    .exec();
}

export async function findAdminUserByEmail(
  email: string,
): Promise<AdminUserLeanDocument | null> {
  await ensureDbConnection();

  return AdminUserModel.findOne({ email: normalizeAdminEmail(email) })
    .lean()
    .exec();
}

export async function findActiveAdminUserById(
  id: string,
): Promise<AdminUserLeanDocument | null> {
  await ensureDbConnection();

  return AdminUserModel.findOne({ _id: id, isActive: true }).lean().exec();
}

export async function createAdminUser(input: {
  email: string;
  passwordHash: string;
  name?: string;
  isActive?: boolean;
}): Promise<AdminUserLeanDocument> {
  await ensureDbConnection();

  const doc = await AdminUserModel.create({
    email: normalizeAdminEmail(input.email),
    passwordHash: input.passwordHash,
    ...(input.name ? { name: input.name.trim() } : {}),
    isActive: input.isActive ?? true,
  });

  const lean = doc.toObject();

  return {
    _id: lean._id,
    email: lean.email,
    name: lean.name,
    isActive: lean.isActive,
    lastLoginAt: lean.lastLoginAt,
    createdAt: lean.createdAt,
    updatedAt: lean.updatedAt,
  };
}

export async function updateAdminLastLoginAt(id: string): Promise<void> {
  await ensureDbConnection();

  await AdminUserModel.updateOne({ _id: id }, { $set: { lastLoginAt: new Date() } }).exec();
}
