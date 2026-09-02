"use server";

import { withAdminAction } from "@/lib/admin/actions/with-admin-action";
import {
  ADMIN_CMS_SAVE_SUCCESS,
  ADMIN_CMS_GENERIC_ERROR,
} from "@/lib/admin/cms/errors";
import type { AdminCmsActionState } from "@/lib/admin/cms/action-state";
import { buildSortOrderUpdates } from "@/lib/admin/cms/reorder";
import { invalidateContent } from "@/lib/content/invalidate-content";
import {
  setTreatmentActive,
  updateTreatmentBySlug,
  updateTreatmentSortOrders,
} from "@/lib/db/repositories/treatment.repository";
import {
  adminTreatmentActiveSchema,
  adminTreatmentReorderSchema,
  adminTreatmentSaveSchema,
} from "@/lib/validation/admin-cms";

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

export async function saveTreatmentAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminTreatmentSaveSchema,
    handler: async ({ input }) => {
      await updateTreatmentBySlug(input.slug, input.treatment);
      await invalidateContent({ domain: "treatment", slug: input.slug });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function setTreatmentActiveAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminTreatmentActiveSchema,
    handler: async ({ input }) => {
      await setTreatmentActive(input.slug, input.isActive);
      await invalidateContent({ domain: "treatment", slug: input.slug });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function reorderTreatmentsAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminTreatmentReorderSchema,
    handler: async ({ input }) => {
      const updates = buildSortOrderUpdates(input.orderedSlugs).map(({ key, sortOrder }) => ({
        slug: key,
        sortOrder,
      }));
      await updateTreatmentSortOrders(updates);

      for (const slug of input.orderedSlugs) {
        await invalidateContent({ domain: "treatment", slug });
      }
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}
