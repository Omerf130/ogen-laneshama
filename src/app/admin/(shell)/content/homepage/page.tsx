import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder/AdminPlaceholder";

export const metadata: Metadata = {
  title: "דף הבית | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default function AdminHomepageContentPage() {
  return (
    <AdminPlaceholder
      title="עריכת דף הבית"
      description="ניהול תוכן דף הבית — גיבור, הכרות, טיפולים ועוד."
    />
  );
}
