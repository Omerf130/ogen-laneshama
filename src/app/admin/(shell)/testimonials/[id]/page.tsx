import type { Metadata } from "next";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { TestimonialItemEditor } from "@/components/admin/cms/testimonials/TestimonialItemEditor";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadTestimonialForAdmin } from "@/lib/admin/cms/loaders";

type AdminTestimonialEditPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "עריכת המלצה | ניהול עוגן",
    robots: { index: false, follow: false },
  };
}

export default async function AdminTestimonialEditPage({
  params,
}: AdminTestimonialEditPageProps) {
  const { id } = await params;
  const result = await loadCmsOrError(
    () => loadTestimonialForAdmin(id),
    "ההמלצה לא נמצאה",
  );

  if (!result.ok) {
    return <AdminDbErrorState message={result.message} />;
  }

  return (
    <>
      <h1>עריכת המלצה</h1>
      <TestimonialItemEditor mode="edit" initialItem={result.data} />
    </>
  );
}
