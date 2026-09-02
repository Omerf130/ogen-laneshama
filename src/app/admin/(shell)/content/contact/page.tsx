import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { ContentPageEditor } from "@/components/admin/cms/content-pages/ContentPageEditor";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadContentPageForAdmin } from "@/lib/admin/cms/loaders";

export const metadata: Metadata = {
  title: "יצירת קשר | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminContactContentPage() {
  const result = await loadCmsOrError(() => loadContentPageForAdmin("contact"));

  if (!result.ok) {
    return <AdminDbErrorState />;
  }

  const page = result.data;

  return (
    <>
      <h1>עריכת עמוד יצירת קשר</h1>
      <ContentPageEditor
        slug="contact"
        content={page.content as Record<string, unknown>}
        seo={page.seo}
      />
    </>
  );
}
