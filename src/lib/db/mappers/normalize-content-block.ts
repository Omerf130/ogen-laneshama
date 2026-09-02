import type { ContentBlock } from "@/types/content";

export function normalizeContentBlock(block: ContentBlock): ContentBlock {
  const normalized: ContentBlock = {
    id: block.id,
    body: block.body,
  };

  if (block.title !== undefined) {
    normalized.title = block.title;
  }

  if (block.variant !== undefined && block.variant !== "default") {
    normalized.variant = block.variant;
  }

  return normalized;
}
