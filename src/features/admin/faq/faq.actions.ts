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
  createFaqItem,
  deleteFaqItemById,
  setFaqItemPublished,
  updateFaqItemById,
  updateFaqItemSortOrders,
} from "@/lib/db/repositories/faq-item.repository";
import {
  adminFaqCreateSchema,
  adminFaqDeleteSchema,
  adminFaqReorderSchema,
  adminFaqTogglePublishSchema,
  adminFaqUpdateSchema,
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

export async function createFaqItemAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminFaqCreateSchema,
    handler: async ({ input }) => {
      await createFaqItem(input);
      await invalidateContent({ domain: "faq" });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function updateFaqItemAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminFaqUpdateSchema,
    handler: async ({ input }) => {
      const updated = await updateFaqItemById(input.id, {
        question: input.question,
        answer: input.answer,
        isPublished: input.isPublished,
      });

      if (!updated) {
        throw new Error("FAQ not found");
      }

      await invalidateContent({ domain: "faq" });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function deleteFaqItemAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminFaqDeleteSchema,
    handler: async ({ input }) => {
      const deleted = await deleteFaqItemById(input.id);

      if (!deleted) {
        throw new Error("FAQ not found");
      }

      await invalidateContent({ domain: "faq" });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function reorderFaqItemsAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminFaqReorderSchema,
    handler: async ({ input }) => {
      const updates = buildSortOrderUpdates(input.orderedIds).map(({ key, sortOrder }) => ({
        id: key,
        sortOrder,
      }));
      await updateFaqItemSortOrders(updates);
      await invalidateContent({ domain: "faq" });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function toggleFaqPublishAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminFaqTogglePublishSchema,
    handler: async ({ input }) => {
      const updated = await setFaqItemPublished(input.id, input.isPublished);

      if (!updated) {
        throw new Error("FAQ not found");
      }

      await invalidateContent({ domain: "faq" });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}
