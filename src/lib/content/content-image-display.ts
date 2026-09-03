import type { ContentImageFitMode } from "@/types/content";

export const DEFAULT_CONTENT_IMAGE_FIT_MODE: ContentImageFitMode = "cover";

export function resolveContentImageFitMode(
  fitMode?: ContentImageFitMode | null,
): ContentImageFitMode {
  return fitMode ?? DEFAULT_CONTENT_IMAGE_FIT_MODE;
}

export const CONTENT_IMAGE_FIT_MODE_LABELS: Record<
  ContentImageFitMode,
  { label: string; helper: string }
> = {
  cover: {
    label: "מילוי המסגרת",
    helper: "התמונה תמלא את כל האזור. ייתכן שחלקים ממנה ייחתכו.",
  },
  contain: {
    label: "הצגת התמונה במלואה",
    helper: "כל התמונה תישאר גלויה בתוך האזור, ללא עיוות.",
  },
};
