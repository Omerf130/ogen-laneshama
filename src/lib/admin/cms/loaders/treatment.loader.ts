import "server-only";

import { AdminCmsDbError } from "@/lib/admin/cms/errors";
import {
  findAllTreatmentsForAdmin,
  findTreatmentBySlugForAdmin,
} from "@/lib/db/repositories/treatment.repository";

export async function loadTreatmentsForAdmin() {
  const treatments = await findAllTreatmentsForAdmin();

  if (treatments.length === 0) {
    throw new AdminCmsDbError();
  }

  return treatments;
}

export async function loadTreatmentForAdmin(slug: string) {
  const treatment = await findTreatmentBySlugForAdmin(slug);

  if (!treatment) {
    throw new AdminCmsDbError("הטיפול לא נמצא");
  }

  const imagePreview = {
    src: treatment.image?.src ?? null,
    alt: treatment.image?.alt ?? treatment.title,
  };

  return {
    treatment,
    imagePreview,
  };
}
