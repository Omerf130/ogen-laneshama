import "server-only";

import {
  isDbContentSource,
  isFallbackEnabled,
  isStaticContentSource,
} from "@/lib/content/content-source";
import {
  classifyDbReadError,
  MissingRequiredContentError,
} from "@/lib/content/internal/db-errors";
import { logContentFallback } from "@/lib/content/internal/fallback-log";

export interface ReadContentOptions<T> {
  getter: string;
  domain: string;
  staticRead: () => T | Promise<T>;
  dbRead: () => Promise<T>;
  allowFallbackOnMissing?: boolean;
}

export async function readContent<T>(options: ReadContentOptions<T>): Promise<T> {
  const {
    getter,
    domain,
    staticRead,
    dbRead,
    allowFallbackOnMissing = false,
  } = options;

  if (isStaticContentSource()) {
    return staticRead();
  }

  try {
    return await dbRead();
  } catch (error) {
    const kind = classifyDbReadError(error);

    if (kind === "validation" || kind === "other") {
      throw error;
    }

    if (!isFallbackEnabled()) {
      throw error;
    }

    if (kind === "missing" && !allowFallbackOnMissing) {
      throw error;
    }

    logContentFallback({
      getter,
      domain,
      reason:
        kind === "missing" ? "missing_required_content" : "db_unavailable",
    });

    return staticRead();
  }
}

export async function readContentOptional<T>(
  options: ReadContentOptions<T | undefined>,
): Promise<T | undefined> {
  if (isStaticContentSource()) {
    return options.staticRead();
  }

  try {
    return await options.dbRead();
  } catch (error) {
    const kind = classifyDbReadError(error);

    if (kind === "validation" || kind === "other") {
      throw error;
    }

    if (!isFallbackEnabled()) {
      throw error;
    }

    if (kind === "missing") {
      return undefined;
    }

    logContentFallback({
      getter: options.getter,
      domain: options.domain,
      reason: "db_unavailable",
    });

    return options.staticRead();
  }
}

export function requireDocument<T>(
  doc: T | null | undefined,
  domain: string,
  key: string,
): T {
  if (doc == null) {
    throw new MissingRequiredContentError(domain, key);
  }

  return doc;
}

export { isDbContentSource, isStaticContentSource };
