"use server";

import { withAdminAction } from "@/lib/admin/actions/with-admin-action";
import {
  ADMIN_CMS_SAVE_SUCCESS,
  ADMIN_CMS_GENERIC_ERROR,
} from "@/lib/admin/cms/errors";
import type { AdminCmsActionState } from "@/lib/admin/cms/action-state";
import { invalidateContent } from "@/lib/content/invalidate-content";
import { updateContentPageBySlug } from "@/lib/db/repositories/content-page.repository";
import { adminContentPageSaveSchema } from "@/lib/validation/admin-cms";

function parsePayload(raw: FormDataEntryValue | null): unknown {
  if (typeof raw !== "string" || !raw.trim()) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveContentPageAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminContentPageSaveSchema,
    handler: async ({ input }) => {
      await updateContentPageBySlug({
        slug: input.slug,
        content: input.content,
        seo: input.seo,
      });
      await invalidateContent({ domain: "content-page", slug: input.slug });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}
