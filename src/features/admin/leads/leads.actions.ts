"use server";

import { withAdminAction } from "@/lib/admin/actions/with-admin-action";
import {
  adminLeadArchiveActionSchema,
  adminLeadUpdateActionSchema,
} from "@/lib/validation/admin-phase7";
import {
  findLeadByIdForAdmin,
  updateLeadById,
} from "@/lib/db/repositories/lead.repository";
import type { AdminCmsActionState } from "@/lib/admin/cms/action-state";
import { ADMIN_CMS_GENERIC_ERROR, ADMIN_CMS_SAVE_SUCCESS } from "@/lib/admin/cms/errors";

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

export async function updateLeadAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminLeadUpdateActionSchema,
    handler: async ({ input }) => {
      const updated = await updateLeadById(input.leadId, {
        status: input.status,
        isRead: input.isRead,
        internalNotes: input.internalNotes,
      });

      if (!updated) {
        throw new Error("Lead not found");
      }
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function archiveLeadAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminLeadArchiveActionSchema,
    handler: async ({ input }) => {
      const updated = await updateLeadById(input.leadId, {
        status: "ARCHIVED",
        archivedAt: new Date(),
      });

      if (!updated) {
        throw new Error("Lead not found");
      }
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function markLeadReadAction(leadId: string): Promise<void> {
  await updateLeadById(leadId, { isRead: true });
}

export async function loadLeadForAdminAction(leadId: string) {
  return findLeadByIdForAdmin(leadId);
}
