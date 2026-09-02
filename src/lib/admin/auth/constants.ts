import "server-only";

export const ADMIN_SESSION_COOKIE_NAME = "ogen_admin_session";

export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export const ADMIN_PASSWORD_MIN_LENGTH = 12;

export const BCRYPT_COST_FACTOR = 12;

export const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 5;

export const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export const ADMIN_LOGIN_PATH = "/admin/login";

export const ADMIN_DASHBOARD_PATH = "/admin";

export const AUTH_INVALID_CREDENTIALS_MESSAGE =
  "פרטי ההתחברות אינם נכונים";

export const AUTH_UNAVAILABLE_MESSAGE =
  "לא ניתן להתחבר כרגע. נסו שוב מאוחר יותר";

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}
