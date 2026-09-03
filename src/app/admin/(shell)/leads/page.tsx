import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { LeadsListManager } from "@/components/admin/leads/LeadsListManager";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadLeadsForAdmin } from "@/lib/admin/leads/loaders";

export const metadata: Metadata = {
  title: "פניות | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default async function AdminLeadsPage() {
  const result = await loadCmsOrError(() => loadLeadsForAdmin());

  if (!result.ok) {
    return <AdminDbErrorState />;
  }

  return (
    <>
      <h1>ניהול פניות</h1>
      <LeadsListManager initialLeads={result.data} />
    </>
  );
}
