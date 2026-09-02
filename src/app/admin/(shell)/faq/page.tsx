import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { FaqListManager } from "@/components/admin/cms/faq/FaqListManager";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadFaqItemsForAdmin } from "@/lib/admin/cms/loaders";

export const metadata: Metadata = {
  title: "שאלות נפוצות | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminFaqPage() {
  const result = await loadCmsOrError(() => loadFaqItemsForAdmin());

  if (!result.ok) {
    return <AdminDbErrorState />;
  }

  return (
    <>
      <h1>שאלות נפוצות</h1>
      <FaqListManager initialItems={result.data} />
    </>
  );
}
