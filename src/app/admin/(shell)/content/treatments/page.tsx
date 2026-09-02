import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { ContentPageEditor } from "@/components/admin/cms/content-pages/ContentPageEditor";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadContentPageForAdmin } from "@/lib/admin/cms/loaders";

export const metadata: Metadata = {
  title: "עמוד טיפולים | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminTreatmentsIndexContentPage() {
  const result = await loadCmsOrError(() => loadContentPageForAdmin("treatments"));

  if (!result.ok) {
    return <AdminDbErrorState />;
  }

  const page = result.data;

  return (
    <>
      <h1>עריכת עמוד טיפולים</h1>
      <ContentPageEditor
        slug="treatments"
        content={page.content as Record<string, unknown>}
        seo={page.seo}
      />
    </>
  );
}
