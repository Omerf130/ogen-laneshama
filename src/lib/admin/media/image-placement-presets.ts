import type { ContentImageObjectPosition } from "@/types/content";

export type ImagePlacementPresetKey =
  | "hero"
  | "pregnancySpotlight"
  | "portrait"
  | "contentPortrait";

export type ImagePlacementPreset = {
  aspectRatio: string;
  previewDefault: ContentImageObjectPosition;
};

export const IMAGE_PLACEMENT_PRESETS: Record<
  ImagePlacementPresetKey,
  ImagePlacementPreset
> = {
  hero: {
    aspectRatio: "16 / 10",
    previewDefault: { x: 28, y: 42 },
  },
  pregnancySpotlight: {
    aspectRatio: "16 / 10",
    previewDefault: { x: 22, y: 48 },
  },
  portrait: {
    aspectRatio: "4 / 5",
    previewDefault: { x: 50, y: 20 },
  },
  contentPortrait: {
    aspectRatio: "4 / 5",
    previewDefault: { x: 50, y: 50 },
  },
};

export function parseAspectRatio(aspectRatio: string): number {
  const [width, height] = aspectRatio.split("/").map((part) => Number(part.trim()));

  if (!width || !height) {
    return 1;
  }

  return width / height;
}

export function getAspectRatioMismatchHint(
  imageAspectRatio: number,
  containerAspectRatio: number,
): string | null {
  const relative = imageAspectRatio / containerAspectRatio;

  if (relative > 1.2) {
    return "התמונה רחבה מהאזור שבו היא תוצג. ניתן להתאים את המיקום.";
  }

  if (relative < 0.85) {
    return "התמונה גבוהה מהאזור שבו היא תוצג. ניתן להתאים את המיקום.";
  }

  return null;
}
