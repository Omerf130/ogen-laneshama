import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { SiteSettingsEditor } from "@/components/admin/cms/settings/SiteSettingsEditor";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadSiteSettingsForAdmin } from "@/lib/admin/cms/loaders";

export const metadata: Metadata = {
  title: "הגדרות | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const result = await loadCmsOrError(() => loadSiteSettingsForAdmin());

  if (!result.ok) {
    return <AdminDbErrorState />;
  }

  return (
    <>
      <h1>הגדרות האתר</h1>
      <SiteSettingsEditor initialDoc={result.data} />
    </>
  );
}
