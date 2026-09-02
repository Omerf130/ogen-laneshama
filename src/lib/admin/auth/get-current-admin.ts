import "server-only";

import { findValidSessionByTokenHash } from "@/lib/db/repositories/admin-session.repository";
import { toAdminIdentity } from "@/lib/admin/auth/identity";
import {
  clearSessionCookie,
  getSessionTokenFromCookies,
} from "@/lib/admin/auth/cookies";
import { hashSessionToken } from "@/lib/admin/auth/session-token";
import type { AdminIdentity } from "@/types/admin";

export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  const token = await getSessionTokenFromCookies();

  if (!token) {
    return null;
  }

  const session = await findValidSessionByTokenHash(hashSessionToken(token));

  if (!session?.adminUser || !session.adminUser.isActive) {
    return null;
  }

  return toAdminIdentity(session.adminUser);
}

export async function revokeCurrentSession(): Promise<void> {
  const token = await getSessionTokenFromCookies();

  if (token) {
    const { deleteSessionByTokenHash } = await import(
      "@/lib/db/repositories/admin-session.repository"
    );
    await deleteSessionByTokenHash(hashSessionToken(token));
  }

  await clearSessionCookie();
}
