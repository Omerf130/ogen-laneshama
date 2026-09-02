export type { AdminIdentity } from "@/lib/validation/admin-auth";

export type AdminActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };
