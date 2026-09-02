import "server-only";

export type ContentSource = "static" | "db" | "db-with-fallback";

const VALID_CONTENT_SOURCES: ContentSource[] = [
  "static",
  "db",
  "db-with-fallback",
];

let cachedContentSource: ContentSource | undefined;

export function getContentSource(): ContentSource {
  if (cachedContentSource) {
    return cachedContentSource;
  }

  const raw = process.env.CONTENT_SOURCE?.trim();

  if (!raw) {
    cachedContentSource = "static";
    return cachedContentSource;
  }

  if (!VALID_CONTENT_SOURCES.includes(raw as ContentSource)) {
    throw new Error(
      `Invalid CONTENT_SOURCE "${raw}". Expected one of: ${VALID_CONTENT_SOURCES.join(", ")}`,
    );
  }

  cachedContentSource = raw as ContentSource;
  return cachedContentSource;
}

export function isStaticContentSource(): boolean {
  return getContentSource() === "static";
}

export function isDbContentSource(): boolean {
  const source = getContentSource();
  return source === "db" || source === "db-with-fallback";
}

export function isFallbackEnabled(): boolean {
  return getContentSource() === "db-with-fallback";
}

/** Reset cached source — for verification scripts only. */
export function resetContentSourceCacheForTests(): void {
  cachedContentSource = undefined;
}
