import "server-only";

import { AdminCmsDbError } from "@/lib/admin/cms/errors";
import { findAllFaqItemsForAdmin } from "@/lib/db/repositories/faq-item.repository";

export async function loadFaqItemsForAdmin() {
  return findAllFaqItemsForAdmin();
}

export async function loadFaqItemForAdmin(id: string) {
  const items = await findAllFaqItemsForAdmin();
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    throw new AdminCmsDbError("השאלה לא נמצאה");
  }

  return item;
}
