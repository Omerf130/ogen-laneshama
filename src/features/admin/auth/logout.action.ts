"use server";

import { redirect } from "next/navigation";
import { ADMIN_LOGIN_PATH } from "@/lib/admin/auth/constants";
import { revokeCurrentSession } from "@/lib/admin/auth/get-current-admin";

export async function logoutAction(): Promise<void> {
  await revokeCurrentSession();
  redirect(ADMIN_LOGIN_PATH);
}
