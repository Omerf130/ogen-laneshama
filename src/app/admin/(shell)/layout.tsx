import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell/AdminShell";
import { requireAdmin } from "@/lib/admin/auth/require-admin";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminShellLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
