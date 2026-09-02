import "server-only";

import bcrypt from "bcryptjs";
import { BCRYPT_COST_FACTOR } from "@/lib/admin/auth/constants";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST_FACTOR);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
