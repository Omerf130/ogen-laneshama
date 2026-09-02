import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder/AdminPlaceholder";

export const metadata: Metadata = {
  title: "עמוד טיפולים | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminPlaceholder
      title="עריכת עמוד הטיפולים"
      description="ניהול תוכן עמוד האינדקס של הטיפולים."
    />
  );
}
