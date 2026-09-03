import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { LeadDetailEditor } from "@/components/admin/leads/LeadDetailEditor";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadLeadForAdmin } from "@/lib/admin/leads/loaders";
import { markLeadReadIfUnread } from "@/lib/admin/leads/mark-lead-read";

type AdminLeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "פרטי פנייה | ניהול עוגן",
    robots: { index: false, follow: false },
  };
}

export default async function AdminLeadDetailPage({
  params,
}: AdminLeadDetailPageProps) {
  const { id } = await params;
  const result = await loadCmsOrError(
    () => loadLeadForAdmin(id),
    "הפנייה לא נמצאה",
  );

  if (!result.ok) {
    return <AdminDbErrorState message={result.message} />;
  }

  await markLeadReadIfUnread(result.data.id, result.data.isRead);

  return (
    <>
      <h1>פרטי פנייה</h1>
      <LeadDetailEditor initialLead={result.data} />
    </>
  );
}
