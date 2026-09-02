import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard/AdminDashboard";
import { requireAdmin } from "@/lib/admin/auth/require-admin";
import { getDashboardData } from "@/lib/admin/dashboard/get-dashboard-data";

export const metadata: Metadata = {
  title: "לוח בקרה | ניהול עוגן",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const [admin, data] = await Promise.all([requireAdmin(), getDashboardData()]);

  return <AdminDashboard admin={admin} data={data} />;
}
