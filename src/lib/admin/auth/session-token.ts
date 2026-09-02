import "server-only";

import { createHash, randomBytes } from "node:crypto";

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function hashRateLimitKey(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
