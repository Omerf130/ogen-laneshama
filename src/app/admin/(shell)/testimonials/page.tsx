import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { TestimonialsListManager } from "@/components/admin/cms/testimonials/TestimonialsListManager";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadTestimonialsForAdmin } from "@/lib/admin/cms/loaders";

export const metadata: Metadata = {
  title: "המלצות | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminTestimonialsPage() {
  const result = await loadCmsOrError(() => loadTestimonialsForAdmin());

  if (!result.ok) {
    return <AdminDbErrorState />;
  }

  return (
    <>
      <h1>המלצות</h1>
      <TestimonialsListManager initialItems={result.data} />
    </>
  );
}
