"use server";

import { del } from "@vercel/blob";
import { withAdminAction } from "@/lib/admin/actions/with-admin-action";
import {
  adminMediaCreateFromBlobSchema,
  adminMediaDeleteSchema,
  adminMediaUpdateAltSchema,
  VERCEL_BLOB_PROVIDER,
} from "@/lib/validation/admin-phase7";
import {
  createMediaAsset,
  deleteMediaAssetById,
  findMediaAssetById,
  updateMediaAssetAlt,
} from "@/lib/db/repositories/media-asset.repository";
import {
  findMediaAssetReferences,
  isLocalProvider,
} from "@/lib/admin/media/find-media-references";
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

export async function registerMediaAssetAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminMediaCreateFromBlobSchema,
    handler: async ({ input }) => {
      const created = await createMediaAsset({
        originalFilename: input.originalFilename,
        filename: input.filename,
        alt: input.alt,
        mimeType: input.mimeType,
        provider: VERCEL_BLOB_PROVIDER,
        providerKey: input.providerKey,
        url: input.url,
      });

      return {
        mediaId: String(created._id),
        url: created.url,
        alt: created.alt,
        filename: created.filename,
        provider: created.provider,
      };
    },
  });

  return result.ok
    ? {
        success: ADMIN_CMS_SAVE_SUCCESS,
        data: result.data,
      }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function updateMediaAltAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminMediaUpdateAltSchema,
    handler: async ({ input }) => {
      const updated = await updateMediaAssetAlt(input.mediaId, input.alt);
      if (!updated) {
        throw new Error("MediaAsset not found");
      }
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}

export async function deleteMediaAssetAction(
  _prev: AdminCmsActionState,
  formData: FormData,
): Promise<AdminCmsActionState> {
  const payload = parsePayload(formData.get("payload"));
  const result = await withAdminAction(payload, {
    schema: adminMediaDeleteSchema,
    handler: async ({ input }) => {
      const asset = await findMediaAssetById(input.mediaId);

      if (!asset) {
        throw new Error("MediaAsset not found");
      }

      if (isLocalProvider(asset.provider)) {
        throw new Error("Local media cannot be deleted");
      }

      const references = await findMediaAssetReferences({
        mediaId: String(asset._id),
        url: asset.url,
      });

      if (references.length > 0) {
        throw new Error(
          `התמונה בשימוש: ${references.map((ref) => ref.label).join(", ")}`,
        );
      }

      if (asset.provider === VERCEL_BLOB_PROVIDER) {
        await del(asset.url);
      }

      const deleted = await deleteMediaAssetById(input.mediaId);
      if (!deleted) {
        throw new Error("MediaAsset not found");
      }
    },
  });

  return result.ok
    ? { success: ADMIN_CMS_SAVE_SUCCESS }
    : { error: result.error ?? ADMIN_CMS_GENERIC_ERROR };
}
