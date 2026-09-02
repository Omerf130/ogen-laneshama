"use server";

import { redirect } from "next/navigation";
import { adminLoginSchema } from "@/lib/validation/admin-auth";
import {
  AUTH_INVALID_CREDENTIALS_MESSAGE,
  AUTH_UNAVAILABLE_MESSAGE,
  ADMIN_DASHBOARD_PATH,
  normalizeAdminEmail,
} from "@/lib/admin/auth/constants";
import { verifyPassword } from "@/lib/admin/auth/password";
import {
  generateSessionToken,
  hashSessionToken,
} from "@/lib/admin/auth/session-token";
import {
  getSessionExpiryDate,
  setSessionCookie,
} from "@/lib/admin/auth/cookies";
import { findAdminUserByEmailWithPassword } from "@/lib/db/repositories/admin-user.repository";
import { createAdminSession } from "@/lib/db/repositories/admin-session.repository";
import { updateAdminLastLoginAt } from "@/lib/db/repositories/admin-user.repository";
import {
  buildLoginRateLimitKeyHash,
  clearLoginRateLimit,
  isLoginRateLimited,
  recordFailedLoginAttempt,
} from "@/lib/db/repositories/admin-login-rate-limit.repository";
import {
  InvalidCredentialsError,
  RateLimitExceededError,
} from "@/lib/admin/auth/errors";

export type LoginActionState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: AUTH_INVALID_CREDENTIALS_MESSAGE };
  }

  const email = normalizeAdminEmail(parsed.data.email);
  const keyHash = buildLoginRateLimitKeyHash(email);

  try {
    if (await isLoginRateLimited(keyHash)) {
      throw new RateLimitExceededError();
    }

    const admin = await findAdminUserByEmailWithPassword(email);

    if (!admin?.passwordHash || !admin.isActive) {
      await recordFailedLoginAttempt(keyHash);
      throw new InvalidCredentialsError();
    }

    const valid = await verifyPassword(parsed.data.password, admin.passwordHash);

    if (!valid) {
      await recordFailedLoginAttempt(keyHash);
      throw new InvalidCredentialsError();
    }

    const sessionToken = generateSessionToken();
    const tokenHash = hashSessionToken(sessionToken);

    await createAdminSession({
      adminUserId: admin._id.toString(),
      tokenHash,
      expiresAt: getSessionExpiryDate(),
    });

    await updateAdminLastLoginAt(admin._id.toString());
    await clearLoginRateLimit(keyHash);
    await setSessionCookie(sessionToken);
  } catch (error) {
    if (
      error instanceof InvalidCredentialsError ||
      error instanceof RateLimitExceededError
    ) {
      return { error: AUTH_INVALID_CREDENTIALS_MESSAGE };
    }

    return { error: AUTH_UNAVAILABLE_MESSAGE };
  }

  redirect(ADMIN_DASHBOARD_PATH);
}
