import "server-only";

import { AdminCmsDbError } from "@/lib/admin/cms/errors";
import { findSiteSettingsForAdmin } from "@/lib/db/repositories/site-settings.repository";

export async function loadSiteSettingsForAdmin() {
  const doc = await findSiteSettingsForAdmin();

  if (!doc) {
    throw new AdminCmsDbError();
  }

  return doc;
}
