import "server-only";

import type { ZodType } from "zod";
import { requireAdmin } from "@/lib/admin/auth/require-admin";
import type { AdminActionResult, AdminIdentity } from "@/types/admin";

type WithAdminActionOptions<TInput, TOutput> = {
  schema: ZodType<TInput>;
  handler: (input: {
    admin: AdminIdentity;
    input: TInput;
  }) => Promise<TOutput>;
};

export async function withAdminAction<TInput, TOutput>(
  rawInput: unknown,
  options: WithAdminActionOptions<TInput, TOutput>,
): Promise<AdminActionResult<TOutput>> {
  try {
    const admin = await requireAdmin();
    const parsed = options.schema.safeParse(rawInput);

    if (!parsed.success) {
      return {
        ok: false,
        error: "הנתונים שהוזנו אינם תקינים",
      };
    }

    const data = await options.handler({
      admin,
      input: parsed.data,
    });

    return data === undefined ? { ok: true } : { ok: true, data };
  } catch {
    return {
      ok: false,
      error: "לא ניתן לבצע את הפעולה כרגע. נסו שוב מאוחר יותר",
    };
  }
}
