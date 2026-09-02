import "server-only";

import type { AdminUserLeanDocument } from "@/lib/db/repositories/admin-user.repository";
import { adminIdentitySchema } from "@/lib/validation/admin-auth";
import type { AdminIdentity } from "@/types/admin";

export function toAdminIdentity(admin: AdminUserLeanDocument): AdminIdentity {
  return adminIdentitySchema.parse({
    id: admin._id.toString(),
    email: admin.email,
    ...(admin.name ? { name: admin.name } : {}),
  });
}
