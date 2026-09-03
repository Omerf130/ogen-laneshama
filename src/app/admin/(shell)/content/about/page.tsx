import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { ContentPageEditor } from "@/components/admin/cms/content-pages/ContentPageEditor";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadContentPageForAdmin } from "@/lib/admin/cms/loaders";
import { loadMediaPickerItemsForAdmin } from "@/lib/admin/media/loaders";

export const metadata: Metadata = {
  title: "אודות | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminAboutContentPage() {
  const [result, mediaResult] = await Promise.all([
    loadCmsOrError(() => loadContentPageForAdmin("about")),
    loadCmsOrError(() => loadMediaPickerItemsForAdmin()),
  ]);

  if (!result.ok || !mediaResult.ok) {
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
        mediaAssets={mediaResult.data}
      />
    </>
  );
}
