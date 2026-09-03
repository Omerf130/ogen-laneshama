import "server-only";

import { createHash } from "node:crypto";

export function hashVisitorCookieUuid(cookieUuid: string): string {
  return createHash("sha256").update(cookieUuid, "utf8").digest("hex");
}
