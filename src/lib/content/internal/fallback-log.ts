export type ContentFallbackReason = "db_unavailable" | "missing_required_content";

export interface ContentFallbackLogEntry {
  event: "content_fallback";
  getter: string;
  domain: string;
  reason: ContentFallbackReason;
}

export function logContentFallback(entry: Omit<ContentFallbackLogEntry, "event">): void {
  const payload: ContentFallbackLogEntry = {
    event: "content_fallback",
    ...entry,
  };

  console.warn(JSON.stringify(payload));
}
