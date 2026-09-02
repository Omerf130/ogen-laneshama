import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder/AdminPlaceholder";

export const metadata: Metadata = {
  title: "הגדרות | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminPlaceholder
      title="הגדרות האתר"
      description="ניהול הגדרות כלליות, ניווט ופרטי קשר."
    />
  );
}
