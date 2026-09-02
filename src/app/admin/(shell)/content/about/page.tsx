import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { ContentPageEditor } from "@/components/admin/cms/content-pages/ContentPageEditor";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadContentPageForAdmin } from "@/lib/admin/cms/loaders";

export const metadata: Metadata = {
  title: "אודות | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminAboutContentPage() {
  const result = await loadCmsOrError(() => loadContentPageForAdmin("about"));

  if (!result.ok) {
    return <AdminDbErrorState />;
  }

  const page = result.data;

  return (
    <>
      <h1>עריכת עמוד אודות</h1>
      <ContentPageEditor
        slug="about"
        content={page.content as Record<string, unknown>}
        seo={page.seo}
        imagePreview={page.imagePreview}
      />
    </>
  );
}
