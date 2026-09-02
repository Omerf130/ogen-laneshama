import "server-only";

import { unstable_cache } from "next/cache";
import { isDbContentSource } from "@/lib/content/content-source";

function shouldUseDataCache(): boolean {
  return (
    isDbContentSource() &&
    (process.env.NEXT_RUNTIME === "nodejs" ||
      process.env.NEXT_RUNTIME === "edge")
  );
}

export function cachedDbRead<T>(
  keyParts: string[],
  tags: string[],
  readFn: () => Promise<T>,
): Promise<T> {
  if (!shouldUseDataCache()) {
    return readFn();
  }

  return unstable_cache(readFn, keyParts, {
    tags,
    revalidate: false,
  })();
}
