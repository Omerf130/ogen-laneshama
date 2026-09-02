import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder/AdminPlaceholder";

export const metadata: Metadata = {
  title: "המלצות | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminPlaceholder
      title="ניהול המלצות"
      description="הוספה, עריכה ופרסום המלצות לקוחות."
    />
  );
}
