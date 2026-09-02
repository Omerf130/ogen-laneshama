import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { TreatmentsListManager } from "@/components/admin/cms/treatments/TreatmentsListManager";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadTreatmentsForAdmin } from "@/lib/admin/cms/loaders";

export const metadata: Metadata = {
  title: "טיפולים | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminTreatmentsPage() {
  const result = await loadCmsOrError(() => loadTreatmentsForAdmin());

  if (!result.ok) {
    return <AdminDbErrorState />;
  }

  return (
    <>
      <h1>טיפולים</h1>
      <TreatmentsListManager initialItems={result.data} />
    </>
  );
}
