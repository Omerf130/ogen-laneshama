import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder/AdminPlaceholder";

export const metadata: Metadata = {
  title: "הריון ואימהות | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminPlaceholder
      title="עריכת עמוד הריון ואימהות"
      description="ניהול תוכן עמוד ההריון והאימהות."
    />
  );
}
