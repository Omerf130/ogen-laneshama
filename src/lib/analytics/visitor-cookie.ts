import "server-only";

import { cookies } from "next/headers";

export const HOMEPAGE_VISITOR_COOKIE_NAME = "ogen_homepage_visitor";
export const HOMEPAGE_VISITOR_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

export function getVisitorCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/",
    maxAge: HOMEPAGE_VISITOR_MAX_AGE_SECONDS,
  };
}

export async function readVisitorCookieUuid(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const value = cookieStore.get(HOMEPAGE_VISITOR_COOKIE_NAME)?.value?.trim();

  return value || undefined;
}
