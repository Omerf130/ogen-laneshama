import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { MediaLibraryManager } from "@/components/admin/media/MediaLibraryManager";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadMediaAssetsForAdmin } from "@/lib/admin/media/loaders";

export const metadata: Metadata = {
  title: "מדיה | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const result = await loadCmsOrError(() => loadMediaAssetsForAdmin());

  if (!result.ok) {
    return <AdminDbErrorState />;
  }

  return (
    <>
      <h1>ספריית מדיה</h1>
      <MediaLibraryManager initialAssets={result.data} />
    </>
  );
}
