import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminDbErrorState } from "@/components/admin/cms/AdminDbErrorState";
import { TreatmentEditor } from "@/components/admin/cms/treatments/TreatmentEditor";
import { loadCmsOrError } from "@/lib/admin/cms/load-cms-or-error";
import { loadTreatmentForAdmin } from "@/lib/admin/cms/loaders";
import { loadMediaPickerItemsForAdmin } from "@/lib/admin/media/loaders";
import { TREATMENT_SLUGS } from "@/lib/validation/admin-cms";

type AdminTreatmentEditPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: AdminTreatmentEditPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `עריכת טיפול: ${slug} | ניהול עוגן`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminTreatmentEditPage({
  params,
}: AdminTreatmentEditPageProps) {
  const { slug } = await params;

  if (!TREATMENT_SLUGS.includes(slug as (typeof TREATMENT_SLUGS)[number])) {
    notFound();
  }

  const [result, mediaResult] = await Promise.all([
    loadCmsOrError(() => loadTreatmentForAdmin(slug), "הטיפול לא נמצא"),
    loadCmsOrError(() => loadMediaPickerItemsForAdmin()),
  ]);

  if (!result.ok) {
    return <AdminDbErrorState message={result.message} />;
  }

  if (!mediaResult.ok) {
    return <AdminDbErrorState />;
  }

  return (
    <>
      <h1>עריכת טיפול</h1>
      <TreatmentEditor
        slug={slug}
        treatment={result.data.treatment}
        imagePreview={result.data.imagePreview}
        mediaAssets={mediaResult.data}
      />
    </>
  );
}
