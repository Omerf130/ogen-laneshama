import type { ContentImageObjectPosition } from "@/types/content";

export const CENTER_OBJECT_POSITION: ContentImageObjectPosition = {
  x: 50,
  y: 50,
};

export function formatObjectPositionCss(
  position: ContentImageObjectPosition,
): string {
  return `${position.x}% ${position.y}%`;
}

export function getContentImagePositionStyle(
  objectPosition?: ContentImageObjectPosition | null,
): { objectPosition: string } | undefined {
  if (!objectPosition) {
    return undefined;
  }

  return {
    objectPosition: formatObjectPositionCss(objectPosition),
  };
}

export function resolvePreviewObjectPosition(
  objectPosition: ContentImageObjectPosition | undefined,
  previewDefault: ContentImageObjectPosition = CENTER_OBJECT_POSITION,
): ContentImageObjectPosition {
  return objectPosition ?? previewDefault;
}
