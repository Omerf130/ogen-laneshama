import "server-only";

import { ensureDbConnection, returnUpdatedDocument } from "@/lib/db/repositories/shared";
import { AdminLoginRateLimitModel } from "@/lib/db/models/admin-login-rate-limit.model";
import {
  LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
  LOGIN_RATE_LIMIT_WINDOW_MS,
} from "@/lib/admin/auth/constants";
import { hashRateLimitKey } from "@/lib/admin/auth/session-token";

export function buildLoginRateLimitKeyHash(email: string): string {
  return hashRateLimitKey(email.trim().toLowerCase());
}

export async function isLoginRateLimited(keyHash: string): Promise<boolean> {
  await ensureDbConnection();

  const doc = await AdminLoginRateLimitModel.findOne({ keyHash }).lean().exec();

  if (!doc) {
    return false;
  }

  return doc.attempts >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS;
}

export async function recordFailedLoginAttempt(keyHash: string): Promise<void> {
  await ensureDbConnection();

  const now = new Date();
  const expiresAt = new Date(now.getTime() + LOGIN_RATE_LIMIT_WINDOW_MS);

  await AdminLoginRateLimitModel.findOneAndUpdate(
    { keyHash },
    {
      $setOnInsert: {
        keyHash,
        windowStart: now,
      },
      $set: {
        expiresAt,
      },
      $inc: {
        attempts: 1,
      },
    },
    { upsert: true, ...returnUpdatedDocument },
  ).exec();
}

export async function clearLoginRateLimit(keyHash: string): Promise<void> {
  await ensureDbConnection();

  await AdminLoginRateLimitModel.deleteOne({ keyHash }).exec();
}
