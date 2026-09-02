import "server-only";

import { AdminCmsDbError } from "@/lib/admin/cms/errors";
import { serializeForClient } from "@/lib/admin/cms/serialize-for-client";

export type CmsLoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; message?: string };

export async function loadCmsOrError<T>(
  loader: () => Promise<T>,
  notFoundMessage?: string,
): Promise<CmsLoadResult<T>> {
  try {
    const data = await loader();

    return { ok: true, data: serializeForClient(data) };
  } catch (error) {
    if (error instanceof AdminCmsDbError) {
      return { ok: false, message: notFoundMessage ?? error.message };
    }

    throw error;
  }
}
