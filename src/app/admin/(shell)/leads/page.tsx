import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder/AdminPlaceholder";

export const metadata: Metadata = {
  title: "פניות | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminPlaceholder
      title="ניהול פניות"
      description="צפייה וטיפול בפניות מהאתר."
    />
  );
}
