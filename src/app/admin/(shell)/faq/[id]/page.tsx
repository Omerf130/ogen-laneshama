import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { FaqItemEditor } from "@/components/admin/cms/faq/FaqItemEditor";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadFaqItemForAdmin } from "@/lib/admin/cms/loaders";

type AdminFaqEditPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "עריכת שאלה | ניהול עוגן",
    robots: { index: false, follow: false },
  };
}

export default async function AdminFaqEditPage({ params }: AdminFaqEditPageProps) {
  const { id } = await params;
  const result = await loadCmsOrError(
    () => loadFaqItemForAdmin(id),
    "השאלה לא נמצאה",
  );

  if (!result.ok) {
    return <AdminDbErrorState message={result.message} />;
  }

  return (
    <>
      <h1>עריכת שאלה</h1>
      <FaqItemEditor mode="edit" initialItem={result.data} />
    </>
  );
}
