import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { HomepageEditor } from "@/components/admin/cms/homepage/HomepageEditor";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadHomepageForAdmin } from "@/lib/admin/cms/loaders";

export const metadata: Metadata = {
  title: "דף הבית | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminHomepageContentPage() {
  const result = await loadCmsOrError(() => loadHomepageForAdmin());

  if (!result.ok) {
    return <AdminDbErrorState />;
  }

  return (
    <>
      <h1>עריכת דף הבית</h1>
      <HomepageEditor initialData={result.data} />
    </>
  );
}
