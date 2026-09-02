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
  createTestimonial,
  deleteTestimonialById,
  setTestimonialPublished,
  updateTestimonialById,
  updateTestimonialSortOrders,
} from "@/lib/db/repositories/testimonial.repository";
import {
  adminTestimonialCreateSchema,
  adminTestimonialDeleteSchema,
  adminTestimonialReorderSchema,
  adminTestimonialTogglePublishSchema,
  adminTestimonialUpdateSchema,
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

export async function createTestimonialAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminTestimonialCreateSchema,
    handler: async ({ input }) => {
      await createTestimonial(input);
      await invalidateContent({ domain: "testimonials" });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function updateTestimonialAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminTestimonialUpdateSchema,
    handler: async ({ input }) => {
      const updated = await updateTestimonialById(input.mongoId, {
        quote: input.quote,
        name: input.name,
        context: input.context,
        isPublished: input.isPublished,
      });

      if (!updated) {
        throw new Error("Testimonial not found");
      }

      await invalidateContent({ domain: "testimonials" });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function deleteTestimonialAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminTestimonialDeleteSchema,
    handler: async ({ input }) => {
      const deleted = await deleteTestimonialById(input.mongoId);

      if (!deleted) {
        throw new Error("Testimonial not found");
      }

      await invalidateContent({ domain: "testimonials" });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function reorderTestimonialsAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminTestimonialReorderSchema,
    handler: async ({ input }) => {
      const updates = buildSortOrderUpdates(input.orderedMongoIds).map(
        ({ key, sortOrder }) => ({
          mongoId: key,
          sortOrder,
        }),
      );
      await updateTestimonialSortOrders(updates);
      await invalidateContent({ domain: "testimonials" });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function toggleTestimonialPublishAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminTestimonialTogglePublishSchema,
    handler: async ({ input }) => {
      const updated = await setTestimonialPublished(input.mongoId, input.isPublished);

      if (!updated) {
        throw new Error("Testimonial not found");
      }

      await invalidateContent({ domain: "testimonials" });
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}
