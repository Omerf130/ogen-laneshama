import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { HomepageEditor } from "@/components/admin/cms/homepage/HomepageEditor";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadHomepageForAdmin } from "@/lib/admin/cms/loaders";
import { loadMediaPickerItemsForAdmin } from "@/lib/admin/media/loaders";

export const metadata: Metadata = {
  title: "דף הבית | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminHomepageContentPage() {
  const [result, mediaResult] = await Promise.all([
    loadCmsOrError(() => loadHomepageForAdmin()),
    loadCmsOrError(() => loadMediaPickerItemsForAdmin()),
  ]);

  if (!result.ok || !mediaResult.ok) {
    return <AdminDbErrorState />;
  }

  return (
    <>
      <h1>עריכת דף הבית</h1>
      <HomepageEditor initialData={result.data} mediaAssets={mediaResult.data} />
    </>
  );
}
