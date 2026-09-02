import "server-only";

import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth/get-current-admin";
import { ADMIN_LOGIN_PATH } from "@/lib/admin/auth/constants";
import type { AdminIdentity } from "@/types/admin";

export async function requireAdmin(): Promise<AdminIdentity> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return admin;
}
