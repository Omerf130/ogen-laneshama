import "server-only";

import { AdminCmsDbError } from "@/lib/admin/cms/errors";
import { findAllTestimonialsForAdmin } from "@/lib/db/repositories/testimonial.repository";

export async function loadTestimonialsForAdmin() {
  return findAllTestimonialsForAdmin();
}

export async function loadTestimonialForAdmin(mongoId: string) {
  const items = await findAllTestimonialsForAdmin();
  const item = items.find((entry) => String(entry._id) === mongoId);

  if (!item) {
    throw new AdminCmsDbError("ההמלצה לא נמצאה");
  }

  return item;
}
