import "server-only";

import { Types } from "mongoose";

const OBJECT_ID_FIELD_NAMES = new Set([
  "_id",
  "mediaId",
  "ogImageMediaId",
  "logoMediaId",
]);

function normalizeObjectId(value: unknown): string | undefined {
  if (value == null) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return new Types.ObjectId(value as Types.ObjectId).toString();
  } catch {
    return undefined;
  }
}

function serializeValue(value: unknown, key?: string): unknown {
  if (value == null) {
    return value;
  }

  if (key && OBJECT_ID_FIELD_NAMES.has(key)) {
    return normalizeObjectId(value);
  }

  if (value instanceof Types.ObjectId) {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item));
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const [entryKey, entryValue] of Object.entries(record)) {
      result[entryKey] = serializeValue(entryValue, entryKey);
    }

    return result;
  }

  return value;
}

export function serializeForClient<T>(value: T): T {
  return serializeValue(value) as T;
}
